import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tag, 
  Plus, 
  Edit,
  Trash2,
  Search,
  Package
} from "lucide-react";

const BrandCategories = () => {
  const categories = [
    { id: 1, name: "Electronics", description: "Phones, laptops, and gadgets", products: 1234, icon: "💻" },
    { id: 2, name: "Fashion", description: "Clothing, shoes, and accessories", products: 856, icon: "👕" },
    { id: 3, name: "Home & Garden", description: "Furniture, decor, and tools", products: 643, icon: "🏠" },
    { id: 4, name: "Sports", description: "Fitness, outdoor, and sports gear", products: 421, icon: "⚽" },
    { id: 5, name: "Beauty", description: "Cosmetics, skincare, and health", products: 389, icon: "💄" },
  ];

  const brands = [
    { id: 1, name: "Apple", category: "Electronics", products: 67, verified: true },
    { id: 2, name: "Nike", category: "Sports", products: 145, verified: true },
    { id: 3, name: "Samsung", category: "Electronics", products: 89, verified: true },
    { id: 4, name: "Adidas", category: "Sports", products: 112, verified: true },
    { id: 5, name: "IKEA", category: "Home & Garden", products: 78, verified: false },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Brands & Categories</h1>
        <p className="text-muted-foreground">
          Manage product categories and brands on your marketplace.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands.length}</div>
            <p className="text-xs text-muted-foreground">Registered brands</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Brands</CardTitle>
            <Badge className="bg-success text-success-foreground">✓</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brands.filter(b => b.verified).length}</div>
            <p className="text-xs text-muted-foreground">Verified and trusted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Categories Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Categories
                </CardTitle>
                <CardDescription>Manage product categories</CardDescription>
              </div>
              <Button className="bg-primary hover:bg-primary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search categories..." className="pl-10" />
            </div>
            
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{category.icon}</div>
                  <div>
                    <p className="font-medium">{category.name}</p>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.products} products
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Brands Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Brands
                </CardTitle>
                <CardDescription>Manage registered brands</CardDescription>
              </div>
              <Button className="bg-secondary hover:bg-secondary-hover">
                <Plus className="h-4 w-4 mr-2" />
                Add Brand
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search brands..." className="pl-10" />
            </div>
            
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{brand.name}</p>
                      {brand.verified && (
                        <Badge className="bg-success text-success-foreground text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{brand.category}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {brand.products} products
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BrandCategories;