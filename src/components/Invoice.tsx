import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { forwardRef } from "react";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: string;
  vendor?: string;
}

interface InvoiceProps {
  orderId: string;
  orderDate: string;
  items: InvoiceItem[];
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: string;
}

const Invoice = forwardRef<HTMLDivElement, InvoiceProps>(
  (
    {
      orderId,
      orderDate,
      items,
      subtotal,
      shipping,
      tax,
      total,
      customerName,
      customerEmail,
      shippingAddress,
      status,
    },
    ref
  ) => {
    return (
      <Card ref={ref} className="max-w-4xl mx-auto p-8 bg-background">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">INVOICE</h1>
            <p className="text-muted-foreground">Order #{orderId}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Invoice Date</p>
            <p className="font-semibold text-foreground">{orderDate}</p>
            <p className="text-sm text-muted-foreground mt-2">Status</p>
            <p className="font-semibold text-foreground">{status}</p>
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Billing & Shipping Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-3">Bill To:</h3>
            <p className="text-foreground font-medium">{customerName}</p>
            <p className="text-muted-foreground text-sm">{customerEmail}</p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-3">Ship To:</h3>
            <p className="text-foreground">{shippingAddress.street}</p>
            <p className="text-foreground">
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </p>
            <p className="text-foreground">{shippingAddress.country}</p>
          </div>
        </div>

        <Separator className="mb-6" />

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 text-foreground font-semibold">Item</th>
                <th className="text-left py-3 text-foreground font-semibold">Vendor</th>
                <th className="text-center py-3 text-foreground font-semibold">Qty</th>
                <th className="text-right py-3 text-foreground font-semibold">Price</th>
                <th className="text-right py-3 text-foreground font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const itemPrice = parseFloat(item.price.replace('$', ''));
                const itemTotal = itemPrice * item.quantity;
                return (
                  <tr key={index} className="border-b">
                    <td className="py-4 text-foreground">{item.name}</td>
                    <td className="py-4 text-muted-foreground text-sm">{item.vendor || 'N/A'}</td>
                    <td className="py-4 text-center text-foreground">{item.quantity}</td>
                    <td className="py-4 text-right text-foreground">{item.price}</td>
                    <td className="py-4 text-right text-foreground font-medium">
                      ${itemTotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="text-foreground font-medium">{subtotal}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Shipping:</span>
              <span className="text-foreground font-medium">{shipping}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Tax:</span>
              <span className="text-foreground font-medium">{tax}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between py-2">
              <span className="text-foreground font-bold text-lg">Total:</span>
              <span className="text-foreground font-bold text-lg">{total}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Separator className="mb-6" />
        <div className="text-center text-muted-foreground text-sm">
          <p>Thank you for your business!</p>
          <p className="mt-2">For any questions regarding this invoice, please contact support.</p>
        </div>
      </Card>
    );
  }
);

Invoice.displayName = "Invoice";

export default Invoice;
