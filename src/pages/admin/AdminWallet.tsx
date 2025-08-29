import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Building2,
  Clock
} from "lucide-react";

const AdminWallet = () => {
  const walletStats = [
    {
      title: "Total Platform Balance",
      value: "$245,890.00",
      change: "+12.5%",
      trend: "up",
      icon: Wallet
    },
    {
      title: "Monthly Revenue",
      value: "$45,230.00",
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp
    },
    {
      title: "Pending Withdrawals",
      value: "$12,450.00",
      change: "-3.1%",
      trend: "down",
      icon: TrendingDown
    },
    {
      title: "Commission Earned",
      value: "$23,100.00",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign
    }
  ];

  const recentTransactions = [
    {
      id: "TXN001",
      type: "Commission",
      vendor: "TechStore Pro",
      amount: "+$156.80",
      status: "completed",
      date: "2 hours ago"
    },
    {
      id: "TXN002",
      type: "Withdrawal",
      vendor: "Fashion Hub",
      amount: "-$2,500.00",
      status: "pending",
      date: "4 hours ago"
    },
    {
      id: "TXN003",
      type: "Commission",
      vendor: "Electronics World",
      amount: "+$89.50",
      status: "completed",
      date: "6 hours ago"
    },
    {
      id: "TXN004",
      type: "Refund",
      vendor: "BookStore Plus",
      amount: "-$45.00",
      status: "completed",
      date: "1 day ago"
    }
  ];

  const pendingPayouts = [
    {
      vendor: "TechStore Pro",
      amount: "$3,240.00",
      commission: "$324.00",
      dueDate: "Dec 15, 2024"
    },
    {
      vendor: "Fashion Hub",
      amount: "$1,890.00",
      commission: "$189.00",
      dueDate: "Dec 15, 2024"
    },
    {
      vendor: "Electronics World",
      amount: "$5,670.00",
      commission: "$567.00",
      dueDate: "Dec 20, 2024"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Platform Wallet</h1>
          <p className="text-muted-foreground">Manage platform finances and vendor payouts</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Building2 className="h-4 w-4 mr-2" />
            Bank Settings
          </Button>
          <Button>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Process Payouts
          </Button>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {walletStats.map((stat, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Pending Payouts</TabsTrigger>
          <TabsTrigger value="settings">Wallet Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Latest financial activities on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        transaction.type === "Commission" ? "bg-green-500/10" :
                        transaction.type === "Withdrawal" ? "bg-blue-500/10" : "bg-red-500/10"
                      }`}>
                        {transaction.type === "Commission" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : transaction.type === "Withdrawal" ? (
                          <ArrowDownLeft className="h-4 w-4 text-blue-500" />
                        ) : (
                          <ArrowDownLeft className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.type}</p>
                        <p className="text-sm text-muted-foreground">{transaction.vendor}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.amount.startsWith("+") ? "text-green-500" : "text-red-500"
                      }`}>
                        {transaction.amount}
                      </p>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Pending Vendor Payouts
              </CardTitle>
              <CardDescription>
                Vendor payments scheduled for processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingPayouts.map((payout, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{payout.vendor}</p>
                      <p className="text-sm text-muted-foreground">Due: {payout.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{payout.amount}</p>
                      <p className="text-sm text-muted-foreground">Commission: {payout.commission}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Process
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Commission Settings</CardTitle>
                <CardDescription>Configure platform commission rates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Default Commission Rate (%)</label>
                  <Input type="number" defaultValue="10" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Minimum Payout Amount</label>
                  <Input type="number" defaultValue="100" className="mt-1" />
                </div>
                <Button>Update Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bank Account</CardTitle>
                <CardDescription>Platform bank account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Account Number</label>
                  <Input defaultValue="****-****-****-1234" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Bank Name</label>
                  <Input defaultValue="First National Bank" className="mt-1" />
                </div>
                <Button>Update Account</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminWallet;