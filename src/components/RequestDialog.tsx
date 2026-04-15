import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, RotateCcw, Flag, FolderPlus, ArrowUpDown, Plus, Loader2 } from "lucide-react";
import { type RequestType, requestTypeLabels, requestTypeDescriptions } from "@/data/requestsData";

interface RequestDialogProps {
  role: "user" | "vendor" | "affiliate";
  allowedTypes?: RequestType[];
  triggerLabel?: string;
  triggerVariant?: "default" | "outline" | "ghost" | "secondary";
}

const typeIcons: Record<RequestType, React.ElementType> = {
  order_dispute: AlertTriangle,
  return_refund: RotateCcw,
  review_report: Flag,
  brand_category_request: FolderPlus,
  package_change: ArrowUpDown,
  system_generated: AlertTriangle,
};

const defaultTypesByRole: Record<string, RequestType[]> = {
  user: ["order_dispute", "return_refund", "review_report"],
  vendor: ["order_dispute", "review_report", "brand_category_request", "package_change"],
  affiliate: ["order_dispute", "return_refund", "review_report"],
};

export function RequestDialog({
  role,
  allowedTypes,
  triggerLabel = "Submit Request",
  triggerVariant = "outline",
}: RequestDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<RequestType | "">("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [referenceId, setReferenceId] = useState("");

  const types = allowedTypes || defaultTypesByRole[role] || [];

  const handleSubmit = () => {
    if (!type || !subject || !description) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Request Submitted",
        description: `Your ${requestTypeLabels[type]} request has been submitted and will be reviewed by our team.`,
      });
      setOpen(false);
      setType("");
      setSubject("");
      setDescription("");
      setReferenceId("");
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit a Request</DialogTitle>
          <DialogDescription>
            Your request will be routed to admin management for review and resolution.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Request Type *</Label>
            <Select value={type} onValueChange={(v) => setType(v as RequestType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select request type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => {
                  const Icon = typeIcons[t];
                  return (
                    <SelectItem key={t} value={t}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5" />
                        <span>{requestTypeLabels[t]}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {type && (
              <p className="text-xs text-muted-foreground">{requestTypeDescriptions[type]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Subject *</Label>
            <Input
              placeholder="Brief summary of your request"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {(type === "order_dispute" || type === "return_refund" || type === "review_report") && (
            <div className="space-y-2">
              <Label>Reference ID</Label>
              <Input
                placeholder={
                  type === "review_report" ? "Review ID (e.g. REV-1234)" : "Order ID (e.g. ORD-001)"
                }
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
              />
            </div>
          )}

          {type === "brand_category_request" && (
            <div className="space-y-2">
              <Label>Brand / Category Name</Label>
              <Input
                placeholder="Name of the brand or category you'd like created"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
              />
            </div>
          )}

          {type === "package_change" && (
            <div className="space-y-2">
              <Label>Desired Package</Label>
              <Select value={referenceId} onValueChange={setReferenceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target package" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              placeholder="Provide details about your request, including any evidence or supporting information..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
