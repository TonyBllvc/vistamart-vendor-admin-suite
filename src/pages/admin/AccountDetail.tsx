import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Mail,
  AtSign,
  Calendar as CalendarIcon,
  Clock,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldOff,
  ShieldAlert,
  KeyRound,
  Lock,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
  Building2,
  AlertTriangle,
  Info,
  LogOut,
  Trash2,
  Pencil,
  Save,
  X as XIcon,
  IdCard,
  History,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RoleAccessDialog } from "@/components/admin/RoleAccessDialog";
import { SuspendAccountDialog } from "@/components/admin/SuspendAccountDialog";
import { ForceLogoutDialog } from "@/components/admin/ForceLogoutDialog";
import type { AccountDetails } from "@/components/admin/AccountDetailsDialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AccountStatus =
  | "Active"
  | "Locked"
  | "Banned"
  | "Suspended"
  | "Pending Deletion";

type RoleKey = "admin" | "author" | "vendor" | "affiliate" | "user";

interface FullAccount extends AccountDetails {
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other" | "unspecified";
  authProvider: "Email" | "Google" | "Apple";
  isVerified: boolean;
  isActive: boolean;
  isLocked: boolean;
  isBanned: boolean;
  bannedTill?: string;
  lastUpdated: string;
  flagMessage?: string;
  systemMessage?: string;
  bio?: {
    address: string;
    phone: string;
    bankName: string;
    accountNumberMasked: string;
  };
  roleAccess?: string[];
  hasPendingDeletion?: boolean;
}

// Mock seed — in real app this would come from GET AccountProfileSerializer
const MOCK_ACCOUNTS: Record<string, FullAccount> = {
  acc_001: {
    id: "acc_001",
    fullName: "Adaeze Okafor",
    firstName: "Adaeze",
    lastName: "Okafor",
    username: "adaezeo",
    email: "adaeze@primemart.io",
    role: "admin",
    status: "Active",
    joined: "2023-04-12",
    lastLogin: "2026-04-23 09:21",
    lastUpdated: "2026-04-20 14:02",
    gender: "female",
    authProvider: "Email",
    isVerified: true,
    isActive: true,
    isLocked: false,
    isBanned: false,
    phone: "+234 803 555 0102",
    location: "Lagos, NG",
    systemMessage:
      "This account has Superuser privileges granted on 2024-09-10.",
  },
  acc_002: {
    id: "acc_002",
    fullName: "Marcus Bell",
    firstName: "Marcus",
    lastName: "Bell",
    username: "mbell",
    email: "marcus.bell@primemart.io",
    role: "author",
    status: "Active",
    joined: "2023-08-02",
    lastLogin: "2026-04-22 18:04",
    lastUpdated: "2026-03-12 09:00",
    gender: "male",
    authProvider: "Google",
    isVerified: true,
    isActive: true,
    isLocked: false,
    isBanned: false,
    phone: "+234 802 222 9988",
    location: "Abuja, NG",
    roleAccess: ["Manage Blog", "Manage Brand", "Manage Category"],
  },
  acc_003: {
    id: "acc_003",
    fullName: "TechHub NG",
    firstName: "TechHub",
    lastName: "NG",
    username: "techhub",
    email: "ops@techhub.ng",
    role: "vendor",
    status: "Active",
    joined: "2024-01-19",
    lastLogin: "2026-04-23 07:55",
    lastUpdated: "2026-04-22 11:14",
    gender: "unspecified",
    authProvider: "Email",
    isVerified: true,
    isActive: true,
    isLocked: false,
    isBanned: false,
    phone: "+234 701 444 1010",
    location: "Lagos, NG",
    bio: {
      address: "23 Awolowo Road, Ikoyi, Lagos",
      phone: "+234 701 444 1010",
      bankName: "Access Bank",
      accountNumberMasked: "****8821",
    },
  },
  acc_004: {
    id: "acc_004",
    fullName: "Lola Adekunle",
    firstName: "Lola",
    lastName: "Adekunle",
    username: "lola.a",
    email: "lola@influence.co",
    role: "affiliate",
    status: "Suspended",
    joined: "2024-03-04",
    lastLogin: "2026-03-30 14:11",
    lastUpdated: "2026-04-01 10:00",
    gender: "female",
    authProvider: "Email",
    isVerified: true,
    isActive: false,
    isLocked: false,
    isBanned: false,
    flagMessage:
      "Account suspended until 2026-05-15 — repeated promotional spam in messaging.",
  },
  acc_007: {
    id: "acc_007",
    fullName: "FashionLane",
    firstName: "Fashion",
    lastName: "Lane",
    username: "fashionlane",
    email: "support@fashionlane.com",
    role: "vendor",
    status: "Pending Deletion",
    joined: "2023-11-30",
    lastLogin: "2026-04-10 10:00",
    lastUpdated: "2026-04-12 16:00",
    gender: "unspecified",
    authProvider: "Email",
    isVerified: true,
    isActive: true,
    isLocked: false,
    isBanned: false,
    hasPendingDeletion: true,
    flagMessage: "Deletion requested by account owner on 2026-04-12.",
    bio: {
      address: "14 Allen Avenue, Ikeja, Lagos",
      phone: "+234 805 999 1212",
      bankName: "GTBank",
      accountNumberMasked: "****4477",
    },
  },
};

