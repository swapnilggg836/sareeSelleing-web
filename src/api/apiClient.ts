// API Client for communicating with the MongoDB backend

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Generic function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Conditionally set default headers
  let defaultHeaders: HeadersInit = {};

  // Only set Content-Type to JSON if body is not FormData
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Add auth token from localStorage if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      mode: 'cors',
      credentials: 'include',
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      let errorMessage = `Request failed with status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Auth API functions
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      // Save auth token and user data in localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      if (response.user) {
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      console.log('Registration response:', response);
      
      // Save auth token and user data in localStorage
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
      }
      if (response.user) {
        localStorage.setItem('user_data', JSON.stringify(response.user));
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    return true;
  },
  
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
  
  updateProfile: async (profileData: any) => {
    // Handle file upload if needed
    if (profileData instanceof FormData) {
      return apiRequest('/auth/profile', {
        method: 'PUT',
        headers: {}, // Let the browser set the content type for FormData
        body: profileData,
      });
    }
    
    // Handle JSON data
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Cart API functions
export const cartApi = {
  getCart: async () => {
    return apiRequest('/cart');
  },
  
  addToCart: async (productId: string, quantity: number, color?: string) => {
    // Use the correct endpoint '/cart/add'
    return apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, color }),
    });
  },
  
  updateCartItem: async (itemId: string, quantity: number) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },
  
  removeCartItem: async (itemId: string) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },
  
  clearCart: async () => {
    return apiRequest('/cart/clear', {
      method: 'DELETE',
    });
  },
};

// Orders API functions
export const ordersApi = {
  createOrder: async (orderData: any) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  getUserOrders: async () => {
    return apiRequest('/orders/user');
  },
  
  getOrderById: async (orderId: string) => {
    return apiRequest(`/orders/${orderId}`);
  },
  
  trackOrder: async (orderNumber: string, email: string) => {
    return apiRequest('/orders/track', {
      method: 'POST',
      body: JSON.stringify({ orderNumber, email }),
    });
  },
  
  getAllOrders: async () => {
    return apiRequest('/orders/admin/all');
  },
  
  updateOrderStatus: async (orderId: string, status: string) => {
    return apiRequest(`/orders/admin/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// Blog API functions
export const blogApi = {
  getAllPosts: async () => {
    return apiRequest('/blog');
  },
  
  getPostById: async (id: string) => {
    return apiRequest(`/blog/${id}`);
  },
  
  createPost: async (postData: any) => {
    return apiRequest('/blog', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },
  
  updatePost: async (id: string, postData: any) => {
    return apiRequest(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  },
  
  deletePost: async (id: string) => {
    return apiRequest(`/blog/${id}`, {
      method: 'DELETE',
    });
  },
};

// Products API functions
export const productsApi = {
  getAllProducts: async () => {
    return apiRequest('/products');
  },
  
  getProductById: async (id: string) => {
    return apiRequest(`/products/${id}`);
  },
  
  getProductsByCategory: async (category: string) => {
    return apiRequest(`/products/category/${category}`);
  },
  
  createProduct: async (productData: FormData) => {
    return apiRequest('/products', {
      method: 'POST',
      headers: {}, // Let browser set content type for FormData
      body: productData,
    });
  },
  
  updateProduct: async (id: string, productData: FormData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      headers: {}, // Let browser set content type for FormData
      body: productData,
    });
  },
  
  deleteProduct: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },
  
  getFeaturedProducts: async () => {
    return apiRequest('/products/featured');
  },

  getTrendingProducts: async () => {
    return apiRequest('/products/trending');
  },

  getNewArrivals: async () => {
    return apiRequest('/products/new-arrivals');
  },
};

