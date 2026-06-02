import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Loader2,
  Check,
  X,
  Copy,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const AVAILABLE_BALANCE = 12450.75;
const MIN_AMOUNT = 1000;
const RATE_LIMIT = 5;
const WALLET_VERIFY_TTL = 5 * 60; // seconds

type WStatus = "pending" | "processing" | "completed" | "rejected" | "failed";

interface Withdrawal {
  reference: string;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: WStatus;
  initiated_at: string;
  completed_at?: string | null;
  system_message?: string | null;
  rejection_reason?: string | null;
  failure_reason?: string | null;
}

const seedHistory: Withdrawal[] = [
  {
    reference: "WD_1733091234",
    amount: 5000,
    bank_name: "GTBank",
    account_number: "0123456789",
    account_name: "John Doe",
    status: "completed",
    initiated_at: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    completed_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    system_message: "Payout sent successfully.",
  },
  {
    reference: "WD_1733091200",
    amount: 12000,
    bank_name: "Access Bank",
    account_number: "1234567890",
    account_name: "John Doe",
    status: "processing",
    initiated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    reference: "WD_1733091100",
    amount: 2500,
    bank_name: "UBA",
    account_number: "2345678901",
    account_name: "John Doe",
    status: "rejected",
    initiated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    rejection_reason: "Account name mismatch with KYC details.",
  },
];

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function fmt(n: number) {
  return n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function maskAccount(n: string) {
  if (!n) return "";
  return "••••" + n.slice(-4);
}

function StatusBadge({ status }: { status: WStatus }) {
  const map: Record<WStatus, string> = {
    pending: "bg-muted text-muted-foreground",
    processing: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
    completed: "bg-green-500/15 text-green-600 dark:text-green-400",
    rejected: "bg-red-500/15 text-red-600 dark:text-red-400",
    failed: "bg-red-500/15 text-red-600 dark:text-red-400",
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{label}</span>;
}

function RefChip({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted font-mono text-xs hover:bg-muted/70 transition"
    >
      {value}
      {copied ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
    </button>
  );
}

const UserWalletWithdraw = () => {
  // Form state
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [verifyingAccount, setVerifyingAccount] = useState(false);
  const [accountVerified, setAccountVerified] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Wallet password
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [walletPassword, setWalletPassword] = useState("");
  const [walletVerifying, setWalletVerifying] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [walletVerifiedAt, setWalletVerifiedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const walletExpiresIn =
    walletVerifiedAt != null ? WALLET_VERIFY_TTL - Math.floor((now - walletVerifiedAt) / 1000) : 0;
  const walletStillValid = walletVerifiedAt != null && walletExpiresIn > 0;

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [submissionsThisHour, setSubmissionsThisHour] = useState<number[]>([]);

  // History
  const [history, setHistory] = useState<Withdrawal[]>(seedHistory);
  const [visibleCount, setVisibleCount] = useState(5);
  const [detailOpen, setDetailOpen] = useState<Withdrawal | null>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const amountNum = parseFloat(amount) || 0;
  const insufficient = amountNum > AVAILABLE_BALANCE;
  const amountValid = amountNum >= MIN_AMOUNT && !insufficient;
  const canSubmit = amountValid && accountVerified && walletStillValid && !submitting;

  // Reset account verification when fields change
  useEffect(() => {
    setAccountVerified(false);
    setAccountName("");
    setAccountError(null);
  }, [accountNumber, bankCode, bankName]);

  const handleVerifyAccount = async () => {
    if (!bankName.trim() || !bankCode.trim() || accountNumber.length !== 10) {
      setAccountError("Enter bank details and a 10-digit account number.");
      return;
    }
    setAccountError(null);
    setVerifyingAccount(true);
    await new Promise((r) => setTimeout(r, 900));
    setVerifyingAccount(false);
    // Mock: fail if account starts with 0000
    if (accountNumber.startsWith("0000")) {
      setAccountError("Could not verify account. Please check the details.");
      return;
    }
    setAccountName("John A. Doe");
    setAccountVerified(true);
  };

  const handleVerifyWallet = async () => {
    if (walletPassword.length < 4) {
      setWalletError("Enter your wallet password.");
      return;
    }
    setWalletError(null);
    setWalletVerifying(true);
    await new Promise((r) => setTimeout(r, 700));
    setWalletVerifying(false);
    if (walletPassword === "wrong") {
      setWalletError("Incorrect wallet password.");
      return;
    }
    setWalletVerifiedAt(Date.now());
    setWalletPassword("");
    setWalletDialogOpen(false);
    toast.success("Wallet verified");
  };

  const checkRateLimit = () => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recent = submissionsThisHour.filter((t) => t > oneHourAgo);
    setSubmissionsThisHour(recent);
    return recent.length < RATE_LIMIT;
  };

  const handleSubmit = async () => {
    if (!checkRateLimit()) {
      toast.error("You've reached the withdrawal limit for this hour. Please try again later.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1100));
    const ref = `WD_${Date.now()}`;
    const newRow: Withdrawal = {
      reference: ref,
      amount: amountNum,
      bank_name: bankName,
      account_number: accountNumber,
      account_name: accountName,
      status: "pending",
      initiated_at: new Date().toISOString(),
      system_message: "Your request has been queued for review.",
    };
    setHistory((h) => [newRow, ...h]);
    setSubmissionsThisHour((s) => [...s, Date.now()]);
    setSubmittedRef(ref);
    setSubmitting(false);
  };

  const resetForm = () => {
    setAmount("");
    setBankName("");
    setBankCode("");
    setAccountNumber("");
    setAccountName("");
    setAccountVerified(false);
    setWalletVerifiedAt(null);
    setSubmittedRef(null);
  };

  const scrollToRow = (ref: string) => {
    const el = rowRefs.current[ref];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-primary");
      setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 2000);
    }
  };

  const mm = Math.floor(Math.max(0, walletExpiresIn) / 60);
  const ss = Math.max(0, walletExpiresIn) % 60;

  return (
    <div className="container max-w-3xl mx-auto py-8 space-y-6">
      <div>
        <Link
          to="/user/wallet"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Wallet
        </Link>
      </div>

      {/* Withdrawal Form */}
      <Card>
        <CardHeader>
          <CardTitle>Withdraw Funds</CardTitle>
          <CardDescription>Minimum: ₦1,000. Limited to 5 requests per hour.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {submittedRef ? (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 space-y-3">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                <Check className="h-5 w-5" /> Withdrawal request submitted.
              </div>
              <p className="text-sm text-muted-foreground">
                Your request is pending review. You'll be notified of the outcome.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Reference:</span>
                <RefChip value={submittedRef} />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={() => scrollToRow(submittedRef)}
                >
                  View Request
                </Button>
                <Button variant="outline" size="sm" onClick={resetForm}>
                  Make Another Withdrawal
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Amount */}
              <div className="space-y-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  min={MIN_AMOUNT}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    Available balance: ₦ {fmt(AVAILABLE_BALANCE)}
                  </span>
                  {amount && amountNum > 0 && amountNum < MIN_AMOUNT && (
                    <span className="text-destructive">Minimum is ₦{MIN_AMOUNT.toLocaleString()}.</span>
                  )}
                </div>
                {insufficient && (
                  <p className="text-xs text-destructive">Insufficient balance.</p>
                )}
              </div>

              {/* Bank */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="bank-name">Bank Name</Label>
                  <Input
                    id="bank-name"
                    placeholder="e.g. GTBank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bank-code">Bank Code</Label>
                  <Input
                    id="bank-code"
                    placeholder="e.g. 058"
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Your bank's sort code for transfers.
                  </p>
                </div>
              </div>

              {/* Account number + verify */}
              <div className="space-y-1.5">
                <Label htmlFor="acct">Account Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="acct"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit account number"
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleVerifyAccount}
                    disabled={verifyingAccount || accountVerified}
                  >
                    {verifyingAccount ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : accountVerified ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      "Verify Account"
                    )}
                  </Button>
                </div>
                {accountVerified && (
                  <div className="flex items-center gap-2 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-700 dark:text-green-400">
                    <Check className="h-4 w-4" /> {accountName} — {bankName}
                  </div>
                )}
                {accountError && (
                  <div className="flex items-center gap-2 text-xs text-destructive">
                    <X className="h-3 w-3" /> {accountError}
                  </div>
                )}
              </div>

              {/* Account Name read-only */}
              <div className="space-y-1.5">
                <Label htmlFor="acct-name">Account Name</Label>
                <Input
                  id="acct-name"
                  value={accountName}
                  readOnly
                  placeholder="Auto-filled after verification"
                  className="bg-muted/50"
                />
              </div>

              {/* Wallet password */}
              <div className="space-y-1.5">
                <Label>Wallet Password</Label>
                {walletStillValid ? (
                  <div className="flex items-center justify-between rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <ShieldCheck className="h-4 w-4" /> Wallet verified
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Expires in {mm}:{ss.toString().padStart(2, "0")}
                    </span>
                  </div>
                ) : walletVerifiedAt != null ? (
                  <div className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" /> Verification expired. Please verify again.
                    </span>
                    <Button size="sm" variant="outline" onClick={() => setWalletDialogOpen(true)}>
                      Verify
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setWalletDialogOpen(true)}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" /> Verify Wallet Password
                  </Button>
                )}
              </div>

              <Button className="w-full" disabled={!canSubmit} onClick={handleSubmit}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Submit Withdrawal Request
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* History */}
      <div ref={historyRef} className="space-y-3">
        <h2 className="text-lg font-semibold">Withdrawal History</h2>
        {history.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No withdrawal requests yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {history.slice(0, visibleCount).map((w) => (
              <div
                key={w.reference}
                ref={(el) => (rowRefs.current[w.reference] = el)}
                className="rounded-lg border bg-card p-4 flex items-center justify-between gap-4 transition-shadow"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold">₦{fmt(w.amount)}</span>
                    <span className="text-xs text-muted-foreground">NGN</span>
                    <StatusBadge status={w.status} />
                  </div>
                  <div className="text-sm text-muted-foreground">{w.bank_name}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono truncate">{w.reference}</span>
                    <span>•</span>
                    <span>{relativeTime(w.initiated_at)}</span>
                  </div>
                </div>
                <Button variant="link" size="sm" onClick={() => setDetailOpen(w)}>
                  View Details
                </Button>
              </div>
            ))}
            {visibleCount < history.length && (
              <div className="flex justify-center pt-2">
                <Button variant="outline" onClick={() => setVisibleCount((c) => c + 5)}>
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wallet password dialog */}
      <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Wallet Password</DialogTitle>
            <DialogDescription>
              Enter your wallet password to authorise this withdrawal. Verification stays valid for 5 minutes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="wpw">Wallet Password</Label>
            <Input
              id="wpw"
              type="password"
              value={walletPassword}
              onChange={(e) => setWalletPassword(e.target.value)}
              placeholder="••••••"
            />
            {walletError && <p className="text-xs text-destructive">{walletError}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWalletDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerifyWallet} disabled={walletVerifying}>
              {walletVerifying && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detailOpen} onOpenChange={(o) => !o && setDetailOpen(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Withdrawal Details</DialogTitle>
          </DialogHeader>
          {detailOpen && (
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Reference</span>
                <RefChip value={detailOpen.reference} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">₦{fmt(detailOpen.amount)} NGN</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={detailOpen.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bank</span>
                <span>{detailOpen.bank_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account Number</span>
                <span className="font-mono">{maskAccount(detailOpen.account_number)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Account Name</span>
                <span>{detailOpen.account_name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Initiated</span>
                <span>{new Date(detailOpen.initiated_at).toLocaleString()}</span>
              </div>
              {detailOpen.completed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span>{new Date(detailOpen.completed_at).toLocaleString()}</span>
                </div>
              )}
              {detailOpen.system_message && (
                <div className="rounded-md border border-blue-500/30 bg-blue-500/10 p-3 text-blue-700 dark:text-blue-300">
                  <div className="text-xs font-semibold mb-1">System Message</div>
                  {detailOpen.system_message}
                </div>
              )}
              {detailOpen.status === "rejected" && detailOpen.rejection_reason && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
                  <div className="text-xs font-semibold mb-1">Rejection Reason</div>
                  {detailOpen.rejection_reason}
                </div>
              )}
              {detailOpen.status === "failed" && detailOpen.failure_reason && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-destructive">
                  <div className="text-xs font-semibold mb-1">Failure Reason</div>
                  {detailOpen.failure_reason}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserWalletWithdraw;
