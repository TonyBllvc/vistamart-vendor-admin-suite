import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Download,
  AlertTriangle,
  RotateCcw,
  Flag,
  FolderPlus,
  ArrowUpDown,
  Cpu,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
  User,
  Mail,
  Calendar,
  FileText,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Loader2,
  Paperclip,
} from "lucide-react";
import {
  mockRequests,
  requestTypeLabels,
  statusColors,
  priorityColors,
  type PlatformRequest,
  type RequestStatus,
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

const roleColors: Record<RequesterRole, string> = {
  user: "text-blue-700 bg-blue-100",
  vendor: "text-purple-700 bg-purple-100",
  affiliate: "text-amber-700 bg-amber-100",
  system: "text-muted-foreground bg-muted",
};

const AdminRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState(mockRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<PlatformRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const stats = [
    {
      title: "Total Requests",
      value: requests.length.toString(),
      icon: FileText,
      description: "All requests",
    },
    {
      title: "Pending",
      value: requests.filter((r) => r.status === "pending").length.toString(),
      icon: Clock,
      description: "Awaiting review",
      color: "text-yellow-600",
    },
    {
      title: "In Review",
      value: requests.filter((r) => r.status === "in_review").length.toString(),
      icon: Shield,
      description: "Being processed",
      color: "text-blue-600",
    },
    {
      title: "Resolved",
      value: requests.filter((r) => r.status === "resolved" || r.status === "approved").length.toString(),
      icon: CheckCircle,
      description: "Successfully closed",
      color: "text-green-600",
    },
  ];

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesType = typeFilter === "all" || req.type === typeFilter;
    const matchesRole = roleFilter === "all" || req.requesterRole === roleFilter;
    return matchesSearch && matchesStatus && matchesType && matchesRole;
  });

  const handleViewDetails = (request: PlatformRequest) => {
    setSelectedRequest(request);
    setAdminNote(request.adminNotes || "");
    setIsDetailsOpen(true);
  };

  const handleStatusUpdate = (newStatus: RequestStatus) => {
    if (!selectedRequest) return;
    setIsProcessing(true);
    setTimeout(() => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selectedRequest.id
            ? {
                ...r,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                adminNotes: adminNote,
                ...(newStatus === "resolved" ? { resolvedAt: new Date().toISOString() } : {}),
              }
            : r
        )
      );
      setSelectedRequest((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              adminNotes: adminNote,
              ...(newStatus === "resolved" ? { resolvedAt: new Date().toISOString() } : {}),
            }
          : null
      );
      setIsProcessing(false);
      toast({
        title: "Request Updated",
        description: `Request ${selectedRequest.id} has been set to "${newStatus}".`,
      });
    }, 600);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Requests & Disputes</h1>
          <p className="text-muted-foreground">
            Centralized board for all platform requests, disputes, and escalations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Type Tabs Overview */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All Types</TabsTrigger>
          <TabsTrigger value="order_dispute">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Disputes
          </TabsTrigger>
          <TabsTrigger value="return_refund">
            <RotateCcw className="h-3 w-3 mr-1" />
            Returns
          </TabsTrigger>
          <TabsTrigger value="review_report">
            <Flag className="h-3 w-3 mr-1" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="brand_category_request">
            <FolderPlus className="h-3 w-3 mr-1" />
            Brand/Cat
          </TabsTrigger>
          <TabsTrigger value="package_change">
            <ArrowUpDown className="h-3 w-3 mr-1" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="system_generated">
            <Cpu className="h-3 w-3 mr-1" />
            System
          </TabsTrigger>
        </TabsList>

        {["all", "order_dispute", "return_refund", "review_report", "brand_category_request", "package_change", "system_generated"].map(
          (tabValue) => (
            <TabsContent key={tabValue} value={tabValue}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle>
                        {tabValue === "all" ? "All Requests" : requestTypeLabels[tabValue as RequestType]}
                      </CardTitle>
                      <CardDescription>
                        {tabValue === "all"
                          ? "Every request across the platform"
                          : `Filtered to ${requestTypeLabels[tabValue as RequestType].toLowerCase()} requests`}
                      </CardDescription>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by ID, subject, requester..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[160px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_review">In Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-[160px]">
                        <User className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                        <SelectItem value="affiliate">Affiliate</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(tabValue === "all"
                        ? filteredRequests
                        : filteredRequests.filter((r) => r.type === tabValue)
                      ).map((req) => {
                        const TypeIcon = typeIconMap[req.type];
                        return (
                          <TableRow key={req.id}>
                            <TableCell className="font-mono font-medium text-xs">{req.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <TypeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs">{requestTypeLabels[req.type]}</span>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-sm">{req.subject}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{req.requesterName}</span>
                                <Badge className={`text-[10px] px-1.5 py-0 ${roleColors[req.requesterRole]}`}>
                                  {req.requesterRole}
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-xs ${priorityColors[req.priority]}`}>{req.priority}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={`text-xs ${statusColors[req.status]}`}>
                                {req.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(req.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(req)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {(tabValue === "all"
                    ? filteredRequests
                    : filteredRequests.filter((r) => r.type === tabValue)
                  ).length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No requests found matching your criteria</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )
        )}
      </Tabs>

      {/* Request Detail Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRequest && (
                <>
                  {(() => {
                    const Icon = typeIconMap[selectedRequest.type];
                    return <Icon className="h-5 w-5" />;
                  })()}
                  Request Details — {selectedRequest.id}
                </>
              )}
            </DialogTitle>
            <DialogDescription>Review, take action, and add admin notes</DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <ScrollArea className="h-[65vh] pr-4">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{selectedRequest.subject}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={statusColors[selectedRequest.status]}>
                        {selectedRequest.status.replace("_", " ")}
                      </Badge>
                      <Badge className={priorityColors[selectedRequest.priority]}>
                        {selectedRequest.priority} priority
                      </Badge>
                      <Badge variant="outline">{requestTypeLabels[selectedRequest.type]}</Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Requester & Meta */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Requester
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{selectedRequest.requesterName}</span>
                        <Badge className={`text-xs ${roleColors[selectedRequest.requesterRole]}`}>
                          {selectedRequest.requesterRole}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{selectedRequest.requesterEmail}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span>{new Date(selectedRequest.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Updated</span>
                        <span>{new Date(selectedRequest.updatedAt).toLocaleString()}</span>
                      </div>
                      {selectedRequest.resolvedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Resolved</span>
                          <span>{new Date(selectedRequest.resolvedAt).toLocaleString()}</span>
                        </div>
                      )}
                      {selectedRequest.referenceId && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reference</span>
                          <span className="font-mono text-xs">{selectedRequest.referenceId}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed">{selectedRequest.description}</p>
                    {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                      <div className="mt-4 space-y-1">
                        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Paperclip className="h-3 w-3" />
                          Attachments
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {selectedRequest.attachments.map((file, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Admin Notes */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Admin Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add resolution notes, internal comments, or action taken..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      rows={3}
                    />
                  </CardContent>
                </Card>

                {/* Actions */}
                {selectedRequest.status !== "resolved" && selectedRequest.status !== "cancelled" && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedRequest.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate("in_review")}
                            disabled={isProcessing}
                          >
                            {isProcessing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Eye className="h-4 w-4 mr-1" />}
                            Mark In Review
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate("approved")}
                          disabled={isProcessing}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isProcessing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ThumbsUp className="h-4 w-4 mr-1" />}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleStatusUpdate("resolved")}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                          Resolve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate("cancelled")}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <ThumbsDown className="h-4 w-4 mr-1" />}
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(selectedRequest.status === "resolved" || selectedRequest.status === "cancelled") && (
                  <div className="flex items-center gap-2 p-4 rounded-lg border bg-muted/50">
                    {selectedRequest.status === "resolved" ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <span className="text-sm font-medium">
                      This request has been {selectedRequest.status}.
                    </span>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRequests;
