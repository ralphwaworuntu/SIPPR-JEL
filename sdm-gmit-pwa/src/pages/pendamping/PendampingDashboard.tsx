import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { PendampingLayout } from '../../components/layouts/PendampingLayout';

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;

interface PendampingInfo {
    id: number;
    name: string;
    lingkungan: string;
    userName: string;
}

interface Stats {
    familyCount: number;
    enumeratorCount: number;
    visitedCount: number;
    unvisitedCount: number;
}

interface Visit {
    id: number;
    enumeratorId: number;
    enumeratorName: string;
    congregantName: string;
    photoUrl: string | null;
    notes: string | null;
    status: string | null;
    rejectionReason: string | null;
    createdAt: string;
}

export default function PendampingDashboard() {
    const queryClient = useQueryClient();
    const [validateTarget, setValidateTarget] = useState<Visit | null>(null);
    const [invalidReason, setInvalidReason] = useState('');
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

    // Fetch pendamping info
    const { data: info } = useQuery<PendampingInfo>({
        queryKey: ['pendamping-me'],
        queryFn: async () => {
            const res = await axios.get(`${API}/api/pendamping/me`, { withCredentials: true });
            return res.data;
        }
    });

    // Fetch stats
    const { data: stats } = useQuery<Stats>({
        queryKey: ['pendamping-stats'],
        queryFn: async () => {
            const res = await axios.get(`${API}/api/pendamping/stats`, { withCredentials: true });
            return res.data;
        }
    });

    // Fetch visits
    const { data: visitList = [], isLoading } = useQuery<Visit[]>({
        queryKey: ['pendamping-visits'],
        queryFn: async () => {
            const res = await axios.get(`${API}/api/pendamping/visits`, { withCredentials: true });
            return res.data;
        }
    });

    // Validate mutation
    const validateMutation = useMutation({
        mutationFn: async ({ id, status, rejectionReason }: { id: number; status: string; rejectionReason?: string }) => {
            await axios.put(`${API}/api/pendamping/visits/${id}/validate`, { status, rejectionReason }, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendamping-visits'] });
            queryClient.invalidateQueries({ queryKey: ['pendamping-stats'] });
            setValidateTarget(null);
            setInvalidReason('');
        }
    });

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const statCards = [
        { label: 'Jumlah Keluarga', value: stats?.familyCount ?? 0, icon: 'family_restroom', color: 'blue' },
        { label: 'Jumlah Enumerator', value: stats?.enumeratorCount ?? 0, icon: 'group', color: 'purple' },
        { label: 'Keluarga Dikunjungi', value: stats?.visitedCount ?? 0, icon: 'check_circle', color: 'emerald' },
        { label: 'Belum Dikunjungi', value: stats?.unvisitedCount ?? 0, icon: 'pending', color: 'amber' },
    ];

    const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
        blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600', text: 'text-blue-600' },
        purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600', text: 'text-purple-600' },
        emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: 'text-emerald-600', text: 'text-emerald-600' },
        amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', icon: 'text-amber-600', text: 'text-amber-600' },
    };

    return (
        <PendampingLayout title="Dashboard Pendamping">
            <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-500/20">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <span className="material-symbols-outlined text-3xl">waving_hand</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black">
                                Selamat Datang, {info?.name || 'Pendamping'}!
                            </h1>
                            <p className="text-blue-100 mt-1">
                                Lingkungan {info?.lingkungan || '-'} — GMIT Emaus Liliba
                            </p>
                        </div>
                    </div>
                    <p className="text-blue-50 text-sm leading-relaxed max-w-2xl">
                        Pantau dan validasi kunjungan enumerator di lingkungan Anda.
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statCards.map((card) => {
                        const c = colorMap[card.color];
                        return (
                            <div key={card.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`size-10 ${c.bg} rounded-xl flex items-center justify-center`}>
                                        <span className={`material-symbols-outlined ${c.icon}`}>{card.icon}</span>
                                    </div>
                                </div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{card.value}</p>
                                <p className="text-xs font-medium text-slate-500 mt-1">{card.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Visit Management Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-blue-600">fact_check</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Kelola Kunjungan Enumerator</h3>
                                <p className="text-sm text-slate-500">Validasi kunjungan yang dilakukan oleh enumerator</p>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : visitList.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-slate-400 text-3xl">inbox</span>
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Belum Ada Kunjungan</h3>
                            <p className="text-sm text-slate-500">Belum ada kunjungan yang disubmit oleh enumerator.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Enumerator</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Kepala Keluarga</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Foto</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitList.map((visit, index) => (
                                        <tr key={visit.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4 text-sm text-slate-500">{index + 1}</td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{visit.enumeratorName}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                <p className="text-sm text-slate-700 dark:text-slate-300">{visit.congregantName}</p>
                                            </td>
                                            <td className="px-5 py-4">
                                                {visit.photoUrl ? (
                                                    <img
                                                        src={`${API}${visit.photoUrl}`}
                                                        alt="Bukti"
                                                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-80 transition-opacity"
                                                        onClick={() => setPreviewPhoto(`${API}${visit.photoUrl}`)}
                                                    />
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-[160px] truncate">
                                                {visit.notes || '—'}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                                                {formatDate(visit.createdAt)}
                                            </td>
                                            <td className="px-5 py-4">
                                                {visit.status === 'valid' ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                                        Valid
                                                    </span>
                                                ) : visit.status === 'invalid' ? (
                                                    <div>
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-bold">
                                                            <span className="material-symbols-outlined text-sm">cancel</span>
                                                            Tidak Valid
                                                        </span>
                                                        {visit.rejectionReason && (
                                                            <p className="mt-1 text-xs text-red-500 dark:text-red-400 max-w-[160px]">
                                                                {visit.rejectionReason}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-bold">
                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                        Menunggu
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => validateMutation.mutate({ id: visit.id, status: 'valid' })}
                                                        disabled={visit.status === 'valid' || validateMutation.isPending}
                                                        className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title="Validasi"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                                    </button>
                                                    <button
                                                        onClick={() => { setValidateTarget(visit); setInvalidReason(''); }}
                                                        disabled={validateMutation.isPending}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                                                        title="Tidak Valid"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">cancel</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Invalid Reason Modal */}
            {validateTarget && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setValidateTarget(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="size-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-red-600 text-3xl">cancel</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">Tandai Tidak Valid</h3>
                            <p className="text-sm text-slate-500 text-center mb-5">
                                Kunjungan ke <strong>{validateTarget.congregantName}</strong> oleh <strong>{validateTarget.enumeratorName}</strong>
                            </p>

                            <div className="mb-5">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Alasan *</label>
                                <textarea
                                    value={invalidReason}
                                    onChange={(e) => setInvalidReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                                    placeholder="Masukan alasan mengapa kunjungan ini tidak valid..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setValidateTarget(null)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => validateMutation.mutate({ id: validateTarget.id, status: 'invalid', rejectionReason: invalidReason })}
                                    disabled={!invalidReason.trim() || validateMutation.isPending}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {validateMutation.isPending ? 'Memproses...' : 'Tandai Tidak Valid'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Preview Modal */}
            {previewPhoto && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreviewPhoto(null)}>
                    <div className="relative max-w-3xl w-full">
                        <button
                            onClick={() => setPreviewPhoto(null)}
                            className="absolute -top-12 right-0 size-10 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <img src={previewPhoto} alt="Preview" className="w-full rounded-2xl object-contain max-h-[80vh]" />
                    </div>
                </div>
            )}
        </PendampingLayout>
    );
}
