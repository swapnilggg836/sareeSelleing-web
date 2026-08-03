
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye, Power } from "lucide-react";
import { toast } from 'sonner';
import { bannersApi } from '@/api/apiClient';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  position: 'hero' | 'secondary' | 'footer';
  active: boolean;
  image: string;
  createdAt: string;
}

const ManageBanners = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch banners from database
  const { data: bannersResponse, isLoading, error } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: bannersApi.getAllBanners,
  });

  const banners = bannersResponse?.data || [];

  // Delete banner mutation
  const deleteBannerMutation = useMutation({
    mutationFn: bannersApi.deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      toast.success('Banner deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete banner');
    },
  });

  // Toggle banner status mutation
  const toggleBannerMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const formData = new FormData();
      formData.append('active', (!active).toString());
      return bannersApi.updateBanner(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] });
      toast.success('Banner status updated');
    },
    onError: () => {
      toast.error('Failed to update banner status');
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      deleteBannerMutation.mutate(id);
    }
  };

  const toggleActive = (id: string, active: boolean) => {
    toggleBannerMutation.mutate({ id, active });
  };

  const filteredBanners = banners.filter((banner: Banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPositionBadge = (position: string) => {
    switch (position) {
      case 'hero':
        return <Badge>Hero</Badge>;
      case 'secondary':
        return <Badge variant="secondary">Secondary</Badge>;
      case 'footer':
        return <Badge variant="outline">Footer</Badge>;
      default:
        return <Badge variant="outline">{position}</Badge>;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              Error loading banners. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Banners</h2>
          <p className="text-muted-foreground">
            Create and manage promotional banners for your website
          </p>
        </div>
        <Button onClick={() => navigate('/admin/banners/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Banners List</CardTitle>
              <CardDescription>Manage your promotional banners</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search banners..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-crimson-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Subtitle</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBanners.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No banners found
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredBanners.map((banner: Banner) => (
                    <TableRow key={banner._id}>
                      <TableCell>
                        <img
                          src={banner.image ? `http://localhost:5000${banner.image}` : '/placeholder.svg'}
                          alt={banner.title}
                          className="w-16 h-10 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell>{banner.subtitle || '-'}</TableCell>
                      <TableCell>{getPositionBadge(banner.position)}</TableCell>
                      <TableCell>
                        {banner.active ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>{new Date(banner.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => toggleActive(banner._id, banner.active)}
                            disabled={toggleBannerMutation.isPending}
                          >
                            <Power className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => navigate(`/admin/banners/edit/${banner._id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(banner._id)}
                            disabled={deleteBannerMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
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

export default ManageBanners;
