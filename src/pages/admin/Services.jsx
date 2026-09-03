import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import API from '../../services/api';
import { useConfirm } from '../../components/admin/ConfirmDialog';

const emptyForm = {
  title: '',
  shortDescription: '',
  description: '',
  icon: 'code',
  features: '',
  order: 0,
  isActive: true,
};


const iconOptions = ['globe', 'smartphone', 'palette', 'trending-up', 'megaphone', 'image', 'server', 'pen-tool', 'link', 'code'];

const Services = () => {
  const { confirm, dialog } = useConfirm();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadServices = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/services');
      setServices(data.data);
    } catch (e) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (service) => {
    setEditingId(service._id);
    setForm({
      title: service.title,
      shortDescription: service.shortDescription,
      description: service.description,
      icon: service.icon || 'code',
      features: service.features?.join('\n') || '',
      order: service.order || 0,
      isActive: service.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
      };
      if (editingId) {
        await API.put(`/services/${editingId}`, payload);
        toast.success('Service updated');
      } else {
        await API.post('/services', payload);
        toast.success('Service created');
      }
      setShowModal(false);
      loadServices();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: 'Delete service',
      message:
        'This service will be permanently removed from the site. This cannot be undone.',
      confirmLabel: 'Delete service',
    });
    if (!ok) return;
    try {
      await API.delete(`/services/${id}`);
      toast.success('Service deleted');
      loadServices();
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
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Services</h1>
          <p className="text-slate-600 text-sm">Manage your service offerings</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} className="mr-2" /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-200 h-48 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
          No services yet. Click "Add Service" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white text-xs font-bold uppercase">
                  {service.icon?.charAt(0) || 'S'}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  service.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {service.isActive ? 'Active' : 'Hidden'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{service.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-3 mb-4">{service.shortDescription}</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500">Order: {service.order}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(service)}
                    className="p-2 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
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
                {editingId ? 'Edit Service' : 'Add New Service'}
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Short Description *</label>
                <textarea
                  value={form.shortDescription}
                  onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                  required
                  rows={2}
                  maxLength={250}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Icon</label>
                  <select
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  >
                    {iconOptions.map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Features (one per line)</label>
                <textarea
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                  placeholder="Responsive Design&#10;SEO Optimized&#10;Fast Loading"
                />
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

export default Services;
