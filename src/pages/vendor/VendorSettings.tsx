import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Store,
  Bell,
  Shield,
  CreditCard,
  Upload,
  Save
} from "lucide-react";

const VendorSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Vendor Settings</h1>
        <p className="text-muted-foreground">
          Manage your store settings and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Information
            </CardTitle>
            <CardDescription>Update your store details and branding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <Store className="h-8 w-8 text-secondary-foreground" />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Store Logo</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <Button variant="ghost" size="sm">Remove</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 200x200px, PNG or JPG
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name *</Label>
                <Input id="storeName" defaultValue="Tech Store" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeSlug">Store URL Slug *</Label>
                <Input id="storeSlug" defaultValue="tech-store" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea 
                id="storeDescription" 
                defaultValue="We offer the latest technology products at competitive prices with excellent customer service."
                rows={3}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input id="contactEmail" type="email" defaultValue="contact@techstore.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input id="contactPhone" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storeAddress">Store Address</Label>
              <Textarea 
                id="storeAddress" 
                defaultValue="123 Tech Street, Digital City, TC 12345"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
            <CardDescription>Legal and tax information for your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Legal Business Name</Label>
                <Input id="businessName" defaultValue="Tech Store LLC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / EIN</Label>
                <Input id="taxId" defaultValue="12-3456789" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea 
                id="businessAddress" 
                defaultValue="123 Tech Street, Digital City, TC 12345"
                rows={2}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <select id="businessType" className="w-full p-2 border rounded-md bg-background">
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole-proprietorship">Sole Proprietorship</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessLicense">Business License</Label>
                <Input id="businessLicense" defaultValue="BL-2024-001234" />
              </div>
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
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Order Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you receive new orders
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Alert when products are running low on stock
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Customer Messages</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications for customer inquiries and messages
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payout Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Updates about payouts and earnings
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Promotional opportunities and platform updates
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Settings</CardTitle>
            <CardDescription>Configure your shipping options and rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="processingTime">Processing Time (days)</Label>
                <Input id="processingTime" type="number" defaultValue="2" min="1" max="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                <Input id="freeShippingThreshold" type="number" defaultValue="50" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Shipping Rates</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-sm text-muted-foreground">5-7 business days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">$</span>
                    <Input type="number" defaultValue="5.99" className="w-20" />
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-sm text-muted-foreground">2-3 business days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">$</span>
                    <Input type="number" defaultValue="12.99" className="w-20" />
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                  <div className="flex-1">
                    <p className="font-medium">Overnight Shipping</p>
                    <p className="text-sm text-muted-foreground">1 business day</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">$</span>
                    <Input type="number" defaultValue="24.99" className="w-20" />
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
            <CardDescription>Manage your account security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch />
            </div>
            
            <Button variant="outline">
              Update Password
            </Button>
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

export default VendorSettings;