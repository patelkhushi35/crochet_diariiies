import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CustomOrders from './pages/CustomOrders';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Login from './pages/Login';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import MyCustomOrders from './pages/MyCustomOrders';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomOrders from './pages/admin/AdminCustomOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminGallery from './pages/admin/AdminGallery';
import AdminReviews from './pages/admin/AdminReviews';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1E293B',
                  color: '#FDF2F8',
                  borderRadius: '12px',
                  padding: '16px',
                },
                success: {
                  iconTheme: {
                    primary: '#22C55E',
                    secondary: '#FDF2F8',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FDF2F8',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="shop" element={<Shop />} />
                <Route path="product/:slug" element={<ProductDetail />} />
                <Route path="custom-orders" element={<CustomOrders />} />
                <Route path="about" element={<About />} />
                <Route path="gallery" element={<Gallery />} />
                <Route path="contact" element={<Contact />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Login />} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
                <Route path="my-custom-orders" element={<ProtectedRoute><MyCustomOrders /></ProtectedRoute>} />
              </Route>
              
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="custom-orders" element={<AdminCustomOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="gallery" element={<AdminGallery />} />
                <Route path="reviews" element={<AdminReviews />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;