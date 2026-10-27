import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Heart, Package, Edit, Save, X, Loader2, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'security', label: 'Security', icon: Lock },
];

export default function Profile() {
  const { user, updateProfile, updatePassword, addAddress, updateAddress, deleteAddress, refreshUser, logout } = useAuth();
  const { items: wishlistItems, toggleWishlist, isInWishlist, refreshWishlist } = useWishlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Address forms
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    isDefault: false,
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email, phone: user.phone });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(profileData);
      toast.success('Profile updated! 💕');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddressForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const startEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      label: addr.label,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark,
      isDefault: addr.isDefault,
    });
  };

  const cancelEditAddress = () => {
    setEditingAddressId(null);
    setAddressForm({ label: 'Home', street: '', city: '', state: '', pincode: '', landmark: '', isDefault: false });
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingAddressId) {
        await updateAddress(editingAddressId, addressForm);
        toast.success('Address updated!');
      } else {
        await addAddress(addressForm);
        toast.success('Address added!');
      }
      cancelEditAddress();
      await refreshUser();
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      await deleteAddress(id);
      toast.success('Address deleted');
      await refreshUser();
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password changed!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="section">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="card p-6 sticky top-24">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-cream-500" />
                  </div>
                  <div>
                    <h3 className="font-heading font-medium text-brown-900">{user?.name}</h3>
                    <p className="text-cream-500 text-sm">{user?.email}</p>
                  </div>
                </div>
                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={clsx(
                        'w-full flex items-center space-x-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors',
                        activeTab === tab.id
                          ? 'bg-cream-100 text-cream-600'
                          : 'text-brown-700 hover:bg-cream-50'
                      )}
                    >
                      <tab.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-btn text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="card p-6 animate-slide-up">
                  <h2 className="font-heading text-xl font-medium text-brown-900 mb-6">Profile Information</h2>
                  <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-md">
                    <div>
                      <label htmlFor="name" className="label">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="input"
                        maxLength={10}
                      />
                    </div>
                    <button type="submit" disabled={saving} className="btn-primary">
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div className="space-y-6 animate-slide-up">
                  <div className="flex items-center justify-between">
                    <h2 className="font-heading text-xl font-medium text-brown-900">Saved Addresses</h2>
                    <button
                      onClick={() => { setEditingAddressId('new'); cancelEditAddress(); }}
                      className="btn-primary text-sm"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      Add Address
                    </button>
                  </div>

                  {editingAddressId && (
                    <div className="card p-6 border-2 border-cream-500">
                      <h3 className="font-heading font-medium text-brown-900 mb-4">
                        {editingAddressId === 'new' ? 'Add New Address' : 'Edit Address'}
                      </h3>
                      <form onSubmit={handleAddressSubmit} className="space-y-4 max-w-md">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="label" className="label">Label</label>
                            <select id="label" name="label" value={addressForm.label} onChange={handleAddressChange} className="input appearance-none bg-white">
                              <option value="Home">Home</option>
                              <option value="Work">Work</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="pincode" className="label">PIN Code *</label>
                            <input type="text" id="pincode" name="pincode" value={addressForm.pincode} onChange={handleAddressChange} className="input" maxLength={6} required />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="street" className="label">Street Address *</label>
                          <textarea id="street" name="street" value={addressForm.street} onChange={handleAddressChange} rows={2} className="input resize-none" required placeholder="Building, street, floor" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="city" className="label">City *</label>
                            <input type="text" id="city" name="city" value={addressForm.city} onChange={handleAddressChange} className="input" required />
                          </div>
                          <div>
                            <label htmlFor="state" className="label">State *</label>
                            <input type="text" id="state" name="state" value={addressForm.state} onChange={handleAddressChange} className="input" required />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="landmark" className="label">Landmark</label>
                          <input type="text" id="landmark" name="landmark" value={addressForm.landmark} onChange={handleAddressChange} className="input" placeholder="Nearby landmark" />
                        </div>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={handleAddressChange} className="w-4 h-4 rounded border-beige-300 text-cream-500 focus:ring-cream-500" />
                          <span className="text-sm text-brown-700">Set as default</span>
                        </label>
                        <div className="flex space-x-3">
                          <button type="submit" disabled={saving} className="btn-primary flex-1">
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Address'}
                          </button>
                          <button type="button" onClick={cancelEditAddress} className="btn-secondary">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  {addresses.length === 0 && !editingAddressId ? (
                    <div className="card p-12 text-center">
                      <MapPin className="w-16 h-16 mx-auto mb-4 text-cream-300" />
                      <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">No addresses saved</h3>
                      <p className="text-brown-600 mb-4">Add an address for faster checkout</p>
                      <button onClick={() => { setEditingAddressId('new'); cancelEditAddress(); }} className="btn-primary">
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {addresses.map(addr => (
                        <div key={addr._id} className="card p-4 border-l-4 border-brown-900 hover:shadow-card-hover transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-brown-900">{addr.name}</span>
                                {addr.isDefault && <span className="badge badge-new">Default</span>}
                              </div>
                              <p className="text-brown-700 text-sm">{addr.street}</p>
                              <p className="text-brown-700 text-sm">{addr.city} - {addr.pincode}, {addr.state}</p>
                              {addr.landmark && <p className="text-cream-500 text-xs mt-1">Near: {addr.landmark}</p>}
                              <p className="text-cream-500 text-xs mt-1">{addr.phone}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button onClick={() => startEditAddress(addr)} className="p-2 text-cream-500 hover:text-cream-600 hover:bg-cream-100 rounded-lg transition-colors" aria-label="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label="Delete">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="animate-slide-up">
                  <h2 className="font-heading text-xl font-medium text-brown-900 mb-6">Order History</h2>
                  <Link to="/my-orders" className="btn-outline inline-flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>View All Orders</span>
                  </Link>
                </div>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'wishlist' && (
                <div className="animate-slide-up">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-xl font-medium text-brown-900">Wishlist ({wishlistItems.length})</h2>
                    {wishlistItems.length > 0 && (
                      <Link to="/shop" className="btn-secondary text-sm">
                        Continue Shopping
                      </Link>
                    )}
                  </div>
                  {wishlistItems.length === 0 ? (
                    <div className="card p-12 text-center">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-cream-300" />
                      <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-brown-600 mb-4">Save items you love for later</p>
                      <Link to="/shop" className="btn-primary">Start Shopping</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlistItems.map(item => (
                        <div key={item._id} className="card p-4 flex items-center space-x-4">
                          <img src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=400'} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <Link to={`/product/${item.slug}`} className="font-medium text-brown-900 hover:text-cream-600 truncate block">{item.name}</Link>
                            <p className="text-cream-600 text-sm">₹{item.price}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button onClick={() => toggleWishlist(item)} className="p-2 text-cream-500 hover:bg-cream-100 rounded-lg">
                              <Heart className="w-5 h-5 fill-current" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="card p-6 animate-slide-up max-w-md">
                  <h2 className="font-heading text-xl font-medium text-brown-900 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="currentPassword" className="label">Current Password</label>
                      <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} className="input" required />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="label">New Password</label>
                      <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} className="input" minLength={6} required />
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
                      <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} className="input" minLength={6} required />
                    </div>
                    <button type="submit" disabled={saving} className="btn-primary">
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}