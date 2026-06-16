import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Copy, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Status = "pending" | "paid" | "disputed";

interface Payout {
  id: string;
  reference: string;
  amount: number;
  status: Status;
  payoutDate: string | null;
}

const SERVICE_AVAILABLE = true;

const initialPayouts: Payout[] = [
  { id: "1", reference: "PYT-2026-00482", amount: 15500, status: "paid", payoutDate: "2026-06-10" },
  { id: "2", reference: "PYT-2026-00455", amount: 28750, status: "paid", payoutDate: "2026-05-28" },
  { id: "3", reference: "PYT-2026-00510", amount: 9200, status: "pending", payoutDate: null },
  { id: "4", reference: "PYT-2026-00399", amount: 41300, status: "disputed", payoutDate: "2026-05-12" },
  { id: "5", reference: "PYT-2026-00521", amount: 6750, status: "pending", payoutDate: null },
];

const fmtNGN = (n: number) =>
  `NGN ${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const fmtDate = (d: string | null) => {
  if (!d) return "Pending";
  return new Date(d).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const StatusBadge = ({ status }: { status: Status }) => {
  if (status === "paid")
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">Paid</Badge>;
  if (status === "disputed")
    return <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0">Disputed</Badge>;
  return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">Pending</Badge>;
};

const RefChip = ({ value }: { value: string }) => (
  <button
    type="button"
    onClick={() => {
      navigator.clipboard.writeText(value);
      toast.success("Reference copied");
    }}
    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted hover:bg-muted/70 font-mono text-xs"
  >
    {value}
    <Copy className="h-3 w-3" />
  </button>
);

const AffiliatePayouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>(initialPayouts);
  const [filter, setFilter] = useState<"all" | Status>("all");

  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeTarget, setDisputeTarget] = useState<Payout | null>(null);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [reasonError, setReasonError] = useState("");

  const filtered = useMemo(() => {
    if (filter === "all") return payouts;
    return payouts.filter((p) => p.status === filter);
  }, [payouts, filter]);

  const openDispute = (p: Payout) => {
    setDisputeTarget(p);
    setReason("");
    setDetails("");
    setReasonError("");
    setDisputeOpen(true);
  };

  const submitDispute = () => {
    if (!reason.trim()) {
      setReasonError("Please provide a reason for the dispute.");
      return;
    }
    if (!disputeTarget) return;
    setPayouts((prev) =>
      prev.map((p) =>
        p.id === disputeTarget.id ? { ...p, status: "disputed" as const } : p
      )
    );
    setDisputeOpen(false);
    toast.success("Dispute submitted. Our team will review it.");
  };

  const isEmpty = payouts.length === 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Payouts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your referral payouts and dispute any issues.
        </p>
      </div>

      {!SERVICE_AVAILABLE && (
        <div className="flex items-start gap-3 p-4 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-900">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            Payout records are not yet available. The payout system is being set
            up. Check back soon.
          </p>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "pending", "paid", "disputed"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filter === s
                  ? "bg-affiliate-primary text-white border-affiliate-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-muted"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      {/* Table / Empty */}
      {isEmpty ? (
        <Card className="p-10 text-center">
          <Wallet className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-base font-medium">No payouts yet.</p>
          <p className="text-sm text-muted-foreground">
            Payouts are processed once your referral conversions are confirmed.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout Reference</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payout Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No payouts match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <RefChip value={p.reference} />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {fmtNGN(p.amount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fmtDate(p.payoutDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(p.status === "paid" || p.status === "pending") && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openDispute(p)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Dispute
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Dispute Modal */}
      <Dialog open={disputeOpen} onOpenChange={setDisputeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dispute Payout</DialogTitle>
            <DialogDescription>
              Tell us what's wrong with this payout.
            </DialogDescription>
          </DialogHeader>

          {disputeTarget && (
            <div className="text-sm space-y-1 p-3 rounded-md bg-muted/40">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono text-xs">{disputeTarget.reference}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">{fmtNGN(disputeTarget.amount)}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="reason">
                Reason for dispute <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (reasonError) setReasonError("");
                }}
                placeholder="e.g. The amount doesn't match my expected commission..."
                rows={3}
                className="mt-1.5"
              />
              {reasonError && (
                <p className="text-xs text-red-600 mt-1">{reasonError}</p>
              )}
            </div>
            <div>
              <Label htmlFor="details">Additional details (optional)</Label>
              <Textarea
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Any other information that may help our team..."
                rows={3}
                className="mt-1.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDisputeOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitDispute}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliatePayouts;
