import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye, Download, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Invoice from "@/components/Invoice";
import { downloadInvoiceAsPDF } from "@/utils/downloadInvoice";

const UserOrders = () => {
  const navigate = useNavigate();
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);
  const invoiceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const orders = [
    {
      id: "#12345",
      date: "2024-01-15",
      status: "Delivered",
      total: "$289.97",
      items: [
        { name: "Wireless Headphones", quantity: 1, price: "$89.99" },
        { name: "Smart Watch", quantity: 1, price: "$199.99" }
      ]
    },
    {
      id: "#12344",
      date: "2024-01-10",
      status: "Shipped",
      total: "$129.98",
      items: [
        { name: "Phone Case", quantity: 2, price: "$29.99" },
        { name: "Screen Protector", quantity: 1, price: "$69.99" }
      ]
    },
    {
      id: "#12343",
      date: "2024-01-05",
      status: "Processing",
      total: "$59.99",
      items: [
        { name: "USB Cable", quantity: 1, price: "$59.99" }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadInvoice = async (orderId: string) => {
    const invoiceElement = invoiceRefs.current[orderId];
    if (invoiceElement) {
      setDownloadingOrderId(orderId);
      try {
        await downloadInvoiceAsPDF(invoiceElement, orderId.replace('#', ''));
      } catch (error) {
        console.error('Failed to download invoice:', error);
      } finally {
        setDownloadingOrderId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Orders
        </Button>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <>
            {/* Hidden invoice for PDF generation */}
            <div className="hidden">
              <Invoice
                ref={(el) => (invoiceRefs.current[order.id] = el)}
                orderId={order.id}
                orderDate={order.date}
                items={order.items}
                subtotal="$289.97"
                shipping="$15.00"
                tax="$24.50"
                total={order.total}
                customerName="John Doe"
                customerEmail="john.doe@example.com"
                shippingAddress={{
                  street: "123 Main Street",
                  city: "New York",
                  state: "NY",
                  zipCode: "10001",
                  country: "United States"
                }}
                status={order.status}
              />
            </div>
            <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{order.id}</CardTitle>
                  <p className="text-gray-600">Ordered on {order.date}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <p className="text-xl font-bold text-affiliate-primary mt-1">{order.total}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">{item.price}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/user/orders/${order.id.replace('#', '')}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {order.status === 'Delivered' && (
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-2" />
                    Rate Products
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadInvoice(order.id)}
                  disabled={downloadingOrderId === order.id}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {downloadingOrderId === order.id ? 'Generating...' : 'Invoice'}
                </Button>
              </div>
            </CardContent>
          </Card>
          </>
        ))}
      </div>
    </div>
  );
};

export default UserOrders;