// Collections API functions
export const collectionsApi = {
  getAllCollections: async () => {
    return apiRequest('/collections');
  },
  
  getCollectionById: async (id: string) => {
    return apiRequest(`/collections/${id}`);
  },
  
  createCollection: async (collectionData: FormData) => {
    return apiRequest('/collections', {
      method: 'POST',
      headers: {}, // Let browser set content type for FormData
      body: collectionData,
    });
  },
  
  updateCollection: async (id: string, collectionData: FormData) => {
    return apiRequest(`/collections/${id}`, {
      method: 'PUT',
      headers: {}, // Let browser set content type for FormData
      body: collectionData,
    });
  },
  
  deleteCollection: async (id: string) => {
    return apiRequest(`/collections/${id}`, {
      method: 'DELETE',
    });
  },
};

// Banners API functions
export const bannersApi = {
  getAllBanners: async () => {
    return apiRequest('/banners');
  },
  
  getBannerById: async (id: string) => {
    return apiRequest(`/banners/${id}`);
  },
  
  createBanner: async (bannerData: FormData) => {
    return apiRequest('/banners', {
      method: 'POST',
      headers: {},
      body: bannerData,
    });
  },
  
  updateBanner: async (id: string, bannerData: FormData) => {
    return apiRequest(`/banners/${id}`, {
      method: 'PUT',
      headers: {},
      body: bannerData,
    });
  },
  
  deleteBanner: async (id: string) => {
    return apiRequest(`/banners/${id}`, {
      method: 'DELETE',
    });
  },
};

// Categories API functions
export const categoriesApi = {
  getAllCategories: async () => {
    return apiRequest('/categories');
  },
  
  getCategoryById: async (id: string) => {
    return apiRequest(`/categories/${id}`);
  },
  
  createCategory: async (categoryData: any) => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },
  
  updateCategory: async (id: string, categoryData: any) => {
    return apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },
  
  deleteCategory: async (id: string) => {
    return apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API functions
export const usersApi = {
  getAllUsers: async () => {
    return apiRequest('/users');
  },
  
  getUserById: async (id: string) => {
    return apiRequest(`/users/${id}`);
  },
  
  updateUser: async (id: string, userData: any) => {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  deleteUser: async (id: string) => {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
  
  getUserStats: async () => {
    return apiRequest('/users/stats');
  },
};

// Wishlist API functions
export const wishlistApi = {
  getWishlist: async () => {
    return apiRequest('/wishlist');
  },
  
  addToWishlist: async (productId: string) => {
    return apiRequest('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  },
  
  removeFromWishlist: async (productId: string) => {
    return apiRequest(`/wishlist/${productId}`, {
      method: 'DELETE',
    });
  },
  
  clearWishlist: async () => {
    return apiRequest('/wishlist', {
      method: 'DELETE',
    });
  },
};

// Dashboard statistics API
export const dashboardApi = {
  getSummaryStats: async () => {
    return apiRequest('/admin/dashboard/summary');
  },
  
  getSalesData: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly') => {
    return apiRequest(`/admin/dashboard/sales?period=${period}`);
  },

  getProductStats: async () => {
    return apiRequest('/admin/dashboard/products');
  },

  getCustomerStats: async () => {
    return apiRequest('/admin/dashboard/customers');
  },

  getRecentOrders: async (limit: number = 5) => {
    return apiRequest(`/admin/dashboard/recent-orders?limit=${limit}`);
  },

  getDataCounts: async () => {
    return apiRequest('/admin/dashboard/counts');
  },

  exportData: async (type: string) => {
    return apiRequest(`/admin/dashboard/export/${type}`);
  },
};

// Contact form API function
export const contactApi = {
  submitContactForm: async (formData: any) => {
    console.log('Submitting contact form data:', formData);
    try {
      const response = await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      console.log('Contact form submission response:', response);
      return response;
    } catch (error) {
      console.error('Contact form submission error:', error);
      throw error;
    }
  },
  
  getAllContacts: async () => {
    return apiRequest('/contact');
  }
};

// Newsletter API functions
export const newsletterApi = {
  subscribe: async (email: string) => {
    try {
      const response = await apiRequest('/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      throw error;
    }
  },
  
  getAllSubscribers: async () => {
    return apiRequest('/newsletter');
  },
  
  deleteSubscriber: async (id: string) => {
    return apiRequest(`/newsletter/${id}`, {
      method: 'DELETE',
    });
  }
};
