import { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { authClient } from '../../lib/auth-client';
import { useSettings } from '../../hooks/useSettings';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    const navigate = useNavigate();
    const { profile } = useSettings();

    const handleLogout = async () => {
        try {
            await authClient.signOut();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            navigate('/login');
        }
    };

    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const handleInstallClick = () => {
        if (installPrompt) {
            installPrompt.prompt();
            installPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    setInstallPrompt(null);
                }
            });
        }
    };

    return (
        <>
            {/* Sidebar */}
            <aside className={`border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 transition-all duration-300 fixed md:static z-40 h-full ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 md:w-0 md:border-r-0 md:translate-x-0 md:overflow-hidden'}`}>
                {/* Logo Area */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center text-slate-900">
                        <span className="material-symbols-outlined">church</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold leading-none text-slate-900 dark:text-white">GMIT Emaus</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Liliba HR Management</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 flex flex-col gap-1 px-3">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-primary/10 text-primary font-bold'
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
                        to="/admin/members"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>group</span>
                                Data Jemaat
                            </>
                        )}
                    </NavLink>

                    <NavLink
                        to="/admin/reports"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined ${isActive ? 'filled' : ''}`}>bar_chart</span>
                                Laporan & Statistik
                            </>
                        )}
                    </NavLink>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <NavLink
                        to="/admin/settings"
                        className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors cursor-pointer ${isActive
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                    >
                        {({ isActive }) => (
                            <>
                                <span className={`material-symbols-outlined text-sm ${isActive ? 'filled' : ''}`}>settings</span>
                                <span className="text-sm font-medium">Pengaturan</span>
                            </>
                        )}
                    </NavLink>

                    {installPrompt && (
                        <div
                            onClick={handleInstallClick}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-colors cursor-pointer text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                            <span className="material-symbols-outlined text-sm">download</span>
                            <span className="text-sm font-medium">Install App</span>
                        </div>
                    )}

                    <div className="pt-2">
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={handleLogout}>
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-full bg-cover bg-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                                    <img src={profile.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} alt="Admin" className="w-full h-full object-cover" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs font-bold truncate text-slate-900 dark:text-white">{profile.firstName} {profile.lastName}</p>
                                    <p className="text-[10px] text-slate-500 truncate">{profile.email}</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-slate-400 group-hover:text-red-500 transition-colors text-lg">logout</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden animate-fade-in"
                    onClick={onClose}
                ></div>
            )}
        </>
    );
};
