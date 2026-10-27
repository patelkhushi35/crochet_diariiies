import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { clsx } from 'clsx';

export default function ProductCard({ product, variant = 'default' }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isInWishlist(product._id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=400';
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  if (variant === 'compact') {
    return (
      <Link to={`/product/${product.slug}`} className="flex items-center space-x-3 group">
        <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-cream-100">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
          {wishlisted && <div className="absolute top-1 right-1 text-cream-500"><Heart className="w-4 h-4 fill-current" /></div>}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-brown-900 truncate">{product.name}</h4>
          <p className="text-cream-600 font-medium">₹{product.price}</p>
        </div>
      </Link>
    );
  }

  return (
    <article className="card card-hover-lift group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-cream-100">
          <img 
            src={imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNewArrival && <span className="badge-new">New</span>}
            {product.isBestSeller && <span className="badge-bestseller">Best Seller</span>}
            {discount > 0 && <span className="badge-sale">{discount}% OFF</span>}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={clsx(
              'absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200',
              wishlisted 
                ? 'bg-white text-cream-500' 
                : 'bg-white/80 text-brown-600 hover:bg-white hover:text-cream-500'
            )}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={clsx('w-5 h-5 transition-transform', wishlisted && 'fill-current scale-110')} />
          </button>

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-cream-100 transition-colors" aria-label="Quick view">
                <Eye className="w-5 h-5 text-brown-700" />
              </button>
              <button onClick={handleAddToCart} className="w-10 h-10 rounded-full bg-cream-500 flex items-center justify-center hover:bg-cream-600 transition-colors" aria-label="Add to cart">
                <ShoppingBag className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-heading font-medium text-brown-900 line-clamp-1 flex-1">
            <Link to={`/product/${product.slug}`} className="hover:text-cream-600 transition-colors">
              {product.name}
            </Link>
          </h3>
          {product.rating?.average > 0 && (
            <div className="flex items-center space-x-1 text-cream-500 text-sm flex-shrink-0">
              <Star className="w-4 h-4 fill-current" />
              <span>{product.rating.average.toFixed(1)}</span>
              <span className="text-cream-400">({product.rating.count})</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-lg font-bold text-brown-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-cream-400 line-through">₹{product.originalPrice}</span>
            )}
          </div>
          
          {product.preparationTime && (
            <span className="text-xs text-cream-500 bg-cream-100 px-2 py-1 rounded-full">
              {product.preparationTime} days
            </span>
          )}
        </div>

        <div className="mt-3 flex space-x-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 btn-primary text-sm py-2"
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
          <button
            onClick={handleWishlist}
            className={clsx(
              'w-10 rounded-btn flex items-center justify-center transition-colors',
              wishlisted ? 'bg-cream-100 text-cream-500' : 'bg-cream-100 text-brown-600 hover:bg-cream-200'
            )}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={clsx('w-5 h-5', wishlisted && 'fill-current')} />
          </button>
        </div>
      </div>
    </article>
  );
}