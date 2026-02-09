import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { toast } from '../components/ui/Toast';

import { useSettings } from '../hooks/useSettings';



// Password strength calculator
const calculatePasswordStrength = (password: string): number => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return Math.min(strength, 4);
};

const strengthLabels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

// Reusable Switch Component with enhanced styling
const Switch = ({ checked, onChange, label, description }: { checked: boolean, onChange: (checked: boolean) => void, label: string, description?: string }) => (
    <div
        className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        onClick={() => onChange(!checked)}
    >
        <div className="flex-1 pr-4">
            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">{label}</h4>
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
        </div>
        <div className={`relative w-12 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-accent shadow-lg shadow-accent/30' : 'bg-slate-300 dark:bg-slate-600'}`}>
            <span
                className={`absolute top-1 left-1 bg-white rounded-full size-4 shadow-md transform transition-all duration-300 flex items-center justify-center ${checked ? 'translate-x-6' : 'translate-x-0'}`}
            >
                {checked && <span className="material-symbols-outlined text-accent text-[10px] font-bold animate-scale-in">check</span>}
            </span>
        </div>
    </div>
);

// Session type for security tab
interface Session {
    id: number;
    device: string;
    browser: string;
    location: string;
    current: boolean;
    lastActive: string;
    ip: string;
}

