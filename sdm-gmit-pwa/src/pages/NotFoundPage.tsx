import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-9xl font-black text-indigo-100 dark:text-slate-800">404</h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative -mt-12"
                >
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Maaf, halaman yang Anda cari mungkin telah dipindahkan atau tidak tersedia.
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 mx-auto"
                    >
                        <span className="material-symbols-outlined">home</span>
                        Kembali ke Beranda
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
