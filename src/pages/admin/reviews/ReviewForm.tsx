
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const reviewSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  customerName: z.string().min(1, 'Customer name is required'),
  customerLocation: z.string().min(1, 'Customer city is required'),
  title: z.string().min(1, 'Review title is required'),
  comment: z.string().min(1, 'Review description is required'),
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating cannot exceed 5'),
  approved: z.boolean().default(false),
  featured: z.boolean().default(false),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const ReviewForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      approved: false,
      featured: false,
      rating: 0
    }
  });

  const approved = watch('approved');
  const featured = watch('featured');

  // Fetch products for dropdown
  const { data: productsResponse } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.json();
    },
  });

  const products = productsResponse?.data || [];

  // Fetch existing review data if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchReview();
    }
  }, [id, isEditing]);

  const fetchReview = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/reviews/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        const reviewData = result.data;
        
        reset({
          productId: reviewData.productId._id,
          customerName: reviewData.customerName,
          customerLocation: reviewData.customerLocation,
          title: reviewData.title,
          comment: reviewData.comment,
          rating: reviewData.rating,
          approved: reviewData.approved,
          featured: reviewData.featured,
        });

        setSelectedRating(reviewData.rating);
      } else {
        toast.error('Failed to fetch review');
      }
    } catch (error) {
      console.error('Error fetching review:', error);
      toast.error('Failed to fetch review');
    }
  };

  const onSubmit = async (data: ReviewFormData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const url = isEditing 
        ? `/api/reviews/${id}` 
        : '/api/reviews';
      
      const method = isEditing ? 'PUT' : 'POST';

      console.log('Submitting review data:', data);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Review saved successfully:', result);
        toast.success(isEditing ? 'Review updated successfully!' : 'Review created successfully!');
        navigate('/admin/reviews');
      } else {
        const errorData = await response.json();
        console.error('Failed to save review:', errorData);
        toast.error(errorData.error || 'Failed to save review');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starNumber = i + 1;
      return (
        <Star
          key={i}
          className={`h-8 w-8 cursor-pointer transition-colors ${
            starNumber <= selectedRating 
              ? 'fill-yellow-400 text-yellow-400' 
              : 'text-gray-300 hover:text-yellow-300'
          }`}
          onClick={() => handleStarClick(starNumber)}
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/admin/reviews')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Review' : 'Add New Review'}
          </h2>
          <p className="text-muted-foreground">
            {isEditing ? 'Update review details' : 'Create a new customer review'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
          <CardDescription>
            Enter the customer review information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  {...register('customerName')}
                  placeholder="Enter customer name"
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500">{errors.customerName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerLocation">Customer City</Label>
                <Input
                  id="customerLocation"
                  {...register('customerLocation')}
                  placeholder="Enter customer city"
                />
                {errors.customerLocation && (
                  <p className="text-sm text-red-500">{errors.customerLocation.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productId">Product</Label>
              <Select onValueChange={(value) => setValue('productId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product: any) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.productId && (
                <p className="text-sm text-red-500">{errors.productId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Review Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter review title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Review Description</Label>
              <Textarea
                id="comment"
                {...register('comment')}
                placeholder="Enter detailed review description..."
                rows={4}
              />
              {errors.comment && (
                <p className="text-sm text-red-500">{errors.comment.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Rating (5 Stars)</Label>
              <div className="flex items-center gap-1">
                {renderStars()}
                <span className="ml-2 text-sm text-muted-foreground">
                  {selectedRating > 0 ? `${selectedRating} star${selectedRating > 1 ? 's' : ''}` : 'Click to rate'}
                </span>
              </div>
              {errors.rating && (
                <p className="text-sm text-red-500">{errors.rating.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="approved">Approve Review</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="approved"
                    checked={approved}
                    onCheckedChange={(checked) => setValue('approved', checked)}
                  />
                  <Label htmlFor="approved" className="text-sm text-muted-foreground">
                    Make this review visible to customers
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="featured">Featured Review</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={featured}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured" className="text-sm text-muted-foreground">
                    Display this review prominently
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (isEditing ? 'Update Review' : 'Create Review')}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/admin/reviews')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewForm;
