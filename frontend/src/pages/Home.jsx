import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Truck, Shield, Star, Camera as Instagram, MessageCircle, ChevronRight, Flower2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, newRes, bestRes, catRes, reviewRes, galleryRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/new-arrivals'),
          api.get('/products/best-sellers'),
          api.get('/products/categories'),
          api.get('/reviews?limit=6'),
          api.get('/gallery/instagram'),
        ]);

        setFeaturedProducts(featuredRes.data.products || []);
        setNewArrivals(newRes.data.products || []);
        setBestSellers(bestRes.data.products || []);
        setCategories(catRes.data.categories || []);
        setReviews(reviewRes.data.reviews || []);
        setGalleryImages(galleryRes.data.images || []);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoriesList = [
    { name: 'Flowers', icon: Flower2, slug: 'Flowers', count: '24', color: 'bg-cream-100' },
    { name: 'Bags', icon: Sparkles, slug: 'Bags', count: '18', color: 'bg-sage-100' },
    { name: 'Accessories', icon: Heart, slug: 'Accessories', count: '32', color: 'bg-cream-200' },
    { name: 'Home Decor', icon: Truck, slug: 'Home Decor', count: '15', color: 'bg-amber-100' },
    { name: 'Plushies', icon: Sparkles, slug: 'Plushies', count: '12', color: 'bg-pink-100' },
    { name: 'Keychains', icon: Heart, slug: 'Keychains', count: '28', color: 'bg-blue-100' },
    { name: 'Gifts', icon: Sparkles, slug: 'Gifts', count: '20', color: 'bg-purple-100' },
  ];

  const features = [
    { icon: Heart, title: '100% Handmade', desc: 'Every piece crafted with love' },
    { icon: Shield, title: 'Secure Payments', desc: 'Protected & trusted checkout' },
    { icon: Truck, title: 'Carefully Packed', desc: 'Gift-ready packaging' },
    { icon: Sparkles, title: 'Made With Love', desc: 'Every stitch matters' },
  ];

  const howItWorks = [
    { step: '01', title: 'Tell us your idea', desc: 'Share your vision, colors, and style preferences' },
    { step: '02', title: 'We design your piece', desc: 'Our artisans create a custom design just for you' },
    { step: '03', title: 'We crochet it by hand', desc: 'Every stitch made with patience and care' },
    { step: '04', title: 'We carefully pack it', desc: 'Gift-wrapped with love and attention' },
    { step: '05', title: 'It reaches you', desc: 'Delivered to your doorstep with joy' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="animate-pulse-soft text-cream-500 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-cream-100 to-beige-100" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23EC4899%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-cream-300/50 rounded-full animate-float blur-xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-sage-200/50 rounded-full animate-float blur-xl" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-cream-200/50 rounded-full animate-float blur-xl" style={{ animationDelay: '4s' }} />

        <div className="container-custom relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-beige-200 mb-8 animate-slide-up">
              <Flower2 className="w-5 h-5 text-cream-500" />
              <span className="text-sm font-medium text-brown-700">Handmade with love since 2022</span>
            </div>
            
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-medium text-brown-900 leading-tight mb-6 animate-slide-up animate-delay-100">
              Handmade with love,{' '}
              <br />
              <span className="text-cream-600">one stitch at a time.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-brown-600 max-w-2xl mx-auto mb-10 animate-slide-up animate-delay-200">
              Beautiful crochet creations made slowly, thoughtfully and especially for you. 
              From eternal flowers to cozy accessories, each piece tells a story.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animate-delay-300">
              <Link to="/shop" className="btn-primary text-lg px-8 py-4 group">
                Shop Collection
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/custom-orders" className="btn-outline text-lg px-8 py-4">
                Create Something Custom
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-slide-up animate-delay-400">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-brown-600">
                  <feature.icon className="w-5 h-5 text-cream-500" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-pulse-soft">
          <ChevronRight className="w-6 h-6 text-cream-400 rotate-90" />
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="section bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title text-left">Featured Collection</h2>
                <p className="section-subtitle text-left mx-0">Discover our handmade crochet favorites</p>
              </div>
              <Link to="/shop" className="btn-outline hidden sm:inline-flex">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/shop" className="btn-outline inline-flex">
                Explore All Products
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find the perfect handmade piece for every moment</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {categoriesList.map((category, index) => (
              <Link
                key={category.name}
                to={`/shop?category=${category.slug}`}
                className="group relative aspect-square rounded-card-lg overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <category.icon className="w-12 h-12 text-cream-500 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                <img
                  src={`https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=400&q=80&sat=-20&hue=30&brightness=10${index}`}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-heading font-medium">{category.name}</h3>
                  <p className="text-cream-300 text-sm">{category.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Handmade Difference */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-square rounded-card-lg overflow-hidden shadow-card-lg">
                <img
                  src="https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800&q=80"
                  alt="Handmade crochet process"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-cream-500 rounded-full flex items-center justify-center animate-float">
                <Flower2 className="w-16 h-16 text-white" />
              </div>
            </div>
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-cream-100 text-cream-700 text-sm font-medium mb-4">
                The Handmade Difference
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-medium text-brown-900 mb-6 leading-tight">
                Why handmade feels different
              </h2>
              <p className="text-lg text-brown-600 mb-8 leading-relaxed">
                Every loop takes time. Every stitch takes patience. Every piece carries a little part 
                of the person who made it. When you choose handmade, you're not just buying a product — 
                you're supporting a dream, a passion, and countless hours of dedication.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Made with premium, sustainable materials',
                  'Each piece is unique with slight variations',
                  'Supports small business & local artisans',
                  'Thoughtfully designed for lasting beauty',
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Star className="w-4 h-4 text-cream-500 fill-current" />
                    </div>
                    <span className="text-brown-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/about" className="btn-outline inline-flex">
                Explore Our Story
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="section bg-cream-50">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title text-left">Best Sellers</h2>
                <p className="section-subtitle text-left mx-0">Loved by our community</p>
              </div>
              <Link to="/shop?bestSeller=true" className="btn-outline hidden sm:inline-flex">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.slice(0, 4).map((product, index) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Custom Orders */}
      <section className="section bg-brown-900 text-cream-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23EC4899%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-4xl sm:text-5xl font-medium mb-6">
              Dream it. We&apos;ll crochet it.
            </h2>
            <p className="text-lg text-cream-300 mb-10">
              Have something special in mind? Tell us what you're imagining and we'll create it for you.
              From custom color combinations to personalized designs, your dream piece is just a message away.
            </p>
            <Link to="/custom-orders" className="btn-accent text-lg px-8 py-4 inline-flex">
              Request Custom Order
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
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
            {howItWorks.map((step, index) => (
              <div key={step.step} className="text-center relative">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-cream-100 flex items-center justify-center">
                    <span className="font-heading text-2xl font-bold text-cream-600">{step.step}</span>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-beige-200 -z-10" />
                  )}
                </div>
                <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">{step.title}</h3>
                <p className="text-brown-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Occasion Based Gifts */}
      <section className="section bg-cream-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Made for every little occasion</h2>
            <p className="section-subtitle">Find the perfect handmade gift</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'Birthday', emoji: '🎂' },
              { name: 'Anniversary', emoji: '💐' },
              { name: 'Valentine\'s Day', emoji: '💕' },
              { name: 'Just Because', emoji: '🎁' },
              { name: 'Bridesmaid Gifts', emoji: '🌸' },
              { name: 'Home Decor', emoji: '🏠' },
              { name: 'Graduation', emoji: '🎓' },
              { name: 'Personalized', emoji: '💝' },
            ].map((occasion) => (
              <Link
                key={occasion.name}
                to={`/shop?occasion=${occasion.name.toLowerCase()}`}
                className="group p-6 rounded-card-lg bg-white text-center shadow-card hover:shadow-card-hover transition-all duration-300 border border-beige-200 hover:border-cream-300"
              >
                <span className="text-3xl mb-2 block animate-float">{occasion.emoji}</span>
                <h3 className="font-medium text-brown-900 group-hover:text-cream-600 transition-colors">{occasion.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      {galleryImages.length > 0 && (
        <section className="section bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title text-left">A little piece of our crochet world</h2>
                <p className="section-subtitle text-left mx-0">Follow our handmade journey</p>
              </div>
              <a href="https://instagram.com/crochet_diariiies" target="_blank" rel="noopener noreferrer" className="btn-outline hidden sm:inline-flex">
                Follow @Crochet_Diariiies
                <Instagram className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {galleryImages.slice(0, 12).map((image, index) => (
                <a
                  key={image._id}
                  href={image.instagramUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-lg group"
                >
                  <img
                    src={image.image?.url || `https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=400&q=80&sat=-20&hue=30&brightness=10${index}`}
                    alt={image.alt || 'Crochet creation'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex space-x-3">
                      <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-cream-100 transition-colors">
                        <Heart className="w-5 h-5 text-brown-700" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-cream-100 transition-colors">
                        <MessageCircle className="w-5 h-5 text-brown-700" />
                      </button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="https://instagram.com/crochet_diariiies" target="_blank" rel="noopener noreferrer" className="btn-outline inline-flex">
                View More on Instagram
                <Instagram className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="section bg-cream-50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="section-title">Loved by people who love handmade</h2>
              <p className="section-subtitle">Real stories from our crochet family</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.slice(0, 3).map((review) => (
                <div key={review._id} className="card p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={clsx('w-5 h-5 fill-current', i < review.rating ? 'text-cream-500' : 'text-cream-200')} />
                    ))}
                  </div>
                  <p className="text-brown-700 mb-4 leading-relaxed">"{review.comment || review.title}"</p>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-cream-100 flex items-center justify-center">
                      <span className="font-medium text-brown-700">
                        {review.user?.name?.charAt(0) || 'C'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-brown-900 text-sm">{review.user?.name || 'Happy Customer'}</p>
                      <p className="text-cream-500 text-xs">Verified Purchase</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/reviews" className="btn-outline inline-flex">
                Read All Reviews
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gift Banner */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="relative rounded-card-lg overflow-hidden bg-gradient-to-r from-cream-100 via-cream-50 to-sage-50 p-8 md:p-16">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23EC4899%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
            <div className="relative max-w-2xl">
              <h2 className="font-heading text-3xl sm:text-4xl font-medium text-brown-900 mb-4">
                Skip the ordinary. Gift something handmade.
              </h2>
              <p className="text-lg text-brown-600 mb-8">
                Because the best gifts aren't mass-produced. Choose from curated gift boxes or create a custom bundle.
              </p>
              <Link to="/shop?category=Gifts" className="btn-primary inline-flex">
                Shop Gifts
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            <div className="absolute bottom-0 right-0 md:block hidden">
              <img
                src="https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=400&q=80"
                alt="Crochet gift box"
                className="w-64 h-auto opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section bg-brown-900 text-cream-100">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-medium mb-4">
              Stay in our little crochet world
            </h2>
            <p className="text-cream-300 mb-8">
              Get first access to new drops, custom creations and special offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing! 💕'); }}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-btn bg-brown-800 border border-brown-700 text-white placeholder:text-cream-500 focus:outline-none focus:ring-2 focus:ring-cream-500 focus:border-transparent"
                required
              />
              <button type="submit" className="btn-accent whitespace-nowrap">
                Join Us ♡
              </button>
            </form>
            <p className="text-cream-500 text-xs mt-4">No spam, just crochet love. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </>
  );
}