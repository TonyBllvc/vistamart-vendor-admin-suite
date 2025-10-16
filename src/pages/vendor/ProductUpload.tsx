import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  Image as ImageIcon,
  Plus,
  X,
  Save,
  Eye
} from "lucide-react";

interface Specification {
  id: string;
  name: string;
  value: string;
}

const ProductUpload = () => {
  const [specifications, setSpecifications] = useState<Specification[]>([
    { id: "1", name: "", value: "" },
    { id: "2", name: "", value: "" }
  ]);

  const categories = [
    "Electronics", "Fashion", "Home & Garden", "Sports", "Beauty", "Books", "Toys"
  ];

  const brands = [
    "Apple", "Samsung", "Nike", "Adidas", "Sony", "Microsoft", "Dell"
  ];

  const addSpecification = () => {
    setSpecifications([...specifications, { id: Date.now().toString(), name: "", value: "" }]);
  };

  const removeSpecification = (id: string) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter(spec => spec.id !== id));
    }
  };

  const updateSpecification = (id: string, field: 'name' | 'value', value: string) => {
    setSpecifications(specifications.map(spec => 
      spec.id === id ? { ...spec, [field]: value } : spec
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Upload New Product</h1>
        <p className="text-muted-foreground">
          Add a new product to your store catalog.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Product Information */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the main details about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input id="productName" placeholder="Enter product name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="productDescription">Description *</Label>
                <Textarea 
                  id="productDescription" 
                  placeholder="Describe your product in detail..."
                  rows={4}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select id="category" className="w-full p-2 border rounded-md bg-background">
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <select id="brand" className="w-full p-2 border rounded-md bg-background">
                    <option value="">Select Brand</option>
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="e.g. wireless, bluetooth, premium (comma separated)" />
                <p className="text-xs text-muted-foreground">
                  Add relevant tags to help customers find your product
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>Set your product pricing and stock information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input id="price" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Compare Price ($)</Label>
                  <Input id="comparePrice" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost per item ($)</Label>
                  <Input id="cost" type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Product SKU" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input id="barcode" placeholder="Barcode (ISBN, UPC, GTIN, etc.)" />
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStock">Low stock threshold</Label>
                  <Input id="lowStock" type="number" placeholder="5" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
              <CardDescription>Add detailed specifications and attributes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {specifications.map((spec) => (
                  <div key={spec.id} className="flex items-center gap-2">
                    <Input 
                      placeholder="Specification name" 
                      className="flex-1"
                      value={spec.name}
                      onChange={(e) => updateSpecification(spec.id, 'name', e.target.value)}
                    />
                    <Input 
                      placeholder="Value" 
                      className="flex-1"
                      value={spec.value}
                      onChange={(e) => updateSpecification(spec.id, 'value', e.target.value)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeSpecification(spec.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full" onClick={addSpecification}>
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload high-quality product images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-medium mb-2">Drag & drop images here</p>
                <p className="text-xs text-muted-foreground mb-4">or</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>Set product visibility and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" className="w-full p-2 border rounded-md bg-background">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <select id="visibility" className="w-full p-2 border rounded-md bg-background">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <input type="checkbox" id="trackQuantity" defaultChecked />
                <Label htmlFor="trackQuantity">Track Quantity</Label>
              </div>
            </CardContent>
          </Card>

          {/* SEO Settings */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize for search engines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" placeholder="SEO title" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea 
                  id="metaDescription" 
                  placeholder="SEO description"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="urlHandle">URL Handle</Label>
                <Input id="urlHandle" placeholder="product-url-handle" />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button className="w-full bg-primary hover:bg-primary-hover">
              <Save className="h-4 w-4 mr-2" />
              Save Product
            </Button>
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductUpload;