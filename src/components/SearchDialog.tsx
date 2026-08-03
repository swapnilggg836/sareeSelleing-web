
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/apiClient";
import ProductCard from "./ProductCard";

const SearchDialog = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return { data: [] };
      // Use a custom search endpoint or filter products client-side
      const response = await productsApi.getAllProducts();
      // Filter products based on search term
      const filteredProducts = response.data.filter((product: any) =>
        product.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        product.category?.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      return { data: filteredProducts };
    },
    enabled: debouncedSearch.length > 2,
  });

  const products = searchResults?.data || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search for sarees, collections, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <div className="overflow-y-auto max-h-[60vh]">
            {isLoading && debouncedSearch && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
            
            {debouncedSearch && !isLoading && products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found for "{debouncedSearch}"
              </div>
            )}
            
            {products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    images={product.images}
                  />
                ))}
              </div>
            )}
            
            {!debouncedSearch && (
              <div className="text-center py-8 text-gray-500">
                Start typing to search for products...
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
