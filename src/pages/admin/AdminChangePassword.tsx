import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import {
  KeyRound,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock current admin (would come from session/auth context)
const ADMIN_EMAIL = "admin@vistamart.com";

const OTP_TTL_SECONDS = 180; // 3 minutes
const RESEND_COOLDOWN_SECONDS = 60;

type Step = 1 | 2;
type Status = "idle" | "loading" | "error" | "success";

const AdminChangePassword = () => {
  const navigate = useNavigate();

  // Step state
  const [step, setStep] = useState<Step>(1);

  // Step 1 state
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [step1Status, setStep1Status] = useState<Status>("idle");
  const [step1Error, setStep1Error] = useState("");

  // Step 2 state
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step2Status, setStep2Status] = useState<Status>("idle");
  const [step2Error, setStep2Error] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);

  // Timers
  const [otpRemaining, setOtpRemaining] = useState(OTP_TTL_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (step !== 2) return;
    const t = setInterval(() => {
      setOtpRemaining((s) => (s > 0 ? s - 1 : 0));
      setResendCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  const otpExpired = otpRemaining === 0;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  // Password strength checks
  const passwordChecks = useMemo(() => {
    return [
      { label: "At least 8 characters", valid: newPassword.length >= 8 },
      { label: "One uppercase letter", valid: /[A-Z]/.test(newPassword) },
      { label: "One lowercase letter", valid: /[a-z]/.test(newPassword) },
      { label: "One number", valid: /\d/.test(newPassword) },
      { label: "One special character", valid: /[^A-Za-z0-9]/.test(newPassword) },
    ];
  }, [newPassword]);

  const allValid = passwordChecks.every((c) => c.valid);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  // Step 1 handler — POST /password/reset/auth/
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep1Status("loading");
    setStep1Error("");

    // Simulated API call
    await new Promise((r) => setTimeout(r, 900));

    // Simulate failure for demo: any password === "wrong"
    if (currentPassword === "wrong" || currentPassword.length < 4) {
      setStep1Status("error");
      setStep1Error("Incorrect current password.");
      return;
    }

    // Simulate token returned silently from backend
    setResetToken(`tok_${Date.now()}`);
    setStep1Status("success");
    toast.success("A verification code has been sent to your email.");

    // Auto-advance
    setTimeout(() => {
      setStep(2);
      setOtpRemaining(OTP_TTL_SECONDS);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    }, 800);
  };

  // Step 2 handler — PATCH /password/new/auth/
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep2Status("loading");
    setStep2Error("");

    if (otp.length !== 6) {
      setStep2Status("error");
      setStep2Error("Invalid code.");
      return;
    }
    if (otpExpired) {
      setStep2Status("error");
      setStep2Error("Code expired. Please request a new one.");
      return;
    }
    if (!allValid) {
      setStep2Status("error");
      setStep2Error("Password does not meet all requirements.");
      return;
    }
    if (!passwordsMatch) {
      setStep2Status("error");
      setStep2Error("Passwords do not match.");
      return;
    }

    await new Promise((r) => setTimeout(r, 900));

    // Simulate invalid OTP
    if (otp === "000000") {
      setStep2Status("error");
      setStep2Error("Invalid code.");
      return;
    }

    setStep2Status("success");
    toast.success("Password changed successfully.");
    setTimeout(() => navigate("/admin"), 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setOtp("");
    setOtpRemaining(OTP_TTL_SECONDS);
    setResendCooldown(RESEND_COOLDOWN_SECONDS);
    setStep2Error("");
    setStep2Status("idle");
    toast.success("A new verification code has been sent.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/settings")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
          <p className="text-muted-foreground">
            Secure your admin account with a new password.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
              step >= 1
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            {step > 1 ? <Check className="h-4 w-4" /> : "1"}
          </div>
          <span className={cn("text-sm font-medium", step >= 1 ? "text-foreground" : "text-muted-foreground")}>
            Verify Identity
          </span>
        </div>
        <div className={cn("h-0.5 flex-1 max-w-[80px]", step >= 2 ? "bg-primary" : "bg-border")} />
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors",
              step >= 2
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            2
          </div>
          <span className={cn("text-sm font-medium", step >= 2 ? "text-foreground" : "text-muted-foreground")}>
            Set New Password
          </span>
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Verify Your Identity
            </CardTitle>
            <CardDescription>
              Confirm your current password to receive a change code by email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit} className="space-y-5">
              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    type="email"
                    value={ADMIN_EMAIL}
                    readOnly
                    className="pl-10 bg-muted/40 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-password">
                  Current Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current-password"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (step1Status === "error") {
                        setStep1Status("idle");
                        setStep1Error("");
                      }
                    }}
                    placeholder="Enter your current password"
                    className="pl-10 pr-10"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showCurrent ? "Hide password" : "Show password"}
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {step1Status === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{step1Error}</AlertDescription>
                </Alert>
              )}

              {/* Success */}
              {step1Status === "success" && (
                <Alert className="border-primary/40 bg-primary/5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-foreground">
                    A verification code has been sent to your email.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={step1Status === "loading" || step1Status === "success" || !currentPassword}
              >
                {step1Status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {step1Status === "success" ? "Code Sent" : "Send Verification Code"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-primary" />
                  Confirm & Set New Password
                </CardTitle>
                <CardDescription className="mt-1.5">
                  Enter the 6-digit code sent to <span className="font-medium text-foreground">{ADMIN_EMAIL}</span>
                </CardDescription>
              </div>
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-mono font-semibold border",
                  otpExpired
                    ? "bg-destructive/10 text-destructive border-destructive/30"
                    : otpRemaining < 30
                    ? "bg-destructive/10 text-destructive border-destructive/30"
                    : "bg-muted text-foreground border-border"
                )}
              >
                <Clock className="h-3.5 w-3.5" />
                {formatTime(otpRemaining)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep2Submit} className="space-y-6">
              {/* OTP */}
              <div className="space-y-3">
                <Label>
                  Verification Code <span className="text-destructive">*</span>
                </Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(v) => {
                    setOtp(v);
                    if (step2Status === "error") {
                      setStep2Status("idle");
                      setStep2Error("");
                    }
                  }}
                  disabled={otpExpired}
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

                {otpExpired && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Code expired. Resend?</AlertDescription>
                  </Alert>
                )}

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Didn't receive the code?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className={cn(
                      "inline-flex items-center gap-1.5 font-medium transition-colors",
                      resendCooldown > 0
                        ? "text-muted-foreground cursor-not-allowed"
                        : "text-primary hover:underline"
                    )}
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                  </button>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">
                  New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Strength checklist */}
              {newPassword.length > 0 && (
                <div className="rounded-md border border-border bg-muted/30 p-3 space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Password requirements</p>
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-2 text-sm">
                      {check.valid ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={check.valid ? "text-foreground" : "text-muted-foreground"}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">
                  Confirm New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="pl-10 pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Passwords do not match.
                  </p>
                )}
              </div>

              {/* Error */}
              {step2Status === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{step2Error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  disabled={
                    step2Status === "loading" ||
                    step2Status === "success" ||
                    otpExpired ||
                    otp.length !== 6 ||
                    !allValid ||
                    !passwordsMatch
                  }
                >
                  {step2Status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setStep2Status("idle");
                    setStep2Error("");
                  }}
                >
                  Back
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminChangePassword;
