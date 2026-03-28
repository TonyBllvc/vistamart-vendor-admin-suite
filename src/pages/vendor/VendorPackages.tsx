import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Package, 
  Crown, 
  Zap, 
  Star, 
  Check, 
  CreditCard, 
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const packages = [
  {
    id: "pkg-basic",
    package_name: "Starter",
    package_price: 9.99,
    package_discount: 0,
    package_duration: 30,
    product_allowed_status: true,
    product_limits: 10,
    active_vendor_count: 124,
    icon: Zap,
    popular: false,
    features: [
      "Up to 10 product listings",
      "Basic product analytics",
      "Standard support",
      "30-day duration",
    ],
  },
  {
    id: "pkg-pro",
    package_name: "Professional",
    package_price: 29.99,
    package_discount: 10,
    package_duration: 30,
    product_allowed_status: true,
    product_limits: 50,
    active_vendor_count: 89,
    icon: Star,
    popular: true,
    features: [
      "Up to 50 product listings",
      "Advanced analytics & insights",
      "Priority support",
      "30-day duration",
      "Featured badge on store",
    ],
  },
  {
    id: "pkg-enterprise",
    package_name: "Enterprise",
    package_price: 79.99,
    package_discount: 15,
    package_duration: 30,
    product_allowed_status: true,
    product_limits: 200,
    active_vendor_count: 34,
    icon: Crown,
    popular: false,
    features: [
      "Up to 200 product listings",
      "Full analytics suite",
      "Dedicated account manager",
      "30-day duration",
      "Featured badge on store",
      "Homepage spotlight",
      "Priority in search results",
    ],
  },
  {
    id: "pkg-unlimited",
    package_name: "Unlimited",
    package_price: 149.99,
    package_discount: 20,
    package_duration: 30,
    product_allowed_status: true,
    product_limits: -1,
    active_vendor_count: 12,
    icon: Sparkles,
    popular: false,
    features: [
      "Unlimited product listings",
      "Full analytics suite",
      "Dedicated account manager",
      "30-day duration",
      "Featured badge on store",
      "Homepage spotlight",
      "Priority in search results",
      "Custom storefront theme",
    ],
  },
];

// Mock current subscription
const currentSubscription = {
  package_id: "pkg-pro",
  package_name: "Professional",
  product_limits: 50,
  products_used: 23,
  expires_at: "2026-04-28",
  status: "active",
};

const VendorPackages = () => {
  const navigate = useNavigate();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);

  const getDiscountedPrice = (price: number, discount: number) => {
    return (price - (price * discount / 100)).toFixed(2);
  };

  const handleSelectPackage = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setPaymentDialogOpen(true);
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setPaymentDialogOpen(false);
      toast.success(`Successfully subscribed to ${selectedPackage?.package_name} package!`);
      navigate("/vendor/products/manage");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Vendor Packages</h1>
        <p className="text-muted-foreground">
          Choose a package that fits your business needs. Upgrade or switch anytime.
        </p>
      </div>

      {/* Current Subscription */}
      <Card className="border-secondary/30 bg-secondary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-secondary" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Package</p>
              <p className="font-semibold text-lg">{currentSubscription.package_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Products Used</p>
              <p className="font-semibold text-lg">
                {currentSubscription.products_used} / {currentSubscription.product_limits}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="bg-success text-success-foreground">{currentSubscription.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expires</p>
              <p className="font-semibold flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {currentSubscription.expires_at}
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-48 bg-muted rounded-full h-2.5">
                <div 
                  className="bg-secondary h-2.5 rounded-full transition-all" 
                  style={{ width: `${(currentSubscription.products_used / currentSubscription.product_limits) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-right">
                {Math.round((currentSubscription.products_used / currentSubscription.product_limits) * 100)}% used
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg) => {
          const isCurrent = pkg.id === currentSubscription.package_id;
          const discountedPrice = getDiscountedPrice(pkg.package_price, pkg.package_discount);
          const IconComp = pkg.icon;

          return (
            <Card 
              key={pkg.id} 
              className={`relative flex flex-col transition-all hover:shadow-lg ${
                pkg.popular ? "border-secondary shadow-md ring-1 ring-secondary/20" : ""
              } ${isCurrent ? "border-primary ring-1 ring-primary/20" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-secondary text-secondary-foreground px-3">Most Popular</Badge>
                </div>
              )}
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3">Current Plan</Badge>
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <div className="mx-auto w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-3">
                  <IconComp className="h-7 w-7 text-accent-foreground" />
                </div>
                <CardTitle className="text-xl">{pkg.package_name}</CardTitle>
                <CardDescription>
                  {pkg.product_limits === -1 ? "Unlimited" : `Up to ${pkg.product_limits}`} products
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <div className="text-center">
                  {pkg.package_discount > 0 && (
                    <p className="text-sm text-muted-foreground line-through">${pkg.package_price}</p>
                  )}
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">${discountedPrice}</span>
                    <span className="text-muted-foreground text-sm">/{pkg.package_duration} days</span>
                  </div>
                  {pkg.package_discount > 0 && (
                    <Badge variant="outline" className="mt-1 text-success border-success/30">
                      {pkg.package_discount}% OFF
                    </Badge>
                  )}
                </div>

                <ul className="space-y-2.5">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-muted-foreground text-center">
                  {pkg.active_vendor_count} vendors on this plan
                </p>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={isCurrent ? "outline" : pkg.popular ? "default" : "outline"}
                  disabled={isCurrent}
                  onClick={() => handleSelectPackage(pkg)}
                >
                  {isCurrent ? "Current Plan" : (
                    <>
                      Select Plan <ArrowRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Payment
            </DialogTitle>
            <DialogDescription>
              Subscribe to the {selectedPackage?.package_name} package
            </DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-5">
              {/* Order Summary */}
              <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                <h4 className="font-medium text-sm">Order Summary</h4>
                <div className="flex justify-between text-sm">
                  <span>{selectedPackage.package_name} Package</span>
                  <span>${selectedPackage.package_price}</span>
                </div>
                {selectedPackage.package_discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount ({selectedPackage.package_discount}%)</span>
                    <span>-${(selectedPackage.package_price * selectedPackage.package_discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${getDiscountedPrice(selectedPackage.package_price, selectedPackage.package_discount)}</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Valid for {selectedPackage.package_duration} days
                </p>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit / Debit Card</SelectItem>
                    <SelectItem value="wallet">System Wallet</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Card Number</Label>
                    <Input placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Expiry</Label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label>CVV</Label>
                      <Input placeholder="123" type="password" />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="rounded-lg border p-4 bg-accent/30 space-y-2">
                  <p className="text-sm font-medium">Wallet Balance: $1,250.00</p>
                  <p className="text-xs text-muted-foreground">
                    Amount of ${getDiscountedPrice(selectedPackage.package_price, selectedPackage.package_discount)} will be deducted from your wallet.
                  </p>
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="text-sm flex items-center gap-1 text-warning">
                    <AlertCircle className="h-4 w-4" />
                    Bank transfers may take 1-3 business days to process.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayment} disabled={processing}>
              {processing ? "Processing..." : `Pay $${selectedPackage ? getDiscountedPrice(selectedPackage.package_price, selectedPackage.package_discount) : "0"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorPackages;
