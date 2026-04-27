import { useEffect, useState } from "react";
import { AlertCircle, Info, Loader2, LogOut, AtSign } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import type { AccountDetails } from "./AccountDetailsDialog";

interface ForceLogoutDialogProps {
  account: AccountDetails | null;
  /** Number of active sessions for this account; 0 triggers the no-sessions info state. */
  activeSessionCount?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const REASON_MIN = 5;
const REASON_MAX = 300;

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const ForceLogoutDialog = ({
  account,
  activeSessionCount = 2,
  open,
  onOpenChange,
  onSuccess,
}: ForceLogoutDialogProps) => {
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setReason("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!account) return null;

  const hasSessions = activeSessionCount > 0;
  const reasonValid =
    reason.trim().length >= REASON_MIN && reason.trim().length <= REASON_MAX;
  const canSubmit = reasonValid && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    // POST /account/force-logout/
    // Body: { account_id, reason }
    try {
      await new Promise((res, rej) =>
        setTimeout(() => {
          if (reason.toLowerCase().includes("simulate-error")) {
            rej(new Error("Server error: could not terminate sessions."));
          } else {
            res(null);
          }
        }, 800),
      );

      toast({
        title: hasSessions
          ? `${activeSessionCount} session${activeSessionCount === 1 ? "" : "s"} terminated.`
          : "Audit entry recorded.",
        description: `${account.fullName} (@${account.username})`,
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (submitting) return;
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="bg-warning/5 border-b px-6 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/15 text-warning">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg flex items-center gap-1.5 truncate">
                Force Logout
                <span className="text-muted-foreground font-normal">—</span>
                <span className="inline-flex items-center text-base text-muted-foreground truncate">
                  <AtSign className="h-3.5 w-3.5 mr-0.5" />
                  {account.username}
                </span>
              </DialogTitle>
              <DialogDescription className="mt-0.5">
                Terminate every active session for this account.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4">
          {/* Warning / info banner */}
          {hasSessions ? (
            <div className="flex items-start gap-2.5 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-warning" />
              <div className="space-y-1">
                <p className="text-foreground">
                  This will immediately terminate all active sessions for this
                  account across all devices. They will need to log in again.
                </p>
                <Badge
                  variant="outline"
                  className="border-warning/40 text-warning bg-warning/10"
                >
                  {activeSessionCount} active session
                  {activeSessionCount === 1 ? "" : "s"}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 rounded-md border bg-muted/40 p-3 text-sm">
              <Info className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <p className="text-muted-foreground">
                This account has no active sessions to terminate. You can still
                confirm to record an entry in the audit trail.
              </p>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="logout-reason" className="text-sm font-medium">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="logout-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, REASON_MAX))}
              placeholder="Used for the audit trail (e.g. suspicious activity, password reset, user request)."
              rows={3}
              disabled={submitting}
              className="resize-none"
            />
            <div className="flex items-center justify-between text-xs">
              <span
                className={cn(
                  "text-muted-foreground",
                  reason.length > 0 &&
                    reason.trim().length < REASON_MIN &&
                    "text-destructive",
                )}
              >
                Minimum {REASON_MIN} characters.
              </span>
              <span
                className={cn(
                  "text-muted-foreground tabular-nums",
                  reason.length >= REASON_MAX && "text-destructive",
                )}
              >
                {reason.length}/{REASON_MAX}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-muted/30 px-6 py-4 space-y-3">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Terminating…
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Force Logout
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForceLogoutDialog;
