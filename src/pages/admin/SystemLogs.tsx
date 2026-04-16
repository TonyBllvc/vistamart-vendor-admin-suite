import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  AlertTriangle,
  AlertCircle,
  Info,
  XCircle,
  CheckCircle2,
  Copy,
  CalendarIcon,
  Filter,
  ChevronDown,
  Clock,
  User,
  Tag,
  FileText,
  RefreshCw,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type Severity = "critical" | "error" | "warning" | "info";
type LogCategory = "email" | "celery" | "payment" | "invite" | "wallet" | "auth" | "storage" | "webhook";

interface SystemLog {
  id: string;
  severity: Severity;
  category: LogCategory;
  title: string;
  detail: string;
  admin_email: string | null;
  related_account: string | null;
  context: Record<string, unknown>;
  resolved: boolean;
  createdAt: string;
}

const mockLogs: SystemLog[] = [
  {
    id: "log-001",
    severity: "critical",
    category: "payment",
    title: "Stripe webhook signature verification failed",
    detail: `stripe.error.SignatureVerificationError: No signatures found matching the expected signature for payload.\n\nTraceback (most recent call last):\n  File "/app/payments/webhooks.py", line 42, in handle_webhook\n    event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)\n  File "/env/lib/python3.11/site-packages/stripe/webhook.py", line 121, in construct_event\n    WebhookSignature.verify_header(payload, sig_header, secret, tolerance)\nstripe.error.SignatureVerificationError: No signatures found matching the expected signature`,
    admin_email: null,
    related_account: null,
    context: { webhook_id: "whevt_1PqR3s2eZvKYlo2C", endpoint: "/api/webhooks/stripe/", http_status: 400, ip_address: "54.187.174.169" },
    resolved: false,
    createdAt: "2026-04-16T08:12:00Z",
  },
  {
    id: "log-002",
    severity: "critical",
    category: "celery",
    title: "Celery worker OOM killed during bulk email dispatch",
    detail: `celery.exceptions.WorkerLostError: Worker exited prematurely: signal 9 (SIGKILL) Job: 3f8a91.\n\nTraceback:\n  File "/app/tasks/email_dispatch.py", line 88, in send_bulk_promotional\n    for chunk in batch_users(queryset, size=5000):\n  File "/app/utils/batching.py", line 14, in batch_users\n    users = list(qs[:size])\nMemoryError`,
    admin_email: "admin@vistamart.com",
    related_account: null,
    context: { task_id: "3f8a91c2-44ab-4e7f-b9c1-8e2d3f4a5b6c", queue: "email_high", memory_limit_mb: 512, recipients_count: 48200 },
    resolved: false,
    createdAt: "2026-04-16T07:45:00Z",
  },
  {
    id: "log-003",
    severity: "error",
    category: "email",
    title: "SMTP connection refused — order confirmation not sent",
    detail: `smtplib.SMTPConnectError: (111, 'Connection refused')\n\nFailed to deliver order confirmation email to customer.\n\nTraceback:\n  File "/app/notifications/email.py", line 56, in send_order_confirmation\n    server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT, timeout=10)\nConnectionRefusedError: [Errno 111] Connection refused`,
    admin_email: null,
    related_account: "user-2847",
    context: { order_id: "ORD-20260416-1923", recipient: "j***n@gmail.com", smtp_host: "smtp.mailgun.org", retry_count: 3 },
    resolved: false,
    createdAt: "2026-04-16T06:30:00Z",
  },
  {
    id: "log-004",
    severity: "error",
    category: "wallet",
    title: "Double-spend prevention triggered on wallet withdrawal",
    detail: `django.db.IntegrityError: duplicate key value violates unique constraint "wallet_transaction_idempotency_key"\n\nA concurrent withdrawal request was detected and blocked.\n\nTraceback:\n  File "/app/wallet/services.py", line 134, in process_withdrawal\n    WalletTransaction.objects.create(idempotency_key=key, ...)\ndjango.db.IntegrityError: duplicate key`,
    admin_email: null,
    related_account: "vendor-0412",
    context: { wallet_id: "WLT-V-0412", amount: "₦125,000.00", idempotency_key: "wd-0412-1713254400-001", bank: "GTBank" },
    resolved: false,
    createdAt: "2026-04-16T05:15:00Z",
  },
  {
    id: "log-005",
    severity: "warning",
    category: "auth",
    title: "Brute-force login attempt detected — account temporarily locked",
    detail: `Security warning: 15 failed login attempts in 5 minutes for account vendor-1193. Account has been temporarily locked for 30 minutes as a precaution.`,
    admin_email: null,
    related_account: "vendor-1193",
    context: { failed_attempts: 15, lockout_duration_min: 30, ip_addresses: ["102.89.23.45", "102.89.23.46"], user_agent: "Mozilla/5.0 (Windows NT 10.0)" },
    resolved: false,
    createdAt: "2026-04-16T04:00:00Z",
  },
  {
    id: "log-006",
    severity: "warning",
    category: "invite",
    title: "Vendor invite email delivery failed — invalid domain",
    detail: `Email delivery failed for vendor invitation. The recipient domain does not have valid MX records.\n\nbounce_type: hard\nbounce_reason: 550 5.1.1 The email account does not exist`,
    admin_email: "sarah@vistamart.com",
    related_account: null,
    context: { invite_id: "INV-8821", recipient: "contact@fakestoreee.xyz", invited_by: "sarah@vistamart.com", bounce_code: "550" },
    resolved: false,
    createdAt: "2026-04-15T22:10:00Z",
  },
  {
    id: "log-007",
    severity: "info",
    category: "storage",
    title: "CDN cache purge completed with partial failures",
    detail: `CDN cache purge request completed. 847/850 URLs purged successfully. 3 URLs returned 504 Gateway Timeout and will be retried.`,
    admin_email: "admin@vistamart.com",
    related_account: null,
    context: { purge_id: "prg-20260415-001", total_urls: 850, success: 847, failed: 3, failed_urls: ["/media/products/img-4412.webp", "/media/products/img-4413.webp", "/media/banners/hero-spring.jpg"] },
    resolved: false,
    createdAt: "2026-04-15T20:00:00Z",
  },
  {
    id: "log-008",
    severity: "error",
    category: "webhook",
    title: "Paystack webhook delivery failed — timeout",
    detail: `requests.exceptions.ReadTimeout: HTTPSConnectionPool(host='api.paystack.co'): Read timed out. (read timeout=30)\n\nTraceback:\n  File "/app/payments/paystack.py", line 78, in verify_transaction\n    response = requests.get(url, headers=headers, timeout=30)\nrequests.exceptions.ReadTimeout`,
    admin_email: null,
    related_account: "user-5591",
    context: { transaction_ref: "PSK-TXN-20260415-5591", amount: "₦8,500.00", timeout_seconds: 30, retry_attempt: 2 },
    resolved: false,
    createdAt: "2026-04-15T18:45:00Z",
  },
  {
    id: "log-009",
    severity: "info",
    category: "celery",
    title: "Scheduled product index rebuild completed",
    detail: `Elasticsearch product index rebuild completed successfully.\n\nDocuments indexed: 12,847\nDuration: 4m 23s\nIndex size: 128MB`,
    admin_email: null,
    related_account: null,
    context: { task_id: "idx-rebuild-20260415", documents: 12847, duration_seconds: 263, index_size_mb: 128, previous_index_size_mb: 125 },
    resolved: true,
    createdAt: "2026-04-15T14:00:00Z",
  },
];

