
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdminPrivacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminPrivacyDialog = ({ open, onOpenChange }: AdminPrivacyDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Admin Privacy Policy & Settings</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-3">Data Protection</h3>
              <p className="text-sm text-muted-foreground mb-2">
                As an administrator, you have access to sensitive user data and system information. 
                Please ensure you follow these guidelines:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Never share login credentials with unauthorized personnel</li>
                <li>Always log out when leaving your workstation</li>
                <li>Report any suspicious activity immediately</li>
                <li>Handle customer data with utmost care and confidentiality</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Access Controls</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your administrator privileges include:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Managing user accounts and permissions</li>
                <li>Accessing and modifying product catalogs</li>
                <li>Processing and managing orders</li>
                <li>Viewing analytics and reports</li>
                <li>Managing website content and collections</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Security Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Use strong, unique passwords</li>
                <li>Enable two-factor authentication when available</li>
                <li>Keep your browser and system updated</li>
                <li>Be cautious of phishing attempts</li>
                <li>Regular backup of important data</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Compliance</h3>
              <p className="text-sm text-muted-foreground">
                This admin panel complies with industry standards for data protection and privacy. 
                All activities are logged for security and audit purposes. By using this system, 
                you agree to follow company policies and applicable data protection regulations.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPrivacyDialog;
