import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  RotateCw,
  Eye,
  Check,
  X as XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Severity = "critical" | "error" | "warning" | "info";
type Category =
  | "email"
  | "background_task"
  | "auth"
  | "payment"
  | "invite"
  | "wallet"
  | "guest_session"
  | "general";

interface SystemLog {
  id: string;
  severity: Severity;
  category: Category;
  title: string;
  detail: string;
  adminEmail: string | null;
  relatedAccount: string | null;
  createdAt: string; // ISO
}

const CURRENT_ADMIN_EMAIL = "admin@primemart.com";

const CATEGORY_LABELS: Record<Category, string> = {
  email: "Email",
  background_task: "Background Task",
  auth: "Auth",
  payment: "Payment",
  invite: "Invite",
  wallet: "Wallet",
  guest_session: "Guest Session",
  general: "General",
};

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 0,
  error: 1,
  warning: 2,
  info: 3,
};

const MOCK_LOGS: SystemLog[] = [
  {
    id: "log_001",
    severity: "critical",
    category: "payment",
    title: "Payment gateway timeout — Paystack callback did not return within 30s for transaction TXN-88421",
    detail:
      "The payment provider failed to respond to the verification callback. Affected wallet top-up may be stuck in pending.",
    adminEmail: null,
    relatedAccount: "jane.doe@example.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "log_002",
    severity: "critical",
    category: "background_task",
    title: "Celery worker exhausted retries on process_wallet_settlement",
    detail: "Task failed after 5 retries. Underlying DB connection pool exhausted.",
    adminEmail: CURRENT_ADMIN_EMAIL,
    relatedAccount: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "log_003",
    severity: "error",
    category: "email",
    title: "SMTP delivery failed for invite to vendor_47@shop.com",
    detail: "SMTP 550: recipient address rejected — mailbox unavailable.",
    adminEmail: CURRENT_ADMIN_EMAIL,
    relatedAccount: "vendor_47@shop.com",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "log_004",
    severity: "error",
    category: "auth",
    title: "JWT signing key rotation failed — falling back to previous key",
    detail: "Key vault returned 403 during rotation attempt.",
    adminEmail: null,
    relatedAccount: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "log_005",
    severity: "warning",
    category: "wallet",
    title: "Wallet reconciliation mismatch detected: expected 12,450.00, got 12,449.95",
    detail: "0.05 NGN rounding drift flagged during nightly reconciliation.",
    adminEmail: CURRENT_ADMIN_EMAIL,
    relatedAccount: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: "log_006",
    severity: "warning",
    category: "invite",
    title: "Invite link expired before acceptance for affiliate@partners.io",
    detail: "Invite token TTL exceeded 72h.",
    adminEmail: "author@primemart.com",
    relatedAccount: "affiliate@partners.io",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  },
  {
    id: "log_007",
    severity: "info",
    category: "guest_session",
    title: "Guest session auto-purged (14-day TTL) — 1,284 records removed",
    detail: "Scheduled cleanup completed successfully.",
    adminEmail: null,
    relatedAccount: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
  {
    id: "log_008",
    severity: "info",
    category: "general",
    title: "Scheduled backup completed — snapshot size 4.2 GB",
    detail: "Backup uploaded to S3 cold storage bucket.",
    adminEmail: null,
    relatedAccount: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h === 1 ? "" : "s"} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const map: Record<Severity, { cls: string; label: string; Icon: typeof Info }> = {
    critical: {
      cls: "bg-red-600 hover:bg-red-600 text-white border-transparent",
      label: "Critical",
      Icon: XCircle,
    },
    error: {
      cls: "bg-orange-500 hover:bg-orange-500 text-white border-transparent",
      label: "Error",
      Icon: AlertCircle,
    },
    warning: {
      cls: "bg-amber-400 hover:bg-amber-400 text-amber-950 border-transparent",
      label: "Warning",
      Icon: AlertTriangle,
    },
    info: {
      cls: "bg-blue-500 hover:bg-blue-500 text-white border-transparent",
      label: "Info",
      Icon: Info,
    },
  };
  const { cls, label, Icon } = map[severity];
  return (
    <Badge className={cn("gap-1 font-semibold", cls)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}

const SEVERITY_ROW_STYLE: Record<Severity, string> = {
  critical: "border-l-4 border-l-red-600 bg-red-50/40 dark:bg-red-950/20",
  error: "border-l-4 border-l-orange-500",
  warning: "border-l-4 border-l-amber-400",
  info: "border-l-4 border-l-blue-500",
};

export default function SystemLogs() {
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(false);
  const [logs, setLogs] = useState<SystemLog[]>(MOCK_LOGS);

  const [severity, setSeverity] = useState<"all" | Severity>("all");
  const [category, setCategory] = useState<"all" | Category>("all");
  const [mine, setMine] = useState(false);
  const [limit, setLimit] = useState(100);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailLog, setDetailLog] = useState<SystemLog | null>(null);
  const [resolveTarget, setResolveTarget] = useState<SystemLog | null>(null);
  const [bulkResolveOpen, setBulkResolveOpen] = useState(false);
  const [resolving, setResolving] = useState(false);

  const counts = useMemo(() => {
    const c = { critical: 0, error: 0, warning: 0, info: 0 };
    logs.forEach((l) => c[l.severity]++);
    return c;
  }, [logs]);

  const filtered = useMemo(() => {
    let rows = [...logs];
    if (severity !== "all") rows = rows.filter((l) => l.severity === severity);
    if (category !== "all") rows = rows.filter((l) => l.category === category);
    if (mine) rows = rows.filter((l) => l.adminEmail === CURRENT_ADMIN_EMAIL);
    rows.sort((a, b) => {
      const s = SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity];
      if (s !== 0) return s;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return rows.slice(0, limit);
  }, [logs, severity, category, mine, limit]);

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((l) => selected.has(l.id));

  const toggleAll = () => {
    if (allVisibleSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((l) => l.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setSeverity("all");
    setCategory("all");
    setMine(false);
    setLimit(100);
  };

  const resolveSingle = async () => {
    if (!resolveTarget) return;
    setResolving(true);
    await new Promise((r) => setTimeout(r, 600));
    setLogs((prev) => prev.filter((l) => l.id !== resolveTarget.id));
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(resolveTarget.id);
      return n;
    });
    setResolving(false);
    setResolveTarget(null);
    toast.success("Log resolved and permanently deleted.");
  };

  const resolveBulk = async () => {
    setResolving(true);
    await new Promise((r) => setTimeout(r, 700));
    const ids = Array.from(selected);
    setLogs((prev) => prev.filter((l) => !selected.has(l.id)));
    setResolving(false);
    setBulkResolveOpen(false);
    setSelected(new Set());
    toast.success(`${ids.length} log${ids.length === 1 ? "" : "s"} resolved.`);
  };

  const simulateLoading = () => {
    setErrorState(false);
    setLoading(true);
    setTimeout(() => setLoading(false), 900);
  };

  const simulateError = () => {
    setLoading(false);
    setErrorState(true);
  };

  return (
    <TooltipProvider>
      <div className="p-4 md:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
            <p className="text-sm text-muted-foreground">
              Unresolved backend events across the platform. Resolving a log permanently deletes it.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={simulateLoading}>
              <RotateCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={simulateError}>
              Simulate error
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(
            [
              { key: "critical", label: "Critical", cls: "bg-red-600 text-white", count: counts.critical },
              { key: "error", label: "Error", cls: "bg-orange-500 text-white", count: counts.error },
              { key: "warning", label: "Warning", cls: "bg-amber-400 text-amber-950", count: counts.warning },
              { key: "info", label: "Info", cls: "bg-blue-500 text-white", count: counts.info },
            ] as const
          ).map((s) => {
            const active = severity === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSeverity(active ? "all" : s.key)}
                className={cn(
                  "rounded-lg border bg-card px-4 py-3 text-left transition-all hover:shadow-sm",
                  active && "ring-2 ring-primary border-primary"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                  <Badge className={cn("border-transparent", s.cls)}>{s.count}</Badge>
                </div>
                <div className="mt-1 text-2xl font-bold">{s.count}</div>
              </button>
            );
          })}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Severity</Label>
            <Select value={severity} onValueChange={(v) => setSeverity(v as any)}>
              <SelectTrigger className="h-9 w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as any)}>
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="mine" checked={mine} onCheckedChange={setMine} />
            <Label htmlFor="mine" className="text-sm cursor-pointer">
              My Logs
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Limit</Label>
            <Input
              type="number"
              min={1}
              max={200}
              value={limit}
              onChange={(e) =>
                setLimit(Math.min(200, Math.max(1, Number(e.target.value) || 1)))
              }
              className="h-9 w-20"
            />
          </div>

          <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
            Clear Filters
          </Button>
        </div>

        {/* Bulk toolbar */}
        {selected.size > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 p-3">
            <span className="text-sm font-medium">{selected.size} selected</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkResolveOpen(true)}
            >
              <Check className="h-4 w-4" />
              Resolve Selected
            </Button>
            <button
              onClick={() => setSelected(new Set())}
              className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline ml-auto"
            >
              Deselect All
            </button>
          </div>
        )}

        {/* Table / states */}
        <div className="rounded-lg border bg-card overflow-hidden">
          {loading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : errorState ? (
            <div className="p-12 text-center">
              <XCircle className="h-10 w-10 mx-auto text-destructive" />
              <h3 className="mt-3 text-lg font-semibold">Failed to load logs</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The system log API returned an error. Try again in a moment.
              </p>
              <Button className="mt-4" onClick={simulateLoading}>
                <RotateCw className="h-4 w-4" /> Retry
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">All clear.</h3>
              <p className="text-sm text-muted-foreground mt-1">
                No unresolved system logs. The platform is running smoothly.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allVisibleSelected}
                      onCheckedChange={toggleAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[110px]">Severity</TableHead>
                  <TableHead className="w-[130px]">Category</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="w-[200px]">Admin Email</TableHead>
                  <TableHead className="w-[200px]">Related Account</TableHead>
                  <TableHead className="w-[140px]">Created</TableHead>
                  <TableHead className="w-[150px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((log) => {
                  const truncated =
                    log.title.length > 80 ? log.title.slice(0, 80) + "…" : log.title;
                  const isSelected = selected.has(log.id);
                  return (
                    <TableRow
                      key={log.id}
                      data-state={isSelected ? "selected" : undefined}
                      className={cn(SEVERITY_ROW_STYLE[log.severity], "text-sm")}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleOne(log.id)}
                          aria-label={`Select log ${log.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <SeverityBadge severity={log.severity} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {CATEGORY_LABELS[log.category]}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[420px]">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="truncate block cursor-help">{truncated}</span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-md">
                            <p className="text-xs">{log.title}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.adminEmail ?? "—"}
                      </TableCell>
                      <TableCell>
                        {log.relatedAccount ? (
                          <a
                            href={`mailto:${log.relatedAccount}`}
                            className="text-primary hover:underline"
                          >
                            {log.relatedAccount}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-muted-foreground cursor-help">
                              {formatRelative(log.createdAt)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">{new Date(log.createdAt).toLocaleString()}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDetailLog(log)}
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                            onClick={() => setResolveTarget(log)}
                          >
                            <Check className="h-4 w-4" />
                            Resolve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {!loading && !errorState && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {logs.length} unresolved logs. Sorted by severity, then newest first.
          </p>
        )}

        {/* Detail drawer */}
        <Sheet open={!!detailLog} onOpenChange={(o) => !o && setDetailLog(null)}>
          <SheetContent className="w-full sm:max-w-lg">
            {detailLog && (
              <>
                <SheetHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <SeverityBadge severity={detailLog.severity} />
                    <Badge variant="outline">{CATEGORY_LABELS[detailLog.category]}</Badge>
                  </div>
                  <SheetTitle className="text-left">{detailLog.title}</SheetTitle>
                  <SheetDescription className="text-left">
                    {new Date(detailLog.createdAt).toLocaleString()} · {formatRelative(detailLog.createdAt)}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1">Detail</div>
                    <p className="rounded-md bg-muted p-3 text-sm">{detailLog.detail}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">Admin</div>
                      <div>{detailLog.adminEmail ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">Related account</div>
                      <div>{detailLog.relatedAccount ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground">Log ID</div>
                      <div className="font-mono text-xs">{detailLog.id}</div>
                    </div>
                  </div>
                  <div className="pt-4 flex gap-2">
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        setResolveTarget(detailLog);
                        setDetailLog(null);
                      }}
                    >
                      <Check className="h-4 w-4" /> Resolve
                    </Button>
                    <Button variant="outline" onClick={() => setDetailLog(null)}>
                      <XIcon className="h-4 w-4" /> Close
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Single resolve modal */}
        <Dialog
          open={!!resolveTarget}
          onOpenChange={(o) => !o && !resolving && setResolveTarget(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resolve log?</DialogTitle>
              <DialogDescription>
                Resolving permanently deletes this log. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {resolveTarget && (
              <div className="rounded-md border p-3 bg-muted/40 text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <SeverityBadge severity={resolveTarget.severity} />
                  <Badge variant="outline">{CATEGORY_LABELS[resolveTarget.category]}</Badge>
                </div>
                <p className="line-clamp-2 pt-1">{resolveTarget.title}</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" disabled={resolving} onClick={() => setResolveTarget(null)}>
                Cancel
              </Button>
              <Button variant="destructive" disabled={resolving} onClick={resolveSingle}>
                {resolving ? "Resolving…" : "Resolve & Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk resolve modal */}
        <Dialog open={bulkResolveOpen} onOpenChange={(o) => !resolving && setBulkResolveOpen(o)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resolve {selected.size} logs?</DialogTitle>
              <DialogDescription>
                All selected logs will be permanently deleted. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" disabled={resolving} onClick={() => setBulkResolveOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" disabled={resolving} onClick={resolveBulk}>
                {resolving ? "Resolving…" : `Resolve ${selected.size} & Delete`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}
