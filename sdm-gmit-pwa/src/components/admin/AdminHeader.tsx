import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient, useSession } from '../../lib/auth-client';

interface AdminHeaderProps {
    title: string;
    onMenuClick: () => void;
}

export const AdminHeader = ({ title, onMenuClick }: AdminHeaderProps) => {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    // Auth Session
    const { data: session } = useSession();
    const user = session?.user;

    // Refs for click outside handling
    const profileRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLButtonElement>(null);

    // Mock Notifications
    const notifications = [
        { id: 1, text: "Jemaat baru terdaftar: Bpk. Stefanus", time: "Baru saja", unread: true },
        { id: 2, text: "Laporan bulanan siap diunduh", time: "1 jam lalu", unread: false },
        { id: 3, text: "Jadwal pelayanan diperbarui", time: "Kemarin", unread: false },
    ];

    const handleLogout = async () => {
        await authClient.signOut();
        navigate('/login');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={onMenuClick}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative hidden lg:block group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm group-focus-within:text-primary transition-colors">search</span>
                    <input
                        className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-slate-900 rounded-lg text-sm w-64 ring-0 outline-none transition-all placeholder:text-slate-400"
                        placeholder="Cari data jemaat..."
                        type="text"
                    />
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

                <button
                    onClick={() => navigate('/admin/settings')}
                    className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    title="Pengaturan"
                >
                    <span className="material-symbols-outlined">settings</span>
                </button>

                <div className="relative">
                    <button
                        ref={notifRef}
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className={`relative p-2 rounded-lg transition-colors ${isNotifOpen ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>

                    {/* Notification Dropdown */}
                    {isNotifOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden origin-top-right">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifikasi</h3>
                                <button className="text-[10px] font-bold text-primary hover:underline">Tandai semua dibaca</button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer ${notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`mt-1 size-2 rounded-full shrink-0 ${notif.unread ? 'bg-primary' : 'bg-slate-300'}`}></div>
                                            <div>
                                                <p className={`text-xs ${notif.unread ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-400'}`}>{notif.text}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-2 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors">Lihat Semua</button>
                            </div>
                        </div>
                    )}
                </div>

                <div
                    ref={profileRef}
                    className="relative hidden md:block"
                >
                    <div
                        className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-700 cursor-pointer group"
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="text-right hidden lg:block">
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-none group-hover:text-primary transition-colors">{user?.name || 'Admin'}</p>
                            <p className="text-[10px] text-slate-500">Administrator</p>
                        </div>
                        <div className={`size-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 transition-all ${isProfileOpen ? 'ring-primary' : 'ring-transparent group-hover:ring-primary/50'}`}>
                            <img src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} alt="Admin" className="w-full h-full" />
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    {isProfileOpen && (
                        <div className="absolute right-0 top-full mt-4 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up origin-top-right">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                                <p className="font-bold text-slate-900 dark:text-white text-sm">{user?.name || 'Admin Gereja'}</p>
                                <p className="text-xs text-slate-500">{user?.email || 'admin@gmitemaus.org'}</p>
                            </div>
                            <div className="p-1">
                                <button onClick={() => navigate('/admin/profile')} className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">person</span>
                                    Profil Saya
                                </button>
                                <button onClick={() => navigate('/admin/settings')} className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg">settings</span>
                                    Pengaturan
                                </button>
                            </div>
                            <div className="p-1 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg flex items-center gap-2 font-medium"
                                >
                                    <span className="material-symbols-outlined text-lg">logout</span>
                                    Keluar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
