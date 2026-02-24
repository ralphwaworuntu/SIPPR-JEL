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
    1: 'Data Umum',
    2: 'Informasi Keluarga',
    3: 'Profesi & Pelayanan',
    4: 'Pendidikan',
    5: 'Ekonomi & Aset Keluarga',
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

    const calculateAge = (dob: string) => {
        if (!dob) return '';
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} Tahun`;
    };

    const lingkunganRayonMap: Record<string, number[]> = {
        '1': [1, 2, 17],
        '2': [12, 13, 16],
        '3': [7, 14, 15],
        '4': [3, 8, 9],
        '5': [5, 10],
        '6': [6, 20],
        '7': [4, 18],
        '8': [11, 19],
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === 'kkNumber' || name === 'nik') {
            formattedValue = value.replace(/\D/g, '').substring(0, 16);
        } else if (name === 'phone') {
            let cleaned = value.replace(/\D/g, '');
            if (cleaned.startsWith('62')) cleaned = cleaned.substring(2);
            while (cleaned.startsWith('0')) cleaned = cleaned.substring(1);
            formattedValue = cleaned.substring(0, 15);
        }

        // Reset rayon if lingkungan changes
        if (name === 'lingkungan') {
            setFormData(prev => ({ ...prev, lingkungan: formattedValue, rayon: '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }

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
            if (!formData.kkNumber) { newErrors.kkNumber = "Nomor Kartu Keluarga wajib diisi"; isValid = false; }
            if (!formData.nik) { newErrors.nik = "NIK wajib diisi"; isValid = false; }
            if (!formData.fullName) { newErrors.fullName = "Nama Lengkap Kartu Keluarga wajib diisi"; isValid = false; }
            if (!formData.gender) { newErrors.gender = "Jenis kelamin wajib dipilih"; isValid = false; }
            if (!formData.dateOfBirth) { newErrors.dateOfBirth = "Tanggal lahir wajib diisi"; isValid = false; }
            if (!formData.phone) { newErrors.phone = "Nomor Telepon/ WhatsApp Aktif wajib diisi"; isValid = false; }
            if (!formData.lingkungan) { newErrors.lingkungan = "Lingkungan wajib dipilih"; isValid = false; }
            if (!formData.rayon) { newErrors.rayon = "Rayon wajib dipilih"; isValid = false; }
            if (!formData.address) { newErrors.address = "Alamat Lengkap wajib diisi"; isValid = false; }

        } else if (currentStep === 3) {
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
            job: formData.jobCategory,
            jobCategory: formData.jobCategory,
            jobTitle: formData.jobTitle,
            companyName: formData.companyName,
            yearsOfExperience: formData.yearsOfExperience,
            skills: formData.skills,
            willingnessToServe: formData.willingnessToServe,
            interestAreas: formData.interestAreas,
            contributionTypes: formData.contributionTypes,
            initials: formData.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
            // Step 1 extras
            kkNumber: formData.kkNumber,
            nik: formData.nik,
            // Step 2
            familyMembers: formData.familyMembers,
            familyMembersMale: formData.familyMembersMale,
            familyMembersFemale: formData.familyMembersFemale,
            familyMembersOutside: formData.familyMembersOutside,
            familyMembersSidi: formData.familyMembersSidi,
            familyMembersSidiMale: formData.familyMembersSidiMale,
            familyMembersSidiFemale: formData.familyMembersSidiFemale,
            familyMembersNonBaptized: formData.familyMembersNonBaptized,
            familyMembersNonSidi: Math.max(0, formData.familyMembers - formData.familyMembersSidi),
            diakonia_recipient: formData.diakonia_recipient,
            diakonia_year: formData.diakonia_year,
            diakonia_type: formData.diakonia_type,
            // Step 3
            education: formData.educationLevel,
            major: formData.major,
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
                        <div className="col-span-2 flex flex-col">
                            <FormLabel required>Nomor Kartu Keluarga</FormLabel>
                            <input name="kkNumber" value={formData.kkNumber} onChange={handleChange} className={inputClass(!!errors.kkNumber)} maxLength={16} placeholder="16 Digit Nomor Kartu Keluarga" />
                            {formData.kkNumber && formData.kkNumber.length > 0 && formData.kkNumber.length < 16 && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                                    <span className="material-symbols-outlined text-base">warning</span>
                                    <span className="text-xs font-medium">Nomor KK harus 16 digit ({formData.kkNumber.length}/16)</span>
                                </div>
                            )}
                            {formData.kkNumber && formData.kkNumber.length === 16 && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                    <span className="text-xs font-medium">Nomor KK valid</span>
                                </div>
                            )}
                            <ErrorMsg msg={errors.kkNumber} />
                        </div>
                        <div className="col-span-2 flex flex-col">
                            <FormLabel required>NIK</FormLabel>
                            <input name="nik" value={formData.nik} onChange={handleChange} className={inputClass(!!errors.nik)} maxLength={16} placeholder="16 Digit NIK" />
                            {formData.nik && formData.nik.length > 0 && formData.nik.length < 16 && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                                    <span className="material-symbols-outlined text-base">warning</span>
                                    <span className="text-xs font-medium">NIK harus 16 digit ({formData.nik.length}/16)</span>
                                </div>
                            )}
                            {formData.nik && formData.nik.length === 16 && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                    <span className="text-xs font-medium">NIK valid</span>
                                </div>
                            )}
                            <ErrorMsg msg={errors.nik} />
                        </div>
                        <div className="col-span-2">
                            <FormLabel required>Nama Lengkap Kepala Keluarga</FormLabel>
                            <input name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass(!!errors.fullName)} placeholder="Contoh: Heru Aldi Benu" />
                            <ErrorMsg msg={errors.fullName} />
                        </div>
                        <div className="col-span-2">
                            {selectInput('gender', 'Jenis Kelamin', ['Laki-laki', 'Perempuan'], true)}
                        </div>
                        <div className="col-span-2">
                            <FormLabel required>Tanggal Lahir</FormLabel>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClass(!!errors.dateOfBirth)} />
                            <ErrorMsg msg={errors.dateOfBirth} />
                        </div>
                        <div className="col-span-2">
                            <FormLabel required>Usia</FormLabel>
                            <input value={calculateAge(formData.dateOfBirth) || '-'} readOnly className={`${inputClass()} bg-slate-100 dark:bg-slate-800 opacity-70 cursor-not-allowed`} />
                        </div>
                        <div className="col-span-2 flex flex-col">
                            <FormLabel required>Nomor Telepon/ WhatsApp Aktif</FormLabel>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-sm">+62</span>
                                <input name="phone" value={formData.phone} onChange={handleChange} className={`${inputClass(!!errors.phone)} pl-12`} placeholder="81234567890" />
                            </div>
                            {formData.phone && formData.phone.length > 0 && formData.phone.length < 10 && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                                    <span className="material-symbols-outlined text-base">warning</span>
                                    <span className="text-xs font-medium">Nomor telepon minimal 10 digit ({formData.phone.length}/10)</span>
                                </div>
                            )}
                            {formData.phone && formData.phone.length >= 10 && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                    <span className="text-xs font-medium">Nomor telepon valid (+62 {formData.phone})</span>
                                </div>
                            )}
                            <ErrorMsg msg={errors.phone} />
                        </div>
                        <div className="col-span-2">
                            <FormLabel required>Lingkungan</FormLabel>
                            <select name="lingkungan" value={formData.lingkungan} onChange={handleChange} className={selectClass(!!errors.lingkungan)}>
                                <option value="">Pilih Lingkungan...</option>
                                {Array.from({ length: 8 }, (_, i) => (
                                    <option key={i + 1} value={(i + 1).toString()}>Lingkungan {i + 1}</option>
                                ))}
                            </select>
                            <ErrorMsg msg={errors.lingkungan} />
                        </div>
                        <div className="col-span-2">
                            <FormLabel required>Rayon</FormLabel>
                            <select name="rayon" value={formData.rayon} onChange={handleChange} className={selectClass(!!errors.rayon)} disabled={!formData.lingkungan}>
                                <option value="">{formData.lingkungan ? "Pilih Rayon..." : "Pilih Lingkungan dahulu..."}</option>
                                {(formData.lingkungan ? lingkunganRayonMap[formData.lingkungan] : []).map(r => (
                                    <option key={r} value={r.toString()}>Rayon {r}</option>
                                ))}
                            </select>
                            <ErrorMsg msg={errors.rayon} />
                        </div>
                        <div className="col-span-2 flex flex-col">
                            <FormLabel required>Alamat</FormLabel>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className={inputClass(!!errors.address)} placeholder="Alamat lengkap..." />
                            {formData.address && formData.address.trim().length > 0 && formData.address.trim().length < 20 && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                                    <span className="material-symbols-outlined text-base">warning</span>
                                    <span className="text-xs font-medium">Alamat terlalu singkat, minimal 20 karakter ({formData.address.trim().length}/20)</span>
                                </div>
                            )}
                            {formData.address && formData.address.trim().length >= 20 && (
                                <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                                    <span className="material-symbols-outlined text-base">check_circle</span>
                                    <span className="text-xs font-medium">Panjang alamat sudah memadai</span>
                                </div>
                            )}
                            <ErrorMsg msg={errors.address} />
                        </div>
                    </div>
                )}
                {/* Step 2: Informasi Keluarga */}
                {step === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                        <SectionDivider title="Jumlah Anggota Keluarga" />
                        {numInput('familyMembers', 'Total Anggota Keluarga')}
                        {numInput('familyMembersMale', 'Laki-laki')}
                        {numInput('familyMembersFemale', 'Perempuan')}
                        {numInput('familyMembersOutside', 'Menetap di Luar Kupang')}

                        <SectionDivider title="Jumlah Anggota Sidi & Baptis" />
                        {numInput('familyMembersSidi', 'Total Anggota Sidi')}
                        {numInput('familyMembersSidiMale', 'Sidi (Laki-laki)')}
                        {numInput('familyMembersSidiFemale', 'Sidi (Perempuan)')}
                        {numInput('familyMembersNonBaptized', 'Belum Dibaptis')}
                        <div className="col-span-1 md:col-span-2">
                            <FormLabel>Belum Sidi (Otomatis)</FormLabel>
                            <div className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] cursor-not-allowed text-sm font-semibold">
                                {Math.max(0, parseInt(formData.familyMembers as any || '0') - parseInt(formData.familyMembersSidi as any || '0'))} Orang
                            </div>
                        </div>

                        <SectionDivider title="Penerima Diakonia GMIT JEL" />
                        {selectInput('diakonia_recipient', 'Penerima Diakonia', ['Ya', 'Tidak'])}
                        {formData.diakonia_recipient === 'Ya' && (
                            <>
                                <div>
                                    <FormLabel>Tahun Penerimaan</FormLabel>
                                    <select name="diakonia_year" value={formData.diakonia_year} onChange={handleChange} className={selectClass(false)}>
                                        <option value="">Pilih Tahun...</option>
                                        {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => String(new Date().getFullYear() - i)).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <FormLabel>Jenis Diakonia yang Diterima</FormLabel>
                                    <textarea name="diakonia_type" value={formData.diakonia_type} onChange={handleChange} rows={2} className={inputClass()} placeholder="Pangan, Dana, dll" />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Step 3: Profesi & Pelayanan */}
                {step === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
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

                        <SectionDivider title="Komitmen Pelayanan" />
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
