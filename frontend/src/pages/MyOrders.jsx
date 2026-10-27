import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle, Loader2, ChevronRight, Eye, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { clsx } from 'clsx';

const statusConfig = {
  pending: { label: 'Order Placed', color: 'bg-amber-100 text-amber-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  processing: { label: 'Handmade in Progress', color: 'bg-cream-100 text-cream-800', icon: Package },
  ready_to_ship: { label: 'Ready to Ship', color: 'bg-purple-100 text-purple-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-sage-100 text-sage-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const statusOrder = ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered'];

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [currentPage, filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 10 });
      if (filter) params.set('status', filter);
      const res = await api.get(`/orders/my-orders?${params.toString()}`);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusProgress = (currentStatus) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder.map((status, index) => ({
      ...statusConfig[status],
      id: status,
      completed: index < currentIndex,
      current: index === currentIndex,
      upcoming: index > currentIndex,
    }));
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-medium text-brown-900">My Orders</h1>
              <p className="text-brown-600">Track and manage your handmade orders</p>
            </div>
            <Link to="/shop" className="btn-outline">
              Continue Shopping
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setFilter('')} className={clsx('px-4 py-2 rounded-btn text-sm font-medium transition-colors', !filter ? 'bg-cream-500 text-white' : 'bg-white text-brown-700 hover:bg-cream-50 border border-beige-200')}>All</button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <button key={key} onClick={() => setFilter(key)} className={clsx('px-4 py-2 rounded-btn text-sm font-medium transition-colors', filter === key ? `${config.color}` : 'bg-white text-brown-700 hover:bg-cream-50 border border-beige-200')}>
                {config.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card animate-pulse p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-lg bg-beige-200" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-beige-200 rounded w-1/3" />
                      <div className="h-3 bg-beige-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(order => {
                const progress = getStatusProgress(order.orderStatus);
                const currentStatus = statusConfig[order.orderStatus] || statusConfig.pending;
                
                return (
                  <Link key={order._id} to={`/order-confirmation/${order.orderNumber}`} className="card p-6 hover:shadow-card-hover transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      {/* Order Info */}
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="w-16 h-16 rounded-lg bg-cream-100 flex items-center justify-center flex-shrink-0">
                          <currentStatus.icon className="w-8 h-8" style={{ color: currentStatus.color.replace('bg-', '').replace('-100', '-600').replace('-800', '-600') }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-3 flex-wrap">
                            <span className="font-heading font-medium text-brown-900">{order.orderNumber}</span>
                            <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', currentStatus.color)}>{currentStatus.label}</span>
                          </div>
                          <p className="text-cream-500 text-sm mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-cream-500 text-sm">{order.items.length} item{order.items.length > 1 ? 's' : ''} • ₹{order.total}</p>
                        </div>
                      </div>

                      {/* Timeline Preview */}
                      <div className="hidden lg:flex items-center space-x-1 lg:space-x-4 flex-1 justify-end">
                        {progress.map((step, index) => (
                          <div key={step.id} className="flex flex-col items-center">
                            <div className={clsx(
                              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                              step.completed ? 'bg-cream-500 text-white' :
                              step.current ? 'bg-cream-500 text-white ring-2 ring-cream-500/50' :
                              'bg-beige-200 text-cream-400'
                            )}>
                              {step.completed ? <CheckCircle className="w-4 h-4" /> : step.icon}
                            </div>
                            <span className={clsx('text-xs mt-1 text-center w-24', step.completed || step.current ? 'text-brown-700' : 'text-cream-500')}>
                              {step.label.split(' ').slice(0, 2).join(' ')}
                            </span>
                            {index < progress.length - 1 && (
                              <div className={clsx('w-12 h-0.5 mt-2', step.completed ? 'bg-cream-500' : 'bg-beige-200')} />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-3 lg:ml-8">
                        <button className="p-2 text-cream-500 hover:text-cream-600 hover:bg-cream-100 rounded-lg transition-colors" aria-label="View details">
                          <Eye className="w-5 h-5" />
                        </button>
                        {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                          <button className="p-2 text-cream-500 hover:text-cream-600 hover:bg-cream-100 rounded-lg transition-colors" aria-label="Download invoice">
                            <Download className="w-5 h-5" />
                          </button>
                        )}
                        <ChevronRight className="w-5 h-5 text-cream-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-8">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary w-10 h-10"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={clsx('w-10 h-10 rounded-btn font-medium', currentPage === pageNum ? 'bg-brown-900 text-white' : 'bg-white text-brown-700 hover:bg-cream-100 border border-beige-200')}>{pageNum}</button>;
                  })}
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary w-10 h-10"><ChevronRight className="w-5 h-5" /></button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package className="w-20 h-20 mx-auto mb-4 text-cream-300" />
              <h3 className="font-heading text-xl text-brown-900 mb-2">{filter ? 'No orders found' : 'No orders yet'}</h3>
              <p className="text-brown-600 mb-6">{filter ? 'Try a different filter' : 'Your handmade goodies will appear here'}</p>
              <Link to="/shop" className="btn-primary">Start Shopping</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}