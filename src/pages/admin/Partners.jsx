import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Globe } from 'lucide-react';
import {
    fetchPartners,
    createPartner,
    updatePartner,
    deletePartner,
} from '../../services/api';
import ImageUpload from '../../components/admin/imageUpload';
import { useConfirm } from '../../components/admin/ConfirmDialog';

const emptyForm = {
    name: '',
    logo: '',
    website: '',
    order: 0,
    isActive: true,
};

const Partners = () => {
    const { confirm, dialog } = useConfirm();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);

    const loadItems = async () => {
        setLoading(true);
        try {
            const { data } = await fetchPartners({ active: 'all' });
            setItems(data.data);
        } catch (e) {
            toast.error('Failed to load partners');
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
            logo: item.logo,
            website: item.website || '',
            order: item.order ?? 0,
            isActive: item.isActive,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.logo) {
            toast.error('Please upload a logo');
            return;
        }
        setSubmitting(true);
        try {
            const payload = { ...form, order: Number(form.order) || 0 };
            if (editingId) {
                await updatePartner(editingId, payload);
                toast.success('Partner updated');
            } else {
                await createPartner(payload);
                toast.success('Partner added');
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
        const ok = await confirm({
            title: 'Remove partner',
            message:
                'This partner logo will be removed from the home page. This cannot be undone.',
            confirmLabel: 'Remove partner',
        });
        if (!ok) return;
        try {
            await deletePartner(id);
            toast.success('Partner removed');
            loadItems();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <div>
            <Toaster position="top-right" />
            {dialog}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Partners</h1>
                    <p className="text-slate-600 text-sm">
                        Logos shown in the scrolling strip on the home page
                    </p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <Plus size={18} className="mr-2" /> Add Partner
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-200 h-48 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
                    No partners yet. Add one to show the strip on the home page.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
                        >
                            <div className="relative h-28 bg-slate-50 flex items-center justify-center p-6">
                                <img
                                    src={item.logo}
                                    alt={item.name}
                                    className="max-h-full max-w-full object-contain"
                                />
                                {!item.isActive && (
                                    <span className="absolute top-3 left-3 bg-slate-700 text-white text-xs px-2 py-1 rounded-full font-bold">
                                        Hidden
                                    </span>
                                )}
                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
                                    #{item.order ?? 0}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 truncate">{item.name}</h3>
                                <p className="text-xs text-slate-500 mb-3 truncate flex items-center gap-1.5 h-4">
                                    {item.website && (
                                        <>
                                            <Globe size={12} /> {item.website}
                                        </>
                                    )}
                                </p>
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

            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-lg w-full my-8 shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId ? 'Edit Partner' : 'Add Partner'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                    placeholder="e.g. Acme Corp"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <ImageUpload
                                value={form.logo}
                                onChange={(url) => setForm({ ...form, logo: url })}
                                folder="partners"
                                label="Logo *"
                            />
                            <p className="text-xs text-slate-500 -mt-2">
                                A transparent PNG or SVG on a light background works best — logos are
                                shown in grayscale until hovered.
                            </p>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        value={form.website}
                                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                                        placeholder="https://example.com"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={form.order}
                                        onChange={(e) => setForm({ ...form, order: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
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
                                    Active (visible on home page)
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="btn-primary disabled:opacity-60"
                                >
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

export default Partners;
