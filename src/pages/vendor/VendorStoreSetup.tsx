import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// ----- Mock backend payload (would come from GET /vendor/store/me/) -----
const MOCK_STORE = {
  reference_code: "STR-20260421-K9PXR7",
  name: "Tony's Store",
  description: "",
  email: "",
  phone: "",
  is_suspended: false,
  flag_message: null as string | null,
  system_message: null as string | null,
};

const DESCRIPTION_MAX = 500;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const VendorStoreSetup = () => {
  const navigate = useNavigate();
  const store = MOCK_STORE;
  const isSuspended = store.is_suspended;

  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description);
  const [email, setEmail] = useState(store.email);
  const [phone, setPhone] = useState(store.phone);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedOk, setSavedOk] = useState(false);

  const slug = useMemo(() => slugify(name) || "your-store", [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSuspended) return;
    setNameError(null);

    if (!name.trim()) {
      setNameError("Store name is required.");
      return;
    }

    setIsSaving(true);
    try {
      // Simulated API call
      await new Promise((r) => setTimeout(r, 1100));

      // Demo: trigger duplicate-name error
      if (name.trim().toLowerCase() === "taken") {
        setNameError(
          "A store with this name already exists. Please choose a different name."
        );
        setIsSaving(false);
        return;
      }

      setSavedOk(true);
      setTimeout(() => navigate("/vendor/packages"), 700);
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsSaving(false);
    }
  };

  const readOnly = isSuspended;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {/* Top callout banner */}
      <div className="rounded-lg border bg-muted/40 p-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Badge variant="secondary" className="font-mono text-xs">
            {store.reference_code}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Your store has been created. Complete your profile to start selling.
          </p>
        </div>
      </div>

      {/* Suspended banner sits ABOVE the card */}
      {isSuspended && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your store has been suspended. Contact support to resolve this before
            making changes.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Set up your store</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Flag message — amber */}
          {store.flag_message && (
            <div className="flex gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{store.flag_message}</p>
            </div>
          )}

          {/* System message — blue */}
          {store.system_message && (
            <div className="flex gap-2 rounded-md border border-blue-300 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>{store.system_message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Store Name */}
            <div className="space-y-2">
              <Label htmlFor="store-name">
                Store Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="store-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="Tony's Store"
                readOnly={readOnly}
                aria-invalid={!!nameError}
                className={cn(nameError && "border-destructive focus-visible:ring-destructive")}
                maxLength={80}
                required
              />
              <p className="text-xs text-muted-foreground">
                primemart.com/store/<span className="text-foreground">{slug}</span>
              </p>
              {nameError && (
                <p className="text-sm font-medium text-destructive">{nameError}</p>
              )}
            </div>

            {/* Store Description */}
            <div className="space-y-2">
              <Label htmlFor="store-description">Store Description</Label>
              <div className="relative">
                <Textarea
                  id="store-description"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.slice(0, DESCRIPTION_MAX))
                  }
                  placeholder="Describe your store — what you sell, your brand story, why buyers should choose you."
                  rows={4}
                  readOnly={readOnly}
                  className="pr-16 resize-none"
                />
                <span className="pointer-events-none absolute bottom-2 right-3 text-xs text-muted-foreground">
                  {description.length}/{DESCRIPTION_MAX}
                </span>
              </div>
            </div>

            {/* Store Email */}
            <div className="space-y-2">
              <Label htmlFor="store-email">Store Email</Label>
              <Input
                id="store-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="store@yourbusiness.com"
                readOnly={readOnly}
              />
              <p className="text-xs text-muted-foreground">
                A public contact email for your store. Not your login email.
              </p>
            </div>

            {/* Store Phone */}
            <div className="space-y-2">
              <Label htmlFor="store-phone">Store Phone</Label>
              <Input
                id="store-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                readOnly={readOnly}
              />
              <p className="text-xs text-muted-foreground">Include country code.</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
              <Button
                type="submit"
                disabled={isSaving || readOnly || savedOk}
                className="w-full sm:w-auto sm:min-w-[180px]"
              >
                {savedOk ? (
                  <>
                    <Check className="h-4 w-4" /> Saved
                  </>
                ) : isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save & Continue"
                )}
              </Button>
            </div>

            <div className="flex justify-center sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/vendor")}
                className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                disabled={isSaving}
              >
                Skip for now →
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorStoreSetup;
