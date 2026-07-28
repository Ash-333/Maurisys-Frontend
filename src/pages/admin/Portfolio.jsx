import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Star } from 'lucide-react';
import API from '../../services/api';
import ImageUpload from '../../components/admin/ImageUpload';

const emptyForm = {
  title: '',
  description: '',
  category: 'web',
  image: '',
  technologies: '',
  projectUrl: '',
  client: '',
  isFeatured: false,
};

const categories = ['web', 'mobile', 'graphics', 'seo', 'branding', 'other'];

const Portfolio = () => {
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
      const { data } = await API.get('/portfolio');
      setItems(data.data);
    } catch (e) {
      toast.error('Failed to load portfolio');
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
      title: item.title,
      description: item.description,
      category: item.category,
      image: item.image,
      technologies: item.technologies?.join(', ') || '',
      projectUrl: item.projectUrl || '',
      client: item.client || '',
      isFeatured: item.isFeatured,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) {
      toast.error('Please upload a project image');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (editingId) {
        await API.put(`/portfolio/${editingId}`, payload);
        toast.success('Project updated');
      } else {
        await API.post('/portfolio', payload);
        toast.success('Project created');
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
    if (!confirm('Delete this project?')) return;
    try {
      await API.delete(`/portfolio/${id}`);
      toast.success('Project deleted');
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
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Portfolio</h1>
          <p className="text-slate-600 text-sm">Manage your project showcase</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} className="mr-2" /> Add Project
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === cat ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {cat}
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
          No projects in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="relative h-44">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                {item.isFeatured && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                )}
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs px-2 py-1 rounded-full font-medium capitalize">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 mb-1 truncate">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{item.client || 'No client specified'}</p>
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">{item.description}</p>
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
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <ImageUpload
                value={form.image}
                onChange={(url) => setForm({ ...form, image: url })}
                folder="portfolio"
                label="Project Image *"
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
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Client Name</label>
                  <input
                    type="text"
                    value={form.client}
                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Project URL</label>
                <input
                  type="url"
                  value={form.projectUrl}
                  onChange={(e) => setForm({ ...form, projectUrl: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isFeatured" className="text-sm text-slate-700">
                  Featured project (highlighted on homepage)
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

export default Portfolio;
