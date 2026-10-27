import { useState, useEffect } from 'react';
import { Search, Edit, MessageCircle, Loader2, Heart, Sparkles, X, Check, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const statusConfig = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-800', icon: MessageCircle },
  discussing: { label: 'Discussing', color: 'bg-amber-100 text-amber-800', icon: MessageCircle },
  quoted: { label: 'Quoted', color: 'bg-purple-100 text-purple-800', icon: Sparkles },
  approved: { label: 'Approved', color: 'bg-sage-100 text-sage-800', icon: Heart },
  in_production: { label: 'In Production', color: 'bg-cream-100 text-cream-800', icon: Sparkles },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: Heart },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: X },
};

const statusFlow = ['new', 'discussing', 'quoted', 'approved', 'in_production', 'completed', 'cancelled'];

export default function AdminCustomOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [modalType, setModalType] = useState('status'); // 'status' or 'note'

  const [quotation, setQuotation] = useState({ amount: '', details: '', validDays: 7 });
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [currentPage, search]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/custom-orders?page=${currentPage}&limit=20`);
      setOrders(res.data.customOrders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load custom orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/admin/custom-orders/${orderId}/status`, { 
        status: newStatus,
        quotation: quotation.amount ? { amount: Number(quotation.amount), details: quotation.details } : undefined,
      });
      toast.success('Status updated!');
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handleNoteSubmit = async (orderId) => {
    try {
      await api.put(`/admin/custom-orders/${orderId}/note`, { note: adminNote });
      toast.success('Note added!');
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setQuotation({ amount: order.quotation?.amount || '', details: order.quotation?.details || '', validDays: 7 });
    setShowModal(true);
  };

  const openNoteModal = (order) => {
    setSelectedOrder(order);
    setAdminNote(order.adminNotes || '');
    setShowModal(true);
  };

  const getNextStatuses = (currentStatus) => {
    const currentIndex = statusFlow.indexOf(currentStatus);
    return statusFlow.slice(currentIndex + 1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
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
          <h1 className="font-heading text-2xl font-medium text-brown-900">Custom Orders</h1>
          <p className="text-brown-600">Manage bespoke creation requests</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-400" />
          <input
            type="text"
            placeholder="Search by name, email, product type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Request</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Product Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Quotation</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cream-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-200">
                {orders.map(order => {
                  const status = statusConfig[order.status] || statusConfig.new;
                  return (
                    <tr key={order._id} className="hover:bg-cream-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-brown-900">#{order._id?.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-brown-900">{order.name}</p>
                        <p className="text-cream-500 text-sm">{order.email} • {order.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-brown-700">{order.productType}</p>
                        <p className="text-cream-500 text-xs">{order.preferredColors?.join(', ') || 'No colors'}</p>
                      </td>
                      <td className="px-6 py-4 text-cream-600">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', status.color)}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {order.quotation?.amount ? (
                          <span className="font-bold text-cream-600">₹{order.quotation.amount}</span>
                        ) : (
                          <span className="text-cream-500">Not quoted</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button onClick={() => openStatusModal(order)} className="btn-secondary text-sm">
                            <Heart className="w-4 h-4 mr-2" />
                            Update
                          </button>
                          <button onClick={() => openNoteModal(order)} className="p-2 text-cream-500 hover:text-cream-600 hover:bg-cream-100 rounded-lg" aria-label="Add note">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-cream-300" />
            <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">No custom orders</h3>
            <p className="text-brown-600">Custom order requests will appear here</p>
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

      {/* Status Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-card-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-beige-200 flex items-center justify-between">
              <h2 className="font-heading text-xl font-medium text-brown-900">
                {modalType === 'status' ? 'Update Status & Quotation' : 'Add Internal Note'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-cream-500 hover:text-brown-700"><X className="w-6 h-6" /></button>
            </div>
            
            {modalType === 'status' ? (
              <div className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-brown-900 font-medium">Request #{selectedOrder._id?.slice(-8).toUpperCase()}</p>
                  <p className="text-cream-500 text-sm">{selectedOrder.name} • {selectedOrder.productType}</p>
                </div>
                
                <div>
                  <label className="label">New Status</label>
                  <select
                    defaultValue={selectedOrder.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      // Update quotation fields based on status
                    }}
                    className="input appearance-none bg-white"
                  >
                    {getNextStatuses(selectedOrder.status).map(s => (
                      <option key={s} value={s}>{statusConfig[s].label}</option>
                    ))}
                    <option value="cancelled" className="text-red-600">Cancel</option>
                  </select>
                </div>

                {['quoted', 'approved'].includes(selectedOrder.status) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-brown-900">Quotation Details</h4>
                    <div>
                      <label className="label">Amount (₹)</label>
                      <input type="number" value={quotation.amount} onChange={e => setQuotation(prev => ({ ...prev, amount: e.target.value }))} className="input" min="0" />
                    </div>
                    <div>
                      <label className="label">Details</label>
                      <textarea value={quotation.details} onChange={e => setQuotation(prev => ({ ...prev, details: e.target.value }))} rows={3} className="input resize-none" placeholder="Materials, timeline, etc." />
                    </div>
                    <div>
                      <label className="label">Valid for (days)</label>
                      <input type="number" value={quotation.validDays} onChange={e => setQuotation(prev => ({ ...prev, validDays: Number(e.target.value) }))} className="input" min="1" max="30" />
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={() => handleStatusChange(selectedOrder._id, selectedOrder.status)} disabled={updating} className="btn-primary flex-1">
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Status'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div>
                  <label className="label">Internal Note</label>
                  <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)} rows={5} className="input resize-none" placeholder="Add notes for your team..." />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button onClick={() => handleNoteSubmit(selectedOrder._id)} disabled={updating} className="btn-primary flex-1">
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Note'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
