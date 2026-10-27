import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Heart, ShoppingBag, Camera as Instagram, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { clsx } from 'clsx';

export default function Navbar({ cartCount = 0 }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/custom-orders', label: 'Custom Orders' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
  ];

  return (
    <header className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-soft' : 'bg-transparent'
    )}>
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" aria-label="Crochet_Diariiies Home">
            <span className="font-heading text-2xl lg:text-3xl font-medium text-brown-900">
              Crochet_Diariiies
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={clsx(
                  'text-sm font-medium transition-colors duration-200 relative',
                  location.pathname === link.path || 
                  (link.path !== '/' && location.pathname.startsWith(link.path))
                    ? 'text-cream-600' : 'text-brown-700 hover:text-cream-600'
                )}
              >
                {link.label}
                {(location.pathname === link.path || 
                  (link.path !== '/' && location.pathname.startsWith(link.path))) && (
                  <span className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-cream-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-brown-600 hover:bg-cream-100 transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-brown-600 hover:bg-cream-100 transition-colors relative" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="flex items-center justify-center w-10 h-10 rounded-full text-brown-600 hover:bg-cream-100 transition-colors relative" aria-label="Shopping cart">
              <ShoppingBag className="w-5 h-5" />
              {(cartCount > 0) && (
                <span className="absolute -top-1 -right-1 bg-cream-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Instagram */}
            <a href="https://instagram.com/crochet_diariiies" target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-brown-600 hover:bg-cream-100 transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-btn text-brown-700 hover:bg-cream-100 transition-colors"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block font-medium">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-card-lg shadow-card-hover border border-beige-200 py-2 animate-slide-down">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-brown-700 hover:bg-cream-50" onClick={() => setUserMenuOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/my-orders" className="block px-4 py-2 text-sm text-brown-700 hover:bg-cream-50" onClick={() => setUserMenuOpen(false)}>
                      My Orders
                    </Link>
                    <Link to="/my-custom-orders" className="block px-4 py-2 text-sm text-brown-700 hover:bg-cream-50" onClick={() => setUserMenuOpen(false)}>
                      Custom Orders
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-cream-600 hover:bg-cream-50" onClick={() => setUserMenuOpen(false)}>
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-2 border-beige-200" />
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-cream-50 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-brown-700 hover:text-cream-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-brown-700 hover:bg-cream-100 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-beige-200 animate-slide-down">
            <div className="flex flex-col space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={clsx(
                    'px-4 py-3 rounded-btn text-base font-medium transition-colors',
                    location.pathname === link.path ? 'bg-cream-100 text-cream-600' : 'text-brown-700 hover:bg-cream-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-2 border-beige-200" />
              {!isAuthenticated && (
                <div className="px-4 space-y-2">
                  <Link to="/login" className="block px-4 py-3 rounded-btn text-base font-medium text-brown-700 hover:bg-cream-50" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-center block" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}