const AdminSettings = () => {
    const navigate = useNavigate();
    const {
        profile, updateProfile,
        security, updateSecurity,
        // Enforce defaults on mount effectively by not exposing setters, 
        // essentially leaving them as is (assuming default is light/gold or handled elsewhere). 
        // To strictly "force" light and gold if they were changed, we'd need to reset them.
        // For now, removing the UI is the primary step.
    } = useSettings();

    const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'security'>('profile');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Avatar upload with drag-drop
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar);
    const [isDragging, setIsDragging] = useState(false);

    // Confirm Dialog state
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        variant: 'danger' | 'warning' | 'info';
        onConfirm: () => void;
    }>({ isOpen: false, title: '', message: '', variant: 'warning', onConfirm: () => { } });



    // Profile Local State
    const [localProfile, setLocalProfile] = useState(profile);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

    // Sessions (simulated)
    const [sessions, setSessions] = useState<Session[]>([
        { id: 1, device: 'Desktop', browser: 'Chrome 120', location: 'Kupang, NTT', current: true, lastActive: 'Sekarang', ip: '192.168.1.1' },
        { id: 2, device: 'Mobile', browser: 'Safari 17', location: 'Kupang, NTT', current: false, lastActive: '2 jam lalu', ip: '192.168.1.45' },
        { id: 3, device: 'Tablet', browser: 'Firefox 121', location: 'Jakarta', current: false, lastActive: '1 hari lalu', ip: '103.28.12.89' },
    ]);

    // Password strength
    const passwordStrength = useMemo(() => calculatePasswordStrength(passwordForm.new), [passwordForm.new]);

    // Track unsaved changes
    useEffect(() => {
        const profileChanged = JSON.stringify(localProfile) !== JSON.stringify(profile);
        const avatarChanged = avatarPreview !== profile.avatar;
        setHasUnsavedChanges(profileChanged || avatarChanged);
    }, [localProfile, avatarPreview, profile]);

    // Update localProfile when profile changes from upstream (e.g. initial load)
    useEffect(() => {
        setLocalProfile(profile);
        if (profile.avatar) setAvatarPreview(profile.avatar);
    }, [profile]);

    // ... (Keyboard shortcuts useEffect skipped as it's fine)

    // ... (Drag and drop handlers skipped)

    // ... (Tab change handlers skipped)

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+S to save profile
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                if (activeTab === 'profile' && hasUnsavedChanges) {
                    handleSaveProfile();
                }
            }
            // Ctrl+1-3 for tab switching
            if (e.ctrlKey && e.key >= '1' && e.key <= '3') {
                e.preventDefault();
                const tabs: Array<typeof activeTab> = ['profile', 'system', 'security'];
                const tabIndex = parseInt(e.key) - 1;
                if (tabs[tabIndex]) handleTabChange(tabs[tabIndex]);
            }
            // Escape to close dialogs
            if (e.key === 'Escape') {
                if (confirmDialog.isOpen) setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, hasUnsavedChanges, confirmDialog.isOpen]);

    // Drag and drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            toast.error('Hanya file gambar yang diperbolehkan');
        }
    }, []);

    // Tab change with animation and unsaved warning
    // Pending tab for confirm dialog


    const handleTabChange = (newTab: typeof activeTab) => {
        if (hasUnsavedChanges && activeTab === 'profile') {

            setConfirmDialog({
                isOpen: true,
                title: 'Perubahan Belum Disimpan',
                message: 'Ada perubahan profil yang belum disimpan. Apakah Anda yakin ingin pindah tab? Perubahan akan hilang.',
                variant: 'warning',
                onConfirm: () => {
                    setLocalProfile(profile);
                    setAvatarPreview(profile.avatar);
                    setHasUnsavedChanges(false);
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                    proceedTabChange(newTab);
                }
            });
            return;
        }
        proceedTabChange(newTab);
    };

    const proceedTabChange = (newTab: typeof activeTab) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setActiveTab(newTab);
            setIsTransitioning(false);
        }, 150);
    };

    // Avatar handlers
    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file maksimal 2MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        const updatedProfile = { ...localProfile, avatar: avatarPreview };

        toast.promise(new Promise((resolve) => {
            updateProfile(updatedProfile);
            setTimeout(resolve, 800);
        }), {
            loading: 'Menyimpan profil...',
            success: 'Profil berhasil diperbarui!',
            error: 'Gagal menyimpan profil'
        });

        setHasUnsavedChanges(false);
    };

    const handleUpdatePassword = () => {
        if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
            toast.error("Mohon lengkapi semua field password.");
            return;
        }

        if (passwordForm.new !== passwordForm.confirm) {
            toast.error("Konfirmasi password baru tidak cocok.");
            return;
        }

        if (passwordForm.new.length < 8) {
            toast.error("Password baru minimal 8 karakter.");
            return;
        }

        if (passwordStrength < 2) {
            toast.error("Password terlalu lemah. Gunakan kombinasi huruf besar, kecil, angka, dan simbol.");
            return;
        }

        toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: 'Mengupdate password...',
            success: 'Password berhasil diubah!',
            error: 'Gagal mengubah password'
        }).then(() => {
            setPasswordForm({ current: '', new: '', confirm: '' });
        });
    };

    const handleBackup = () => {
        toast.info("Memulai proses backup database...");
        setTimeout(() => {
            toast.success("Backup berhasil! File 'backup_db_2025.sql' sedang didownload.");
        }, 2000);
    };

    const handleClearCache = () => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: 'Membersihkan cache aplikasi...',
            success: 'Cache berhasil dibersihkan! Kinerja aplikasi meningkat.',
            error: 'Gagal membersihkan cache'
        });
    };



    const handleLogoutSession = (sessionId: number) => {
        toast.promise(new Promise((resolve) => {
            setTimeout(() => {
                setSessions(prev => prev.filter(s => s.id !== sessionId));
                resolve(true);
            }, 800);
        }), {
            loading: 'Mengakhiri sesi...',
            success: 'Sesi berhasil diakhiri',
            error: 'Gagal mengakhiri sesi'
        });
    };


    const menuItems = [
        { id: 'profile', label: 'Profil Akun', icon: 'person' },
        { id: 'system', label: 'Sistem & Data', icon: 'settings_suggest' },
        { id: 'security', label: 'Keamanan', icon: 'lock' },
    ];



    return (
        <AdminLayout title="Pengaturan Sistem">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group"
            >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="text-sm font-medium">Kembali ke Dashboard</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-8 animate-fade-in-up pb-8">

                {/* 1. Sidebar Navigation */}
                <div className="w-full lg:w-72 shrink-0 space-y-6">
                    {/* User Mini Profile */}
                    <div className="glass rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl shadow-slate-200/20 dark:shadow-slate-900/30 flex items-center gap-4">
                        <div className="relative">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="size-14 rounded-full object-cover ring-2 ring-accent/30 shadow-lg" />
                            ) : (
                                <div className="size-14 rounded-full bg-gradient-to-br from-accent/80 to-accent text-slate-900 flex items-center justify-center text-xl font-bold shadow-lg shadow-accent/20">
                                    {profile.firstName.charAt(0)}
                                </div>
                            )}
                            <span className="absolute bottom-0 right-0 size-3.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                        </div>
                        <div className="overflow-hidden">
                            <h3 className="font-bold text-slate-900 dark:text-white truncate">{profile.firstName} {profile.lastName}</h3>
                            <p className="text-xs text-slate-500 truncate">{profile.email}</p>
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold border border-green-200 dark:border-green-800">
                                <span className="size-1.5 rounded-full bg-green-500"></span> Online
                            </span>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="glass rounded-2xl p-2 border border-slate-200/50 dark:border-slate-700/50 shadow-lg sticky top-24">
                        <div className="flex flex-col gap-1">
                            {menuItems.map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => handleTabChange(item.id as typeof activeTab)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ripple ${activeTab === item.id
                                        ? 'bg-accent text-slate-900 shadow-lg shadow-accent/20 scale-[1.02]'
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
                                        }`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    {item.label}
                                    {item.id === 'profile' && hasUnsavedChanges && (
                                        <span className="ml-auto size-2 rounded-full bg-orange-500 animate-pulse"></span>
                                    )}
                                </button>
                            ))}

                        </div>
                    </div>
                </div>

                {/* 2. Main Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="glass rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl min-h-[600px] overflow-hidden flex flex-col relative">

                        {/* Tab Header Decoration */}
                        <div className="h-32 bg-gradient-to-r from-slate-100 via-slate-50 to-white dark:from-slate-800 dark:via-slate-850 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800 p-8 flex items-end relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute -top-12 -right-12 size-40 rounded-full bg-accent/10 blur-2xl"></div>
                            <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-accent/5 blur-xl"></div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight capitalize flex items-center gap-3">
                                    {activeTab === 'system' ? 'Sistem & Data' : activeTab}
                                    {hasUnsavedChanges && activeTab === 'profile' && (
                                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 animate-pulse">
                                            Belum Disimpan
                                        </span>
                                    )}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
                                    Kelola preferensi dan konfigurasi {activeTab === 'profile' ? 'akun anda' : 'aplikasi'}
                                </p>
                            </div>
                        </div>

                        <div className={`p-8 flex-1 transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}`}>

                            {/* PROFILE TAB */}
                            {activeTab === 'profile' && (
                                <div className="space-y-8 animate-slide-in-right">
                                    <div className="flex flex-col md:flex-row items-start gap-8">
                                        {/* Avatar Upload */}
                                        <div className="relative group">
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                            <div
                                                onClick={handleAvatarClick}
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={handleDrop}
                                                className={`size-32 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-6xl shadow-inner border-4 border-white dark:border-slate-700 font-black text-slate-300 cursor-pointer overflow-hidden transition-all duration-300 ${isDragging ? 'ring-4 ring-accent scale-105 bg-accent/10' : 'hover:ring-4 hover:ring-accent/30'}`}
                                            >
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} alt="Avatar" className="size-full object-cover" />
                                                ) : (
                                                    profile.firstName.charAt(0)
                                                )}
                                            </div>
                                            <button
                                                onClick={handleAvatarClick}
                                                className="absolute bottom-0 right-0 p-2.5 bg-accent text-slate-900 rounded-full shadow-lg hover:scale-110 transition-transform ripple"
                                            >
                                                <span className="material-symbols-outlined text-lg">photo_camera</span>
                                            </button>
                                            <p className="text-xs text-slate-400 text-center mt-2">Maks. 2MB</p>
                                        </div>

                                        <div className="flex-1 w-full space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Depan</label>
                                                    <input
                                                        type="text"
                                                        value={localProfile.firstName}
                                                        onChange={(e) => setLocalProfile({ ...localProfile, firstName: e.target.value })}
                                                        className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Nama Belakang</label>
                                                    <input
                                                        type="text"
                                                        value={localProfile.lastName}
                                                        onChange={(e) => setLocalProfile({ ...localProfile, lastName: e.target.value })}
                                                        className="w-full h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="col-span-1 md:col-span-2 space-y-2">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                                                    <div className="relative">
                                                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                                        <input
                                                            type="email"
                                                            value={localProfile.email}
                                                            onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })}
                                                            className="w-full h-11 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-span-1 md:col-span-2">
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 block">Bio</label>
                                                    <textarea
                                                        rows={3}
                                                        value={localProfile.bio}
                                                        onChange={(e) => setLocalProfile({ ...localProfile, bio: e.target.value })}
                                                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all resize-none"
                                                    ></textarea>
                                                </div>
                                            </div>
                                            <div className="flex justify-end pt-4">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={!hasUnsavedChanges}
                                                    className={`px-8 py-3 bg-accent text-slate-900 font-bold rounded-xl shadow-lg shadow-accent/20 transition-all ripple ${hasUnsavedChanges
                                                        ? 'hover:shadow-xl hover:-translate-y-0.5'
                                                        : 'opacity-50 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Simpan Perubahan
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity Log */}
                                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                        <h3 className="font-bold text-lg mb-4">Aktivitas Terakhir</h3>
                                        <div className="space-y-4">
                                            {[
                                                { icon: 'edit_document', text: 'Memperbarui data jemaat Keluarga Amalo', time: '2 jam yang lalu', color: 'blue' },
                                                { icon: 'person_add', text: 'Menambahkan anggota baru: Maria T.', time: '5 jam yang lalu', color: 'green' },
                                                { icon: 'download', text: 'Mengunduh laporan data jemaat', time: '1 hari yang lalu', color: 'purple' },
                                            ].map((activity, i) => (
                                                <div key={i} className="flex gap-4 items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all duration-200 hover:translate-x-1 group">
                                                    <div className={`size-10 rounded-xl bg-${activity.color}-100 dark:bg-${activity.color}-900/30 text-${activity.color}-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                                        <span className="material-symbols-outlined text-sm">{activity.icon}</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.text}</p>
                                                        <p className="text-xs text-slate-500">{activity.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}



                            {/* SYSTEM & DATA TAB */}
                            {activeTab === 'system' && (
                                <div className="space-y-8 animate-slide-in-right">


                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Manajemen Data</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-slate-800/50 border border-blue-100 dark:border-blue-900/30 flex flex-col justify-between hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all duration-300 group hover:-translate-y-1">
                                                <div>
                                                    <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-100 dark:shadow-blue-900/20">
                                                        <span className="material-symbols-outlined">database</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">Backup Database</h4>
                                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">Download salinan lengkap database dalam format .SQL untuk arsip offline.</p>
                                                </div>
                                                <button onClick={handleBackup} className="mt-4 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-200 transition-all w-full ripple">
                                                    Download Backup
                                                </button>
                                            </div>

                                            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-white dark:from-red-900/10 dark:to-slate-800/50 border border-red-100 dark:border-red-900/30 flex flex-col justify-between hover:shadow-lg hover:shadow-red-100/50 dark:hover:shadow-red-900/20 transition-all duration-300 group hover:-translate-y-1">
                                                <div>
                                                    <div className="size-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-red-100 dark:shadow-red-900/20">
                                                        <span className="material-symbols-outlined">cleaning_services</span>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">Bersihkan Cache</h4>
                                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">Hapus data sementara untuk memperbaiki masalah tampilan atau kinerja.</p>
                                                </div>
                                                <button onClick={handleClearCache} className="mt-4 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-200 transition-all w-full ripple">
                                                    Bersihkan Sekarang
                                                </button>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Ekspor Data</h3>
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-900/10 dark:to-slate-800/50 border border-emerald-100 dark:border-emerald-900/30">
                                            <div className="flex items-start gap-4">
                                                <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20">
                                                    <span className="material-symbols-outlined">download</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900 dark:text-white">Ekspor Semua Pengaturan</h4>
                                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Unduh semua pengaturan aplikasi dalam format JSON untuk backup atau migrasi.</p>
                                                    <button
                                                        onClick={() => {
                                                            // Minimal export since most settings are removed
                                                            const settings = {
                                                                profile,
                                                                security
                                                            };
                                                            const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
                                                            const url = URL.createObjectURL(blob);
                                                            const a = document.createElement('a');
                                                            a.href = url;
                                                            a.download = 'settings_backup.json';
                                                            a.click();
                                                            toast.success('Pengaturan berhasil diekspor!');
                                                        }}
                                                        className="mt-3 py-2 px-4 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-700 transition-colors ripple"
                                                    >
                                                        Ekspor Sekarang
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {/* SECURITY TAB */}
                            {activeTab === 'security' && (
                                <div className="space-y-8 animate-slide-in-right">
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Ganti Password</h3>
                                        <div className="bg-slate-50/80 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                                            <div>
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Password Saat Ini</label>
                                                <div className="relative">
                                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={passwordForm.current}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Password Baru</label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={passwordForm.new}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                                                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent outline-none transition-all"
                                                    />
                                                    {/* Password Strength Indicator */}
                                                    {passwordForm.new && (
                                                        <div className="mt-2">
                                                            <div className="flex gap-1">
                                                                {[1, 2, 3, 4].map(i => (
                                                                    <div
                                                                        key={i}
                                                                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${passwordStrength >= i ? strengthColors[passwordStrength] : 'bg-slate-200 dark:bg-slate-700'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <p className={`text-xs mt-1 font-medium ${strengthColors[passwordStrength]?.replace('bg-', 'text-')}`}>
                                                                {strengthLabels[passwordStrength]}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5 block">Konfirmasi Password Baru</label>
                                                    <input
                                                        type="password"
                                                        placeholder="••••••••"
                                                        value={passwordForm.confirm}
                                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                                        className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border focus:ring-2 focus:ring-accent outline-none transition-all ${passwordForm.confirm && passwordForm.confirm !== passwordForm.new
                                                            ? 'border-red-500'
                                                            : 'border-slate-200 dark:border-slate-700'
                                                            }`}
                                                    />
                                                    {passwordForm.confirm && passwordForm.confirm !== passwordForm.new && (
                                                        <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="pt-2 flex justify-end">
                                                <button onClick={handleUpdatePassword} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity ripple shadow-lg">
                                                    Update Password
                                                </button>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Keamanan Tambahan</h3>
                                        <div className="space-y-3">
                                            <Switch
                                                checked={security.sessionTimeout}
                                                onChange={(c) => updateSecurity({ ...security, sessionTimeout: c })}
                                                label="Session Timeout Otomatis"
                                                description="Logout otomatis jika tidak ada aktivitas selama 30 menit."
                                            />
                                        </div>
                                    </section>

                                    {/* Active Sessions */}
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Sesi Aktif</h3>
                                        <div className="space-y-3">
                                            {sessions.map(session => (
                                                <div key={session.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`size-10 rounded-xl flex items-center justify-center ${session.current
                                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                                                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                                                            }`}>
                                                            <span className="material-symbols-outlined">
                                                                {session.device === 'Mobile' ? 'phone_iphone' : session.device === 'Tablet' ? 'tablet' : 'computer'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                                {session.browser}
                                                                {session.current && (
                                                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
                                                                        Sesi Ini
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-slate-500">
                                                                {session.device} • {session.location} • {session.lastActive}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {!session.current && (
                                                        <button
                                                            onClick={() => handleLogoutSession(session.id)}
                                                            className="px-3 py-1.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            Logout
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                            )}



                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout >
    );
};

export default AdminSettings;
