import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { CreditCard, Building2, Plus, Loader2, CheckCircle2 } from "lucide-react";

type Gateway = "Paystack" | "Flutterwave";
type MethodType = "CARD" | "BANK_TRANSFER";

interface PaymentMethod {
  id: string;
  type: MethodType;
  provider: Gateway;
  is_default: boolean;
  system_message?: string | null;
  // card
  card_last_four?: string;
  card_brand?: "Visa" | "Mastercard" | "Verve";
  // bank
  account_name?: string;
  bank_name?: string;
  account_last_four?: string;
}

const initialMethods: PaymentMethod[] = [
  {
    id: "pm_1",
    type: "CARD",
    provider: "Paystack",
    is_default: true,
    card_last_four: "4321",
    card_brand: "Visa",
  },
  {
    id: "pm_2",
    type: "BANK_TRANSFER",
    provider: "Flutterwave",
    is_default: false,
    account_name: "JANE SMITH",
    bank_name: "GTBank",
    account_last_four: "7788",
    system_message: "Bank verification expires in 30 days.",
  },
];

const UserPaymentMethods = () => {
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);

  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<MethodType | null>(null);
  const [removeId, setRemoveId] = useState<string | null>(null);

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({ ...m, is_default: m.id === id }))
    );
    toast.success("Default payment method updated.");
  };

  const handleRemove = () => {
    if (!removeId) return;
    setMethods((prev) => prev.filter((m) => m.id !== removeId));
    setRemoveId(null);
    toast("Payment method removed.");
  };

  const handleAddBank = (m: PaymentMethod) => {
    setMethods((prev) => [...prev, m]);
    setAddOpen(false);
    setAddType(null);
    toast.success("Bank account added.");
  };

  const handleAddCard = () => {
    // Simulate gateway hosted form callback
    const newCard: PaymentMethod = {
      id: `pm_${Date.now()}`,
      type: "CARD",
      provider: "Paystack",
      is_default: false,
      card_brand: "Mastercard",
      card_last_four: String(Math.floor(1000 + Math.random() * 9000)),
    };
    setMethods((prev) => [...prev, newCard]);
    setAddOpen(false);
    setAddType(null);
    toast.success("Card added successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payment Methods</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {methods.length} saved {methods.length === 1 ? "method" : "methods"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Add Payment Method
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                setAddType("CARD");
                setAddOpen(true);
              }}
            >
              <CreditCard className="h-4 w-4 mr-2" /> Add Card
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setAddType("BANK_TRANSFER");
                setAddOpen(true);
              }}
            >
              <Building2 className="h-4 w-4 mr-2" /> Add Bank Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* States */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center text-destructive">
            Unable to load payment methods. Please refresh.
          </CardContent>
        </Card>
      ) : methods.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-muted-foreground">No payment methods saved yet.</p>
            <Button
              onClick={() => {
                setAddType("BANK_TRANSFER");
                setAddOpen(true);
              }}
            >
              <Plus className="h-4 w-4" /> Add Your First Method
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {methods.map((m) => (
            <MethodCard
              key={m.id}
              method={m}
              onSetDefault={() => handleSetDefault(m.id)}
              onRemove={() => setRemoveId(m.id)}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Dialog
        open={addOpen}
        onOpenChange={(o) => {
          setAddOpen(o);
          if (!o) setAddType(null);
        }}
      >
        <DialogContent className="max-w-md">
          {addType === "BANK_TRANSFER" ? (
            <AddBankForm onSubmit={handleAddBank} />
          ) : addType === "CARD" ? (
            <AddCardView onAuthorize={handleAddCard} />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Remove Confirm */}
      <Dialog open={!!removeId} onOpenChange={(o) => !o && setRemoveId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this payment method? This cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const MethodCard = ({
  method,
  onSetDefault,
  onRemove,
}: {
  method: PaymentMethod;
  onSetDefault: () => void;
  onRemove: () => void;
}) => {
  const isCard = method.type === "CARD";
  return (
    <Card>
      <CardContent className="p-4 flex items-start gap-4">
        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
          {isCard ? (
            <CreditCard className="h-6 w-6 text-foreground" />
          ) : (
            <Building2 className="h-6 w-6 text-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {isCard ? (
              <>
                <span className="font-medium text-foreground">
                  •••• •••• •••• {method.card_last_four}
                </span>
                <Badge variant="secondary">{method.card_brand}</Badge>
              </>
            ) : (
              <>
                <span className="font-medium text-foreground">
                  {method.account_name} — {method.bank_name}
                </span>
                <span className="text-sm text-muted-foreground">
                  ••••{method.account_last_four}
                </span>
              </>
            )}
            <Badge variant="outline" className="text-muted-foreground">
              {method.provider}
            </Badge>
            {method.is_default && (
              <Badge className="bg-green-600 hover:bg-green-600 text-white">
                Default
              </Badge>
            )}
          </div>
          {method.system_message && (
            <p className="text-xs italic text-muted-foreground mt-1.5">
              {method.system_message}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3 text-sm">
            {!method.is_default && (
              <button
                onClick={onSetDefault}
                className="text-primary hover:underline"
              >
                Set as Default
              </button>
            )}
            <button
              onClick={onRemove}
              className="text-destructive hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AddBankForm = ({
  onSubmit,
}: {
  onSubmit: (m: PaymentMethod) => void;
}) => {
  const [gateway, setGateway] = useState<Gateway>("Paystack");
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const handleVerify = () => {
    setVerifyError(null);
    if (accountNumber.length !== 10) {
      setVerifyError("Account number must be 10 digits.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      // mock: fail when ends with 0
      if (accountNumber.endsWith("0")) {
        setVerifyError("Could not verify account. Please check details.");
        setVerified(false);
        return;
      }
      setAccountName("JANE SMITH");
      setVerified(true);
    }, 1200);
  };

  const handleSubmit = () => {
    onSubmit({
      id: `pm_${Date.now()}`,
      type: "BANK_TRANSFER",
      provider: gateway,
      is_default: false,
      account_name: accountName,
      bank_name: bankName || "GTBank",
      account_last_four: accountNumber.slice(-4),
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Bank Account</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Gateway</Label>
          <RadioGroup
            value={gateway}
            onValueChange={(v) => setGateway(v as Gateway)}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Paystack" id="g-paystack" />
              <Label htmlFor="g-paystack" className="cursor-pointer">
                Paystack
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Flutterwave" id="g-flutterwave" />
              <Label htmlFor="g-flutterwave" className="cursor-pointer">
                Flutterwave
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank-name">Bank Name</Label>
          <Input
            id="bank-name"
            placeholder="e.g. Access Bank"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank-code">Bank Code</Label>
          <Input
            id="bank-code"
            placeholder="e.g. 044"
            value={bankCode}
            onChange={(e) => setBankCode(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="acct-num">Account Number</Label>
          <div className="flex gap-2">
            <Input
              id="acct-num"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit account number"
              value={accountNumber}
              onChange={(e) => {
                setAccountNumber(e.target.value.replace(/\D/g, ""));
                setVerified(false);
                setAccountName("");
                setVerifyError(null);
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleVerify}
              disabled={verifying || accountNumber.length !== 10}
            >
              {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Account"}
            </Button>
          </div>
          {verified && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              <span>{accountName} — {bankName || "GTBank"}</span>
            </div>
          )}
          {verifyError && (
            <p className="text-sm text-destructive">{verifyError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="acct-name">Account Name</Label>
          <Input
            id="acct-name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            readOnly={verified}
            placeholder="Verify account to auto-fill"
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSubmit} disabled={!verified}>
          Save Bank Account
        </Button>
      </DialogFooter>
    </>
  );
};

const AddCardView = ({ onAuthorize }: { onAuthorize: () => void }) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Add Card</DialogTitle>
        <DialogDescription>
          You'll be redirected to your gateway's secure card authorization form.
          No card details are stored by Primemart.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4 flex flex-col items-center gap-3 text-center">
        <CreditCard className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Click below to launch the secure payment modal.
        </p>
      </div>
      <DialogFooter>
        <Button onClick={onAuthorize}>Launch Secure Form</Button>
      </DialogFooter>
    </>
  );
};

export default UserPaymentMethods;
