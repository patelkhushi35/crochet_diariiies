import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, Shield, Heart, ShoppingBag, Minus, Plus, Share2, ChevronRight, ChevronDown, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { clsx } from 'clsx';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewLoading, setReviewLoading] = useState(false);

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const wishlisted = product ? isInWishlist(product._id) : false;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          api.get(`/products/${slug}`),
          api.get(`/reviews/product/${slug}?limit=10`),
        ]);
        setProduct(productRes.data.product);
        setProduct(p => p ? { ...p, reviews: productRes.data.reviews } : null);
        setReviews(productRes.data.reviews || []);
        setRelatedProducts(productRes.data.relatedProducts || []);
        
        if (productRes.data.product?.colors?.length > 0) {
          setSelectedColor(productRes.data.product.colors[0].name);
        }
        if (productRes.data.product?.sizes?.length > 0) {
          setSelectedSize(productRes.data.product.sizes[0].name);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product) toggleWishlist(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-pulse-soft text-cream-500 text-lg">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl text-brown-900 mb-2">Product not found</h1>
          <Link to="/shop" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 
    ? product.images.map(img => img.url) 
    : ['https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=800'];

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-beige-200 py-4" aria-label="Breadcrumb">
        <div className="container-custom">
          <ol className="flex items-center space-x-2 text-sm text-cream-500">
            <li><Link to="/" className="hover:text-brown-700">Home</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li><Link to="/shop" className="hover:text-brown-700">Shop</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li><Link to={`/shop?category=${product.category}`} className="hover:text-brown-700">{product.category}</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-brown-900 font-medium truncate max-w-xs">{product.name}</li>
          </ol>
        </div>
      </nav>

      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-card-lg overflow-hidden bg-cream-100">
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNewArrival && <span className="badge-new">New</span>}
                  {product.isBestSeller && <span className="badge-bestseller">Best Seller</span>}
                  {discount > 0 && <span className="badge-sale">{discount}% OFF</span>}
                </div>

                {/* Wishlist */}
                <button
                  onClick={handleWishlist}
                  className={clsx(
                    'absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all',
                    wishlisted ? 'bg-white text-cream-500' : 'bg-white/80 text-brown-600 hover:bg-white'
                  )}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={clsx('w-5 h-5', wishlisted && 'fill-current')} />
                </button>

                {/* Share */}
                <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white transition-colors" aria-label="Share">
                  <Share2 className="w-5 h-5 text-brown-600" />
                </button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={clsx(
                        'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                        activeImage === index ? 'border-cream-500' : 'border-transparent hover:border-cream-300'
                      )}
                      aria-label={`View image ${index + 1}`}
                      aria-current={activeImage === index ? 'true' : 'false'}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {product.rating?.average > 0 && (
                  <>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={clsx('w-5 h-5 fill-current', i < Math.round(product.rating.average) ? 'text-cream-500' : 'text-cream-200')} />
                      ))}
                    </div>
                    <span className="text-brown-700 font-medium">{product.rating.average.toFixed(1)}</span>
                    <span className="text-cream-500">({product.rating.count} reviews)</span>
                  </>
                )}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl font-medium text-brown-900 mb-4">{product.name}</h1>

              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-3xl font-bold text-brown-900">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-cream-400 line-through">₹{product.originalPrice}</span>
                )}
                {discount > 0 && (
                  <span className="bg-cream-100 text-cream-700 px-3 py-1 rounded-full text-sm font-medium">{discount}% OFF</span>
                )}
              </div>

              <p className="text-brown-600 mb-6 leading-relaxed">{product.shortDescription}</p>

              {/* Color Selection */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <label className="label">Color</label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={clsx(
                          'flex items-center space-x-2 px-4 py-2 rounded-btn border-2 transition-all',
                          selectedColor === color.name 
                            ? 'border-cream-500 bg-cream-50' 
                            : 'border-beige-300 hover:border-cream-400'
                        )}
                        aria-pressed={selectedColor === color.name}
                      >
                        <span className="w-5 h-5 rounded-full border border-beige-300" style={{ backgroundColor: color.hex }} />
                        <span className="text-sm font-medium text-brown-700">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <label className="label">Size</label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        className={clsx(
                          'px-5 py-2.5 rounded-btn border-2 font-medium transition-all',
                          selectedSize === size.name 
                            ? 'border-cream-500 bg-cream-50 text-cream-700' 
                            : 'border-beige-300 text-brown-700 hover:border-cream-400'
                        )}
                        aria-pressed={selectedSize === size.name}
                      >
                        {size.name}
                        {size.price !== product.price && (
                          <span className="ml-2 text-sm text-cream-600">(+₹{size.price - product.price})</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="label">Quantity</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-beige-300 rounded-btn overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-brown-600 hover:bg-cream-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="px-4 py-2 font-medium text-brown-900 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-brown-600 hover:bg-cream-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <span className="text-sm text-cream-500">Stock: {product.stock} available</span>
                </div>
              </div>

              {/* Availability & Prep Time */}
              <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-cream-50 rounded-btn">
                <div className="flex items-center space-x-2 text-brown-700">
                  <Check className="w-5 h-5 text-sage-600 flex-shrink-0" />
                  <span className="text-sm">In stock - Ready to ship</span>
                </div>
                {product.preparationTime && (
                  <div className="flex items-center space-x-2 text-brown-700">
                    <Truck className="w-5 h-5 text-cream-500 flex-shrink-0" />
                    <span className="text-sm">Est. preparation: {product.preparationTime} days</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="btn-primary text-lg py-4 flex-1"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-outline text-lg py-4 flex-1"
                >
                  Buy Now
                </button>
              </div>

              {/* Secondary Actions */}
              <div className="flex items-center space-x-4 mb-8">
                <button onClick={handleWishlist} className={clsx('flex items-center space-x-2 text-brown-600 hover:text-cream-600 transition-colors', wishlisted && 'text-cream-500')}>
                  <Heart className={clsx('w-5 h-5', wishlisted && 'fill-current')} />
                  <span>{wishlisted ? 'Saved' : 'Add to Wishlist'}</span>
                </button>
                <button className="flex items-center space-x-2 text-brown-600 hover:text-cream-600 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-beige-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-cream-500" />
                  </div>
                  <div>
                    <p className="font-medium text-brown-900 text-sm">Free Shipping</p>
                    <p className="text-cream-500 text-xs">On orders over ₹999</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-cream-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cream-500" />
                  </div>
                  <div>
                    <p className="font-medium text-brown-900 text-sm">Secure Payment</p>
                    <p className="text-cream-500 text-xs">100% protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16">
            <div className="border-b border-beige-200 mb-8">
              <nav className="flex space-x-8" aria-label="Product tabs">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'details', label: 'Details' },
                  { id: 'care', label: 'Care Instructions' },
                  { id: 'shipping', label: 'Shipping' },
                  { id: 'reviews', label: `Reviews (${product.rating?.count || 0})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                      activeTab === tab.id
                        ? 'border-cream-500 text-cream-600'
                        : 'border-transparent text-cream-500 hover:text-brown-700'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="prose prose-brown max-w-none">
              {activeTab === 'description' && (
                <div>
                  <p className="text-brown-700 leading-relaxed mb-4">{product.description}</p>
                  {product.materials?.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-heading font-medium text-brown-900 mb-3">Materials</h4>
                      <ul className="list-disc list-inside space-y-1 text-brown-700">
                        {product.materials.map((material, i) => (
                          <li key={i}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="mt-6">
                      <h4 className="font-heading font-medium text-brown-900 mb-3">Dimensions</h4>
                      <p className="text-brown-700">
                        {product.dimensions.length}L × {product.dimensions.width}W × {product.dimensions.height}H cm
                        {product.dimensions.weight && `, Weight: ${product.dimensions.weight}g`}
                      </p>
                    </div>
                  )}
                  <p className="mt-6 text-cream-600 italic">
                    Every piece is handmade, so tiny variations are part of its charm.
                  </p>
                </div>
              )}

              {activeTab === 'details' && (
                <dl className="space-y-4">
                  {[
                    ['Category', product.category],
                    ['Sub-category', product.subCategory || 'N/A'],
                    ['SKU', product.sku],
                    ['Preparation Time', `${product.preparationTime} days`],
                    ['Customizable', product.isCustomizable ? 'Yes' : 'No'],
                    ['Materials', product.materials?.join(', ') || 'N/A'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-3 border-b border-beige-200">
                      <dt className="text-cream-600">{label}</dt>
                      <dd className="font-medium text-brown-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {activeTab === 'care' && (
                <div>
                  <p className="text-brown-700 mb-4">To keep your crochet piece beautiful for years to come:</p>
                  <ul className="space-y-3">
                    {(product.careInstructions?.length > 0 ? product.careInstructions : [
                      'Keep away from excessive moisture',
                      'Spot clean gently with a damp cloth',
                      'Do not bleach or use harsh chemicals',
                      'Store in a dry place when not displayed',
                      'Handle delicate handmade pieces carefully',
                      'Avoid direct sunlight for extended periods',
                    ]).map((instruction, i) => (
                      <li key={i} className="flex items-start space-x-3 text-brown-700">
                        <Check className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" />
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <div className="p-4 bg-cream-50 rounded-btn">
                    <h4 className="font-heading font-medium text-brown-900 mb-2">Shipping Information</h4>
                    <ul className="space-y-2 text-brown-700">
                      <li>• Free shipping on orders over ₹999</li>
                      <li>• Standard shipping: ₹99 (3-5 business days)</li>
                      <li>• Express shipping: ₹199 (1-2 business days)</li>
                      <li>• Handmade items may take additional preparation time</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-cream-50 rounded-btn">
                    <h4 className="font-heading font-medium text-brown-900 mb-2">Returns & Exchanges</h4>
                    <ul className="space-y-2 text-brown-700">
                      <li>• 7-day return policy for unused items</li>
                      <li>• Custom/personalized items cannot be returned</li>
                      <li>• Return shipping paid by customer</li>
                      <li>• Refunds processed within 5-7 business days</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  {reviews.length > 0 ? (
                    <>
                      <div className="space-y-6 mb-8">
                        {reviews.map((review) => (
                          <div key={review._id} className="p-4 bg-white rounded-btn border border-beige-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={clsx('w-4 h-4 fill-current', i < review.rating ? 'text-cream-500' : 'text-cream-200')} />
                                ))}
                              </div>
                              <span className="text-cream-500 text-sm">{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}</span>
                            </div>
                            {review.title && <h4 className="font-medium text-brown-900 mb-1">{review.title}</h4>}
                            <p className="text-brown-700">{review.comment}</p>
                            <div className="flex items-center space-x-2 mt-3">
                              <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center">
                                <span className="font-medium text-brown-700 text-sm">
                                  {review.user?.name?.charAt(0) || 'C'}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-brown-900 text-sm">{review.user?.name || 'Customer'}</p>
                                {review.isVerifiedPurchase && <p className="text-cream-500 text-xs">Verified Purchase</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-brown-600 text-center py-8">No reviews yet. Be the first to review!</p>
                  )}
                  <Link to="/login" className="btn-outline inline-flex">
                    Write a Review
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              )}
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <section className="mt-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-heading text-2xl font-medium text-brown-900">You may also like</h2>
                  <Link to="/shop" className="text-cream-600 hover:text-cream-700 font-medium text-sm">View all</Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <ProductCard key={relatedProduct._id} product={relatedProduct} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}