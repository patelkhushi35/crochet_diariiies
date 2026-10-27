import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingBag, DollarSign, TrendingUp, Clock, Sparkles, MessageCircle, ArrowRight, Heart, Shield, Truck } from 'lucide-react';
import api from '../../utils/api';
import { clsx } from 'clsx';

const statCards = [
  { label: 'Total Customers', key: 'totalUsers', icon: Users, color: 'bg-blue-100 text-blue-600', path: '/admin/users' },
  { label: 'Products', key: 'totalProducts', icon: Package, color: 'bg-cream-100 text-cream-600', path: '/admin/products' },
  { label: 'Total Orders', key: 'totalOrders', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600', path: '/admin/orders' },
  { label: 'Revenue', key: 'totalRevenue', icon: DollarSign, color: 'bg-sage-100 text-sage-600', prefix: '₹', path: '/admin/orders' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.stats || {});
      setRecentOrders(res.data.recentOrders || []);
      setMonthlyRevenue(res.data.monthlyRevenue || []);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse p-6">
              <div className="h-4 bg-beige-200 rounded w-1/3 mb-2" />
              <div className="h-8 bg-beige-200 rounded w-1/2" />
            </div>
          ))}
        </div>
        <div className="card animate-pulse p-6">
          <div className="h-4 bg-beige-200 rounded w-1/4 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-beige-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-medium text-brown-900">Dashboard</h1>
          <p className="text-brown-600">Welcome back! Here's what's happening with your store.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(card => (
          <Link key={card.key} to={card.path} className="card p-6 hover:shadow-card-hover transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cream-500 text-sm font-medium">{card.label}</p>
                <p className="font-heading text-3xl font-bold text-brown-900 mt-1 group-hover:text-cream-600 transition-colors">
                  {card.prefix || ''}{formatCurrency(stats[card.key] || 0)}
                </p>
              </div>
              <div className={clsx('w-12 h-12 rounded-xl flex items-center justify-center', card.color)}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-beige-200 flex items-center justify-between text-sm text-cream-500">
              <span>View details</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="font-heading font-medium text-brown-900 mb-4 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-cream-500" />
            <span>Custom Orders</span>
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-cream-50 rounded-btn">
              <p className="font-heading text-2xl font-bold text-cream-600">{stats.newCustomOrders || 0}</p>
              <p className="text-cream-500 text-xs">New Requests</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-btn">
              <p className="font-heading text-2xl font-bold text-amber-600">{stats.pendingOrders || 0}</p>
              <p className="text-cream-500 text-xs">Pending Orders</p>
            </div>
            <div className="p-3 bg-cream-50 rounded-btn">
              <p className="font-heading text-2xl font-bold text-red-600">{stats.pendingReviews || 0}</p>
              <p className="text-cream-500 text-xs">Pending Reviews</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-heading font-medium text-brown-900 mb-4 flex items-center space-x-2">
            <Truck className="w-5 h-5 text-cream-500" />
            <span>Order Status Breakdown</span>
          </h3>
          <div className="space-y-3">
            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
              const config = {
                pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800' },
                confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
                processing: { label: 'Processing', color: 'bg-cream-100 text-cream-800' },
                shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
                delivered: { label: 'Delivered', color: 'bg-sage-100 text-sage-800' },
                cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
              }[status];
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-brown-700 text-sm">{config.label}</span>
                  <span className="font-medium text-brown-900">—</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-heading font-medium text-brown-900 mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-cream-500" />
            <span>Quick Actions</span>
          </h3>
          <div className="space-y-2">
            <Link to="/admin/products" className="btn-secondary w-full justify-start">Add New Product</Link>
            <Link to="/admin/orders" className="btn-secondary w-full justify-start">Manage Orders</Link>
            <Link to="/admin/custom-orders" className="btn-secondary w-full justify-start">Review Custom Orders</Link>
            <Link to="/admin/gallery" className="btn-secondary w-full justify-start">Update Gallery</Link>
          </div>
        </div>
      </div>

      {/* Recent Orders & Revenue Chart */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="p-6 border-b border-beige-200 flex items-center justify-between">
            <h2 className="font-heading text-lg font-medium text-brown-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-cream-600 hover:text-cream-700">View all</Link>
          </div>
          <div className="divide-y divide-beige-200">
            {recentOrders.length > 0 ? (
              recentOrders.map(order => (
                <Link key={order._id} to={`/admin/orders/${order._id}`} className="p-4 flex items-center justify-between hover:bg-cream-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-cream-500" />
                    </div>
                    <div>
                      <p className="font-medium text-brown-900">{order.orderNumber}</p>
                      <p className="text-cream-500 text-sm">{order.shippingAddress?.name} • {order.items?.length} items</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brown-900">₹{order.total}</p>
                    <p className="text-cream-500 text-xs capitalize">{order.orderStatus?.replace('_', ' ')}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-cream-500">No recent orders</div>
            )}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card p-6">
          <h2 className="font-heading text-lg font-medium text-brown-900 mb-6">Revenue Overview (Last 6 Months)</h2>
          <div className="h-64">
            {monthlyRevenue.length > 0 ? (
              <div className="h-full flex items-end justify-between space-x-2 px-2">
                {monthlyRevenue.map((month, index) => (
                  <div key={month._id} className="flex-1 flex flex-col items-center">
                    <div className={clsx(
                      'w-full rounded-t transition-all duration-300 bg-cream-500',
                      index === monthlyRevenue.length - 1 ? 'bg-cream-600' : ''
                    )} style={{ height: `${Math.max((month.revenue / Math.max(...monthlyRevenue.map(m => m.revenue), 1)) * 100, 4)}%` }} />
                    <span className="text-xs text-cream-500 mt-2">{month._id}</span>
                    <span className="text-xs font-medium text-brown-900">₹{formatCurrency(month.revenue)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-cream-500">No revenue data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}