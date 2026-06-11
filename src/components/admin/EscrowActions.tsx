import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Snowflake, Unlock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  orderId: string;
  lineItemCount?: number;
  onFrozen?: (reason: string) => void;
}

export function EscrowActions({ orderId, lineItemCount = 1, onFrozen }: Props) {
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [freezeOpen, setFreezeOpen] = useState(false);
  const [releaseReason, setReleaseReason] = useState("");
  const [freezeReason, setFreezeReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const doRelease = () => {
    if (!releaseReason.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      toast.success(`${lineItemCount} line item(s) escrow released.`);
      setSubmitting(false);
      setReleaseOpen(false);
      setReleaseReason("");
    }, 600);
  };

  const doFreeze = () => {
    if (!freezeReason.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      onFrozen?.(freezeReason);
      toast.success("Escrow frozen for this order.");
      setSubmitting(false);
      setFreezeOpen(false);
      setFreezeReason("");
    }, 600);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" onClick={() => setReleaseOpen(true)}>
          <Unlock className="h-4 w-4 mr-2" />Force Release Escrow
        </Button>
        <Button variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50" onClick={() => setFreezeOpen(true)}>
          <Snowflake className="h-4 w-4 mr-2" />Freeze Escrow
        </Button>
      </div>

      <Dialog open={releaseOpen} onOpenChange={setReleaseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Force-Release Escrow</DialogTitle>
            <DialogDescription>
              Escrow funds will be released to the vendor(s) for all paid line items. This bypasses the buyer confirmation requirement.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for force release (audit trail) *</label>
            <Textarea value={releaseReason} onChange={(e) => setReleaseReason(e.target.value)} placeholder="Explain why escrow is being released..." rows={4} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReleaseOpen(false)}>Cancel</Button>
            <Button className="bg-green-600 hover:bg-green-700" disabled={!releaseReason.trim() || submitting} onClick={doRelease}>
              {submitting ? "Releasing..." : "Release Escrow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={freezeOpen} onOpenChange={setFreezeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freeze Escrow for This Order</DialogTitle>
            <DialogDescription>
              Escrow funds will be held and automatic release will be paused.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for freeze (e.g. dispute opened) *</label>
            <Textarea value={freezeReason} onChange={(e) => setFreezeReason(e.target.value)} placeholder="Explain why escrow is being frozen..." rows={4} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFreezeOpen(false)}>Cancel</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white" disabled={!freezeReason.trim() || submitting} onClick={doFreeze}>
              {submitting ? "Freezing..." : "Freeze"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function EscrowFrozenBanner({ reason }: { reason: string }) {
  return (
    <div className="rounded-md border border-amber-300 bg-amber-50 p-3 flex items-start gap-2 text-amber-900">
      <AlertTriangle className="h-4 w-4 mt-0.5" />
      <div className="text-sm"><span className="font-medium">Escrow frozen</span> — {reason}</div>
    </div>
  );
}
