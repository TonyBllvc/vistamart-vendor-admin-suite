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

const AddMainCategory = () => {
  const navigate = useNavigate();
  const [newMainCategory, setNewMainCategory] = useState({
    name: "",
    description: "",
    icon: "",
    active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding new main category:", newMainCategory);
    toast.success("Main category added successfully!");
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Add Main Category</h1>
          <p className="text-muted-foreground">
            Create a new main category that can contain subcategories.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Main Category Details
          </CardTitle>
          <CardDescription>Fill in the information below to create a new main category</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name *</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Electronics"
                  value={newMainCategory.name}
                  onChange={(e) => setNewMainCategory({...newMainCategory, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category-icon">Icon (Emoji) *</Label>
                <Input
                  id="category-icon"
                  placeholder="💻"
                  value={newMainCategory.icon}
                  onChange={(e) => setNewMainCategory({...newMainCategory, icon: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-description">Description *</Label>
              <Textarea
                id="category-description"
                placeholder="Describe what products belong to this main category"
                value={newMainCategory.description}
                onChange={(e) => setNewMainCategory({...newMainCategory, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="category-active"
                checked={newMainCategory.active}
                onCheckedChange={(checked) => setNewMainCategory({...newMainCategory, active: checked})}
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
                Add Main Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMainCategory;
