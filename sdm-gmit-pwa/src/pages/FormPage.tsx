import { useState, useCallback } from 'react';
import { initialFormData, type FormData } from '../types';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { useFormPersist } from '../hooks/useFormPersist';
import { motion, AnimatePresence } from 'framer-motion';

import Step1Identity from '../components/form/Step1Identity';
import Step2Professional from '../components/form/Step2Professional';
import Step3Commitment from '../components/form/Step3Commitment';
import Step4Education from '../components/form/Step4Education';
import Step5Economics from '../components/form/Step5Economics';
import Step6Health from '../components/form/Step6Health';
import Step7Consent from '../components/form/Step7Consent';
import SuccessStep from '../components/form/SuccessStep';

const FormPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
    const [isEditing, setIsEditing] = useState(false); // Track if we are editing from Step 7
    const [toast, setToast] = useState<{ message: string; visible: boolean; type: 'error' | 'success' }>({ message: '', visible: false, type: 'error' });

    const navigate = useNavigate();

    // Auto-save hook
    const { isSaving, lastSaved } = useFormPersist('gmit-form-draft', formData, (savedData) => {
        setFormData(prev => ({
            ...prev,
            ...savedData,
            // Ensure array fields are never undefined even if savedData has them missing/null
            economics_assets: savedData.economics_assets || prev.economics_assets || [],
            skills: savedData.skills || prev.skills || [],
            interestAreas: savedData.interestAreas || prev.interestAreas || [],
            contributionTypes: savedData.contributionTypes || prev.contributionTypes || [],
            professionalFamilyMembers: savedData.professionalFamilyMembers || prev.professionalFamilyMembers || []
        }));
    });

    const progressPercentage = Math.round(((step - 1) / 6) * 100);

    const updateFormData = (newData: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const showToast = useCallback((message: string, type: 'error' | 'success' = 'error') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
    }, []);

    const handleValidationError = (fieldId: string, message: string) => {
        showToast(message, 'error');
        setTimeout(() => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
                element.classList.add('ring-2', 'ring-red-500', 'animate-shake');
                setTimeout(() => element.classList.remove('ring-red-500', 'ring-2', 'animate-shake'), 2000);
            }
        }, 100);
        return false;
    };

    const validateStep = (currentStep: number): boolean => {
        switch (currentStep) {
            case 1:
                if (!formData.kkNumber) return handleValidationError('kkNumber', "Mohon isi Nomor Kartu Keluarga");
                if (formData.kkNumber.length !== 16) return handleValidationError('kkNumber', "Nomor KK harus 16 digit");
                if (!formData.nik) return handleValidationError('nik', "Mohon isi NIK");
                if (formData.nik.length !== 16) return handleValidationError('nik', "NIK harus 16 digit");
                if (!formData.fullName) return handleValidationError('fullName', "Mohon isi Nama Lengkap");
                if (!formData.gender) return handleValidationError('gender', "Mohon pilih Jenis Kelamin");
                if (!formData.dateOfBirth) return handleValidationError('dateOfBirth', "Mohon isi Tanggal Lahir");
                if (!formData.phone) return handleValidationError('phone', "Mohon isi Nomor Telepon");
                if (!formData.lingkungan) return handleValidationError('lingkungan', "Mohon pilih Lingkungan");
                if (!formData.rayon) return handleValidationError('rayon', "Mohon pilih Rayon");
                if (!formData.address) return handleValidationError('address', "Mohon isi Alamat Lengkap");
                return true;
            case 2:

                if (!formData.familyMembers) return handleValidationError('familyMembers', "Mohon isi Total Anggota Keluarga");
                if (!formData.familyMembersMale) return handleValidationError('familyMembersMale', "Mohon isi Laki-laki");
                if (!formData.familyMembersFemale) return handleValidationError('familyMembersFemale', "Mohon isi Perempuan");

                const total = parseInt(formData.familyMembers || '0');
                const male = parseInt(formData.familyMembersMale || '0');
                const female = parseInt(formData.familyMembersFemale || '0');

                if (male + female !== total) {
                    return handleValidationError('familyMembers', "Total Laki-laki & Perempuan tidak sesuai dengan Jumlah Anggota Keluarga");
                }

                if (!formData.familyMembersOutside) return handleValidationError('familyMembersOutside', "Mohon isi Anggota di Luar Kota Kupang");

                if (!formData.familyMembersSidi) return handleValidationError('familyMembersSidi', "Mohon isi Total Anggota Sidi");
                if (!formData.familyMembersSidiMale) return handleValidationError('familyMembersSidiMale', "Mohon isi Anggota Sidi Laki-laki");
                if (!formData.familyMembersSidiFemale) return handleValidationError('familyMembersSidiFemale', "Mohon isi Anggota Sidi Perempuan");

                const totalSidi = parseInt(formData.familyMembersSidi || '0');
                const maleSidi = parseInt(formData.familyMembersSidiMale || '0');
                const femaleSidi = parseInt(formData.familyMembersSidiFemale || '0');

                if (maleSidi + femaleSidi !== totalSidi) {
                    return handleValidationError('familyMembersSidi', "Total Sidi Laki-laki & Perempuan tidak sesuai dengan Total Sidi");
                }
                if (!formData.familyMembersNonBaptized) return handleValidationError('familyMembersNonBaptized', "Mohon isi Anggota belum di Baptis");
                if (!formData.familyMembersNonSidi) return handleValidationError('familyMembersNonSidi', "Mohon isi Anggota belum Sidi");

                // Diakonia validation
                if (!formData.diakonia_recipient) return handleValidationError('diakonia_recipient', "Mohon pilih apakah penerima Diakonia dari GMIT JEL");
                if (formData.diakonia_recipient === 'Ya') {
                    if (!formData.diakonia_year) return handleValidationError('diakonia_year', "Mohon pilih Tahun Penerimaan Diakonia");
                    if (!formData.diakonia_type.trim()) return handleValidationError('diakonia_type', "Mohon isi Jenis Diakonia yang Diterima");
                }

                return true;
            case 3:
                if (formData.professionalFamilyMembers && formData.professionalFamilyMembers.length > 0) {
                    const filledMembers = formData.professionalFamilyMembers.filter(m => m.name.trim() !== '' || m.workplace !== '' || m.position !== '');
                    for (let i = 0; i < filledMembers.length; i++) {
                        const member = filledMembers[i];
                        if (!member.name) return handleValidationError(`willingnessToServe`, `Mohon isi Nama Anggota Keluarga ke-${i + 1}`);
                        if (!member.workplace) return handleValidationError(`willingnessToServe`, `Mohon isi Tempat Kerja Anggota ke-${i + 1}`);
                        if (!member.position) return handleValidationError(`willingnessToServe`, `Mohon isi Jabatan Anggota ke-${i + 1}`);
                        if (!member.yearsExperience) return handleValidationError(`willingnessToServe`, `Mohon pilih Lama Bekerja Anggota ke-${i + 1}`);

                        if (!member.hasProfessionalSkill) return handleValidationError(`willingnessToServe`, `Mohon pilih apakah Anggota ke-${i + 1} memiliki Keahlian Profesional`);

                        if (member.hasProfessionalSkill === 'Ya') {
                            if (!member.skillType) return handleValidationError(`willingnessToServe`, `Mohon pilih Jenis Keahlian Anggota ke-${i + 1}`);
                            if (!member.skillLevel) return handleValidationError(`willingnessToServe`, `Mohon pilih Tingkat Keahlian Anggota ke-${i + 1}`);
                        }

                        if (!member.churchServiceInterest) return handleValidationError(`willingnessToServe`, `Mohon pilih Kesediaan Terlibat Pelayanan Anggota ke-${i + 1}`);
                        if (!member.serviceInterestArea) return handleValidationError(`willingnessToServe`, `Mohon pilih Bidang Minat Pelayanan Anggota ke-${i + 1}`);
                        if (!member.contributionForm || member.contributionForm.length === 0) return handleValidationError(`willingnessToServe`, `Mohon pilih Bentuk Kontribusi Anggota ke-${i + 1}`);
                        if (!member.communityConsent) return handleValidationError(`willingnessToServe`, `Mohon centang Persetujuan Komunitas Anggota ke-${i + 1}`);
                    }
                }
                return true;
            case 4:
                // 1. Wajib isi status sekolah
                if (!formData.education_schoolingStatus) return handleValidationError('schoolingStatus', "Mohon pilih status sekolah anak");

                // 2. Jika pilih "Ya", validasi jumlah anak sekolah
                if (formData.education_schoolingStatus === 'Ya') {
                    const totalInSchool =
                        (formData.education_inSchool_tk_paud || 0) +
                        (formData.education_inSchool_sd || 0) +
                        (formData.education_inSchool_smp || 0) +
                        (formData.education_inSchool_sma || 0);

                    // Validasi: Minimal ada 1 anak sekolah jika jawab Ya
                    if (totalInSchool === 0) {
                        return handleValidationError('education_inSchool_tk_paud', "Anda memilih 'Ya', mohon isi jumlah anak yang bersekolah (minimal 1)");
                    }

                    // Validasi: Tidak boleh negatif
                    if (
                        (formData.education_inSchool_tk_paud < 0) ||
                        (formData.education_inSchool_sd < 0) ||
                        (formData.education_inSchool_smp < 0) ||
                        (formData.education_inSchool_sma < 0)
                    ) {
                        return handleValidationError('education_inSchool_tk_paud', "Jumlah anak tidak boleh negatif");
                    }
                }

                // 3. Validasi input lainnya tidak boleh negatif
                if (
                    (formData.education_dropout_tk_paud < 0) ||
                    (formData.education_dropout_sd < 0) ||
                    (formData.education_dropout_smp < 0) ||
                    (formData.education_dropout_sma < 0) ||
                    (formData.education_unemployed_sd < 0) ||
                    (formData.education_unemployed_smp < 0) ||
                    (formData.education_unemployed_sma < 0) ||
                    (formData.education_working < 0)
                ) {
                    return handleValidationError('education_dropout_tk_paud', "Jumlah anak tidak boleh negatif");
                }

                return true;
            case 5:
                if (!formData.economics_headOccupation) return handleValidationError('headOccupation', "Mohon pilih Pekerjaan Utama Kepala Keluarga");
                if (formData.economics_headOccupation === 'Lainnya' && !formData.economics_headOccupationOther) {
                    return handleValidationError('headOccupationOther', "Mohon lengkapi Pekerjaan Utama Kepala Keluarga yang dipilih Lainnya");
                }

                if (formData.economics_spouseOccupation === 'Lainnya' && !formData.economics_spouseOccupationOther) {
                    return handleValidationError('spouseOccupationOther', "Mohon lengkapi Pekerjaan Utama Istri yang dipilih Lainnya");
                }

                if (!formData.economics_incomeRange) return handleValidationError('incomeRange', "Mohon pilih Range Pendapatan Rumah Tangga");

                // Validate detailed income range if >= 5jt
                if (formData.economics_incomeRange === '≥ Rp 5.000.000' && !formData.economics_incomeRangeDetailed) {
                    return handleValidationError('incomeRange', "Mohon pilih Detail Range Pendapatan");
                }

                // Validate Expenses
                if (
                    (formData.economics_expense_food < 0) ||
                    (formData.economics_expense_utilities < 0) ||
                    (formData.economics_expense_education < 0) ||
                    (formData.economics_expense_other < 0)
                ) {
                    return handleValidationError('economics_expense_food', "Pengeluaran tidak boleh negatif");
                }

                // Validate Business Ownership
                if (!formData.economics_hasBusiness) return handleValidationError('hasBusiness', "Mohon pilih status kepemilikan usaha");

                if (formData.economics_hasBusiness === 'Ya') {
                    if (!formData.economics_businessName) return handleValidationError('businessName', "Mohon isi Nama/Jenis Usaha");

                    if (!formData.economics_businessType) return handleValidationError('businessType', "Mohon pilih Jenis Usaha");
                    if (formData.economics_businessType === 'Lainnya' && !formData.economics_businessTypeOther) return handleValidationError('businessType', "Mohon lengkapi Jenis Usaha lainnya");

                    if (!formData.economics_businessDuration) return handleValidationError('businessDuration', "Mohon pilih Lama Usaha");
                    if (formData.economics_businessDuration === '> 5 tahun' && !formData.economics_businessDurationYears) return handleValidationError('businessDuration', "Mohon isi lama usaha dalam tahun");

                    if (!formData.economics_businessStatus) return handleValidationError('businessStatus', "Mohon pilih Status Usaha");
                    if (formData.economics_businessStatus === 'Lainnya' && !formData.economics_businessStatusOther) return handleValidationError('businessStatus', "Mohon lengkapi Status Usaha lainnya");

                    if (!formData.economics_businessLocation) return handleValidationError('businessLocation', "Mohon pilih Lokasi Usaha");
                    if (formData.economics_businessLocation === 'Lainnya' && !formData.economics_businessLocationOther) return handleValidationError('businessLocation', "Mohon lengkapi Lokasi Usaha lainnya");

                    if (!formData.economics_businessEmployeeCount) return handleValidationError('businessEmployeeCount', "Mohon pilih Jumlah Tenaga Kerja");

                    if (formData.economics_businessCapital < 0) return handleValidationError('businessCapital', "Mohon isi Modal Awal Usaha (minimal 0)");

                    if (!formData.economics_businessCapitalSource) return handleValidationError('businessCapitalSource', "Mohon pilih Sumber Modal");
                    if (formData.economics_businessCapitalSource === 'Lainnya' && !formData.economics_businessCapitalSourceOther) return handleValidationError('businessCapitalSource', "Mohon lengkapi Sumber Modal lainnya");

                    if (!formData.economics_businessPermit || formData.economics_businessPermit.length === 0) return handleValidationError('businessPermit', "Mohon pilih Izin Usaha");
                    if (formData.economics_businessPermit.includes('Lainnya') && !formData.economics_businessPermitOther) return handleValidationError('businessPermit', "Mohon lengkapi Izin Usaha lainnya");

                    if (!formData.economics_businessMarketing || formData.economics_businessMarketing.length === 0) return handleValidationError('businessMarketing', "Mohon pilih Cara Pemasaran Utama");
                    if (formData.economics_businessMarketing.includes('Lainnya') && !formData.economics_businessMarketingOther) return handleValidationError('businessMarketing', "Mohon lengkapi Cara Pemasaran lainnya");

                    if (!formData.economics_businessMarketArea) return handleValidationError('businessMarketArea', "Mohon pilih Wilayah Pemasaran");

                    if (!formData.economics_businessIssues || formData.economics_businessIssues.length === 0) return handleValidationError('businessIssues', "Mohon pilih Tantangan Utama");
                    if (formData.economics_businessIssues.includes('Lainnya') && !formData.economics_businessIssuesOther) return handleValidationError('businessIssues', "Mohon lengkapi Tantangan Utama lainnya");

                    if (!formData.economics_businessNeeds || formData.economics_businessNeeds.length === 0) return handleValidationError('businessNeeds', "Mohon pilih Dukungan yang Dibutuhkan");
                    if (formData.economics_businessNeeds.includes('Lainnya') && !formData.economics_businessNeedsOther) return handleValidationError('businessNeeds', "Mohon lengkapi Dukungan lainnya");

                    if (!formData.economics_businessSharing) return handleValidationError('businessSharing', "Mohon pilih Kesediaan Berbagi Ilmu");

                    if (!formData.economics_businessTraining || formData.economics_businessTraining.length === 0) return handleValidationError('businessTraining', "Mohon pilih Minat Pelatihan");
                    if (formData.economics_businessTraining.includes('Lainnya') && !formData.economics_businessTrainingOther) return handleValidationError('businessTraining', "Mohon lengkapi Minat Pelatihan lainnya");
                }

                // Validate Home & Assets
                if (!formData.economics_houseStatus) return handleValidationError('houseStatus', "Mohon pilih Status Rumah");
                if (!formData.economics_houseType) return handleValidationError('houseType', "Mohon pilih Tipe Rumah");

                if (formData.economics_houseType === 'Permanen' && !formData.economics_houseIMB) return handleValidationError('houseIMB', "Mohon pilih Status IMB");

                if (!formData.economics_assets || formData.economics_assets.length === 0) return handleValidationError('assets', "Mohon pilih Kepemilikan Aset (min. 'Tidak ada')");

                // Validate asset quantities if "Tidak ada" is NOT selected
                if (!formData.economics_assets.includes('Tidak ada')) {
                    const assetMap: { [key: string]: string } = {
                        'Motor': 'economics_asset_motor_qty',
                        'Mobil': 'economics_asset_mobil_qty',
                        'Kulkas': 'economics_asset_kulkas_qty',
                        'Laptop/Komputer': 'economics_asset_laptop_qty',
                        'Televisi': 'economics_asset_tv_qty',
                        'Internet/Indihome': 'economics_asset_internet_qty',
                        'Lahan Pertanian': 'economics_asset_lahan_qty'
                    };

                    for (const assetLabel of formData.economics_assets) {
                        const qtyField = assetMap[assetLabel];
                        if (qtyField) {
                            const qty = formData[qtyField as keyof typeof formData] as number;
                            if (!qty || qty <= 0) return handleValidationError('assets', `Mohon isi jumlah untuk aset: ${assetLabel}`);
                        }
                    }
                }

                if (!formData.economics_landStatus) return handleValidationError('landStatus', "Mohon pilih Status Kepemilikan Tanah");
                if (!formData.economics_waterSource) return handleValidationError('waterSource', "Mohon pilih Sumber Air Minum Utama");

                if (formData.economics_electricity_capacities.length === 0) {
                    return handleValidationError('electricity_capacities', "Mohon pilih minimal satu Daya Listrik Terpasang");
                }

                // Check if all selected capacities have a quantity > 0
                for (const cap of formData.economics_electricity_capacities) {
                    const key = `economics_electricity_${cap.replace(/\D/g, '')}_qty` as keyof FormData;
                    if (!(formData[key] as number > 0)) {
                        return handleValidationError('electricity_capacities', `Mohon isi jumlah untuk daya ${cap}`);
                    }
                }

                if (formData.economics_electricity_total_cost === undefined || formData.economics_electricity_total_cost < 0) {
                    return handleValidationError('electricity_capacities', "Mohon isi Total Biaya Listrik Bulanan (minimal 0)");
                }

                return true;
            case 6:
                if (!formData.health_sick30Days) return handleValidationError('health_sick30Days', "Mohon pilih status Sakit 30 Hari Terakhir");
                if (!formData.health_chronicSick) return handleValidationError('health_chronicSick', "Mohon pilih status Sakit Menahun");

                if (formData.health_chronicSick === 'Ya') {
                    if (!formData.health_chronicDisease || formData.health_chronicDisease.length === 0) return handleValidationError('health_chronicDisease', "Mohon pilih Jenis Penyakit Menahun");
                    if (formData.health_chronicDisease.includes('Lainnya') && !formData.health_chronicDiseaseOther) return handleValidationError('health_chronicDisease', "Mohon lengkapi Jenis Penyakit Menahun lainnya");
                }

                if (!formData.health_hasBPJS) return handleValidationError('health_hasBPJS', "Mohon pilih Status BPJS Kesehatan");
                if (!formData.health_regularTreatment) return handleValidationError('health_regularTreatment', "Mohon pilih Status Pengobatan Teratur");
                if (!formData.health_hasBPJSKetenagakerjaan) return handleValidationError('health_hasBPJSKetenagakerjaan', "Mohon pilih Status BPJS Ketenagakerjaan");
                if (!formData.health_socialAssistance) return handleValidationError('health_socialAssistance', "Mohon pilih Jenis Bantuan Sosial");

                if (!formData.health_hasDisability) return handleValidationError('health_hasDisability', "Mohon pilih Status Penyandang Disabilitas");

                if (formData.health_hasDisability === 'Ya') {
                    const hasPhysical = (formData.health_disabilityPhysical?.length ?? 0) > 0;
                    const hasIntellectual = (formData.health_disabilityIntellectual?.length ?? 0) > 0;
                    const hasMental = (formData.health_disabilityMental?.length ?? 0) > 0;
                    const hasSensory = (formData.health_disabilitySensory?.length ?? 0) > 0;

                    const totalKategoriDipilih = (hasPhysical ? 1 : 0) + (hasIntellectual ? 1 : 0) + (hasMental ? 1 : 0) + (hasSensory ? 1 : 0);

                    // 1. Validasi minimal ada data yang diisi
                    if (totalKategoriDipilih === 0) {
                        return handleValidationError('health_hasDisability', "Mohon lengkapi detail kategori disabilitas yang dipilih.");
                    }

                    // 2. Jika Ganda dicentang, minimal harus 2 kategori
                    if (formData.health_disabilityDouble && totalKategoriDipilih < 2) {
                        return handleValidationError('health_hasDisability', "Anda mencentang Disabilitas Ganda, mohon pilih minimal dua kategori disabilitas.");
                    }

                    // 3. Validasi isian "Lainnya" hanya pada kategori yang memang dipilih
                    if (hasPhysical && formData.health_disabilityPhysical.includes('Lainnya') && !formData.health_disabilityPhysicalOther) {
                        return handleValidationError('health_disabilityPhysical', "Mohon lengkapi keterangan Disabilitas Fisik lainnya");
                    }
                    if (hasIntellectual && formData.health_disabilityIntellectual.includes('Lainnya') && !formData.health_disabilityIntellectualOther) {
                        return handleValidationError('health_disabilityIntellectual', "Mohon lengkapi keterangan Disabilitas Intelektual lainnya");
                    }
                    if (hasMental && formData.health_disabilityMental.includes('Lainnya') && !formData.health_disabilityMentalOther) {
                        return handleValidationError('health_disabilityMental', "Mohon lengkapi keterangan Disabilitas Mental lainnya");
                    }
                    if (hasSensory && formData.health_disabilitySensory.includes('Lainnya') && !formData.health_disabilitySensoryOther) {
                        return handleValidationError('health_disabilitySensory', "Mohon lengkapi keterangan Disabilitas Sensorik lainnya");
                    }
                }

                return true;
            case 7:
                if (!formData.agreedToPrivacy) return handleValidationError('agreedToPrivacy', "Anda harus menyetujui Pernyataan Privasi Data");
                if (!formData.dataValidated) return handleValidationError('dataValidated', "Anda harus memvalidasi data Anda");
                return true;
            default:
                return true;
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    };

    const getStepCompletionMessage = (completedStep: number): string => {
        switch (completedStep) {
            case 1: return "✅ Data identitas lengkap! Lanjut ke data keluarga...";
            case 2: return "👨‍👩‍👧‍👦 Info keluarga tersimpan! Sekarang profesi...";
            case 3: return "💼 Data profesi berhasil! Sudah setengah jalan 💪";
            case 4: return "🎓 Pendidikan tercatat! Tinggal 2 langkah lagi...";
            case 5: return "💰 Ekonomi selesai! Langkah terakhir sebelum kirim!";
            case 6: return "🏥 Kesehatan lengkap! Periksa & kirim data Anda ✅";
            default: return "";
        }
    };

    const nextStep = () => {
        if (validateStep(step)) {
            // Proceed to next step if valid
            if (step < 7) {
                showToast(getStepCompletionMessage(step), 'success');

                setDirection(1);

                if (isEditing) {
                    setStep(7);
                    setIsEditing(false);
                    showToast("Kembali ke Validasi Data", 'success');
                } else {
                    setStep(prev => prev + 1);
                }

                scrollToTop();
            } else {
                handleSubmit();
            }
        }
    };

    const goToStep = (targetStep: number, editing: boolean = false) => {
        setDirection(targetStep > step ? 1 : -1);
        setIsEditing(editing);
        setStep(targetStep);
        scrollToTop();
    };



    const handleSubmit = async () => {
        if (!validateStep(7)) return;

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/congregants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Gagal menyimpan data');
            }

            const result = await response.json();
            console.log("Success:", result);

            setIsSubmitting(false);
            // Success State Transition
            setIsSuccess(true);
            scrollToTop();

            // Clear draft
            localStorage.removeItem('gmit-form-draft');
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
            setIsSubmitting(false);
        }
    };

    const prevStep = () => {
        setDirection(-1);
        setStep(prev => prev - 1);
        scrollToTop();
    };

    const renderStep = () => {
        if (isSuccess) return <SuccessStep />;

        const stepContent = (() => {
            switch (step) {
                case 1: return <Step1Identity data={formData} update={updateFormData} goToStep={goToStep} />;
                case 2: return <Step2Professional data={formData} update={updateFormData} goToStep={goToStep} />;
                case 3: return <Step3Commitment data={formData} update={updateFormData} goToStep={goToStep} />;
                case 4: return <Step4Education data={formData} update={updateFormData} goToStep={goToStep} />;
                case 5: return <Step5Economics data={formData} update={updateFormData} goToStep={goToStep} />;
                case 6: return <Step6Health data={formData} update={updateFormData} goToStep={goToStep} />;
                case 7: return <Step7Consent data={formData} update={updateFormData} goToStep={goToStep} />;
                default: return <Step1Identity data={formData} update={updateFormData} goToStep={goToStep} />;
            }
        })();

        const variants = {
            enter: (direction: number) => ({
                opacity: 0,
                x: direction > 0 ? 30 : -30,
            }),
            center: {
                opacity: 1,
                x: 0,
            },
            exit: (direction: number) => ({
                opacity: 0,
                x: direction > 0 ? -30 : 30,
            })
        };

        return (
            <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                    key={step}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                    {stepContent}
                </motion.div>
            </AnimatePresence>
        );
    };

    const stepConfig = [
        { key: 1, title: "DATA UMUM", icon: "person", label: "Identitas" },
        { key: 2, title: "INFORMASI KELUARGA", icon: "groups", label: "Keluarga" },
        { key: 3, title: "PROFESI & PELAYANAN", icon: "volunteer_activism", label: "Pelayanan" },
        { key: 4, title: "PENDIDIKAN", icon: "school", label: "Pendidikan" },
        { key: 5, title: "EKONOMI & ASET", icon: "paid", label: "Ekonomi" },
        { key: 6, title: "KESEHATAN", icon: "medical_services", label: "Kesehatan" },
        { key: 7, title: "VALIDASI DATA", icon: "verified_user", label: "Validasi" },
    ];

    const getEncouragement = (stepNum: number) => {
        switch (stepNum) {
            case 1: return "Hanya 7 langkah singkat — dimulai dari data dasar 🙏";
            case 2: return "Langkah 2 dari 7 — informasi anggota keluarga.";
            case 3: return "Langkah 3 dari 7 — data profesi & pelayanan.";
            case 4: return "Sudah 4 dari 7 langkah — luar biasa! 💪";
            case 5: return "Langkah 5 dari 7 — data ekonomi keluarga 💰";
            case 6: return "Langkah 6 dari 7 — informasi kesehatan keluarga.";
            case 7: return "Terakhir! Periksa dengan teliti & kirim ✅";
            default: return "";
        }
    };

    const currentDetails = stepConfig[step - 1];


    return (
        <div className="font-display bg-slate-50 relative min-h-screen text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(15,23,42,1))] pointer-events-none" />
            <div className="relative z-10 flex flex-col flex-grow">
                {/* Navigation Bar - Matching Landing Page */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 lg:px-20 py-3 flex items-center justify-between shadow-sm backdrop-blur-xl">
                    <div
                        onClick={() => navigate('/')}
                        className="flex items-center gap-4 cursor-pointer group"
                    >
                        <span className="text-slate-900 dark:text-white font-bold text-xl tracking-tight transition-transform duration-300 group-hover:scale-105 group-hover:text-primary">
                            GMIT Emaus Liliba
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Auto-save Indicator */}
                        <div className="hidden md:flex flex-col items-end mr-2 group/status cursor-help">
                            <span className={`text-xs font-medium transition-colors duration-300 ${isSaving ? 'text-primary' : 'text-slate-400 dark:text-slate-500 group-hover/status:text-primary/70'}`}>
                                {isSaving ? 'Menyimpan...' : 'Draf Tersimpan'}
                            </span>
                            {!isSaving && lastSaved && (
                                <span className="text-[10px] text-slate-400 dark:text-slate-600 transition-opacity duration-300 group-hover/status:opacity-100 opacity-60">
                                    {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => navigate('/')}
                            className="hidden md:flex items-center text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-all hover:underline hover:underline-offset-4"
                        >
                            Kembali ke Beranda
                        </button>

                    </div>
                </header>

                <main className="max-w-[1000px] mx-auto px-4 py-8 md:py-10 w-full flex-grow">
                    {/* Header Section - Hide on Success */}
                    {!isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="mb-4 md:mb-6 text-center max-w-4xl mx-auto"
                        >
                            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
                                <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>edit_document</span>
                            </div>
                            <h1 className="text-black dark:text-white text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-3">
                                Pemutakhiran Database <br />Jemaat GMIT Emaus Liliba 2026
                            </h1>
                            <p className="text-black/80 dark:text-slate-400 text-base md:text-lg font-medium max-w-2xl mx-auto">
                                Hanya untuk kepentingan Statistik Jemaat GMIT Emaus Liliba
                            </p>
                        </motion.div>
                    )}

                    {/* Toast Notification */}
                    <AnimatePresence>
                        {toast.visible && (
                            <motion.div
                                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-lg"
                            >
                                <div
                                    onClick={() => setToast(prev => ({ ...prev, visible: false }))}
                                    className={toast.type === 'error'
                                        ? "bg-red-50 dark:bg-red-950/90 border border-red-200 dark:border-red-800 rounded-2xl px-5 py-4 shadow-2xl shadow-red-500/20 flex items-start gap-3 cursor-pointer backdrop-blur-md"
                                        : "bg-emerald-50 dark:bg-emerald-950/90 border border-emerald-200 dark:border-emerald-800 rounded-2xl px-5 py-4 shadow-2xl shadow-emerald-500/20 flex items-start gap-3 cursor-pointer backdrop-blur-md"
                                    }
                                >
                                    <span className={`material-symbols-outlined text-xl mt-0.5 shrink-0 ${toast.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {toast.type === 'error' ? 'error' : 'check_circle'}
                                    </span>
                                    <div>
                                        <p className={`font-bold text-sm ${toast.type === 'error' ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                                            {toast.type === 'error' ? 'Data Belum Lengkap' : 'Berhasil'}
                                        </p>
                                        <p className={`text-sm mt-0.5 items-center flex gap-1 font-medium ${toast.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                            {toast.message}
                                        </p>
                                    </div>
                                    <span className={`material-symbols-outlined text-base ml-auto shrink-0 mt-0.5 ${toast.type === 'error' ? 'text-red-300 dark:text-red-700' : 'text-emerald-300 dark:text-emerald-700'}`}>
                                        close
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>



                    {/* Progress Bar - Enhanced Step Dots - Hide on Success */}
                    {!isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex flex-col gap-5 p-6 mb-5 md:mb-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 max-w-4xl mx-auto"
                        >
                            {/* Title Row */}
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Langkah {step} dari 7</span>
                                    <p className="text-black dark:text-white text-lg md:text-xl font-bold">
                                        {currentDetails.title}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden md:block">{getEncouragement(step)}</p>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <span className="text-2xl font-black text-primary/20 dark:text-primary/10 leading-none">{progressPercentage}%</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                <motion.div
                                    className="h-2.5 rounded-full bg-gradient-to-r from-primary to-emerald-400 shadow-sm"
                                    initial={false}
                                    animate={{ width: `${(step / 7) * 100}%` }}
                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                />
                            </div>

                            {/* Step Dots */}
                            <div className="flex items-center justify-between relative">
                                {stepConfig.map((s, idx) => {
                                    const isCompleted = step > s.key;
                                    const isCurrent = step === s.key;
                                    return (
                                        <div key={s.key} className="flex flex-col items-center relative z-10" style={{ width: `${100 / 7}%` }}>
                                            {/* Dot */}
                                            <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2 ${isCompleted
                                                ? 'bg-primary border-primary text-white shadow-md shadow-primary/30'
                                                : isCurrent
                                                    ? 'bg-white dark:bg-slate-900 border-primary text-primary shadow-lg shadow-primary/20 ring-4 ring-primary/10 relative z-10'
                                                    : 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500'
                                                }`}>
                                                {isCurrent && (
                                                    <span className="absolute inset-0 rounded-full border border-primary/50 animate-ping opacity-75" />
                                                )}
                                                {isCompleted ? (
                                                    <span className="material-symbols-outlined text-sm">check</span>
                                                ) : (
                                                    <span className="material-symbols-outlined text-[10px] md:text-base">{s.icon}</span>
                                                )}
                                            </div>
                                            {/* Label */}
                                            <span className={`hidden md:block text-[9px] md:text-[11px] font-bold uppercase tracking-wider mt-1.5 text-center transition-colors duration-300 ${isCompleted ? 'text-primary' : isCurrent ? 'text-primary' : 'text-slate-400 dark:text-slate-600'
                                                }`}>
                                                {s.label}
                                            </span>
                                            {/* Connector line (not on last item) */}
                                            {idx < stepConfig.length - 1 && (
                                                <div className={`hidden md:block absolute top-[18px] left-[55%] w-full h-[3px] transition-colors duration-500 ${step > s.key ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'
                                                    }`} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Form Card - Updated Theme */}
                    <div className="w-full max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={`bg-white dark:bg-slate-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-black/20 border border-slate-200 dark:border-slate-700 overflow-hidden relative ${isSuccess ? 'max-w-xl mx-auto' : ''}`}
                        >
                            <div className="p-6 md:p-10">
                                {renderStep()}
                            </div>

                            {/* Footer / Navigation - Default on desktop, Sticky at bottom on mobile */}
                            {!isSuccess && (
                                <div className="bg-slate-50/50 dark:bg-slate-900/50 p-4 md:p-8 flex justify-between items-center border-t border-slate-100 dark:border-slate-800">
                                    <button
                                        onClick={prevStep}
                                        disabled={step === 1}
                                        className={`flex items-center gap-2 font-bold text-sm transition-all py-2.5 px-5 md:px-6 h-12 rounded-xl shadow-lg focus:ring-4 hover:-translate-y-0.5 active:translate-y-0 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/40 focus:ring-red-500/30'}`}
                                    >
                                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                                        <span className="hidden sm:inline">Sebelumnya</span>
                                    </button>

                                    <button
                                        onClick={nextStep}
                                        disabled={isSubmitting}
                                        className={`group px-6 md:px-8 h-12 rounded-xl font-bold text-sm md:text-base shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 focus:ring-4 ${step === 7
                                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/40 focus:ring-emerald-500/30'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/40 focus:ring-indigo-500/30'
                                            } ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                {step === 7 ? 'Kirim Data' : 'Lanjutkan'}
                                                <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>


                </main>

                <Footer />
            </div>
        </div>
    );
};

export default FormPage;
