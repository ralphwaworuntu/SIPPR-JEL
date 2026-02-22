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

const TOTAL_STEPS = 6;

const STEP_TITLES: Record<number, string> = {
    1: 'Identitas & Keluarga',
    2: 'Diakonia & Profesional',
    3: 'Komitmen & Keluarga Profesional',
    4: 'Pendidikan Anak',
    5: 'Ekonomi & Aset',
    6: 'Kesehatan',
};

// Reusable form field components
const FormLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5 ml-1">
        {children} {required && <span className="text-red-500">*</span>}
    </label>
);
const inputClass = (hasError?: boolean) =>
    `w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border ${hasError ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'} focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white font-medium text-sm`;
const selectClass = (hasError?: boolean) => inputClass(hasError) + ' appearance-none';
const ErrorMsg = ({ msg }: { msg?: string }) => msg ? <p className="text-red-500 text-[10px] mt-1 ml-1">{msg}</p> : null;
const SectionDivider = ({ title }: { title: string }) => (
    <div className="col-span-2 flex items-center gap-2 pt-3 pb-1">
        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{title}</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
    </div>
);

export const AddMemberForm = ({ onClose, onSuccess, initialData }: AddMemberFormProps) => {
    const { addMutation, updateMutation } = useMemberData();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<ValidationErrors>({});

    const isLoading = addMutation.isPending || updateMutation.isPending;

    const [formData, setFormData] = useState({
        // Step 1: Identity & Family
        fullName: initialData?.name || '',
        gender: initialData?.gender || '',
        dateOfBirth: initialData?.birthDate || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
        sector: initialData?.sector || '',
        lingkungan: initialData?.lingkungan || '',
        rayon: initialData?.rayon || '',
        kkNumber: initialData?.kkNumber || '',
        nik: initialData?.nik || '',
        familyMembers: initialData?.familyMembers || 0,
        familyMembersMale: initialData?.familyMembersMale || 0,
        familyMembersFemale: initialData?.familyMembersFemale || 0,
        familyMembersOutside: initialData?.familyMembersOutside || 0,
        familyMembersSidi: initialData?.familyMembersSidi || 0,
        familyMembersSidiMale: initialData?.familyMembersSidiMale || 0,
        familyMembersSidiFemale: initialData?.familyMembersSidiFemale || 0,
        familyMembersNonBaptized: initialData?.familyMembersNonBaptized || 0,
        familyMembersNonSidi: initialData?.familyMembersNonSidi || 0,

        // Step 2: Diakonia & Professional
        diakonia_recipient: initialData?.diakonia_recipient || '',
        diakonia_year: initialData?.diakonia_year || '',
        diakonia_type: initialData?.diakonia_type || '',
        educationLevel: initialData?.education || initialData?.educationLevel || '',
        major: initialData?.major || '',
        jobCategory: initialData?.jobCategory || '',
        jobTitle: initialData?.jobTitle || '',
        companyName: initialData?.companyName || '',
        yearsOfExperience: initialData?.yearsOfExperience || 0,
        skills: Array.isArray(initialData?.skills) ? initialData.skills : [],

        // Step 3: Commitment
        willingnessToServe: initialData?.willingnessToServe || '',
        interestAreas: Array.isArray(initialData?.interestAreas) ? initialData.interestAreas : [],
        contributionTypes: Array.isArray(initialData?.contributionTypes) ? initialData.contributionTypes : [],

        // Step 4: Education (Children)
        education_schoolingStatus: initialData?.education_schoolingStatus || '',
        education_inSchool_tk_paud: initialData?.education_inSchool_tk_paud || 0,
        education_inSchool_sd: initialData?.education_inSchool_sd || 0,
        education_inSchool_smp: initialData?.education_inSchool_smp || 0,
        education_inSchool_sma: initialData?.education_inSchool_sma || 0,
        education_inSchool_university: initialData?.education_inSchool_university || 0,
        education_dropout_tk_paud: initialData?.education_dropout_tk_paud || 0,
        education_dropout_sd: initialData?.education_dropout_sd || 0,
        education_dropout_smp: initialData?.education_dropout_smp || 0,
        education_dropout_sma: initialData?.education_dropout_sma || 0,
        education_dropout_university: initialData?.education_dropout_university || 0,
        education_unemployed_sd: initialData?.education_unemployed_sd || 0,
        education_unemployed_smp: initialData?.education_unemployed_smp || 0,
        education_unemployed_sma: initialData?.education_unemployed_sma || 0,
        education_unemployed_university: initialData?.education_unemployed_university || 0,
        education_working: initialData?.education_working || 0,

        // Step 5: Economics
        economics_headOccupation: initialData?.economics_headOccupation || '',
        economics_spouseOccupation: initialData?.economics_spouseOccupation || '',
        economics_incomeRange: initialData?.economics_incomeRange || '',
        economics_expense_food: initialData?.economics_expense_food || 0,
        economics_expense_utilities: initialData?.economics_expense_utilities || 0,
        economics_expense_education: initialData?.economics_expense_education || 0,
        economics_expense_other: initialData?.economics_expense_other || 0,
        economics_hasBusiness: initialData?.economics_hasBusiness || '',
        economics_businessName: initialData?.economics_businessName || '',
        economics_businessType: initialData?.economics_businessType || '',
        economics_houseStatus: initialData?.economics_houseStatus || '',
        economics_houseType: initialData?.economics_houseType || '',
        economics_hasAssets: initialData?.economics_hasAssets || '',
        economics_waterSource: initialData?.economics_waterSource || '',

        // Step 6: Health
        health_sick30Days: initialData?.health_sick30Days || '',
        health_chronicSick: initialData?.health_chronicSick || '',
        health_hasBPJS: initialData?.health_hasBPJS || '',
        health_hasBPJSKetenagakerjaan: initialData?.health_hasBPJSKetenagakerjaan || '',
        health_socialAssistance: initialData?.health_socialAssistance || '',
        health_hasDisability: initialData?.health_hasDisability || '',

        // Geo
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

    const handleNumberChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const toggleArrayItem = (field: string, item: string) => {
        setFormData(prev => {
            const arr = (prev as any)[field] || [];
            return { ...prev, [field]: arr.includes(item) ? arr.filter((i: string) => i !== item) : [...arr, item] };
        });
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
            job: formData.jobCategory,
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
            // Step 1 extras
            kkNumber: formData.kkNumber,
            nik: formData.nik,
            familyMembers: formData.familyMembers,
            familyMembersMale: formData.familyMembersMale,
            familyMembersFemale: formData.familyMembersFemale,
            familyMembersOutside: formData.familyMembersOutside,
            familyMembersSidi: formData.familyMembersSidi,
            familyMembersSidiMale: formData.familyMembersSidiMale,
            familyMembersSidiFemale: formData.familyMembersSidiFemale,
            familyMembersNonBaptized: formData.familyMembersNonBaptized,
            familyMembersNonSidi: formData.familyMembersNonSidi,
            // Step 2
            diakonia_recipient: formData.diakonia_recipient,
            diakonia_year: formData.diakonia_year,
            diakonia_type: formData.diakonia_type,
            // Step 4
            education_schoolingStatus: formData.education_schoolingStatus,
            education_inSchool_tk_paud: formData.education_inSchool_tk_paud,
            education_inSchool_sd: formData.education_inSchool_sd,
            education_inSchool_smp: formData.education_inSchool_smp,
            education_inSchool_sma: formData.education_inSchool_sma,
            education_inSchool_university: formData.education_inSchool_university,
            education_dropout_tk_paud: formData.education_dropout_tk_paud,
            education_dropout_sd: formData.education_dropout_sd,
            education_dropout_smp: formData.education_dropout_smp,
            education_dropout_sma: formData.education_dropout_sma,
            education_dropout_university: formData.education_dropout_university,
            education_unemployed_sd: formData.education_unemployed_sd,
            education_unemployed_smp: formData.education_unemployed_smp,
            education_unemployed_sma: formData.education_unemployed_sma,
            education_unemployed_university: formData.education_unemployed_university,
            education_working: formData.education_working,
            // Step 5
            economics_headOccupation: formData.economics_headOccupation,
            economics_spouseOccupation: formData.economics_spouseOccupation,
            economics_incomeRange: formData.economics_incomeRange,
            economics_expense_food: formData.economics_expense_food,
            economics_expense_utilities: formData.economics_expense_utilities,
            economics_expense_education: formData.economics_expense_education,
            economics_expense_other: formData.economics_expense_other,
            economics_hasBusiness: formData.economics_hasBusiness,
            economics_businessName: formData.economics_businessName,
            economics_businessType: formData.economics_businessType,
            economics_houseStatus: formData.economics_houseStatus,
            economics_houseType: formData.economics_houseType,
            economics_hasAssets: formData.economics_hasAssets,
            economics_waterSource: formData.economics_waterSource,
            // Step 6
            health_sick30Days: formData.health_sick30Days,
            health_chronicSick: formData.health_chronicSick,
            health_hasBPJS: formData.health_hasBPJS,
            health_hasBPJSKetenagakerjaan: formData.health_hasBPJSKetenagakerjaan,
            health_socialAssistance: formData.health_socialAssistance,
            health_hasDisability: formData.health_hasDisability,
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
            if (step < TOTAL_STEPS) setStep(step + 1);
            else handleSubmit();
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
        else onClose();
    };

    // Reusable number input helper
    const numInput = (name: string, label: string) => (
        <div>
            <FormLabel>{label}</FormLabel>
            <input type="number" min="0" name={name} value={(formData as any)[name]} onChange={e => handleNumberChange(name, e.target.value)} className={inputClass()} />
        </div>
    );

    // Reusable select helper
    const selectInput = (name: string, label: string, options: string[], required?: boolean) => (
        <div>
            <FormLabel required={required}>{label}</FormLabel>
            <select name={name} value={(formData as any)[name]} onChange={handleChange} className={selectClass(!!errors[name])}>
                <option value="">Pilih...</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ErrorMsg msg={errors[name]} />
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Langkah {step} dari {TOTAL_STEPS}</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{STEP_TITLES[step]}</h3>
                </div>
                <div className="flex gap-1">
                    {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(s => (
                        <div key={s} className={`h-1.5 w-6 rounded-full transition-all ${step >= s ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                    ))}
                </div>
            </div>

            <div className="min-h-[400px] max-h-[55vh] overflow-y-auto custom-scrollbar pr-1">
                {/* Step 1: Identity & Family */}
                {step === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <div className="col-span-2">
                            <FormLabel required>Nama Lengkap</FormLabel>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass(!!errors.fullName)} placeholder="Contoh: John Doe" />
                            <ErrorMsg msg={errors.fullName} />
                        </div>
                        {selectInput('gender', 'Jenis Kelamin', ['Laki-laki', 'Perempuan'], true)}
                        <div>
                            <FormLabel required>Tanggal Lahir</FormLabel>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClass(!!errors.dateOfBirth)} />
                            <ErrorMsg msg={errors.dateOfBirth} />
                        </div>
                        <div>
                            <FormLabel required>No HP</FormLabel>
                            <input name="phone" value={formData.phone} onChange={handleChange} className={inputClass(!!errors.phone)} placeholder="08xxxxxxxxxx" />
                            <ErrorMsg msg={errors.phone} />
                        </div>
                        <div className="col-span-2">
                            <FormLabel required>Alamat</FormLabel>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className={inputClass(!!errors.address)} placeholder="Alamat lengkap..." />
                            <ErrorMsg msg={errors.address} />
                        </div>
                        {selectInput('sector', 'Sektor Kategorial', ['Pemuda', 'Perempuan', 'Anak', 'Lansia', 'Dewasa'], true)}
                        <div>
                            <FormLabel required>Lingkungan</FormLabel>
                            <input name="lingkungan" value={formData.lingkungan} onChange={handleChange} className={inputClass(!!errors.lingkungan)} placeholder="Nomor lingkungan" />
                            <ErrorMsg msg={errors.lingkungan} />
                        </div>
                        <div>
                            <FormLabel required>Rayon</FormLabel>
                            <input name="rayon" value={formData.rayon} onChange={handleChange} className={inputClass(!!errors.rayon)} placeholder="Nomor rayon" />
                            <ErrorMsg msg={errors.rayon} />
                        </div>

                        <SectionDivider title="Kependudukan" />
                        <div>
                            <FormLabel>No. KK</FormLabel>
                            <input name="kkNumber" value={formData.kkNumber} onChange={handleChange} className={inputClass()} maxLength={16} placeholder="16 digit" />
                        </div>
                        <div>
                            <FormLabel>NIK</FormLabel>
                            <input name="nik" value={formData.nik} onChange={handleChange} className={inputClass()} maxLength={16} placeholder="16 digit" />
                        </div>

                        <SectionDivider title="Anggota Keluarga" />
                        {numInput('familyMembers', 'Total Anggota')}
                        {numInput('familyMembersMale', 'Laki-laki')}
                        {numInput('familyMembersFemale', 'Perempuan')}
                        {numInput('familyMembersOutside', 'Di Luar Kota')}
                        {numInput('familyMembersSidi', 'Sudah Sidi')}
                        {numInput('familyMembersSidiMale', 'Sidi (L)')}
                        {numInput('familyMembersSidiFemale', 'Sidi (P)')}
                        {numInput('familyMembersNonBaptized', 'Belum Baptis')}
                        {numInput('familyMembersNonSidi', 'Belum Sidi')}
                    </div>
                )}

                {/* Step 2: Diakonia & Professional */}
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <SectionDivider title="Diakonia" />
                        {selectInput('diakonia_recipient', 'Penerima Diakonia', ['Ya', 'Tidak'])}
                        {formData.diakonia_recipient === 'Ya' && (
                            <>
                                <div>
                                    <FormLabel>Tahun</FormLabel>
                                    <input name="diakonia_year" value={formData.diakonia_year} onChange={handleChange} className={inputClass()} placeholder="2024" />
                                </div>
                                <div className="col-span-2">
                                    <FormLabel>Jenis Diakonia</FormLabel>
                                    <input name="diakonia_type" value={formData.diakonia_type} onChange={handleChange} className={inputClass()} placeholder="Pangan, Dana, dll" />
                                </div>
                            </>
                        )}

                        <SectionDivider title="Profil Profesional" />
                        {selectInput('educationLevel', 'Pendidikan Terakhir', ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'], true)}
                        <div>
                            <FormLabel>Jurusan</FormLabel>
                            <input name="major" value={formData.major} onChange={handleChange} className={inputClass()} placeholder="Contoh: Teknik Informatika" />
                        </div>
                        {selectInput('jobCategory', 'Kategori Pekerjaan', ['PNS/ASN', 'TNI/Polri', 'Swasta', 'Wirausaha', 'Petani', 'Nelayan', 'Buruh', 'Pensiunan', 'Pelajar/Mahasiswa', 'Tidak Bekerja', 'Lainnya'], true)}
                        <div>
                            <FormLabel>Jabatan</FormLabel>
                            <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} className={inputClass()} placeholder="Contoh: Manager" />
                        </div>
                        <div>
                            <FormLabel>Nama Instansi</FormLabel>
                            <input name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass()} />
                        </div>
                        {numInput('yearsOfExperience', 'Lama Kerja (Tahun)')}

                        <SectionDivider title="Keahlian" />
                        <div className="col-span-2">
                            <FormLabel>Keahlian (Skills)</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {['Mengajar', 'Musik', 'Teknologi', 'Administrasi', 'Kepemimpinan', 'Komunikasi', 'Pertanian', 'Kesehatan', 'Hukum', 'Keuangan'].map(s => (
                                    <button key={s} type="button" onClick={() => toggleArrayItem('skills', s)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${formData.skills.includes(s) ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Commitment */}
                {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        {selectInput('willingnessToServe', 'Kesediaan Melayani', ['Active', 'On-demand', 'Not-available'])}
                        <div className="col-span-2">
                            <FormLabel>Minat Pelayanan</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {['Ibadah', 'Diakonia', 'Persekutuan', 'Kesaksian', 'Pendidikan', 'Musik/Worship', 'Multimedia', 'Anak/Remaja'].map(area => (
                                    <button key={area} type="button" onClick={() => toggleArrayItem('interestAreas', area)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${formData.interestAreas.includes(area) ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}>
                                        {area}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <FormLabel>Bentuk Kontribusi</FormLabel>
                            <div className="flex flex-wrap gap-2">
                                {['Waktu', 'Keahlian', 'Dana', 'Fasilitas', 'Tenaga'].map(ct => (
                                    <button key={ct} type="button" onClick={() => toggleArrayItem('contributionTypes', ct)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${formData.contributionTypes.includes(ct) ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-primary/50'}`}>
                                        {ct}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Education (Children) */}
                {step === 4 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        {selectInput('education_schoolingStatus', 'Anak Bersekolah?', ['Ya', 'Tidak'])}
                        {formData.education_schoolingStatus === 'Ya' && (
                            <>
                                <SectionDivider title="Sedang Sekolah" />
                                {numInput('education_inSchool_tk_paud', 'TK/PAUD')}
                                {numInput('education_inSchool_sd', 'SD')}
                                {numInput('education_inSchool_smp', 'SMP')}
                                {numInput('education_inSchool_sma', 'SMA')}
                                {numInput('education_inSchool_university', 'Universitas')}

                                <SectionDivider title="Putus Sekolah" />
                                {numInput('education_dropout_tk_paud', 'TK/PAUD')}
                                {numInput('education_dropout_sd', 'SD')}
                                {numInput('education_dropout_smp', 'SMP')}
                                {numInput('education_dropout_sma', 'SMA')}
                                {numInput('education_dropout_university', 'Universitas')}

                                <SectionDivider title="Pengangguran (Lulus)" />
                                {numInput('education_unemployed_sd', 'SD')}
                                {numInput('education_unemployed_smp', 'SMP')}
                                {numInput('education_unemployed_sma', 'SMA')}
                                {numInput('education_unemployed_university', 'Universitas')}
                                {numInput('education_working', 'Sudah Bekerja')}
                            </>
                        )}
                    </div>
                )}

                {/* Step 5: Economics & Assets */}
                {step === 5 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <SectionDivider title="Pekerjaan & Pendapatan" />
                        {selectInput('economics_headOccupation', 'Pekerjaan Kepala Keluarga', ['PNS/ASN', 'TNI/Polri', 'Swasta', 'Wirausaha', 'Petani', 'Nelayan', 'Buruh', 'Pensiunan', 'Tidak Bekerja', 'Lainnya'])}
                        {selectInput('economics_spouseOccupation', 'Pekerjaan Pasangan', ['PNS/ASN', 'TNI/Polri', 'Swasta', 'Wirausaha', 'Petani', 'Nelayan', 'Buruh', 'IRT', 'Tidak Bekerja', 'Lainnya'])}
                        {selectInput('economics_incomeRange', 'Penghasilan', ['< 1 Juta', '1-3 Juta', '3-5 Juta', '5-10 Juta', '> 10 Juta'])}

                        <SectionDivider title="Pengeluaran (Rp/bulan)" />
                        {numInput('economics_expense_food', 'Makan/Minum')}
                        {numInput('economics_expense_utilities', 'Utilitas')}
                        {numInput('economics_expense_education', 'Pendidikan')}
                        {numInput('economics_expense_other', 'Lain-lain')}

                        <SectionDivider title="Usaha" />
                        {selectInput('economics_hasBusiness', 'Punya Usaha?', ['Ya', 'Tidak'])}
                        {formData.economics_hasBusiness === 'Ya' && (
                            <>
                                <div>
                                    <FormLabel>Nama Usaha</FormLabel>
                                    <input name="economics_businessName" value={formData.economics_businessName} onChange={handleChange} className={inputClass()} />
                                </div>
                                <div>
                                    <FormLabel>Jenis Usaha</FormLabel>
                                    <input name="economics_businessType" value={formData.economics_businessType} onChange={handleChange} className={inputClass()} />
                                </div>
                            </>
                        )}

                        <SectionDivider title="Rumah & Aset" />
                        {selectInput('economics_houseStatus', 'Status Rumah', ['Milik Sendiri', 'Sewa/Kontrak', 'Menumpang', 'Dinas', 'Lainnya'])}
                        {selectInput('economics_houseType', 'Jenis Rumah', ['Permanen', 'Semi Permanen', 'Non Permanen'])}
                        {selectInput('economics_hasAssets', 'Punya Aset?', ['Ya', 'Tidak'])}
                        {selectInput('economics_waterSource', 'Sumber Air', ['PDAM', 'Sumur', 'Mata Air', 'Sungai', 'Lainnya'])}
                    </div>
                )}

                {/* Step 6: Health */}
                {step === 6 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        {selectInput('health_sick30Days', 'Sakit 30 Hari Terakhir?', ['Ya', 'Tidak'])}
                        {selectInput('health_chronicSick', 'Penyakit Kronis?', ['Ya', 'Tidak'])}
                        {selectInput('health_hasBPJS', 'BPJS Kesehatan', ['Ya - PBI', 'Ya - Mandiri', 'Tidak'])}
                        {selectInput('health_hasBPJSKetenagakerjaan', 'BPJS Ketenagakerjaan', ['Ya', 'Tidak'])}
                        {selectInput('health_socialAssistance', 'Bantuan Sosial', ['PKH', 'BPNT', 'BLT', 'Tidak Ada', 'Lainnya'])}
                        {selectInput('health_hasDisability', 'Ada Disabilitas?', ['Ya', 'Tidak'])}
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handleBack} className="px-5 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                    {step === 1 ? 'Batal' : '← Kembali'}
                </button>
                <button onClick={handleNext} disabled={isLoading}
                    className="px-8 py-2.5 rounded-xl text-sm font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center gap-2">
                    {isLoading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                    {step === TOTAL_STEPS ? (initialData ? 'Simpan Perubahan' : 'Tambah Jemaat') : 'Lanjut →'}
                </button>
            </div>
        </div>
    );
};
