import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle, Loader2, Copy, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type Status = "loading" | "success" | "pending" | "failed" | "error";

const UserWalletDepositVerify = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const reference = params.get("reference") || "";
  const gateway = params.get("gateway") || "";

  const [status, setStatus] = useState<Status>("loading");
  const [amount, setAmount] = useState(0);

  const verify = () => {
    setStatus("loading");
    setTimeout(() => {
      // mock outcomes: end with even digit -> success, odd -> pending, no ref -> error
      if (!reference) {
        setStatus("error");
        return;
      }
      const last = reference.charCodeAt(reference.length - 1);
      const mod = last % 4;
      if (mod === 0 || mod === 1) {
        setStatus("success");
        setAmount(5000);
      } else if (mod === 2) {
        setStatus("pending");
      } else {
        setStatus("failed");
      }
    }, 1200);
  };

  useEffect(() => {
    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyRef = () => {
    navigator.clipboard.writeText(reference);
    toast("Reference copied.");
  };

  const RefChip = () => (
    <button
      onClick={copyRef}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded font-mono text-sm hover:bg-muted/70"
    >
      {reference}
      <Copy className="h-3 w-3" />
    </button>
  );

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-lg font-medium text-foreground">
                Verifying your deposit...
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-14 w-14 text-green-600 mx-auto" />
              <h2 className="text-2xl font-bold text-foreground">
                ₦ {amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })} added to your wallet.
              </h2>
              <p className="text-muted-foreground">
                Your wallet balance has been updated.
              </p>
              <div className="pt-2">
                <RefChip />
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={() => navigate("/user/wallet")}>View Wallet</Button>
                <Link
                  to="/user/wallet/deposit"
                  className="text-sm text-primary hover:underline"
                >
                  Make Another Deposit
                </Link>
              </div>
            </>
          )}

          {status === "pending" && (
            <>
              <Clock className="h-14 w-14 text-amber-500 mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">
                Your deposit is still processing.
              </h2>
              <p className="text-muted-foreground">
                This may take a few minutes. Check your wallet balance shortly.
              </p>
              <div className="pt-2">
                <RefChip />
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={verify}>Refresh Status</Button>
                <Link
                  to="/user/wallet"
                  className="text-sm text-primary hover:underline"
                >
                  View Wallet
                </Link>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="h-14 w-14 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">
                Deposit could not be processed.
              </h2>
              <p className="text-muted-foreground">
                The payment was not completed or was cancelled at the gateway.
              </p>
              <div className="pt-2">
                <RefChip />
              </div>
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={() => navigate("/user/wallet/deposit")}>
                  Try Again
                </Button>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <AlertTriangle className="h-14 w-14 text-destructive mx-auto" />
              <h2 className="text-xl font-semibold text-foreground">
                Unable to verify deposit.
              </h2>
              <p className="text-muted-foreground">
                Please check your wallet balance or contact support.
              </p>
              <div className="pt-4">
                <Link
                  to="/user/support"
                  className="text-sm text-primary hover:underline"
                >
                  Contact Support
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserWalletDepositVerify;
