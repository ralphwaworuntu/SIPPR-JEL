import { Modal } from './Modal';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    variant = "danger",
    isLoading = false
}: ConfirmDialogProps) => {

    const getConfirmButtonStyle = () => {
        switch (variant) {
            case 'danger':
                return "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20";
            case 'warning':
                return "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20";
            case 'info':
                return "bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/20";
            default:
                return "bg-primary text-slate-900";
        }
    };

    const getIcon = () => {
        switch (variant) {
            case 'danger': return 'warning';
            case 'warning': return 'error';
            case 'info': return 'info';
            default: return 'help';
        }
    };

    const getIconColor = () => {
        switch (variant) {
            case 'danger': return 'text-red-500 bg-red-50';
            case 'warning': return 'text-orange-500 bg-orange-50';
            case 'info': return 'text-blue-500 bg-blue-50';
            default: return 'text-primary bg-primary/10';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    <div className={`shrink-0 size-12 rounded-full flex items-center justify-center ${getIconColor()} dark:bg-opacity-10`}>
                        <span className="material-symbols-outlined text-2xl">{getIcon()}</span>
                    </div>
                    <div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-6 py-2 rounded-lg text-sm font-bold shadow-lg transition-all flex items-center gap-2 ${getConfirmButtonStyle()}`}
                    >
                        {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
