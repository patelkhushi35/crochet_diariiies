import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Loader2, Heart, Sparkles, Truck, Shield, Camera as Instagram } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', formData);
      setSubmitted(true);
      toast.success('Message sent! We\'ll get back to you soon 💕');
    } catch (error) {
      toast.error('Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, title: 'Visit Our Studio', desc: '123 Yarn Lane, Creative District, Mumbai 400001', action: 'Get Directions', href: 'https://maps.google.com' },
    { icon: Phone, title: 'Call Us', desc: '+91 98765 43210', action: 'Call Now', href: 'tel:+919876543210' },
    { icon: Mail, title: 'Email Us', desc: 'hello@crochetdiaries.com', action: 'Send Email', href: 'mailto:hello@crochetdiaries.com' },
    { icon: Clock, title: 'Business Hours', desc: 'Mon-Sat: 10AM - 7PM\nSun: Closed', action: null, href: null },
  ];

  const faqs = [
    { q: 'How long does a custom order take?', a: 'Custom orders typically take 7-21 days depending on complexity. We\'ll give you a timeline after discussing your idea.' },
    { q: 'Do you ship internationally?', a: 'Currently we ship within India only. International shipping may be available for bulk orders - contact us for details.' },
    { q: 'Can I request specific colors?', a: 'Absolutely! We offer a wide range of colors and can match specific shades. Just let us know your preferences.' },
    { q: 'What if I\'m not satisfied with my order?', a: 'We want you to love your piece! Contact us within 7 days for returns/exchanges on non-custom items.' },
    { q: 'How do I care for my crochet items?', a: 'Keep away from moisture, spot clean gently, store in a dry place. Detailed care instructions come with every order.' },
    { q: 'Do you offer gift wrapping?', a: 'Yes! All orders come beautifully packaged. You can also add a handwritten note at checkout.' },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 text-cream-100 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23EC4899%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-medium mb-6 leading-tight">
              Let's create something lovely
            </h1>
            <p className="text-lg text-cream-300 max-w-2xl mx-auto">
              Have a question? Want to discuss a custom order? We'd love to hear from you. 
              Drop us a line and we'll get back to you within 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="card p-6 hover:shadow-card-hover transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-cream-500" />
                    </div>
                    <h3 className="font-heading font-medium text-brown-900 mb-2">{item.title}</h3>
                    <p className="text-brown-600 whitespace-pre-line mb-4">{item.desc}</p>
                    {item.action && (
                      <a href={item.href} className="inline-flex items-center space-x-1 text-cream-600 hover:text-cream-700 font-medium text-sm">
                        <span>{item.action}</span>
                        <Sparkles className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}

                {/* Social Links */}
                <div className="card p-6">
                  <h3 className="font-heading font-medium text-brown-900 mb-4">Follow Our Journey</h3>
                  <div className="flex space-x-3">
                    <a href="https://instagram.com/crochet_diariiies" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors" aria-label="Instagram">
                      <Instagram className="w-5 h-5 text-brown-700" />
                    </a>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 transition-colors" aria-label="WhatsApp">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </a>
                    <a href="https://pinterest.com/crochet_diariiies" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center hover:bg-cream-200 transition-colors" aria-label="Pinterest">
                      <Sparkles className="w-5 h-5 text-brown-700" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="card p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sage-100 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-sage-600 fill-current" />
                  </div>
                  <h2 className="font-heading text-2xl font-medium text-brown-900 mb-3">Message Sent!</h2>
                  <p className="text-brown-600 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-primary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="card p-8">
                  <h2 className="font-heading text-2xl font-medium text-brown-900 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="label">Full Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="label">Email *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="label">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="label">Subject *</label>
                        <select id="subject" name="subject" value={formData.subject} onChange={handleChange} className="input appearance-none bg-white" required>
                          <option value="">Select a topic</option>
                          <option value="custom-order">Custom Order Inquiry</option>
                          <option value="product-question">Product Question</option>
                          <option value="order-status">Order Status</option>
                          <option value="wholesale">Wholesale/Bulk Order</option>
                          <option value="collaboration">Collaboration</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="message" className="label">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                        className="input resize-none"
                        required
                      />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto py-3">
                      {submitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="section-subtitle">Quick answers to common questions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <details key={index} className="card p-6 group">
                  <summary className="flex items-start space-x-3 cursor-pointer list-none">
                    <div className="w-8 h-8 flex-shrink-0 mt-0.5 rounded-lg bg-cream-100 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-cream-500 fill-current" />
                    </div>
                    <span className="font-medium text-brown-900">{faq.q}</span>
                  </summary>
                  <p className="mt-4 text-brown-600 text-sm leading-relaxed pl-11">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section bg-brown-900 text-cream-100">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { icon: Heart, title: '100% Handmade', desc: 'Every stitch with love' },
              { icon: Shield, title: 'Secure Payments', desc: 'Protected checkout' },
              { icon: Truck, title: 'Careful Packing', desc: 'Gift-ready delivery' },
              { icon: Sparkles, title: 'Made With Love', desc: 'Your happiness matters' },
            ].map((item, index) => (
              <div key={index}>
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-brown-800 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-cream-400" />
                </div>
                <h3 className="font-heading font-medium text-white mb-1">{item.title}</h3>
                <p className="text-cream-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}