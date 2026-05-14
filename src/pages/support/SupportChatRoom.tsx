import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Send, X, AlertTriangle, ArrowDown, Loader2, Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type MsgType = "client" | "staff" | "system";
type ReadState = "sent" | "delivered" | "read";

interface Message {
  id: string;
  type: MsgType;
  body: string;
  senderName?: string;
  timestamp: string;
  is_filtered?: boolean;
  is_deleted?: boolean;
  read_state?: ReadState;
}

type RoomStatus = "WAITING" | "ACTIVE" | "CLOSED";

const formatTime = (d: Date) =>
  d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const SupportChatRoom = ({
  embedded = false,
  entryName,
}: {
  embedded?: boolean;
  entryName?: string;
}) => {
  const [status, setStatus] = useState<RoomStatus>("ACTIVE");
  const [agentOnline, setAgentOnline] = useState(true);
  const [agentName, setAgentName] = useState("Sarah");
  const [isBlocked, setIsBlocked] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [minimised, setMinimised] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const [input, setInput] = useState("");
  const [showNewPill, setShowNewPill] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "s1",
      type: "system",
      body: "A support agent has joined this conversation.",
      timestamp: formatTime(new Date(Date.now() - 600000)),
    },
    {
      id: "a1",
      type: "staff",
      senderName: "Sarah",
      body: "Hi there! How can I help you today?",
      timestamp: formatTime(new Date(Date.now() - 540000)),
    },
    {
      id: "c1",
      type: "client",
      senderName: "You",
      body: "Hi, I have a question about my last order.",
      timestamp: formatTime(new Date(Date.now() - 480000)),
      read_state: "read",
    },
    {
      id: "c2",
      type: "client",
      senderName: "You",
      body: "It hasn't shipped yet and it's been 3 days.",
      timestamp: formatTime(new Date(Date.now() - 420000)),
      read_state: "read",
      is_filtered: true,
    },
    {
      id: "a2",
      type: "staff",
      senderName: "Sarah",
      body: "Let me check that for you right away.",
      timestamp: formatTime(new Date(Date.now() - 360000)),
    },
    {
      id: "d1",
      type: "client",
      senderName: "You",
      body: "[This message was deleted for everyone]",
      timestamp: formatTime(new Date(Date.now() - 300000)),
      is_deleted: true,
    },
  ]);

  const feedRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    if (!entryName) return;
    setMessages((m) => [
      ...m,
      {
        id: `s-entry-${Date.now()}`,
        type: "system",
        body: `${entryName} has entered the chat.`,
        timestamp: formatTime(new Date()),
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryName]);

  const scrollToBottom = () => {
    const el = feedRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setShowNewPill(false);
  };

  useEffect(() => {
    if (isAtBottomRef.current) scrollToBottom();
    else setShowNewPill(true);
  }, [messages, agentTyping]);

  const handleScroll = () => {
    const el = feedRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
    isAtBottomRef.current = atBottom;
    if (atBottom) setShowNewPill(false);
  };

  const inputDisabled =
    status === "CLOSED" || status === "WAITING" || isBlocked || isReconnecting;

  const inputPlaceholder = isBlocked
    ? "You have been blocked from sending messages."
    : status === "CLOSED"
    ? "This conversation is closed."
    : status === "WAITING"
    ? "Waiting for an agent..."
    : "Type your message...";

  const sendMessage = () => {
    const text = input.trim();
    if (!text || inputDisabled) return;
    const newMsg: Message = {
      id: `c${Date.now()}`,
      type: "client",
      senderName: "You",
      body: text,
      timestamp: formatTime(new Date()),
      read_state: "sent",
    };
    setMessages((m) => [...m, newMsg]);
    setInput("");
    isAtBottomRef.current = true;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setStatus("ACTIVE");
    setAgentOnline(true);
    setMessages([
      {
        id: `s${Date.now()}`,
        type: "system",
        body: "Thank you for your patience. An agent will be with you shortly.",
        timestamp: formatTime(new Date()),
      },
    ]);
  };

  if (hasError) {
    return (
      <Card className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Unable to load your conversation. Please refresh.
          </p>
        </div>
      </Card>
    );
  }

  if (minimised) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Button onClick={() => setMinimised(false)}>Open Support Chat</Button>
      </div>
    );
  }

  const statusBadge = agentOnline ? (
    <Badge className="bg-green-500 hover:bg-green-500 text-white">Online</Badge>
  ) : status === "WAITING" ? (
    <Badge variant="secondary">Waiting</Badge>
  ) : (
    <Badge variant="secondary">Away</Badge>
  );

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "flex flex-col overflow-hidden",
          embedded ? "h-[600px]" : "h-[calc(100vh-8rem)]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-foreground">Primemart Support</h2>
            {statusBadge}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMinimised(true)}
            aria-label="Minimise"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Feed */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={feedRef}
            onScroll={handleScroll}
            className="h-full space-y-4 overflow-y-auto p-4"
          >
            {messages.map((m) => {
              if (m.type === "system") {
                return (
                  <div key={m.id} className="flex justify-center">
                    <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                      {m.body}
                    </span>
                  </div>
                );
              }
              const isOwn = m.type === "client";
              return (
                <div
                  key={m.id}
                  className={cn("flex flex-col", isOwn ? "items-end" : "items-start")}
                >
                  <span className="mb-1 px-1 text-xs text-muted-foreground">
                    {isOwn ? "You" : m.senderName}
                  </span>
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground",
                      m.is_deleted && "italic opacity-70"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className="whitespace-pre-wrap break-words">{m.body}</span>
                      {m.is_filtered && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            This message has been filtered.
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-1 px-1">
                    <span className="text-[10px] text-muted-foreground">
                      {m.timestamp}
                    </span>
                    {isOwn && m.read_state && !m.is_deleted && (
                      <span className="text-muted-foreground">
                        {m.read_state === "sent" && (
                          <Check className="h-3 w-3" />
                        )}
                        {m.read_state === "delivered" && (
                          <CheckCheck className="h-3 w-3" />
                        )}
                        {m.read_state === "read" && (
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {agentTyping && (
              <div className="flex flex-col items-start">
                <span className="mb-1 px-1 text-xs text-muted-foreground">
                  {agentName}
                </span>
                <div className="rounded-2xl bg-muted px-4 py-2">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {showNewPill && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-xs text-primary-foreground shadow-md hover:opacity-90"
            >
              <ArrowDown className="mr-1 inline h-3 w-3" />
              New messages
            </button>
          )}
        </div>

        {/* Banners */}
        {isReconnecting && (
          <div className="flex items-center justify-center gap-2 border-t border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            Reconnecting...
          </div>
        )}

        {status === "CLOSED" && (
          <div className="flex flex-col gap-2 border-t border-border bg-muted/50 px-4 py-3 text-center">
            <p className="text-sm text-muted-foreground">
              This conversation has ended. Start a new chat if you need further
              assistance.
            </p>
            <Button size="sm" onClick={startNewChat} className="self-center">
              New Chat
            </Button>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={inputDisabled}
              placeholder={inputPlaceholder}
              className="min-h-[44px] max-h-32 flex-1 resize-none"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={inputDisabled || !input.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Hidden dev controls — remove in production */}
      <div className="mt-4 hidden gap-2">
        <Button onClick={() => setStatus("CLOSED")}>Close room</Button>
        <Button onClick={() => setIsBlocked(true)}>Block</Button>
        <Button onClick={() => setIsReconnecting((v) => !v)}>Reconnect</Button>
        <Button onClick={() => setAgentTyping((v) => !v)}>Typing</Button>
        <Button onClick={() => setHasError(true)}>Error</Button>
      </div>
    </TooltipProvider>
  );
};

export default SupportChatRoom;
