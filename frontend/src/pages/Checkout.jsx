import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Shield, CreditCard, Smartphone, Home, MapPin, User, Mail, Phone, Loader2, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const steps = [
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'review', label: 'Review', icon: Check },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    deliveryInstructions: '',
    paymentMethod: 'razorpay',
    saveAddress: true,
  });
  
  const [errors, setErrors] = useState({});
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    if (user?.addresses?.length > 0) {
      setSavedAddresses(user.addresses);
      const defaultAddr = user.addresses.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr._id);
        populateAddress(defaultAddr);
      }
    }
  }, [user, items, navigate]);

  const populateAddress = (addr) => {
    setFormData(prev => ({
      ...prev,
      name: addr.name || prev.name,
      phone: addr.phone || prev.phone,
      address: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
      landmark: addr.landmark || '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateShipping = () => {
    const newErrors = {};
    const required = ['name', 'phone', 'email', 'address', 'city', 'state', 'pincode'];
    required.forEach(field => {
      if (!formData[field]?.trim()) newErrors[field] = 'Required';
    });
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid PIN code';
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Invalid phone';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => true;

  const handleNext = () => {
    if (currentStep === 0 && validateShipping()) setCurrentStep(1);
    else if (currentStep === 1 && validatePayment()) setCurrentStep(2);
  };

  const handleBack = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateShipping()) { setCurrentStep(0); return; }
    
    setProcessing(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.product,
          quantity: item.quantity,
          color: item.selectedColor,
          size: item.selectedSize,
        })),
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
        },
        paymentMethod: formData.paymentMethod,
        deliveryInstructions: formData.deliveryInstructions,
      };

      const res = await api.post('/orders', orderData);
      const order = res.data.order;

      if (formData.paymentMethod !== 'cod' && res.data.razorpayOrder) {
        // Razorpay integration would go here
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: res.data.razorpayOrder.amount,
          currency: 'INR',
          name: 'Crochet_Diariiies',
          order_id: res.data.razorpayOrder.id,
          handler: async (response) => {
            await api.post('/orders/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            clearCart();
            navigate(`/order-confirmation/${order.orderNumber}`);
          },
          prefill: { name: formData.name, email: formData.email, contact: formData.phone },
          theme: { color: '#831843' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        clearCart();
        navigate(`/order-confirmation/${order.orderNumber}`);
      }
    } catch (error) {
      toast.error('Order failed. Please try again.');
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const discount = 0; // Applied coupon discount

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Progress Steps */}
      <section className="bg-white border-b border-beige-200 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between px-4 py-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all',
                  index < currentStep ? 'bg-cream-500 text-white' :
                  index === currentStep ? 'bg-cream-500 text-white ring-4 ring-cream-500/50' :
                  'bg-cream-100 text-cream-500'
                )}>
                  {index < currentStep ? <Check className="w-5 h-5" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={clsx(
                    'hidden md:block w-20 h-0.5 mx-4 transition-colors',
                    index < currentStep ? 'bg-cream-500' : 'bg-beige-200'
                  )} />
                )}
                <span className={clsx(
                  'hidden md:block text-sm font-medium',
                  index <= currentStep ? 'text-brown-900' : 'text-cream-500'
                )}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form Sections */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Address */}
                {currentStep === 0 && (
                  <div className="card p-6 animate-slide-up">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-heading text-xl font-medium text-brown-900">Shipping Address</h2>
                      {savedAddresses.length > 0 && (
                        <select
                          value={selectedAddressId}
                          onChange={(e) => {
                            const addr = savedAddresses.find(a => a._id === e.target.value);
                            if (addr) { populateAddress(addr); setSelectedAddressId(addr._id); }
                          }}
                          className="input appearance-none bg-white w-auto text-sm"
                        >
                          <option value="">Select saved address</option>
                          {savedAddresses.map(addr => (
                            <option key={addr._id} value={addr._id}>
                              {addr.name}, {addr.city} - {addr.pincode}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="label">Full Name *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={clsx('input', errors.name && 'border-red-500')} required />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label htmlFor="email" className="label">Email *</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={clsx('input', errors.email && 'border-red-500')} required />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                      <div>
                        <label htmlFor="phone" className="label">Phone *</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={clsx('input', errors.phone && 'border-red-500')} required />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="address" className="label">Address *</label>
                        <textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={2} className={clsx('input resize-none', errors.address && 'border-red-500')} placeholder="Street address, building, floor" required />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>
                      <div>
                        <label htmlFor="city" className="label">City *</label>
                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className={clsx('input', errors.city && 'border-red-500')} required />
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label htmlFor="state" className="label">State *</label>
                        <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} className={clsx('input', errors.state && 'border-red-500')} required />
                        {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label htmlFor="pincode" className="label">PIN Code *</label>
                        <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} className={clsx('input', errors.pincode && 'border-red-500')} maxLength={6} required />
                        {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                      </div>
                      <div>
                        <label htmlFor="landmark" className="label">Landmark</label>
                        <input type="text" id="landmark" name="landmark" value={formData.landmark} onChange={handleChange} className="input" placeholder="Nearby landmark (optional)" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="label">Delivery Instructions</label>
                      <textarea name="deliveryInstructions" value={formData.deliveryInstructions} onChange={handleChange} rows={2} className="input resize-none" placeholder="e.g., Call before delivery, leave at reception" />
                    </div>

                    {isAuthenticated && (
                      <label className="flex items-center space-x-2 mt-4 cursor-pointer">
                        <input type="checkbox" name="saveAddress" checked={formData.saveAddress} onChange={handleChange} className="w-4 h-4 rounded border-beige-300 text-cream-500 focus:ring-cream-500" />
                        <span className="text-sm text-brown-700">Save as default address</span>
                      </label>
                    )}
                  </div>
                )}

                {/* Payment Method */}
                {currentStep === 1 && (
                  <div className="card p-6 animate-slide-up">
                    <h2 className="font-heading text-xl font-medium text-brown-900 mb-6">Payment Method</h2>
                    <div className="space-y-3">
                      {[
                        { id: 'razorpay', label: 'Online Payment (UPI, Cards, Net Banking)', icon: CreditCard, desc: 'Pay securely via Razorpay' },
                        { id: 'cod', label: 'Cash on Delivery', icon: Smartphone, desc: 'Pay when you receive (₹50 extra)' },
                      ].map(method => (
                        <label key={method.id} className={clsx(
                          'relative p-4 rounded-btn border-2 cursor-pointer transition-all',
                          formData.paymentMethod === method.id ? 'border-cream-500 bg-cream-50' : 'border-beige-200 hover:border-cream-300'
                        )}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center">
                              <method.icon className="w-5 h-5 text-cream-500" />
                            </div>
                            <div>
                              <p className="font-medium text-brown-900">{method.label}</p>
                              <p className="text-cream-500 text-sm">{method.desc}</p>
                            </div>
                          </div>
                          {formData.paymentMethod === method.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cream-500 flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Order */}
                {currentStep === 2 && (
                  <div className="card p-6 animate-slide-up">
                    <h2 className="font-heading text-xl font-medium text-brown-900 mb-6">Review Your Order</h2>
                    
                    <div className="mb-6 p-4 bg-cream-50 rounded-btn">
                      <h3 className="font-medium text-brown-900 mb-3">Shipping to</h3>
                      <p className="text-brown-700">{formData.name}</p>
                      <p className="text-brown-700">{formData.address}, {formData.landmark ? formData.landmark + ', ' : ''}{formData.city} - {formData.pincode}, {formData.state}</p>
                      <p className="text-brown-700">{formData.phone}</p>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-medium text-brown-900 mb-3">Items</h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {items.map((item) => (
                          <div key={`${item.product}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center space-x-3 py-2 border-b border-beige-200 last:border-0">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-brown-900 truncate">{item.name}</p>
                              <p className="text-xs text-cream-500">
                                {item.selectedColor && `${item.selectedColor} • `}
                                {item.selectedSize && `${item.selectedSize} • `}
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-medium text-brown-900">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6 p-4 bg-cream-50 rounded-btn">
                      <h3 className="font-medium text-brown-900 mb-3">Payment</h3>
                      <p className="text-brown-700 capitalize">{formData.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-brown-700"><span>Subtotal ({items.length} items)</span><span>₹{subtotal}</span></div>
                      <div className="flex justify-between text-brown-700"><span>Shipping</span><span>{shipping === 0 ? 'Free' : '₹' + shipping}</span></div>
                      <div className="flex justify-between text-brown-700"><span>Tax (18%)</span><span>₹{tax}</span></div>
                      {discount > 0 && <div className="flex justify-between text-sage-600"><span>Discount</span><span>-₹{discount}</span></div>}
                      <div className="border-t border-beige-200 pt-2 flex justify-between text-lg font-bold text-brown-900"><span>Total</span><span>₹{total}</span></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="card p-6 sticky top-24">
                  <h3 className="font-heading font-medium text-brown-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    {items.slice(0, 3).map(item => (
                      <div key={`${item.product}-${item.selectedColor}-${item.selectedSize}`} className="flex items-center space-x-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brown-900 truncate">{item.name}</p>
                          <p className="text-xs text-cream-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-brown-900">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                    {items.length > 3 && (
                      <p className="text-cream-500 text-sm text-center">+{items.length - 3} more items</p>
                    )}
                  </div>
                  <div className="border-t border-beige-200 pt-4 space-y-2">
                    <div className="flex justify-between text-brown-700"><span>Subtotal</span><span>₹{subtotal}</span></div>
                    <div className="flex justify-between text-brown-700"><span>Shipping</span><span>{shipping === 0 ? 'Free' : '₹' + shipping}</span></div>
                    <div className="flex justify-between text-brown-700"><span>Tax</span><span>₹{tax}</span></div>
                    <div className="border-t border-beige-200 pt-2 flex justify-between text-lg font-bold text-brown-900"><span>Total</span><span>₹{total}</span></div>
                  </div>
                </div>
              </div>
            </div>

          {/* Navigation Buttons */}
          <div className="container-custom mt-8 flex justify-between">
            {currentStep > 0 && (
              <button type="button" onClick={handleBack} className="btn-secondary">
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Back
              </button>
            )}
            {currentStep < 2 ? (
              <button type="button" onClick={handleNext} className="btn-primary ml-auto">
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button type="submit" disabled={processing} className="btn-primary ml-auto py-3">
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <span className="ml-2">₹{total}</span>
                  </>
                )}
              </button>
            )}
          </div>
          </form>
        </div>
      </section>
    </div>
  );
}