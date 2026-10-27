import { useState, useEffect } from 'react';
import { Search, User, Edit, Trash2, Loader2, MoreVertical, Shield, Heart, Package } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState({ orders: [], customOrders: [] });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 20 });
      if (search) params.set('search', search);
      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const openUserModal = async (user) => {
    setSelectedUser(user);
    try {
      const [ordersRes, customOrdersRes] = await Promise.all([
        api.get(`/admin/users/${user._id}`),
        api.get(`/admin/users/${user._id}`), // same endpoint returns both
      ]);
      setUserDetails({
        orders: ordersRes.data.orders || [],
        customOrders: ordersRes.data.customOrders || [],
      });
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
    setShowModal(true);
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}`, { role });
      toast.success('Role updated!');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
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
          <h1 className="font-heading text-2xl font-medium text-brown-900">Customers</h1>
          <p className="text-brown-600">Manage your customer base</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        {users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Orders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Custom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cream-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-200">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-cream-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-cream-500" />
                        </div>
                        <div>
                          <p className="font-medium text-brown-900">{user.name}</p>
                          {user.avatar && <img src={user.avatar} alt="" className="w-6 h-6 rounded-full mt-1" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-brown-700">{user.email}</p>
                      <p className="text-cream-500 text-sm">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-cream-600">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className="text-brown-700">{userDetails.orders?.length || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-brown-700">{userDetails.customOrders?.length || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="input appearance-none bg-white w-auto text-sm py-1.5"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openUserModal(user)} className="p-2 text-cream-500 hover:text-cream-600 hover:bg-cream-100 rounded-lg" aria-label="View details">
                          <Edit className="w-4 h-4" />
                        </button>
                        {user.role !== 'admin' && (
                          <button onClick={() => handleDelete(user._id)} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-cream-300" />
            <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">No customers found</h3>
            <p className="text-brown-600">Try adjusting your search</p>
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

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-card-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-beige-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-cream-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-cream-500" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-medium text-brown-900">{selectedUser.name}</h2>
                  <p className="text-cream-500 text-sm">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 text-cream-500 hover:text-brown-700"><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 space-y-8">
              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium text-brown-900 mb-3">Contact</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between"><dt className="text-cream-500">Email</dt><dd className="font-medium text-brown-900">{selectedUser.email}</dd></div>
                    <div className="flex justify-between"><dt className="text-cream-500">Phone</dt><dd className="font-medium text-brown-900">{selectedUser.phone}</dd></div>
                    <div className="flex justify-between"><dt className="text-cream-500">Joined</dt><dd className="font-medium text-brown-900">{formatDate(selectedUser.createdAt)}</dd></div>
                    <div className="flex justify-between"><dt className="text-cream-500">Role</dt><dd className="font-medium text-brown-900 capitalize">{selectedUser.role}</dd></div>
                  </dl>
                </div>
                <div>
                  <h3 className="font-medium text-brown-900 mb-3">Addresses ({selectedUser.addresses?.length || 0})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedUser.addresses?.map((addr, i) => (
                      <div key={i} className="p-2 bg-cream-50 rounded-btn text-sm">
                        <p className="font-medium text-brown-900">{addr.label} {addr.isDefault && '<span class="badge badge-new">Default</span>'}</p>
                        <p className="text-cream-500">{addr.street}, {addr.city} - {addr.pincode}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-brown-900 mb-3">Wishlist ({selectedUser.wishlist?.length || 0})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedUser.wishlist?.map((item, i) => (
                      <div key={i} className="p-2 bg-cream-50 rounded-btn text-sm flex items-center space-x-2">
                        <img src={item.images?.[0]?.url} alt={item.name} className="w-8 h-8 rounded object-cover" />
                        <span className="truncate text-brown-900">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Orders */}
              <div>
                <h3 className="font-medium text-brown-900 mb-3 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-cream-500" />
                  <span>Recent Orders ({userDetails.orders?.length || 0})</span>
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {userDetails.orders?.slice(0, 10).map(order => (
                    <div key={order._id} className="p-3 bg-cream-50 rounded-btn flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brown-900">{order.orderNumber}</p>
                        <p className="text-cream-500 text-sm">{order.items?.length} items • ₹{order.total}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-cream-100 text-cream-700">{order.orderStatus}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Orders */}
              <div>
                <h3 className="font-medium text-brown-900 mb-3 flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-cream-500" />
                  <span>Custom Orders ({userDetails.customOrders?.length || 0})</span>
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {userDetails.customOrders?.slice(0, 10).map(custom => (
                    <div key={custom._id} className="p-3 bg-cream-50 rounded-btn flex items-center justify-between">
                      <div>
                        <p className="font-medium text-brown-900">{custom.productType}</p>
                        <p className="text-cream-500 text-sm">{custom.preferredColors?.join(', ')}</p>
                      </div>
                      <span className="px-2 py-1 text-xs rounded-full bg-cream-100 text-cream-700">{custom.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { ChevronRight } from 'lucide-react';