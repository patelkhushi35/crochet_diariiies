import { useState, useEffect } from 'react';
import { Search, Star, Check, X, Loader2, Eye, Trash2, Filter } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [approvedFilter, setApprovedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, search, approvedFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 20 });
      if (approvedFilter) params.set('approved', approvedFilter);
      const res = await api.get(`/admin/reviews?${params.toString()}`);
      setReviews(res.data.reviews || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, approve) => {
    try {
      if (approve) {
        await api.put(`/admin/reviews/${id}/approve`);
        toast.success('Review approved!');
      } else {
        await api.put(`/admin/reviews/${id}/reject`);
        toast.success('Review rejected!');
      }
      fetchReviews();
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      fetchReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-4 animate-pulse">
          <div className="h-4 bg-beige-200 rounded w-1/4" />
        </div>
        <div className="card animate-pulse p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-beige-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium text-brown-900">Reviews</h1>
          <p className="text-brown-600">Moderate customer reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-400" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select value={approvedFilter} onChange={(e) => setApprovedFilter(e.target.value)} className="input appearance-none bg-white w-auto">
            <option value="">All Reviews</option>
            <option value="true">Approved</option>
            <option value="false">Pending</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="card overflow-hidden">
        {reviews.length > 0 ? (
          <div className="divide-y divide-beige-200">
            {reviews.map(review => (
              <div key={review._id} className="p-6 hover:bg-cream-50">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between lg:justify-start gap-4 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={clsx('w-5 h-5 fill-current', i < review.rating ? 'text-cream-500' : 'text-cream-200')} />
                          ))}
                        </div>
                        <span className="text-brown-700 font-medium">{review.rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-cream-500">
                        <span>{formatDate(review.createdAt)}</span>
                        {review.isVerifiedPurchase && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-sage-100 text-sage-700">Verified Purchase</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center">
                        <span className="font-medium text-brown-700 text-sm">
                          {review.user?.name?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-brown-900">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-cream-500 text-sm">{review.user?.email}</p>
                      </div>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-cream-100 text-cream-700">{review.product?.category}</span>
                      <span className="font-medium text-brown-900">{review.product?.name}</span>
                    </div>

                    {review.title && <h4 className="font-medium text-brown-900 mb-2">{review.title}</h4>}
                    <p className="text-brown-700 leading-relaxed">{review.comment}</p>

                    {review.images?.length > 0 && (
                      <div className="mt-3 flex space-x-2">
                        {review.images.slice(0, 4).map((img, index) => (
                          <img key={index} src={img.url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-3 lg:ml-8">
                    {!review.isApproved && (
                      <>
                        <button onClick={() => handleApprove(review._id, true)} className="btn-secondary text-sm">
                          <Check className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                        <button onClick={() => handleApprove(review._id, false)} className="btn-secondary text-sm border-red-300 text-red-600 hover:bg-red-50">
                          <X className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                      </>
                    )}
                    {review.isApproved && (
                      <span className="px-3 py-1 text-xs rounded-full bg-sage-100 text-sage-700">Approved</span>
                    )}
                    <button onClick={() => handleDelete(review._id)} className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Star className="w-16 h-16 mx-auto mb-4 text-cream-300" />
            <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">No reviews found</h3>
            <p className="text-brown-600">Try adjusting your filters</p>
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
    </div>
  );
}

import { ChevronRight } from 'lucide-react';