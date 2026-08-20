import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Star, PackageX } from 'lucide-react';
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../../services/api';
import ImageUpload from '../../components/admin/imageUpload';

const emptyForm = {
    name: '',
    category: 'software',
    shortDescription: '',
    description: '',
    price: '',
    discountPrice: '',
    image: '',
    features: '',
    stock: '',
    sku: '',
    isFeatured: false,
    isActive: true,
};

const categories = ['software', 'hardware', 'subscription', 'service-bundle', 'other'];

const Products = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState('all');

    const loadItems = async () => {
        setLoading(true);
        try {
            const { data } = await fetchProducts({ active: 'all' });
            setItems(data.data);
        } catch (e) {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditingId(item._id);
        setForm({
            name: item.name,
            category: item.category,
            shortDescription: item.shortDescription,
            description: item.description,
            price: item.price,
            discountPrice: item.discountPrice ?? '',
            image: item.image,
            features: item.features?.join(', ') || '',
            stock: item.stock ?? '',
            sku: item.sku || '',
            isFeatured: item.isFeatured,
            isActive: item.isActive,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.image) {
            toast.error('Please upload a product image');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                price: Number(form.price),
                discountPrice: form.discountPrice === '' ? null : Number(form.discountPrice),
                stock: form.stock === '' ? 0 : Number(form.stock),
                features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
            };
            if (editingId) {
                await updateProduct(editingId, payload);
                toast.success('Product updated');
            } else {
                await createProduct(payload);
                toast.success('Product created');
            }
            setShowModal(false);
            loadItems();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
            toast.success('Product deleted');
            loadItems();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

    return (
        <div>
            <Toaster position="top-right" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Products</h1>
                    <p className="text-slate-600 text-sm">Manage the products you sell</p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <Plus size={18} className="mr-2" /> Add Product
                </button>
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${filter === cat ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                            }`}
                    >
                        {cat.replace('-', ' ')}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-slate-200 h-72 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
                    No products in this category.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="relative h-44">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                {item.isFeatured && (
                                    <span className="absolute top-3 left-3 bg-accent-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                        <Star size={10} fill="currentColor" /> Featured
                                    </span>
                                )}
                                {!item.isActive && (
                                    <span className="absolute top-3 left-3 bg-slate-700 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                        <PackageX size={10} /> Inactive
                                    </span>
                                )}
                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs px-2 py-1 rounded-full font-medium capitalize">
                                    {item.category.replace('-', ' ')}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 mb-1 truncate">{item.name}</h3>
                                <div className="flex items-center gap-2 mb-2">
                                    {item.discountPrice ? (
                                        <>
                                            <span className="text-sm font-bold text-primary-700">${item.discountPrice}</span>
                                            <span className="text-xs text-slate-400 line-through">${item.price}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-bold text-primary-700">${item.price}</span>
                                    )}
                                    <span className="text-xs text-slate-400">· Stock: {item.stock}</span>
                                </div>
                                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{item.shortDescription}</p>
                                <div className="flex items-center justify-end gap-1 pt-3 border-t border-slate-100">
                                    <button
                                        onClick={() => openEdit(item)}
                                        className="p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                                    >
                                        <Edit2 size={15} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name *</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Description *</label>
                                <input
                                    type="text"
                                    value={form.shortDescription}
                                    onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                                    required
                                    maxLength={250}
                                    placeholder="One-line summary shown on product cards"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Description *</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <ImageUpload
                                value={form.image}
                                onChange={(url) => setForm({ ...form, image: url })}
                                folder="products"
                                label="Product Image *"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Category *</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 capitalize"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>{cat.replace('-', ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">SKU</label>
                                    <input
                                        type="text"
                                        value={form.sku}
                                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Price ($) *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Discount Price ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.discountPrice}
                                        onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Stock</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.stock}
                                        onChange={(e) => setForm({ ...form, stock: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Features (comma-separated)</label>
                                <input
                                    type="text"
                                    value={form.features}
                                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    placeholder="Cloud sync, 24/7 support, Free updates"
                                />
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        checked={form.isFeatured}
                                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isFeatured" className="text-sm text-slate-700">
                                        Featured product
                                    </label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={form.isActive}
                                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-slate-700">
                                        Active (visible on site)
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
                                    {submitting ? 'Saving...' : editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
