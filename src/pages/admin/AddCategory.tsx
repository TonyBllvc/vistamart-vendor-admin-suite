import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Tag } from "lucide-react";
import { toast } from "sonner";

const AddCategory = () => {
  const navigate = useNavigate();
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "",
    parentCategory: "",
    active: true
  });

  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Fashion" },
    { id: 3, name: "Home & Garden" },
    { id: 4, name: "Sports & Fitness" },
    { id: 5, name: "Beauty & Health" },
    { id: 6, name: "Books & Media" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new category:", newCategory);
    toast.success("Category added successfully!");
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add New Category</h1>
          <p className="text-muted-foreground">
            Create a new category that vendors can use to organize their products.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Category Details
          </CardTitle>
          <CardDescription>Fill in the information below to create a new category</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name *</Label>
                <Input
                  id="category-name"
                  placeholder="Enter category name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-icon">Icon (Emoji) *</Label>
                <Input
                  id="category-icon"
                  placeholder="📱"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description *</Label>
              <Textarea
                id="category-description"
                placeholder="Enter category description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parent-category">Parent Category (Optional)</Label>
              <select
                id="parent-category"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={newCategory.parentCategory}
                onChange={(e) => setNewCategory({...newCategory, parentCategory: e.target.value})}
              >
                <option value="">No parent (Main category)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="category-active"
                checked={newCategory.active}
                onCheckedChange={(checked) => setNewCategory({...newCategory, active: checked})}
              />
              <Label htmlFor="category-active" className="cursor-pointer">Active Category</Label>
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
                Add Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
