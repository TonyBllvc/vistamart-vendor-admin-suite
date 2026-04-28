import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Loader2,
  LogOut,
  Pencil,
  ShieldOff,
  CalendarIcon,
  Users,
  Info,
} from "lucide-react";
import { format } from "date-fns";

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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

/* ------------------------------- Shared types ------------------------------ */

export interface BulkAccount {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  status: string;
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const SelectedAccountsStrip = ({ accounts }: { accounts: BulkAccount[] }) => (
  <div className="rounded-md border bg-muted/30">
    <div className="flex items-center gap-2 border-b px-3 py-2 text-xs font-medium text-muted-foreground">
      <Users className="h-3.5 w-3.5" />
      {accounts.length} selected account{accounts.length === 1 ? "" : "s"}
    </div>
    <ScrollArea className="max-h-36">
      <ul className="divide-y">
        {accounts.map((a) => (
          <li key={a.id} className="flex items-center gap-2.5 px-3 py-2 text-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-semibold text-primary-foreground">
              {initials(a.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium leading-tight">{a.fullName}</p>
              <p className="truncate text-xs text-muted-foreground">
                @{a.username} · {a.email}
              </p>
            </div>
            <Badge variant="outline" className="capitalize text-[10px]">
              {a.role}
            </Badge>
          </li>
        ))}
      </ul>
    </ScrollArea>
  </div>
);

interface BaseProps {
  accounts: BulkAccount[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/* ------------------------------ Bulk: Edit --------------------------------- */

export const BulkEditDialog = ({
  accounts,
  open,
  onOpenChange,
  onSuccess,
}: BaseProps) => {
  const { toast } = useToast();
  const [changeRole, setChangeRole] = useState(false);
  const [role, setRole] = useState("user");
  const [changeStatus, setChangeStatus] = useState(false);
  const [status, setStatus] = useState("Active");
  const [changeVerified, setChangeVerified] = useState(false);
  const [verified, setVerified] = useState(true);
  const [changeActive, setChangeActive] = useState(false);
  const [active, setActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setChangeRole(false);
      setChangeStatus(false);
      setChangeVerified(false);
      setChangeActive(false);
      setRole("user");
      setStatus("Active");
      setVerified(true);
      setActive(true);
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  const hasChanges =
    changeRole || changeStatus || changeVerified || changeActive;

  const submit = async () => {
    if (!hasChanges || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 900));
      toast({
        title: `${accounts.length} account${accounts.length === 1 ? "" : "s"} updated`,
        description: "Bulk changes applied successfully.",
      });
      onSuccess?.();
      onOpenChange(false);
    } catch {
      setError("Failed to apply changes. Please try again.");
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
        <DialogHeader className="bg-primary/5 border-b px-6 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Pencil className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg">Edit Selected Accounts</DialogTitle>
              <DialogDescription className="mt-0.5">
                Apply the same changes to all selected accounts.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <SelectedAccountsStrip accounts={accounts} />

          <div className="flex items-start gap-2.5 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Only fields you enable below will be updated. Unchecked fields
              remain unchanged on each account.
            </p>
          </div>

          <div className="space-y-3">
            {/* Role */}
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Checkbox
                    checked={changeRole}
                    onCheckedChange={(c) => setChangeRole(Boolean(c))}
                  />
                  Change Role
                </label>
                <Select value={role} onValueChange={setRole} disabled={!changeRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="affiliate">Affiliate</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="rounded-md border p-3">
              <div className="flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Checkbox
                    checked={changeStatus}
                    onCheckedChange={(c) => setChangeStatus(Boolean(c))}
                  />
                  Change Status
                </label>
                <Select
                  value={status}
                  onValueChange={setStatus}
                  disabled={!changeStatus}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Locked">Locked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Verified */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={changeVerified}
                  onCheckedChange={(c) => setChangeVerified(Boolean(c))}
                />
                Set Verified
              </label>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    checked={verified}
                    disabled={!changeVerified}
                    onChange={() => setVerified(true)}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    checked={!verified}
                    disabled={!changeVerified}
                    onChange={() => setVerified(false)}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Active */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={changeActive}
                  onCheckedChange={(c) => setChangeActive(Boolean(c))}
                />
                Set Active
              </label>
              <div className="flex items-center gap-4 text-sm">
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    checked={active}
                    disabled={!changeActive}
                    onChange={() => setActive(true)}
                  />
                  Enabled
                </label>
                <label className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    checked={!active}
                    disabled={!changeActive}
                    onChange={() => setActive(false)}
                  />
                  Disabled
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t bg-muted/30 px-6 py-4">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={submit} disabled={!hasChanges || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Apply to {accounts.length}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* --------------------------- Bulk: Force Logout ---------------------------- */

const REASON_MIN = 5;
const REASON_MAX = 300;

export const BulkForceLogoutDialog = ({
  accounts,
  open,
  onOpenChange,
  onSuccess,
}: BaseProps) => {
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

  const valid =
    reason.trim().length >= REASON_MIN && reason.trim().length <= REASON_MAX;

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await new Promise((res, rej) =>
        setTimeout(() => {
          if (reason.toLowerCase().includes("simulate-error")) {
            rej(new Error("Server error: could not terminate sessions."));
          } else res(null);
        }, 900),
      );
      toast({
        title: `Sessions terminated for ${accounts.length} account${accounts.length === 1 ? "" : "s"}.`,
        description: "Audit trail entries have been recorded.",
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again.",
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
        <DialogHeader className="bg-warning/5 border-b px-6 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-warning/15 text-warning">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg">
                Force Logout Selected
              </DialogTitle>
              <DialogDescription className="mt-0.5">
                Terminate every active session for these accounts.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <SelectedAccountsStrip accounts={accounts} />

          <div className="flex items-start gap-2.5 rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p>
              This immediately logs out all selected accounts across every
              device. Users will need to sign in again.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulk-logout-reason" className="text-sm font-medium">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="bulk-logout-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, REASON_MAX))}
              placeholder="Used for the audit trail (e.g. suspicious activity, security incident)."
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
              <span className="text-muted-foreground tabular-nums">
                {reason.length}/{REASON_MAX}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t bg-muted/30 px-6 py-4">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={!valid || submitting}
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
                  Force Logout {accounts.length}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* ----------------------------- Bulk: Suspend ------------------------------- */

export const BulkSuspendDialog = ({
  accounts,
  open,
  onOpenChange,
  onSuccess,
}: BaseProps) => {
  const { toast } = useToast();
  const [suspensionType, setSuspensionType] = useState<"temporary" | "permanent">(
    "temporary",
  );
  const [expiresAt, setExpiresAt] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSuspensionType("temporary");
      setExpiresAt(undefined);
      setReason("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const reasonValid =
    reason.trim().length >= 10 && reason.trim().length <= 500;
  const expiryValid = suspensionType === "permanent" || !!expiresAt;
  const valid = reasonValid && expiryValid;

  const submit = async () => {
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await new Promise((res, rej) =>
        setTimeout(() => {
          if (reason.toLowerCase().includes("simulate-error")) {
            rej(new Error("Server error: could not suspend accounts."));
          } else res(null);
        }, 900),
      );
      toast({
        title: `${accounts.length} account${accounts.length === 1 ? "" : "s"} suspended.`,
        description:
          suspensionType === "permanent"
            ? "Permanent suspension applied."
            : `Suspended until ${expiresAt ? format(expiresAt, "PPP") : ""}.`,
      });
      onSuccess?.();
      onOpenChange(false);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Something went wrong. Please try again.",
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
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/15 text-destructive">
              <ShieldOff className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg">Suspend Selected</DialogTitle>
              <DialogDescription className="mt-0.5">
                Suspend all selected accounts at once.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <SelectedAccountsStrip accounts={accounts} />

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Suspension Type <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={suspensionType}
              onValueChange={(v) =>
                setSuspensionType(v as "temporary" | "permanent")
              }
              className="grid gap-2 sm:grid-cols-2"
            >
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 rounded-md border p-3 text-sm",
                  suspensionType === "temporary" && "border-primary bg-primary/5",
                )}
              >
                <RadioGroupItem value="temporary" className="mt-0.5" />
                <div>
                  <p className="font-medium">Temporary</p>
                  <p className="text-xs text-muted-foreground">
                    Auto-lifts on expiry date.
                  </p>
                </div>
              </label>
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 rounded-md border p-3 text-sm",
                  suspensionType === "permanent" &&
                    "border-destructive bg-destructive/5",
                )}
              >
                <RadioGroupItem value="permanent" className="mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Permanent</p>
                  <p className="text-xs text-muted-foreground">
                    No expiry. Must be manually lifted.
                  </p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {suspensionType === "temporary" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Expires At <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expiresAt && "text-muted-foreground",
                    )}
                    disabled={submitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expiresAt ? format(expiresAt, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={expiresAt}
                    onSelect={setExpiresAt}
                    disabled={(d) => d < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bulk-suspend-reason" className="text-sm font-medium">
              Reason <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="bulk-suspend-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              placeholder="Explain why these accounts are being suspended (10–500 chars)."
              rows={3}
              disabled={submitting}
              className="resize-none"
            />
            <div className="flex items-center justify-between text-xs">
              <span
                className={cn(
                  "text-muted-foreground",
                  reason.length > 0 && !reasonValid && "text-destructive",
                )}
              >
                Minimum 10 characters.
              </span>
              <span className="text-muted-foreground tabular-nums">
                {reason.length}/500
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t bg-muted/30 px-6 py-4">
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={submit}
              disabled={!valid || submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suspending…
                </>
              ) : (
                <>
                  <ShieldOff className="mr-2 h-4 w-4" />
                  Suspend {accounts.length}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
