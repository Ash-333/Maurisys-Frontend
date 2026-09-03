import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Styled replacement for the browser's blocking window.confirm().
 *
 * Used through the useConfirm() hook below rather than rendered directly, so
 * calling code keeps reading top-to-bottom:
 *
 *   const { confirm, dialog } = useConfirm();
 *   const handleDelete = async (id) => {
 *     if (!(await confirm({ message: 'Delete this?' }))) return;
 *     ...
 *   };
 *   return (<div>{dialog} ...</div>);
 */
const ConfirmDialog = ({
    title = 'Are you sure?',
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    tone = 'danger',
    onConfirm,
    onCancel,
}) => {
    const confirmRef = useRef(null);

    useEffect(() => {
        // Focus the confirm button so Enter/Escape work without reaching for
        // the mouse, mirroring what the native dialog gave us for free.
        confirmRef.current?.focus();

        const onKeyDown = (e) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onCancel]);

    const confirmClasses =
        tone === 'danger'
            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-200'
            : 'bg-primary-700 hover:bg-primary-800 focus:ring-primary-200';

    return (
        <div
            className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
            onMouseDown={(e) => {
                // Only a click that both starts and ends on the backdrop dismisses,
                // so a drag that ends outside the panel doesn't close it.
                if (e.target === e.currentTarget) onCancel();
            }}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            >
                <div className="flex items-start gap-4 p-6">
                    <div
                        className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-700'
                            }`}
                    >
                        <AlertTriangle size={20} />
                    </div>
                    <div className="flex-1 pt-0.5">
                        <h2 id="confirm-title" className="text-lg font-bold text-slate-900 mb-1">
                            {title}
                        </h2>
                        {message && <p className="text-sm text-slate-600 leading-relaxed">{message}</p>}
                    </div>
                    <button
                        type="button"
                        onClick={onCancel}
                        aria-label="Close"
                        className="p-1.5 -mt-1 -mr-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50/70 rounded-b-2xl border-t border-slate-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2.5 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 font-medium text-sm"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        ref={confirmRef}
                        type="button"
                        onClick={onConfirm}
                        className={`px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-colors focus:outline-none focus:ring-4 ${confirmClasses}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Returns { confirm, dialog }. `confirm(options)` opens the dialog and resolves
 * to true/false once the user answers; `dialog` is the element to render.
 */
export const useConfirm = () => {
    const [options, setOptions] = useState(null);
    const resolverRef = useRef(null);

    const confirm = useCallback(
        (opts = {}) =>
            new Promise((resolve) => {
                resolverRef.current = resolve;
                setOptions(opts);
            }),
        []
    );

    const settle = useCallback((result) => {
        setOptions(null);
        const resolve = resolverRef.current;
        resolverRef.current = null;
        resolve?.(result);
    }, []);

    const dialog = options ? (
        <ConfirmDialog
            {...options}
            onConfirm={() => settle(true)}
            onCancel={() => settle(false)}
        />
    ) : null;

    return { confirm, dialog };
};

export default ConfirmDialog;
