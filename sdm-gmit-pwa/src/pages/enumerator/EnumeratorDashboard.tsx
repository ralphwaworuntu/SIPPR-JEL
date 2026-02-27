import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { EnumeratorLayout } from '../../components/layouts/EnumeratorLayout';

const API = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;

interface EnumeratorInfo {
    id: number;
    name: string;
    rayon: string;
    lingkungan: string;
    userName: string;
}

interface Family {
    id: number;
    fullName: string;
    address: string | null;
    lingkungan: string | null;
    rayon: string | null;
}

interface Visit {
    id: number;
    congregantName: string;
    photoUrl: string | null;
    notes: string | null;
    createdAt: string;
}

export default function EnumeratorDashboard() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedRayon, setSelectedRayon] = useState('');
    const [selectedFamily, setSelectedFamily] = useState('');
    const [selectedFamilyName, setSelectedFamilyName] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [notes, setNotes] = useState('');
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Fetch enumerator info
    const { data: enumeratorInfo } = useQuery<EnumeratorInfo>({
        queryKey: ['enumerator-me'],
        queryFn: async () => {
            const res = await axios.get(`${API}/api/enumerator/me`, { withCredentials: true });
            return res.data;
        }
    });

    // Fetch families in the enumerator's lingkungan
    const { data: families = [] } = useQuery<Family[]>({
        queryKey: ['enumerator-families'],
        queryFn: async () => {
            const res = await axios.get(`${API}/api/enumerator/families`, { withCredentials: true });
            return res.data;
        }
    });

    // Fetch visits
    const { data: visitList = [] } = useQuery<Visit[]>({
        queryKey: ['enumerator-visits'],
        queryFn: async () => {
            const res = await axios.get(`${API}/api/enumerator/visits`, { withCredentials: true });
            return res.data;
        }
    });

    // Submit visit mutation
    const visitMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await axios.post(`${API}/api/enumerator/visits`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['enumerator-visits'] });
            queryClient.invalidateQueries({ queryKey: ['enumerator-families'] });
            setSelectedRayon('');
            setSelectedFamily('');
            setSelectedFamilyName('');
            setPhotoFile(null);
            setPhotoPreview(null);
            setNotes('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            setSubmitMessage({ type: 'success', text: data.message || 'Kunjungan berhasil disimpan!' });
            setTimeout(() => setSubmitMessage(null), 3000);
        },
        onError: () => {
            setSubmitMessage({ type: 'error', text: 'Gagal menyimpan kunjungan. Coba lagi.' });
            setTimeout(() => setSubmitMessage(null), 3000);
        }
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!selectedFamily || !photoFile) return;
        const formData = new FormData();
        formData.append('congregantId', selectedFamily);
        formData.append('congregantName', selectedFamilyName);
        formData.append('photo', photoFile);
        formData.append('notes', notes);
        visitMutation.mutate(formData);
    };

    const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedFamily(id);
        const family = families.find(f => String(f.id) === id);
        setSelectedFamilyName(family ? family.fullName : '');
    };

    // Compute unique rayons from available families
    const availableRayons = [...new Set(families.map(f => f.rayon).filter(Boolean))] as string[];
    // Filter families by selected rayon
    const filteredFamilies = selectedRayon ? families.filter(f => f.rayon === selectedRayon) : [];

    return (
        <EnumeratorLayout title="Dashboard Enumerator">
            <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-lg shadow-emerald-500/20">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                            <span className="material-symbols-outlined text-3xl">waving_hand</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black">
                                Selamat Datang, {enumeratorInfo?.name || 'Enumerator'}!
                            </h1>
                            <p className="text-emerald-100 mt-1">
                                Lingkungan {enumeratorInfo?.lingkungan || '-'} • Rayon {enumeratorInfo?.rayon || '-'} — GMIT Emaus Liliba
                            </p>
                        </div>
                    </div>
                    <p className="text-emerald-50 text-sm leading-relaxed max-w-2xl">
                        Di sini Anda dapat mengelola data kunjungan keluarga yang telah dialokasikan kepada Anda.
                    </p>
                </div>

                {/* Visit Count Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="size-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-600 text-3xl">fact_check</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Kunjungan</h3>
                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                                {visitList.length} <span className="text-base font-medium text-slate-400">Keluarga</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Visit Form Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-emerald-600">add_circle</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">Tambah Kunjungan Baru</h3>
                                <p className="text-sm text-slate-500">Pilih keluarga, lampirkan bukti foto, dan simpan kunjungan</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Success / Error Message */}
                        {submitMessage && (
                            <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${submitMessage.type === 'success'
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                                }`}>
                                <span className="material-symbols-outlined text-lg">
                                    {submitMessage.type === 'success' ? 'check_circle' : 'error'}
                                </span>
                                {submitMessage.text}
                            </div>
                        )}

                        {/* Rayon Select */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Rayon *</label>
                            <select
                                value={selectedRayon}
                                onChange={(e) => {
                                    setSelectedRayon(e.target.value);
                                    setSelectedFamily('');
                                    setSelectedFamilyName('');
                                }}
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            >
                                <option value="">-- Pilih Rayon --</option>
                                {availableRayons.sort((a, b) => Number(a) - Number(b)).map((rayon) => (
                                    <option key={rayon} value={rayon}>Rayon {rayon}</option>
                                ))}
                            </select>
                        </div>

                        {/* Family Select */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kepala Keluarga *</label>
                            <select
                                value={selectedFamily}
                                onChange={handleFamilyChange}
                                disabled={!selectedRayon}
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50"
                            >
                                <option value="">{selectedRayon ? '-- Pilih Kepala Keluarga --' : '-- Pilih Rayon Terlebih Dahulu --'}</option>
                                {filteredFamilies.map((family) => (
                                    <option key={family.id} value={family.id}>
                                        {family.fullName}{family.address ? ` — ${family.address}` : ''}
                                    </option>
                                ))}
                            </select>
                            {selectedRayon && filteredFamilies.length === 0 && (
                                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                    Tidak ada keluarga yang tersedia di Rayon {selectedRayon}.
                                </p>
                            )}
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Foto Bukti Kunjungan *</label>
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-4 transition-colors hover:border-emerald-400">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="w-full text-sm text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-900/30 dark:file:text-emerald-400 hover:file:bg-emerald-100 file:cursor-pointer file:transition-colors"
                                />
                                {photoPreview && (
                                    <div className="mt-4 relative">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="w-full max-h-64 object-contain rounded-xl border border-slate-200 dark:border-slate-700"
                                        />
                                        <button
                                            onClick={() => {
                                                setPhotoFile(null);
                                                setPhotoPreview(null);
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="absolute top-2 right-2 size-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Keterangan</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                                placeholder="Catatan tambahan tentang kunjungan (opsional)"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!selectedFamily || !photoFile || visitMutation.isPending}
                            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
                        >
                            {visitMutation.isPending ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">save</span>
                                    Simpan Kunjungan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </EnumeratorLayout>
    );
}
