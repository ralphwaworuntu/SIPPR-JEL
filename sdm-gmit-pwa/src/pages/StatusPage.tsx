import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationStatus {
    id: number;
    displayId: string;
    fullName: string;
    kkNumber: string;
    lingkungan: string;
    rayon: string;
    phone: string;
    status: string; // 'PENDING' | 'VALIDATED'
    createdAt: string | null;
    updatedAt: string | null;
}

const StatusPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [searchId, setSearchId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RegistrationStatus | null>(null);
    const [error, setError] = useState('');

    // Auto-fill from query param or localStorage
    useEffect(() => {
        const paramId = searchParams.get('id');
        if (paramId) {
            // Extract numeric ID from REG-XXXX format or plain number
            const numericId = paramId.replace(/^REG-0*/i, '');
            setSearchId(numericId);
            // Auto-search
            handleSearch(numericId);
        } else {
            const savedId = localStorage.getItem('gmit-registration-id');
            if (savedId) {
                setSearchId(savedId);
                handleSearch(savedId);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = async (idOverride?: string) => {
        const id = idOverride || searchId.replace(/^REG-0*/i, '').trim();
        if (!id || isNaN(Number(id))) {
            setError('Masukkan ID Registrasi yang valid (contoh: 1 atau REG-0001)');
            setResult(null);
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(`/api/congregants/${id}/status`);
            if (!response.ok) {
                if (response.status === 404) {
                    setError('ID Registrasi tidak ditemukan. Pastikan ID yang Anda masukkan benar.');
                } else {
                    setError('Terjadi kesalahan. Silakan coba lagi.');
                }
                return;
            }

            const data = await response.json();
            setResult(data);
        } catch {
            setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
        } finally {
            setIsLoading(false);
        }
    };

    const isValidated = result?.status === 'VALIDATED';

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="font-display bg-slate-50 relative min-h-screen text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(15,23,42,1))] pointer-events-none" />
            <div className="relative z-10 flex flex-col flex-grow">
                {/* Navigation Bar */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 lg:px-20 py-3 flex items-center justify-between shadow-sm backdrop-blur-xl">
                    <div
                        onClick={() => navigate('/')}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <span className="text-slate-900 dark:text-white font-bold text-xl tracking-tight transition-transform duration-300 group-hover:scale-105 group-hover:text-primary">
                            GMIT Emaus Liliba
                        </span>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="hidden md:flex items-center text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-all hover:underline hover:underline-offset-4"
                    >
                        Kembali ke Beranda
                    </button>
                </header>

                <main className="max-w-[600px] mx-auto px-4 py-8 md:py-12 w-full flex-grow">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8 text-center"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl mb-4 text-indigo-600 dark:text-indigo-400">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>manage_search</span>
                        </div>
                        <h1 className="text-black dark:text-white text-2xl md:text-3xl font-black tracking-tight mb-3">
                            Cek Status Registrasi
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-base max-w-md mx-auto">
                            Masukkan ID Registrasi Anda untuk melihat status verifikasi data pendaftaran.
                        </p>
                    </motion.div>

                    {/* Search Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mb-6"
                    >
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                            ID Registrasi
                        </label>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-lg">tag</span>
                                <input
                                    type="text"
                                    value={searchId}
                                    onChange={(e) => setSearchId(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Contoh: 1 atau REG-0001"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-lg tracking-wider focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 placeholder:text-sm placeholder:font-sans placeholder:tracking-normal"
                                />
                            </div>
                            <button
                                onClick={() => handleSearch()}
                                disabled={isLoading}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-wait"
                            >
                                {isLoading ? (
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                ) : (
                                    <span className="material-symbols-outlined text-lg">search</span>
                                )}
                                <span className="hidden sm:inline">Cari</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl px-5 py-4 mb-6 flex items-start gap-3"
                            >
                                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5 shrink-0">error</span>
                                <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Result Card */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl w-full text-left relative overflow-hidden"
                            >
                                {/* Top accent bar */}
                                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${isValidated ? 'from-emerald-400 to-green-500' : 'from-amber-400 to-orange-500'}`}></div>

                                {/* Status Badge */}
                                <div className="flex justify-between items-start mb-6 relative z-20">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Registrasi</p>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-fit ${isValidated
                                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50'
                                            : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full ${isValidated ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></span>
                                            <span className={`font-bold text-sm ${isValidated ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                                {isValidated ? 'TERVALIDASI' : 'MENUNGGU VERIFIKASI'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`material-symbols-outlined text-5xl absolute -top-2 -right-2 ${isValidated ? 'text-emerald-200 dark:text-emerald-700/30' : 'text-amber-200 dark:text-amber-700/30'}`}>
                                        {isValidated ? 'verified' : 'hourglass_top'}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    {/* ID */}
                                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">ID Registrasi</p>
                                        <p className="font-mono text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-widest">{result.displayId}</p>
                                    </div>

                                    {/* Personal Data */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Nama Lengkap</p>
                                            <p className="font-bold text-slate-900 dark:text-slate-200">{result.fullName || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Nomor KK</p>
                                            <p className="font-bold text-slate-900 dark:text-slate-200 font-mono tracking-wider">{result.kkNumber || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Rayon / Lingkungan</p>
                                            <p className="font-bold text-slate-900 dark:text-slate-200">Rayon {result.rayon || '-'} / {result.lingkungan || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">No. Telepon / WA</p>
                                            <p className="font-bold text-slate-900 dark:text-slate-200">{result.phone || '-'}</p>
                                        </div>
                                    </div>

                                    {/* Timestamps */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Tanggal Pendaftaran</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(result.createdAt)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Terakhir Diperbarui</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatDate(result.updatedAt)}</p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200">Status Proses:</p>

                                        <div className="relative pl-6 space-y-4">
                                            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

                                            <div className="relative z-10">
                                                <span className="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 bg-emerald-500"></span>
                                                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Data Terkirim</h4>
                                                <p className="text-xs text-slate-500 mt-0.5">{formatDate(result.createdAt)}</p>
                                            </div>

                                            <div className="relative z-10">
                                                <span className={`absolute -left-[27px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${isValidated ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                <h4 className={`text-sm font-bold ${isValidated ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-200'}`}>
                                                    {isValidated ? 'Diverifikasi Admin' : 'Proses Verifikasi Admin'}
                                                </h4>
                                                {!isValidated && (
                                                    <p className="text-xs text-slate-500 mt-0.5 inline-block bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Maks. 1x24 jam</p>
                                                )}
                                                {isValidated && (
                                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">{formatDate(result.updatedAt)}</p>
                                                )}
                                            </div>

                                            <div className={`relative z-10 ${!isValidated ? 'opacity-50' : ''}`}>
                                                <span className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 ${isValidated ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                                                <h4 className={`text-sm font-bold ${isValidated ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                                                    Tervalidasi & Masuk Database
                                                </h4>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Validated Success Message */}
                                    {isValidated && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-4 flex items-start gap-3"
                                        >
                                            <span className="material-symbols-outlined text-emerald-500 text-xl mt-0.5 shrink-0">check_circle</span>
                                            <div>
                                                <p className="text-emerald-800 dark:text-emerald-300 text-sm font-bold">Data Anda Sudah Tervalidasi!</p>
                                                <p className="text-emerald-700 dark:text-emerald-400 text-xs mt-0.5">Data Anda telah diverifikasi oleh admin dan sudah masuk ke database resmi GMIT Jemaat Emaus Liliba.</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-center"
                    >
                        <button
                            onClick={() => navigate('/')}
                            className="text-slate-500 dark:text-slate-400 text-sm font-semibold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hover:underline hover:underline-offset-4"
                        >
                            ← Kembali ke Beranda
                        </button>
                    </motion.div>
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default StatusPage;
