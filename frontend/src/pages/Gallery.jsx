import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Camera as Instagram, ChevronLeft, ChevronRight, X, Search, Grid } from 'lucide-react';
import api from '../utils/api';
import { clsx } from 'clsx';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [instagramImages, setInstagramImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['all', 'products', 'behind-the-scenes', 'work-in-progress', 'packaging', 'lifestyle', 'workshop'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const [galleryRes, instaRes] = await Promise.all([
          api.get('/gallery'),
          api.get('/gallery/instagram'),
        ]);
        setImages(galleryRes.data.images || []);
        setInstagramImages(instaRes.data.images || []);
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = images.filter(img => 
    activeCategory === 'all' || img.category === activeCategory
  ).filter(img => 
    !searchQuery || img.caption?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex(prev => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setLightboxIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brown-900 via-brown-800 to-brown-900 text-cream-100 py-20 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23EC4899%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-medium mb-6 leading-tight">
              A little piece of our crochet world
            </h1>
            <p className="text-lg text-cream-300 max-w-2xl mx-auto mb-8">
              Behind every creation is a story. Here's a glimpse into our workshop, our process, 
              and the love that goes into every stitch.
            </p>
            <a href="https://instagram.com/crochet_diariiies" target="_blank" rel="noopener noreferrer" className="btn-accent inline-flex items-center space-x-2">
              <Instagram className="w-5 h-5" />
              <span>Follow @Crochet_Diariiies</span>
            </a>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b border-beige-200 sticky top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
                    activeCategory === cat
                      ? 'bg-cream-500 text-white shadow-soft'
                      : 'bg-cream-100 text-brown-700 hover:bg-cream-200'
                  )}
                >
                  {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-400" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-64 sm:w-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-beige-200 animate-pulse" />
              ))}
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div
                  key={image._id}
                  className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.image?.url || `https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=400&q=80&sat=-20&hue=30&brightness=10${index}`}
                    alt={image.alt || image.caption || 'Crochet creation'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="w-full flex items-center justify-between text-white">
                      <div>
                        <p className="font-medium">{image.caption}</p>
                        <p className="text-xs text-cream-300 capitalize">{image.category}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="Like">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors" aria-label="Share">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Grid className="w-16 h-16 mx-auto mb-4 text-cream-400" />
              <h3 className="font-heading text-xl text-brown-900 mb-2">No images found</h3>
              <p className="text-brown-600">Try adjusting your filters or search</p>
            </div>
          )}
        </div>
      </section>

      {/* Instagram Feed */}
      {instagramImages.length > 0 && (
        <section className="section bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="section-title text-left">Instagram Feed</h2>
                <p className="section-subtitle text-left mx-0">Follow our daily crochet adventures</p>
              </div>
              <a href="https://instagram.com/crochet_diariiies" target="_blank" rel="noopener noreferrer" className="btn-outline hidden sm:inline-flex">
                Follow Us
                <Instagram className="w-4 h-4 ml-2" />
              </a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {instagramImages.slice(0, 12).map((image, index) => (
                <a
                  key={image._id}
                  href={image.instagramUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square overflow-hidden rounded-lg group"
                >
                  <img
                    src={image.image?.url || `https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=400&q=80&sat=-20&hue=30&brightness=10${index}`}
                    alt={image.alt || 'Instagram post'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Instagram className="w-8 h-8 text-white" />
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

      {/* Lightbox */}
      {lightboxOpen && filteredImages.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            className="absolute left-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          
          <div className="relative max-w-5xl max-h-[90vh]">
            <img
              src={filteredImages[lightboxIndex]?.image?.url || ''}
              alt={filteredImages[lightboxIndex]?.alt || ''}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
              <p className="font-medium">{filteredImages[lightboxIndex]?.caption}</p>
              <p className="text-sm text-cream-300 capitalize">{filteredImages[lightboxIndex]?.category}</p>
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            className="absolute right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {filteredImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(index); }}
                className={clsx('w-2 h-2 rounded-full transition-colors', index === lightboxIndex ? 'bg-white' : 'bg-white/30')}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}