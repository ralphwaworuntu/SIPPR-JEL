import { useState } from 'react';
import { toast } from '../../ui/Toast';

interface AddMemberFormProps {
    onClose: () => void;
    onSuccess: (data: any) => void;
    initialData?: any;
}

export const AddMemberForm = ({ onClose, onSuccess, initialData }: AddMemberFormProps) => {
    const [activeTab, setActiveTab] = useState<'pribadi' | 'gereja' | 'profesional'>('pribadi');
    const [isLoading, setIsLoading] = useState(false);

    // Form State (Simplified for basic needs)
    const [formData, setFormData] = useState({
        namaLengkap: initialData?.name || '',
        nik: initialData?.nik || '',
        tempatLahir: initialData?.tempatLahir || '',
        tanggalLahir: initialData?.tanggalLahir || '',
        jenisKelamin: initialData?.gender || 'Laki-laki',
        alamat: initialData?.address || '',
        noHp: initialData?.phone || '',
        sektor: initialData?.sector || 'Efata',
        statusGerejawi: initialData?.statusGerejawi || 'Sidi',
        pendidikan: initialData?.education || 'S1',
        pekerjaan: initialData?.job || '',
        keahlian: initialData?.skills ? initialData.skills.join(', ') : ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API Call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validation Check (Simple)
        if (!formData.namaLengkap || !formData.sektor) {
            toast.error("Mohon lengkapi data wajib!");
            setIsLoading(false);
            return;
        }

        toast.success(initialData ? "Data jemaat berhasil diperbarui!" : "Data jemaat berhasil ditambahkan!");
        onSuccess(formData);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button
                    type="button"
                    onClick={() => setActiveTab('pribadi')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'pribadi' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Data Pribadi
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('gereja')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'gereja' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Data Gerejawi
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('profesional')}
                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'profesional' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Profesional
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[300px]">
                {activeTab === 'pribadi' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input
                                name="namaLengkap"
                                value={formData.namaLengkap}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                                placeholder="Contoh: John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">NIK</label>
                            <input
                                name="nik"
                                value={formData.nik}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                                placeholder="16 digit NIK"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin</label>
                            <select
                                name="jenisKelamin"
                                value={formData.jenisKelamin}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            >
                                <option>Laki-laki</option>
                                <option>Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tempat Lahir</label>
                            <input
                                name="tempatLahir"
                                value={formData.tempatLahir}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Tanggal Lahir</label>
                            <input
                                type="date"
                                name="tanggalLahir"
                                value={formData.tanggalLahir}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Alamat Domisili</label>
                            <textarea
                                name="alamat"
                                value={formData.alamat}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'gereja' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Sektor <span className="text-red-500">*</span></label>
                            <select
                                name="sektor"
                                value={formData.sektor}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            >
                                <option>Efata</option>
                                <option>Betel</option>
                                <option>Sion</option>
                                <option>Eden</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Status Gerejawi</label>
                            <select
                                name="statusGerejawi"
                                value={formData.statusGerejawi}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            >
                                <option>Sidi</option>
                                <option>Baptis Anak</option>
                                <option>Katekisasi</option>
                            </select>
                        </div>
                    </div>
                )}

                {activeTab === 'profesional' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Pendidikan Terakhir</label>
                            <select
                                name="pendidikan"
                                value={formData.pendidikan}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            >
                                <option>SD</option>
                                <option>SMP</option>
                                <option>SMA/SMK</option>
                                <option>D3</option>
                                <option>S1</option>
                                <option>S2</option>
                                <option>S3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Pekerjaan Utama</label>
                            <input
                                name="pekerjaan"
                                value={formData.pekerjaan}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                                placeholder="Contoh: PNS, Guru, Swasta"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Keahlian / Skill</label>
                            <input
                                name="keahlian"
                                value={formData.keahlian}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                                placeholder="Pisahkan dengan koma, contoh: Memasak, Musik, IT"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
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
                    {isLoading ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Simpan Data')}
                </button>
            </div>
        </form>
    );
};
