import { useState } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { useSession } from '../lib/auth-client';
import { toast } from '../components/ui/Toast';

const AdminProfile = () => {
    const { data: session } = useSession();
    const user = session?.user;

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleSave = async () => {
        // TODO: Implement profile update API
        toast.success('Profil berhasil diperbarui');
        setIsEditing(false);
    };

    return (
        <AdminLayout title="Profil Saya">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Profile Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {/* Header */}
                    <div className="relative h-32 bg-gradient-to-r from-primary to-indigo-600">
                        <div className="absolute -bottom-12 left-6">
                            <div className="size-24 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-white shadow-lg">
                                <img
                                    src={user?.image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-16 pb-6 px-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    {user?.name || 'Admin Gereja'}
                                </h2>
                                <p className="text-sm text-slate-500">{user?.email || 'admin@gmitemaus.org'}</p>
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    {isEditing ? 'close' : 'edit'}
                                </span>
                                {isEditing ? 'Batal' : 'Edit Profil'}
                            </button>
                        </div>

                        {/* Edit Form */}
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                                        disabled
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah</p>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <span className="material-symbols-outlined text-slate-400">badge</span>
                                    <div>
                                        <p className="text-xs text-slate-500">Role</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">Administrator</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                                    <span className="material-symbols-outlined text-slate-400">calendar_today</span>
                                    <div>
                                        <p className="text-xs text-slate-500">Bergabung Sejak</p>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                                            {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Aksi Cepat</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <a
                            href="/admin/settings"
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-colors flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-primary">settings</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pengaturan</span>
                        </a>
                        <a
                            href="/admin/notifications"
                            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary hover:bg-primary/5 transition-colors flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-primary">notifications</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notifikasi</span>
                        </a>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminProfile;
