import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { Loader2, ArrowLeft, Package as PackageIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PackageFormState = {
  name: string;
  description: string;
  price: string;
  discount: string;
  currency: string;
  productLimit: string;
  duration: string;
  gracePeriod: string;
  boostLevel: number;
  visibilityDuration: string;
  active: boolean;
};

const defaultState: PackageFormState = {
  name: "",
  description: "",
  price: "",
  discount: "0",
  currency: "NGN",
  productLimit: "",
  duration: "",
  gracePeriod: "0",
  boostLevel: 0,
  visibilityDuration: "",
  active: true,
};

// Mock fetch — replace with real API
const MOCK_PACKAGES: Record<string, PackageFormState & { displayName: string }> = {
  "1": {
    ...defaultState,
    displayName: "Professional",
    name: "Professional",
    description: "Mid-tier package for growing vendors with steady sales volume.",
    price: "15000",
    discount: "1500",
    currency: "NGN",
    productLimit: "200",
    duration: "30",
    gracePeriod: "7",
    boostLevel: 5,
    visibilityDuration: "",
    active: true,
  },
};

const schema = z.object({
  name: z.string().trim().min(1, "This field is required").max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  price: z
    .number({ invalid_type_error: "This field is required" })
    .positive("Price must be greater than zero."),
  discount: z.number().min(0, "Discount cannot be negative").optional(),
  currency: z.string().trim().min(1, "This field is required").max(3),
  productLimit: z
    .number({ invalid_type_error: "This field is required" })
    .int()
    .positive("Must be greater than zero"),
  duration: z
    .number({ invalid_type_error: "This field is required" })
    .int()
    .positive("Must be greater than zero"),
  gracePeriod: z.number().int().min(0, "Cannot be negative"),
  boostLevel: z
    .number()
    .min(0, "Boost level must be between 0 and 10.")
    .max(10, "Boost level must be between 0 and 10."),
  visibilityDuration: z.number().int().positive().optional(),
  active: z.boolean(),
});

const formatNGN = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);

