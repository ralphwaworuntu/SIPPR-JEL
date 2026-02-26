import { useState } from 'react';
import Step5Economics from '../../form/Step5Economics';
import Step6Health from '../../form/Step6Health';
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

const CountSelect = ({ id, value, onChange, max = 20, startFrom = 0, placeholder = 'Pilih...' }: {
    id: string; value: number; onChange: (val: number) => void; max?: number; startFrom?: number; placeholder?: string;
}) => (
    <div className="relative">
        <select className={selectClass()} id={id} value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)}>
            <option value="0">{placeholder}</option>
            {[...Array(Math.max(0, max - startFrom + 1))].map((_, i) => (
                <option key={i + startFrom} value={i + startFrom}>{i + startFrom}</option>
            ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
    </div>
);


export const AddMemberForm = ({ onClose, onSuccess, initialData }: AddMemberFormProps) => {
    const { addMutation, updateMutation } = useMemberData();
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [skillInputs, setSkillInputs] = useState<Record<number, string>>({});
    const [editingIndex, setEditingIndex] = useState<number | null>(0);

    const isLoading = addMutation.isPending || updateMutation.isPending;

    const [formData, setFormData] = useState({
        // Step 1: Identity & Family
        fullName: initialData?.name || '',
        gender: initialData?.gender || '',
        dateOfBirth: initialData?.birthDate || '',
        phone: initialData?.phone || '',
        address: initialData?.address || '',
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
        educationLevel: initialData?.educationLevel || '',
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
        professionalFamilyMembers: Array.isArray(initialData?.professionalFamilyMembers) ? initialData.professionalFamilyMembers : [{
            name: '',
            hasProfessionalSkill: '',
            skillType: '',
            skillLevel: '',
            workplace: '',
            position: '',
            yearsExperience: '',
            specificSkills: [],
            churchServiceInterest: '',
            serviceInterestArea: '',
            contributionForm: [],
            communityConsent: false
        }],

        // Step 4: Education (Children)
        education_schoolingStatus: initialData?.education_schoolingStatus || '',
        education_totalInSchool: initialData?.education_totalInSchool || 0,
        education_inSchool_tk_paud: initialData?.education_inSchool_tk_paud || 0,
        education_inSchool_sd: initialData?.education_inSchool_sd || 0,
        education_inSchool_smp: initialData?.education_inSchool_smp || 0,
        education_inSchool_sma: initialData?.education_inSchool_sma || 0,
        education_inSchool_university: initialData?.education_inSchool_university || 0,
        education_totalDropout: initialData?.education_totalDropout || 0,
        education_dropout_tk_paud: initialData?.education_dropout_tk_paud || 0,
        education_dropout_sd: initialData?.education_dropout_sd || 0,
        education_dropout_smp: initialData?.education_dropout_smp || 0,
        education_dropout_sma: initialData?.education_dropout_sma || 0,
        education_dropout_university: initialData?.education_dropout_university || 0,
        education_totalUnemployed: initialData?.education_totalUnemployed || 0,
        education_unemployed_sd: initialData?.education_unemployed_sd || 0,
        education_unemployed_smp: initialData?.education_unemployed_smp || 0,
        education_unemployed_sma: initialData?.education_unemployed_sma || 0,
        education_unemployed_university: initialData?.education_unemployed_university || 0,
        education_working: initialData?.education_working || 0,

        // Step 5: Economics & Assets (fully expanded)
        economics_headOccupation: initialData?.economics_headOccupation || '',
        economics_headOccupationOther: initialData?.economics_headOccupationOther || '',
        economics_spouseOccupation: initialData?.economics_spouseOccupation || '',
        economics_spouseOccupationOther: initialData?.economics_spouseOccupationOther || '',
        economics_incomeRange: initialData?.economics_incomeRange || '',
        economics_incomeRangeDetailed: initialData?.economics_incomeRangeDetailed || '',

        economics_expense_food: initialData?.economics_expense_food || 0,
        economics_expense_utilities: initialData?.economics_expense_utilities || 0,
        economics_expense_education: initialData?.economics_expense_education || 0,
        economics_expense_other: initialData?.economics_expense_other || 0,

        economics_hasBusiness: initialData?.economics_hasBusiness || '',
        economics_businessName: initialData?.economics_businessName || '',
        economics_businessType: initialData?.economics_businessType || '',
        economics_businessTypeOther: initialData?.economics_businessTypeOther || '',
        economics_businessDuration: initialData?.economics_businessDuration || '',
        economics_businessDurationYears: initialData?.economics_businessDurationYears || 0,
        economics_businessStatus: initialData?.economics_businessStatus || '',
        economics_businessStatusOther: initialData?.economics_businessStatusOther || '',
        economics_businessLocation: initialData?.economics_businessLocation || '',
        economics_businessLocationOther: initialData?.economics_businessLocationOther || '',
        economics_businessEmployeeCount: initialData?.economics_businessEmployeeCount || '',
        economics_businessCapital: initialData?.economics_businessCapital || 0,
        economics_businessCapitalSource: initialData?.economics_businessCapitalSource || '',
        economics_businessCapitalSourceOther: initialData?.economics_businessCapitalSourceOther || '',
        economics_businessPermit: Array.isArray(initialData?.economics_businessPermit) ? initialData.economics_businessPermit : [],
        economics_businessPermitOther: initialData?.economics_businessPermitOther || '',
        economics_businessMarketing: Array.isArray(initialData?.economics_businessMarketing) ? initialData.economics_businessMarketing : [],
        economics_businessMarketingOther: initialData?.economics_businessMarketingOther || '',
        economics_businessMarketArea: initialData?.economics_businessMarketArea || '',
        economics_businessIssues: Array.isArray(initialData?.economics_businessIssues) ? initialData.economics_businessIssues : [],
        economics_businessIssuesOther: initialData?.economics_businessIssuesOther || '',
        economics_businessNeeds: Array.isArray(initialData?.economics_businessNeeds) ? initialData.economics_businessNeeds : [],
        economics_businessNeedsOther: initialData?.economics_businessNeedsOther || '',
        economics_businessSharing: initialData?.economics_businessSharing || '',
        economics_businessTraining: Array.isArray(initialData?.economics_businessTraining) ? initialData.economics_businessTraining : [],
        economics_businessTrainingOther: initialData?.economics_businessTrainingOther || '',

        economics_houseStatus: initialData?.economics_houseStatus || '',
        economics_houseType: initialData?.economics_houseType || '',
        economics_houseIMB: initialData?.economics_houseIMB || '',
        economics_hasAssets: initialData?.economics_hasAssets || '',
        economics_totalAssets: initialData?.economics_totalAssets || 0,
        economics_assets: Array.isArray(initialData?.economics_assets) ? initialData.economics_assets : [],
        economics_asset_motor_qty: initialData?.economics_asset_motor_qty || 0,
        economics_asset_mobil_qty: initialData?.economics_asset_mobil_qty || 0,
        economics_asset_kulkas_qty: initialData?.economics_asset_kulkas_qty || 0,
        economics_asset_laptop_qty: initialData?.economics_asset_laptop_qty || 0,
        economics_asset_tv_qty: initialData?.economics_asset_tv_qty || 0,
        economics_asset_internet_qty: initialData?.economics_asset_internet_qty || 0,
        economics_asset_lahan_qty: initialData?.economics_asset_lahan_qty || 0,
        economics_landStatus: initialData?.economics_landStatus || '',
        economics_waterSource: initialData?.economics_waterSource || '',
        economics_electricity_capacities: Array.isArray(initialData?.economics_electricity_capacities) ? initialData.economics_electricity_capacities : [],
        economics_electricity_450_qty: initialData?.economics_electricity_450_qty || 0,
        economics_electricity_900_qty: initialData?.economics_electricity_900_qty || 0,
        economics_electricity_1200_qty: initialData?.economics_electricity_1200_qty || 0,
        economics_electricity_2200_qty: initialData?.economics_electricity_2200_qty || 0,
        economics_electricity_5000_qty: initialData?.economics_electricity_5000_qty || 0,
        economics_electricity_total_cost: initialData?.economics_electricity_total_cost || 0,

        // Step 6: Health
        health_sick30Days: initialData?.health_sick30Days || '',
        health_chronicSick: initialData?.health_chronicSick || '',
        health_chronicDisease: Array.isArray(initialData?.health_chronicDisease) ? initialData.health_chronicDisease : [],
        health_chronicDiseaseOther: initialData?.health_chronicDiseaseOther || '',
        health_hasBPJS: initialData?.health_hasBPJS || '',
        health_regularTreatment: initialData?.health_regularTreatment || '',
        health_hasBPJSKetenagakerjaan: initialData?.health_hasBPJSKetenagakerjaan || '',
        health_socialAssistance: initialData?.health_socialAssistance || '',
        health_hasDisability: initialData?.health_hasDisability || '',
        health_disabilityDouble: initialData?.health_disabilityDouble || false,
        health_disabilityPhysical: Array.isArray(initialData?.health_disabilityPhysical) ? initialData.health_disabilityPhysical : [],
        health_disabilityPhysicalOther: initialData?.health_disabilityPhysicalOther || '',
        health_disabilityIntellectual: Array.isArray(initialData?.health_disabilityIntellectual) ? initialData.health_disabilityIntellectual : [],
        health_disabilityIntellectualOther: initialData?.health_disabilityIntellectualOther || '',
        health_disabilityMental: Array.isArray(initialData?.health_disabilityMental) ? initialData.health_disabilityMental : [],
        health_disabilityMentalOther: initialData?.health_disabilityMentalOther || '',
        health_disabilitySensory: Array.isArray(initialData?.health_disabilitySensory) ? initialData.health_disabilitySensory : [],
        health_disabilitySensoryOther: initialData?.health_disabilitySensoryOther || '',

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
        setFormData(prev => {
            const val = parseInt(value) || 0;
            if (name === 'familyMembers') {
                return {
                    ...prev,
                    familyMembers: val,
                    familyMembersMale: 0,
                    familyMembersFemale: 0,
                    familyMembersOutside: 0,
                    familyMembersSidi: 0,
                    familyMembersSidiMale: 0,
                    familyMembersSidiFemale: 0,
                    familyMembersNonBaptized: 0,
                    familyMembersNonSidi: 0
                };
            }
            if (name === 'familyMembersSidi') {
                const updates = {
                    ...prev,
                    familyMembersSidi: val,
                    familyMembersSidiMale: 0,
                    familyMembersSidiFemale: 0
                };
                if (val === prev.familyMembers) {
                    updates.familyMembersNonBaptized = 0;
                }
                return updates;
            }
            return { ...prev, [name]: val };
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

        } else if (currentStep === 2) {
            const totalMembers = Number(formData.familyMembers) || 0;
            const maleMembers = Number(formData.familyMembersMale) || 0;
            const femaleMembers = Number(formData.familyMembersFemale) || 0;
            if (totalMembers > 0 && maleMembers + femaleMembers !== totalMembers) {
                isValid = false;
            }

            const totalSidi = Number(formData.familyMembersSidi) || 0;
            const maleSidi = Number(formData.familyMembersSidiMale) || 0;
            const femaleSidi = Number(formData.familyMembersSidiFemale) || 0;
            if (totalSidi > 0 && maleSidi + femaleSidi !== totalSidi) {
                isValid = false;
            }

            if (!isValid) toast.error("Total pembagian laki-laki dan perempuan tidak sesuai dengan total yang diinput!");
        } else if (currentStep === 3) {
            const members = formData.professionalFamilyMembers || [];
            let step3Error = "";
            if (members.length === 0) {
                step3Error = "Mohon isi minimal 1 anggota keluarga profesional";
                isValid = false;
            } else if (editingIndex !== null) {
                step3Error = "Mohon klik 'Simpan Anggota Ini' terlebih dahulu sebelum melanjutkan.";
                isValid = false;
            } else {
                for (let i = 0; i < members.length; i++) {
                    const member = members[i];
                    if (!member.name) { step3Error = `Mohon isi Nama Anggota Keluarga ke-${i + 1}`; isValid = false; break; }
                    if (!member.workplace) { step3Error = `Mohon isi Tempat Kerja/Instansi Anggota ke-${i + 1}`; isValid = false; break; }
                    if (!member.position) { step3Error = `Mohon isi Jabatan Anggota ke-${i + 1}`; isValid = false; break; }
                    if (!member.yearsExperience) { step3Error = `Mohon pilih Lama Bekerja Anggota ke-${i + 1}`; isValid = false; break; }
                    if (!member.hasProfessionalSkill) { step3Error = `Mohon pilih apakah Anggota ke-${i + 1} memiliki Keahlian Profesional`; isValid = false; break; }

                    if (member.hasProfessionalSkill === 'Ya') {
                        if (!member.skillType) { step3Error = `Mohon pilih Jenis Keahlian Anggota ke-${i + 1}`; isValid = false; break; }
                        if (!member.skillLevel) { step3Error = `Mohon pilih Tingkat Keahlian Anggota ke-${i + 1}`; isValid = false; break; }
                    }

                    if (!member.churchServiceInterest) { step3Error = `Mohon pilih Kesediaan Terlibat Pelayanan Anggota ke-${i + 1}`; isValid = false; break; }

                    if (member.churchServiceInterest && member.churchServiceInterest !== 'Belum bersedia') {
                        if (!member.serviceInterestArea) { step3Error = `Mohon pilih Bidang Minat Pelayanan Anggota ke-${i + 1}`; isValid = false; break; }
                        if (!member.contributionForm || member.contributionForm.length === 0) { step3Error = `Mohon pilih Bentuk Kontribusi Anggota ke-${i + 1}`; isValid = false; break; }
                    }
                }
            }
            if (step3Error) {
                toast.error(step3Error);
                setErrors(newErrors);
                return false;
            }
        } else if (currentStep === 4) {
            if (!formData.education_schoolingStatus) {
                toast.error("Mohon pilih status anak usia sekolah (7-18 tahun)");
                isValid = false;
            } else if (formData.education_schoolingStatus === 'Ya') {
                const totalInSchool =
                    (formData.education_inSchool_tk_paud || 0) +
                    (formData.education_inSchool_sd || 0) +
                    (formData.education_inSchool_smp || 0) +
                    (formData.education_inSchool_sma || 0);

                if (totalInSchool === 0) {
                    toast.error("Anda memilih 'Ya', mohon isi jumlah anak yang bersekolah (minimal 1)");
                    isValid = false;
                }
            }
        } else if (currentStep === 5) {
            if (!formData.economics_headOccupation) { toast.error("Mohon pilih Pekerjaan Utama Kepala Keluarga"); isValid = false; }
            else if (formData.economics_headOccupation === 'Lainnya' && !formData.economics_headOccupationOther) { toast.error("Mohon lengkapi Pekerjaan Utama Kepala Keluarga Lainnya"); isValid = false; }
            else if (formData.economics_spouseOccupation === 'Lainnya' && !formData.economics_spouseOccupationOther) { toast.error("Mohon lengkapi Pekerjaan Utama Istri Lainnya"); isValid = false; }
            else if (!formData.economics_incomeRange) { toast.error("Mohon pilih Range Pendapatan Rumah Tangga"); isValid = false; }
            else if (formData.economics_incomeRange === '≥ Rp 5.000.000' && !formData.economics_incomeRangeDetailed) { toast.error("Mohon pilih Detail Range Pendapatan"); isValid = false; }
            else if (
                (formData.economics_expense_food < 0) ||
                (formData.economics_expense_utilities < 0) ||
                (formData.economics_expense_education < 0) ||
                (formData.economics_expense_other < 0)
            ) {
                toast.error("Pengeluaran tidak boleh negatif"); isValid = false;
            }
            else if (!formData.economics_hasBusiness) { toast.error("Mohon pilih status kepemilikan usaha"); isValid = false; }
            else if (formData.economics_hasBusiness === 'Ya') {
                if (!formData.economics_businessName) { toast.error("Mohon isi Nama/Jenis Usaha"); isValid = false; }
                else if (!formData.economics_businessType) { toast.error("Mohon pilih Jenis Usaha"); isValid = false; }
                else if (formData.economics_businessType === 'Lainnya' && !formData.economics_businessTypeOther) { toast.error("Mohon lengkapi Jenis Usaha lainnya"); isValid = false; }
                else if (!formData.economics_businessDuration) { toast.error("Mohon pilih Lama Usaha"); isValid = false; }
                else if (formData.economics_businessDuration === '> 5 tahun' && !formData.economics_businessDurationYears) { toast.error("Mohon isi lama usaha dalam tahun"); isValid = false; }
                else if (!formData.economics_businessStatus) { toast.error("Mohon pilih Status Usaha"); isValid = false; }
                else if (formData.economics_businessStatus === 'Lainnya' && !formData.economics_businessStatusOther) { toast.error("Mohon lengkapi Status Usaha lainnya"); isValid = false; }
                else if (!formData.economics_businessLocation) { toast.error("Mohon pilih Lokasi Usaha"); isValid = false; }
                else if (formData.economics_businessLocation === 'Lainnya' && !formData.economics_businessLocationOther) { toast.error("Mohon lengkapi Lokasi Usaha lainnya"); isValid = false; }
                else if (!formData.economics_businessEmployeeCount) { toast.error("Mohon pilih Jumlah Tenaga Kerja"); isValid = false; }
                else if (formData.economics_businessCapital < 0) { toast.error("Mohon isi Modal Awal Usaha (minimal 0)"); isValid = false; }
                else if (!formData.economics_businessCapitalSource) { toast.error("Mohon pilih Sumber Modal"); isValid = false; }
                else if (formData.economics_businessCapitalSource === 'Lainnya' && !formData.economics_businessCapitalSourceOther) { toast.error("Mohon lengkapi Sumber Modal lainnya"); isValid = false; }
                else if (!formData.economics_businessPermit || formData.economics_businessPermit.length === 0) { toast.error("Mohon pilih Izin Usaha"); isValid = false; }
                else if (formData.economics_businessPermit.includes('Lainnya') && !formData.economics_businessPermitOther) { toast.error("Mohon lengkapi Izin Usaha lainnya"); isValid = false; }
                else if (!formData.economics_businessMarketing || formData.economics_businessMarketing.length === 0) { toast.error("Mohon pilih Cara Pemasaran Utama"); isValid = false; }
                else if (formData.economics_businessMarketing.includes('Lainnya') && !formData.economics_businessMarketingOther) { toast.error("Mohon lengkapi Cara Pemasaran lainnya"); isValid = false; }
                else if (!formData.economics_businessMarketArea) { toast.error("Mohon pilih Wilayah Pemasaran"); isValid = false; }
                else if (!formData.economics_businessIssues || formData.economics_businessIssues.length === 0) { toast.error("Mohon pilih Tantangan Utama"); isValid = false; }
                else if (formData.economics_businessIssues.includes('Lainnya') && !formData.economics_businessIssuesOther) { toast.error("Mohon lengkapi Tantangan Utama lainnya"); isValid = false; }
                else if (!formData.economics_businessNeeds || formData.economics_businessNeeds.length === 0) { toast.error("Mohon pilih Dukungan yang Dibutuhkan"); isValid = false; }
                else if (formData.economics_businessNeeds.includes('Lainnya') && !formData.economics_businessNeedsOther) { toast.error("Mohon lengkapi Dukungan lainnya"); isValid = false; }
                else if (!formData.economics_businessSharing) { toast.error("Mohon pilih Kesediaan Berbagi Ilmu"); isValid = false; }
                else if (!formData.economics_businessTraining || formData.economics_businessTraining.length === 0) { toast.error("Mohon pilih Minat Pelatihan"); isValid = false; }
                else if (formData.economics_businessTraining.includes('Lainnya') && !formData.economics_businessTrainingOther) { toast.error("Mohon lengkapi Minat Pelatihan lainnya"); isValid = false; }
            }

            // Home / Asset Check (only check if business valid or not present)
            if (isValid) {
                if (!formData.economics_houseStatus) { toast.error("Mohon pilih Status Rumah"); isValid = false; }
                else if (!formData.economics_houseType) { toast.error("Mohon pilih Tipe Rumah"); isValid = false; }
                else if (formData.economics_houseType === 'Permanen' && !formData.economics_houseIMB) { toast.error("Mohon pilih Status IMB"); isValid = false; }
                else if (!formData.economics_hasAssets) { toast.error("Mohon pilih Kepemilikan Aset (Ya/Tidak ada)"); isValid = false; }
                else if (!formData.economics_landStatus) { toast.error("Mohon pilih Status Kepemilikan Tanah"); isValid = false; }
                else if (!formData.economics_waterSource) { toast.error("Mohon pilih Sumber Air Minum Utama"); isValid = false; }
                else if (!formData.economics_electricity_capacities || formData.economics_electricity_capacities.length === 0) { toast.error("Mohon pilih minimal satu Daya Listrik Terpasang"); isValid = false; }
                else if (formData.economics_electricity_capacities.length > 0) {
                    for (const cap of formData.economics_electricity_capacities) {
                        const key = `economics_electricity_${cap.replace(/\D/g, '')}_qty` as keyof typeof formData;
                        if (!(formData[key] as number > 0)) {
                            toast.error(`Mohon isi jumlah meteran untuk daya ${cap}`);
                            isValid = false;
                            break;
                        }
                    }
                }

                if (isValid && (formData.economics_electricity_total_cost === undefined || formData.economics_electricity_total_cost < 0)) { toast.error("Mohon isi Total Biaya Listrik Bulanan (minimal 0)"); isValid = false; }
                else if (formData.economics_hasAssets === 'Ya') {
                    if (!formData.economics_assets || formData.economics_assets.length === 0) {
                        toast.error("Mohon isi minimal satu jumlah aset"); isValid = false;
                    } else {
                        const allAssetsValid = formData.economics_assets.every((asset: string) => {
                            const m = {
                                'Motor': 'economics_asset_motor_qty',
                                'Mobil': 'economics_asset_mobil_qty',
                                'Kulkas': 'economics_asset_kulkas_qty',
                                'Laptop/Komputer': 'economics_asset_laptop_qty',
                                'Televisi': 'economics_asset_tv_qty',
                                'Internet/Indihome': 'economics_asset_internet_qty',
                                'Lahan Pertanian': 'economics_asset_lahan_qty'
                            }[asset as string];
                            const val = m && (formData as any)[m];
                            return val && val > 0;
                        });
                        if (!allAssetsValid) {
                            toast.error(`Mohon isi jumlah masing-masing aset secara lengkap`); isValid = false;
                        }
                    }
                }
            }
        } else if (currentStep === 6) {
            if (!formData.health_sick30Days) { toast.error("Mohon pilih status Sakit 30 Hari Terakhir"); isValid = false; }
            else if (!formData.health_chronicSick) { toast.error("Mohon pilih status Sakit Menahun"); isValid = false; }
            else if (formData.health_chronicSick === 'Ya') {
                if (!formData.health_chronicDisease || formData.health_chronicDisease.length === 0) { toast.error("Mohon pilih Jenis Penyakit Menahun"); isValid = false; }
                else if (formData.health_chronicDisease.includes('Lainnya') && !formData.health_chronicDiseaseOther) { toast.error("Mohon lengkapi Jenis Penyakit Menahun lainnya"); isValid = false; }
            }

            if (isValid) {
                if (!formData.health_hasBPJS) { toast.error("Mohon pilih Status BPJS Kesehatan"); isValid = false; }
                else if (!formData.health_regularTreatment) { toast.error("Mohon pilih Status Pengobatan Teratur"); isValid = false; }
                else if (!formData.health_hasBPJSKetenagakerjaan) { toast.error("Mohon pilih Status BPJS Ketenagakerjaan"); isValid = false; }
                else if (!formData.health_socialAssistance) { toast.error("Mohon pilih Jenis Bantuan Sosial"); isValid = false; }
                else if (!formData.health_hasDisability) { toast.error("Mohon pilih Status Penyandang Disabilitas"); isValid = false; }
                else if (formData.health_hasDisability === 'Ya') {
                    const hasPhysical = (formData.health_disabilityPhysical?.length ?? 0) > 0;
                    const hasIntellectual = (formData.health_disabilityIntellectual?.length ?? 0) > 0;
                    const hasMental = (formData.health_disabilityMental?.length ?? 0) > 0;
                    const hasSensory = (formData.health_disabilitySensory?.length ?? 0) > 0;

                    const totalKategoriDipilih = (hasPhysical ? 1 : 0) + (hasIntellectual ? 1 : 0) + (hasMental ? 1 : 0) + (hasSensory ? 1 : 0);

                    // 1. Validasi minimal ada data yang diisi
                    if (totalKategoriDipilih === 0) {
                        toast.error("Mohon lengkapi detail kategori disabilitas yang dipilih."); isValid = false;
                    }

                    // 2. Jika Ganda dicentang, minimal harus 2 kategori
                    else if (formData.health_disabilityDouble && totalKategoriDipilih < 2) {
                        toast.error("Anda mencentang Disabilitas Ganda, mohon pilih minimal dua kategori disabilitas."); isValid = false;
                    }

                    // 3. Validasi isian "Lainnya" hanya pada kategori yang memang dipilih
                    else if (hasPhysical && formData.health_disabilityPhysical.includes('Lainnya') && !formData.health_disabilityPhysicalOther) {
                        toast.error("Mohon lengkapi keterangan Disabilitas Fisik lainnya"); isValid = false;
                    }
                    else if (hasIntellectual && formData.health_disabilityIntellectual.includes('Lainnya') && !formData.health_disabilityIntellectualOther) {
                        toast.error("Mohon lengkapi keterangan Disabilitas Intelektual lainnya"); isValid = false;
                    }
                    else if (hasMental && formData.health_disabilityMental.includes('Lainnya') && !formData.health_disabilityMentalOther) {
                        toast.error("Mohon lengkapi keterangan Disabilitas Mental lainnya"); isValid = false;
                    }
                    else if (hasSensory && formData.health_disabilitySensory.includes('Lainnya') && !formData.health_disabilitySensoryOther) {
                        toast.error("Mohon lengkapi keterangan Disabilitas Sensorik lainnya"); isValid = false;
                    }
                }
            }
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
            economics_headOccupationOther: formData.economics_headOccupationOther,
            economics_spouseOccupation: formData.economics_spouseOccupation,
            economics_spouseOccupationOther: formData.economics_spouseOccupationOther,
            economics_incomeRange: formData.economics_incomeRange,
            economics_incomeRangeDetailed: formData.economics_incomeRangeDetailed,
            economics_expense_food: formData.economics_expense_food,
            economics_expense_utilities: formData.economics_expense_utilities,
            economics_expense_education: formData.economics_expense_education,
            economics_expense_other: formData.economics_expense_other,
            economics_hasBusiness: formData.economics_hasBusiness,
            economics_businessName: formData.economics_businessName,
            economics_businessType: formData.economics_businessType,
            economics_businessTypeOther: formData.economics_businessTypeOther,
            economics_businessDuration: formData.economics_businessDuration,
            economics_businessDurationYears: formData.economics_businessDurationYears,
            economics_businessStatus: formData.economics_businessStatus,
            economics_businessStatusOther: formData.economics_businessStatusOther,
            economics_businessLocation: formData.economics_businessLocation,
            economics_businessLocationOther: formData.economics_businessLocationOther,
            economics_businessEmployeeCount: formData.economics_businessEmployeeCount,
            economics_businessCapital: formData.economics_businessCapital,
            economics_businessCapitalSource: formData.economics_businessCapitalSource,
            economics_businessCapitalSourceOther: formData.economics_businessCapitalSourceOther,
            economics_businessPermit: formData.economics_businessPermit,
            economics_businessPermitOther: formData.economics_businessPermitOther,
            economics_businessMarketing: formData.economics_businessMarketing,
            economics_businessMarketingOther: formData.economics_businessMarketingOther,
            economics_businessMarketArea: formData.economics_businessMarketArea,
            economics_businessIssues: formData.economics_businessIssues,
            economics_businessIssuesOther: formData.economics_businessIssuesOther,
            economics_businessNeeds: formData.economics_businessNeeds,
            economics_businessNeedsOther: formData.economics_businessNeedsOther,
            economics_businessSharing: formData.economics_businessSharing,
            economics_businessTraining: formData.economics_businessTraining,
            economics_businessTrainingOther: formData.economics_businessTrainingOther,
            economics_houseStatus: formData.economics_houseStatus,
            economics_houseType: formData.economics_houseType,
            economics_houseIMB: formData.economics_houseIMB,
            economics_hasAssets: formData.economics_hasAssets,
            economics_totalAssets: formData.economics_totalAssets,
            economics_assets: formData.economics_assets,
            economics_asset_motor_qty: formData.economics_asset_motor_qty,
            economics_asset_mobil_qty: formData.economics_asset_mobil_qty,
            economics_asset_kulkas_qty: formData.economics_asset_kulkas_qty,
            economics_asset_laptop_qty: formData.economics_asset_laptop_qty,
            economics_asset_tv_qty: formData.economics_asset_tv_qty,
            economics_asset_internet_qty: formData.economics_asset_internet_qty,
            economics_asset_lahan_qty: formData.economics_asset_lahan_qty,
            economics_landStatus: formData.economics_landStatus,
            economics_waterSource: formData.economics_waterSource,
            economics_electricity_capacities: formData.economics_electricity_capacities,
            economics_electricity_450_qty: formData.economics_electricity_450_qty,
            economics_electricity_900_qty: formData.economics_electricity_900_qty,
            economics_electricity_1200_qty: formData.economics_electricity_1200_qty,
            economics_electricity_2200_qty: formData.economics_electricity_2200_qty,
            economics_electricity_5000_qty: formData.economics_electricity_5000_qty,
            economics_electricity_total_cost: formData.economics_electricity_total_cost,
            // Step 6
            health_sick30Days: formData.health_sick30Days,
            health_chronicSick: formData.health_chronicSick,
            health_chronicDisease: formData.health_chronicDisease,
            health_chronicDiseaseOther: formData.health_chronicDiseaseOther,
            health_hasBPJS: formData.health_hasBPJS,
            health_regularTreatment: formData.health_regularTreatment,
            health_hasBPJSKetenagakerjaan: formData.health_hasBPJSKetenagakerjaan,
            health_socialAssistance: formData.health_socialAssistance,
            health_hasDisability: formData.health_hasDisability,
            health_disabilityDouble: formData.health_disabilityDouble,
            health_disabilityPhysical: formData.health_disabilityPhysical,
            health_disabilityPhysicalOther: formData.health_disabilityPhysicalOther,
            health_disabilityIntellectual: formData.health_disabilityIntellectual,
            health_disabilityIntellectualOther: formData.health_disabilityIntellectualOther,
            health_disabilityMental: formData.health_disabilityMental,
            health_disabilityMentalOther: formData.health_disabilityMentalOther,
            health_disabilitySensory: formData.health_disabilitySensory,
            health_disabilitySensoryOther: formData.health_disabilitySensoryOther,
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

    // Reusable count select helper
    const countSelectInput = (name: string, label: string, max: number = 20) => (
        <div>
            <FormLabel>{label}</FormLabel>
            <div className="relative">
                <select name={name} value={(formData as any)[name]} onChange={e => handleNumberChange(name, e.target.value)} className={selectClass()}>
                    {[...Array(max + 1)].map((_, i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
            </div>
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
                            <div className="flex flex-col pb-1 gap-1">
                                <FormLabel required>Alamat</FormLabel>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    Contoh: Jl. Kiu Leu No. 1, RT.001/RW.002, Kel. Liliba, Kec. Oebobo, Kota Kupang.
                                </span>
                            </div>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className={inputClass(!!errors.address)} />
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
                {step === 2 && (() => {
                    const totalMembers = Number(formData.familyMembers) || 0;
                    const maleMembers = Number(formData.familyMembersMale) || 0;
                    const femaleMembers = Number(formData.familyMembersFemale) || 0;
                    const isFamilyCountValid = maleMembers + femaleMembers === totalMembers;
                    const showFamilyValidation = totalMembers > 0;

                    const totalSidi = Number(formData.familyMembersSidi) || 0;
                    const maleSidi = Number(formData.familyMembersSidiMale) || 0;
                    const femaleSidi = Number(formData.familyMembersSidiFemale) || 0;
                    const isSidiCountValid = maleSidi + femaleSidi === totalSidi;
                    const showSidiValidation = totalSidi > 0;

                    return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                            <SectionDivider title="Jumlah Anggota Keluarga" />
                            <div className="col-span-1 md:col-span-2">
                                {countSelectInput('familyMembers', 'Total Anggota Keluarga')}
                            </div>

                            {totalMembers > 0 && (
                                <>
                                    {countSelectInput('familyMembersMale', 'Laki-laki', Math.max(0, totalMembers - femaleMembers))}
                                    {countSelectInput('familyMembersFemale', 'Perempuan', Math.max(0, totalMembers - maleMembers))}
                                    {countSelectInput('familyMembersOutside', 'Menetap di Luar Kupang', totalMembers)}

                                    {showFamilyValidation && (
                                        <div className="col-span-1 md:col-span-2">
                                            {!isFamilyCountValid ? (
                                                <div className="flex items-center gap-1.5 text-red-500 animate-fadeIn bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg mt-1 w-full text-xs font-medium">
                                                    <span className="material-symbols-outlined text-sm">warning</span>
                                                    Total Laki-laki ({maleMembers}) & Perempuan ({femaleMembers}) tidak sesuai dengan Total Anggota Keluarga ({totalMembers})
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg mt-1 w-full text-xs font-medium">
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                                    Distribusi data gender sesuai dengan total anggota.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            <SectionDivider title="Jumlah Anggota Sidi & Baptis" />
                            <div className="col-span-1 md:col-span-2">
                                {countSelectInput('familyMembersSidi', 'Total Anggota Sidi', totalMembers)}
                            </div>

                            {totalSidi > 0 && (
                                <>
                                    {countSelectInput('familyMembersSidiMale', 'Sidi (Laki-laki)', Math.max(0, totalSidi - femaleSidi))}
                                    {countSelectInput('familyMembersSidiFemale', 'Sidi (Perempuan)', Math.max(0, totalSidi - maleSidi))}
                                    {countSelectInput('familyMembersNonBaptized', 'Belum Dibaptis', Math.max(0, totalMembers - totalSidi))}

                                    {showSidiValidation && (
                                        <div className="col-span-1 md:col-span-2">
                                            {!isSidiCountValid ? (
                                                <div className="flex items-center gap-1.5 text-red-500 animate-fadeIn bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg mt-1 w-full text-xs font-medium">
                                                    <span className="material-symbols-outlined text-sm">warning</span>
                                                    Total Sidi Laki-laki ({maleSidi}) & Perempuan ({femaleSidi}) tidak sesuai dengan Total Sidi ({totalSidi})
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg mt-1 w-full text-xs font-medium">
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                                    Distribusi data gender sidi sesuai dengan total sidi.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="col-span-1 md:col-span-2">
                                <FormLabel>Belum Sidi (Otomatis)</FormLabel>
                                <div className="w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] cursor-not-allowed text-sm font-semibold">
                                    {Math.max(0, totalMembers - totalSidi)} Orang
                                </div>
                            </div>

                            <SectionDivider title="Penerima Diakonia GMIT JEL" />
                            {selectInput('diakonia_recipient', 'Penerima Diakonia', ['Ya', 'Tidak'], true)}
                            {formData.diakonia_recipient === 'Ya' && (
                                <>
                                    <div>
                                        <FormLabel required>Tahun Penerimaan</FormLabel>
                                        <select name="diakonia_year" value={formData.diakonia_year} onChange={handleChange} className={selectClass(!!errors.diakonia_year)}>
                                            <option value="">Pilih Tahun...</option>
                                            {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => String(new Date().getFullYear() - i)).map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <ErrorMsg msg={errors.diakonia_year} />
                                    </div>
                                    <div className="col-span-2">
                                        <FormLabel required>Jenis Diakonia yang Diterima</FormLabel>
                                        <textarea name="diakonia_type" value={formData.diakonia_type} onChange={handleChange} rows={2} className={inputClass(!!errors.diakonia_type)} placeholder="Pangan, Dana, dll" />
                                        <ErrorMsg msg={errors.diakonia_type} />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })()}
                {/* Step 3: Profesi & Pelayanan */}
                {step === 3 && (
                    <div className="space-y-6 animate-fade-in">
                        <SectionDivider title="Data Anggota Keluarga Profesional" />

                        {(formData.professionalFamilyMembers || []).map((member: any, index: number) => {
                            if (editingIndex !== index) {
                                return (
                                    <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:border-blue-600/30 animate-fade-in mt-4">
                                        <div className="flex flex-col gap-1 flex-1">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                                                <span className="material-symbols-outlined text-blue-600 text-xl">person</span>
                                                {member.name || 'Anggota Tanpa Nama'}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                {(member.workplace || member.position) ? (
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">work</span>
                                                        {member.position}{member.position && member.workplace ? ' di ' : ''}{member.workplace}
                                                    </span>
                                                ) : (
                                                    <span className="italic">Data pekerjaan belum lengkap</span>
                                                )}
                                                {member.skillType && (
                                                    <>
                                                        <span className="hidden md:inline">•</span>
                                                        <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 px-2 py-0.5 rounded-lg text-xs font-semibold">
                                                            {member.skillType}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 md:w-auto w-full justify-end border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-3 md:pt-0 mt-3 md:mt-0">
                                            <button
                                                type="button"
                                                onClick={() => setEditingIndex(index)}
                                                className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newList = [...formData.professionalFamilyMembers];
                                                    newList.splice(index, 1);
                                                    setFormData({ ...formData, professionalFamilyMembers: newList });
                                                    if (editingIndex === index) setEditingIndex(null);
                                                    else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
                                                }}
                                                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={index} className="p-5 border-2 border-slate-200 dark:border-slate-700/60 rounded-2xl bg-white dark:bg-slate-800/80 shadow-sm relative mt-4">
                                    <div className="space-y-6">
                                        {/* Identity & Work Section */}
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-2">
                                                <FormLabel required>Nama Anggota Keluarga</FormLabel>
                                                <input
                                                    className={inputClass()}
                                                    placeholder="Nama Lengkap"
                                                    type="text"
                                                    value={member.name}
                                                    onChange={(e) => {
                                                        const newList = [...formData.professionalFamilyMembers];
                                                        newList[index].name = e.target.value;
                                                        setFormData({ ...formData, professionalFamilyMembers: newList });
                                                    }}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <FormLabel required>Tempat Kerja / Instansi</FormLabel>
                                                    <input
                                                        className={inputClass()}
                                                        placeholder="Nama Instansi/Perusahaan"
                                                        type="text"
                                                        value={member.workplace || ''}
                                                        onChange={(e) => {
                                                            const newList = [...formData.professionalFamilyMembers];
                                                            newList[index].workplace = e.target.value;
                                                            setFormData({ ...formData, professionalFamilyMembers: newList });
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <FormLabel required>Jabatan Saat Ini</FormLabel>
                                                    <input
                                                        className={inputClass()}
                                                        placeholder="Contoh: Staff, Manager"
                                                        type="text"
                                                        value={member.position || ''}
                                                        onChange={(e) => {
                                                            const newList = [...formData.professionalFamilyMembers];
                                                            newList[index].position = e.target.value;
                                                            setFormData({ ...formData, professionalFamilyMembers: newList });
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <FormLabel required>Lama Bekerja</FormLabel>
                                                    <select
                                                        className={selectClass()}
                                                        value={member.yearsExperience || ''}
                                                        onChange={(e) => {
                                                            const newList = [...formData.professionalFamilyMembers];
                                                            newList[index].yearsExperience = e.target.value;
                                                            setFormData({ ...formData, professionalFamilyMembers: newList });
                                                        }}
                                                    >
                                                        <option value="">Pilih Lama Bekerja...</option>
                                                        <option value="< 1 Tahun">Kurang dari 1 Tahun</option>
                                                        <option value="1-3 Tahun">1 - 3 Tahun</option>
                                                        <option value="3-5 Tahun">3 - 5 Tahun</option>
                                                        <option value="5-10 Tahun">5 - 10 Tahun</option>
                                                        <option value="> 10 Tahun">Lebih dari 10 Tahun</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <FormLabel>Keahlian Spesifik <span className="text-xs font-normal text-slate-500 dark:text-slate-400 opacity-80">(Bisa lebih dari satu)</span></FormLabel>
                                                <div className="flex gap-2">
                                                    <input
                                                        className={`flex-1 ${inputClass()}`}
                                                        placeholder="Ketik keahlian lalu tekan Enter atau Tambah"
                                                        type="text"
                                                        value={skillInputs[index] || ''}
                                                        onChange={(e) => setSkillInputs({ ...skillInputs, [index]: e.target.value })}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const input = skillInputs[index]?.trim();
                                                                if (!input) return;
                                                                const newList = [...formData.professionalFamilyMembers];
                                                                const currentSkills = newList[index].specificSkills || [];
                                                                if (!currentSkills.includes(input)) {
                                                                    newList[index].specificSkills = [...currentSkills, input];
                                                                    setFormData({ ...formData, professionalFamilyMembers: newList });
                                                                }
                                                                setSkillInputs({ ...skillInputs, [index]: '' });
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const input = skillInputs[index]?.trim();
                                                            if (!input) return;
                                                            const newList = [...formData.professionalFamilyMembers];
                                                            const currentSkills = newList[index].specificSkills || [];
                                                            if (!currentSkills.includes(input)) {
                                                                newList[index].specificSkills = [...currentSkills, input];
                                                                setFormData({ ...formData, professionalFamilyMembers: newList });
                                                            }
                                                            setSkillInputs({ ...skillInputs, [index]: '' });
                                                        }}
                                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 rounded-xl font-bold transition-all duration-200 text-sm shrink-0 flex items-center gap-2 border-2 border-emerald-600/20 shadow-sm focus:ring-2 focus:ring-emerald-500/50"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">add</span>
                                                        Tambah
                                                    </button>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {(member.specificSkills || []).map((skill: string, skIndex: number) => (
                                                        <span key={skIndex} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 border border-blue-600/20 xl:px-3 md:px-2 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
                                                            {skill}
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newList = [...formData.professionalFamilyMembers];
                                                                    newList[index].specificSkills = newList[index].specificSkills.filter((s: string) => s !== skill);
                                                                    setFormData({ ...formData, professionalFamilyMembers: newList });
                                                                }}
                                                                className="hover:text-red-500 transition-colors bg-white/50 dark:bg-black/20 rounded-full w-4 h-4 flex items-center justify-center outline-none"
                                                            >
                                                                <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                                                            </button>
                                                        </span>
                                                    ))}
                                                    {(member.specificSkills || []).length === 0 && (
                                                        <span className="text-sm text-slate-400 dark:text-slate-500 italic">Belum ada keahlian spesifik ditambahkan.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Has Professional Skill */}
                                        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                            <FormLabel required>Apakah anggota ini memiliki Keahlian Profesional?</FormLabel>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Ya', 'Tidak'].map((opt) => (
                                                    <label key={opt} className={`cursor-pointer p-3.5 border-2 rounded-xl flex items-center gap-3 transition-all duration-200 select-none ${member.hasProfessionalSkill === opt ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10 shadow-sm shadow-blue-500/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-500/40'}`}>
                                                        <input
                                                            type="radio"
                                                            value={opt}
                                                            checked={member.hasProfessionalSkill === opt}
                                                            onChange={() => {
                                                                const newList = [...formData.professionalFamilyMembers];
                                                                newList[index].hasProfessionalSkill = opt;
                                                                if (opt === 'Tidak') {
                                                                    newList[index].skillType = '';
                                                                    newList[index].skillLevel = '';
                                                                }
                                                                setFormData({ ...formData, professionalFamilyMembers: newList });
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${member.hasProfessionalSkill === opt ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`}>
                                                            {member.hasProfessionalSkill === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                                                        </div>
                                                        <span className="font-bold text-sm tracking-wide">{opt}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Professional Detail Fields (If Yes) */}
                                        {member.hasProfessionalSkill === 'Ya' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700 animate-fade-in">
                                                <div className="flex flex-col gap-2">
                                                    <FormLabel required>Jenis Keahlian Utama</FormLabel>
                                                    <select
                                                        className={selectClass()}
                                                        value={
                                                            !member.skillType ? "" :
                                                                [
                                                                    'Kesehatan & Medis',
                                                                    'Pendidikan & Pelatihan',
                                                                    'Teknologi, IT & Digital',
                                                                    'Teknik, Sipil & Konstruksi',
                                                                    'Hukum, Advokasi & Keamanan',
                                                                    'Keuangan, Akuntansi & Perbankan',
                                                                    'Seni, Musik & Kreatif',
                                                                    'Kewirausahaan & Bisnis',
                                                                    'Pelayanan Jasa & Perdagangan',
                                                                    'Administrasi & Pemerintahan',
                                                                    'Agrikultur & Alam'
                                                                ].includes(member.skillType) ? member.skillType : 'Lainnya'
                                                        }
                                                        onChange={(e) => {
                                                            const newList = [...formData.professionalFamilyMembers];
                                                            newList[index].skillType = e.target.value;
                                                            setFormData({ ...formData, professionalFamilyMembers: newList });
                                                        }}
                                                    >
                                                        <option value="">Pilih Jenis Keahlian...</option>
                                                        <option value="Kesehatan & Medis">Kesehatan & Medis</option>
                                                        <option value="Pendidikan & Pelatihan">Pendidikan & Pelatihan</option>
                                                        <option value="Teknologi, IT & Digital">Teknologi, IT & Digital</option>
                                                        <option value="Teknik, Sipil & Konstruksi">Teknik, Sipil & Konstruksi</option>
                                                        <option value="Hukum, Advokasi & Keamanan">Hukum, Advokasi & Keamanan</option>
                                                        <option value="Keuangan, Akuntansi & Perbankan">Keuangan, Akuntansi & Perbankan</option>
                                                        <option value="Seni, Musik & Kreatif">Seni, Musik & Kreatif</option>
                                                        <option value="Kewirausahaan & Bisnis">Kewirausahaan & Bisnis</option>
                                                        <option value="Pelayanan Jasa & Perdagangan">Pelayanan Jasa & Perdagangan</option>
                                                        <option value="Administrasi & Pemerintahan">Administrasi & Pemerintahan</option>
                                                        <option value="Agrikultur & Alam">Agrikultur & Alam</option>
                                                        <option value="Lainnya">Lainnya</option>
                                                    </select>

                                                    {member.skillType !== undefined && member.skillType !== '' && ![
                                                        'Kesehatan & Medis',
                                                        'Pendidikan & Pelatihan',
                                                        'Teknologi, IT & Digital',
                                                        'Teknik, Sipil & Konstruksi',
                                                        'Hukum, Advokasi & Keamanan',
                                                        'Keuangan, Akuntansi & Perbankan',
                                                        'Seni, Musik & Kreatif',
                                                        'Kewirausahaan & Bisnis',
                                                        'Pelayanan Jasa & Perdagangan',
                                                        'Administrasi & Pemerintahan',
                                                        'Agrikultur & Alam'
                                                    ].includes(member.skillType) && (
                                                            <div className="mt-2 animate-fadeIn">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Spesifikasikan Keahlian Utama..."
                                                                    className={inputClass()}
                                                                    value={member.skillType === 'Lainnya' ? '' : member.skillType}
                                                                    onChange={(e) => {
                                                                        const newList = [...formData.professionalFamilyMembers];
                                                                        newList[index].skillType = e.target.value;
                                                                        setFormData({ ...formData, professionalFamilyMembers: newList });
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <FormLabel required>Tingkat Keahlian</FormLabel>
                                                    <select
                                                        className={selectClass()}
                                                        value={member.skillLevel || ''}
                                                        onChange={(e) => {
                                                            const newList = [...formData.professionalFamilyMembers];
                                                            newList[index].skillLevel = e.target.value;
                                                            setFormData({ ...formData, professionalFamilyMembers: newList });
                                                        }}
                                                    >
                                                        <option value="">Pilih Tingkat Keahlian...</option>
                                                        <option value="1">Dasar</option>
                                                        <option value="2">Menengah</option>
                                                        <option value="3">Mahir</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* Service Interest */}
                                        <div className="grid grid-cols-1 gap-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                                            <div className="flex flex-col gap-3">
                                                <FormLabel required>Bersedia terlibat pelayanan?</FormLabel>
                                                <div className="flex flex-col gap-2">
                                                    {['Ya, bersedia aktif', 'Ya, bila dibutuhkan'].map((opt) => (
                                                        <label key={opt} className={`cursor-pointer p-3 border-2 rounded-xl flex items-center gap-3 transition-all duration-200 select-none ${member.churchServiceInterest === opt ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-500/40'}`}>
                                                            <input
                                                                type="radio"
                                                                value={opt}
                                                                checked={member.churchServiceInterest === opt}
                                                                onChange={() => {
                                                                    const newList = [...formData.professionalFamilyMembers];
                                                                    newList[index].churchServiceInterest = opt;
                                                                    setFormData({ ...formData, professionalFamilyMembers: newList });
                                                                }}
                                                                className="hidden"
                                                            />
                                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${member.churchServiceInterest === opt ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`}>
                                                                {member.churchServiceInterest === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                                                            </div>
                                                            <span className="font-bold text-sm tracking-wide">{opt}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {member.churchServiceInterest && member.churchServiceInterest !== 'Belum bersedia' && (
                                                <>
                                                    <div className="flex flex-col gap-3 animate-fade-in">
                                                        <FormLabel required>Bidang Minat Pelayanan</FormLabel>
                                                        <div className="flex flex-col gap-2">
                                                            {['Sesuai Profesi', 'Lintas Profesi'].map((opt) => (
                                                                <label key={opt} className={`cursor-pointer p-3 border-2 rounded-xl flex items-center gap-3 transition-all duration-200 select-none ${member.serviceInterestArea === opt ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-blue-500/40'}`}>
                                                                    <input
                                                                        type="radio"
                                                                        value={opt}
                                                                        checked={member.serviceInterestArea === opt}
                                                                        onChange={() => {
                                                                            const newList = [...formData.professionalFamilyMembers];
                                                                            newList[index].serviceInterestArea = opt;
                                                                            setFormData({ ...formData, professionalFamilyMembers: newList });
                                                                        }}
                                                                        className="hidden"
                                                                    />
                                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${member.serviceInterestArea === opt ? 'border-blue-600 bg-blue-600' : 'border-slate-400'}`}>
                                                                        {member.serviceInterestArea === opt && <div className="w-2 h-2 rounded-full bg-white" />}
                                                                    </div>
                                                                    <span className="font-bold text-sm tracking-wide">{opt}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col gap-2 relative z-10 animate-fade-in">
                                                        <FormLabel required>Bentuk Kontribusi <span className="text-xs font-normal text-slate-500 dark:text-slate-400 opacity-80">(Bisa pilih lebih dari satu)</span></FormLabel>
                                                        <details className="group">
                                                            <summary className={`${selectClass()} flex items-center justify-between cursor-pointer select-none list-none group-open:border-blue-600 group-open:ring-2 group-open:ring-blue-600/20 transition-all duration-300`}>
                                                                <span className={`block truncate ${(!member.contributionForm || member.contributionForm.length === 0) ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white font-semibold'}`}>
                                                                    {(!member.contributionForm || member.contributionForm.length === 0) ? 'Pilih Bentuk Kontribusi...' : member.contributionForm.join(', ')}
                                                                </span>
                                                                <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-300">expand_more</span>
                                                            </summary>
                                                            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-20 max-h-[250px] overflow-y-auto animate-fade-in">
                                                                <div className="p-2 flex flex-col gap-1">
                                                                    {['Tenaga', 'Pikiran', 'Dana', 'Waktu'].map((opt) => {
                                                                        const isChecked = member.contributionForm?.includes(opt) || false;
                                                                        return (
                                                                            <label key={opt} className={`cursor-pointer p-3 rounded-lg flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${isChecked ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-900'}`}>
                                                                                    {isChecked && <span className="material-symbols-outlined text-white text-[14px] font-bold">check</span>}
                                                                                </div>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={isChecked}
                                                                                    onChange={(e) => {
                                                                                        const newList = [...formData.professionalFamilyMembers];
                                                                                        const currentForms = newList[index].contributionForm || [];
                                                                                        newList[index].contributionForm = e.target.checked ? [...currentForms, opt] : currentForms.filter((item: string) => item !== opt);
                                                                                        setFormData({ ...formData, professionalFamilyMembers: newList });
                                                                                    }}
                                                                                    className="sr-only"
                                                                                />
                                                                                <span className="font-semibold text-sm">{opt}</span>
                                                                            </label>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </details>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        {/* Community Consent */}
                                        <div className="pt-6 border-t border-dashed border-slate-200 dark:border-slate-700">
                                            <label className={`cursor-pointer flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${member.communityConsent ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg shadow-blue-600/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-blue-500/30 group/consent'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={member.communityConsent || false}
                                                    onChange={(e) => {
                                                        const newList = [...formData.professionalFamilyMembers];
                                                        newList[index].communityConsent = e.target.checked;
                                                        setFormData({ ...formData, professionalFamilyMembers: newList });
                                                    }}
                                                    className="sr-only"
                                                />
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 ${member.communityConsent ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-600/20' : 'border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-900 group-hover/consent:border-blue-400'}`}>
                                                    {member.communityConsent && <span className="material-symbols-outlined text-white text-base font-bold animate-scale-in">check</span>}
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className={`font-bold text-sm transition-colors duration-300 ${member.communityConsent ? 'text-blue-600' : 'text-slate-900 dark:text-white'}`}>Persetujuan Bergabung Komunitas</span>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Saya menyatakan bersedia dan menyetujui untuk bergabung dalam komunitas profesional GMIT Emaus Liliba guna mendukung program pengembangan jemaat.</p>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Footer Actions (Delete & Save Area) */}
                                        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-4">
                                            {/* Delete Button */}
                                            {formData.professionalFamilyMembers.length > 1 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newList = [...formData.professionalFamilyMembers];
                                                        newList.splice(index, 1);
                                                        setFormData({ ...formData, professionalFamilyMembers: newList });
                                                    }}
                                                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-1"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    Hapus
                                                </button>
                                            ) : (
                                                <div /> /* Empty div to push the save button to the right */
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingIndex(null);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 group"
                                            >
                                                <span className="material-symbols-outlined group-hover:animate-bounce">save</span>
                                                Simpan Anggota Ini
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {editingIndex === null && (
                            <button
                                type="button"
                                onClick={() => {
                                    const newList = [...(formData.professionalFamilyMembers || [])];
                                    newList.push({
                                        name: '', hasProfessionalSkill: '', skillType: '', skillLevel: '', workplace: '', position: '',
                                        yearsExperience: '', specificSkills: [], churchServiceInterest: '', serviceInterestArea: '',
                                        contributionForm: [], communityConsent: false
                                    });
                                    setFormData({ ...formData, professionalFamilyMembers: newList });
                                    setEditingIndex(newList.length - 1);
                                }}
                                className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all outline-none font-bold group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                                    <span className="material-symbols-outlined text-2xl">person_add</span>
                                </div>
                                <span className="font-bold text-base tracking-tight">Tambah Anggota Profesional Lainnya</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Step 4: Education (Children) */}
                {step === 4 && (
                    <div className="space-y-8 animate-fade-in border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                        <SectionDivider title="Bidang Pendidikan" />

                        {/* Question 1: Schooling Status */}
                        <div className="space-y-4 relative z-10">
                            <FormLabel required>Apakah semua anak usia sekolah (7-18 tahun) di rumah ini sedang bersekolah?</FormLabel>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {['Ya', 'Tidak', 'Tidak ada anak usia sekolah'].map((opt) => (
                                    <label key={opt} className={`cursor-pointer p-3.5 border-2 rounded-xl flex items-start gap-3 transition-all duration-200 ${formData.education_schoolingStatus === opt ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-700'}`}>
                                        <input
                                            type="radio"
                                            value={opt}
                                            checked={formData.education_schoolingStatus === opt}
                                            onChange={(e) => setFormData({ ...formData, education_schoolingStatus: e.target.value })}
                                            className="mt-1"
                                        />
                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Question 2: Currently in School (Conditional) */}
                        {formData.education_schoolingStatus === 'Ya' && (
                            <div className="space-y-6 pl-4 border-l-2 border-primary/20">
                                <div className="space-y-4">
                                    <FormLabel required>Total anak sekolah dan distribusinya:</FormLabel>
                                    <div className="max-w-[200px] flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Anak Sekolah</label>
                                        <CountSelect
                                            id="totalInSchool"
                                            value={formData.education_totalInSchool || 0}
                                            onChange={(val) => setFormData({
                                                ...formData,
                                                education_totalInSchool: val,
                                                education_inSchool_tk_paud: 0,
                                                education_inSchool_sd: 0,
                                                education_inSchool_smp: 0,
                                                education_inSchool_sma: 0,
                                                education_inSchool_university: 0
                                            })}
                                            max={15}
                                            placeholder="Pilih Total..."
                                        />
                                    </div>
                                </div>

                                {formData.education_totalInSchool > 0 && (() => {
                                    const totalInSchool = formData.education_totalInSchool || 0;
                                    const allocatedInSchool = (formData.education_inSchool_tk_paud || 0) +
                                        (formData.education_inSchool_sd || 0) +
                                        (formData.education_inSchool_smp || 0) +
                                        (formData.education_inSchool_sma || 0) +
                                        (formData.education_inSchool_university || 0);
                                    const isSummaryValid = totalInSchool === 0 || allocatedInSchool === totalInSchool;

                                    return (
                                        <div className="space-y-4 animate-fadeIn">
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                {[
                                                    { label: 'TK/PAUD', field: 'education_inSchool_tk_paud' },
                                                    { label: 'SD', field: 'education_inSchool_sd' },
                                                    { label: 'SMP', field: 'education_inSchool_smp' },
                                                    { label: 'SMA', field: 'education_inSchool_sma' },
                                                    { label: 'Perguruan Tinggi', field: 'education_inSchool_university' },
                                                ].map(({ label, field }) => {
                                                    const currentVal = (formData[field as keyof typeof formData] as number) || 0;
                                                    const otherAllocated = allocatedInSchool - currentVal;
                                                    const maxPossible = totalInSchool - otherAllocated;

                                                    return (
                                                        <div key={field} className="flex flex-col gap-2">
                                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>
                                                            <CountSelect
                                                                id={field}
                                                                value={currentVal}
                                                                onChange={(val) => setFormData({ ...formData, [field]: val })}
                                                                max={maxPossible}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {!isSummaryValid && (
                                                <p className="text-red-500 text-xs font-medium flex items-center gap-1.5 mt-2 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg max-w-fit">
                                                    <span className="material-symbols-outlined text-sm shrink-0">warning</span>
                                                    Total distribusi ({allocatedInSchool}) belum sesuai dengan Total Anak ({totalInSchool})
                                                </p>
                                            )}

                                            {isSummaryValid && allocatedInSchool > 0 && (
                                                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5 mt-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg max-w-fit">
                                                    <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                                                    Distribusi data sudah sesuai dengan total anak.
                                                </p>
                                            )}
                                        </div>
                                    )
                                })()}
                            </div>
                        )}

                        {/* Question 3: Dropouts */}
                        {(formData.education_schoolingStatus === 'Ya' || formData.education_schoolingStatus === 'Tidak') && (
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <FormLabel required>Anak Putus Sekolah:</FormLabel>
                                    <div className="max-w-[200px] flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Anak Putus Sekolah</label>
                                        <CountSelect
                                            id="totalDropout"
                                            value={formData.education_totalDropout || 0}
                                            onChange={(val) => setFormData({
                                                ...formData,
                                                education_totalDropout: val,
                                                education_dropout_sd: 0,
                                                education_dropout_smp: 0,
                                                education_dropout_sma: 0,
                                                education_dropout_university: 0
                                            })}
                                            max={15}
                                            placeholder="Pilih Total..."
                                        />
                                    </div>
                                </div>

                                {formData.education_totalDropout > 0 && (() => {
                                    const totalDropout = formData.education_totalDropout || 0;
                                    const allocatedDropout = (formData.education_dropout_sd || 0) +
                                        (formData.education_dropout_smp || 0) +
                                        (formData.education_dropout_sma || 0) +
                                        (formData.education_dropout_university || 0);
                                    const isDropoutSummaryValid = totalDropout === 0 || allocatedDropout === totalDropout;

                                    return (
                                        <div className="space-y-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {[
                                                    { label: 'SD', field: 'education_dropout_sd' },
                                                    { label: 'SMP', field: 'education_dropout_smp' },
                                                    { label: 'SMA', field: 'education_dropout_sma' },
                                                    { label: 'Perguruan Tinggi', field: 'education_dropout_university' },
                                                ].map(({ label, field }) => {
                                                    const currentVal = (formData[field as keyof typeof formData] as number) || 0;
                                                    const otherAllocated = allocatedDropout - currentVal;
                                                    const maxPossible = totalDropout - otherAllocated;

                                                    return (
                                                        <div key={field} className="flex flex-col gap-2">
                                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>
                                                            <CountSelect
                                                                id={field}
                                                                value={currentVal}
                                                                onChange={(val) => setFormData({ ...formData, [field]: val })}
                                                                max={maxPossible}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {!isDropoutSummaryValid && (
                                                <p className="text-red-500 text-xs font-medium flex items-center gap-1.5 mt-2 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg max-w-fit">
                                                    <span className="material-symbols-outlined text-sm shrink-0">warning</span>
                                                    Total distribusi ({allocatedDropout}) belum sesuai dengan Total ({totalDropout})
                                                </p>
                                            )}
                                            {isDropoutSummaryValid && allocatedDropout > 0 && (
                                                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5 mt-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg max-w-fit">
                                                    <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                                                    Distribusi data sudah sesuai.
                                                </p>
                                            )}
                                        </div>
                                    )
                                })()}
                            </div>
                        )}

                        {/* Question 4: Graduated but Unemployed */}
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <FormLabel required>Anak Tamat Sekolah Belum Bekerja:</FormLabel>
                                <div className="max-w-[200px] flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Anak Belum Bekerja</label>
                                    <CountSelect
                                        id="totalUnemployed"
                                        value={formData.education_totalUnemployed || 0}
                                        onChange={(val) => setFormData({
                                            ...formData,
                                            education_totalUnemployed: val,
                                            education_unemployed_sd: 0,
                                            education_unemployed_smp: 0,
                                            education_unemployed_sma: 0,
                                            education_unemployed_university: 0
                                        })}
                                        max={15}
                                        placeholder="Pilih Total..."
                                    />
                                </div>
                            </div>

                            {formData.education_totalUnemployed > 0 && (() => {
                                const totalUnemployed = formData.education_totalUnemployed || 0;
                                const allocatedUnemployed = (formData.education_unemployed_sd || 0) +
                                    (formData.education_unemployed_smp || 0) +
                                    (formData.education_unemployed_sma || 0) +
                                    (formData.education_unemployed_university || 0);
                                const isUnemployedSummaryValid = totalUnemployed === 0 || allocatedUnemployed === totalUnemployed;

                                return (
                                    <div className="space-y-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: 'SD', field: 'education_unemployed_sd' },
                                                { label: 'SMP', field: 'education_unemployed_smp' },
                                                { label: 'SMA', field: 'education_unemployed_sma' },
                                                { label: 'Perguruan Tinggi', field: 'education_unemployed_university' },
                                            ].map(({ label, field }) => {
                                                const currentVal = (formData[field as keyof typeof formData] as number) || 0;
                                                const otherAllocated = allocatedUnemployed - currentVal;
                                                const maxPossible = totalUnemployed - otherAllocated;

                                                return (
                                                    <div key={field} className="flex flex-col gap-2">
                                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>
                                                        <CountSelect
                                                            id={field}
                                                            value={currentVal}
                                                            onChange={(val) => setFormData({ ...formData, [field]: val })}
                                                            max={maxPossible}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {!isUnemployedSummaryValid && (
                                            <p className="text-red-500 text-xs font-medium flex items-center gap-1.5 mt-2 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg max-w-fit">
                                                <span className="material-symbols-outlined text-sm shrink-0">warning</span>
                                                Total distribusi ({allocatedUnemployed}) belum sesuai dengan Total ({totalUnemployed})
                                            </p>
                                        )}
                                        {isUnemployedSummaryValid && allocatedUnemployed > 0 && (
                                            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5 mt-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg max-w-fit">
                                                <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                                                Distribusi data sudah sesuai.
                                            </p>
                                        )}
                                    </div>
                                )
                            })()}
                        </div>

                        {/* Question 5: Working Children */}
                        <div className="space-y-4">
                            <FormLabel required>Jumlah anak sudah bekerja:</FormLabel>
                            <div className="max-w-[200px] flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Orang</label>
                                <CountSelect
                                    id="education_working"
                                    value={formData.education_working || 0}
                                    onChange={(val) => setFormData({ ...formData, education_working: val })}
                                    max={15}
                                    placeholder="Pilih Total..."
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Economics & Assets */}
                {step === 5 && (
                    <div className="w-full">
                        <Step5Economics
                            data={formData as any}
                            update={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                            goToStep={() => { }}
                        />
                    </div>
                )}

                {/* Step 6: Health */}
                {step === 6 && (
                    <div className="w-full">
                        <Step6Health
                            data={formData as any}
                            update={(newData) => setFormData(prev => ({ ...prev, ...newData }))}
                            goToStep={() => { }}
                        />
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button onClick={handleBack} className="px-6 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border-2 border-red-500/20 hover:border-red-500/50 hover:bg-red-50 dark:hover:bg-red-900/20 active:scale-95 transition-all">
                    {step === 1 ? 'Batal' : '← Sebelumnya'}
                </button>
                <button onClick={handleNext} disabled={isLoading}
                    className="px-8 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 transition-all flex items-center gap-2">
                    {isLoading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                    {step === TOTAL_STEPS ? (initialData ? 'Simpan Perubahan' : 'Tambah Jemaat') : 'Lanjutkan →'}
                </button>
            </div>
        </div >
    );
};
