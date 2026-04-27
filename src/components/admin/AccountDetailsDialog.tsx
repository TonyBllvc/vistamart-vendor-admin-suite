import { useState } from "react";
import {
  Mail,
  AtSign,
  Calendar,
  Clock,
  Shield,
  Pencil,
  LogOut,
  ShieldOff,
  UserX2,
  KeyRound,
  Trash2,
  CheckCircle2,
  IdCard,
  MapPin,
  Phone,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { RoleAccessDialog } from "@/components/admin/RoleAccessDialog";
import { SuspendAccountDialog } from "@/components/admin/SuspendAccountDialog";
import { ForceLogoutDialog } from "@/components/admin/ForceLogoutDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AccountStatus =
  | "Active"
  | "Locked"
  | "Banned"
  | "Suspended"
  | "Pending Deletion";

export interface AccountDetails {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "admin" | "author" | "vendor" | "affiliate" | "user";
  status: AccountStatus;
  joined: string;
  lastLogin: string;
  phone?: string;
  location?: string;
}

interface AccountDetailsDialogProps {
  account: AccountDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleBadgeClass: Record<AccountDetails["role"], string> = {
  admin: "bg-primary/10 text-primary border-primary/20",
  author:
    "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  vendor: "bg-success/10 text-success border-success/20",
  affiliate: "bg-warning/10 text-warning border-warning/20",
  user: "bg-muted text-muted-foreground border-border",
};

const statusBadgeClass: Record<AccountStatus, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Locked: "bg-warning/15 text-warning border-warning/30",
  Banned: "bg-destructive/10 text-destructive border-destructive/20",
  Suspended: "bg-destructive/10 text-destructive border-destructive/20",
  "Pending Deletion":
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

type ConfirmAction =
  | "ban"
  | "delete"
  | "reset-password"
  | "activate"
  | null;

const confirmCopy: Record<
  Exclude<ConfirmAction, null>,
  {
    title: string;
    description: string;
    confirmLabel: string;
    destructive: boolean;
    successMessage: string;
  }
> = {
  ban: {
    title: "Ban this account permanently?",
    description:
      "Banned users cannot sign in, recover their account, or contact support through the platform. This action is reversible by an admin.",
    confirmLabel: "Ban Account",
    destructive: true,
    successMessage: "Account banned.",
  },
  delete: {
    title: "Mark account for deletion?",
    description:
      "The account will enter a 30-day deletion grace period. After 30 days, all data is permanently removed and cannot be recovered.",
    confirmLabel: "Mark for Deletion",
    destructive: true,
    successMessage: "Account marked for deletion.",
  },
  "reset-password": {
    title: "Send password reset email?",
    description:
      "A reset link will be emailed to the user. The link expires in 30 minutes.",
    confirmLabel: "Send Reset Email",
    destructive: false,
    successMessage: "Password reset email sent.",
  },
  activate: {
    title: "Reactivate this account?",
    description:
      "The user will regain full access to the platform immediately.",
    confirmLabel: "Reactivate",
    destructive: false,
    successMessage: "Account reactivated.",
  },
};

export const AccountDetailsDialog = ({
  account,
  open,
  onOpenChange,
}: AccountDetailsDialogProps) => {
  const { toast } = useToast();
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const [roleAccessOpen, setRoleAccessOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [forceLogoutOpen, setForceLogoutOpen] = useState(false);

  if (!account) return null;

  const onConfirm = () => {
    if (!confirm) return;
    toast({
      title: confirmCopy[confirm].successMessage,
      description: `${account.fullName} (${account.email})`,
    });
    setConfirm(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {/* Header */}
          <DialogHeader className="bg-gradient-to-br from-primary/5 to-transparent p-6 pb-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-lg font-semibold shadow-md">
                {initials(account.fullName)}
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl truncate">
                  {account.fullName}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <AtSign className="h-3.5 w-3.5" />
                  <span className="truncate">{account.username}</span>
                </DialogDescription>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", roleBadgeClass[account.role])}
                  >
                    <Shield className="mr-1 h-3 w-3" />
                    {account.role}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={statusBadgeClass[account.status]}
                  >
                    {account.status}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    <IdCard className="mr-1 h-3 w-3" />
                    {account.id}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[55vh]">
            <div className="px-6 pb-6 space-y-6">
              {/* Contact info */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Contact
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoRow
                    icon={<Mail className="h-4 w-4" />}
                    label="Email"
                    value={account.email}
                  />
                  <InfoRow
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone"
                    value={account.phone ?? "Not provided"}
                  />
                  <InfoRow
                    icon={<MapPin className="h-4 w-4" />}
                    label="Location"
                    value={account.location ?? "Not provided"}
                  />
                  <InfoRow
                    icon={<AtSign className="h-4 w-4" />}
                    label="Username"
                    value={`@${account.username}`}
                  />
                </div>
              </section>

              <Separator />

              {/* Activity */}
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Activity
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoRow
                    icon={<Calendar className="h-4 w-4" />}
                    label="Date Joined"
                    value={account.joined}
                  />
                  <InfoRow
                    icon={<Clock className="h-4 w-4" />}
                    label="Last Login"
                    value={account.lastLogin}
                  />
                  <InfoRow
                    icon={<Activity className="h-4 w-4" />}
                    label="Sessions"
                    value="2 active"
                  />
                  <InfoRow
                    icon={<CheckCircle2 className="h-4 w-4" />}
                    label="Email Verified"
                    value="Verified"
                  />
                </div>
              </section>
            </div>
          </ScrollArea>

          {/* Actions */}
          <DialogFooter className="border-t bg-muted/30 p-4 sm:flex-col sm:items-stretch sm:space-x-0 gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button variant="outline" size="sm">
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Button>
              {account.role === "author" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/40 text-primary hover:bg-primary/10 hover:text-primary"
                  onClick={() => setRoleAccessOpen(true)}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" /> Edit Role Access
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirm("reset-password")}
              >
                <KeyRound className="mr-2 h-4 w-4" /> Reset Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setForceLogoutOpen(true)}
              >
                <LogOut className="mr-2 h-4 w-4" /> Force Logout
              </Button>
              {account.status !== "Active" ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-success/40 text-success hover:bg-success/10 hover:text-success"
                  onClick={() => setConfirm("activate")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Reactivate
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
                  onClick={() => setSuspendOpen(true)}
                >
                  <ShieldOff className="mr-2 h-4 w-4" /> Suspend
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setConfirm("ban")}
              >
                <UserX2 className="mr-2 h-4 w-4" /> Ban
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setConfirm("delete")}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirm !== null}
        onOpenChange={(o) => !o && setConfirm(null)}
      >
        <AlertDialogContent>
          {confirm && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{confirmCopy[confirm].title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmCopy[confirm].description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onConfirm}
                  className={cn(
                    confirmCopy[confirm].destructive &&
                      "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  )}
                >
                  {confirmCopy[confirm].confirmLabel}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      {account.role === "author" && (
        <RoleAccessDialog
          open={roleAccessOpen}
          onOpenChange={setRoleAccessOpen}
          authorId={account.id}
          username={account.username}
        />
      )}

      <SuspendAccountDialog
        account={account}
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
      />
    </>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
    <div className="mt-0.5 text-muted-foreground">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium truncate">{value}</p>
    </div>
  </div>
);

export default AccountDetailsDialog;
