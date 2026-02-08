import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient, useSession } from '../../lib/auth-client';
import { useNotifications } from '../../hooks/useNotifications';

interface AdminHeaderProps {
    title: string;
    onMenuClick: () => void;
}

const HeaderClock = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 md:hidden lg:flex">
            <span>{date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="size-1 rounded-full bg-slate-300"></span>
            <span>{date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
    );
};

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

    // Real-time Notifications
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    // Helper to format relative time
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Baru saja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
        return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    };

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
                    className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    onClick={onMenuClick}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                <div className="flex flex-col">
                    <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">{title}</h2>
                    <HeaderClock />
                </div>
            </div>

            <div className="flex items-center gap-4">


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
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotifOpen && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden origin-top-right animate-fade-in-up">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifikasi</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            markAllAsRead();
                                        }}
                                        className="text-[10px] font-bold text-primary hover:underline"
                                    >
                                        Tandai semua dibaca
                                    </button>
                                )}
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400">
                                        <span className="material-symbols-outlined text-3xl mb-2">notifications_off</span>
                                        <p className="text-xs">Tidak ada notifikasi</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => !notif.isRead && markAsRead(notif.id)}
                                            className={`p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 size-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-primary' : 'bg-slate-300'}`}></div>
                                                <div>
                                                    <h4 className={`text-xs ${!notif.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-400'}`}>
                                                        {notif.title}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                                                    <p className="text-[10px] text-slate-400 mt-2 font-medium">{getRelativeTime(notif.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
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
