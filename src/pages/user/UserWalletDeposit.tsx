import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";

type Gateway = "paystack" | "flutterwave";

const availableBalance = 12450.75;

const UserWalletDeposit = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState<Gateway>("paystack");
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const numericAmount = parseFloat(amount) || 0;
  const valid = numericAmount >= 100;

  const handleSubmit = async () => {
    if (!valid || rateLimited) return;
    setSubmitting(true);
    // mock initiate call
    setTimeout(() => {
      setSubmitting(false);
      setRedirecting(true);
      setTimeout(() => {
        const ref = `PMT_${Date.now()}`;
        navigate(`/payment/deposit/verify?reference=${ref}&gateway=${gateway}`);
      }, 1500);
    }, 900);
  };

  if (redirecting) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground">
          Redirecting to {gateway === "paystack" ? "Paystack" : "Flutterwave"}...
        </p>
        <p className="text-sm text-muted-foreground">
          Please do not close this window.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Top Up Wallet</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Funds are credited to your wallet balance once payment is confirmed.
        </p>
      </div>

      <Card className="bg-muted/40">
        <CardContent className="p-4 flex items-center gap-3">
          <Wallet className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm">
            <span className="text-muted-foreground">Current balance:</span>{" "}
            <span className="font-semibold text-foreground">
              ₦ {availableBalance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₦
              </span>
              <Input
                id="amount"
                type="number"
                min={100}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 text-lg"
              />
            </div>
            <p className="text-xs text-muted-foreground">Minimum deposit: ₦100</p>
            {numericAmount > 0 && (
              <p className="text-sm text-foreground">
                You will deposit{" "}
                <span className="font-semibold">
                  ₦ {numericAmount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </span>
              </p>
            )}
          </div>

          {/* Gateway */}
          <div className="space-y-2">
            <Label>Payment Gateway</Label>
            <div className="grid grid-cols-2 gap-3">
              {(["paystack", "flutterwave"] as Gateway[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGateway(g)}
                  className={`border rounded-lg p-4 text-left transition-colors ${
                    gateway === g
                      ? "border-primary ring-2 ring-primary/30 bg-primary/5"
                      : "border-border hover:border-muted-foreground/40"
                  }`}
                >
                  <div className="font-semibold text-foreground capitalize">
                    {g}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {g === "paystack"
                      ? "Cards, bank transfer, USSD"
                      : "Cards, bank, mobile money"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          {rateLimited ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block">
                  <Button className="w-full" disabled>
                    Proceed to Payment
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Too many requests. Please wait a moment.</TooltipContent>
            </Tooltip>
          ) : (
            <Button
              className="w-full"
              size="lg"
              disabled={!valid || submitting}
              onClick={handleSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Initiating...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserWalletDeposit;
