import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, FolderTree } from "lucide-react";
import { toast } from "sonner";

const AddSubcategory = () => {
  const navigate = useNavigate();
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    description: "",
    icon: "",
    parentCategory: "",
    active: true
  });

  const mainCategories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Garden" },
    { id: 4, name: "Sports & Fitness" },
    { id: 5, name: "Beauty & Health" },
    { id: 6, name: "Books & Media" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcategory.parentCategory) {
      toast.error("Please select a parent category");
      return;
    }
    console.log("Adding new subcategory:", newSubcategory);
    toast.success("Subcategory added successfully!");
    navigate("/admin/categories");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/admin/categories")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add Subcategory</h1>
          <p className="text-muted-foreground">
            Create a new subcategory under an existing main category.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Subcategory Details
          </CardTitle>
          <CardDescription>Fill in the information below to create a new subcategory</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="parent-category">Parent Category *</Label>
              <select
                id="parent-category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={newSubcategory.parentCategory}
                onChange={(e) => setNewSubcategory({...newSubcategory, parentCategory: e.target.value})}
                required
              >
                <option value="">Select a main category</option>
                {mainCategories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category-name">Subcategory Name *</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Smartphones"
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory({...newSubcategory, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-icon">Icon (Emoji) *</Label>
                <Input
                  id="category-icon"
                  placeholder="📱"
                  value={newSubcategory.icon}
                  onChange={(e) => setNewSubcategory({...newSubcategory, icon: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description *</Label>
              <Textarea
                id="category-description"
                placeholder="Describe what products belong to this subcategory"
                value={newSubcategory.description}
                onChange={(e) => setNewSubcategory({...newSubcategory, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="category-active"
                checked={newSubcategory.active}
                onCheckedChange={(checked) => setNewSubcategory({...newSubcategory, active: checked})}
              />
              <Label htmlFor="category-active" className="cursor-pointer">Active Subcategory</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/categories")}
              >
                Cancel
              </Button>
              <Button type="submit">
                Add Subcategory
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddSubcategory;
