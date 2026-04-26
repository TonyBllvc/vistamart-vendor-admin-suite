import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Loader2, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const ROLE_ACCESS_OPTIONS = [
  { key: "manage_account", label: "Manage Account" },
  { key: "customer_care", label: "Customer Care" },
  { key: "manage_brand", label: "Manage Brand" },
  { key: "manage_category", label: "Manage Category" },
  { key: "manage_product", label: "Manage Product" },
  { key: "manage_orders", label: "Manage Orders" },
  { key: "manage_users", label: "Manage Users" },
  { key: "manage_session_users", label: "Manage Session Users" },
  { key: "manage_affiliates", label: "Manage Affiliates" },
  { key: "manage_vendors", label: "Manage Vendors" },
  { key: "manage_reviews", label: "Manage Reviews" },
  { key: "manage_report", label: "Manage Report" },
  { key: "manage_settings", label: "Manage Settings" },
  { key: "manage_announcement", label: "Manage Announcement" },
  { key: "manage_faq", label: "Manage FAQ" },
  { key: "manage_contact_us", label: "Manage Contact Us" },
  { key: "manage_feedback", label: "Manage Feedback" },
  { key: "manage_chat", label: "Manage Chat" },
  { key: "manage_blog", label: "Manage Blog" },
  { key: "manage_market_place", label: "Manage Market Place" },
  { key: "manage_wallet", label: "Manage Wallet" },
  { key: "manage_transaction", label: "Manage Transaction" },
] as const;

export type RoleAccessKey = (typeof ROLE_ACCESS_OPTIONS)[number]["key"];

interface RoleAccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  authorId: string;
  username: string;
  /** Optional preset of currently-granted permissions. If omitted, a mock load is simulated. */
  initialAccess?: RoleAccessKey[];
  onSaved?: (access: RoleAccessKey[]) => void;
}

const setsEqual = (a: Set<string>, b: Set<string>) => {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
};

export const RoleAccessDialog = ({
  open,
  onOpenChange,
  authorId,
  username,
  initialAccess,
  onSaved,
}: RoleAccessDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [original, setOriginal] = useState<Set<RoleAccessKey>>(new Set());
  const [selected, setSelected] = useState<Set<RoleAccessKey>>(new Set());

  // Load current role_access when dialog opens
  useEffect(() => {
    if (!open) return;
    setError(null);
    setLoading(true);

    // Simulate GET current role_access (replace with real fetch)
    const presetKeys = (initialAccess ?? [
      "manage_blog",
      "manage_announcement",
      "manage_faq",
      "manage_feedback",
    ]) as RoleAccessKey[];

    const t = setTimeout(() => {
      const preset = new Set<RoleAccessKey>(presetKeys);
      setOriginal(preset);
      setSelected(new Set(preset));
      setLoading(false);
    }, 450);

    return () => clearTimeout(t);
  }, [open, authorId, initialAccess]);

  const isModified = useMemo(
    () => !setsEqual(original as Set<string>, selected as Set<string>),
    [original, selected],
  );

  const allSelected = selected.size === ROLE_ACCESS_OPTIONS.length;
  const noneSelected = selected.size === 0;

  const toggle = (key: RoleAccessKey, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  };

  const selectAll = () =>
    setSelected(new Set(ROLE_ACCESS_OPTIONS.map((o) => o.key)));
  const deselectAll = () => setSelected(new Set());

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Simulate PATCH /account/role-access/<author_id>/
      await new Promise((res) => setTimeout(res, 900));
      // Randomly fail in dev to demo error state — disabled by default:
      // if (Math.random() < 0.15) throw new Error("Server error");

      const finalAccess = Array.from(selected);
      toast({
        title: "Permissions updated",
        description: `Saved ${finalAccess.length} permission${
          finalAccess.length === 1 ? "" : "s"
        } for @${username}.`,
      });
      onSaved?.(finalAccess);
      onOpenChange(false);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not save permissions. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (saving) return; // prevent closing mid-save
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-br from-purple-500/10 to-transparent p-6 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-lg">
                Manage Role Access —{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  @{username}
                </span>
              </DialogTitle>
              <DialogDescription>
                Select the platform modules this Author can manage.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6">
          <Alert className="border-warning/30 bg-warning/10">
            <Info className="h-4 w-4 text-warning" />
            <AlertDescription className="text-foreground">
              Saving will <strong>replace all existing permissions</strong> for
              this Author.
            </AlertDescription>
          </Alert>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 px-6 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary" className="font-mono">
              {selected.size}/{ROLE_ACCESS_OPTIONS.length}
            </Badge>
            <span>permissions selected</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              disabled={loading || saving || allSelected}
            >
              Select All
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <Button
              variant="ghost"
              size="sm"
              onClick={deselectAll}
              disabled={loading || saving || noneSelected}
            >
              Deselect All
            </Button>
          </div>
        </div>

        <ScrollArea className="max-h-[45vh] px-6 pt-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-6">
            {loading
              ? Array.from({ length: ROLE_ACCESS_OPTIONS.length }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg border bg-card p-3"
                    >
                      <Skeleton className="h-4 w-4 rounded-sm" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ),
                )
              : ROLE_ACCESS_OPTIONS.map((opt) => {
                  const checked = selected.has(opt.key);
                  return (
                    <label
                      key={opt.key}
                      htmlFor={`ra-${opt.key}`}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-accent/40",
                        checked && "border-primary/40 bg-primary/5",
                        saving && "pointer-events-none opacity-70",
                      )}
                    >
                      <Checkbox
                        id={`ra-${opt.key}`}
                        checked={checked}
                        onCheckedChange={(v) => toggle(opt.key, v === true)}
                        disabled={saving}
                      />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  );
                })}
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col items-stretch gap-3 border-t bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-0">
          <div className="min-h-[1.25rem] text-sm">
            {error ? (
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            ) : isModified && !loading ? (
              <span className="text-muted-foreground">Unsaved changes</span>
            ) : null}
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || saving || !isModified}
              className="min-w-[140px]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleAccessDialog;
