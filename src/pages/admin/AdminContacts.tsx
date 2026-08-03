
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Trash2, Mail, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { contactApi } from "@/api/apiClient";
import { format } from "date-fns";
import { toast } from "sonner";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  read?: boolean;
}

const AdminContacts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactMessage | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['admin-contacts'],
    queryFn: async () => {
      const response = await contactApi.getAllContacts();
      return response.data as ContactMessage[];
    }
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      // This would be implemented in your API
      // return contactApi.deleteContact(id);
      // For now, we'll just return a success response
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast.success('Contact message deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete contact message');
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      // This would be implemented in your API
      // return contactApi.markAsRead(id);
      // For now, we'll just return a success response
      return Promise.resolve({ success: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      toast.success('Message marked as read');
    },
    onError: () => {
      toast.error('Failed to update message status');
    }
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteContactMutation.mutate(id);
    }
  };

  const handleViewMessage = (contact: ContactMessage) => {
    setSelectedContact(contact);
    setIsContactDialogOpen(true);
    
    // If message is unread, mark it as read
    if (!contact.read) {
      markAsReadMutation.mutate(contact._id);
    }
  };

  const filteredContacts = contacts?.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Contact Messages</h2>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Customer Inquiries</CardTitle>
              <CardDescription>Manage and respond to customer messages</CardDescription>
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No contact messages found
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredContacts?.map((contact) => (
                    <TableRow key={contact._id} className={!contact.read ? "bg-blue-50 dark:bg-blue-900/10" : ""}>
                      <TableCell>{contact.name}</TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.subject}</TableCell>
                      <TableCell>{format(new Date(contact.createdAt), 'PPP')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          contact.read ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {contact.read ? 'Read' : 'Unread'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleViewMessage(contact)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDelete(contact._id)}
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

      {/* Contact Message Dialog */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
            <DialogDescription>
              Message from {selectedContact?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">From</p>
                <p className="font-medium">{selectedContact?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date</p>
                <p>{selectedContact ? format(new Date(selectedContact.createdAt), 'PPP') : ''}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{selectedContact?.email}</p>
              </div>
              {selectedContact?.phone && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p>{selectedContact.phone}</p>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subject</p>
              <p className="font-medium">{selectedContact?.subject}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Message</p>
              <div className="mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="whitespace-pre-line">{selectedContact?.message}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsContactDialogOpen(false)}
              >
                Close
              </Button>
              <Button asChild>
                <a href={`mailto:${selectedContact?.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Reply via Email
                </a>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContacts;
