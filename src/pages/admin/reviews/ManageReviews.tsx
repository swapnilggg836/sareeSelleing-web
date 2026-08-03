
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Star, Edit, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

const ManageReviews = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: reviewsResponse, isLoading, refetch } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/reviews/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.json();
    },
  });

  const reviews = reviewsResponse?.data || [];

  const filteredReviews = reviews.filter((review: any) =>
    review.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      toast.success('Review deleted successfully!');
      refetch();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review. Please try again.');
    }
  };

  const toggleApproval = async (reviewId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approved: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      toast.success(`Review ${!currentStatus ? 'approved' : 'unapproved'} successfully!`);
      refetch();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review. Please try again.');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Reviews</h2>
          <p className="text-muted-foreground">
            Manage and moderate customer reviews
          </p>
        </div>
        <Button onClick={() => navigate('/admin/reviews/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((review: any) => (
                    <TableRow key={review._id}>
                      <TableCell className="font-medium">
                        {review.productId?.name || 'Unknown Product'}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{review.title}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-xs">
                            {review.comment}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                          <span className="ml-1 text-sm">({review.rating})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {review.userId?.name || 'Unknown User'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Badge variant={review.approved ? "default" : "secondary"}>
                            {review.approved ? 'Approved' : 'Pending'}
                          </Badge>
                          {review.featured && (
                            <Badge variant="outline">Featured</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => toggleApproval(review._id, review.approved)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {review.approved ? 'Unapprove' : 'Approve'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(review._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm ? 'No reviews found matching your search.' : 'No reviews found.'}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageReviews;
