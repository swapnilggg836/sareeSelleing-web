
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileUp, FileDown, ShoppingBag, Boxes, ImageIcon, FileText, Tag, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const AdminPostData = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Manage Content</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/admin/products/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Content
          </Button>
          <Button variant="outline">
            <FileUp className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Website Content</CardTitle>
          <CardDescription>
            Add, edit or remove content that appears on your website
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
                    Products
                  </CardTitle>
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Core Data
                  </span>
                </div>
                <CardDescription>Manage your store's products</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add new products, update existing items, set pricing, and manage inventory.
                </p>
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => navigate('/admin/products/new')}>
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                  </Button>
                  <Button variant="outline" className="flex-shrink-0" onClick={() => navigate('/admin/products')}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Boxes className="mr-2 h-5 w-5 text-primary" />
                    Collections
                  </CardTitle>
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Organization
                  </span>
                </div>
                <CardDescription>Organize products into collections</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create collections for wedding, festival, designer categories and more.
                </p>
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => navigate('/admin/collections/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Collection
                  </Button>
                  <Button variant="outline" className="flex-shrink-0" onClick={() => navigate('/admin/collections')}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <ImageIcon className="mr-2 h-5 w-5 text-primary" />
                    Banners
                  </CardTitle>
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Marketing
                  </span>
                </div>
                <CardDescription>Update homepage banners and promotions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create beautiful banners for your homepage carousel and promotional sections.
                </p>
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => navigate('/admin/banners/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Banner
                  </Button>
                  <Button variant="outline" className="flex-shrink-0" onClick={() => navigate('/admin/banners')}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-primary" />
                    Blog Posts
                  </CardTitle>
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Content
                  </span>
                </div>
                <CardDescription>Manage your site's blog content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Create, edit and publish blog posts and articles about products and trends.
                </p>
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => navigate('/admin/blog/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Post
                  </Button>
                  <Button variant="outline" className="flex-shrink-0" onClick={() => navigate('/admin/blog')}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-primary" />
                    Categories
                  </CardTitle>
                  <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Taxonomy
                  </span>
                </div>
                <CardDescription>Organize with categories and tags</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage product categories, subcategories, and tags for better organization.
                </p>
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => navigate('/admin/categories/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Category
                  </Button>
                  <Button variant="outline" className="flex-shrink-0" onClick={() => navigate('/admin/categories')}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Tag className="mr-2 h-5 w-5 text-red-500" />
                    Sale Items
                  </CardTitle>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Sale
                  </span>
                </div>
                <CardDescription>Manage sale items and promotions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add products to sale section with discounted prices and special offers.
                </p>
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => navigate('/admin/sale/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Sale
                  </Button>
                  <Button variant="outline" className="flex-shrink-0" onClick={() => navigate('/admin/sale')}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-blue-500" />
                    Reviews
                  </CardTitle>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Customer Feedback
                  </span>
                </div>
                <CardDescription>Manage customer reviews and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Add, moderate, and manage customer reviews for your products.
                </p>
                <div className="flex gap-2">
                  <Button className="w-full" onClick={() => navigate('/admin/reviews/new')}>
                    <Plus className="mr-2 h-4 w-4" /> New Review
                  </Button>
                  <Button variant="outline" className="flex-shrink-0" onClick={() => navigate('/admin/reviews')}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPostData;
