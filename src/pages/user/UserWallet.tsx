import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, DollarSign } from "lucide-react";

const UserWallet = () => {
  const walletBalance = 125.50;
  const pendingBalance = 45.00;

  const recentActivity = [
    { type: "credit", description: "Refund for Order #12340", amount: 29.99, date: "2024-01-14" },
    { type: "debit", description: "Purchase Order #12345", amount: -89.99, date: "2024-01-15" },
    { type: "credit", description: "Wallet Top-up", amount: 100.00, date: "2024-01-10" },
    { type: "debit", description: "Purchase Order #12343", amount: -29.99, date: "2024-01-08" },
  ];

  const paymentMethods = [
    { id: 1, type: "Credit Card", last4: "4532", expiry: "12/25", isDefault: true },
    { id: 2, type: "PayPal", email: "user@email.com", isDefault: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
        <Button className="bg-affiliate-primary hover:bg-affiliate-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Money
        </Button>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-affiliate-primary" />
              Wallet Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-4xl font-bold text-affiliate-primary mb-2">
                ${walletBalance.toFixed(2)}
              </p>
              <p className="text-gray-600">Available Balance</p>
              {pendingBalance > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    ${pendingBalance.toFixed(2)} pending (processing transactions)
                  </p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button className="bg-affiliate-primary hover:bg-affiliate-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </Button>
              <Button variant="outline">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-affiliate-secondary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Request Money
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Payment Methods
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Wallet className="h-4 w-4 mr-2" />
              Transaction History
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Money */}
        <Card>
          <CardHeader>
            <CardTitle>Add Money to Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" placeholder="Enter amount" />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm">$25</Button>
              <Button variant="outline" size="sm">$50</Button>
              <Button variant="outline" size="sm">$100</Button>
            </div>
            
            <div>
              <Label>Payment Method</Label>
              <div className="space-y-2 mt-2">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4" />
                      <div>
                        <p className="font-medium">{method.type}</p>
                        <p className="text-sm text-gray-600">
                          {method.type === 'Credit Card' ? `****${method.last4}` : method.email}
                        </p>
                      </div>
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Button className="w-full bg-affiliate-primary hover:bg-affiliate-primary/90">
              Add Money
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'credit' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {activity.type === 'credit' ? 
                        <ArrowDownLeft className="h-4 w-4 text-green-600" /> :
                        <ArrowUpRight className="h-4 w-4 text-red-600" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.description}</p>
                      <p className="text-sm text-gray-600">{activity.date}</p>
                    </div>
                  </div>
                  <span className={`font-bold ${
                    activity.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {activity.amount > 0 ? '+' : ''}${Math.abs(activity.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserWallet;