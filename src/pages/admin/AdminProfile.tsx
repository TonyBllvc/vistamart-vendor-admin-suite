import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AtSign,
  Calendar,
  Clock,
  KeyRound,
  Loader2,
  Mail,
  Monitor,
  Pencil,
  Shield,
  ShieldCheck,
  Smartphone,
  Tablet,
  ChevronRight,
  Info,
  TriangleAlert,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ---------- Mock profile (replace with GET /profile/) ----------
const PROFILE = {
  id: "adm_001",
  fullName: "Adaeze Okafor",
  firstName: "Adaeze",
  lastName: "Okafor",
  email: "adaeze@primemart.io",
  username: "adaezeo",
  gender: "female" as "female" | "male" | "other" | "prefer_not",
  role: "Admin",
  joined: "April 12, 2023",
  lastLogin: "Apr 23, 2026 · 09:21",
  flag_message: "Your account was flagged for unusual login activity. Review recent sessions below.",
  system_message: "Scheduled maintenance: 02:00–03:00 UTC, May 1.",
};

const SESSIONS = [
  {
    id: "s_1",
    device: "MacBook Pro",
    platform: "macOS · Chrome 124",
    lastActive: "Active now",
    current: true,
    icon: Monitor,
  },
  {
    id: "s_2",
    device: "iPhone 15",
    platform: "iOS · Safari",
    lastActive: "2 hours ago",
    current: false,
    icon: Smartphone,
  },
  {
    id: "s_3",
    device: "iPad Air",
    platform: "iPadOS · Safari",
    lastActive: "Yesterday",
    current: false,
    icon: Tablet,
  },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

type UsernameCheck = "idle" | "checking" | "available" | "taken" | "invalid";

const RESERVED_USERNAMES = new Set(["admin", "root", "primemart", "support"]);

const AdminProfile = () => {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [firstName, setFirstName] = useState(PROFILE.firstName);
  const [lastName, setLastName] = useState(PROFILE.lastName);
  const [username, setUsername] = useState(PROFILE.username);
  const [gender, setGender] = useState(PROFILE.gender);
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [usernameCheck, setUsernameCheck] = useState<UsernameCheck>("idle");

  // Lightweight debounced username availability check
  const onUsernameChange = (val: string) => {
    setUsername(val);
    setUsernameCheck("idle");
    if (val === PROFILE.username) return;
    if (!/^[a-zA-Z0-9_.]{3,20}$/.test(val)) {
      setUsernameCheck("invalid");
      return;
    }
    setUsernameCheck("checking");
    window.clearTimeout((onUsernameChange as any)._t);
    (onUsernameChange as any)._t = window.setTimeout(() => {
      setUsernameCheck(
        RESERVED_USERNAMES.has(val.toLowerCase()) ? "taken" : "available",
      );
    }, 500);
  };

  const isModified = useMemo(
    () =>
      firstName !== PROFILE.firstName ||
      lastName !== PROFILE.lastName ||
      username !== PROFILE.username ||
      gender !== PROFILE.gender,
    [firstName, lastName, username, gender],
  );

  const canSave =
    isModified &&
    currentPassword.trim().length > 0 &&
    usernameCheck !== "taken" &&
    usernameCheck !== "invalid" &&
    usernameCheck !== "checking";

  const cancelEdit = () => {
    setFirstName(PROFILE.firstName);
    setLastName(PROFILE.lastName);
    setUsername(PROFILE.username);
    setGender(PROFILE.gender);
    setCurrentPassword("");
    setPasswordError(null);
    setUsernameCheck("idle");
    setEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setPasswordError(null);
    try {
      // Simulate PATCH /profile/change/
      await new Promise((res) => setTimeout(res, 900));
      // Demo: treat anything other than "admin1234" as wrong password
      if (currentPassword !== "admin1234") {
        setPasswordError("Incorrect current password. Please try again.");
        return;
      }
      toast({
        title: "Profile updated successfully.",
        description: "Your changes have been saved.",
      });
      // Reflect saved values into "PROFILE" baseline locally
      PROFILE.firstName = firstName;
      PROFILE.lastName = lastName;
      PROFILE.username = username;
      PROFILE.gender = gender;
      PROFILE.fullName = `${firstName} ${lastName}`;
      setCurrentPassword("");
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[640px] space-y-6">
      {/* Page heading */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information, password, and active sessions.
        </p>
      </div>

      {/* System messages */}
      {PROFILE.flag_message && (
        <Alert className="border-warning/40 bg-warning/10">
          <TriangleAlert className="h-4 w-4 text-warning" />
          <AlertTitle className="text-foreground">Account flagged</AlertTitle>
          <AlertDescription className="text-foreground/80">
            {PROFILE.flag_message}
          </AlertDescription>
        </Alert>
      )}
      {PROFILE.system_message && (
        <Alert className="border-primary/30 bg-primary/10">
          <Info className="h-4 w-4 text-primary" />
          <AlertTitle className="text-foreground">System notice</AlertTitle>
          <AlertDescription className="text-foreground/80">
            {PROFILE.system_message}
          </AlertDescription>
        </Alert>
      )}

      {/* SECTION 1 — Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
          <div>
            <CardTitle className="text-lg">Profile Information</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Your identity on the Primemart admin platform.
            </p>
          </div>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Identity header */}
          <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground text-xl font-semibold shadow-md">
              {initials(PROFILE.fullName)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold text-foreground">
                {PROFILE.fullName}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <AtSign className="h-3.5 w-3.5" />
                <span className="truncate">{PROFILE.username}</span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/10 text-primary"
                >
                  <Shield className="mr-1 h-3 w-3" />
                  {PROFILE.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Read-only meta */}
          <div className="grid gap-3 sm:grid-cols-2">
            <ReadRow icon={<Mail className="h-4 w-4" />} label="Email" value={PROFILE.email} />
            <ReadRow icon={<Calendar className="h-4 w-4" />} label="Date Joined" value={PROFILE.joined} />
            <ReadRow icon={<Clock className="h-4 w-4" />} label="Last Login" value={PROFILE.lastLogin} />
            <ReadRow icon={<ShieldCheck className="h-4 w-4" />} label="Account ID" value={PROFILE.id} mono />
          </div>

          <Separator />

          {/* Editable form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First Name" htmlFor="firstName">
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!editing || saving}
                />
              </Field>
              <Field label="Last Name" htmlFor="lastName">
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!editing || saving}
                />
              </Field>
            </div>

            <Field
              label="Username"
              htmlFor="username"
              hint={usernameHint(usernameCheck, username === PROFILE.username)}
            >
              <div className="relative">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => onUsernameChange(e.target.value)}
                  disabled={!editing || saving}
                  className={cn(
                    "pr-9",
                    usernameCheck === "taken" && "border-destructive focus-visible:ring-destructive",
                    usernameCheck === "invalid" && "border-destructive focus-visible:ring-destructive",
                    usernameCheck === "available" && "border-success focus-visible:ring-success",
                  )}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameCheck === "checking" && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {usernameCheck === "available" && (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  )}
                  {(usernameCheck === "taken" || usernameCheck === "invalid") && (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                </span>
              </div>
            </Field>

            <Field label="Gender" htmlFor="gender">
              <Select
                value={gender}
                onValueChange={(v) => setGender(v as typeof gender)}
                disabled={!editing || saving}
              >
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            {editing && (
              <>
                <Separator />
                <Field
                  label="Current Password"
                  htmlFor="currentPassword"
                  hint={
                    !passwordError
                      ? "Required to confirm any change to your profile."
                      : undefined
                  }
                  required
                >
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="Enter your current password"
                    disabled={saving}
                    className={cn(
                      passwordError && "border-destructive focus-visible:ring-destructive",
                    )}
                    autoComplete="current-password"
                  />
                  {passwordError && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-destructive">
                      <XCircle className="h-3.5 w-3.5" />
                      {passwordError}
                    </p>
                  )}
                </Field>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelEdit}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!canSave || saving} className="min-w-[150px]">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      {/* SECTION 2 — Password */}
      <Card>
        <CardContent className="p-0">
          <Link
            to="/admin/settings/change-password"
            className="flex items-center justify-between gap-4 p-5 transition-colors hover:bg-accent/40"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your sign-in password and end other sessions.
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      {/* SECTION 3 — Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Active Sessions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Devices currently signed in to your account. Session management is
            handled from the account detail page.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {SESSIONS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border bg-card p-3",
                  s.current && "border-success/30 bg-success/5",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground",
                      s.current && "bg-success/15 text-success",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {s.device}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.platform} · {s.lastActive}
                    </p>
                  </div>
                </div>
                {s.current && (
                  <Badge
                    variant="outline"
                    className="border-success/30 bg-success/10 text-success"
                  >
                    Current device
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

const Field = ({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label htmlFor={htmlFor} className="text-sm">
      {label}
      {required && <span className="ml-0.5 text-destructive">*</span>}
    </Label>
    {children}
    {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
  </div>
);

const usernameHint = (state: UsernameCheck, isOriginal: boolean) => {
  if (isOriginal) return "3–20 characters. Letters, numbers, dot, underscore.";
  switch (state) {
    case "checking":
      return "Checking availability…";
    case "available":
      return (
        <span className="text-success">✓ Username is available.</span>
      );
    case "taken":
      return (
        <span className="text-destructive">That username is already taken.</span>
      );
    case "invalid":
      return (
        <span className="text-destructive">
          3–20 characters. Letters, numbers, dot, underscore only.
        </span>
      );
    default:
      return "3–20 characters. Letters, numbers, dot, underscore.";
  }
};

const ReadRow = ({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) => (
  <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
    <div className="mt-0.5 text-muted-foreground">{icon}</div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "text-sm font-medium text-foreground truncate",
          mono && "font-mono",
        )}
      >
        {value}
      </p>
    </div>
  </div>
);

export default AdminProfile;
