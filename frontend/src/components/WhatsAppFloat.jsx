import { useState } from 'react';
import { MessageCircle, X, Heart, ShoppingBag, Edit } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { items } = useCart();

  const generateMessage = () => {
    const baseUrl = window.location.origin;
    let message = "Hi! I'm interested in your crochet products.";
    
    if (location.pathname.startsWith('/product/')) {
      const productName = location.pathname.split('/product/')[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      message = `Hi! I'm interested in ${productName}.`;
    } else if (location.pathname === '/custom-orders') {
      message = "Hi! I'd like to discuss a custom crochet order.";
    } else if (location.pathname === '/cart' && items.length > 0) {
      const itemNames = items.map(i => i.name).join(', ');
      message = `Hi! I have items in my cart: ${itemNames}.`;
    }
    
    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/919876543210?text=${generateMessage()}`;

  const quickActions = [
    { label: 'General Inquiry', message: "Hi! I'm interested in your crochet products.", icon: MessageCircle },
    { label: 'Custom Order', message: "Hi! I'd like to discuss a custom crochet order.", icon: Edit },
    { label: 'Product Question', message: "Hi! I have a question about a product.", icon: Heart },
    { label: 'Order Status', message: "Hi! I'd like to check my order status.", icon: ShoppingBag },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-card-hover flex items-center justify-center transition-all duration-300 animate-pulse-soft"
        aria-label={isOpen ? 'Close WhatsApp chat' : 'Open WhatsApp chat'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-80 lg:w-96 bg-white rounded-card-lg shadow-card-hover border border-beige-200 animate-zoom-in overflow-hidden">
          {/* Header */}
          <div className="bg-brown-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-medium">Crochet_Diariiies</h4>
                <p className="text-cream-300 text-sm">Typically replies within minutes</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-brown-800 rounded-lg transition-colors" aria-label="Close chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-4 space-y-2 border-b border-beige-200">
            <p className="text-sm font-medium text-brown-700">Quick actions</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <a
                  key={action.label}
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(action.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-3 py-2 rounded-btn bg-cream-50 hover:bg-cream-100 text-brown-700 text-sm transition-colors"
                >
                  <action.icon className="w-4 h-4 text-green-500" />
                  <span>{action.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Main Chat Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-green-500 hover:bg-green-600 text-white text-center font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Start Chat on WhatsApp</span>
          </a>

          {/* Disclaimer */}
          <p className="text-xs text-cream-500 text-center p-4 bg-cream-50">
            By continuing, you agree to WhatsApp's Terms of Service and Privacy Policy.
          </p>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}