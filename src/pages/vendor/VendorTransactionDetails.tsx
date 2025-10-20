import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Download, 
  CreditCard, 
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingCart,
  Building2,
  User,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  Receipt,
  Hash,
  Store,
  TrendingUp,
  Percent
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TransactionType = "payment" | "deposit" | "withdrawal" | "wallet_transfer";
type TransactionStatus = "completed" | "pending" | "failed" | "processing";

const VendorTransactionDetails = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  // Mock transaction data - in real app, this would come from API based on transactionId
  const transaction = {
    id: transactionId || "TXN123456789",
    type: "payment" as TransactionType, // Change this to test different types: payment, deposit, withdrawal, wallet_transfer
    status: "completed" as TransactionStatus,
    amount: 289.97,
    currency: "USD",
    date: "2024-01-15 14:30:22",
    description: "Product Sale - Order #12345",
    
    // Payment specific fields (for vendors, this is a sale)
    payment: {
      orderId: "#12345",
      customer: {
        name: "John Doe",
        email: "john@example.com",
        userId: "USER-001"
      },
      products: [
        { name: "Wireless Headphones", sku: "WH-001", quantity: 1, price: 89.99 }
      ],
      subtotal: 89.99,
      shipping: 7.50,
      tax: 3.00,
      total: 100.49,
      commission: {
        rate: 15,
        amount: 13.50
      },
      netEarnings: 86.99,
      paymentMethod: "Visa ending in 4242"
    },

    // Deposit specific fields (platform payout to vendor)
    deposit: {
      fromPlatform: "VistaMart Platform",
      toWallet: "Vendor Wallet",
      period: "Jan 1 - Jan 15, 2024",
      totalSales: 1500.00,
      commission: 225.00,
      netAmount: 1275.00,
      transactionCount: 25,
      referenceNumber: "DEP-2024-001234"
    },

    // Withdrawal specific fields (vendor withdrawing earnings)
    withdrawal: {
      fromWallet: "Vendor Wallet",
      toBank: "Chase Business Account ****5678",
      accountName: "TechStore Pro LLC",
      accountNumber: "****5678",
      routingNumber: "****9012",
      transactionFee: 5.00,
      netAmount: 284.97,
      referenceNumber: "WTH-2024-001234",
      estimatedArrival: "2024-01-17"
    },

    // Wallet transfer specific fields
    walletTransfer: {
      fromUser: {
        name: "TechStore Pro",
        email: "vendor@techstore.com",
        walletId: "WALLET-VENDOR-001",
        type: "vendor"
      },
      toUser: {
        name: "Jane Smith", 
        email: "jane@example.com",
        walletId: "WALLET-USER-002",
        type: "user"
      },
      note: "Refund for returned item",
      referenceNumber: "WTW-2024-001234"
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
      case 'processing': return <Clock className="h-5 w-5 text-yellow-600" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'payment': return <TrendingUp className="h-6 w-6 text-green-600" />;
      case 'deposit': return <ArrowDownLeft className="h-6 w-6 text-green-600" />;
      case 'withdrawal': return <ArrowUpRight className="h-6 w-6 text-blue-600" />;
      case 'wallet_transfer': return <Wallet className="h-6 w-6 text-purple-600" />;
    }
  };

  const getTypeName = (type: TransactionType) => {
    switch (type) {
      case 'payment': return 'Product Sale';
      case 'deposit': return 'Platform Payout';
      case 'withdrawal': return 'Withdrawal';
      case 'wallet_transfer': return 'Wallet Transfer';
    }
  };

  const handleDownloadReceipt = () => {
    setIsDownloading(true);
    setTimeout(() => {
      toast({
        title: "Receipt Downloaded",
        description: "Transaction receipt has been downloaded successfully.",
      });
      setIsDownloading(false);
    }, 1000);
  };

  const handleContactSupport = () => {
    navigate('/vendor/messages');
    toast({
      title: "Redirecting to Support",
      description: "Opening customer care chat",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate("/vendor/wallet")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Wallet
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transaction Details</h1>
          <p className="text-muted-foreground">Transaction ID: {transaction.id}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {getStatusIcon(transaction.status)}
          <Badge className={getStatusColor(transaction.status)}>
            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Transaction Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {getTypeIcon(transaction.type)}
                <span>{getTypeName(transaction.type)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Amount</p>
                  <p className="text-3xl font-bold text-foreground">
                    ${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">{transaction.currency}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium text-foreground">{transaction.date}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-foreground">{transaction.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Type-specific Details */}
          {transaction.type === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Sale Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <span className="font-medium text-foreground">{transaction.payment.orderId}</span>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Customer Information</p>
                  <div className="p-3 bg-muted rounded-lg space-y-1">
                    <p className="font-medium text-foreground">{transaction.payment.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{transaction.payment.customer.email}</p>
                    <p className="text-xs font-mono text-muted-foreground">{transaction.payment.customer.userId}</p>
                  </div>
                </div>

                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Products Sold</p>
                  {transaction.payment.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg mb-2">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {product.sku} | Qty: {product.quantity}</p>
                      </div>
                      <p className="font-medium text-foreground">${product.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${transaction.payment.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">${transaction.payment.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">${transaction.payment.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span className="text-foreground">Order Total</span>
                    <span className="text-foreground">${transaction.payment.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Percent className="h-4 w-4" />
                    <span className="font-medium text-sm">Commission Breakdown</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-700">Platform Commission ({transaction.payment.commission.rate}%)</span>
                    <span className="text-amber-700">-${transaction.payment.commission.amount.toFixed(2)}</span>
                  </div>
                  <Separator className="bg-amber-200" />
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Your Net Earnings</span>
                    <span className="text-green-600">${transaction.payment.netEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.type === "deposit" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownLeft className="h-5 w-5" />
                  Platform Payout Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Store className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">From</p>
                      <p className="font-medium text-foreground">{transaction.deposit.fromPlatform}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowDownLeft className="h-8 w-8 text-green-600" />
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">To Wallet</p>
                      <p className="font-medium text-foreground">{transaction.deposit.toWallet}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Payout Period</p>
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{transaction.deposit.period}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sales ({transaction.deposit.transactionCount} orders)</span>
                    <span className="text-foreground">${transaction.deposit.totalSales.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Commission</span>
                    <span className="text-foreground">-${transaction.deposit.commission.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Net Payout</span>
                    <span className="text-green-600">${transaction.deposit.netAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Reference:</span>
                  <span className="text-sm font-mono text-foreground">{transaction.deposit.referenceNumber}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.type === "withdrawal" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5" />
                  Withdrawal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">From Wallet</p>
                      <p className="font-medium text-foreground">{transaction.withdrawal.fromWallet}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowUpRight className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">To Bank Account</p>
                      <p className="font-medium text-foreground">{transaction.withdrawal.toBank}</p>
                      <p className="text-sm text-muted-foreground mt-1">Account: {transaction.withdrawal.accountNumber}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Account Holder Details</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Business Name: <span className="text-foreground">{transaction.withdrawal.accountName}</span></p>
                    <p className="text-muted-foreground">Routing Number: <span className="text-foreground">{transaction.withdrawal.routingNumber}</span></p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Withdrawal Amount</span>
                    <span className="text-foreground">${transaction.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Fee</span>
                    <span className="text-foreground">-${transaction.withdrawal.transactionFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Net Amount Transferred</span>
                    <span className="text-blue-600">${transaction.withdrawal.netAmount.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Reference:</span>
                    <span className="text-sm font-mono text-foreground">{transaction.withdrawal.referenceNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Estimated Arrival:</span>
                    <span className="text-sm text-foreground">{transaction.withdrawal.estimatedArrival}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.type === "wallet_transfer" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Transfer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Store className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">From (Vendor)</p>
                      <p className="font-medium text-foreground">{transaction.walletTransfer.fromUser.name}</p>
                      <p className="text-xs text-muted-foreground">{transaction.walletTransfer.fromUser.email}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">{transaction.walletTransfer.fromUser.walletId}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowDownLeft className="h-8 w-8 text-purple-600" />
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">To (Customer)</p>
                      <p className="font-medium text-foreground">{transaction.walletTransfer.toUser.name}</p>
                      <p className="text-xs text-muted-foreground">{transaction.walletTransfer.toUser.email}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">{transaction.walletTransfer.toUser.walletId}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Transfer Note</p>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-foreground italic">{transaction.walletTransfer.note}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span className="text-foreground">Amount Transferred</span>
                  <span className="text-purple-600">${transaction.amount.toFixed(2)}</span>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Reference:</span>
                  <span className="text-sm font-mono text-foreground">{transaction.walletTransfer.referenceNumber}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant="outline"
                  onClick={handleDownloadReceipt}
                  disabled={isDownloading}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download Receipt'}
                </Button>
                <Button variant="outline" onClick={handleContactSupport}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                {transaction.type === "payment" && (
                  <Button 
                    variant="outline"
                    onClick={() => navigate(`/vendor/orders/${transaction.payment.orderId}`)}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    View Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Transaction ID</p>
                <p className="font-mono font-medium text-foreground">{transaction.id}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium text-foreground">{getTypeName(transaction.type)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Badge>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Date & Time</p>
                <p className="font-medium text-foreground">{transaction.date}</p>
              </div>
              <Separator />
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="text-xl font-bold text-primary">${transaction.amount.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method (for payment type) */}
          {transaction.type === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Customer Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">{transaction.payment.paymentMethod}</p>
              </CardContent>
            </Card>
          )}

          {/* Help Card */}
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle className="text-base">Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                If you have any questions about this transaction, our customer care team is here to help.
              </p>
              <Button className="w-full" onClick={handleContactSupport}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Customer Care
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorTransactionDetails;
