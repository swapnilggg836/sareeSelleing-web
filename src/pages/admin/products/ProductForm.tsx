import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { X, Image, Plus, Trash, Loader2 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { productsApi } from '@/api/apiClient';

// Define interfaces
interface SareeDetail {
  fabric: string;
  blouseBorderPattern: string;
  design: string;
  dimensions: string;
  weight: string;
  blouseLength: string;
  materialType: string;
  country: string;
}

interface ColorVariant {
  name: string;
  hex: string;
  images: File[];
  imagePreviewUrls: string[];
  existingImages?: string[];
}

interface ProductFormData {
  name: string;
  category: string;
  subcategory: string;
  price: string;
  discount: string;
  stock: string;
  description: string;
  details: string;
  careInstructions: string;
  featured: boolean;
}

const VALID_CATEGORIES = [
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'banarasi-silk', label: 'Banarasi Silk' },
  { value: 'kanjivaram', label: 'Kanjivaram' },
  { value: 'patola', label: 'Patola' },
  { value: 'paithani', label: 'Paithani' },
  { value: 'bandhani', label: 'Bandhani' },
];

// You may define hardcoded subcategories to match your needs (these are just examples)
const subcategoryOptions: Record<string, string[]> = {
  'new-arrivals': ['2025 Collection', 'Trending', 'Popular'],
  'banarasi-silk': ['Classic', 'Modern', 'Bridal'],
  'kanjivaram': ['Temple Border', 'Checks', 'Traditional'],
  'patola': ['Double Ikat', 'Single Ikat'],
  'paithani': ['Peacock Design', 'Lotus Border'],
  'bandhani': ['Traditional Tie-Dye', 'Modern Bandhej'],
};

const ProductForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    discount: '0',
    stock: '',
    description: '',
    details: '',
    careInstructions: '',
    featured: false
  });
  const [mainCategory, setMainCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Product images
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{url: string; alt: string}[]>([]);
  
  // Saree details in table form
  const [sareeDetails, setSareeDetails] = useState<SareeDetail>({
    fabric: '',
    blouseBorderPattern: '',
    design: '',
    dimensions: '',
    weight: '',
    blouseLength: '',
    materialType: '',
    country: 'India', // Default country
  });
  
  // Color variants
  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([
    { name: '', hex: '#000000', images: [], imagePreviewUrls: [], existingImages: [] }
  ]);

  const categoryOptions = {
    'wedding': ['Bridal', 'Reception', 'Engagement'],
    'festival': ['Diwali', 'Holi', 'Dussehra', 'Navratri'],
    'designer': ['Celebrity', 'Luxury', 'Limited Edition'],
    'all': ['Silk', 'Cotton', 'Banarasi', 'Kanjivaram'] 
  };
  
  // Fetch product data for edit mode
  const { data: productData, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (id) {
        return await productsApi.getProductById(id);
      }
      return null;
    },
    enabled: isEditMode,
  });
  
  // Effect for populating form with product data in edit mode
  useEffect(() => {
    if (productData && isEditMode) {
      const product = productData.data;
      setFormData({
        name: product.name || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '0',
        stock: product.inventory?.toString() || '',
        description: product.description || '',
        details: product.details || '',
        careInstructions: product.careInstructions || '',
        featured: product.featured || false
      });
      
      setMainCategory(product.category || null);

      // Set saree details if available
      if (product.sareeDetails) {
        setSareeDetails(product.sareeDetails);
      }
      
      // Set existing images
      if (product.images && product.images.length > 0) {
        setExistingImages(product.images);
      }
      
      // Set color variants
      if (product.colors && product.colors.length > 0) {
        const formattedVariants = product.colors.map((color: any) => ({
          name: color.name || '',
          hex: color.hex || '#000000',
          images: [],
          imagePreviewUrls: [],
          existingImages: []
        }));
        setColorVariants(formattedVariants);
      }
    }
  }, [productData, isEditMode]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: checked }));
  };
  
  // Create/Update product mutation
  const productMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (isEditMode && id) {
        return productsApi.updateProduct(id, formData);
      } else {
        return productsApi.createProduct(formData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(isEditMode ? 'Product updated successfully' : 'Product added successfully');
      navigate('/admin/manage-products');
    },
    onError: (error) => {
      setLoading(false);
      toast.error(isEditMode ? 'Failed to update product' : 'Failed to add product');
      console.error('Submission error:', error);
    },
  });

  // Handle main product images upload
  const handleProductImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Check if adding new images would exceed the 10 image limit
      if (productImages.length + existingImages.length + filesArray.length > 10) {
        toast.error("You can only upload up to 10 images for the main product.");
        return;
      }
      
      // Create preview URLs
      const newImagePreviews = filesArray.map(file => URL.createObjectURL(file));
      
      setProductImages(prevImages => [...prevImages, ...filesArray]);
      setImagePreviewUrls(prevUrls => [...prevUrls, ...newImagePreviews]);
    }
  };

  // Remove product image
  const removeProductImage = (index: number) => {
    const updatedImages = [...productImages];
    const updatedPreviews = [...imagePreviewUrls];
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setProductImages(updatedImages);
    setImagePreviewUrls(updatedPreviews);
  };
  
  // Remove existing product image
  const removeExistingProductImage = (index: number) => {
    const updatedImages = [...existingImages];
    updatedImages.splice(index, 1);
    setExistingImages(updatedImages);
  };

  // Update saree details
  const handleSareeDetailChange = (field: keyof SareeDetail, value: string) => {
    setSareeDetails(prev => ({ ...prev, [field]: value }));
  };

  // Add color variant
  const addColorVariant = () => {
    if (colorVariants.length < 10) {
      setColorVariants([...colorVariants, { name: '', hex: '#000000', images: [], imagePreviewUrls: [], existingImages: [] }]);
    } else {
      toast.error("You can only add up to 10 color variants.");
    }
  };

  // Remove color variant
  const removeColorVariant = (index: number) => {
    // Revoke all object URLs for this variant to avoid memory leaks
    colorVariants[index].imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    
    const updatedVariants = [...colorVariants];
    updatedVariants.splice(index, 1);
    setColorVariants(updatedVariants);
  };

  // Update color variant
  const updateColorVariant = (index: number, field: keyof ColorVariant, value: any) => {
    const updatedVariants = [...colorVariants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setColorVariants(updatedVariants);
  };

  // Handle color variant image upload
  const handleVariantImages = (e: React.ChangeEvent<HTMLInputElement>, variantIndex: number) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const currentVariant = colorVariants[variantIndex];
      const existingImagesCount = currentVariant.existingImages?.length || 0;
      
      // Check if adding new images would exceed the 10 image limit for this variant
      if (currentVariant.images.length + existingImagesCount + filesArray.length > 10) {
        toast.error("You can only upload up to 10 images per color variant.");
        return;
      }
      
      // Create preview URLs
      const newImagePreviews = filesArray.map(file => URL.createObjectURL(file));
      
      const updatedVariants = [...colorVariants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        images: [...updatedVariants[variantIndex].images, ...filesArray],
        imagePreviewUrls: [...updatedVariants[variantIndex].imagePreviewUrls, ...newImagePreviews]
      };
      
      setColorVariants(updatedVariants);
    }
  };

  // Remove color variant image
  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    const updatedVariants = [...colorVariants];
    const variant = updatedVariants[variantIndex];
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(variant.imagePreviewUrls[imageIndex]);
    
    variant.images.splice(imageIndex, 1);
    variant.imagePreviewUrls.splice(imageIndex, 1);
    
    setColorVariants(updatedVariants);
  };
  
  // Remove existing variant image
  const removeExistingVariantImage = (variantIndex: number, imageIndex: number) => {
    const updatedVariants = [...colorVariants];
    if (updatedVariants[variantIndex].existingImages) {
      updatedVariants[variantIndex].existingImages!.splice(imageIndex, 1);
      setColorVariants(updatedVariants);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    
    // Validate images
    if (productImages.length === 0 && existingImages.length === 0) {
      toast.error("Please upload at least one product image.");
      setLoading(false);
      return;
    }
    
    // Validate color variants
    const invalidColorVariants = colorVariants.filter(variant => 
      variant.name.trim() === ''
    );
    
    if (invalidColorVariants.length > 0) {
      toast.error("Please ensure all color variants have a name.");
      setLoading(false);
      return;
    }
    
    try {
      // Create FormData object for file uploads
      const formDataToSubmit = new FormData();
      
      // Add basic product info
      formDataToSubmit.append('name', formData.name);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('subcategory', formData.subcategory || '');
      formDataToSubmit.append('price', formData.price);
      formDataToSubmit.append('inventory', formData.stock);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('details', formData.details);
      formDataToSubmit.append('careInstructions', formData.careInstructions);
      formDataToSubmit.append('featured', String(formData.featured));
      
      // Add saree details
      formDataToSubmit.append('sareeDetails', JSON.stringify(sareeDetails));
      
      // Add existing images
      formDataToSubmit.append('existingImages', JSON.stringify(existingImages));
      
      // Add new product images
      productImages.forEach((file, index) => {
        formDataToSubmit.append(`productImages`, file);
      });
      
      // Add color variants
      formDataToSubmit.append('colorVariants', JSON.stringify(
        colorVariants.map(variant => ({
          name: variant.name,
          hex: variant.hex
        }))
      ));
      
      // Add variant images
      colorVariants.forEach((variant, variantIndex) => {
        variant.images.forEach((file, fileIndex) => {
          formDataToSubmit.append(`variantImages_${variantIndex}`, file);
        });
        
        if (variant.existingImages && variant.existingImages.length > 0) {
          formDataToSubmit.append(
            `variantExistingImages_${variantIndex}`, 
            JSON.stringify(variant.existingImages)
          );
        }
      });
      
      // Submit the data
      productMutation.mutate(formDataToSubmit);
    } catch (error) {
      console.error('Error preparing form data:', error);
      setLoading(false);
      toast.error("An error occurred while processing your request.");
    }
  };

  if (isLoadingProduct && isEditMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-gray-500">
          {isEditMode ? 'Update existing product details' : 'Add a new product to your inventory'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Select Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => {
                    setMainCategory(value);
                    setFormData(prev => ({ ...prev, category: value, subcategory: '' }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALID_CATEGORIES.map(option => (
                      <SelectItem value={option.value} key={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {mainCategory && (
                <div className="space-y-2">
                  <Label htmlFor="subcategory">
                    Select Subcategory
                  </Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {(subcategoryOptions[mainCategory] || []).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price" 
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input 
                  id="discount" 
                  type="number"
                  value={formData.discount} 
                  onChange={handleInputChange}
                  placeholder="Enter discount percentage" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input 
                  id="stock" 
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity" 
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
                <p className="text-sm text-gray-500">
                  Featured products will be displayed prominently on the homepage
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Product Details</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.keys(sareeDetails).map((key) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={sareeDetails[key as keyof SareeDetail]} 
                          onChange={(e) => handleSareeDetailChange(key as keyof SareeDetail, e.target.value)}
                          className="w-full"
                          placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter detailed product description" 
                className="min-h-[100px]" 
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea 
                id="details"
                value={formData.details}
                onChange={handleInputChange}
                placeholder="Enter additional product details" 
                className="min-h-[100px]" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="careInstructions">Care Instructions</Label>
              <Textarea 
                id="careInstructions"
                value={formData.careInstructions}
                onChange={handleInputChange}
                placeholder="Enter care instructions" 
                className="min-h-[100px]" 
              />
            </div>

            {/* Product Images Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>
                  Product Images ({productImages.length + existingImages.length}/10)
                </Label>
                <span className="text-xs text-gray-500">
                  You can upload up to 10 images
                </span>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input 
                  type="file" 
                  id="product_images" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleProductImages}
                  disabled={productImages.length + existingImages.length >= 10}
                />
                <label 
                  htmlFor="product_images" 
                  className={`cursor-pointer block ${productImages.length + existingImages.length >= 10 ? 'opacity-50' : ''}`}
                >
                  <div className="space-y-2">
                    <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Image className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </label>
              </div>
              
              {/* Image Preview */}
              {(imagePreviewUrls.length > 0 || existingImages.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                  {/* Display existing images */}
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img 
                        src={image.url} 
                        alt={image.alt || `Existing preview ${index + 1}`}
                        className="h-32 w-full object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingProductImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  
                  {/* Display new images */}
                  {imagePreviewUrls.map((url, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img 
                        src={url} 
                        alt={`Preview ${index + 1}`}
                        className="h-32 w-full object-cover rounded-md border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeProductImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Color Variants Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Color Variants ({colorVariants.length}/10)</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addColorVariant}
                  disabled={colorVariants.length >= 10}
                >
                  <Plus size={16} className="mr-1" /> Add Color
                </Button>
              </div>
              
              {colorVariants.map((variant, variantIndex) => (
                <Card key={variantIndex} className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3 w-full">
                      <Input 
                        value={variant.name} 
                        onChange={(e) => updateColorVariant(variantIndex, 'name', e.target.value)}
                        placeholder="Color name (e.g., Red, Blue)"
                        className="w-full"
                      />
                      <input
                        type="color"
                        value={variant.hex}
                        onChange={(e) => updateColorVariant(variantIndex, 'hex', e.target.value)}
                        className="h-10 w-10 rounded border border-gray-300 cursor-pointer"
                      />
                      {colorVariants.length > 1 && (
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeColorVariant(variantIndex)}
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input 
                      type="file" 
                      id={`variant_${variantIndex}_images`} 
                      accept="image/*" 
                      multiple 
                      className="hidden" 
                      onChange={(e) => handleVariantImages(e, variantIndex)}
                      disabled={variant.images.length + (variant.existingImages?.length || 0) >= 10}
                    />
                    <label 
                      htmlFor={`variant_${variantIndex}_images`} 
                      className={`cursor-pointer block ${variant.images.length + (variant.existingImages?.length || 0) >= 10 ? 'opacity-50' : ''}`}
                    >
                      <div className="space-y-1">
                        <div className="mx-auto h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Image className="h-4 w-4 text-gray-600" />
                        </div>
                        <p className="text-xs text-gray-600">
                          <span className="font-semibold text-primary">Upload images</span> for this color ({variant.images.length + (variant.existingImages?.length || 0)}/10)
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {/* Variant Image Preview */}
                  {(variant.imagePreviewUrls.length > 0 || (variant.existingImages && variant.existingImages.length > 0)) && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3">
                      {/* Display existing variant images */}
                      {variant.existingImages?.map((url, imgIndex) => (
                        <div key={`existing-variant-${imgIndex}`} className="relative group">
                          <img 
                            src={url} 
                            alt={`${variant.name} existing preview ${imgIndex + 1}`}
                            className="h-20 w-full object-cover rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingVariantImage(variantIndex, imgIndex)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      
                      {/* Display new variant images */}
                      {variant.imagePreviewUrls.map((url, imgIndex) => (
                        <div key={`new-variant-${imgIndex}`} className="relative group">
                          <img 
                            src={url} 
                            alt={`${variant.name} preview ${imgIndex + 1}`}
                            className="h-20 w-full object-cover rounded-md border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeVariantImage(variantIndex, imgIndex)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/admin/manage-products')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  isEditMode ? 'Update Product' : 'Add Product'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductForm;
