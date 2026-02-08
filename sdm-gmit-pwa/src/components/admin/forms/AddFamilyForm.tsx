import { useState } from 'react';
import { toast } from '../../ui/Toast';

interface AddFamilyFormProps {
    onClose: () => void;
    onSuccess: (data: any) => void;
    initialData?: any;
}

export const AddFamilyForm = ({ onClose, onSuccess, initialData }: AddFamilyFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        kepalaKeluarga: initialData?.head || '',
        noKK: initialData?.id || '',
        alamat: initialData?.address || '',
        sektor: initialData?.sector ? `Sektor ${initialData.sector}` : 'Sektor 1', // Ensure "Sektor " prefix if using dropdown with "Sektor X" values
        status: initialData?.status || 'Aktif'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API
        await new Promise(resolve => setTimeout(resolve, 800));

        if (!formData.kepalaKeluarga || !formData.noKK) {
            toast.error("Nama Kepala Keluarga dan No. KK wajib diisi!");
            setIsLoading(false);
            return;
        }

        toast.success(initialData ? "Data keluarga berhasil diperbarui!" : "Kartu Keluarga berhasil ditambahkan!");
        onSuccess(formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-6 animate-fade-in">
                {/* Section: Kepala Keluarga */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4 text-primary">
                        <span className="material-symbols-outlined text-xl">person</span>
                        <h4 className="text-sm font-bold uppercase tracking-wider">Informasi Dasar</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Kepala Keluarga <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                                <input
                                    name="kepalaKeluarga"
                                    value={formData.kepalaKeluarga}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium"
                                    placeholder="Masukkan nama kepala keluarga..."
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Nomor KK <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">badge</span>
                                    <input
                                        name="noKK"
                                        value={formData.noKK}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium"
                                        placeholder="16 digit nomor KK"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Sektor / Rayon</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">location_on</span>
                                    <select
                                        name="sektor"
                                        value={formData.sektor}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium appearance-none"
                                    >
                                        <option>Sektor Efata</option>
                                        <option>Sektor Betel</option>
                                        <option>Sektor Sion</option>
                                        <option>Sektor Eden</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Alamat & Status */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4 text-orange-500">
                        <span className="material-symbols-outlined text-xl">home_pin</span>
                        <h4 className="text-sm font-bold uppercase tracking-wider">Detail Lokasi & Status</h4>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Alamat Lengkap</label>
                            <textarea
                                name="alamat"
                                value={formData.alamat}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium"
                                placeholder="Alamat domisili saat ini..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Status Keanggotaan</label>
                            <div className="flex gap-4">
                                {['Aktif', 'Pindah', 'Non-Aktif'].map((status) => (
                                    <label key={status} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.status === status ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400'}`}>
                                        <input
                                            type="radio"
                                            name="status"
                                            value={status}
                                            checked={formData.status === status}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <span className="text-sm">{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-2.5 rounded-xl text-sm font-bold bg-primary text-slate-900 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 transform active:scale-95 disabled:opacity-50"
                >
                    {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                    {isLoading ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Simpan Kartu Keluarga')}
                </button>
            </div>
        </form>
    );
};
