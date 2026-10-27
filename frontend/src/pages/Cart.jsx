import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Heart, Minus, Plus, ArrowLeft, Gift, Truck, Shield, Star, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { clsx } from 'clsx';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal, shipping, tax, total, itemCount, refreshCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [updating, setUpdating] = useState({});
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleUpdateQuantity = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdating(prev => ({ ...prev, [item.product]: true }));
    try {
      await updateQuantity(item.product, newQuantity, item.selectedColor, item.selectedSize);
    } finally {
      setUpdating(prev => ({ ...prev, [item.product]: false }));
    }
  };

  const handleRemove = (item) => {
    removeFromCart(item.product, item.selectedColor, item.selectedSize);
  };

  const handleMoveToWishlist = (item) => {
    // Create a mock product object for wishlist
    const product = {
      _id: item.product,
      name: item.name,
      images: [{ url: item.image }],
      price: item.price,
      slug: item.slug,
    };
    toggleWishlist(product);
    handleRemove(item);
  };

  const applyCoupon = () => {
    const coupons = {
      'WELCOME10': { discount: 10, type: 'percent', minAmount: 500 },
      'HANDMADE20': { discount: 20, type: 'percent', minAmount: 1000 },
      'FREESHIP': { discount: 99, type: 'fixed', minAmount: 0 },
    };
    
    const coupon = coupons[appliedCoupon.toUpperCase()];
    if (!coupon) {
      setCouponError('Invalid coupon code');
      setCouponSuccess('');
      return;
    }
    if (subtotal < coupon.minAmount) {
      setCouponError(`Minimum order ₹${coupon.minAmount} required`);
      setCouponSuccess('');
      return;
    }
    setCouponError('');
    setCouponSuccess(`Coupon applied! ${coupon.type === 'percent' ? coupon.discount + '%' : '₹' + coupon.discount} off`);
    // In real app, send to backend
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cream-100 flex items-center justify-center">
            <Gift className="w-12 h-12 text-cream-400" />
          </div>
          <h1 className="font-heading text-2xl font-medium text-brown-900 mb-3">Your cart is empty</h1>
          <p className="text-brown-600 mb-8">Looks like you haven't added any handmade goodies yet.</p>
          <Link to="/shop" className="btn-primary inline-flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <section className="bg-white border-b border-beige-200 py-6">
        <div className="container-custom">
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-2xl font-medium text-brown-900">Shopping Cart ({itemCount})</h1>
            <Link to="/shop" className="text-cream-600 hover:text-cream-700 font-medium text-sm flex items-center space-x-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-card-lg shadow-card overflow-hidden">
                {/* Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-cream-50 border-b border-beige-200 text-sm font-medium text-cream-600">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                  <div className="col-span-1"></div>
                </div>

                {/* Items */}
                <div className="divide-y divide-beige-200">
                  {items.map((item) => (
                    <div key={`${item.product}-${item.selectedColor}-${item.selectedSize}`} className="md:grid grid-cols-12 gap-4 px-6 py-6 items-center">
                      {/* Product */}
                      <div className="col-span-12 md:col-span-5 flex items-center space-x-4">
                        <Link to={`/product/${item.slug}`} className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-cream-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                        </Link>
                        <div className="min-w-0">
                          <Link to={`/product/${item.slug}`} className="font-medium text-brown-900 hover:text-cream-600 truncate block">{item.name}</Link>
                          <div className="flex items-center space-x-3 mt-1 text-sm text-cream-500">
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => handleMoveToWishlist(item)}
                              className={clsx('flex items-center space-x-1 text-sm', isInWishlist(item.product) ? 'text-cream-500' : 'text-cream-500 hover:text-cream-600')}
                            >
                              <Heart className={clsx('w-4 h-4', isInWishlist(item.product) && 'fill-current')} />
                              <span>{isInWishlist(item.product) ? 'Saved' : 'Save for later'}</span>
                            </button>
                            <button
                              onClick={() => handleRemove(item)}
                              className="flex items-center space-x-1 text-sm text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-12 md:col-span-2 text-center md:text-right text-brown-900 font-medium">
                        ₹{item.price}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-12 md:col-span-2 flex justify-center md:justify-end">
                        <div className="flex items-center border border-beige-300 rounded-btn overflow-hidden">
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                            disabled={updating[item.product] || item.quantity <= 1}
                            className="px-3 py-2 text-brown-600 hover:bg-cream-100 disabled:opacity-50 transition-colors"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="px-4 py-2 font-medium text-brown-900 min-w-[3rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                            disabled={updating[item.product]}
                            className="px-3 py-2 text-brown-600 hover:bg-cream-100 disabled:opacity-50 transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-12 md:col-span-2 text-right md:text-right font-bold text-lg text-brown-900">
                        ₹{item.price * item.quantity}
                      </div>

                      {/* Empty col for alignment */}
                      <div className="col-span-12 md:col-span-1" />
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="px-6 py-6 border-t border-beige-200">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={appliedCoupon}
                      onChange={(e) => { setAppliedCoupon(e.target.value); setCouponError(''); setCouponSuccess(''); }}
                      className="input flex-1"
                      maxLength={20}
                    />
                    <button
                      onClick={applyCoupon}
                      className="btn-secondary whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-sm mt-2">{couponError}</p>}
                  {couponSuccess && <p className="text-sage-600 text-sm mt-2">{couponSuccess}</p>}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { icon: Truck, title: 'Free Shipping', desc: 'Over ₹999' },
                  { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
                  { icon: Star, title: 'Quality Guaranteed', desc: 'Handmade with love' },
                ].map((badge, index) => (
                  <div key={index} className="card p-4 text-center hover:shadow-card-hover transition-shadow">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-cream-100 flex items-center justify-center">
                      <badge.icon className="w-5 h-5 text-cream-500" />
                    </div>
                    <p className="font-medium text-brown-900 text-sm">{badge.title}</p>
                    <p className="text-cream-500 text-xs">{badge.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="font-heading text-lg font-medium text-brown-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-brown-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-brown-700">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : '₹' + shipping}</span>
                  </div>
                  <div className="flex justify-between text-brown-700">
                    <span>Tax (18%)</span>
                    <span>₹{tax}</span>
                  </div>
                  {couponSuccess && (
                    <div className="flex justify-between text-sage-600">
                      <span>Discount</span>
                      <span>-₹{appliedCoupon === 'FREESHIP' ? 99 : Math.round(subtotal * 0.1)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-beige-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-brown-900">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>

                <p className="text-cream-500 text-xs text-center mb-6">
                  Shipping calculated at checkout. Taxes included.
                </p>

                <Link to="/checkout" className="btn-primary w-full py-3 text-center">
                  Proceed to Checkout
                  <span className="ml-2">₹{total}</span>
                </Link>

                <p className="text-center text-cream-500 text-xs mt-4">
                  Your handmade goodies are almost yours 💕
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}