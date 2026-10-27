import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Truck, Loader2, MoreVertical, CheckCircle, XCircle, Clock, Package, Download } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-cream-100 text-cream-800', icon: Package },
  ready_to_ship: { label: 'Ready to Ship', color: 'bg-purple-100 text-purple-800', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-sage-100 text-sage-800', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const statusOrder = ['pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, search, statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 20 });
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get(`/admin/orders?${params.toString()}`);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getNextStatuses = (currentStatus) => {
    const currentIndex = statusOrder.indexOf(currentStatus);
    return statusOrder.slice(currentIndex + 1, currentIndex + 3); // Next 2 statuses
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-4 animate-pulse">
          <div className="h-4 bg-beige-200 rounded w-1/4" />
        </div>
        <div className="card animate-pulse p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-beige-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium text-brown-900">Orders</h1>
          <p className="text-brown-600">Manage and fulfill customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-400" />
            <input
              type="text"
              placeholder="Search order #, customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input appearance-none bg-white w-auto">
            <option value="">All Statuses</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cream-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-200">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-cream-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-brown-900">{order.orderNumber}</p>
                      <p className="text-cream-500 text-xs">{order.paymentMethod}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-brown-900">{order.user?.name || 'Guest'}</p>
                      <p className="text-cream-500 text-sm">{order.user?.email || order.shippingAddress?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-cream-600">{formatDate(order.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className="text-brown-700">{order.items?.length} item{order.items?.length > 1 ? 's' : ''}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-brown-900">₹{order.total}</td>
                    <td className="px-6 py-4">
                      <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', statusConfig[order.orderStatus]?.color)}>
                        {statusConfig[order.orderStatus]?.label || order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={updating}
                          className="input appearance-none bg-white w-auto text-sm py-1.5"
                        >
                          {getNextStatuses(order.orderStatus).map(status => (
                            <option key={status} value={status}>{statusConfig[status].label}</option>
                          ))}
                          {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                            <option value="cancelled" className="text-red-600">Cancel Order</option>
                          )}
                        </select>
                        <button className="p-2 text-cream-500 hover:text-cream-600 hover:bg-cream-100 rounded-lg" aria-label="View details">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-cream-300" />
            <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">No orders found</h3>
            <p className="text-brown-600">Try adjusting your filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-beige-200 flex items-center justify-between">
            <span className="text-sm text-cream-500">Page {currentPage} of {totalPages}</span>
            <div className="flex space-x-2">
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
          </div>
        )}
      </div>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';