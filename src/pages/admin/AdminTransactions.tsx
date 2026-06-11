import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Eye, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Entry = "debit" | "credit";
interface Tx {
  id: string;
  title: string;
  user_email: string;
  entry: Entry;
  amount: number;
  reference: string;
  date: string;
  system_message?: string;
}

const MOCK: Tx[] = Array.from({ length: 22 }).map((_, i) => ({
  id: String(i + 1),
  title: i % 3 === 0 ? "Wallet Deposit" : i % 3 === 1 ? "Order Payment" : "Withdrawal",
  user_email: `user${i + 1}@example.com`,
  entry: (i % 2 === 0 ? "credit" : "debit") as Entry,
  amount: 500 + i * 213,
  reference: `TXN_${1700000000000 + i * 7777}`,
  date: new Date(Date.now() - i * 7200000).toISOString(),
  system_message: i % 3 === 0 ? "Wallet topped up via Paystack." : undefined,
}));

export default function AdminTransactions() {
  const [loading] = useState(false);
  const [entry, setEntry] = useState<"All" | "Debits" | "Credits">("All");
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();
  const [limit, setLimit] = useState(10);
  const [sel, setSel] = useState<Tx | null>(null);

  const filtered = useMemo(() => MOCK.filter((t) => {
    if (entry === "Debits" && t.entry !== "debit") return false;
    if (entry === "Credits" && t.entry !== "credit") return false;
    const d = new Date(t.date);
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  }), [entry, from, to]);

  const visible = filtered.slice(0, limit);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} transactions</p>
      </div>

      <Card className="p-4 flex flex-wrap gap-3 items-center">
        <div className="flex gap-2">
          {(["All", "Debits", "Credits"] as const).map((c) => (
            <button key={c} onClick={() => setEntry(c)} className={cn("px-3 py-1 text-xs rounded-full border", entry === c ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted")}>{c}</button>
          ))}
        </div>
        <DatePick label="From" value={from} onChange={setFrom} />
        <DatePick label="To" value={to} onChange={setTo} />
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}</TableRow>
            )) : visible.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No records match your filters.</TableCell></TableRow>
            ) : visible.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.user_email}</TableCell>
                <TableCell>
                  {t.entry === "credit" ? (
                    <Badge className="bg-green-100 text-green-800 gap-1" variant="secondary"><ArrowDownLeft className="h-3 w-3" />Credit</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 gap-1" variant="secondary"><ArrowUpRight className="h-3 w-3" />Debit</Badge>
                  )}
                </TableCell>
                <TableCell className={t.entry === "credit" ? "text-green-700" : "text-red-700"}>
                  {t.entry === "credit" ? "+" : "-"}₦{t.amount.toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-xs">{t.reference}</TableCell>
                <TableCell>{format(new Date(t.date), "MMM d, yyyy HH:mm")}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" onClick={() => setSel(t)}><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {visible.length < filtered.length && (
        <div className="flex justify-center"><Button variant="outline" onClick={() => setLimit((l) => l + 10)}>Load More</Button></div>
      )}

      <Dialog open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{sel?.title}</DialogTitle></DialogHeader>
          {sel && (
            <div className="space-y-3 text-sm">
              <Row k="Reference" v={<span className="font-mono">{sel.reference}</span>} />
              <Row k="User" v={sel.user_email} />
              <Row k="Type" v={sel.entry} />
              <Row k="Amount" v={`₦${sel.amount.toLocaleString()}`} />
              <Row k="Date" v={format(new Date(sel.date), "PPpp")} />
              {sel.system_message && (
                <div className="rounded-md bg-blue-50 border border-blue-200 p-3 text-blue-900">
                  <div className="font-medium mb-1">System Message</div>{sel.system_message}
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
  return <div className="flex justify-between border-b pb-2"><span className="text-muted-foreground">{k}</span><span className="capitalize">{v}</span></div>;
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
