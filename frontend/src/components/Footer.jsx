import { Link } from 'react-router-dom';
import { Camera as Instagram, MessageCircle, Pin, Mail, Heart, Truck, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'All Products', path: '/shop' },
      { label: 'Flowers', path: '/shop?category=Flowers' },
      { label: 'Bags', path: '/shop?category=Bags' },
      { label: 'Accessories', path: '/shop?category=Accessories' },
      { label: 'Home Decor', path: '/shop?category=Home Decor' },
      { label: 'Plushies', path: '/shop?category=Plushies' },
      { label: 'Keychains', path: '/shop?category=Keychains' },
      { label: 'Gifts', path: '/shop?category=Gifts' },
      { label: 'New Arrivals', path: '/shop?newArrival=true' },
      { label: 'Best Sellers', path: '/shop?bestSeller=true' },
    ],
    support: [
      { label: 'Custom Orders', path: '/custom-orders' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Shipping & Returns', path: '/shipping-returns' },
      { label: 'Track Order', path: '/track-order' },
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Our Story', path: '/about#story' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Reviews', path: '/reviews' },
      { label: 'Careers', path: '/careers' },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy-policy' },
      { label: 'Terms & Conditions', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookie-policy' },
    ],
  };

  const trustBadges = [
    { icon: Heart, label: '100% Handmade', desc: 'Crafted with love' },
    { icon: Shield, label: 'Secure Payments', desc: 'Protected checkout' },
    { icon: Truck, label: 'Carefully Packed', desc: 'Gift-ready packaging' },
    { icon: Sparkles, label: 'Made With Love', desc: 'Every stitch matters' },
  ];

  return (
    <footer className="bg-brown-900 text-cream-100">
      <div className="container-custom py-16 lg:py-24">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16 pb-16 border-b border-brown-800">
          {trustBadges.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-brown-800 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-cream-400" />
              </div>
              <div>
                <h4 className="font-heading text-lg font-medium text-white">{label}</h4>
                <p className="text-cream-400 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-heading text-3xl font-medium text-white mb-4 block">
              Crochet_Diariiies
            </Link>
            <p className="text-cream-400 text-base leading-relaxed mb-6 max-w-xs">
              Handmade with love, one stitch at a time. Creating beautiful crochet pieces 
              that bring warmth and happiness into everyday moments.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/crochet_diariiies" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brown-800 flex items-center justify-center hover:bg-brown-700 transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-cream-400" />
              </a>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brown-800 flex items-center justify-center hover:bg-brown-700 transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5 text-cream-400" />
              </a>
              <a href="https://pinterest.com/crochet_diariiies" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-brown-800 flex items-center justify-center hover:bg-brown-700 transition-colors" aria-label="Pinterest">
                <Pin className="w-5 h-5 text-cream-400" />
              </a>
              <a href="mailto:hello@crochetdiaries.com" className="w-10 h-10 rounded-full bg-brown-800 flex items-center justify-center hover:bg-brown-700 transition-colors" aria-label="Email">
                <Mail className="w-5 h-5 text-cream-400" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-heading text-lg font-medium text-white mb-4">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-cream-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-heading text-lg font-medium text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-cream-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-lg font-medium text-white mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-cream-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading text-lg font-medium text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-cream-400 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-brown-800/50 rounded-card-lg p-8 lg:p-12 mb-16">
          <div className="max-w-xl mx-auto text-center">
            <h4 className="font-heading text-2xl font-medium text-white mb-2">Stay in our little crochet world</h4>
            <p className="text-cream-400 mb-6">Get first access to new drops, custom creations and special offers.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing! 💕'); }}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-btn bg-brown-900 border border-brown-700 text-white placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-500 focus:border-transparent"
                required
              />
              <button type="submit" className="btn-accent whitespace-nowrap">
                Join Us ♡
              </button>
            </form>
            <p className="text-cream-500 text-xs mt-4">No spam, just crochet love. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-8 border-t border-brown-800">
          <p className="text-cream-500 text-sm">
            © {currentYear} Crochet_Diariiies. Handmade with love.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy-policy" className="text-cream-500 hover:text-white text-sm transition-colors">Privacy</Link>
            <Link to="/terms" className="text-cream-500 hover:text-white text-sm transition-colors">Terms</Link>
            <Link to="/shipping-returns" className="text-cream-500 hover:text-white text-sm transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}