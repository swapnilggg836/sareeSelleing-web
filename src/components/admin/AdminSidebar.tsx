
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Database,
  Users,
  Contact,
  ShoppingCart,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Mail,
  Bell
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Post Data', icon: FileText, path: '/admin/post-data' },
    { name: 'Manage Data', icon: Database, path: '/admin/manage-data' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Contacts', icon: Contact, path: '/admin/contacts' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Newsletter', icon: Mail, path: '/admin/newsletter' },
    { name: 'Notifications', icon: Bell, path: '/admin/notifications' },
    { name: 'Issues', icon: AlertTriangle, path: '/admin/issues' },
  ];

  return (
    <aside
      className={cn(
        'flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        'fixed md:relative z-30 h-full',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
            Admin Panel
          </h1>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto py-4">
        <nav className="flex-1 px-2 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                  collapsed ? 'justify-center' : 'space-x-3'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700",
            collapsed ? "justify-center px-2" : "justify-start px-2 space-x-3"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Log out</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
