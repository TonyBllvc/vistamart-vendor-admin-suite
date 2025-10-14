import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Package, 
  Plus, 
  Edit,
  Trash2,
  Search,
  Check,
  X,
  Building2,
  Globe,
  Shield
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";

const BrandManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const brands = [
    { 
      id: 1, 
      name: "Apple", 
      description: "Technology company specializing in consumer electronics",
      website: "https://apple.com",
      category: "Electronics", 
      products: 67, 
      verified: true,
      status: "active",
      createdAt: "2024-01-15"
    },
    { 
      id: 2, 
      name: "Nike", 
      description: "Athletic footwear and apparel company",
      website: "https://nike.com",
      category: "Sports", 
      products: 145, 
      verified: true,
      status: "active",
      createdAt: "2024-01-20"
    },
    { 
      id: 3, 
      name: "Samsung", 
      description: "Multinational electronics manufacturer",
      website: "https://samsung.com",
      category: "Electronics", 
      products: 89, 
      verified: true,
      status: "active",
      createdAt: "2024-02-01"
    },
    { 
      id: 4, 
      name: "Adidas", 
      description: "German multinational corporation that designs and manufactures shoes",
      website: "https://adidas.com",
      category: "Sports", 
      products: 112, 
      verified: true,
      status: "active",
      createdAt: "2024-02-10"
    },
    { 
      id: 5, 
      name: "IKEA", 
      description: "Swedish-founded multinational furniture retailer",
      website: "https://ikea.com",
      category: "Home & Garden", 
      products: 78, 
      verified: false,
      status: "pending",
      createdAt: "2024-02-15"
    },
  ];

  const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Beauty", "Books", "Automotive"];
  
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.category.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleVerifyBrand = (brandId: number) => {
    console.log("Verifying brand:", brandId);
  };

  const handleEditBrand = (brand: any) => {
    setEditingBrand(brand);
    setIsEditDialogOpen(true);
  };

  const handleUpdateBrand = () => {
    console.log("Updating brand:", editingBrand);
    setIsEditDialogOpen(false);
    setEditingBrand(null);
  };

  const handleDeleteBrand = (brandId: number) => {
    if (confirm("Are you sure you want to delete this brand? This action cannot be undone.")) {
      console.log("Deleting brand:", brandId);
      // Add delete logic here
    }
  };

  const totalProducts = brands.reduce((sum, brand) => sum + brand.products, 0);
  const verifiedBrands = brands.filter(brand => brand.verified).length;
  const pendingBrands = brands.filter(brand => !brand.verified).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Brand Management</h1>
        <p className="text-muted-foreground">
          Manage and regulate brands on your marketplace platform.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{brands.length}</div>
            <p className="text-xs text-muted-foreground">Registered brands</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Brands</CardTitle>
            <Shield className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{verifiedBrands}</div>
            <p className="text-xs text-muted-foreground">Verified and trusted</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <X className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{pendingBrands}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all brands</p>
          </CardContent>
        </Card>
      </div>

      {/* Brand Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Brands
              </CardTitle>
              <CardDescription>Manage all registered brands and their verification status</CardDescription>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/admin/brands/add")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Edit Brand</DialogTitle>
                  <DialogDescription>
                    Update the brand information below.
                  </DialogDescription>
                </DialogHeader>
                {editingBrand && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="edit-brand-name" className="text-sm font-medium">Brand Name</label>
                      <Input
                        id="edit-brand-name"
                        placeholder="Enter brand name"
                        value={editingBrand.name}
                        onChange={(e) => setEditingBrand({...editingBrand, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="edit-brand-description" className="text-sm font-medium">Description</label>
                      <Textarea
                        id="edit-brand-description"
                        placeholder="Enter brand description"
                        value={editingBrand.description}
                        onChange={(e) => setEditingBrand({...editingBrand, description: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="edit-brand-website" className="text-sm font-medium">Website URL</label>
                      <Input
                        id="edit-brand-website"
                        placeholder="https://example.com"
                        value={editingBrand.website}
                        onChange={(e) => setEditingBrand({...editingBrand, website: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="edit-brand-category" className="text-sm font-medium">Primary Category</label>
                      <select
                        id="edit-brand-category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={editingBrand.category}
                        onChange={(e) => setEditingBrand({...editingBrand, category: e.target.value})}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="edit-brand-verified"
                        checked={editingBrand.verified}
                        onCheckedChange={(checked) => setEditingBrand({...editingBrand, verified: checked})}
                      />
                      <label htmlFor="edit-brand-verified" className="text-sm font-medium">Verified Brand</label>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateBrand}>
                    Update Brand
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search brands..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBrands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <span className="text-primary-foreground font-bold text-sm">
                            {brand.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{brand.name}</p>
                            {brand.verified && (
                              <Badge className="bg-success text-success-foreground text-xs">
                                <Check className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{brand.description}</p>
                          {brand.website && (
                            <div className="flex items-center gap-1 mt-1">
                              <Globe className="h-3 w-3 text-muted-foreground" />
                              <a 
                                href={brand.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                {brand.website}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{brand.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{brand.products}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          brand.verified 
                            ? "bg-success text-success-foreground" 
                            : "bg-warning text-warning-foreground"
                        }
                      >
                        {brand.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{brand.createdAt}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!brand.verified && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVerifyBrand(brand.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditBrand(brand)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteBrand(brand.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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
    </div>
  );
};

export default BrandManagement;