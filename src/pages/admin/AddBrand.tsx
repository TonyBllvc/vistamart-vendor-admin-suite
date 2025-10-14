import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Package } from "lucide-react";
import { toast } from "sonner";

const AddBrand = () => {
  const navigate = useNavigate();
  const [newBrand, setNewBrand] = useState({
    name: "",
    description: "",
    website: "",
    category: "",
    verified: false
  });

  const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Beauty", "Books", "Automotive"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new brand:", newBrand);
    toast.success("Brand added successfully!");
    navigate("/admin/brands");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/brands")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Brand</h1>
          <p className="text-muted-foreground">
            Create a new brand that vendors can use for their products.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Brand Details
          </CardTitle>
          <CardDescription>Fill in the information below to create a new brand</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand-name">Brand Name *</Label>
                <Input
                  id="brand-name"
                  placeholder="Enter brand name"
                  value={newBrand.name}
                  onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-website">Website URL</Label>
                <Input
                  id="brand-website"
                  type="url"
                  placeholder="https://example.com"
                  value={newBrand.website}
                  onChange={(e) => setNewBrand({...newBrand, website: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-description">Description *</Label>
              <Textarea
                id="brand-description"
                placeholder="Enter brand description"
                value={newBrand.description}
                onChange={(e) => setNewBrand({...newBrand, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-category">Primary Category *</Label>
              <select
                id="brand-category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={newBrand.category}
                onChange={(e) => setNewBrand({...newBrand, category: e.target.value})}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="brand-verified"
                checked={newBrand.verified}
                onCheckedChange={(checked) => setNewBrand({...newBrand, verified: checked})}
              />
              <Label htmlFor="brand-verified" className="cursor-pointer">Verified Brand</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/brands")}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Brand
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBrand;
