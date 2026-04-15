import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, RotateCcw, Flag, FolderPlus, ArrowUpDown, Cpu, ChevronRight } from "lucide-react";
import { RequestDialog } from "@/components/RequestDialog";
import {
  mockRequests,
  requestTypeLabels,
  statusColors,
  priorityColors,
  type PlatformRequest,
  type RequestType,
  type RequesterRole,
} from "@/data/requestsData";

const typeIconMap: Record<RequestType, React.ElementType> = {
  order_dispute: AlertTriangle,
  return_refund: RotateCcw,
  review_report: Flag,
  brand_category_request: FolderPlus,
  package_change: ArrowUpDown,
  system_generated: Cpu,
};

interface MyRequestsProps {
  role: RequesterRole;
  requesterName?: string;
  limit?: number;
  showSubmitButton?: boolean;
}

export function MyRequests({ role, requesterName, limit = 5, showSubmitButton = true }: MyRequestsProps) {
  // Filter requests by role (and optionally name)
  const myRequests = mockRequests
    .filter((r) => {
      if (requesterName) return r.requesterRole === role && r.requesterName === requesterName;
      return r.requesterRole === role;
    })
    .slice(0, limit);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Requests
            </CardTitle>
            <CardDescription>Your submitted requests and disputes</CardDescription>
          </div>
          {showSubmitButton && role !== "system" && (
            <RequestDialog role={role as "user" | "vendor" | "affiliate"} />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {myRequests.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => {
              const TypeIcon = typeIconMap[req.type];
              return (
                <div
                  key={req.id}
                  className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-1.5 rounded bg-muted">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{req.subject}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-muted-foreground font-mono">{req.id}</span>
                        <Badge className={`text-[10px] px-1.5 py-0 ${statusColors[req.status]}`}>
                          {req.status.replace("_", " ")}
                        </Badge>
                        <Badge className={`text-[10px] px-1.5 py-0 ${priorityColors[req.priority]}`}>
                          {req.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(req.createdAt).toLocaleDateString()}
                        {req.referenceId && ` • Ref: ${req.referenceId}`}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
