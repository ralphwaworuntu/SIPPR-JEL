import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { toast } from '../components/ui/Toast';

import { useSettings } from '../hooks/useSettings';

// Broadcast message templates
const BROADCAST_TEMPLATES = [
    { id: 'ibadah', title: 'Undangan Ibadah', message: 'Salam sejahtera dalam Tuhan.\n\nDengan ini kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam ibadah yang akan diselenggarakan pada:\n\nHari/Tanggal: \nWaktu: \nTempat: \n\nMari bersama-sama memuji dan menyembah Tuhan.\n\nTuhan memberkati.' },
    { id: 'pengumuman', title: 'Pengumuman Gereja', message: 'Salam sejahtera,\n\nDengan hormat kami sampaikan pengumuman sebagai berikut:\n\n[Isi pengumuman]\n\nDemikian pengumuman ini kami sampaikan. Atas perhatiannya kami ucapkan terima kasih.\n\nTuhan memberkati.' },
    { id: 'dukacita', title: 'Berita Duka', message: 'Turut berduka cita,\n\nDengan duka yang mendalam kami sampaikan bahwa telah berpulang ke Rumah Bapa:\n\nNama: \nUsia: \nPada: \n\nKeluarga yang ditinggalkan:\n\nKiranya Tuhan memberikan penghiburan kepada keluarga yang berduka.' },
    { id: 'ucapan', title: 'Ucapan Syukur', message: 'Puji Tuhan!\n\nDengan penuh sukacita kami mengucap syukur kepada Tuhan atas berkat yang telah diterima:\n\n[Detail ucapan syukur]\n\nKiranya Tuhan terus melimpahkan berkat-Nya.\n\nShalom.' }
];

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
    const {
        theme, setTheme,
        profile, updateProfile,
        notifications, updateNotifications,
        security, updateSecurity,
        appearance, updateAppearance,
        broadcastHistory, addBroadcast, deleteBroadcast, clearBroadcastHistory
    } = useSettings();

    const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'system' | 'security' | 'broadcast'>('profile');
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

    // Broadcast State
    const [broadcast, setBroadcast] = useState({
        target: 'all',
        title: '',
        message: ''
    });
    const [showHistory, setShowHistory] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

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
            // Ctrl+1-5 for tab switching
            if (e.ctrlKey && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const tabs: Array<typeof activeTab> = ['profile', 'appearance', 'system', 'security', 'broadcast'];
                const tabIndex = parseInt(e.key) - 1;
                if (tabs[tabIndex]) handleTabChange(tabs[tabIndex]);
            }
            // Escape to close dialogs/history
            if (e.key === 'Escape') {
                if (confirmDialog.isOpen) setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                if (showHistory) setShowHistory(false);
                if (showTemplates) setShowTemplates(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTab, hasUnsavedChanges, confirmDialog.isOpen, showHistory, showTemplates]);

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

    const handleSendBroadcast = () => {
        if (!broadcast.title || !broadcast.message) {
            toast.error("Mohon lengkapi judul dan pesan broadcast.");
            return;
        }

        toast.info("Mengirim pesan broadcast...");

        addBroadcast({
            target: broadcast.target,
            title: broadcast.title,
            message: broadcast.message
        });

        setTimeout(() => {
            toast.success('Pesan berhasil dikirim ke ' + (broadcast.target === 'all' ? 'semua jemaat' : 'target terpilih'));
            setBroadcast({ target: 'all', title: '', message: '' });
        }, 2000);
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const menuItems = [
        { id: 'profile', label: 'Profil Akun', icon: 'person' },
        { id: 'appearance', label: 'Tampilan', icon: 'palette' },
        { id: 'system', label: 'Sistem & Data', icon: 'settings_suggest' },
        { id: 'security', label: 'Keamanan', icon: 'lock' },
    ];

    const accentColorOptions = [
        { id: 'gold', label: 'Emas', color: '#FFD700' },
        { id: 'blue', label: 'Biru', color: '#3B82F6' },
        { id: 'purple', label: 'Ungu', color: '#8B5CF6' },
        { id: 'rose', label: 'Mawar', color: '#F43F5E' },
        { id: 'emerald', label: 'Zamrud', color: '#10B981' },
    ];

    return (
        <AdminLayout title="Pengaturan Sistem">
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
                            <div className="my-2 h-px bg-slate-100 dark:bg-slate-800 mx-2"></div>
                            <button
                                onClick={() => handleTabChange('broadcast')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ripple ${activeTab === 'broadcast'
                                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30'
                                    : 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:translate-x-1'
                                    }`}
                            >
                                <span className="material-symbols-outlined">campaign</span>
                                Broadcast Pesan
                                {broadcastHistory.length > 0 && (
                                    <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-600">
                                        {broadcastHistory.length}
                                    </span>
                                )}
                            </button>
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
                                    {activeTab === 'system' ? 'Sistem & Data' : activeTab === 'broadcast' ? 'Broadcast Pesan' : activeTab.replace('-', ' ')}
                                    {hasUnsavedChanges && activeTab === 'profile' && (
                                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 animate-pulse">
                                            Belum Disimpan
                                        </span>
                                    )}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-medium">
                                    Kelola preferensi dan konfigurasi {activeTab === 'broadcast' ? 'pesan massal' : 'aplikasi'}
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

                            {/* APPEARANCE TAB */}
                            {activeTab === 'appearance' && (
                                <div className="space-y-8 animate-slide-in-right">
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Tema Aplikasi</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {[
                                                { id: 'light', label: 'Terang', icon: 'light_mode', color: 'bg-gradient-to-br from-amber-100 to-white' },
                                                { id: 'dark', label: 'Gelap', icon: 'dark_mode', color: 'bg-gradient-to-br from-slate-800 to-slate-900' },
                                                { id: 'system', label: 'Sistem', icon: 'contrast', color: 'bg-gradient-to-br from-white via-slate-200 to-slate-800' }
                                            ].map((mode) => (
                                                <button
                                                    key={mode.id}
                                                    onClick={() => setTheme(mode.id as 'light' | 'dark' | 'system')}
                                                    className={`group relative p-5 rounded-2xl border-2 text-left transition-all duration-300 overflow-hidden hover:-translate-y-1 ${theme === mode.id
                                                        ? 'border-accent ring-2 ring-accent/30 shadow-lg shadow-accent/10'
                                                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                                        }`}
                                                >
                                                    <div className={`h-20 rounded-xl mb-4 ${mode.color} flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-inner`}>
                                                        <span className={`material-symbols-outlined text-3xl ${mode.id === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{mode.icon}</span>
                                                    </div>
                                                    {mode.id === theme && (
                                                        <div className="absolute top-3 right-3 bg-accent text-slate-900 rounded-full p-1.5 shadow-md animate-scale-in">
                                                            <span className="material-symbols-outlined text-sm font-bold">check</span>
                                                        </div>
                                                    )}
                                                    <span className="font-bold block text-slate-900 dark:text-white">{mode.label}</span>
                                                    <span className="text-xs text-slate-500">
                                                        {mode.id === 'system' ? 'Mengikuti pengaturan perangkat' : `Mode ${mode.label.toLowerCase()} permanen`}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Warna Aksen</h3>
                                        <div className="p-6 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                                Pilih warna aksen untuk tombol dan elemen interaktif di seluruh aplikasi.
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                {accentColorOptions.map((color) => (
                                                    <button
                                                        key={color.id}
                                                        onClick={() => updateAppearance({ accentColor: color.id })}
                                                        className={`group flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 hover:bg-white dark:hover:bg-slate-700 ${appearance.accentColor === color.id ? 'bg-white dark:bg-slate-700 shadow-md' : ''
                                                            }`}
                                                    >
                                                        <div
                                                            className={`size-10 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110 ${appearance.accentColor === color.id ? 'ring-4 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-800 ring-slate-300 dark:ring-slate-600' : ''
                                                                }`}
                                                            style={{ backgroundColor: color.color }}
                                                        >
                                                            {appearance.accentColor === color.id && (
                                                                <span className="material-symbols-outlined text-white text-lg flex items-center justify-center h-full animate-scale-in drop-shadow-md">check</span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{color.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Preferensi Lainnya</h3>
                                        <div className="space-y-3">
                                            <Switch
                                                checked={appearance.compactMode}
                                                onChange={(c) => updateAppearance({ compactMode: c })}
                                                label="Mode Kompak"
                                                description="Tampilkan lebih banyak data dengan mengurangi padding dan margin."
                                            />
                                        </div>
                                    </section>
                                </div>
                            )}

                            {/* SYSTEM & DATA TAB */}
                            {activeTab === 'system' && (
                                <div className="space-y-8 animate-slide-in-right">
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Notifikasi</h3>
                                        <div className="space-y-3">
                                            <Switch
                                                checked={notifications.email}
                                                onChange={(c) => updateNotifications({ ...notifications, email: c })}
                                                label="Email Notifikasi"
                                                description="Terima ringkasan mingguan dan update penting via email."
                                            />
                                            <Switch
                                                checked={notifications.browser}
                                                onChange={(c) => updateNotifications({ ...notifications, browser: c })}
                                                label="Browser Push Notifications"
                                                description="Notifikasi real-time saat browser sedang aktif."
                                            />
                                        </div>
                                    </section>

                                    <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

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
                                                            const settings = {
                                                                theme,
                                                                profile,
                                                                notifications,
                                                                security,
                                                                appearance
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
                                                checked={security.twoFactor}
                                                onChange={(c) => updateSecurity({ ...security, twoFactor: c })}
                                                label="Two-Factor Authentication (2FA)"
                                                description="Wajibkan kode verifikasi dari email/aplikasi saat login."
                                            />
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

                            {/* BROADCAST TAB */}
                            {activeTab === 'broadcast' && (
                                <div className="space-y-6 animate-slide-in-right max-w-2xl mx-auto">
                                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 p-4 rounded-xl flex gap-3 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-800/30">
                                        <span className="material-symbols-outlined shrink-0">warning</span>
                                        <p className="text-xs leading-relaxed font-medium">
                                            Fitur ini akan mengirim pesan massal ke seluruh kontak jemaat terdaftar.
                                            Pastikan konten pesan sudah benar dan sesuai dengan panduan pelayanan.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Target Penerima</label>
                                            <div className="relative">
                                                <select
                                                    value={broadcast.target}
                                                    onChange={(e) => setBroadcast({ ...broadcast, target: e.target.value })}
                                                    className="w-full h-12 pl-4 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer transition-all"
                                                >
                                                    <option value="all">Semua Jemaat (Aktif)</option>
                                                    <option value="rayon1">Rayon 1</option>
                                                    <option value="rayon2">Rayon 2</option>
                                                    <option value="council">Majelis Jemaat</option>
                                                </select>
                                                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Judul Pesan</label>
                                            <input
                                                type="text"
                                                value={broadcast.title}
                                                onChange={(e) => setBroadcast({ ...broadcast, title: e.target.value })}
                                                placeholder="Contoh: Ibadah Syukur Akhir Tahun"
                                                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Isi Pesan</label>
                                                <button
                                                    onClick={() => setShowTemplates(!showTemplates)}
                                                    className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-sm">post_add</span>
                                                    Pilih Template
                                                </button>
                                            </div>

                                            {showTemplates && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2 animate-scale-in">
                                                    {BROADCAST_TEMPLATES.map(template => (
                                                        <div
                                                            key={template.id}
                                                            onClick={() => {
                                                                setBroadcast(prev => ({ ...prev, title: template.title, message: template.message }));
                                                                setShowTemplates(false);
                                                                toast.success('Template diterapkan');
                                                            }}
                                                            className="cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-accent dark:hover:border-accent hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group"
                                                        >
                                                            <h5 className="font-bold text-slate-900 dark:text-white text-sm mb-1 group-hover:text-accent">{template.title}</h5>
                                                            <p className="text-xs text-slate-500 line-clamp-2">{template.message}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <textarea
                                                value={broadcast.message}
                                                onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                                                placeholder="Tulis pesan lengkap di sini..."
                                                rows={6}
                                                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-accent outline-none resize-none transition-all"
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => setBroadcast({ target: 'all', title: '', message: '' })}
                                            className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                                        >
                                            Reset
                                        </button>
                                        <button
                                            onClick={handleSendBroadcast}
                                            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 ripple"
                                        >
                                            <span className="material-symbols-outlined">send</span>
                                            Kirim Broadcast
                                        </button>
                                    </div>

                                    {/* Broadcast History */}
                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => setShowHistory(!showHistory)}
                                            className="flex items-center justify-between w-full py-3 text-left group"
                                        >
                                            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-lg text-orange-500">history</span>
                                                Riwayat Broadcast
                                                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                    {broadcastHistory.length}
                                                </span>
                                            </span>
                                            <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`}>
                                                expand_more
                                            </span>
                                        </button>

                                        {showHistory && (
                                            <div className="space-y-3 mt-4 animate-slide-in-right">
                                                {broadcastHistory.length === 0 ? (
                                                    <div className="text-center py-8 text-slate-400">
                                                        <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                                                        <p className="text-sm">Belum ada riwayat broadcast</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {broadcastHistory.map(item => (
                                                            <div key={item.id} className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex justify-between items-start group hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                                                                <div className="min-w-0 flex-1">
                                                                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.message}</p>
                                                                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
                                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                                        {formatDate(item.date)}
                                                                        <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                                                                            {item.target === 'all' ? 'Semua' : item.target}
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => deleteBroadcast(item.id)}
                                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {broadcastHistory.length > 0 && (
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Hapus semua riwayat broadcast?')) {
                                                                        clearBroadcastHistory();
                                                                        toast.success('Riwayat broadcast dihapus');
                                                                    }
                                                                }}
                                                                className="w-full py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                            >
                                                                Hapus Semua Riwayat
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminSettings;
