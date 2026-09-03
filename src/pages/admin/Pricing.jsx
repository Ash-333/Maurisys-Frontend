import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, AlertTriangle, MessageSquare } from 'lucide-react';
import {
    fetchPricingRules,
    createPricingRule,
    updatePricingRule,
    deletePricingRule,
} from '../../services/api';
import { useConfirm } from '../../components/admin/ConfirmDialog';
import { formatNPR } from '../../utils/currency';

const UNITS = [
    { value: 'fixed', label: 'Fixed price (whole project)' },
    { value: 'per-page', label: 'Per page' },
    { value: 'per-screen', label: 'Per screen' },
    { value: 'per-item', label: 'Per item' },
    { value: 'per-month', label: 'Per month' },
    { value: 'per-year', label: 'Per year' },
    { value: 'per-hour', label: 'Per hour' },
];

const emptyForm = {
    category: '',
    label: '',
    unit: 'fixed',
    minPrice: 0,
    maxPrice: 0,
    typicalTimeline: '',
    notes: '',
    requiresConsultation: false,
    isActive: true,
    order: 0,
    modifiers: [],
};

const Pricing = () => {
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
            const { data } = await fetchPricingRules();
            setItems(data.data);
        } catch (e) {
            toast.error('Failed to load pricing rules');
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
            category: item.category,
            label: item.label,
            unit: item.unit,
            minPrice: item.minPrice,
            maxPrice: item.maxPrice,
            typicalTimeline: item.typicalTimeline || '',
            notes: item.notes || '',
            requiresConsultation: !!item.requiresConsultation,
            isActive: item.isActive,
            order: item.order ?? 0,
            modifiers: item.modifiers || [],
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const min = Number(form.minPrice) || 0;
        const max = Number(form.maxPrice) || 0;
        if (!form.requiresConsultation && max < min) {
            toast.error('Maximum price cannot be lower than the minimum');
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                ...form,
                minPrice: min,
                maxPrice: max,
                order: Number(form.order) || 0,
            };
            if (editingId) {
                await updatePricingRule(editingId, payload);
                toast.success('Pricing rule updated');
            } else {
                await createPricingRule(payload);
                toast.success('Pricing rule added');
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
            title: 'Delete pricing rule',
            message:
                'The assistant will no longer quote for this category and will route those enquiries to a consultation instead.',
            confirmLabel: 'Delete rule',
        });
        if (!ok) return;
        try {
            await deletePricingRule(id);
            toast.success('Pricing rule deleted');
            loadItems();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const updateModifier = (idx, patch) => {
        const next = [...form.modifiers];
        next[idx] = { ...next[idx], ...patch };
        setForm({ ...form, modifiers: next });
    };

    const placeholderCount = items.filter((i) =>
        (i.notes || '').startsWith('PLACEHOLDER')
    ).length;

    return (
        <div>
            <Toaster position="top-right" />
            {dialog}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-1">Pricing</h1>
                    <p className="text-slate-600 text-sm">
                        The rate card the chatbot quotes from. Changes apply immediately — no
                        redeploy needed.
                    </p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <Plus size={18} className="mr-2" /> Add Rule
                </button>
            </div>

            {placeholderCount > 0 && (
                <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900">
                        <p className="font-semibold mb-0.5">
                            {placeholderCount} rule{placeholderCount === 1 ? '' : 's'} still
                            using placeholder prices
                        </p>
                        <p className="text-amber-800">
                            These are generic estimates, not your real rates. Review each one
                            before letting the assistant quote to visitors — rows marked below
                            have not been checked.
                        </p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-200 h-20 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
                    No pricing rules yet. The assistant will route all price questions to a
                    consultation.
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="text-left font-semibold px-4 py-3">Service</th>
                                    <th className="text-left font-semibold px-4 py-3">Priced by</th>
                                    <th className="text-left font-semibold px-4 py-3">Range</th>
                                    <th className="text-left font-semibold px-4 py-3">Timeline</th>
                                    <th className="px-4 py-3" />
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="border-t border-slate-100 hover:bg-slate-50/60"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-slate-900">
                                                {item.label}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono">
                                                {item.category}
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {!item.isActive && (
                                                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                                                        Inactive
                                                    </span>
                                                )}
                                                {(item.notes || '').startsWith('PLACEHOLDER') && (
                                                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                                                        Placeholder
                                                    </span>
                                                )}
                                                {item.modifiers?.length > 0 && (
                                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                                                        {item.modifiers.length} modifier
                                                        {item.modifiers.length === 1 ? '' : 's'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                            {UNITS.find((u) => u.value === item.unit)?.label ||
                                                item.unit}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {item.requiresConsultation ? (
                                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-700">
                                                    <MessageSquare size={12} /> Consultation only
                                                </span>
                                            ) : (
                                                <span className="font-semibold text-slate-900">
                                                    {formatNPR(item.minPrice)} – {formatNPR(item.maxPrice)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                                            {item.typicalTimeline || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1">
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full my-8 shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h2 className="text-xl font-bold text-slate-900">
                                {editingId ? 'Edit Pricing Rule' : 'Add Pricing Rule'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Category ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm({ ...form, category: e.target.value })
                                        }
                                        required
                                        disabled={!!editingId}
                                        placeholder="website-ecommerce"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:border-primary-500 disabled:bg-slate-50 disabled:text-slate-500"
                                    />
                                    <p className="text-[11px] text-slate-400 mt-1">
                                        Used by the assistant to match enquiries. Cannot be changed
                                        later.
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Display name *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.label}
                                        onChange={(e) => setForm({ ...form, label: e.target.value })}
                                        required
                                        placeholder="E-commerce website"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Priced by *
                                    </label>
                                    <select
                                        value={form.unit}
                                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    >
                                        {UNITS.map((u) => (
                                            <option key={u.value} value={u.value}>
                                                {u.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Minimum (रु)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.minPrice}
                                        onChange={(e) =>
                                            setForm({ ...form, minPrice: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Maximum (रु)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.maxPrice}
                                        onChange={(e) =>
                                            setForm({ ...form, maxPrice: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Typical timeline
                                    </label>
                                    <input
                                        type="text"
                                        value={form.typicalTimeline}
                                        onChange={(e) =>
                                            setForm({ ...form, typicalTimeline: e.target.value })
                                        }
                                        placeholder="6–10 weeks"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Display order
                                    </label>
                                    <input
                                        type="number"
                                        value={form.order}
                                        onChange={(e) => setForm({ ...form, order: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                    />
                                </div>
                            </div>

                            {form.modifiers.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Modifiers
                                    </label>
                                    <div className="space-y-2">
                                        {form.modifiers.map((m, i) => (
                                            <div
                                                key={m.key || i}
                                                className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                                            >
                                                <span className="text-sm text-slate-700 flex-1">
                                                    {m.label}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {m.type === 'multiplier' ? '×' : '+'}
                                                </span>
                                                <input
                                                    type="number"
                                                    step="any"
                                                    value={m.value}
                                                    onChange={(e) =>
                                                        updateModifier(i, {
                                                            value: Number(e.target.value),
                                                        })
                                                    }
                                                    className="w-28 px-2 py-1 border border-slate-200 rounded text-sm focus:outline-none focus:border-primary-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setForm({
                                                            ...form,
                                                            modifiers: form.modifiers.filter(
                                                                (_, j) => j !== i
                                                            ),
                                                        })
                                                    }
                                                    className="p-1 text-slate-400 hover:text-red-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1.5">
                                        Applied in order — additions before multipliers as listed.
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Internal notes
                                </label>
                                <input
                                    type="text"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    placeholder="Clear the PLACEHOLDER note once you've set real rates"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-primary-500"
                                />
                            </div>

                            <div className="space-y-2 pt-1">
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={form.requiresConsultation}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                requiresConsultation: e.target.checked,
                                            })
                                        }
                                        className="w-4 h-4"
                                    />
                                    Consultation only — never quote a number for this
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive}
                                        onChange={(e) =>
                                            setForm({ ...form, isActive: e.target.checked })
                                        }
                                        className="w-4 h-4"
                                    />
                                    Active
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

export default Pricing;
