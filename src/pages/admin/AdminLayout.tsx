
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AdminThemeProvider } from '@/contexts/AdminThemeContext';
import { toast } from 'sonner';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      toast.error('This area is restricted to shop administrators only');
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not admin, don't render anything
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <AdminThemeProvider>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <AdminSidebar />
        </div>
        
        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Mobile header with hamburger menu */}
          <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
            <div className="w-10"></div> {/* Spacer for centering */}
          </div>
          
          {/* Desktop header */}
          <div className="hidden lg:block">
            <AdminHeader />
          </div>
          
          {/* Main content area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="max-w-full">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AdminThemeProvider>
  );
};

export default AdminLayout;
