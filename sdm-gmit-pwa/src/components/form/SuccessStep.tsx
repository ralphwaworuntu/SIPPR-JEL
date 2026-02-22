import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const SuccessStep = () => {
    const navigate = useNavigate();

    // Trigger confetti or animation on mount
    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/20 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20 border border-green-200 dark:border-green-800 animate-scale-in">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">check_circle</span>
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 animate-fade-in-up">Pendaftaran Berhasil!</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-lg animate-fade-in-up delay-100">
                Terima kasih telah melengkapi data diri Anda. Partisipasi Anda sangat berharga bagi pertumbuhan dan masa depan pelayanan Jemaat Emaus Liliba.
            </p>

            {/* Registration Card - Print Area */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl max-w-md w-full mb-10 text-left relative overflow-hidden print-area animate-fade-in-up delay-200 group">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent skew-x-12 z-10 pointer-events-none group-hover:block" style={{ animationPlayState: 'paused' }}></div>

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-emerald-400"></div>

                <div className="flex justify-between items-start mb-6 relative z-20">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Registrasi</p>
                        <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-lg border border-green-200 dark:border-green-800/50 w-fit">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="font-bold text-green-700 dark:text-green-400 text-sm">TERVERIFIKASI</span>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-slate-200 dark:text-slate-700 text-5xl absolute -top-2 -right-2">verified</span>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">ID Validasi</p>
                        <p className="font-mono text-lg font-bold text-slate-900 dark:text-white tracking-wider">REG-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Langkah Selanjutnya:</p>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Admin akan memverifikasi data anda dalam 1x24 jam.</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons - No Print */}
            <div className="flex flex-col gap-3 w-full max-w-md mx-auto print:hidden animate-fade-in-up delay-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <button
                        onClick={handlePrint}
                        className="h-12 rounded-xl font-bold text-primary border-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full"
                    >
                        <span className="material-symbols-outlined">print</span>
                        Simpan Bukti
                    </button>
                    <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-12 rounded-xl font-bold text-white bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full"
                    >
                        <span className="material-symbols-outlined">groups</span>
                        Gabung Grup WA
                    </a>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="h-12 rounded-xl font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors w-full mt-2"
                >
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    );
};

export default SuccessStep;
