import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {
  Star, Check, X, Trash2, Edit2, Eye, EyeOff,
} from 'lucide-react';
import API from '../../services/api';

const Reviews = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params = { all: 'true' };
      if (filter === 'pending') params.status = 'pending';
      if (filter === 'approved') params.status = 'approved';
      const { data } = await API.get('/reviews', { params });
      setItems(data.data || []);
    } catch (e) {
      console.error('Failed to load reviews:', e);
      const msg =
        e.response?.data?.message ||
        e.message ||
        'Could not connect to the server';
      setLoadError(msg);
      setItems([]);
      toast.error(`Failed to load reviews: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filter]);

  const toggleApprove = async (item) => {
    try {
      await API.put(`/reviews/${item._id}`, { isApproved: !item.isApproved });
      toast.success(item.isApproved ? 'Review unpublished' : 'Review approved');
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  const toggleFeatured = async (item) => {
    try {
      await API.put(`/reviews/${item._id}`, { isFeatured: !item.isFeatured });
      toast.success(item.isFeatured ? 'Removed from featured' : 'Marked as featured');
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review permanently?')) return;
    try {
      await API.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setEditForm({
      name: item.name,
      role: item.role || '',
      rating: item.rating,
      text: item.text,
      image: item.image || '',
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.put(`/reviews/${editing}`, editForm);
      toast.success('Review updated');
      setEditing(null);
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const counts = {
    all: items.length,
    pending: items.filter((i) => !i.isApproved).length,
    approved: items.filter((i) => i.isApproved).length,
  };

  return (
    <div>
      <Toaster position="top-right" />

      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1 tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-slate-600 text-sm">
            Moderate, edit, and feature customer reviews shown on the public site.
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="btn-secondary text-xs disabled:opacity-50 flex-shrink-0"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'all', label: 'All Reviews' },
          { id: 'pending', label: 'Pending Approval' },
          { id: 'approved', label: 'Approved' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all border ${
              filter === tab.id
                ? 'bg-primary-800 text-white border-primary-800'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
            }`}
          >
            {tab.label}
            {filter === tab.id && counts[tab.id] !== undefined && (
              <span className="ml-2 bg-white/20 px-1.5 rounded text-[10px]">
                {counts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-200 h-32 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : loadError ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-800 font-semibold mb-2">Could not load reviews</p>
          <p className="text-red-700 text-sm mb-4">{loadError}</p>
          <p className="text-xs text-red-600 mb-4">
            Make sure the backend server is running on the correct port and you are
            still signed in as an admin.
          </p>
          <button onClick={load} className="btn-primary">
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
          <p className="font-semibold text-slate-700 mb-2">No reviews in this view</p>
          <p className="text-sm">
            {filter === 'pending'
              ? 'No reviews are awaiting approval right now.'
              : filter === 'approved'
              ? 'No reviews have been approved yet. Try the Pending tab.'
              : "No reviews have been submitted yet. Run 'node seeder.js' on the server to add sample reviews, or wait for users to submit some."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-xl border ${
                !item.isApproved ? 'border-accent-200 bg-accent-50/30' : 'border-slate-200'
              } p-5`}
            >
              <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-800 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {item.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900 truncate tracking-tight">
                        {item.name}
                      </p>
                      {!item.isApproved && (
                        <span className="bg-accent-100 text-accent-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                      {item.isApproved && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          Approved
                        </span>
                      )}
                      {item.isFeatured && (
                        <span className="bg-primary-50 text-primary-700 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                          <Star size={9} fill="currentColor" /> Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">
                      {item.email}
                      {item.role && ` · ${item.role}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          i < (item.rating || 5)
                            ? 'fill-accent-400 text-accent-400'
                            : 'text-slate-200'
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                {item.text}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => toggleApprove(item)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                    item.isApproved
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {item.isApproved ? (
                    <>
                      <EyeOff size={13} /> Unpublish
                    </>
                  ) : (
                    <>
                      <Check size={13} /> Approve
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleFeatured(item)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors ${
                    item.isFeatured
                      ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Star size={13} fill={item.isFeatured ? 'currentColor' : 'none'} />
                  {item.isFeatured ? 'Featured' : 'Feature'}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md text-slate-600 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-1.5"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-md text-slate-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-1.5 ml-auto"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && editForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full my-8 shadow-elevated">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Edit Review
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-pro">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="input-pro"
                    required
                  />
                </div>
                <div>
                  <label className="label-pro">Rating</label>
                  <select
                    value={editForm.rating}
                    onChange={(e) =>
                      setEditForm({ ...editForm, rating: Number(e.target.value) })
                    }
                    className="input-pro"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Star{n === 1 ? '' : 's'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="label-pro">Role / Company</label>
                <input
                  type="text"
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="input-pro"
                  placeholder="e.g. CEO, Acme Co."
                />
              </div>

              <div>
                <label className="label-pro">Avatar URL</label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.value })
                  }
                  className="input-pro"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="label-pro">Review Text</label>
                <textarea
                  value={editForm.text}
                  onChange={(e) =>
                    setEditForm({ ...editForm, text: e.target.value })
                  }
                  rows={5}
                  className="input-pro resize-none"
                  required
                  minLength={10}
                  maxLength={1000}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2.5 border border-slate-200 rounded-md hover:bg-slate-50 font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
