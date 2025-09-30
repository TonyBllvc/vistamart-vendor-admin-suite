import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  CreditCard, 
  Truck, 
  Edit, 
  Trash2, 
  MessageSquare,
  Star,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Download,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Invoice from "@/components/Invoice";
import { downloadInvoiceAsPDF } from "@/utils/downloadInvoice";

const UserOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Mock order data - in real app, this would come from API
  const order = {
    id: orderId || "#12345",
    date: "2024-01-15",
    status: "Shipped",
    total: "$289.97",
    subtotal: "$265.97",
    shipping: "$15.00",
    tax: "$9.00",
    paymentMethod: "Visa ending in 4242",
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-18",
    
    shippingAddress: {
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      email: "john.doe@example.com"
    },
    
    vendors: [
      {
        id: "vendor1",
        name: "TechStore Pro",
        logo: "/placeholder.svg",
        contact: "support@techstorepro.com",
        items: [
          {
            id: "item1",
            name: "Wireless Headphones",
            image: "/placeholder.svg",
            quantity: 1,
            price: "$89.99",
            sku: "WH-001",
            status: "Shipped"
          }
        ],
        subtotal: "$89.99",
        shipping: "$7.50"
      },
      {
        id: "vendor2", 
        name: "Gadget World",
        logo: "/placeholder.svg",
        contact: "help@gadgetworld.com",
        items: [
          {
            id: "item2",
            name: "Smart Watch",
            image: "/placeholder.svg", 
            quantity: 1,
            price: "$199.99",
            sku: "SW-002",
            status: "Shipped"
          }
        ],
        subtotal: "$199.99",
        shipping: "$7.50"
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelOrder = () => {
    toast({
      title: "Order Cancelled",
      description: "Your order has been cancelled successfully.",
    });
  };

  const handleContactVendor = (vendorName: string, contact: string) => {
    toast({
      title: "Redirecting to Support",
      description: `Opening chat with ${vendorName}`,
    });
  };

  const handleDownloadInvoice = async () => {
    if (invoiceRef.current) {
      setIsDownloading(true);
      try {
        await downloadInvoiceAsPDF(invoiceRef.current, orderId || '');
        toast({
          title: "Invoice Downloaded",
          description: "Your invoice has been downloaded successfully.",
        });
      } catch (error) {
        toast({
          title: "Download Failed",
          description: "Failed to download invoice. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDownloading(false);
      }
    }
  };

  // Flatten items for invoice
  const allItems = order.vendors.flatMap(vendor => 
    vendor.items.map(item => ({
      ...item,
      vendor: vendor.name
    }))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/user/orders")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order {order.id}</h1>
          <p className="text-gray-600">Placed on {order.date}</p>
        </div>
        <div className="ml-auto">
          <Badge className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Items */}
          {order.vendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={vendor.logo} 
                      alt={vendor.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <p className="text-sm text-gray-600">{vendor.contact}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactVendor(vendor.name, vendor.contact)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendor.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{item.price}</p>
                        <Badge variant="outline" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{vendor.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>{vendor.shipping}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Order Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Products
                </Button>
                <Button variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Track Package
                </Button>
                <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Invoice {order.id}</DialogTitle>
                    </DialogHeader>
                    {/* Hidden invoice for PDF generation */}
                    <div className="hidden">
                      <Invoice
                        ref={invoiceRef}
                        orderId={order.id}
                        orderDate={order.date}
                        items={allItems}
                        subtotal={order.subtotal}
                        shipping={order.shipping}
                        tax={order.tax}
                        total={order.total}
                        customerName={order.shippingAddress.name}
                        customerEmail={order.shippingAddress.email}
                        shippingAddress={{
                          street: order.shippingAddress.street,
                          city: order.shippingAddress.city,
                          state: order.shippingAddress.state,
                          zipCode: order.shippingAddress.zipCode,
                          country: order.shippingAddress.country
                        }}
                        status={order.status}
                      />
                    </div>
                    {/* Visible invoice */}
                    <Invoice
                      orderId={order.id}
                      orderDate={order.date}
                      items={allItems}
                      subtotal={order.subtotal}
                      shipping={order.shipping}
                      tax={order.tax}
                      total={order.total}
                      customerName={order.shippingAddress.name}
                      customerEmail={order.shippingAddress.email}
                      shippingAddress={{
                        street: order.shippingAddress.street,
                        city: order.shippingAddress.city,
                        state: order.shippingAddress.state,
                        zipCode: order.shippingAddress.zipCode,
                        country: order.shippingAddress.country
                      }}
                      status={order.status}
                    />
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                      <Button 
                        onClick={handleDownloadInvoice}
                        disabled={isDownloading}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                {order.status === 'Processing' && (
                  <Button 
                    variant="destructive" 
                    onClick={handleCancelOrder}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Details Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{order.shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{order.tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-primary">{order.total}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-900">{order.paymentMethod}</p>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
                <Dialog open={isEditingAddress} onOpenChange={setIsEditingAddress}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Shipping Address</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={order.shippingAddress.name} />
                      </div>
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input id="street" defaultValue={order.shippingAddress.street} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" defaultValue={order.shippingAddress.city} />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input id="state" defaultValue={order.shippingAddress.state} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input id="zip" defaultValue={order.shippingAddress.zipCode} />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" defaultValue={order.shippingAddress.country} />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" defaultValue={order.shippingAddress.phone} />
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={() => setIsEditingAddress(false)}>
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditingAddress(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <div className="flex items-center gap-2 pt-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                {order.shippingAddress.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {order.shippingAddress.email}
              </div>
            </CardContent>
          </Card>

          {/* Tracking Info */}
          {order.status === 'Shipped' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Tracking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Tracking Number:</p>
                  <p className="font-mono">{order.trackingNumber}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Est. Delivery: {order.estimatedDelivery}
                </div>
                <Button variant="outline" className="w-full mt-3">
                  <Truck className="h-4 w-4 mr-2" />
                  Track Package
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;