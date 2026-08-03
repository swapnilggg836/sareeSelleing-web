
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Trash2, DownloadCloud } from "lucide-react";
import { newsletterApi } from '@/api/apiClient';
import { toast } from "sonner";
import { format } from 'date-fns';

interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

const AdminNewsletter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  
  const { data: subscribers, isLoading } = useQuery({
    queryKey: ['newsletter-subscribers'],
    queryFn: async () => {
      const response = await newsletterApi.getAllSubscribers();
      return response.data as Subscriber[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return newsletterApi.deleteSubscriber(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsletter-subscribers'] });
      toast.success('Subscriber removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove subscriber');
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this subscriber?')) {
      deleteMutation.mutate(id);
    }
  };

  const exportSubscribers = () => {
    if (!subscribers || subscribers.length === 0) {
      toast.error('No subscribers to export');
      return;
    }

    const csvContent = [
      'Email,Date Subscribed',
      ...subscribers.map(sub => 
        `${sub.email},"${new Date(sub.createdAt).toLocaleDateString()}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubscribers = subscribers?.filter(
    (subscriber) => subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h2>
        <Button onClick={exportSubscribers}>
          <DownloadCloud className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Subscribers List</CardTitle>
              <CardDescription>Manage newsletter subscribers</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search emails..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Subscription Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No subscribers found
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredSubscribers?.map((subscriber) => (
                    <TableRow key={subscriber._id}>
                      <TableCell className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        {format(new Date(subscriber.createdAt), 'PPP')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDelete(subscriber._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

export default AdminNewsletter;
