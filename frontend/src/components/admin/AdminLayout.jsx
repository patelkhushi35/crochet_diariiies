import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Users, Image, Star, LogOut, Menu, X, Sparkles, Heart, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { path: '/admin/custom-orders', label: 'Custom Orders', icon: Sparkles },
  { path: '/admin/users', label: 'Customers', icon: Users },
  { path: '/admin/gallery', label: 'Gallery', icon: Image },
  { path: '/admin/reviews', label: 'Reviews', icon: Star },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-beige-200 flex flex-col transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-beige-200">
          <Link to="/admin" className="font-heading text-xl font-medium text-brown-900">
            Admin Panel
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-cream-500 hover:text-brown-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => clsx(
                'flex items-center space-x-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors',
                isActive ? 'bg-cream-100 text-cream-600' : 'text-brown-700 hover:bg-cream-50'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-beige-200">
          <Link to="/" className="flex items-center space-x-3 px-3 py-2.5 rounded-btn text-sm font-medium text-brown-700 hover:bg-cream-50 transition-colors">
            <Heart className="w-5 h-5" />
            <span>View Store</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-btn text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-2">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-beige-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-brown-700 hover:bg-cream-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex-1 lg:flex-none">
              <h1 className="font-heading text-lg font-medium text-brown-900">Crochet_Diariiies Admin</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/" className="hidden sm:block text-sm text-cream-600 hover:text-brown-700">View Store</Link>
              <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center">
                <User className="w-5 h-5 text-cream-500" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-brown-700">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}