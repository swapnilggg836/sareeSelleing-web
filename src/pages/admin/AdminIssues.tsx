
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";

const AdminIssues = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: issues, isLoading } = useQuery({
    queryKey: ['admin-issues'],
    queryFn: async () => {
      // This would be a real API call in production
      return [
        { id: 1, title: 'Payment Failed', description: 'Customer reported payment failure when checking out', customer: 'Rahul Sharma', date: '2023-05-17', status: 'Open', priority: 'High', category: 'Payments' },
        { id: 2, title: 'Wrong Product Delivered', description: 'Customer received different saree than ordered', customer: 'Priya Patel', date: '2023-05-16', status: 'In Progress', priority: 'Critical', category: 'Shipping' },
        { id: 3, title: 'Website Loading Slow', description: 'Multiple users reported slow loading times', customer: 'System', date: '2023-05-15', status: 'Open', priority: 'Medium', category: 'Technical' },
        { id: 4, title: 'Refund Request', description: 'Customer requesting refund for damaged product', customer: 'Anjali Gupta', date: '2023-05-14', status: 'Resolved', priority: 'High', category: 'Refunds' },
        { id: 5, title: 'Missing Order Tracking', description: 'Order shipped but tracking information not updated', customer: 'Vikram Singh', date: '2023-05-13', status: 'In Progress', priority: 'Medium', category: 'Shipping' },
      ];
    }
  });

  const filteredIssues = issues?.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Issues & Support</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="bg-yellow-50 dark:bg-yellow-900/10">
            <CardTitle className="flex items-center text-yellow-700 dark:text-yellow-400">
              <AlertCircle className="mr-2 h-5 w-5" />
              Open Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{issues?.filter(i => i.status === 'Open').length || 0}</div>
            <p className="text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-blue-50 dark:bg-blue-900/10">
            <CardTitle className="flex items-center text-blue-700 dark:text-blue-400">
              <MessageSquare className="mr-2 h-5 w-5" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{issues?.filter(i => i.status === 'In Progress').length || 0}</div>
            <p className="text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-900/10">
            <CardTitle className="flex items-center text-green-700 dark:text-green-400">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Resolved
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold">{issues?.filter(i => i.status === 'Resolved').length || 0}</div>
            <p className="text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>All Issues</CardTitle>
              <CardDescription>Manage and resolve customer support tickets</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
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
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues?.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell>#{issue.id}</TableCell>
                      <TableCell className="font-medium">{issue.title}</TableCell>
                      <TableCell>{issue.customer}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{issue.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          issue.priority === 'Critical' ? 'bg-red-100 text-red-800' : 
                          issue.priority === 'High' ? 'bg-orange-100 text-orange-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {issue.priority}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          issue.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 
                          issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {issue.status}
                        </span>
                      </TableCell>
                      <TableCell>{issue.date}</TableCell>
                      <TableCell className="text-right">
                        <Button>View Details</Button>
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

export default AdminIssues;
