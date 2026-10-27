import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Loader2, MoreVertical, Check, X, Filter } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const categories = ['Flowers', 'Bags', 'Accessories', 'Home Decor', 'Plushies', 'Keychains', 'Gifts', 'Custom Creations'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const formData = {
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 0,
    originalPrice: 0,
    category: 'Flowers',
    subCategory: '',
    colors: [{ name: '', hex: '' }],
    sizes: [{ name: '', price: 0, stock: 0 }],
    stock: 0,
    sku: '',
    tags: '',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isCustomizable: false,
    preparationTime: 7,
    careInstructions: [''],
    materials: [''],
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 20 });
      if (search) params.set('search', search);
      const res = await api.get(`/products/admin/all?${params.toString()}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], defaultItem] }));
  };

  const removeArrayItem = (arrayName, index) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const openCreateModal = () => {
    resetForm();
    setEditingProduct(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      category: product.category,
      subCategory: product.subCategory || '',
      colors: product.colors?.length > 0 ? product.colors : [{ name: '', hex: '' }],
      sizes: product.sizes?.length > 0 ? product.sizes : [{ name: '', price: 0, stock: 0 }],
      stock: product.stock,
      sku: product.sku || '',
      tags: product.tags?.join(', ') || '',
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      isCustomizable: product.isCustomizable,
      preparationTime: product.preparationTime || 7,
      careInstructions: product.careInstructions?.length > 0 ? product.careInstructions : [''],
      materials: product.materials?.length > 0 ? product.materials : [''],
    });
    setImages(product.images || []);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDescription: '',
      price: 0,
      originalPrice: 0,
      category: 'Flowers',
      subCategory: '',
      colors: [{ name: '', hex: '' }],
      sizes: [{ name: '', price: 0, stock: 0 }],
      stock: 0,
      sku: '',
      tags: '',
      isFeatured: false,
      isNewArrival: false,
      isBestSeller: false,
      isCustomizable: false,
      preparationTime: 7,
      careInstructions: [''],
      materials: [''],
    });
    setImages([]);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setImages(prev => [...prev, { url: res.data.url, publicId: res.data.publicId }]);
      } catch (error) {
        toast.error('Failed to upload image');
      }
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        colors: formData.colors.filter(c => c.name && c.hex),
        sizes: formData.sizes.filter(s => s.name),
        careInstructions: formData.careInstructions.filter(c => c.trim()),
        materials: formData.materials.filter(m => m.trim()),
        images: images.map(img => ({ url: img.url, publicId: img.publicId, alt: formData.name })),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product created!');
      }
      closeModal();
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const statusBadge = (product) => {
    const badges = [];
    if (product.isFeatured) badges.push(<span key="featured" className="badge badge-new">Featured</span>);
    if (product.isNewArrival) badges.push(<span key="new" className="badge badge-new">New</span>);
    if (product.isBestSeller) badges.push(<span key="bestseller" className="badge badge-bestseller">Best Seller</span>);
    if (!product.isActive) badges.push(<span key="inactive" className="badge" style={{background:'#fee2e2',color:'#dc2626' }}>Inactive</span>);
    return badges;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium text-brown-900">Products</h1>
          <p className="text-brown-600">Manage your handmade product catalog</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Search & Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input appearance-none bg-white w-auto">
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-beige-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-beige-200 rounded w-1/3" />
                    <div className="h-3 bg-beige-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-cream-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-cream-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-200">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-cream-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1598899038858-077b9b3b8f01?w=400'} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-brown-900">{product.name}</p>
                          <p className="text-cream-500 text-sm">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-cream-100 text-cream-700">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-brown-900">₹{product.price}</p>
                      {product.originalPrice && <p className="text-cream-500 text-xs line-through">₹{product.originalPrice}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx('font-medium', product.stock < 10 ? 'text-red-600' : 'text-brown-900')}>{product.stock}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {statusBadge(product)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => openEditModal(product)} className="p-2 text-cream-500 hover:text-cream-600 hover:bg-cream-100 rounded-lg" aria-label="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-cream-300" />
            <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">No products found</h3>
            <p className="text-brown-600">Get started by adding your first handmade product</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-beige-200 flex items-center justify-between">
            <span className="text-sm text-cream-500">Page {currentPage} of {totalPages}</span>
            <div className="flex space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary w-10 h-10"><ChevronRight className="w-5 h-5 rotate-180" /></button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={clsx('w-10 h-10 rounded-btn font-medium', currentPage === pageNum ? 'bg-brown-900 text-white' : 'bg-white text-brown-700 hover:bg-cream-100 border border-beige-200')}>{pageNum}</button>;
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary w-10 h-10"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-card-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-beige-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="font-heading text-xl font-medium text-brown-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal} className="p-2 text-cream-500 hover:text-brown-700"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="label">Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} className="input" required />
                </div>
                <div>
                  <label className="label">Slug *</label>
                  <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="input" required />
                </div>
                <div className="lg:col-span-2">
                  <label className="label">Short Description *</label>
                  <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows={2} className="input resize-none" required />
                </div>
                <div className="lg:col-span-2">
                  <label className="label">Full Description *</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="input resize-none" required />
                </div>
                <div>
                  <label className="label">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input appearance-none bg-white" required>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Sub-category</label>
                  <input type="text" name="subCategory" value={formData.subCategory} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="label">Price (₹) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className="input" min="0" step="1" required />
                </div>
                <div>
                  <label className="label">Original Price (₹)</label>
                  <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="input" min="0" step="1" />
                </div>
                <div>
                  <label className="label">Stock *</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="input" min="0" required />
                </div>
                <div>
                  <label className="label">SKU</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="input" />
                </div>
                <div>
                  <label className="label">Preparation Time (days)</label>
                  <input type="number" name="preparationTime" value={formData.preparationTime} onChange={handleChange} className="input" min="1" />
                </div>
                <div className="lg:col-span-2">
                  <label className="label">Tags (comma separated)</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="input" placeholder="handmade, gift, flowers" />
                </div>

                {/* Colors */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0">Colors</label>
                    <button type="button" onClick={() => addArrayItem('colors', { name: '', hex: '' })} className="text-sm text-cream-600 hover:text-cream-700">+ Add Color</button>
                  </div>
                  <div className="space-y-2">
                    {formData.colors.map((color, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="text" placeholder="Color name" value={color.name} onChange={e => handleArrayChange('colors', index, 'name', e.target.value)} className="input flex-1" />
                        <input type="color" value={color.hex || '#FCE7F3'} onChange={e => handleArrayChange('colors', index, 'hex', e.target.value)} className="w-12 h-10 rounded-btn border border-beige-300 cursor-pointer" />
                        {formData.colors.length > 1 && <button type="button" onClick={() => removeArrayItem('colors', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0">Sizes</label>
                    <button type="button" onClick={() => addArrayItem('sizes', { name: '', price: 0, stock: 0 })} className="text-sm text-cream-600 hover:text-cream-700">+ Add Size</button>
                  </div>
                  <div className="space-y-2">
                    {formData.sizes.map((size, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="text" placeholder="Size name" value={size.name} onChange={e => handleArrayChange('sizes', index, 'name', e.target.value)} className="input flex-1" />
                        <input type="number" placeholder="Price" value={size.price} onChange={e => handleArrayChange('sizes', index, 'price', Number(e.target.value))} className="input w-24" min="0" />
                        <input type="number" placeholder="Stock" value={size.stock} onChange={e => handleArrayChange('sizes', index, 'stock', Number(e.target.value))} className="input w-24" min="0" />
                        {formData.sizes.length > 1 && <button type="button" onClick={() => removeArrayItem('sizes', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Care Instructions */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0">Care Instructions</label>
                    <button type="button" onClick={() => addArrayItem('careInstructions', '')} className="text-sm text-cream-600 hover:text-cream-700">+ Add Instruction</button>
                  </div>
                  <div className="space-y-2">
                    {formData.careInstructions.map((instruction, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="text" value={instruction} onChange={e => handleArrayChange('careInstructions', index, '', e.target.value)} className="input flex-1" placeholder="e.g., Keep away from moisture" />
                        {formData.careInstructions.length > 1 && <button type="button" onClick={() => removeArrayItem('careInstructions', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <label className="label mb-0">Materials</label>
                    <button type="button" onClick={() => addArrayItem('materials', '')} className="text-sm text-cream-600 hover:text-cream-700">+ Add Material</button>
                  </div>
                  <div className="space-y-2">
                    {formData.materials.map((material, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input type="text" value={material} onChange={e => handleArrayChange('materials', index, '', e.target.value)} className="input flex-1" placeholder="e.g., Premium Cotton Yarn" />
                        {formData.materials.length > 1 && <button type="button" onClick={() => removeArrayItem('materials', index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded border-beige-300 text-cream-500 focus:ring-cream-500" />
                    <span className="text-sm text-brown-700">Featured</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleChange} className="w-4 h-4 rounded border-beige-300 text-cream-500 focus:ring-cream-500" />
                    <span className="text-sm text-brown-700">New Arrival</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="isBestSeller" checked={formData.isBestSeller} onChange={handleChange} className="w-4 h-4 rounded border-beige-300 text-cream-500 focus:ring-cream-500" />
                    <span className="text-sm text-brown-700">Best Seller</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" name="isCustomizable" checked={formData.isCustomizable} onChange={handleChange} className="w-4 h-4 rounded border-beige-300 text-cream-500 focus:ring-cream-500" />
                    <span className="text-sm text-brown-700">Customizable</span>
                  </label>
                </div>
              </div>

              {/* Images */}
              <div className="border-t border-beige-200 pt-6">
                <h3 className="font-heading font-medium text-brown-900 mb-4">Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-beige-200">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <label className="aspect-square rounded-lg border-2 border-dashed border-beige-300 flex flex-col items-center justify-center cursor-pointer hover:border-cream-400 hover:bg-cream-50 transition-colors">
                    <Plus className="w-8 h-8 text-cream-400 mb-2" />
                    <span className="text-sm text-cream-500">Add Images</span>
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="sr-only" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 border-t border-beige-200 pt-6 sticky bottom-0 bg-white">
                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}