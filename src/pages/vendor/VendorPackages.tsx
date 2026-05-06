import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Clock, Package as PackageIcon, ShieldCheck, TrendingUp, AlertCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PkgTag {
  id: string;
  name: string;
  price: number;
  discount_price?: number | null;
  duration_days: number;
  product_limit: number;
  grace_period_days: number;
  boost_level: number; // 0-10
  description?: string | null;
  is_purchasable: boolean;
}

interface ActiveSubscription {
  package_name: string;
  expires_at: string; // ISO
}

const MOCK_PACKAGES: PkgTag[] = [
  {
    id: "pkg-starter",
    name: "Starter",
    price: 5000,
    discount_price: null,
    duration_days: 30,
    product_limit: 10,
    grace_period_days: 0,
    boost_level: 1,
    description: "Best for new vendors testing the waters.",
    is_purchasable: true,
  },
  {
    id: "pkg-growth",
    name: "Growth",
    price: 15000,
    discount_price: 12500,
    duration_days: 30,
    product_limit: 50,
    grace_period_days: 7,
    boost_level: 5,
    description: "Most chosen plan — balanced reach and price.",
    is_purchasable: true,
  },
  {
    id: "pkg-scale",
    name: "Scale",
    price: 35000,
    discount_price: 30000,
    duration_days: 60,
    product_limit: 250,
    grace_period_days: 14,
    boost_level: 9,
    description: "For established vendors pushing high volume catalogues.",
    is_purchasable: true,
  },
];

// Toggle these to preview different states
const MOCK_ACTIVE_SUBSCRIPTION: ActiveSubscription | null = null;
const MOCK_LOADING = false;
const MOCK_ERROR = false;

const HIGHLIGHTED_PACKAGE_ID = "pkg-growth";

const formatNGN = (n: number) =>
  `NGN ${n.toLocaleString("en-NG", { minimumFractionDigits: 0 })}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const VendorPackages = () => {
  const navigate = useNavigate();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const packages = MOCK_PACKAGES.filter((p) => p.is_purchasable);
  const activeSubscription = MOCK_ACTIVE_SUBSCRIPTION;

  const handleChoose = (pkg: PkgTag) => {
    setPurchasingId(pkg.id);
    setTimeout(() => {
      toast.success(`Selected ${pkg.name} plan. Redirecting to checkout…`);
      setPurchasingId(null);
      navigate("/vendor");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Choose a Package</h1>
        <p className="text-muted-foreground">
          Select a subscription plan to start listing your products. You can upgrade at any time.
        </p>
      </div>

      {/* Active subscription banner */}
      {activeSubscription && (
        <Alert className="border-primary/30 bg-primary/5 text-foreground">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription>
            You currently have an active{" "}
            <span className="font-semibold">{activeSubscription.package_name}</span>{" "}
            subscription, valid until{" "}
            <span className="font-semibold">{formatDate(activeSubscription.expires_at)}</span>.
            Purchasing a new package will upgrade your current plan.
          </AlertDescription>
        </Alert>
      )}

      {/* Loading */}
      {MOCK_LOADING && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[480px] rounded-lg" />
          ))}
        </div>
      )}

      {/* Error */}
      {!MOCK_LOADING && MOCK_ERROR && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Unable to load packages. Please refresh the page.</AlertDescription>
        </Alert>
      )}

      {/* Empty */}
      {!MOCK_LOADING && !MOCK_ERROR && packages.length === 0 && (
        <Card className="py-16">
          <CardContent className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <PackageIcon className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground max-w-md">
              No packages are currently available. Please check back soon or contact support.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Package grid */}
      {!MOCK_LOADING && !MOCK_ERROR && packages.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const highlighted = pkg.id === HIGHLIGHTED_PACKAGE_ID;
            const finalPrice = pkg.discount_price ?? pkg.price;
            const hasDiscount = pkg.discount_price != null && pkg.discount_price < pkg.price;
            const boostPct = (pkg.boost_level / 10) * 100;

            return (
              <Card
                key={pkg.id}
                className={`relative flex flex-col transition-all hover:shadow-md ${
                  highlighted ? "border-primary border-2 shadow-lg" : ""
                }`}
              >
                {highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground gap-1 px-3 py-1">
                      <Sparkles className="h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <h2 className="text-2xl font-bold">{pkg.name}</h2>
                </CardHeader>

                <CardContent className="flex-1 space-y-5">
                  {/* Price */}
                  <div>
                    {hasDiscount && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatNGN(pkg.price)}
                      </p>
                    )}
                    <p className="text-4xl font-extrabold tracking-tight">
                      {formatNGN(finalPrice)}
                    </p>
                  </div>

                  {/* Specs */}
                  <ul className="space-y-2.5 text-sm">
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>{pkg.duration_days} days</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <PackageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span>Up to {pkg.product_limit.toLocaleString()} products</span>
                    </li>
                    {pkg.grace_period_days > 0 && (
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>{pkg.grace_period_days}-day grace period after expiry</span>
                      </li>
                    )}
                  </ul>

                  {/* Boost */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Search visibility boost
                      </span>
                      <span className="font-semibold tabular-nums">{pkg.boost_level}/10</span>
                    </div>
                    <Progress value={boostPct} className="h-2" />
                  </div>

                  {/* Description */}
                  {pkg.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {pkg.description}
                    </p>
                  )}
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full"
                    variant={highlighted ? "default" : "outline"}
                    disabled={purchasingId !== null}
                    onClick={() => handleChoose(pkg)}
                  >
                    {purchasingId === pkg.id ? "Processing…" : "Choose This Plan"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorPackages;
