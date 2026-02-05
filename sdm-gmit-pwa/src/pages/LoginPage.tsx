import { useState } from 'react';
import { signIn } from '../lib/auth-client';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');


        try {
            // Attempt Real Login
            const signInClient = signIn as any;
            await signInClient.emailAndPassword({
                email,
                password,
            }, {
                onSuccess: () => {
                    navigate('/admin');
                },
                onError: (ctx: any) => {
                    // Check if it's a connection error (backend might be down)
                    if (ctx.error.status === 0 || ctx.error.message?.includes('fetch')) {
                        // Fallback mechanism for demo/dev purposes if backend is missing
                        if (email === 'admin@gmitemaus.org' && password === 'admin') {
                            toast.success("Login Berhasil (Mode Demo)");
                            setTimeout(() => navigate('/admin'), 1000);
                            return;
                        }
                        setError("Gagal terhubung ke server. Pastikan backend aktif.");
                    } else {
                        setError(ctx.error.message || 'Email atau password salah');
                    }
                    setLoading(false);
                }
            });
        } catch (err) {
            // Unexpected error
            if (email === 'admin@gmitemaus.org' && password === 'admin') {
                navigate('/admin');
            } else {
                setError('Terjadi kesalahan sistem. Coba lagi nanti.');
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 animate-pulse-slow"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 animate-pulse-slow delay-700"></div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in-up">
                <div className="flex flex-col items-center mb-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3 hover:rotate-6 transition-transform">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                        GMIT Emaus
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Sistem Informasi Manajemen Jemaat
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 animate-shake">
                        <span className="material-symbols-outlined text-lg">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                required
                                placeholder="name@domain.com"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-11 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Masukkan password"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-11 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                        <label className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-slate-300 transition-colors">
                            <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-offset-slate-900" />
                            Ingat saya
                        </label>
                        <a href="#" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Lupa password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-0.5 transition-all text-center flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer / Demo Hint */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <p className="text-slate-500 text-xs">
                        Belum punya akun? <span className="text-slate-400 cursor-not-allowed">Hubungi Sekretariat</span>
                    </p>
                    <div className="mt-4 px-4 py-2 bg-slate-800/50 rounded-lg inline-block border border-slate-700/50">
                        <p className="text-[10px] text-slate-400 font-mono">
                            Demo: admin@gmitemaus.org / admin
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
