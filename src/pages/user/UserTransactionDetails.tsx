import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  Receipt,
  Hash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TransactionType = "payment" | "deposit" | "withdrawal" | "wallet_transfer";
type TransactionStatus = "completed" | "pending" | "failed" | "processing";

const UserTransactionDetails = () => {
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
    description: "Product Purchase - Order #12345",
    
    // Payment specific fields
    payment: {
      orderId: "#12345",
      products: [
        { name: "Wireless Headphones", quantity: 1, price: 89.99 },
        { name: "Smart Watch", quantity: 1, price: 199.99 }
      ],
      subtotal: 289.97,
      tax: 9.00,
      shipping: 15.00,
      total: 313.97,
      paymentMethod: "Visa ending in 4242",
      vendors: ["TechStore Pro", "Gadget World"]
    },

    // Deposit specific fields
    deposit: {
      fromBank: "Chase Bank ****1234",
      toWallet: "VistaMart Wallet",
      transactionFee: 2.50,
      netAmount: 287.47,
      referenceNumber: "DEP-2024-001234"
    },

    // Withdrawal specific fields
    withdrawal: {
      fromWallet: "VistaMart Wallet",
      toBank: "Chase Bank ****1234",
      accountName: "John Doe",
      accountNumber: "****1234",
      routingNumber: "****5678",
      transactionFee: 5.00,
      netAmount: 284.97,
      referenceNumber: "WTH-2024-001234",
      estimatedArrival: "2024-01-17"
    },

    // Wallet transfer specific fields
    walletTransfer: {
      fromUser: {
        name: "John Doe",
        email: "john@example.com",
        walletId: "WALLET-USER-001"
      },
      toUser: {
        name: "Jane Smith", 
        email: "jane@example.com",
        walletId: "WALLET-USER-002"
      },
      note: "Payment for shared items",
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
      case 'payment': return <ShoppingCart className="h-6 w-6 text-primary" />;
      case 'deposit': return <ArrowDownLeft className="h-6 w-6 text-green-600" />;
      case 'withdrawal': return <ArrowUpRight className="h-6 w-6 text-blue-600" />;
      case 'wallet_transfer': return <Wallet className="h-6 w-6 text-purple-600" />;
    }
  };

  const getTypeName = (type: TransactionType) => {
    switch (type) {
      case 'payment': return 'Product Purchase';
      case 'deposit': return 'Wallet Deposit';
      case 'withdrawal': return 'Wallet Withdrawal';
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
    navigate('/user/messages');
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
          onClick={() => navigate("/user/transactions")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Transactions
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
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Order ID</span>
                  <span className="font-medium text-foreground">{transaction.payment.orderId}</span>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Products Purchased</p>
                  {transaction.payment.products.map((product, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 px-3 bg-muted rounded-lg mb-2">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Quantity: {product.quantity}</p>
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
                  <div className="flex justify-between font-bold text-lg">
                    <span className="text-foreground">Total Paid</span>
                    <span className="text-primary">${transaction.payment.total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Vendors</p>
                  {transaction.payment.vendors.map((vendor, idx) => (
                    <Badge key={idx} variant="outline" className="mr-2">{vendor}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {transaction.type === "deposit" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownLeft className="h-5 w-5" />
                  Deposit Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">From Bank Account</p>
                      <p className="font-medium text-foreground">{transaction.deposit.fromBank}</p>
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

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Deposit Amount</span>
                    <span className="text-foreground">${transaction.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transaction Fee</span>
                    <span className="text-foreground">-${transaction.deposit.transactionFee.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">Net Amount Credited</span>
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
                    <p className="text-muted-foreground">Name: <span className="text-foreground">{transaction.withdrawal.accountName}</span></p>
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
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">From</p>
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
                      <p className="text-sm text-muted-foreground">To</p>
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
                    onClick={() => navigate(`/user/orders/${transaction.payment.orderId}`)}
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
                  Payment Method
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

export default UserTransactionDetails;
