import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Linkedin, Twitter, Github, Mail } from 'lucide-react';
import {
    fetchTeam,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
} from '../../services/api';
import ImageUpload from '../../components/admin/imageUpload';

const categories = ['leadership', 'development', 'design', 'marketing', 'sales', 'support', 'other'];

const emptyForm = {
    name: '',
    role: '',
    category: 'development',
    bio: '',
    image: '',
    socials: { linkedin: '', twitter: '', github: '', email: '' },
    order: 0,
    isActive: true,
};

const Team = () => {
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
            const { data } = await fetchTeam({ active: 'all' });
            setItems(data.data);
        } catch (e) {
            toast.error('Failed to load team');
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
            role: item.role,
            category: item.category,
            bio: item.bio || '',
            image: item.image,
            socials: {
                linkedin: item.socials?.linkedin || '',
                twitter: item.socials?.twitter || '',
                github: item.socials?.github || '',
                email: item.socials?.email || '',
            },
            order: item.order ?? 0,
            isActive: item.isActive,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.image) {
            toast.error('Please upload a photo');
            return;
        }
        setSubmitting(true);
        try {
            const payload = { ...form, order: Number(form.order) || 0 };
            if (editingId) {
                await updateTeamMember(editingId, payload);
                toast.success('Team member updated');
            } else {
                await createTeamMember(payload);
                toast.success('Team member added');
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
        if (!confirm('Remove this team member?')) return;
        try {
            await deleteTeamMember(id);
            toast.success('Team member removed');
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
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Our Team</h1>
                    <p className="text-slate-600 text-sm">Manage the team shown on the About page</p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <Plus size={18} className="mr-2" /> Add Team Member
                </button>
            </div>

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
                        {cat}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-200 h-64 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
                    No team members in this category.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filtered.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="relative aspect-square">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                {!item.isActive && (
                                    <span className="absolute top-3 left-3 bg-slate-700 text-white text-xs px-2 py-1 rounded-full font-bold">
                                        Hidden
                                    </span>
                                )}
                                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs px-2 py-1 rounded-full font-medium capitalize">
                                    {item.category}
                                </span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-slate-900 truncate">{item.name}</h3>
                                <p className="text-sm text-slate-500 mb-3 truncate">{item.role}</p>
                                <div className="flex items-center gap-2 mb-3 text-slate-400">
                                    {item.socials?.linkedin && <Linkedin size={13} />}
                                    {item.socials?.twitter && <Twitter size={13} />}
                                    {item.socials?.github && <Github size={13} />}
                                    {item.socials?.email && <Mail size={13} />}
                                </div>
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
                    <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId ? 'Edit Team Member' : 'Add Team Member'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Role / Title *</label>
                                    <input
                                        type="text"
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        required
                                        placeholder="e.g. Lead Developer"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <ImageUpload
                                value={form.image}
                                onChange={(url) => setForm({ ...form, image: url })}
                                folder="team"
                                label="Photo *"
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
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Order</label>
                                    <input
                                        type="number"
                                        value={form.order}
                                        onChange={(e) => setForm({ ...form, order: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio</label>
                                <textarea
                                    value={form.bio}
                                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                    rows={3}
                                    maxLength={600}
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn URL</label>
                                    <input
                                        type="text"
                                        value={form.socials.linkedin}
                                        onChange={(e) => setForm({ ...form, socials: { ...form.socials, linkedin: e.target.value } })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Twitter/X URL</label>
                                    <input
                                        type="text"
                                        value={form.socials.twitter}
                                        onChange={(e) => setForm({ ...form, socials: { ...form.socials, twitter: e.target.value } })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">GitHub URL</label>
                                    <input
                                        type="text"
                                        value={form.socials.github}
                                        onChange={(e) => setForm({ ...form, socials: { ...form.socials, github: e.target.value } })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        value={form.socials.email}
                                        onChange={(e) => setForm({ ...form, socials: { ...form.socials, email: e.target.value } })}
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
                                    Active (visible on About page)
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

export default Team;
