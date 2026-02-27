import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { EnumeratorLayout } from '../../components/layouts/EnumeratorLayout';

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;

interface Visit {
    id: number;
    congregantName: string;
    photoUrl: string | null;
    notes: string | null;
    status: string | null;
    rejectionReason: string | null;
    createdAt: string;
}

export default function EnumeratorVisits() {
    const queryClient = useQueryClient();
    const [deleteTarget, setDeleteTarget] = useState<Visit | null>(null);
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

    const { data: visitList = [], isLoading } = useQuery<Visit[]>({
        queryKey: ['enumerator-visits'],
        queryFn: async () => {
            const res = await axios.get(`${API}/api/enumerator/visits`, { withCredentials: true });
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`${API}/api/enumerator/visits/${id}`, { withCredentials: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enumerator-visits'] });
            queryClient.invalidateQueries({ queryKey: ['enumerator-families'] });
            setDeleteTarget(null);
        }
    });

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <EnumeratorLayout title="Kelola Kunjungan">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Kelola Kunjungan</h1>
                        <p className="text-sm text-slate-500 mt-1">Total {visitList.length} kunjungan tercatat</p>
                    </div>
                </div>

                {/* Visits Table/Cards */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : visitList.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
                        <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-slate-400 text-3xl">inbox</span>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-1">Belum Ada Kunjungan</h3>
                        <p className="text-sm text-slate-500">Silakan tambahkan kunjungan baru dari halaman Dashboard.</p>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kepala Keluarga</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Foto</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitList.map((visit, index) => (
                                        <tr key={visit.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-4 text-sm text-slate-500">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{visit.congregantName}</p>
                                            </td>
                                            <td className="px-6 py-4">
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
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                                                {visit.notes || '—'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {formatDate(visit.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
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
                                                            <p className="mt-1 text-xs text-red-500 dark:text-red-400 max-w-[180px]">
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
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => setDeleteTarget(visit)}
                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 text-center">
                            <div className="size-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-red-600 text-3xl">warning</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Hapus Kunjungan?</h3>
                            <p className="text-sm text-slate-500 mb-6">
                                Kunjungan ke <strong>{deleteTarget.congregantName}</strong> akan dihapus secara permanen. Keluarga ini akan kembali tersedia di dropdown.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => deleteMutation.mutate(deleteTarget.id)}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
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
        </EnumeratorLayout>
    );
}
