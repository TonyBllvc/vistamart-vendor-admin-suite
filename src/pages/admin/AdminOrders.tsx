import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Filter, 
  Eye, 
  RefreshCw, 
  Download,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  DollarSign
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const orderStats = [
  {
    title: "Total Orders",
    value: "1,429",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Package,
    description: "All orders this month"
  },
  {
    title: "Pending Orders",
    value: "147",
    change: "-5.2%",
    changeType: "negative" as const,
    icon: Clock,
    description: "Orders awaiting processing"
  },
  {
    title: "Completed Orders",
    value: "1,156",
    change: "+18.7%",
    changeType: "positive" as const,
    icon: CheckCircle,
    description: "Successfully completed orders"
  },
  {
    title: "Cancelled Orders",
    value: "126",
    change: "+3.1%",
    changeType: "neutral" as const,
    icon: XCircle,
    description: "Cancelled or refunded orders"
  },
];

const orders = [
  {
    id: "ORD-001",
    customer: "John Doe",
    customerEmail: "john.doe@email.com",
    customerPhone: "+1 (555) 123-4567",
    shippingAddress: "123 Main St, Apt 4B, New York, NY 10001",
    vendor: "TechHub Store",
    vendorEmail: "support@techhub.com",
    items: [
      { name: "Wireless Mouse", quantity: 1, price: 49.99 },
      { name: "USB-C Cable", quantity: 2, price: 19.99 },
      { name: "Laptop Stand", quantity: 1, price: 89.99 }
    ],
    subtotal: 179.96,
    shipping: 20.00,
    tax: 100.03,
    total: 299.99,
    status: "completed",
    date: "2024-01-15",
    paymentMethod: "Credit Card",
    trackingNumber: "TRK123456789",
    notes: "Deliver to front desk"
  },
  {
    id: "ORD-002",
    customer: "Jane Smith",
    vendor: "Fashion Central",
    items: 1,
    total: 89.99,
    status: "pending",
    date: "2024-01-14",
    paymentMethod: "PayPal"
  },
  {
    id: "ORD-003",
    customer: "Mike Johnson",
    vendor: "Home Essentials",
    items: 2,
    total: 159.99,
    status: "shipped",
    date: "2024-01-14",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-004",
    customer: "Sarah Wilson",
    vendor: "Sports World",
    items: 4,
    total: 399.99,
    status: "processing",
    date: "2024-01-13",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "ORD-005",
    customer: "David Brown",
    vendor: "Book Haven",
    items: 6,
    total: 129.99,
    status: "cancelled",
    date: "2024-01-13",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-006",
    customer: "Lisa Garcia",
    vendor: "TechHub Store",
    items: 1,
    total: 799.99,
    status: "completed",
    date: "2024-01-12",
    paymentMethod: "Credit Card"
  },
  {
    id: "ORD-007",
    customer: "Tom Anderson",
    vendor: "Fashion Central",
    items: 2,
    total: 199.99,
    status: "shipped",
    date: "2024-01-12",
    paymentMethod: "PayPal"
  },
  {
    id: "ORD-008",
    customer: "Emma Davis",
    vendor: "Home Essentials",
    items: 3,
    total: 249.99,
    status: "pending",
    date: "2024-01-11",
    paymentMethod: "Credit Card"
  }
];

const getStatusBadge = (status: string) => {
  const variants = {
    completed: "default",
    pending: "secondary",
    processing: "outline",
    shipped: "default",
    cancelled: "destructive"
  } as const;
  
  const colors = {
    completed: "text-green-700 bg-green-100",
    pending: "text-yellow-700 bg-yellow-100",
    processing: "text-blue-700 bg-blue-100",
    shipped: "text-purple-700 bg-purple-100",
    cancelled: "text-red-700 bg-red-100"
  } as const;

  return (
    <Badge className={colors[status as keyof typeof colors]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    console.log('Updating order status:', orderId, newStatus);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage all platform orders
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

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {orderStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <Badge 
                  variant={
                    stat.changeType === 'positive' ? 'default' : 
                    stat.changeType === 'negative' ? 'destructive' : 'secondary'
                  }
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                {' '}{stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>
                Complete overview of all platform orders
              </CardDescription>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, customers, vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.vendor}</TableCell>
                  <TableCell>{Array.isArray(order.items) ? order.items.length : order.items} items</TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No orders found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Order Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">{selectedOrder.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(selectedOrder.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedOrder.status)}
                    <p className="text-2xl font-bold mt-2">${selectedOrder.total}</p>
                  </div>
                </div>

                <Separator />

                {/* Customer & Vendor Info */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Customer Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Name</p>
                        <p className="font-medium">{selectedOrder.customer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p>{selectedOrder.customerEmail}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <p>{selectedOrder.customerPhone}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground mt-1" />
                        <p>{selectedOrder.shippingAddress}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Vendor Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Store Name</p>
                        <p className="font-medium">{selectedOrder.vendor}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <p>{selectedOrder.vendorEmail}</p>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex items-center gap-2">
                          <Truck className="h-3 w-3 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground text-xs">Tracking Number</p>
                            <p className="font-mono">{selectedOrder.trackingNumber}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items?.map((item: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">${item.price}</TableCell>
                            <TableCell className="text-right font-medium">
                              ${(item.quantity * item.price).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <Separator className="my-4" />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${selectedOrder.subtotal?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>${selectedOrder.shipping?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${selectedOrder.tax?.toFixed(2) || '0.00'}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>${selectedOrder.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment & Notes */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                    </CardContent>
                  </Card>

                  {selectedOrder.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Order Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Order Management Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Order Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Update Order Status</label>
                        <div className="flex gap-2 flex-wrap">
                          <Button 
                            variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Pending
                          </Button>
                          <Button 
                            variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Processing
                          </Button>
                          <Button 
                            variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Shipped
                          </Button>
                          <Button 
                            variant={selectedOrder.status === 'completed' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'completed')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                          <Button 
                            variant={selectedOrder.status === 'cancelled' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Customer
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Download Invoice
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;