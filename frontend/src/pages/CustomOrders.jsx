import { useState } from 'react';
import { ArrowRight, Heart, Sparkles, Truck, Shield, MessageCircle, Image, Palette, Ruler, Calendar, Upload, Send, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CustomOrders() {
  const { user, isAuthenticated } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    productType: '',
    preferredColors: [],
    size: '',
    quantity: 1,
    budget: '',
    requiredDate: '',
    specialInstructions: '',
  });
  const [referenceImages, setReferenceImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    { number: '01', title: 'Tell us your idea', icon: MessageCircle },
    { number: '02', title: 'We design your piece', icon: Palette },
    { number: '03', title: 'We crochet it by hand', icon: Heart },
    { number: '04', title: 'We carefully pack it', icon: Truck },
    { number: '05', title: 'It reaches you', icon: Shield },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleColorChange = (color) => {
    setFormData(prev => ({
      ...prev,
      preferredColors: prev.preferredColors.includes(color)
        ? prev.preferredColors.filter(c => c !== color)
        : [...prev.preferredColors, color]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + referenceImages.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setReferenceImages(prev => [...prev, { file, preview: event.target.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setReferenceImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.productType.trim()) newErrors.productType = 'Product type is required';
    if (!formData.preferredColors.length) newErrors.preferredColors = 'Select at least one color';
    if (!formData.specialInstructions.trim()) newErrors.specialInstructions = 'Please describe your idea';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Upload images first
      let uploadedImages = [];
      for (const img of referenceImages) {
        const formData = new FormData();
        formData.append('image', img.file);
        const res = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedImages.push({ url: res.data.url, publicId: res.data.publicId });
      }

      // Submit custom order
      await api.post('/custom-orders', {
        ...formData,
        referenceImages: uploadedImages,
      });

      setSubmitted(true);
      toast.success('Your custom order request has been received! 💕');
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center animate-pulse-soft">
            <Heart className="w-12 h-12 text-sage-600 fill-current" />
          </div>
          <h1 className="font-heading text-3xl font-medium text-brown-900 mb-4">
            Request Sent Successfully!
          </h1>
          <p className="text-brown-600 mb-8">
            We've received your custom order request. Our team will contact you within 24 hours 
            to discuss your dream creation.
          </p>
          <div className="space-y-3">
            <button onClick={() => setSubmitted(false)} className="btn-primary w-full">
              Create Another Request
            </button>
            <Link to="/shop" className="btn-outline w-full block">
              Browse Ready-Made
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 text-cream-100 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23EC4899%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 rounded-full bg-cream-900/50 text-cream-300 text-sm font-medium mb-4">
              Bespoke Crochet Creations
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-medium mb-6 leading-tight">
              Dream it. We&apos;ll crochet it.
            </h1>
            <p className="text-lg text-cream-300 max-w-2xl mx-auto">
              Have something special in mind? Tell us what you're imagining and we'll create it for you.
              From custom color combinations to personalized designs, your dream piece is just a message away.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">How Custom Orders Work</h2>
            <p className="section-subtitle">A simple journey from idea to reality</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <div key={step.step} className="text-center relative">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className={`
                    absolute inset-0 rounded-full flex items-center justify-center
                    ${index < activeStep ? 'bg-cream-500' : 'bg-cream-100'}
                    ${index === activeStep ? 'ring-4 ring-cream-500/50' : ''}
                    transition-all duration-300
                  `}>
                    <span className={`
                      font-heading text-2xl font-bold
                      ${index <= activeStep ? 'text-white' : 'text-cream-600'}
                    `}>
                      {step.number}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      hidden lg:block absolute top-10 left-1/2 w-full h-0.5 transition-colors
                      ${index < activeStep ? 'bg-cream-500' : 'bg-beige-200'}
                    `} />
                  )}
                </div>
                <step.icon className="w-10 h-10 mx-auto mb-3 text-cream-500" />
                <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">{step.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Order Form */}
      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="card p-8">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-medium text-brown-900 mb-2">
                  Create Your Custom Piece
                </h2>
                <p className="text-brown-600">Fill in the details below and we'll bring your vision to life</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Info */}
                <fieldset className="border-t border-beige-200 pt-6">
                  <legend className="font-heading text-lg font-medium text-brown-900 mb-4 flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-cream-500" />
                    <span>Your Details</span>
                  </legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="label">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={clsx('input', errors.name && 'border-red-500 focus:ring-red-500')}
                        required
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="phone" className="label">Phone Number *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={clsx('input', errors.phone && 'border-red-500 focus:ring-red-500')}
                        required
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="email" className="label">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={clsx('input', errors.email && 'border-red-500 focus:ring-red-500')}
                        required
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>
                </fieldset>

                {/* Product Details */}
                <fieldset className="border-t border-beige-200 pt-6">
                  <legend className="font-heading text-lg font-medium text-brown-900 mb-4 flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-cream-500" />
                    <span>Your Vision</span>
                  </legend>
                  
                  <div>
                    <label htmlFor="productType" className="label">What would you like us to make? *</label>
                    <select
                      id="productType"
                      name="productType"
                      value={formData.productType}
                      onChange={handleChange}
                      className={clsx('input appearance-none bg-white', errors.productType && 'border-red-500 focus:ring-red-500')}
                      required
                    >
                      <option value="">Select product type</option>
                      <option value="Flower Bouquet">Flower Bouquet</option>
                      <option value="Single Flower">Single Flower (Tulip, Rose, Daisy, etc.)</option>
                      <option value="Tote Bag">Tote Bag</option>
                      <option value="Mini Bag">Mini/Shoulder Bag</option>
                      <option value="Pouch">Pouch/Wallet</option>
                      <option value="Keychain">Keychain</option>
                      <option value="Hair Accessories">Hair Accessories (Scrunchies, Clips)</option>
                      <option value="Plushie">Plushie/Amigurumi</option>
                      <option value="Home Decor">Home Decor (Coasters, Wall Hanging, etc.)</option>
                      <option value="Gift Box">Curated Gift Box</option>
                      <option value="Other">Other (describe below)</option>
                    </select>
                    {errors.productType && <p className="text-red-500 text-sm mt-1">{errors.productType}</p>}
                  </div>

                  <div>
                    <label className="label">Preferred Colors *</label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { name: 'Soft Pink', hex: '#FCE7F3' },
                        { name: 'Blush', hex: '#FBCFE8' },
                        { name: 'Dusty Rose', hex: '#F9A8D4' },
                        { name: 'Cream White', hex: '#FDF2F8' },
                        { name: 'Warm Beige', hex: '#F5F0E8' },
                        { name: 'Sage Green', hex: '#DCFCE7' },
                        { name: 'Mint', hex: '#BBF7D0' },
                        { name: 'Lavender', hex: '#F3E8FF' },
                        { name: 'Peach', hex: '#FFEDD5' },
                        { name: 'Soft Grey', hex: '#F1F5F9' },
                        { name: 'Warm Brown', hex: '#EDE9E6' },
                        { name: 'Terracotta', hex: '#FED7AA' },
                      ].map(color => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => handleColorChange(color.name)}
                          className={clsx(
                            'flex items-center space-x-2 px-4 py-2 rounded-btn border-2 transition-all',
                            formData.preferredColors.includes(color.name)
                              ? 'border-cream-500 bg-cream-50'
                              : 'border-beige-300 hover:border-cream-400'
                          )}
                          aria-pressed={formData.preferredColors.includes(color.name)}
                        >
                          <span className="w-5 h-5 rounded-full border border-beige-300" style={{ backgroundColor: color.hex }} />
                          <span className="text-sm font-medium text-brown-700">{color.name}</span>
                        </button>
                      ))}
                    </div>
                    {errors.preferredColors && <p className="text-red-500 text-sm mt-1">{errors.preferredColors}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="size" className="label">Size</label>
                      <input
                        type="text"
                        id="size"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        placeholder="e.g., Medium, 30cm, Custom"
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="quantity" className="label">Quantity</label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        max="50"
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="budget" className="label">Budget (₹)</label>
                      <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="Optional"
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="requiredDate" className="label">Required By</label>
                    <input
                      type="date"
                      id="requiredDate"
                      name="requiredDate"
                      value={formData.requiredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>

                  <div>
                    <label htmlFor="specialInstructions" className="label">Describe Your Idea *</label>
                    <textarea
                      id="specialInstructions"
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Tell us about your vision... colors, style, occasion, specific details, reference images, etc."
                      className={clsx('input resize-none', errors.specialInstructions && 'border-red-500 focus:ring-red-500')}
                      required
                    />
                    {errors.specialInstructions && <p className="text-red-500 text-sm mt-1">{errors.specialInstructions}</p>}
                    <p className="text-cream-500 text-sm mt-1">Example: "I want a bouquet of 7 pink tulips with 3 white roses, wrapped in kraft paper with a handwritten note for my sister's birthday."</p>
                  </div>
                </fieldset>

                {/* Reference Images */}
                <fieldset className="border-t border-beige-200 pt-6">
                  <legend className="font-heading text-lg font-medium text-brown-900 mb-4 flex items-center space-x-2">
                    <Image className="w-5 h-5 text-cream-500" />
                    <span>Reference Images (Optional)</span>
                  </legend>
                  <div className="space-y-4">
                    <label className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Upload Images (Max 5)</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="sr-only"
                        disabled={referenceImages.length >= 5}
                      />
                    </label>
                    {referenceImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        {referenceImages.map((img, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-beige-200">
                            <img src={img.preview} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-cream-500 text-sm">Upload photos of similar styles, color references, or sketches</p>
                  </div>
                </fieldset>

                {/* Submit */}
                <div className="pt-4 border-t border-beige-200">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full py-4 text-lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Request Custom Order
                      </>
                    )}
                  </button>
                  <p className="text-center text-cream-500 text-sm mt-4">
                    No payment required now. We'll send you a quotation after discussing your idea.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Custom Ideas to Inspire You</h2>
            <p className="section-subtitle">Previous custom creations for our lovely customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Bridal Bouquet', desc: 'White roses, blush peonies, eucalyptus', emoji: '👰' },
              { title: 'Baby Shower Gift', desc: 'Pastel animals, personalized blanket', emoji: '👶' },
              { title: 'Anniversary Bouquet', desc: 'Red roses, preserved forever', emoji: '💑' },
              { title: 'Corporate Gifts', desc: 'Branded mini bags for team', emoji: '🏢' },
              { title: 'Pet Memorial', desc: 'Custom amigurumi of beloved pet', emoji: '🐾' },
              { title: 'Festival Decor', desc: 'Handmade garlands & ornaments', emoji: '🎉' },
            ].map((item, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-card-hover transition-shadow">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="font-heading text-lg font-medium text-brown-900 mb-1">{item.title}</h3>
                <p className="text-cream-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { clsx } from 'clsx';