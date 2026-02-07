
import { WifiOff } from 'lucide-react';

export const OfflineBanner = () => {
    return (
        <div className="fixed bottom-4 left-4 z-50 animate-fade-in-up">
            <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-lg border border-slate-700 dark:border-slate-200 flex items-center gap-3">
                <div className="bg-red-500/20 p-2 rounded-lg">
                    <WifiOff size={18} className="text-red-500" />
                </div>
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider opacity-70">Status</div>
                    <div className="text-sm font-black">Anda Sedang Offline</div>
                </div>
            </div>
        </div>
    );
};
