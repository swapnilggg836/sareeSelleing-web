
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// API functions
const fetchDashboardSummary = async () => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/summary`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }
  
  const result = await response.json();
  return result.data;
};

const fetchSalesData = async (period: string) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/sales?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch sales data');
  }
  
  const result = await response.json();
  return result.data;
};

const fetchProductStats = async () => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch product stats');
  }
  
  const result = await response.json();
  return result.data;
};

const fetchCategoriesData = async () => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/categories`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories data');
  }
  
  const result = await response.json();
  return result.data;
};

const fetchRecentOrders = async (limit: number = 5) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/orders?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch recent orders');
  }
  
  const result = await response.json();
  return result.data;
};

const AdminDashboard = () => {
  const [periodFilter, setPeriodFilter] = useState('monthly');
  
  // API queries
  const { data: summaryStats, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
  });

  const { data: salesData, isLoading: isLoadingSales } = useQuery({
    queryKey: ['dashboard-sales', periodFilter],
    queryFn: () => fetchSalesData(periodFilter),
  });

  const { data: productStats, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['dashboard-products'],
    queryFn: fetchProductStats,
  });

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['dashboard-categories'],
    queryFn: fetchCategoriesData,
  });

  const { data: recentOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['dashboard-recent-orders'],
    queryFn: () => fetchRecentOrders(5),
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d084d0'];

  const formatSalesDate = (date: string) => {
    if (periodFilter === 'daily') {
      return format(new Date(date), 'dd MMM');
    }
    if (periodFilter === 'weekly') {
      return `Week ${date.split('-')[1]}`;
    }
    if (periodFilter === 'monthly') {
      try {
        const [year, month] = date.split('-');
        return format(new Date(parseInt(year), parseInt(month) - 1), 'MMM yy');
      } catch (e) {
        return date;
      }
    }
    return date;
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingSummary ? '...' : summaryStats?.totalSales || 0}</div>
            <p className="text-xs text-muted-foreground">total orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingSummary ? '...' : formatCurrency(summaryStats?.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">total revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingSummary ? '...' : summaryStats?.totalCustomers || 0}</div>
            <p className="text-xs text-muted-foreground">registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoadingSummary ? '...' : summaryStats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">products in inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Overview</CardTitle>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            Overview of sales performance over time
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {isLoadingSales ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData?.sales || []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatSalesDate} 
                />
                <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} 
                  labelFormatter={formatSalesDate}
                />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Revenue" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Products with the highest sales</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : productStats && productStats.length > 0 ? (
              <div className="space-y-8">
                {productStats.slice(0, 5).map((product: any, i: number) => (
                  <div key={i} className="flex items-center">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sold} sold &bull; {formatCurrency(product.revenue || 0)}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {product.stock < 10 ? (
                        <span className="text-red-500">{product.stock} left</span>
                      ) : (
                        <span>{product.stock} in stock</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                No product sales data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Distribution of products by category</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingCategories ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : categoriesData && categoriesData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoriesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoriesData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Products']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : recentOrders && recentOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order: any) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{format(new Date(order.date), 'PP')}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(order.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              No recent orders available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
