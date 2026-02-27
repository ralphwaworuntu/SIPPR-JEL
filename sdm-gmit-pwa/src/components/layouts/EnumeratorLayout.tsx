import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { authClient } from '../../lib/auth-client';

interface EnumeratorLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const EnumeratorLayout = ({ children, title = "Dashboard" }: EnumeratorLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authClient.signOut();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            navigate('/login');
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden selection:bg-emerald-500/30">
            {/* Sidebar */}
            <aside className={`border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 transition-all duration-300 fixed md:static z-40 h-full ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:w-0 md:border-r-0 md:translate-x-0 md:overflow-hidden'}`}>
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="size-10 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">person_search</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold leading-none text-slate-900 dark:text-white">Enumerator</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">SDM GMIT Emaus</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
                    <NavLink
                        to="/enumerator"
                        end
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>dashboard</span>
                                Dashboard
                            </>
                        )}
                    </NavLink>
                    <NavLink
                        to="/enumerator/visits"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-emerald-500/10 text-emerald-600 font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>fact_check</span>
                                Kelola Kunjungan
                            </>
                        )}
                    </NavLink>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="pt-2">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={handleLogout}>
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-emerald-600 text-sm">person</span>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold truncate text-slate-900 dark:text-white">Enumerator</p>
                                    <p className="text-[10px] text-slate-500 truncate">Keluar</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-red-500 transition-colors text-lg">logout</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        >
                            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">menu</span>
                        </button>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth flex flex-col">
                    <div className="max-w-7xl mx-auto space-y-8 w-full flex-1">
                        {children}
                    </div>
                    <div className="mt-12 py-6 text-center border-t border-slate-100 dark:border-slate-800">
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            Developed by GMIT Emaus Liliba. &copy; {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
