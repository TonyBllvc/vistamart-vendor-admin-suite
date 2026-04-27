import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  Loader2,
  ShieldOff,
  TriangleAlert,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import type { AccountDetails } from "./AccountDetailsDialog";

type SuspensionType = "temporary" | "permanent";

interface SuspendAccountDialogProps {
  account: AccountDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const REASON_MIN = 10;
const REASON_MAX = 500;

export const SuspendAccountDialog = ({
  account,
  open,
  onOpenChange,
  onSuccess,
}: SuspendAccountDialogProps) => {
  const { toast } = useToast();
  const [type, setType] = useState<SuspensionType>("temporary");
  const [expiresDate, setExpiresDate] = useState<Date | undefined>();
  const [expiresTime, setExpiresTime] = useState<string>("23:59");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state whenever the dialog (re)opens
  useEffect(() => {
    if (open) {
      setType("temporary");
      setExpiresDate(undefined);
      setExpiresTime("23:59");
      setReason("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const expiresAtIso = useMemo(() => {
    if (type !== "temporary" || !expiresDate) return null;
    const [hh, mm] = expiresTime.split(":").map(Number);
    const d = new Date(expiresDate);
    d.setHours(hh ?? 0, mm ?? 0, 0, 0);
    return d.toISOString();
  }, [type, expiresDate, expiresTime]);

  const reasonValid =
    reason.trim().length >= REASON_MIN && reason.trim().length <= REASON_MAX;

  const expiresValid =
    type === "permanent" ||
    (expiresAtIso !== null && new Date(expiresAtIso).getTime() > Date.now());

  const canSubmit = reasonValid && expiresValid && !submitting;

  if (!account) return null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);

    // POST /account/suspend/
    // Body: { account, suspension_type, reason, expires_at? }
    try {
      await new Promise((res, rej) =>
        setTimeout(() => {
          // Simulate occasional error if reason contains the word "fail"
          if (reason.toLowerCase().includes("simulate-error")) {
            rej(new Error("Server error: could not suspend the account."));
          } else {
            res(null);
          }
        }, 900),
      );

      toast({
        title: "Account suspended successfully.",
        description: `${account.fullName} has been ${
          type === "permanent" ? "permanently" : "temporarily"
        } suspended.`,
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
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="bg-destructive/5 border-b px-6 pt-6 pb-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldOff className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg">Suspend Account</DialogTitle>
              <DialogDescription>
                Restrict this user's access to the platform.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Target account info strip */}
          <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold">
              {initials(account.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{account.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {account.email}
              </p>
            </div>
            <Badge variant="outline" className="capitalize shrink-0">
              {account.role}
            </Badge>
          </div>

          {/* Suspension Type */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Suspension Type <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as SuspensionType)}
              className="gap-2"
              disabled={submitting}
            >
              <label
                htmlFor="suspend-temp"
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                  type === "temporary"
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/40",
                )}
              >
                <RadioGroupItem
                  value="temporary"
                  id="suspend-temp"
                  className="mt-0.5"
                />
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Temporary</p>
                  <p className="text-xs text-muted-foreground">
                    Account is automatically restored after the chosen date.
                  </p>
                </div>
              </label>

              <label
                htmlFor="suspend-perm"
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                  type === "permanent"
                    ? "border-destructive bg-destructive/5"
                    : "hover:bg-muted/40",
                )}
              >
                <RadioGroupItem
                  value="permanent"
                  id="suspend-perm"
                  className="mt-0.5 border-destructive text-destructive"
                />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">
                    Permanent
                  </p>
                  <p className="text-xs text-destructive/80 flex items-center gap-1.5">
                    <TriangleAlert className="h-3 w-3" />
                    This ban has no expiry and must be manually lifted.
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Expires At — animated reveal */}
          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              type === "temporary"
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Expires At <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={submitting}
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !expiresDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiresDate ? (
                          format(expiresDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={expiresDate}
                        onSelect={setExpiresDate}
                        disabled={(d) => d < new Date(new Date().toDateString())}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={expiresTime}
                    onChange={(e) => setExpiresTime(e.target.value)}
                    disabled={submitting}
                    className="w-32"
                  />
                </div>
                {type === "temporary" && expiresAtIso && !expiresValid && (
                  <p className="text-xs text-destructive">
                    Expiration must be in the future.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="suspend-reason" className="text-sm font-medium">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="suspend-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, REASON_MAX))}
              placeholder="Explain why this account is being suspended. This is recorded in the audit log."
              rows={4}
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suspending…
                </>
              ) : (
                <>
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Confirm Suspend
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendAccountDialog;
