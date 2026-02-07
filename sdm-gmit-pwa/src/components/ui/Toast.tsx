import { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
    id: number;
    message: React.ReactNode;
    type: ToastType;
}

let addToastHandler: ((message: React.ReactNode, type: ToastType) => void) | null = null;

export const toast = {
    success: (msg: React.ReactNode) => addToastHandler && addToastHandler(msg, 'success'),
    error: (msg: React.ReactNode) => addToastHandler && addToastHandler(msg, 'error'),
    info: (msg: React.ReactNode) => addToastHandler && addToastHandler(msg, 'info'),
    promise: <T,>(
        promise: Promise<T>,
        msgs: { loading: string; success: string; error: string }
    ): Promise<T> => {
        addToastHandler && addToastHandler(msgs.loading, 'info');
        return promise
            .then((result) => {
                addToastHandler && addToastHandler(msgs.success, 'success');
                return result;
            })
            .catch((err) => {
                addToastHandler && addToastHandler(msgs.error, 'error');
                throw err;
            });
    },
};

export const Toaster = () => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        addToastHandler = (message: React.ReactNode, type: ToastType) => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, message, type }]);
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 5000); // Increased duration to 5s for better readability
        };
        return () => { addToastHandler = null; };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in-right ${t.type === 'success' ? 'bg-white border-green-200 text-green-700 dark:bg-slate-800 dark:border-green-900 dark:text-green-400' :
                        t.type === 'error' ? 'bg-white border-red-200 text-red-700 dark:bg-slate-800 dark:border-red-900 dark:text-red-400' :
                            'bg-white border-blue-200 text-blue-700 dark:bg-slate-800 dark:border-blue-900 dark:text-blue-400'
                        }`}
                >
                    <span className="material-symbols-outlined text-xl">
                        {t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : 'info'}
                    </span>
                    <div className="text-sm font-bold">{t.message}</div>
                </div>
            ))}
        </div>
    );
};
