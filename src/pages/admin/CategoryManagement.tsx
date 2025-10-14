import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tag, 
  Plus, 
  Edit,
  Trash2,
  Search,
  Package,
  Folder,
  TrendingUp
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

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  const categories = [
    { 
      id: 1, 
      name: "Electronics", 
      description: "Phones, laptops, gadgets and electronic devices", 
      products: 1234, 
      icon: "💻",
      parentCategory: null,
      active: true,
      subcategories: 15,
      createdAt: "2024-01-10"
    },
    { 
      id: 2, 
      name: "Fashion", 
      description: "Clothing, shoes, accessories and fashion items", 
      products: 856, 
      icon: "👕",
      parentCategory: null,
      active: true,
      subcategories: 12,
      createdAt: "2024-01-12"
    },
    { 
      id: 3, 
      name: "Home & Garden", 
      description: "Furniture, decor, tools and home improvement", 
      products: 643, 
      icon: "🏠",
      parentCategory: null,
      active: true,
      subcategories: 8,
      createdAt: "2024-01-15"
    },
    { 
      id: 4, 
      name: "Sports & Fitness", 
      description: "Fitness equipment, outdoor gear and sports items", 
      products: 421, 
      icon: "⚽",
      parentCategory: null,
      active: true,
      subcategories: 10,
      createdAt: "2024-01-18"
    },
    { 
      id: 5, 
      name: "Beauty & Health", 
      description: "Cosmetics, skincare, health and wellness products", 
      products: 389, 
      icon: "💄",
      parentCategory: null,
      active: true,
      subcategories: 6,
      createdAt: "2024-01-20"
    },
    { 
      id: 6, 
      name: "Books & Media", 
      description: "Books, movies, music and digital media", 
      products: 276, 
      icon: "📚",
      parentCategory: null,
      active: true,
      subcategories: 4,
      createdAt: "2024-01-22"
    },
    { 
      id: 7, 
      name: "Smartphones", 
      description: "Mobile phones and smartphone accessories", 
      products: 145, 
      icon: "📱",
      parentCategory: "Electronics",
      active: true,
      subcategories: 0,
      createdAt: "2024-01-25"
    },
  ];

  const parentCategories = categories.filter(cat => !cat.parentCategory);
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const handleToggleCategory = (categoryId: number) => {
    console.log("Toggling category status:", categoryId);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = () => {
    console.log("Updating category:", editingCategory);
    setIsEditDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      console.log("Deleting category:", categoryId);
      // Add delete logic here
    }
  };

  const totalProducts = categories.reduce((sum, category) => sum + category.products, 0);
  const activeCategories = categories.filter(category => category.active).length;
  const totalSubcategories = categories.reduce((sum, category) => sum + category.subcategories, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Category Management</h1>
        <p className="text-muted-foreground">
          Organize and manage product categories for your marketplace.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{categories.length}</div>
            <p className="text-xs text-muted-foreground">All categories</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
            <Folder className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeCategories}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalSubcategories}</div>
            <p className="text-xs text-muted-foreground">Sub-classifications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Categories
              </CardTitle>
              <CardDescription>Manage product categories and their organization</CardDescription>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => navigate("/admin/categories/add")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Edit Category</DialogTitle>
                  <DialogDescription>
                    Update the category information below.
                  </DialogDescription>
                </DialogHeader>
                {editingCategory && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label htmlFor="edit-category-name" className="text-sm font-medium">Category Name</label>
                      <Input
                        id="edit-category-name"
                        placeholder="Enter category name"
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="edit-category-description" className="text-sm font-medium">Description</label>
                      <Textarea
                        id="edit-category-description"
                        placeholder="Enter category description"
                        value={editingCategory.description}
                        onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="edit-category-icon" className="text-sm font-medium">Icon (Emoji)</label>
                      <Input
                        id="edit-category-icon"
                        placeholder="📱"
                        value={editingCategory.icon}
                        onChange={(e) => setEditingCategory({...editingCategory, icon: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="edit-parent-category" className="text-sm font-medium">Parent Category (Optional)</label>
                      <select
                        id="edit-parent-category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={editingCategory.parentCategory || ""}
                        onChange={(e) => setEditingCategory({...editingCategory, parentCategory: e.target.value})}
                      >
                        <option value="">No parent (Main category)</option>
                        {parentCategories.map((category) => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="edit-category-active"
                        checked={editingCategory.active}
                        onCheckedChange={(checked) => setEditingCategory({...editingCategory, active: checked})}
                      />
                      <label htmlFor="edit-category-active" className="text-sm font-medium">Active Category</label>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateCategory}>
                    Update Category
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
              placeholder="Search categories..." 
              className="pl-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Subcategories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{category.icon}</div>
                        <div>
                          <p className="font-medium text-foreground">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.parentCategory ? (
                        <Badge variant="outline">{category.parentCategory}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Main Category</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{category.products}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{category.subcategories}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={
                          category.active 
                            ? "bg-success text-success-foreground" 
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {category.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{category.createdAt}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleToggleCategory(category.id)}
                        >
                          <Switch checked={category.active} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCategory(category.id)}
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

export default CategoryManagement;