import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Clock, LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createPortal } from "react-dom";

type SessionState = "active" | "expiring" | "expired";

interface SessionProfile {
  name: string;
  role: string;
  /** Unix ms timestamp when the current session expires */
  expiresAt: number;
}

interface SessionStatusIndicatorProps {
  /**
   * Optional override of the session profile, normally fetched from
   * GET /profile/token/. Falls back to a mocked 1-day session for preview.
   */
  profile?: SessionProfile;
  /** Window before expiry to surface the warning banner. Defaults to 10 min. */
  warningWindowMs?: number;
}

const DEFAULT_WARNING_MS = 10 * 60 * 1000; // 10 minutes
const DAY_MS = 24 * 60 * 60 * 1000;

const formatRemaining = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
};

export const SessionStatusIndicator = ({
  profile,
  warningWindowMs = DEFAULT_WARNING_MS,
}: SessionStatusIndicatorProps) => {
  const navigate = useNavigate();

  // Mocked default: an active 1-day session
  const sessionProfile = useMemo<SessionProfile>(
    () =>
      profile ?? {
        name: "Admin User",
        role: "Administrator",
        expiresAt: Date.now() + DAY_MS,
      },
    [profile]
  );

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remainingMs = sessionProfile.expiresAt - now;

  const state: SessionState = remainingMs <= 0
    ? "expired"
    : remainingMs <= warningWindowMs
      ? "expiring"
      : "active";

  // ----- State A: Active session — render the top-bar identity chip -----
  const IdentityChip = (
    <div className="flex items-center gap-3 rounded-full border bg-card px-3 py-1.5 shadow-sm">
      <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
        <span className="text-primary-foreground text-xs font-semibold">
          {sessionProfile.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </span>
      </div>
      <div className="leading-tight pr-1">
        <p className="text-sm font-medium text-foreground">
          {sessionProfile.name}
        </p>
        <p className="text-xs text-muted-foreground">{sessionProfile.role}</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Identity chip lives in the top bar via portal-less inline render */}
      <div data-session-identity className="hidden" aria-hidden>
        {/* placeholder so consumers can detect the component is mounted */}
      </div>

      {/* The chip itself is exported via a separate slot to keep top-bar layout clean */}
      <SessionIdentitySlot>{IdentityChip}</SessionIdentitySlot>

      {/* State B: Expiring soon — subtle amber banner */}
      {state === "expiring" && (
        <Alert className="mb-4 border-warning/40 bg-warning/10">
          <Clock className="h-4 w-4 !text-warning" />
          <AlertDescription className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-medium text-foreground">
              Your session will expire soon.
            </span>
            <span className="text-muted-foreground">
              Activity will keep you logged in.
            </span>
            <span className="ml-auto rounded-full bg-warning/20 px-2 py-0.5 text-xs font-mono font-medium text-foreground">
              {formatRemaining(remainingMs)} left
            </span>
          </AlertDescription>
        </Alert>
      )}

      {/* State C: Expired — full-screen, non-dismissible modal */}
      <Dialog open={state === "expired"}>
        <DialogContent
          className="max-w-md [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">
              Your session has expired
            </DialogTitle>
            <DialogDescription className="text-center">
              For your security, you have been signed out. Please log in again
              to continue managing the marketplace.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              className="w-full sm:w-auto"
              onClick={() => navigate("/login")}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Go to Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

/**
 * Tiny helper to render the identity chip into the top-bar slot via a
 * DOM portal-style attachment. Falls back to inline render when the
 * slot element isn't present.
 */
const SessionIdentitySlot = ({ children }: { children: React.ReactNode }) => {
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const node = document.getElementById("admin-session-slot");
    setMountNode(node);
  }, []);

  if (!mountNode) return null;
  // Use a simple cloneNode-free approach: render via React portal
  return <PortalInto node={mountNode}>{children}</PortalInto>;
};

const PortalInto = ({
  node,
  children,
}: {
  node: HTMLElement;
  children: React.ReactNode;
}) => createPortal(children, node);

export default SessionStatusIndicator;
