import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, Filter, X, Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { clsx } from 'clsx';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [colors, setColors] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (sort) params.set('sort', sort);
      if (priceRange.min) params.set('minPrice', priceRange.min);
      if (priceRange.max) params.set('maxPrice', priceRange.max);
      if (colors.length > 0) params.set('colors', colors.join(','));
      params.set('page', currentPage);
      params.set('limit', 12);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/products/categories');
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, sort, priceRange, colors, currentPage]);

  const handleFilterChange = () => {
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (sort !== 'featured') params.set('sort', sort);
    if (priceRange.min) params.set('minPrice', priceRange.min);
    if (priceRange.max) params.set('maxPrice', priceRange.max);
    if (colors.length > 0) params.set('colors', colors.join(','));
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSort('featured');
    setPriceRange({ min: '', max: '' });
    setColors([]);
    setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = selectedCategory || sort !== 'featured' || priceRange.min || priceRange.max || colors.length > 0;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Page Header */}
      <section className="bg-white border-b border-beige-200 py-16 lg:py-24">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl sm:text-5xl font-medium text-brown-900 mb-4">
              Shop Handmade
            </h1>
            <p className="text-lg text-brown-600">
              Discover beautiful crochet creations made with love. Each piece is unique, 
              crafted with premium materials and attention to every detail.
            </p>
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="section">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className={clsx(
              'lg:w-64 flex-shrink-0',
              showFilters ? 'block' : 'hidden lg:block'
            )}>
              <div className="bg-white rounded-card-lg shadow-card p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-lg font-medium text-brown-900">Filters</h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-sm text-cream-600 hover:text-cream-700 font-medium">
                      Clear all
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="label">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); handleFilterChange(); }}
                    className="input appearance-none bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat._id} ({cat.count})</option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <label className="label">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="input w-full"
                    />
                    <span className="text-cream-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="input w-full"
                    />
                  </div>
                  <button
                    onClick={() => { handleFilterChange(); }}
                    className="mt-2 btn-secondary text-sm w-full"
                  >
                    Apply
                  </button>
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <label className="label">Sort By</label>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); handleFilterChange(); }}
                    className="input appearance-none bg-white"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-secondary w-full"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters {hasActiveFilters && <span className="bg-cream-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2">{selectedCategory || 'Active'}</span>}
                  </button>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center space-x-4">
                  <span className="text-brown-600 text-sm">
                    {total} product{total !== 1 ? 's' : ''} found
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value); handleFilterChange(); }}
                    className="input appearance-none bg-white w-auto"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="flex items-center space-x-1 border border-beige-300 rounded-btn">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={clsx('p-2', viewMode === 'grid' ? 'bg-cream-100 text-cream-600' : 'text-cream-400 hover:text-brown-600')}
                      aria-label="Grid view"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={clsx('p-2', viewMode === 'list' ? 'bg-cream-100 text-cream-600' : 'text-cream-400 hover:text-brown-600')}
                      aria-label="List view"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="aspect-[4/5] bg-beige-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-beige-200 rounded w-3/4" />
                        <div className="h-4 bg-beige-200 rounded w-1/2" />
                        <div className="h-5 bg-beige-200 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className={clsx('gap-6', viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'space-y-4')}>
                    {products.map((product) => (
                      viewMode === 'grid' ? (
                        <ProductCard key={product._id} product={product} />
                      ) : (
                        <Link to={`/product/${product.slug}`} className="card flex flex-col sm:flex-row gap-4 p-4 group hover:shadow-card-hover transition-shadow">
                          <div className="relative w-full sm:w-48 flex-shrink-0 aspect-square rounded-lg overflow-hidden bg-cream-100">
                            <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=400'} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-heading font-medium text-brown-900 mb-1">{product.name}</h3>
                              <p className="text-lg font-bold text-brown-900">₹{product.price}</p>
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                              <button onClick={(e) => handleAddToCart(e, product)} className="btn-primary text-sm flex-1">Add to Cart</button>
                              <button onClick={(e) => handleWishlist(e, product)} className={clsx('w-10 h-10 rounded-btn flex items-center justify-center', isInWishlist(product._id) ? 'bg-cream-100 text-cream-500' : 'bg-cream-100 text-brown-600 hover:bg-cream-200')}>
                                <Heart className={clsx('w-5 h-5', isInWishlist(product._id) && 'fill-current')} />
                              </button>
                            </div>
                          </div>
                        </Link>
                      )
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 mt-12">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="btn-secondary w-10 h-10"
                        aria-label="Previous page"
                      >
                        <ChevronDown className="w-5 h-5 rotate-180" />
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) pageNum = i + 1;
                        else if (currentPage <= 3) pageNum = i + 1;
                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                        else pageNum = currentPage - 2 + i;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={clsx('w-10 h-10 rounded-btn font-medium', currentPage === pageNum ? 'bg-brown-900 text-white' : 'bg-white text-brown-700 hover:bg-cream-100 border border-beige-200')}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="btn-secondary w-10 h-10"
                        aria-label="Next page"
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cream-100 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-cream-400" />
                  </div>
                  <h3 className="font-heading text-xl text-brown-900 mb-2">No products found</h3>
                  <p className="text-brown-600 mb-6">Try adjusting your filters or search terms</p>
                  <button onClick={clearFilters} className="btn-outline">Clear Filters</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}