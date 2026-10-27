import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Loader2, ChevronRight, Eye, Edit, X, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { clsx } from 'clsx';

const statusConfig = {
  new: { label: 'New Request', color: 'bg-blue-100 text-blue-800', icon: MessageCircle },
  discussing: { label: 'Discussing', color: 'bg-amber-100 text-amber-800', icon: MessageCircle },
  quoted: { label: 'Quoted', color: 'bg-purple-100 text-purple-800', icon: Sparkles },
  approved: { label: 'Approved', color: 'bg-sage-100 text-sage-800', icon: Heart },
  in_production: { label: 'In Production', color: 'bg-cream-100 text-cream-800', icon: Sparkles },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: Heart },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: X },
};

export default function MyCustomOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/custom-orders/my-requests?page=${currentPage}&limit=10`);
      setOrders(res.data.customOrders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch custom orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="section">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl font-medium text-brown-900">My Custom Orders</h1>
              <p className="text-brown-600">Track your bespoke creations from idea to reality</p>
            </div>
            <Link to="/custom-orders" className="btn-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Create New Request
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
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
                const status = statusConfig[order.status] || statusConfig.new;
                return (
                  <Link key={order._id} to={`/my-custom-orders/${order._id}`} className="card p-6 hover:shadow-card-hover transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="w-16 h-16 rounded-lg bg-cream-100 flex items-center justify-center flex-shrink-0">
                          <status.icon className="w-8 h-8" style={{ color: status.color.replace('bg-', '').replace('-100', '-600').replace('-800', '-600') }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-3 flex-wrap">
                            <span className="font-heading font-medium text-brown-900">Request #{order._id?.slice(-8).toUpperCase()}</span>
                            <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', status.color)}>{status.label}</span>
                          </div>
                          <p className="text-cream-500 text-sm mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                          <p className="text-cream-500 text-sm truncate">{order.productType} • {order.preferredColors?.join(', ') || 'No colors specified'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 lg:ml-8">
                        {order.quotation?.amount && (
                          <span className="font-bold text-cream-600">Quoted: ₹{order.quotation.amount}</span>
                        )}
                        <ChevronRight className="w-5 h-5 text-cream-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}

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
              <Sparkles className="w-20 h-20 mx-auto mb-4 text-cream-300" />
              <h3 className="font-heading text-xl text-brown-900 mb-2">No custom orders yet</h3>
              <p className="text-brown-600 mb-6">Start your bespoke journey today</p>
              <Link to="/custom-orders" className="btn-primary">
                <Sparkles className="w-4 h-4 mr-2" />
                Create Custom Order
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}