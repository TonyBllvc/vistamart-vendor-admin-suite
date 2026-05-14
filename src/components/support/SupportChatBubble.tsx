import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import SupportChatRoom from "@/pages/support/SupportChatRoom";

type View = "form" | "chat";

interface Props {
  /** If true, the user is logged in and we skip the entry form. */
  isAuthenticated?: boolean;
  /** Whether any agents are online (presence layer). */
  agentsOnline?: boolean;
}

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const SupportChatBubble = ({ isAuthenticated = false, agentsOnline = true }: Props) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>(isAuthenticated ? "chat" : "form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [guestName, setGuestName] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setView(isAuthenticated ? "chat" : "form");
  };

  const handleClose = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // reset for next session
      setTimeout(() => {
        if (!isAuthenticated) {
          setView("form");
          setErrors({});
        }
      }, 200);
    }
  };

  const validate = () => {
    const next: { name?: string; email?: string } = {};
    if (!name.trim()) next.name = "Please enter your name.";
    if (!email.trim()) next.email = "Please enter your email.";
    else if (!isValidEmail(email.trim())) next.email = "Please enter a valid email address.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Mock API call. Replace with real /api/support/guest-room request.
      await new Promise((r) => setTimeout(r, 800));

      // Mock: emails ending in @primemart.com simulate registered accounts.
      if (email.trim().toLowerCase().endsWith("@primemart.com")) {
        setErrors({
          email:
            "This email is linked to a Primemart account. Please log in to chat with support.",
        });
        return;
      }

      // is_new_room: true | false — both flow into the chat view.
      setGuestName(name.trim());
      setView("chat");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Chat with support"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
        <span
          className={cn(
            "absolute right-1 top-1 h-3 w-3 rounded-full ring-2 ring-background",
            agentsOnline ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
          )}
          aria-label={agentsOnline ? "Agents online" : "Agents offline"}
        />
      </button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="p-0 sm:max-w-md">
          {view === "form" ? (
            <div className="p-6">
              <DialogHeader>
                <DialogTitle>Chat with Support</DialogTitle>
                <DialogDescription>
                  We typically reply within a few minutes.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="guest-name">Your Name</Label>
                  <Input
                    id="guest-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Adaeze Okafor"
                    aria-invalid={!!errors.name}
                    disabled={submitting}
                  />
                  {errors.name && (
                    <p className="text-sm font-medium text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="guest-email">Your Email</Label>
                  <Input
                    id="guest-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    aria-invalid={!!errors.email}
                    disabled={submitting}
                  />
                  {errors.email ? (
                    <p className="text-sm font-medium text-destructive">{errors.email}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      We'll use this to follow up if we get disconnected.
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Starting chat..." : "Start Chat"}
                </Button>
              </form>
            </div>
          ) : (
            <div className="p-0">
              <SupportChatRoom embedded entryName={isAuthenticated ? undefined : guestName} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SupportChatBubble;
