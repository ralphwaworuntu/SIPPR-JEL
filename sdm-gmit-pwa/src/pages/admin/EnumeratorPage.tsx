import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AdminLayout } from '../../components/layouts/AdminLayout';

interface Enumerator {
    id: number;
    name: string;
    rayon: string;
    lingkungan: string;
    familyCount: number;
    whatsapp: string;
    loginEmail: string | null;
    loginPassword: string | null;
    validVisitCount: number;
    createdAt: string;
}

export default function EnumeratorPage() {
    const queryClient = useQueryClient();
    const [selectedItem, setSelectedItem] = useState<Enumerator | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
    const [credentialData, setCredentialData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [credentialMessage, setCredentialMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        rayon: '',
        lingkungan: '',
        familyCount: 0,
        whatsapp: '',
        loginEmail: '',
        loginPassword: ''
    });

    const { data: enumerators = [], isLoading } = useQuery<Enumerator[]>({
        queryKey: ['enumerators'],
        queryFn: async () => {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`}/api/enumerators`, {
                withCredentials: true
            });
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`}/api/enumerators/${id}`, {
                withCredentials: true
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enumerators'] });
            setIsDeleteModalOpen(false);
        }
    });

    const addMutation = useMutation({
        mutationFn: async (data: any) => {
            await axios.post(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`}/api/enumerators`, data, {
                withCredentials: true
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enumerators'] });
            setIsAddModalOpen(false);
            setFormData({ name: '', rayon: '', lingkungan: '', familyCount: 0, whatsapp: '', loginEmail: '', loginPassword: '' });
        }
    });

    const handleOpenDetail = (item: Enumerator) => {
        setSelectedItem(item);
        setIsDetailModalOpen(true);
    };

    const handleOpenDelete = (item: Enumerator) => {
        setSelectedItem(item);
        setIsDeleteModalOpen(true);
    };

    const handleOpenCredential = (item: Enumerator) => {
        setSelectedItem(item);
        setCredentialData({
            email: item.loginEmail || '',
            password: '',
            confirmPassword: ''
        });
        setCredentialMessage(null);
        setIsCredentialModalOpen(true);
    };

    const credentialMutation = useMutation({
        mutationFn: async (data: { email: string; password: string; name: string; entityType: string; entityId: number }) => {
            const res = await axios.post(`${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`}/api/credentials`, data, {
                withCredentials: true
            });
            return res.data;
        },
        onSuccess: (data) => {
            setCredentialMessage({ type: 'success', text: data.message || 'Akun berhasil disimpan!' });
            queryClient.invalidateQueries({ queryKey: ['enumerators'] });
        },
        onError: (error: any) => {
            setCredentialMessage({ type: 'error', text: error.response?.data?.error || 'Gagal menyimpan akun' });
        }
    });

    return (
        <AdminLayout title="Kelola Enumerator">
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <span className="material-symbols-outlined text-primary">group</span>
                            Kelola Enumerator
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Kelola data enumerator jemaat</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-xl font-bold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
                    >
                        <span className="material-symbols-outlined">add</span>
                        Tambah Enumerator
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800/50 dark:text-slate-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Nama Enumerator</th>
                                    <th className="px-6 py-4 font-medium">Rayon</th>
                                    <th className="px-6 py-4 font-medium">Lingkungan</th>
                                    <th className="px-6 py-4 font-medium">Jumlah Kunjungan</th>
                                    <th className="px-6 py-4 font-medium">No. WhatsApp</th>
                                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Memuat data...</td>
                                    </tr>
                                ) : enumerators.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <span className="material-symbols-outlined text-4xl text-slate-300">group_off</span>
                                                <p>Belum ada data enumerator</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : enumerators.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{item.name}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.rayon}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.lingkungan}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.validVisitCount || 0} Keluarga</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{item.whatsapp || '-'}</td>
                                        <td className="px-6 py-4 flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenDetail(item)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Detail"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                            <button
                                                onClick={() => handleOpenCredential(item)}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                title="Atur Akun Login"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">key</span>
                                            </button>
                                            <button
                                                onClick={() => handleOpenDelete(item)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Add Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tambah Enumerator Baru</h3>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-4 overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Enumerator *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Rayon *</label>
                                        <select
                                            value={formData.rayon}
                                            onChange={(e) => setFormData(prev => ({ ...prev, rayon: e.target.value }))}
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        >
                                            <option value="" disabled>Pilih Rayon</option>
                                            {[...Array(20)].map((_, i) => (
                                                <option key={i + 1} value={`${i + 1}`}>{i + 1}</option>
                                            ))}
                                            <option value="Lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Lingkungan *</label>
                                        <select
                                            value={formData.lingkungan}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lingkungan: e.target.value }))}
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        >
                                            <option value="" disabled>Pilih Lingkungan</option>
                                            {[...Array(8)].map((_, i) => (
                                                <option key={i + 1} value={`${i + 1}`}>{i + 1}</option>
                                            ))}
                                            <option value="Lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">No. WhatsApp</label>
                                        <input
                                            type="text"
                                            value={formData.whatsapp}
                                            onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                                            className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                            placeholder="0812..."
                                        />
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Akun Login (Opsional)</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email (Username)</label>
                                            <input
                                                type="email"
                                                value={formData.loginEmail}
                                                onChange={(e) => setFormData(prev => ({ ...prev, loginEmail: e.target.value }))}
                                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                                placeholder="contoh@email.com"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                            <input
                                                type="text"
                                                value={formData.loginPassword}
                                                onChange={(e) => setFormData(prev => ({ ...prev, loginPassword: e.target.value }))}
                                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                                placeholder="Minimal 8 karakter"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => addMutation.mutate(formData)}
                                    disabled={addMutation.isPending || !formData.name || !formData.rayon || !formData.lingkungan}
                                    className="px-6 py-2 text-sm font-medium text-slate-900 bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {addMutation.isPending ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Credential Modal */}
                {isCredentialModalOpen && selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm shadow-xl">
                        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-amber-500">key</span>
                                        Pengaturan Akun Login
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">{selectedItem.name}</p>
                                </div>
                                <button
                                    onClick={() => setIsCredentialModalOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-4 overflow-y-auto">
                                {credentialMessage && (
                                    <div className={`p-3 rounded-lg text-sm font-medium ${credentialMessage.type === 'success'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                        {credentialMessage.text}
                                    </div>
                                )}
                                {/* Current Credentials */}
                                {selectedItem.loginEmail && (
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Akun Saat Ini</p>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-500">Username:</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedItem.loginEmail}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-500">Password:</span>
                                                <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedItem.loginPassword || '-'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {!selectedItem.loginEmail && (
                                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
                                        <span className="material-symbols-outlined text-[16px] align-middle mr-1">info</span>
                                        Belum ada akun login untuk {selectedItem.name}. Silakan buat akun baru di bawah.
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email (Username) *</label>
                                    <input
                                        type="email"
                                        value={credentialData.email}
                                        onChange={(e) => setCredentialData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        placeholder="contoh@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                                    <input
                                        type="password"
                                        value={credentialData.password}
                                        onChange={(e) => setCredentialData(prev => ({ ...prev, password: e.target.value }))}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        placeholder="Minimal 8 karakter"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Password *</label>
                                    <input
                                        type="password"
                                        value={credentialData.confirmPassword}
                                        onChange={(e) => setCredentialData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                                        placeholder="Ulangi password"
                                    />
                                    {credentialData.password && credentialData.confirmPassword && credentialData.password !== credentialData.confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1">Password tidak cocok</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
                                <button
                                    onClick={() => setIsCredentialModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => {
                                        if (credentialData.password !== credentialData.confirmPassword) {
                                            setCredentialMessage({ type: 'error', text: 'Password tidak cocok!' });
                                            return;
                                        }
                                        if (credentialData.password.length < 8) {
                                            setCredentialMessage({ type: 'error', text: 'Password minimal 8 karakter!' });
                                            return;
                                        }
                                        credentialMutation.mutate({
                                            email: credentialData.email,
                                            password: credentialData.password,
                                            name: selectedItem.name,
                                            entityType: 'enumerator',
                                            entityId: selectedItem.id
                                        });
                                    }}
                                    disabled={credentialMutation.isPending || !credentialData.email || !credentialData.password || !credentialData.confirmPassword}
                                    className="px-6 py-2 text-sm font-medium text-slate-900 bg-primary rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {credentialMutation.isPending ? 'Menyimpan...' : 'Simpan Akun'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Detail Modal */}
                {isDetailModalOpen && selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 relative">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detail Enumerator</h3>
                                <button
                                    onClick={() => setIsDetailModalOpen(false)}
                                    className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 dark:border-slate-800/50 pb-4">
                                    <div className="text-sm text-slate-500">Nama</div>
                                    <div className="col-span-2 text-sm font-medium text-slate-900 dark:text-white">{selectedItem.name}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 dark:border-slate-800/50 pb-4">
                                    <div className="text-sm text-slate-500">Rayon</div>
                                    <div className="col-span-2 text-sm font-medium text-slate-900 dark:text-white">{selectedItem.rayon}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 dark:border-slate-800/50 pb-4">
                                    <div className="text-sm text-slate-500">Lingkungan</div>
                                    <div className="col-span-2 text-sm font-medium text-slate-900 dark:text-white">{selectedItem.lingkungan}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 dark:border-slate-800/50 pb-4">
                                    <div className="text-sm text-slate-500">Jumlah Keluarga</div>
                                    <div className="col-span-2 text-sm font-medium text-slate-900 dark:text-white">{selectedItem.familyCount}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 border-b border-slate-50 dark:border-slate-800/50 pb-4">
                                    <div className="text-sm text-slate-500">No WhatsApp</div>
                                    <div className="col-span-2 text-sm font-medium text-slate-900 dark:text-white">{selectedItem.whatsapp || '-'}</div>
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-sm text-slate-500">Terdaftar</div>
                                    <div className="col-span-2 text-sm font-medium text-slate-900 dark:text-white">
                                        {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString('id-ID', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false
                                        }).replace(/\./g, ':') : '-'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Modal */}
                {isDeleteModalOpen && selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus Enumerator?</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Apakah Anda yakin ingin menghapus <strong>{selectedItem.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={deleteMutation.isPending}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(selectedItem.id)}
                                    disabled={deleteMutation.isPending}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