export default function PackageForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<PackageFormState>(defaultState);
  const [displayName, setDisplayName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id && MOCK_PACKAGES[id]) {
      const { displayName, ...rest } = MOCK_PACKAGES[id];
      setForm(rest);
      setDisplayName(displayName);
    }
  }, [id, isEdit]);

  const update = <K extends keyof PackageFormState>(key: K, value: PackageFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const { [key as string]: _omit, ...rest } = prev;
      return rest;
    });
  };

  const finalPrice = useMemo(() => {
    const p = parseFloat(form.price) || 0;
    const d = parseFloat(form.discount) || 0;
    return Math.max(0, p - d);
  }, [form.price, form.discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = schema.safeParse({
      name: form.name,
      description: form.description,
      price: form.price === "" ? NaN : parseFloat(form.price),
      discount: form.discount === "" ? 0 : parseFloat(form.discount),
      currency: form.currency,
      productLimit: form.productLimit === "" ? NaN : parseInt(form.productLimit, 10),
      duration: form.duration === "" ? NaN : parseInt(form.duration, 10),
      gracePeriod: form.gracePeriod === "" ? 0 : parseInt(form.gracePeriod, 10),
      boostLevel: form.boostLevel,
      visibilityDuration:
        form.visibilityDuration === "" ? undefined : parseInt(form.visibilityDuration, 10),
      active: form.active,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSaving(true);
    try {
      // Simulated API call
      await new Promise((r) => setTimeout(r, 900));
      toast.success(isEdit ? "Package updated." : "Package created successfully.");
      if (!isEdit) navigate("/admin/packages");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fieldError = (key: string) =>
    errors[key] ? (
      <p className="text-sm font-medium text-destructive mt-1">{errors[key]}</p>
    ) : null;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/admin/packages")}
        className="mb-4 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Packages
      </Button>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <PackageIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEdit ? `Edit Package — ${displayName || "Package"}` : "Create Package"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              Packages control how many products a vendor can list, how long their
              subscription lasts, and how much search visibility boost they receive.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="name">
                Package Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Starter, Professional, Enterprise"
                className={cn("mt-1.5", errors.name && "border-destructive")}
              />
              {fieldError("name")}
            </div>

            <div>
              <Label htmlFor="description">Package Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Briefly describe what this package includes."
                className="mt-1.5"
              />
              {fieldError("description")}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">
                  Price <span className="text-destructive">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-muted-foreground border-r border-input pr-3">
                    NGN
                  </span>
                  <Input
                    id="price"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="5000.00"
                    className={cn("pl-16", errors.price && "border-destructive")}
                  />
                </div>
                {fieldError("price")}
              </div>

              <div>
                <Label htmlFor="discount">Discount</Label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-medium text-muted-foreground border-r border-input pr-3">
                    NGN
                  </span>
                  <Input
                    id="discount"
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    value={form.discount}
                    onChange={(e) => update("discount", e.target.value)}
                    placeholder="0.00"
                    className={cn("pl-16", errors.discount && "border-destructive")}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Flat amount deducted from price at checkout. Leave as 0 for no discount.
                </p>
                {fieldError("discount")}
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 border border-border px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Final price vendors pay:</span>
              <span className="text-base font-semibold text-foreground">
                {formatNGN(finalPrice)}
              </span>
            </div>

            <div className="max-w-[140px]">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={form.currency}
                onChange={(e) => update("currency", e.target.value.toUpperCase().slice(0, 3))}
                maxLength={3}
                placeholder="NGN"
                className={cn("mt-1.5 uppercase", errors.currency && "border-destructive")}
              />
              {fieldError("currency")}
            </div>
          </CardContent>
        </Card>

        {/* Limits & Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Limits & Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <Label htmlFor="productLimit">
                  Product Limit <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="productLimit"
                  type="number"
                  min="1"
                  value={form.productLimit}
                  onChange={(e) => update("productLimit", e.target.value)}
                  placeholder="50"
                  className={cn("mt-1.5", errors.productLimit && "border-destructive")}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Max active products allowed at one time.
                </p>
                {fieldError("productLimit")}
              </div>

              <div>
                <Label htmlFor="duration">
                  Duration (Days) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={(e) => update("duration", e.target.value)}
                  placeholder="30"
                  className={cn("mt-1.5", errors.duration && "border-destructive")}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  How long the subscription lasts after activation.
                </p>
                {fieldError("duration")}
              </div>

              <div>
                <Label htmlFor="gracePeriod">Grace Period (Days)</Label>
                <Input
                  id="gracePeriod"
                  type="number"
                  min="0"
                  value={form.gracePeriod}
                  onChange={(e) => update("gracePeriod", e.target.value)}
                  placeholder="7"
                  className={cn("mt-1.5", errors.gracePeriod && "border-destructive")}
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Extra days after expiry before products go invisible. 0 for none.
                </p>
                {fieldError("gracePeriod")}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visibility Boost */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Search Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label htmlFor="boostLevel">Search Visibility Boost</Label>
                <span className="text-3xl font-bold tabular-nums text-primary leading-none">
                  {form.boostLevel}
                </span>
              </div>
              <Slider
                id="boostLevel"
                min={0}
                max={10}
                step={1}
                value={[form.boostLevel]}
                onValueChange={(v) => update("boostLevel", v[0] ?? 0)}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0 — No boost</span>
                <span>10 — Maximum</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Higher boost means this vendor's products rank higher in search.
              </p>
              {fieldError("boostLevel")}
            </div>

            <Separator />

            <div className="max-w-sm">
              <Label htmlFor="visibilityDuration">Visibility Duration (Days)</Label>
              <Input
                id="visibilityDuration"
                type="number"
                min="1"
                value={form.visibilityDuration}
                onChange={(e) => update("visibilityDuration", e.target.value)}
                placeholder="Leave blank to match package duration"
                className={cn("mt-1.5", errors.visibilityDuration && "border-destructive")}
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                If set, the search boost expires after this many days even if the
                subscription is still active.
              </p>
              {fieldError("visibilityDuration")}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Label htmlFor="active" className="text-sm font-medium">
                  Package is active (visible to vendors)
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  When off, the package is hidden from vendors but not deleted.
                </p>
              </div>
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(v) => update("active", v)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pb-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/packages")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Package"}
          </Button>
        </div>
      </form>
    </div>
  );
}
