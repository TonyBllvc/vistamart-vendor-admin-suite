import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Globe,
  Shield,
  Bell,
  CreditCard,
  Mail,
  Save,
  UserX,
  UserCheck,
  UserCog,
  Send,
  DollarSign,
  Image as ImageIcon,
  Users
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Configure your marketplace settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Configure basic marketplace information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="VistaMart" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input id="siteUrl" defaultValue="https://vistamart.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea 
                id="siteDescription" 
                defaultValue="Your premier multivendor marketplace for quality products"
                rows={3}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input id="adminEmail" type="email" defaultValue="admin@vistamart.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input id="supportEmail" type="email" defaultValue="support@vistamart.com" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage security and access controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for admin accounts
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve Vendors</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve new vendor registrations
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Verification Required</Label>
                <p className="text-sm text-muted-foreground">
                  Require email verification for new accounts
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input id="sessionTimeout" type="number" defaultValue="60" className="w-32" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure email and system notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Order Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Email notifications for new orders
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Vendor Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Email notifications for new vendor registrations
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notify when products are low in stock
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications about system updates and maintenance
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Payment Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Settings
            </CardTitle>
            <CardDescription>Configure payment methods and fees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platformFee">Platform Fee (%)</Label>
                <Input id="platformFee" type="number" defaultValue="5" min="0" max="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionFee">Transaction Fee (%)</Label>
                <Input id="transactionFee" type="number" defaultValue="2.5" min="0" max="100" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payoutSchedule">Payout Schedule</Label>
              <select className="w-full p-2 border rounded-md bg-background">
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Stripe</Label>
                <p className="text-sm text-muted-foreground">
                  Accept payments via Stripe
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable PayPal</Label>
                <p className="text-sm text-muted-foreground">
                  Accept payments via PayPal
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Settings
            </CardTitle>
            <CardDescription>Configure email service and templates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input id="smtpHost" defaultValue="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input id="smtpPort" type="number" defaultValue="587" />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input id="smtpUser" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPass">SMTP Password</Label>
                <Input id="smtpPass" type="password" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Use SSL/TLS</Label>
                <p className="text-sm text-muted-foreground">
                  Secure email transmission
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Ban/Unban User Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5" />
              Ban/Unban User Account
            </CardTitle>
            <CardDescription>Manage user account access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="userEmail">User Email</Label>
              <Input id="userEmail" type="email" placeholder="user@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="banReason">Reason for Action (Optional)</Label>
              <Textarea 
                id="banReason" 
                placeholder="Enter reason for banning/unbanning this user"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <Button variant="destructive" className="flex-1">
                <UserX className="h-4 w-4 mr-2" />
                Ban User
              </Button>
              <Button variant="outline" className="flex-1">
                <UserCheck className="h-4 w-4 mr-2" />
                Unban User
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Change User Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5" />
              Change User Role
            </CardTitle>
            <CardDescription>Update user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="roleUserEmail">User Email</Label>
              <Input id="roleUserEmail" type="email" placeholder="user@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newRole">New Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full">
              <UserCog className="h-4 w-4 mr-2" />
              Update User Role
            </Button>
          </CardContent>
        </Card>

        {/* Admin Invitation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Invite New Admin
            </CardTitle>
            <CardDescription>Send admin registration link via email</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="adminInviteEmail">Admin Email</Label>
              <Input id="adminInviteEmail" type="email" placeholder="newadmin@example.com" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminRole">Admin Role</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select admin role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Full Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inviteMessage">Custom Message (Optional)</Label>
              <Textarea 
                id="inviteMessage" 
                placeholder="Add a personal message to the invitation"
                rows={3}
              />
            </div>
            
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send Invitation Link
            </Button>
          </CardContent>
        </Card>

        {/* Payment Allocation & Commissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Allocation & Commissions
            </CardTitle>
            <CardDescription>Configure payment distribution and fees</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="vendorCommission">Vendor Commission (%)</Label>
                <Input id="vendorCommission" type="number" defaultValue="85" min="0" max="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="affiliateCommission">Affiliate Commission (%)</Label>
                <Input id="affiliateCommission" type="number" defaultValue="5" min="0" max="100" />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input id="processingFee" type="number" defaultValue="2.5" min="0" max="100" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="withdrawalFee">Withdrawal Fee ($)</Label>
                <Input id="withdrawalFee" type="number" defaultValue="2.00" min="0" step="0.01" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minWithdrawal">Minimum Withdrawal Amount ($)</Label>
              <Input id="minWithdrawal" type="number" defaultValue="50" min="0" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxWithdrawal">Maximum Withdrawal Amount ($)</Label>
              <Input id="maxWithdrawal" type="number" defaultValue="10000" min="0" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="payoutDelay">Payout Delay (days)</Label>
              <Input id="payoutDelay" type="number" defaultValue="7" min="0" />
            </div>
          </CardContent>
        </Card>

        {/* Featured Ads Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Featured Hero Images Management
            </CardTitle>
            <CardDescription>Manage hero images for different pages (max 3 per page)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {["Home", "Products", "Categories", "Blog", "FAQ"].map((page) => (
              <div key={page} className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">{page} Page Hero</h3>
                
                <div className="space-y-3">
                  {[1, 2, 3].map((num) => (
                    <div key={num} className="flex items-center gap-3">
                      <Label className="w-24">Image {num}:</Label>
                      <Input type="file" accept="image/*" className="flex-1" />
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label>Display Order</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select display order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential">Sequential</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                      <SelectItem value="slideshow">Slideshow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`${page.toLowerCase()}Duration`}>Slideshow Duration (seconds)</Label>
                  <Input 
                    id={`${page.toLowerCase()}Duration`} 
                    type="number" 
                    defaultValue="5" 
                    min="1" 
                    className="w-32"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Account Management
            </CardTitle>
            <CardDescription>View and manage all platform accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="accountSearch">Search Accounts</Label>
              <Input 
                id="accountSearch" 
                placeholder="Search by name, email, or ID..." 
              />
            </div>
            
            <div className="space-y-2">
              <Label>Filter by Account Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All accounts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="vendors">Vendors</SelectItem>
                  <SelectItem value="admins">Admins</SelectItem>
                  <SelectItem value="banned">Banned Accounts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-3">
              <Button className="flex-1">
                <Users className="h-4 w-4 mr-2" />
                View All Accounts
              </Button>
              <Button variant="outline" className="flex-1">
                Export Data
              </Button>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This section provides access to account information excluding sensitive data like passwords, payment details, and private communications. All actions are logged for security purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary-hover">
            <Save className="h-4 w-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;