const severityConfig: Record<Severity, { label: string; color: string; icon: typeof AlertCircle; bgClass: string; textClass: string; borderClass: string }> = {
  critical: { label: "Critical", color: "bg-red-500/10 text-red-600 border-red-500/30", icon: XCircle, bgClass: "bg-red-500/5 border-l-red-500", textClass: "text-red-600", borderClass: "border-red-500/20" },
  error: { label: "Error", color: "bg-orange-500/10 text-orange-600 border-orange-500/30", icon: AlertCircle, bgClass: "bg-orange-500/5 border-l-orange-500", textClass: "text-orange-600", borderClass: "border-orange-500/20" },
  warning: { label: "Warning", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", icon: AlertTriangle, bgClass: "bg-yellow-500/5 border-l-yellow-500", textClass: "text-yellow-600", borderClass: "border-yellow-500/20" },
  info: { label: "Info", color: "bg-blue-500/10 text-blue-600 border-blue-500/30", icon: Info, bgClass: "bg-blue-500/5 border-l-blue-500", textClass: "text-blue-600", borderClass: "border-blue-500/20" },
};

const categories: LogCategory[] = ["email", "celery", "payment", "invite", "wallet", "auth", "storage", "webhook"];

const SystemLogs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<SystemLog[]>(mockLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showResolved, setShowResolved] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [adminEmailFilter, setAdminEmailFilter] = useState("");

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {
        if (!showResolved && log.resolved) return false;
        if (severityFilter !== "all" && log.severity !== severityFilter) return false;
        if (categoryFilter !== "all" && log.category !== categoryFilter) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (!log.title.toLowerCase().includes(term) && !log.detail.toLowerCase().includes(term) && !log.id.toLowerCase().includes(term)) return false;
        }
        if (adminEmailFilter && (!log.admin_email || !log.admin_email.toLowerCase().includes(adminEmailFilter.toLowerCase()))) return false;
        if (dateRange.from) {
          const logDate = new Date(log.createdAt);
          if (logDate < dateRange.from) return false;
          if (dateRange.to && logDate > dateRange.to) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [logs, searchTerm, severityFilter, categoryFilter, showResolved, dateRange, adminEmailFilter]);

  const stats = useMemo(() => {
    const unresolved = logs.filter((l) => !l.resolved);
    return {
      critical: unresolved.filter((l) => l.severity === "critical").length,
      error: unresolved.filter((l) => l.severity === "error").length,
      warning: unresolved.filter((l) => l.severity === "warning").length,
      info: unresolved.filter((l) => l.severity === "info").length,
      total: unresolved.length,
    };
  }, [logs]);

  const handleResolve = (logId: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== logId));
    setSelectedLog(null);
    setConfirmDelete(null);
    toast({ title: "Log resolved", description: `Log ${logId} has been marked as resolved and removed.` });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied", description: "Content copied to clipboard." });
  };

  const SeverityBadge = ({ severity }: { severity: Severity }) => {
    const config = severityConfig[severity];
    const Icon = config.icon;
    return (
      <Badge className={cn("gap-1 font-medium", config.color)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const CategoryBadge = ({ category }: { category: string }) => (
    <Badge variant="outline" className="font-mono text-xs capitalize">
      {category}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground mt-1">Monitor and resolve backend errors and failures</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => toast({ title: "Refreshed", description: "Logs have been refreshed." })}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(["critical", "error", "warning", "info"] as Severity[]).map((sev) => {
          const config = severityConfig[sev];
          const Icon = config.icon;
          const count = stats[sev];
          return (
            <Card
              key={sev}
              className={cn("cursor-pointer border-l-4 transition-all hover:shadow-md", config.bgClass, severityFilter === sev && "ring-2 ring-ring")}
              onClick={() => setSeverityFilter(severityFilter === sev ? "all" : sev)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={cn("h-8 w-8", config.textClass)} />
                <div>
                  <p className={cn("text-2xl font-bold", config.textClass)}>{count}</p>
                  <p className="text-xs text-muted-foreground capitalize">{sev}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Card className={cn("cursor-pointer transition-all hover:shadow-md", severityFilter === "all" && "ring-2 ring-ring")} onClick={() => setSeverityFilter("all")}>
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total Open</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search title, detail, or ID…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {dateRange.from ? `${format(dateRange.from, "MMM d")}${dateRange.to ? ` – ${format(dateRange.to, "MMM d")}` : ""}` : "Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange as any}
                  onSelect={(range: any) => setDateRange(range || {})}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <div className="relative min-w-[180px]">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Admin email…" value={adminEmailFilter} onChange={(e) => setAdminEmailFilter(e.target.value)} className="pl-9 h-9 text-sm" />
            </div>

            <Button
              variant={showResolved ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowResolved(!showResolved)}
              className="gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              {showResolved ? "Showing Resolved" : "Show Resolved"}
            </Button>

            {(searchTerm || severityFilter !== "all" || categoryFilter !== "all" || dateRange.from || adminEmailFilter) && (
              <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(""); setSeverityFilter("all"); setCategoryFilter("all"); setDateRange({}); setAdminEmailFilter(""); }}>
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const count = logs.filter((l) => !l.resolved && l.category === cat).length;
          if (count === 0) return null;
          return (
            <Badge
              key={cat}
              variant={categoryFilter === cat ? "default" : "outline"}
              className="cursor-pointer capitalize gap-1 px-3 py-1"
              onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
            >
              {cat} <span className="opacity-70">({count})</span>
            </Badge>
          );
        })}
      </div>

      {/* Log Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>{filteredLogs.length} log{filteredLogs.length !== 1 ? "s" : ""}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mb-3 text-green-500/50" />
              <p className="font-medium">All clear!</p>
              <p className="text-sm">No logs match your current filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">Severity</TableHead>
                  <TableHead className="w-[100px]">Category</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[130px]">Account</TableHead>
                  <TableHead className="w-[150px]">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => {
                  const config = severityConfig[log.severity];
                  return (
                    <TableRow
                      key={log.id}
                      className={cn(
                        "cursor-pointer transition-colors",
                        log.severity === "critical" && "bg-red-500/[0.03] hover:bg-red-500/[0.07]",
                        log.severity === "error" && "hover:bg-orange-500/[0.05]",
                        log.resolved && "opacity-60"
                      )}
                      onClick={() => setSelectedLog(log)}
                    >
                      <TableCell><SeverityBadge severity={log.severity} /></TableCell>
                      <TableCell><CategoryBadge category={log.category} /></TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className={cn("font-medium text-sm", log.severity === "critical" && "text-red-700 dark:text-red-400")}>
                            {log.title}
                          </span>
                          <span className="text-xs text-muted-foreground line-clamp-1">{log.detail.split("\n")[0]}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{log.related_account || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}</span>
                          <span className="text-[11px] text-muted-foreground/70">{format(new Date(log.createdAt), "MMM d, HH:mm")}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedLog} onOpenChange={(open) => !open && setSelectedLog(null)}>
        {selectedLog && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <SeverityBadge severity={selectedLog.severity} />
                <CategoryBadge category={selectedLog.category} />
                <span className="text-xs text-muted-foreground font-mono ml-auto">{selectedLog.id}</span>
              </div>
              <DialogTitle className={cn("text-lg", selectedLog.severity === "critical" && "text-red-700 dark:text-red-400")}>
                {selectedLog.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {format(new Date(selectedLog.createdAt), "PPpp")}</span>
                <span>({formatDistanceToNow(new Date(selectedLog.createdAt), { addSuffix: true })})</span>
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-5 pb-4">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Admin Email</p>
                    <p className="font-mono text-sm">{selectedLog.admin_email || "System / Automated"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Related Account</p>
                    <p className="font-mono text-sm">{selectedLog.related_account || "None"}</p>
                  </div>
                </div>

                <Separator />

                {/* Detail / Traceback */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Error Detail & Traceback</p>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => copyToClipboard(selectedLog.detail)}>
                      <Copy className="h-3 w-3" /> Copy
                    </Button>
                  </div>
                  <pre className={cn(
                    "rounded-lg border p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all overflow-auto max-h-[250px]",
                    "bg-muted/50"
                  )}>
                    {selectedLog.detail}
                  </pre>
                </div>

                <Separator />

                {/* Context JSON */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Context Data</p>
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={() => copyToClipboard(JSON.stringify(selectedLog.context, null, 2))}>
                      <Copy className="h-3 w-3" /> Copy JSON
                    </Button>
                  </div>
                  <pre className={cn(
                    "rounded-lg border p-4 text-xs font-mono leading-relaxed whitespace-pre-wrap break-all overflow-auto max-h-[200px]",
                    "bg-muted/50"
                  )}>
                    {JSON.stringify(selectedLog.context, null, 2)}
                  </pre>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="flex-row justify-between sm:justify-between gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>Close</Button>
              {!selectedLog.resolved && (
                confirmDelete === selectedLog.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-destructive font-medium">Confirm resolve & delete?</span>
                    <Button variant="destructive" size="sm" onClick={() => handleResolve(selectedLog.id)}>Yes, Resolve</Button>
                    <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                  </div>
                ) : (
                  <Button variant="destructive" size="sm" className="gap-2" onClick={() => setConfirmDelete(selectedLog.id)}>
                    <Trash2 className="h-4 w-4" /> Mark as Resolved
                  </Button>
                )
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default SystemLogs;
