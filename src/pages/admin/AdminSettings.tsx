import { useState } from "react";
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
  Users,
  Search,
  Plus,
  X,
  Upload,
  Trash2
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for users
const mockUsers = [
  { id: 1, email: "john@example.com", name: "John Doe", role: "user", status: "active" },
  { id: 2, email: "vendor@example.com", name: "Vendor Smith", role: "vendor", status: "active" },
  { id: 3, email: "banned@example.com", name: "Banned User", role: "user", status: "banned" },
  { id: 4, email: "admin@example.com", name: "Admin User", role: "admin", status: "active" },
];

const AdminSettings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customFees, setCustomFees] = useState([
    { id: 1, name: "Vendor Commission", value: "85", type: "percentage" },
    { id: 2, name: "Affiliate Commission", value: "5", type: "percentage" },
    { id: 3, name: "Processing Fee", value: "2.5", type: "percentage" },
    { id: 4, name: "Withdrawal Fee", value: "2.00", type: "fixed" },
  ]);
  const [selectedPage, setSelectedPage] = useState("Home");
  const [uploadedImages, setUploadedImages] = useState<{[key: string]: string[]}>({
    Home: [],
    Products: [],
    Categories: [],
    Blog: [],
    FAQ: []
  });
  const [stagedImages, setStagedImages] = useState<File[]>([]);

  const filteredUsers = mockUsers.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addCustomFee = () => {
    setCustomFees([...customFees, { 
      id: Date.now(), 
      name: "", 
      value: "0", 
      type: "percentage" 
    }]);
  };

  const removeFee = (id: number) => {
    setCustomFees(customFees.filter(fee => fee.id !== id));
  };

  const updateFee = (id: number, field: string, value: string) => {
    setCustomFees(customFees.map(fee => 
      fee.id === id ? { ...fee, [field]: value } : fee
    ));
  };

  const handleImageStage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentImages = uploadedImages[selectedPage]?.length || 0;
    const availableSlots = 3 - currentImages;
    
    if (files.length + stagedImages.length > availableSlots) {
      alert(`You can only upload ${availableSlots} more image(s) for this page`);
      return;
    }
    
    setStagedImages([...stagedImages, ...files]);
  };

  const removeStagedImage = (index: number) => {
    setStagedImages(stagedImages.filter((_, i) => i !== index));
  };

  const uploadStagedImages = () => {
    const urls = stagedImages.map(file => URL.createObjectURL(file));
    setUploadedImages({
      ...uploadedImages,
      [selectedPage]: [...(uploadedImages[selectedPage] || []), ...urls]
    });
    setStagedImages([]);
  };

  const removeUploadedImage = (page: string, index: number) => {
    setUploadedImages({
      ...uploadedImages,
      [page]: uploadedImages[page].filter((_, i) => i !== index)
    });
  };
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users by email or name..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "banned" ? "destructive" : "default"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {user.status === "active" ? (
                            <Button size="sm" variant="destructive">
                              <UserX className="h-3 w-3 mr-1" />
                              Ban
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Unban
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users by email or name..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Change Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Select defaultValue={user.role}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="vendor">Vendor</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm">
                            <UserCog className="h-3 w-3 mr-1" />
                            Update
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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
            <div className="space-y-4">
              {customFees.map((fee, index) => (
                <div key={fee.id} className="grid grid-cols-12 gap-3 items-end p-3 border rounded-lg">
                  <div className="col-span-5 space-y-2">
                    <Label>Fee Name</Label>
                    <Input 
                      value={fee.name}
                      onChange={(e) => updateFee(fee.id, 'name', e.target.value)}
                      placeholder="Fee name"
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label>Value</Label>
                    <Input 
                      type="number"
                      value={fee.value}
                      onChange={(e) => updateFee(fee.id, 'value', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label>Type</Label>
                    <Select 
                      value={fee.type}
                      onValueChange={(value) => updateFee(fee.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-1">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => removeFee(fee.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={addCustomFee} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Custom Fee
            </Button>

            <div className="pt-4 border-t space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="minWithdrawal">Minimum Withdrawal Amount ($)</Label>
                  <Input id="minWithdrawal" type="number" defaultValue="50" min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxWithdrawal">Maximum Withdrawal Amount ($)</Label>
                  <Input id="maxWithdrawal" type="number" defaultValue="10000" min="0" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="payoutDelay">Payout Delay (days)</Label>
                <Input id="payoutDelay" type="number" defaultValue="7" min="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Hero Images Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Featured Hero Images Management
            </CardTitle>
            <CardDescription>Manage hero images for different pages (max 3 per page)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Page</Label>
              <Select value={selectedPage} onValueChange={setSelectedPage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home Page</SelectItem>
                  <SelectItem value="Products">Products Page</SelectItem>
                  <SelectItem value="Categories">Categories Page</SelectItem>
                  <SelectItem value="Blog">Blog Page</SelectItem>
                  <SelectItem value="FAQ">FAQ Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Uploaded Images */}
            <div className="space-y-2">
              <Label>Uploaded Images ({uploadedImages[selectedPage]?.length || 0}/3)</Label>
              <div className="grid grid-cols-3 gap-4">
                {uploadedImages[selectedPage]?.map((url, index) => (
                  <div key={index} className="relative aspect-video border-2 border-dashed rounded-lg overflow-hidden group">
                    <img src={url} alt={`Hero ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeUploadedImage(selectedPage, index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {Array.from({ length: 3 - (uploadedImages[selectedPage]?.length || 0) }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-video border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/20">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>

            {/* Staged Images for Upload */}
            {stagedImages.length > 0 && (
              <div className="space-y-2">
                <Label>Staged for Upload ({stagedImages.length})</Label>
                <div className="grid grid-cols-3 gap-4">
                  {stagedImages.map((file, index) => (
                    <div key={index} className="relative aspect-video border-2 border-primary border-dashed rounded-lg overflow-hidden group">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Staged ${index + 1}`} 
                        className="w-full h-full object-cover opacity-70" 
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => removeStagedImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <Badge className="absolute bottom-2 left-2">Pending</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Controls */}
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageStage}
                  disabled={(uploadedImages[selectedPage]?.length || 0) >= 3}
                  className="cursor-pointer"
                />
              </div>
              {stagedImages.length > 0 && (
                <Button onClick={uploadStagedImages}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload {stagedImages.length} Image{stagedImages.length > 1 ? 's' : ''}
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="random">Random</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="slideshowDuration">Slideshow Duration (seconds)</Label>
                <Input id="slideshowDuration" type="number" defaultValue="5" min="1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Account Management
            </CardTitle>
            <CardDescription>View and manage all user, vendor, and admin accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search accounts..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="vendor">Vendors</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "banned" ? "destructive" : "default"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                Export to CSV
              </Button>
              <Button variant="outline" className="flex-1">
                Export to PDF
              </Button>
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