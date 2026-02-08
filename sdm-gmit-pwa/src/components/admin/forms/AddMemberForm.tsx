import { useState } from 'react';
import { toast } from '../../ui/Toast';
import { useMemberData } from '../../../hooks/useMemberData';


type ValidationErrors = {
    [key: string]: string;
};

interface AddMemberFormProps {
    onClose: () => void;
    onSuccess: (data: any) => void;
    initialData?: any;
}

export const AddMemberForm = ({ onClose, onSuccess, initialData }: AddMemberFormProps) => {
    const { addMutation, updateMutation } = useMemberData();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<ValidationErrors>({});

    const isLoading = addMutation.isPending || updateMutation.isPending;

    const [formData, setFormData] = useState({
        fullName: initialData?.name || '',
        gender: initialData?.gender || '',
        dateOfBirth: initialData?.birthDate || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
        sector: initialData?.sector || '',
        lingkungan: initialData?.lingkungan || '',
        rayon: initialData?.rayon || '',
        educationLevel: initialData?.education || '',
        major: initialData?.major || '',
        jobCategory: initialData?.jobCategory || '',
        jobTitle: initialData?.jobTitle || '',
        companyName: initialData?.companyName || '',
        yearsOfExperience: initialData?.yearsOfExperience || 0,
        skills: Array.isArray(initialData?.skills) ? initialData.skills : [],
        willingnessToServe: initialData?.willingnessToServe || '',
        interestAreas: Array.isArray(initialData?.interestAreas) ? initialData.interestAreas : [],
        contributionTypes: Array.isArray(initialData?.contributionTypes) ? initialData.contributionTypes : [],
        latitude: initialData?.latitude || -10.1772,
        longitude: initialData?.longitude || 123.6070,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateStep = (currentStep: number): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.fullName) { newErrors.fullName = "Nama wajib diisi"; isValid = false; }
            if (!formData.gender) { newErrors.gender = "Jenis kelamin wajib dipilih"; isValid = false; }
            if (!formData.dateOfBirth) { newErrors.dateOfBirth = "Tanggal lahir wajib diisi"; isValid = false; }
            if (!formData.phone) { newErrors.phone = "No HP wajib diisi"; isValid = false; }
            if (!formData.address) { newErrors.address = "Alamat wajib diisi"; isValid = false; }
            if (!formData.sector) { newErrors.sector = "Sektor Kategorial wajib dipilih"; isValid = false; }
            if (!formData.lingkungan) { newErrors.lingkungan = "Lingkungan wajib dipilih"; isValid = false; }
            if (!formData.rayon) { newErrors.rayon = "Rayon wajib dipilih"; isValid = false; }
        } else if (currentStep === 2) {
            if (!formData.educationLevel) { newErrors.educationLevel = "Pendidikan wajib dipilih"; isValid = false; }
            if (!formData.jobCategory) { newErrors.jobCategory = "Kategori pekerjaan wajib dipilih"; isValid = false; }
        }

        setErrors(newErrors);
        if (!isValid) toast.error("Mohon lengkapi data yang wajib diisi");
        return isValid;
    };

    const handleSubmit = async () => {
        const payload = {
            name: formData.fullName,
            gender: formData.gender as "Laki-laki" | "Perempuan",
            birthDate: formData.dateOfBirth,
            phone: formData.phone,
            address: formData.address,
            sector: formData.sector,
            lingkungan: formData.lingkungan,
            rayon: formData.rayon,
            education: formData.educationLevel,
            major: formData.major,
            job: formData.jobCategory, // Map to job field expected by legacy code
            jobCategory: formData.jobCategory,
            jobTitle: formData.jobTitle,
            companyName: formData.companyName,
            yearsOfExperience: formData.yearsOfExperience,
            skills: formData.skills,
            willingnessToServe: formData.willingnessToServe,
            interestAreas: formData.interestAreas,
            contributionTypes: formData.contributionTypes,
            latitude: formData.latitude,
            longitude: formData.longitude,
            initials: formData.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
        };

        if (initialData) {
            updateMutation.mutate({ ...initialData, ...payload } as any, {
                onSuccess: () => {
                    toast.success("Data jemaat berhasil diperbarui!");
                    onSuccess(payload);
                    onClose();
                },
                onError: (error: any) => {
                    toast.error(`Gagal memperbarui data: ${error.message}`);
                }
            });
        } else {
            addMutation.mutate(payload as any, {
                onSuccess: () => {
                    toast.success("Data jemaat berhasil ditambahkan!");
                    onSuccess(payload);
                    onClose();
                },
                onError: (error: any) => {
                    toast.error(`Gagal menambah data: ${error.message}`);
                }
            });
        }
    };

    const handleNext = () => {
        if (validateStep(step)) {
            if (step < 3) setStep(step + 1);
            else handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else onClose();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Langkah {step} dari 3</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {step === 1 ? 'Identitas Jemaat' : step === 2 ? 'Profil Profesional' : 'Komitmen Pelayanan'}
                    </h3>
                </div>
                <div className="flex gap-1">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${step >= s ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px]">
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Nama Lengkap <span className="text-red-500">*</span></label>
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                                placeholder="Contoh: John Doe"
                            />
                            {errors.fullName && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.fullName}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Jenis Kelamin</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.gender ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                            >
                                <option value="">Pilih...</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Tanggal Lahir</label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.dateOfBirth ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Sektor Kategorial</label>
                            <select
                                name="sector"
                                value={formData.sector}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.sector ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                            >
                                <option value="">Pilih...</option>
                                <option value="Pemuda">Pemuda</option>
                                <option value="Kaum Perempuan">Kaum Perempuan</option>
                                <option value="Kaum Bapak">Kaum Bapak</option>
                                <option value="Lansia">Lansia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Lingkungan</label>
                            <select
                                name="lingkungan"
                                value={formData.lingkungan}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.lingkungan ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                            >
                                <option value="">Pilih...</option>
                                {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n.toString()}>Lingkungan {n}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Rayon</label>
                            <select
                                name="rayon"
                                value={formData.rayon}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.rayon ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                            >
                                <option value="">Pilih...</option>
                                {Array.from({ length: 20 }, (_, i) => i + 1).map(n => <option key={n} value={n.toString()}>Rayon {n}</option>)}
                                <option value="Luar Wilayah">Luar Wilayah</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Nomor HP</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                                placeholder="08..."
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Alamat Tinggal</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={2}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.address ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                                placeholder="Alamat lengkap..."
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Pendidikan Terakhir</label>
                            <select
                                name="educationLevel"
                                value={formData.educationLevel}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.educationLevel ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                            >
                                <option value="">Pilih...</option>
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
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Jurusan</label>
                            <input
                                name="major"
                                value={formData.major}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium"
                                placeholder="Nama jurusan..."
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Kategori Pekerjaan (KBJI)</label>
                            <select
                                name="jobCategory"
                                value={formData.jobCategory}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${errors.jobCategory ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium`}
                            >
                                <option value="">Pilih Kategori...</option>
                                {[
                                    'Tenaga Profesional',
                                    'Teknisi dan Asisten Tenaga Profesional',
                                    'Tenaga Tata Usaha',
                                    'Tenaga Usaha Jasa dan Penjualan',
                                    'Pekerja Pertanian, Kehutanan dan Perikanan',
                                    'Pekerja Pengolahan, Kerajinan',
                                    'Operator dan Perakit Mesin',
                                    'Pekerja Kasar',
                                    'TNI / Polri',
                                    'Wirausaha',
                                    'Pelajar / Mahasiswa',
                                    'Mengurus Rumah Tangga'
                                ].map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Nama Perusahaan/Instansi</label>
                            <input
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium"
                                placeholder="Bekerja di..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">Lama Bekerja (Tahun)</label>
                            <input
                                type="number"
                                name="yearsOfExperience"
                                value={formData.yearsOfExperience}
                                onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium"
                            />
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-6 animate-fade-in overflow-y-auto max-h-[450px] pr-2">
                        <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                                Komitmen Pelayanan
                            </h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                                Kesediaan memberikan waktu atau keahlian untuk program Gereja.
                            </p>

                            <div className="flex flex-col gap-2 mb-6">
                                {[
                                    { id: 'Aktif', label: 'Ya, Sangat Bersedia (Aktif)', desc: 'Siap dilibatkan dalam tim rutin' },
                                    { id: 'On-demand', label: 'Bersedia jika Dibutuhkan', desc: 'Sesuai dengan ketersediaan waktu' },
                                    { id: 'Not-available', label: 'Belum Bisa Berkomitmen', desc: 'Mungkin di waktu yang lain' }
                                ].map((opt) => (
                                    <label key={opt.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${formData.willingnessToServe === opt.id ? 'bg-primary/10 border-primary shadow-sm' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                                        <input
                                            type="radio"
                                            name="willingnessToServe"
                                            value={opt.id}
                                            checked={formData.willingnessToServe === opt.id}
                                            onChange={() => setFormData(prev => ({ ...prev, willingnessToServe: opt.id }))}
                                            className="mt-1 text-primary focus:ring-primary h-4 w-4"
                                        />
                                        <div>
                                            <p className={`text-xs font-bold ${formData.willingnessToServe === opt.id ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>{opt.label}</p>
                                            <p className="text-[10px] text-slate-500">{opt.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 block">Bidang Minat Pelayanan</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            'Pendidikan / Mengajar', 'Kesehatan', 'Teknologi & Multimedia', 'Musik & Liturgi', 'Sosial & Diakonia', 'Hukum & Advokasi', 'Ekonomi & Bisnis', 'Konstruksi & Pembangunan', 'Administrasi & Sekretariat', 'Transportasi & Logistik'
                                        ].map(interest => (
                                            <label key={interest} className="flex items-center gap-2 p-2 border border-slate-100 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.interestAreas?.includes(interest)}
                                                    onChange={() => {
                                                        const current = formData.interestAreas || [];
                                                        const updated = current.includes(interest)
                                                            ? current.filter(i => i !== interest)
                                                            : [...current, interest];
                                                        setFormData(prev => ({ ...prev, interestAreas: updated }));
                                                    }}
                                                    className="h-3.5 w-3.5 rounded text-primary border-slate-300"
                                                />
                                                <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">{interest}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-2 block">Bentuk Kontribusi</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            'Tenaga Ahli / Konsultan', 'Mentor / Pelatih', 'Dukungan Teknis', 'Donatur / Finansial', 'Manajemen Proyek', 'Relawan Lapangan'
                                        ].map(type => (
                                            <label key={type} className="flex items-center gap-2 p-2 border border-slate-100 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.contributionTypes?.includes(type)}
                                                    onChange={() => {
                                                        const current = formData.contributionTypes || [];
                                                        const updated = current.includes(type)
                                                            ? current.filter(t => t !== type)
                                                            : [...current, type];
                                                        setFormData(prev => ({ ...prev, contributionTypes: updated }));
                                                    }}
                                                    className="h-3.5 w-3.5 rounded text-primary border-slate-300"
                                                />
                                                <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">{step === 1 ? 'close' : 'arrow_back'}</span>
                    {step === 1 ? 'Batal' : 'Kembali'}
                </button>
                <button
                    type="button"
                    onClick={handleNext}
                    disabled={isLoading}
                    className="px-8 py-2.5 rounded-xl text-sm font-bold bg-primary text-slate-900 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 transform active:scale-95"
                >
                    {isLoading ? (
                        <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                    ) : (
                        <span className="material-symbols-outlined text-lg">{step === 3 ? 'save' : 'arrow_forward'}</span>
                    )}
                    {isLoading ? 'Menyimpan...' : (step === 3 ? 'Simpan Data' : 'Selanjutnya')}
                </button>
            </div>
        </div>
    );
};
