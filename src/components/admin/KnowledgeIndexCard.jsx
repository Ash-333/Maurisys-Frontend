import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Database, RefreshCw, Loader2 } from 'lucide-react';
import { fetchChatStatus, rebuildChatIndex } from '../../services/api';

/**
 * Chatbot knowledge-index status, with a manual rebuild.
 *
 * Content edits re-index themselves via model hooks, so this is a safety net
 * rather than the normal path: a failed background re-index only shows up in
 * server logs, and the last-indexed time is the one place an admin can notice
 * the bot has drifted out of date.
 */
const KnowledgeIndexCard = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rebuilding, setRebuilding] = useState(false);

    const load = async () => {
        try {
            const { data } = await fetchChatStatus();
            setStatus(data.data);
        } catch {
            setStatus(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const rebuild = async () => {
        setRebuilding(true);
        try {
            const { data } = await rebuildChatIndex();
            toast.success(data.message || 'Index rebuilt');
            load();
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Rebuild failed — check the server logs'
            );
        } finally {
            setRebuilding(false);
        }
    };

    const relative = (iso) => {
        if (!iso) return 'never';
        const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.round(mins / 60);
        if (hrs < 24) return `${hrs} hr ago`;
        return `${Math.round(hrs / 24)} days ago`;
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center shrink-0">
                        <Database size={18} />
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm">
                            Chatbot knowledge
                        </p>
                        {loading ? (
                            <p className="text-xs text-slate-400 mt-0.5">Checking…</p>
                        ) : status ? (
                            <p className="text-xs text-slate-500 mt-0.5">
                                {status.chunks} chunks indexed · updated{' '}
                                {relative(status.lastIndexedAt)}
                            </p>
                        ) : (
                            <p className="text-xs text-red-600 mt-0.5">
                                Index status unavailable
                            </p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                            Updates automatically when you edit content. Rebuild if the
                            assistant seems out of date.
                        </p>
                    </div>
                </div>

                <button
                    onClick={rebuild}
                    disabled={rebuilding}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:border-primary-300 hover:text-primary-700 disabled:opacity-60 transition-colors"
                >
                    {rebuilding ? (
                        <>
                            <Loader2 size={13} className="animate-spin" /> Rebuilding…
                        </>
                    ) : (
                        <>
                            <RefreshCw size={13} /> Rebuild
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default KnowledgeIndexCard;
