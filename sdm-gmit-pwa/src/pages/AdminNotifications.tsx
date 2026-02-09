import { AdminLayout } from '../components/layouts/AdminLayout';
import { useNotifications } from '../hooks/useNotifications';

const AdminNotifications = () => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();

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

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <AdminLayout title="Notifikasi">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Semua Notifikasi</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Tidak ada notifikasi baru'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={() => markAllAsRead()}
                            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">done_all</span>
                            Tandai Semua Dibaca
                        </button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center">
                            <span className="material-symbols-outlined text-5xl text-slate-300 mb-4">notifications_off</span>
                            <p className="text-slate-500">Tidak ada notifikasi</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={`p-4 sm:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                        }`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`mt-1 size-3 rounded-full shrink-0 ${!notif.isRead ? 'bg-primary' : 'bg-slate-300'}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-400'}`}>
                                                        {notif.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{notif.message}</p>
                                                    <p className="text-xs text-slate-400 mt-2 font-medium">{getRelativeTime(notif.createdAt)}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    {!notif.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notif.id)}
                                                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                            title="Tandai dibaca"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">done</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminNotifications;
