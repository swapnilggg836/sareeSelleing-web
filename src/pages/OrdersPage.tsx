
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { ordersApi } from '@/api/apiClient';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const OrdersPage = () => {
  const { user } = useAuth();
  const [trackingForm, setTrackingForm] = useState({
    orderNumber: '',
    email: ''
  });
  const [trackingResult, setTrackingResult] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Fetch user orders if logged in
  const { data: userOrdersResponse, isLoading: userOrdersLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: ordersApi.getUserOrders,
    enabled: !!user,
  });

  const userOrders = userOrdersResponse?.data || [];

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingForm.orderNumber || !trackingForm.email) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsTracking(true);
    try {
      const response = await ordersApi.trackOrder(trackingForm.orderNumber, trackingForm.email);
      if (response.success) {
        setTrackingResult(response.data);
        toast.success('Order found!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Order not found');
      setTrackingResult(null);
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-crimson-700">Track Your Order</h1>
          
          {/* User Orders Section (if logged in) */}
          {user && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
                <CardDescription>View all your recent orders</CardDescription>
              </CardHeader>
              <CardContent>
                {userOrdersLoading ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : userOrders.length > 0 ? (
                  <div className="space-y-4">
                    {userOrders.map((order: any) => (
                      <div key={order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{order.orderNumber}</h3>
                            <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <strong>Items:</strong> {order.items?.length || 0}
                          </div>
                          <div>
                            <strong>Total:</strong> ₹{order.totalAmount?.toLocaleString()}
                          </div>
                          <div>
                            <strong>Payment:</strong> {order.paymentMethod?.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No orders found. Start shopping to place your first order!</p>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Order Tracking Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Track Order by Number</CardTitle>
              <CardDescription>Enter your order details to track your shipment</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrackOrder} className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="order-id">Order Number</Label>
                  <Input
                    id="order-id"
                    type="text"
                    value={trackingForm.orderNumber}
                    onChange={(e) => setTrackingForm(prev => ({ ...prev, orderNumber: e.target.value }))}
                    placeholder="Enter your Order Number (e.g., DWK1234567890)"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={trackingForm.email}
                    onChange={(e) => setTrackingForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter the email used for order"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isTracking}
                >
                  {isTracking ? 'Tracking...' : 'Track Order'}
                </Button>
              </form>

              {/* Tracking Result */}
              {trackingResult && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">Order Details</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Order Number:</span>
                      <span>{trackingResult.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <Badge className={getStatusColor(trackingResult.status)}>
                        {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Order Date:</span>
                      <span>{formatDate(trackingResult.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Amount:</span>
                      <span>₹{trackingResult.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Items:</span>
                      <span>{trackingResult.items?.length || 0} item(s)</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-3">Have questions about your order?</h3>
                <p className="text-gray-600 mb-4">
                  Our customer service team is here to assist you with any inquiries regarding your orders.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">Email:</span>
                  <a href="mailto:orders@dwarkadish.com" className="text-crimson-600 hover:underline">
                    orders@dwarkadish.com
                  </a>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-700 font-medium">Phone:</span>
                  <a href="tel:+918605887561" className="text-crimson-600 hover:underline">
                    +91 86058 87561
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Status Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-crimson-600">Order Placed</h3>
                  <p className="text-gray-600">
                    We have received your order and are processing it.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-crimson-600">Processing</h3>
                  <p className="text-gray-600">
                    Your order is being prepared for shipping.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-crimson-600">Shipped</h3>
                  <p className="text-gray-600">
                    Your order has been shipped and is on its way to you.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-crimson-600">Delivered</h3>
                  <p className="text-gray-600">
                    Your order has been delivered to the specified address.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
