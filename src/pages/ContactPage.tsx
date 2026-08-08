
import { useEffect, useState } from "react";
import { contactApi } from "@/api/apiClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
}

const ContactPage = () => {
  const { toast } = useToast();
  const [contactOpen, setContactOpen] = useState(false);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactSubmissions = async () => {
      try {
        setLoading(true);
        const response = await contactApi.getAllContacts();
        setSubmissions(response.data);
      } catch (error) {
        console.error("Failed to fetch contact submissions:", error);
        toast({
          title: "Error",
          description: "Failed to load contact submissions.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContactSubmissions();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <Button 
            onClick={() => setContactOpen(true)}
            className="bg-crimson-600 hover:bg-crimson-700"
          >
            <Send className="mr-2 h-4 w-4" />
            Send Us a Message
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>We're here to help and answer any questions you might have.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Address</h3>
                  <p className="text-muted-foreground">At Post Dhulgaon, Yeola, Nashik, Maharashtra - 423401</p>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">swapnilg836@gmail.com</p>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">+91 86058 87561</p>
                </div>
                <div>
                  <h3 className="font-medium">Hours</h3>
                  <p className="text-muted-foreground">Monday - Saturday: 10:00 AM - 7:00 PM</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Find Us</CardTitle>
              <CardDescription>Visit our store location in Dhulgaon (423401)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  title="Dwarkadish Paithani Store Location Map"
                  src="https://maps.google.com/maps?q=Dhulgaon,+Yeola,+Nashik,+Maharashtra+423401&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
      <ContactDialog open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
};

export default ContactPage;
