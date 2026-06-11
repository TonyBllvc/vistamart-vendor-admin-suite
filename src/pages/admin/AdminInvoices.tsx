import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Eye, Search, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

type InvStatus = "pending" | "processing" | "completed" | "failed" | "flagged_overpay" | "flagged_underpay";
type InvType = "deposit" | "payment" | "wallet_transfer" | "withdrawal";
type Gateway = "paystack" | "flutterwave" | "wallet";

interface Invoice {
  id: string;
  invoice_number: string;
  transaction_reference: string;
  type: InvType;
  user_email: string;
  amount: number;
  gateway: Gateway;
  status: InvStatus;
  date: string;
  system_message?: string;
  flag_message?: string;
  expected_amount?: number;
  received_amount?: number;
}

const MOCK: Invoice[] = Array.from({ length: 23 }).map((_, i) => {
  const types: InvType[] = ["deposit", "payment", "wallet_transfer", "withdrawal"];
  const gateways: Gateway[] = ["paystack", "flutterwave", "wallet"];
  const statuses: InvStatus[] = ["pending", "processing", "completed", "failed", "flagged_overpay", "flagged_underpay"];
  const s = statuses[i % statuses.length];
  return {
    id: String(i + 1),
    invoice_number: `INV-${20260000 + i}`,
    transaction_reference: `PMT_${1700000000000 + i * 1234}`,
    type: types[i % 4],
    user_email: `user${i + 1}@example.com`,
    amount: 1000 + i * 437.5,
    gateway: gateways[i % 3],
    status: s,
    date: new Date(Date.now() - i * 86400000).toISOString(),
    system_message: i % 4 === 0 ? "Auto-verified by gateway webhook." : undefined,
    flag_message: s.startsWith("flagged") ? "Received amount differs from invoice total." : undefined,
    expected_amount: 1000 + i * 437.5,
    received_amount: s === "flagged_overpay" ? 1000 + i * 437.5 + 50 : s === "flagged_underpay" ? 1000 + i * 437.5 - 50 : undefined,
  };
});

const STATUS_CHIPS = ["All", "Pending", "Processing", "Completed", "Failed", "Flagged"] as const;
const TYPE_CHIPS = ["All", "Deposit", "Payment", "Wallet Transfer", "Withdrawal"] as const;
const GATEWAY_CHIPS = ["All", "Paystack", "Flutterwave", "Wallet"] as const;

const statusBadge = (s: InvStatus) => {
  const map: Record<InvStatus, string> = {
    pending: "bg-amber-100 text-amber-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    flagged_overpay: "bg-amber-100 text-amber-900 border border-amber-400",
    flagged_underpay: "bg-amber-100 text-amber-900 border border-amber-400",
  };
  return <Badge className={cn("font-medium", map[s])} variant="secondary">{s.replace("_", " ")}</Badge>;
};

const typeBadge = (t: InvType) => (
  <Badge variant="outline" className="capitalize">{t.replace("_", " ")}</Badge>
);

export default function AdminInvoices() {
  const [loading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [gatewayFilter, setGatewayFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();
  const [limit, setLimit] = useState(10);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const filtered = useMemo(() => {
    return MOCK.filter((inv) => {
      if (statusFilter === "Flagged" && !inv.status.startsWith("flagged")) return false;
      if (statusFilter !== "All" && statusFilter !== "Flagged" && inv.status !== statusFilter.toLowerCase()) return false;
      if (typeFilter !== "All" && inv.type !== typeFilter.toLowerCase().replace(" ", "_")) return false;
      if (gatewayFilter !== "All" && inv.gateway !== gatewayFilter.toLowerCase()) return false;
      if (search && !inv.invoice_number.toLowerCase().includes(search.toLowerCase()) && !inv.transaction_reference.toLowerCase().includes(search.toLowerCase())) return false;
      const d = new Date(inv.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }, [statusFilter, typeFilter, gatewayFilter, search, from, to]);

  const visible = filtered.slice(0, limit);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">All Invoices</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} invoices</p>
      </div>

      <Card className="p-4 space-y-4">
        <ChipRow label="Status" options={STATUS_CHIPS as any} value={statusFilter} onChange={setStatusFilter} />
        <ChipRow label="Type" options={TYPE_CHIPS as any} value={typeFilter} onChange={setTypeFilter} />
        <ChipRow label="Gateway" options={GATEWAY_CHIPS as any} value={gatewayFilter} onChange={setGatewayFilter} />
        <div className="flex flex-wrap gap-3 items-center">
          <DatePick label="From" value={from} onChange={setFrom} />
          <DatePick label="To" value={to} onChange={setTo} />
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search invoice or reference..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}</TableRow>
              ))
            ) : visible.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No records match your filters.</TableCell></TableRow>
            ) : (
              visible.map((inv) => {
                const flagged = inv.status.startsWith("flagged");
                return (
                  <TableRow key={inv.id} className={cn(flagged && "border-l-4 border-l-amber-500")}>
                    <TableCell className="font-mono text-xs">{inv.invoice_number}</TableCell>
                    <TableCell>{typeBadge(inv.type)}</TableCell>
                    <TableCell>{inv.user_email}</TableCell>
                    <TableCell>₦{inv.amount.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{inv.gateway}</TableCell>
                    <TableCell>{statusBadge(inv.status)}{flagged && <Flag className="inline h-3 w-3 ml-1 text-amber-600" />}</TableCell>
                    <TableCell>{format(new Date(inv.date), "MMM d, yyyy")}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => setSelected(inv)}><Eye className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {visible.length < filtered.length && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setLimit((l) => l + 10)}>Load More</Button>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Invoice {selected?.invoice_number}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <Row k="Transaction Reference" v={<span className="font-mono">{selected.transaction_reference}</span>} />
              <Row k="Type" v={typeBadge(selected.type)} />
              <Row k="Status" v={statusBadge(selected.status)} />
              <Row k="User Email" v={selected.user_email} />
              <Row k="Amount" v={`₦${selected.amount.toLocaleString()}`} />
              <Row k="Gateway" v={<span className="capitalize">{selected.gateway}</span>} />
              <Row k="Date" v={format(new Date(selected.date), "PPpp")} />
              {selected.expected_amount !== undefined && <Row k="Expected" v={`₦${selected.expected_amount.toLocaleString()}`} />}
              {selected.received_amount !== undefined && <Row k="Received" v={`₦${selected.received_amount.toLocaleString()}`} />}
              {selected.system_message && (
                <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-blue-900">
                  <div className="font-medium mb-1">System Message</div>{selected.system_message}
                </div>
              )}
              {selected.flag_message && (
                <div className="rounded-md bg-amber-50 border border-amber-300 p-3 text-amber-900">
                  <div className="font-medium mb-1 flex items-center gap-1"><Flag className="h-4 w-4" />Flag Message</div>{selected.flag_message}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">{k}</span><span>{v}</span></div>;
}

function ChipRow({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs text-muted-foreground w-20">{label}:</span>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} className={cn("px-3 py-1 text-xs rounded-full border", value === o ? "bg-primary text-primary-foreground border-primary" : "bg-background hover:bg-muted")}>{o}</button>
      ))}
    </div>
  );
}

function DatePick({ label, value, onChange }: { label: string; value?: Date; onChange: (d?: Date) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn(!value && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />{value ? format(value, "MMM d, yyyy") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus className="p-3 pointer-events-auto" />
      </PopoverContent>
    </Popover>
  );
}
