
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Edit, Trash, Plus, Search, Loader2, Eye, Star } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { productsApi } from '@/api/apiClient';

interface Product {
  _id: string;
  id: string;
  name: string;
  price: number;
  category: string;
  inventory: number;
  featured: boolean;
  description: string;
  images: { url: string; alt: string }[];
}

const ManageProducts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', categoryFilter],
    queryFn: async () => {
      if (categoryFilter === 'all') {
        return productsApi.getAllProducts();
      } else {
        return productsApi.getProductsByCategory(categoryFilter);
      }
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => {
      return productsApi.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted successfully');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    },
  });

  // Filter products based on search term
  const filteredProducts = React.useMemo(() => {
    if (!productsData?.data) return [];
    
    return productsData.data.filter((product: Product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productsData, searchTerm]);

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const handleAddNew = () => {
    navigate('/admin/products/new');
  };

  const handleEditProduct = (id: string) => {
    navigate(`/admin/products/edit/${id}`);
  };

  const handleViewProduct = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleSetFeatured = async (id: string, featured: boolean) => {
    try {
      const formData = new FormData();
      formData.append('featured', String(!featured));
      
      await productsApi.updateProduct(id, formData);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Product ${!featured ? 'marked as featured' : 'removed from featured'}`);
    } catch (error) {
      toast.error('Failed to update featured status');
      console.error('Error updating featured status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          <p className="text-gray-500">
            View, add, edit and delete products in your store
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus size={16} className="mr-2" />
          Add New Product
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
          <CardTitle>Products</CardTitle>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="wedding">Wedding</SelectItem>
                <SelectItem value="festival">Festival</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product: Product) => (
                    <TableRow key={product._id || product.id}>
                      <TableCell>
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <span className="capitalize">{product.category}</span>
                      </TableCell>
                      <TableCell>₹{product.price.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`${product.inventory === 0 ? 'text-red-500' : product.inventory < 10 ? 'text-amber-500' : 'text-green-600'}`}>
                          {product.inventory}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleSetFeatured(product._id || product.id, product.featured)}
                        >
                          <Star 
                            size={18} 
                            className={product.featured ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewProduct(product._id || product.id)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product._id || product.id)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product._id || product.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageProducts;
