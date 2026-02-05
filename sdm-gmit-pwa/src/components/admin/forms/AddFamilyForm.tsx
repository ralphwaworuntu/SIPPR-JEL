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
            <div className="grid grid-cols-1 gap-4 animate-fade-in">
                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Kepala Keluarga <span className="text-red-500">*</span></label>
                    <input
                        name="kepalaKeluarga"
                        value={formData.kepalaKeluarga}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                        placeholder="Cari nama jemaat..."
                    />
                    <p className="text-xs text-slate-500 mt-1">Nantinya akan menjadi dropdown search member.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nomor KK <span className="text-red-500">*</span></label>
                        <input
                            name="noKK"
                            value={formData.noKK}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            placeholder="16 digit No. KK"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Rayon / Sektor</label>
                        <select
                            name="sektor"
                            value={formData.sektor}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                        >
                            <option>Sektor 1</option>
                            <option>Sektor 2</option>
                            <option>Sektor 3</option>
                            <option>Sektor 4</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap</label>
                    <textarea
                        name="alamat"
                        value={formData.alamat}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status KK</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="status" value="Aktif" checked={formData.status === 'Aktif'} onChange={handleChange} className="text-primary focus:ring-primary" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Aktif</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="status" value="Pindah" checked={formData.status === 'Pindah'} onChange={handleChange} className="text-primary focus:ring-primary" />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pindah</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    Batal
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 rounded-xl text-sm font-bold bg-primary text-slate-900 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                    {isLoading ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Simpan KK')}
                </button>
            </div>
        </form>
    );
};
