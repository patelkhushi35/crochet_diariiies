import { useState, useEffect } from 'react';
import { Plus, Image, Upload, Trash2, Loader2, GripVertical, Eye, Camera as Instagram, Check, X } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';

const categories = [
  { value: 'products', label: 'Products' },
  { value: 'behind-the-scenes', label: 'Behind the Scenes' },
  { value: 'work-in-progress', label: 'Work in Progress' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'workshop', label: 'Workshop' },
];

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const formData = {
    category: 'products',
    caption: '',
    tags: '',
    isInstagram: false,
    instagramUrl: '',
    order: 0,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/gallery?limit=100');
      setImages(res.data.images || []);
    } catch (error) {
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setDragActive(true);
  };

  const handleDragEnd = async (event) => {
    setDragActive(false);
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = images.findIndex(img => img._id === active.id);
      const newIndex = images.findIndex(img => img._id === over.id);
      const newImages = [...images];
      const [removed] = newImages.splice(oldIndex, 1);
      newImages.splice(newIndex, 0, removed);
      
      // Update order numbers
      const updatedImages = newImages.map((img, index) => ({ ...img, order: index }));
      setImages(updatedImages);
      
      // Send to backend
      try {
        await api.put('/admin/gallery/reorder', { images: updatedImages.map(img => ({ id: img._id, order: img.order })) });
      } catch (error) {
        toast.error('Failed to update order');
        fetchImages(); // Revert
      }
    }
  };

  const openCreateModal = () => {
    setEditingImage(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (image) => {
    setEditingImage(image);
    setFormData({
      category: image.category,
      caption: image.caption || '',
      tags: image.tags?.join(', ') || '',
      isInstagram: image.isInstagram,
      instagramUrl: image.instagramUrl || '',
      order: image.order,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingImage(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      category: 'products',
      caption: '',
      tags: '',
      isInstagram: false,
      instagramUrl: '',
      order: 0,
    });
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        await api.post('/gallery', {
          image: { url: res.data.url, publicId: res.data.publicId },
          category: formData.category,
          caption: formData.caption,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          isInstagram: formData.isInstagram,
          instagramUrl: formData.instagramUrl,
        });
      }
      toast.success('Images uploaded!');
      closeModal();
      fetchImages();
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this image?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Image deleted');
      fetchImages();
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const SortableItem = ({ item, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item._id });
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div ref={setNodeRef} style={style} className="group">
        <div {...attributes} {...listeners} className="w-8 h-8 flex items-center justify-center bg-cream-100 rounded cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-cream-500" />
        </div>
        <div className="relative aspect-square rounded-lg overflow-hidden border border-beige-200">
          <img src={item.image?.url} alt={item.caption} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <button onClick={() => openEditModal(item)} className="p-2 bg-white rounded-lg"><Edit className="w-4 h-4 text-brown-700" /></button>
              <button onClick={() => handleDelete(item._id)} className="p-2 bg-white rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
          {item.isInstagram && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              <Instagram className="w-3 h-3 inline mr-1" /> Instagram
            </div>
          )}
        </div>
        <p className="text-sm font-medium text-brown-900 mt-2 truncate">{item.caption || 'Untitled'}</p>
        <p className="text-xs text-cream-500 capitalize">{item.category}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="card p-4 animate-pulse">
          <div className="h-4 bg-beige-200 rounded w-1/4" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square rounded-lg bg-beige-200" />
              <div className="h-4 bg-beige-200 rounded w-3/4 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium text-brown-900">Gallery</h1>
          <p className="text-brown-600">Manage your gallery and Instagram feed</p>
        </div>
        <button onClick={openCreateModal} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Images
        </button>
      </div>

      {/* Drag & Drop Gallery */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-lg font-medium text-brown-900">
            Gallery Images ({images.length})
          </h2>
          {dragActive && <span className="text-sm text-cream-600">Drag to reorder</span>}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images.map(img => img._id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {images.map((item, index) => (
                <SortableItem key={item._id} item={item} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {images.length === 0 && (
          <div className="text-center py-12">
            <Image className="w-16 h-16 mx-auto mb-4 text-cream-300" />
            <h3 className="font-heading text-lg font-medium text-brown-900 mb-2">No images yet</h3>
            <p className="text-brown-600 mb-4">Upload your first gallery image</p>
            <button onClick={openCreateModal} className="btn-primary">Add Images</button>
          </div>
        )}
      </div>
    </div>
  );
}