const FALLBACK: FullAccount = {
  id: "acc_unknown",
  fullName: "Unknown Account",
  firstName: "Unknown",
  lastName: "Account",
  username: "unknown",
  email: "unknown@primemart.io",
  role: "user",
  status: "Active",
  joined: "—",
  lastLogin: "—",
  lastUpdated: "—",
  gender: "unspecified",
  authProvider: "Email",
  isVerified: false,
  isActive: true,
  isLocked: false,
  isBanned: false,
};

const roleBadgeClass: Record<RoleKey, string> = {
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

interface SuspensionEntry {
  id: string;
  date: string;
  type: "Temporary" | "Permanent";
  reason: string;
  by: string;
  status: "Lifted" | "Active" | "Expired";
  liftedAt?: string;
}

const MOCK_SUSPENSION_HISTORY: SuspensionEntry[] = [
  {
    id: "s1",
    date: "2026-04-01",
    type: "Temporary",
    reason: "Repeated promotional spam in messaging.",
    by: "Adaeze Okafor",
    status: "Active",
  },
  {
    id: "s2",
    date: "2025-11-10",
    type: "Temporary",
    reason: "Suspicious login from 4 different countries within 1 hour.",
    by: "Daniel Onuoha",
    status: "Lifted",
    liftedAt: "2025-11-12",
  },
];

// --- Component ---

const AccountDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // For demo: simulate loading once on mount
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal states
  const [roleAccessOpen, setRoleAccessOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [forceLogoutOpen, setForceLogoutOpen] = useState(false);

  // Banned date popover
  const [bannedDateOpen, setBannedDateOpen] = useState(false);

  // Pretend the current admin is NOT a superuser for demo of locked admin edit
  const currentAdminIsSuperuser = false;

  const seed = useMemo<FullAccount>(
    () => (id && MOCK_ACCOUNTS[id]) || { ...FALLBACK, id: id ?? FALLBACK.id },
    [id]
  );

  // Form state mirrors the editable fields
  const [form, setForm] = useState({
    firstName: seed.firstName,
    lastName: seed.lastName,
    username: seed.username,
    gender: seed.gender,
    role: seed.role as RoleKey,
    isActive: seed.isActive,
    isLocked: seed.isLocked,
    isBanned: seed.isBanned,
    bannedTill: seed.bannedTill ? new Date(seed.bannedTill) : undefined,
  });

  const targetIsAdmin = seed.role === "admin";
  const editLocked = targetIsAdmin && !currentAdminIsSuperuser;

  const onCancelEdit = () => {
    setForm({
      firstName: seed.firstName,
      lastName: seed.lastName,
      username: seed.username,
      gender: seed.gender,
      role: seed.role as RoleKey,
      isActive: seed.isActive,
      isLocked: seed.isLocked,
      isBanned: seed.isBanned,
      bannedTill: seed.bannedTill ? new Date(seed.bannedTill) : undefined,
    });
    setEditing(false);
  };

  const onSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      toast({
        title: "Account updated",
        description: `${form.firstName} ${form.lastName} (@${form.username}) has been saved.`,
      });
    }, 900);
  };

  // Account "as a target" passed to dialogs
  const dialogAccount: AccountDetails = {
    id: seed.id,
    fullName: `${form.firstName} ${form.lastName}`.trim() || seed.fullName,
    username: form.username,
    email: seed.email,
    role: form.role,
    status: seed.status,
    joined: seed.joined,
    lastLogin: seed.lastLogin,
    phone: seed.phone,
    location: seed.location,
  };

  if (loading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <BackBar onBack={() => navigate("/admin/accounts")} />
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="font-semibold">Couldn't load account</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" onClick={() => setError(null)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BackBar
        onBack={() => navigate("/admin/accounts")}
        right={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLoading(true);
                setTimeout(() => setLoading(false), 600);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* LEFT — read-only summary */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-primary text-2xl font-semibold text-primary-foreground shadow-md">
                  {initials(seed.fullName)}
                </div>
                <h2 className="mt-3 text-xl font-semibold">{seed.fullName}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                  <AtSign className="h-3.5 w-3.5" />
                  {seed.username}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{seed.email}</span>
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("capitalize", roleBadgeClass[seed.role])}
                  >
                    <Shield className="mr-1 h-3 w-3" /> {seed.role}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={statusBadgeClass[seed.status]}
                  >
                    {seed.status}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-xs">
                    <IdCard className="mr-1 h-3 w-3" /> {seed.id}
                  </Badge>
                </div>
              </div>

              <Separator className="my-5" />

              <div className="space-y-3 text-sm">
                <SummaryRow
                  icon={<CalendarIcon className="h-4 w-4" />}
                  label="Joined"
                  value={seed.joined}
                />
                <SummaryRow
                  icon={<Clock className="h-4 w-4" />}
                  label="Last login"
                  value={seed.lastLogin}
                />
                <SummaryRow
                  icon={<RefreshCw className="h-4 w-4" />}
                  label="Last updated"
                  value={seed.lastUpdated}
                />
                <SummaryRow
                  icon={<KeyRound className="h-4 w-4" />}
                  label="Auth provider"
                  value={
                    <Badge variant="secondary" className="font-normal">
                      {seed.authProvider}
                    </Badge>
                  }
                />
              </div>

              <Separator className="my-5" />

              <div className="flex flex-wrap gap-2">
                <BoolChip
                  on={seed.isVerified}
                  onLabel="Verified"
                  offLabel="Unverified"
                />
                <BoolChip
                  on={seed.isActive}
                  onLabel="Active"
                  offLabel="Inactive"
                />
                <BoolChip
                  on={!seed.isLocked}
                  onLabel="Unlocked"
                  offLabel="Locked"
                  invertColors
                />
                <BoolChip
                  on={!seed.isBanned}
                  onLabel="Not Banned"
                  offLabel="Banned"
                  invertColors
                />
              </div>
            </CardContent>
          </Card>

          {seed.flagMessage && (
            <Alert className="border-warning/40 bg-warning/10 text-foreground">
              <AlertTriangle className="h-4 w-4 !text-warning" />
              <AlertTitle className="text-warning">Flag message</AlertTitle>
              <AlertDescription>{seed.flagMessage}</AlertDescription>
            </Alert>
          )}

          {seed.systemMessage && (
            <Alert className="border-primary/30 bg-primary/5 text-foreground">
              <Info className="h-4 w-4 !text-primary" />
              <AlertTitle className="text-primary">System message</AlertTitle>
              <AlertDescription>{seed.systemMessage}</AlertDescription>
            </Alert>
          )}

          {seed.bio && (seed.role === "vendor" || seed.role === "user") && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Biography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <BioRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Address"
                  value={seed.bio.address}
                />
                <BioRow
                  icon={<Phone className="h-4 w-4" />}
                  label="Phone"
                  value={seed.bio.phone}
                />
                <BioRow
                  icon={<Building2 className="h-4 w-4" />}
                  label="Bank"
                  value={`${seed.bio.bankName} • ${seed.bio.accountNumberMasked}`}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT — Edit form + role access + danger zone + history */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
              <div>
                <CardTitle className="text-lg">Account details</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Update profile information and access controls.
                </p>
              </div>
              {!editing ? (
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(true)}
                          disabled={editLocked}
                        >
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {editLocked && (
                      <TooltipContent>
                        Only the Superuser can edit Admin accounts.
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancelEdit}
                    disabled={saving}
                  >
                    <XIcon className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button size="sm" onClick={onSave} disabled={saving}>
                    {saving ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Update Account
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="space-y-5">
              {editLocked && (
                <Alert className="border-warning/40 bg-warning/10">
                  <Lock className="h-4 w-4 !text-warning" />
                  <AlertTitle className="text-warning">
                    Editing locked
                  </AlertTitle>
                  <AlertDescription>
                    Only the Superuser can edit Admin accounts.
                  </AlertDescription>
                </Alert>
              )}

              <fieldset
                disabled={!editing || saving || editLocked}
                className="space-y-5 disabled:opacity-100"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, firstName: e.target.value }))
                      }
                      readOnly={!editing}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, lastName: e.target.value }))
                      }
                      readOnly={!editing}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={form.username}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, username: e.target.value }))
                      }
                      readOnly={!editing}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={form.gender}
                      onValueChange={(v) =>
                        setForm((f) => ({
                          ...f,
                          gender: v as typeof form.gender,
                        }))
                      }
                      disabled={!editing || saving || editLocked}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="unspecified">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={form.role}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, role: v as RoleKey }))
                      }
                      disabled={!editing || saving || editLocked}
                    >
                      <SelectTrigger id="role">
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

                <Separator />

                <div className="space-y-3">
                  <ToggleRow
                    icon={<CheckCircle2 className="h-4 w-4 text-success" />}
                    title="Active"
                    description="Account can sign in and use the platform."
                    checked={form.isActive}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, isActive: v }))
                    }
                    disabled={!editing || saving || editLocked}
                  />
                  <ToggleRow
                    icon={<Lock className="h-4 w-4 text-warning" />}
                    title="Locked"
                    description="Temporary lock — usually after failed login attempts."
                    checked={form.isLocked}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, isLocked: v }))
                    }
                    disabled={!editing || saving || editLocked}
                  />
                  <ToggleRow
                    icon={<ShieldAlert className="h-4 w-4 text-destructive" />}
                    title="Banned"
                    description="Hard ban — user cannot recover or contact support."
                    checked={form.isBanned}
                    onCheckedChange={(v) =>
                      setForm((f) => ({ ...f, isBanned: v }))
                    }
                    disabled={!editing || saving || editLocked}
                  />

                  {form.isBanned && (
                    <div className="ml-7 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                      <Label htmlFor="bannedTill">Banned till</Label>
                      <Popover
                        open={bannedDateOpen}
                        onOpenChange={setBannedDateOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            id="bannedTill"
                            variant="outline"
                            disabled={!editing || saving || editLocked}
                            className={cn(
                              "w-full sm:w-[280px] justify-start text-left font-normal",
                              !form.bannedTill && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {form.bannedTill
                              ? format(form.bannedTill, "PPP")
                              : "Pick an end date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={form.bannedTill}
                            onSelect={(d) => {
                              setForm((f) => ({ ...f, bannedTill: d }));
                              setBannedDateOpen(false);
                            }}
                            disabled={(d) => d < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs text-muted-foreground">
                        Leave empty for indefinite — you can also set a hard
                        permanent ban via the Suspend dialog.
                      </p>
                    </div>
                  )}
                </div>
              </fieldset>
            </CardContent>
          </Card>

          {/* Role Access — only authors */}
          {seed.role === "author" && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Role Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {(seed.roleAccess ?? []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No modules assigned yet.
                    </p>
                  ) : (
                    seed.roleAccess!.map((m) => (
                      <Badge
                        key={m}
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20"
                      >
                        {m}
                      </Badge>
                    ))
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRoleAccessOpen(true)}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit Role Access
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Danger zone */}
          <Collapsible defaultOpen>
            <Card className="border-destructive/30">
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 p-5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-destructive" />
                    <span className="font-semibold text-destructive">
                      Danger zone
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-3 border-t border-destructive/20 p-5">
                  <DangerRow
                    icon={<ShieldOff className="h-4 w-4" />}
                    title="Suspend account"
                    description="Block sign-in temporarily or permanently with an audit reason."
                    actionLabel="Suspend Account"
                    actionVariant="destructive-outline"
                    onClick={() => setSuspendOpen(true)}
                  />
                  <DangerRow
                    icon={<LogOut className="h-4 w-4" />}
                    title="Force logout"
                    description="Terminate every active session for this account."
                    actionLabel="Force Logout"
                    actionVariant="warning-outline"
                    onClick={() => setForceLogoutOpen(true)}
                  />
                  {seed.hasPendingDeletion && (
                    <DangerRow
                      icon={<Trash2 className="h-4 w-4" />}
                      title="Pending deletion request"
                      description="The owner requested account deletion. Review and approve or reject."
                      actionLabel="Review Deletion Request"
                      actionVariant="destructive-outline"
                      onClick={() =>
                        toast({
                          title: "Opening deletion review",
                          description:
                            "This would navigate to the deletion review page.",
                        })
                      }
                    />
                  )}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Suspension history */}
          <Collapsible>
            <Card>
              <CollapsibleTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 p-5 text-left"
                >
                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">Suspension history</span>
                    <Badge variant="secondary" className="ml-1">
                      {MOCK_SUSPENSION_HISTORY.length}
                    </Badge>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-t p-5">
                  {MOCK_SUSPENSION_HISTORY.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No suspension history.
                    </p>
                  ) : (
                    <ol className="relative space-y-5 border-l border-border pl-5">
                      {MOCK_SUSPENSION_HISTORY.map((s) => (
                        <li key={s.id} className="relative">
                          <span
                            className={cn(
                              "absolute -left-[27px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background",
                              s.status === "Active"
                                ? "bg-destructive"
                                : s.status === "Lifted"
                                  ? "bg-success"
                                  : "bg-muted-foreground"
                            )}
                          />
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-medium">
                              {s.date}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                s.type === "Permanent"
                                  ? "bg-destructive/10 text-destructive border-destructive/20"
                                  : "bg-warning/10 text-warning border-warning/20"
                              )}
                            >
                              {s.type}
                            </Badge>
                            <Badge variant="secondary">{s.status}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {s.reason}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            By {s.by}
                            {s.liftedAt && ` • Lifted on ${s.liftedAt}`}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </div>

      {/* Modals reused */}
      {seed.role === "author" && (
        <RoleAccessDialog
          open={roleAccessOpen}
          onOpenChange={setRoleAccessOpen}
          authorId={seed.id}
          username={seed.username}
        />
      )}
      <SuspendAccountDialog
        account={dialogAccount}
        open={suspendOpen}
        onOpenChange={setSuspendOpen}
      />
      <ForceLogoutDialog
        account={dialogAccount}
        open={forceLogoutOpen}
        onOpenChange={setForceLogoutOpen}
      />
    </div>
  );
};

// --- Sub components ---

const BackBar = ({
  onBack,
  right,
}: {
  onBack: () => void;
  right?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-3">
    <Button variant="ghost" size="sm" onClick={onBack}>
      <ArrowLeft className="mr-2 h-4 w-4" /> Back to accounts
    </Button>
    {right}
  </div>
);

const SummaryRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-3">
    <span className="flex items-center gap-2 text-muted-foreground">
      {icon}
      {label}
    </span>
    <span className="font-medium text-right truncate">{value}</span>
  </div>
);

const BioRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 text-muted-foreground">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium truncate">{value}</p>
    </div>
  </div>
);

const BoolChip = ({
  on,
  onLabel,
  offLabel,
  invertColors = false,
}: {
  on: boolean;
  onLabel: string;
  offLabel: string;
  invertColors?: boolean;
}) => {
  const positive = invertColors ? on : on;
  const cls = positive
    ? "bg-success/10 text-success border-success/20"
    : "bg-destructive/10 text-destructive border-destructive/20";
  return (
    <Badge variant="outline" className={cls}>
      {positive ? (
        <CheckCircle2 className="mr-1 h-3 w-3" />
      ) : (
        <XCircle className="mr-1 h-3 w-3" />
      )}
      {on ? onLabel : offLabel}
    </Badge>
  );
};

const ToggleRow = ({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) => (
  <div className="flex items-start justify-between gap-4 rounded-lg border bg-card p-3">
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
    />
  </div>
);

const DangerRow = ({
  icon,
  title,
  description,
  actionLabel,
  actionVariant,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionVariant: "destructive-outline" | "warning-outline";
  onClick: () => void;
}) => (
  <div className="flex flex-col gap-3 rounded-lg border border-border/60 p-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "mt-0.5",
          actionVariant === "destructive-outline"
            ? "text-destructive"
            : "text-warning"
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(
        actionVariant === "destructive-outline"
          ? "border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
          : "border-warning/40 text-warning hover:bg-warning/10 hover:text-warning"
      )}
    >
      {actionLabel}
    </Button>
  </div>
);

const DetailSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-40" />
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col items-center gap-3">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AccountDetail;
