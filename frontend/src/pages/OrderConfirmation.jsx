import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, Calendar, MapPin, Phone, Mail, Loader2, Heart, Sparkles, ArrowRight } from 'lucide-react';
import api from '../utils/api';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderNumber}`);
        setOrder(res.data.order);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    
    // Animation stages
    const timer = setInterval(() => {
      setAnimationStage(prev => Math.min(prev + 1, 3));
    }, 600);
    return () => clearInterval(timer);
  }, [orderNumber]);

  const statusSteps = [
    { id: 'pending', label: 'Order Placed', icon: CheckCircle },
    { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { id: 'processing', label: 'Handmade in Progress', icon: Package },
    { id: 'ready_to_ship', label: 'Ready to Ship', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: CheckCircle },
  ];

  const getCurrentStatusIndex = () => {
    if (!order) return 0;
    return statusSteps.findIndex(s => s.id === order.orderStatus);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream-100 flex items-center justify-center animate-pulse-soft">
            <Loader2 className="w-8 h-8 text-cream-500 animate-spin" />
          </div>
          <p className="text-cream-500">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
            <Package className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="font-heading text-2xl font-medium text-brown-900 mb-3">Order not found</h1>
          <p className="text-brown-600 mb-8">We couldn't find an order with that number.</p>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="min-h-screen bg-cream-50">
      <section className="section">
        <div className="container-custom">
          {/* Success Animation */}
          <div className="text-center mb-12">
            <div className={clsx(
              'w-24 h-24 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center',
              animationStage > 0 && 'animate-pulse-soft'
            )}>
              <CheckCircle className={clsx('w-12 h-12 text-sage-600', animationStage > 0 && 'fill-current')} />
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brown-900 mb-3">
              Your order is confirmed! 💕
            </h1>
            <p className="text-lg text-brown-600 max-w-xl mx-auto">
              Your handmade goodies are officially on their way to becoming something beautiful.
            </p>
          </div>

          {/* Order Number */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="card p-6 text-center bg-gradient-to-r from-cream-50 to-sage-50">
              <p className="text-cream-500 text-sm mb-1">Order Number</p>
              <p className="font-heading text-2xl font-bold text-brown-900 tracking-wider">{order.orderNumber}</p>
              <p className="text-cream-500 text-sm mt-2">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Timeline */}
              <div className="card p-6">
                <h2 className="font-heading text-lg font-medium text-brown-900 mb-6 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-cream-500" />
                  <span>Order Journey</span>
                </h2>
                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-beige-200" />
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex && order.orderStatus !== 'delivered';
                    return (
                      <div key={step.id} className="relative pl-16 pb-8 last:pb-0 flex items-start">
                        <div className={clsx(
                          'absolute left-0 top-1 w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all',
                          isCompleted ? 'bg-cream-500' : 'bg-cream-100',
                          isCurrent && 'ring-4 ring-cream-500/50 animate-pulse-soft'
                        )}>
                          {isCompleted ? <CheckCircle className="w-5 h-5 text-white fill-current" /> : step.icon}
                        </div>
                        <div>
                          <h3 className={clsx('font-medium', isCompleted || isCurrent ? 'text-brown-900' : 'text-cream-500')}>
                            {step.label}
                          </h3>
                          {isCurrent && <span className="text-xs text-cream-500">Current stage</span>}
                          {step.id === 'processing' && isCompleted && (
                            <p className="text-xs text-sage-600 mt-1">Your piece is being lovingly handcrafted</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              <div className="card p-6">
                <h2 className="font-heading text-lg font-medium text-brown-900 mb-4 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-cream-500" />
                  <span>Order Items</span>
                </h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 py-3 border-b border-beige-200 last:border-0">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-brown-900">{item.name}</p>
                        <p className="text-sm text-cream-500">
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

              {/* Shipping Address */}
              <div className="card p-6">
                <h2 className="font-heading text-lg font-medium text-brown-900 mb-4 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-cream-500" />
                  <span>Shipping Address</span>
                </h2>
                <address className="text-brown-700 not-italic space-y-1">
                  <p>{order.shippingAddress.name}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.landmark && `${order.shippingAddress.landmark}, `}{order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
                  <p>{order.shippingAddress.state}</p>
                  <p className="mt-2 flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-cream-500" />
                    <span>{order.shippingAddress.phone}</span>
                  </p>
                </address>
              </div>
            </div>

            {/* Summary & Actions */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="font-heading text-lg font-medium text-brown-900 mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-brown-700"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                  <div className="flex justify-between text-brown-700"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : '₹' + order.shipping}</span></div>
                  <div className="flex justify-between text-brown-700"><span>Tax</span><span>₹{order.tax}</span></div>
                </div>
                <div className="border-t border-beige-200 pt-2 mb-6 flex justify-between text-lg font-bold text-brown-900">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="p-3 bg-cream-50 rounded-btn">
                    <p className="font-medium text-brown-900 text-sm mb-1">Payment Method</p>
                    <p className="text-brown-700 text-sm capitalize">{order.paymentMethod.replace('_', ' ')}</p>
                  </div>
                  <div className="p-3 bg-cream-50 rounded-btn">
                    <p className="font-medium text-brown-900 text-sm mb-1">Payment Status</p>
                    <p className={clsx('text-sm', order.paymentStatus === 'paid' ? 'text-sage-600' : 'text-amber-600')}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link to="/my-orders" className="btn-primary w-full text-center">
                    Track Order
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                  <Link to="/shop" className="btn-outline w-full text-center">
                    Continue Shopping
                  </Link>
                </div>

                <p className="text-center text-cream-500 text-xs mt-6">
                  Questions? <a href="/contact" className="text-cream-600 hover:underline">Contact us</a>
                </p>
              </div>

              {/* Estimated Delivery */}
              {order.estimatedDelivery && (
                <div className="card p-6 mt-6">
                  <h3 className="font-heading font-medium text-brown-900 mb-3 flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-cream-500" />
                    <span>Estimated Delivery</span>
                  </h3>
                  <p className="text-2xl font-bold text-cream-600">
                    {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-cream-500 text-sm mt-1">We'll notify you when it ships!</p>
                </div>
              )}
            </div>
          </div>

          {/* Handmade Note */}
          <div className="max-w-3xl mx-auto mt-16 text-center">
            <div className="p-8 bg-gradient-to-r from-cream-100 via-cream-50 to-sage-50 rounded-card-lg">
              <Heart className="w-10 h-10 mx-auto mb-4 text-cream-500 fill-current" />
              <p className="text-brown-700 italic leading-relaxed">
                "Every loop takes time. Every stitch takes patience. Every piece carries a little part of the person who made it."
              </p>
              <p className="text-cream-500 text-sm mt-4">— Team Crochet_Diariiies</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import { clsx } from 'clsx';