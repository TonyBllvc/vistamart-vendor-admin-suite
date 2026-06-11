import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Eye, Download, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Receipt {
  id: string;
  receipt_number: string;
  user_email: string;
  invoice_reference: string;
  amount: number;
  date: string;
}

const MOCK: Receipt[] = Array.from({ length: 18 }).map((_, i) => ({
  id: String(i + 1),
  receipt_number: `RCP-${50000 + i}`,
  user_email: `user${i + 1}@example.com`,
  invoice_reference: `INV-${20260000 + i}`,
  amount: 1500 + i * 250,
  date: new Date(Date.now() - i * 86400000).toISOString(),
}));

export default function AdminReceipts() {
  const [loading] = useState(false);
  const [from, setFrom] = useState<Date>();
  const [to, setTo] = useState<Date>();
  const [limit, setLimit] = useState(10);
  const [view, setView] = useState<Receipt | null>(null);

  const filtered = useMemo(() => MOCK.filter((r) => {
    const d = new Date(r.date);
    if (from && d < from) return false;
    if (to && d > to) return false;
    return true;
  }), [from, to]);

  const visible = filtered.slice(0, limit);

  const download = (r: Receipt) => {
    setView(r);
    setTimeout(() => window.print(), 300);
    toast.success(`Receipt ${r.receipt_number} ready to print.`);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">All Receipts</h1>
        <p className="text-sm text-muted-foreground">{filtered.length} receipts</p>
      </div>

      <Card className="p-4 flex flex-wrap gap-3 items-center">
        <DatePick label="From" value={from} onChange={setFrom} />
        <DatePick label="To" value={to} onChange={setTo} />
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt #</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>Invoice Ref</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}</TableRow>
            )) : visible.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No records match your filters.</TableCell></TableRow>
            ) : visible.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.receipt_number}</TableCell>
                <TableCell>{r.user_email}</TableCell>
                <TableCell className="font-mono text-xs">{r.invoice_reference}</TableCell>
                <TableCell>₦{r.amount.toLocaleString()}</TableCell>
                <TableCell>{format(new Date(r.date), "MMM d, yyyy")}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button size="sm" variant="ghost" onClick={() => setView(r)}><Eye className="h-4 w-4 mr-1" />View</Button>
                  <Button size="sm" variant="outline" onClick={() => download(r)}><Download className="h-4 w-4 mr-1" />Download</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {visible.length < filtered.length && (
        <div className="flex justify-center"><Button variant="outline" onClick={() => setLimit((l) => l + 10)}>Load More</Button></div>
      )}

      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-md print:shadow-none">
          <DialogHeader><DialogTitle>Receipt {view?.receipt_number}</DialogTitle></DialogHeader>
          {view && (
            <div className="space-y-4 text-sm">
              <div className="text-center border-b pb-3">
                <h2 className="text-lg font-bold">Primemart</h2>
                <p className="text-xs text-muted-foreground">Official Payment Receipt</p>
              </div>
              <Row k="Receipt #" v={view.receipt_number} />
              <Row k="Invoice Ref" v={view.invoice_reference} />
              <Row k="Customer" v={view.user_email} />
              <Row k="Amount Paid" v={`₦${view.amount.toLocaleString()}`} />
              <Row k="Date" v={format(new Date(view.date), "PPpp")} />
              <div className="text-center text-xs text-muted-foreground pt-4 border-t">Thank you for your payment.</div>
              <Button className="w-full" onClick={() => window.print()}><Printer className="h-4 w-4 mr-2" />Print Receipt</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
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
