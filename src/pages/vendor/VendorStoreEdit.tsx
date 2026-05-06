import { useMemo, useState } from "react";
import { Loader2, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ----- Mock backend payload (would come from GET /vendor/store/me/) -----
const MOCK_STORE = {
  reference_code: "STR-20260421-K9PXR7",
  name: "Tony's Store",
  description:
    "We sell handcrafted leather goods made in Lagos — wallets, belts, and bags built to last.",
  email: "hello@tonysstore.com",
  phone: "+234 801 234 5678",
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

const VendorStoreEdit = () => {
  const store = MOCK_STORE;
  const isSuspended = store.is_suspended;
  const readOnly = isSuspended;

  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description);
  const [email, setEmail] = useState(store.email);
  const [phone, setPhone] = useState(store.phone);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const slug = useMemo(() => slugify(name) || "your-store", [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    setNameError(null);

    if (!name.trim()) {
      setNameError("Store name is required.");
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 1100));

      // Demo: trigger duplicate-name error
      if (name.trim().toLowerCase() === "taken") {
        setNameError(
          "A store with this name already exists. Please choose a different name."
        );
        setIsSaving(false);
        return;
      }

      toast.success("Store profile updated successfully.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {/* Page header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Edit Store Profile</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="secondary"
                className="font-mono text-xs cursor-help"
              >
                {store.reference_code}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Your unique store ID. Use this when contacting support.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
        <CardContent className="space-y-5 pt-6">
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
                className={cn(
                  nameError && "border-destructive focus-visible:ring-destructive"
                )}
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
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isSaving || readOnly}
                className="w-full sm:w-auto sm:min-w-[160px]"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorStoreEdit;
