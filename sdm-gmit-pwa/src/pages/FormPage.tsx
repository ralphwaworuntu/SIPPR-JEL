import { useState } from 'react';
import { initialFormData, type FormData } from '../types';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { useFormPersist } from '../hooks/useFormPersist';
import { motion } from 'framer-motion';

import Step1Identity from '../components/form/Step1Identity';
import Step2Professional from '../components/form/Step2Professional';
import Step3Commitment from '../components/form/Step3Commitment';
import Step4Consent from '../components/form/Step4Consent';
import SuccessStep from '../components/form/SuccessStep';

const FormPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); // New state for success view
    const navigate = useNavigate();

    // Auto-save hook
    const { isSaving, lastSaved } = useFormPersist('gmit-form-draft', formData, (savedData) => {
        setFormData(savedData);
    });

    const progressPercentage = Math.round(((step - 1) / 4) * 100);

    const updateFormData = (newData: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const handleValidationError = (fieldId: string, message: string) => {
        alert(message);
        setTimeout(() => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
                // Optional: Add a temporary highlight class
                element.classList.add('ring-2', 'ring-red-500');
                setTimeout(() => element.classList.remove('ring-red-500', 'ring-2'), 2000);
            }
        }, 100);
        return false;
    };

    const validateStep = (currentStep: number): boolean => {
        switch (currentStep) {
            case 1:
                if (!formData.fullName) return handleValidationError('fullName', "Mohon isi Nama Lengkap");
                if (!formData.gender) return handleValidationError('gender', "Mohon pilih Jenis Kelamin");
                if (!formData.dateOfBirth) return handleValidationError('dateOfBirth', "Mohon isi Tanggal Lahir");
                if (!formData.phone) return handleValidationError('phone', "Mohon isi Nomor Telepon");
                if (!formData.sector) return handleValidationError('sector', "Mohon pilih Sektor Kategorial");
                if (!formData.lingkungan) return handleValidationError('lingkungan', "Mohon pilih Lingkungan");
                if (!formData.rayon) return handleValidationError('rayon', "Mohon pilih Rayon");
                if (!formData.address) return handleValidationError('address', "Mohon isi Alamat Lengkap");
                return true;
            case 2:
                if (!formData.educationLevel) return handleValidationError('educationLevel', "Mohon pilih Jenjang Pendidikan");
                if (!formData.jobCategory) return handleValidationError('jobCategory', "Mohon pilih Kategori Pekerjaan");
                return true;
            case 3:
                if (!formData.willingnessToServe) return handleValidationError('willingnessToServe', "Mohon pilih Kesediaan Melayani");
                return true;
            case 4:
                if (!formData.agreedToPrivacy) return handleValidationError('agreedToPrivacy', "Anda harus menyetujui Pernyataan Privasi Data");
                if (!formData.dataValidated) return handleValidationError('dataValidated', "Anda harus memvalidasi data Anda");
                return true;
            default:
                return true;
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const nextStep = () => {
        if (validateStep(step)) {
            if (step < 4) {
                setStep(prev => prev + 1);
                scrollToTop();
            } else {
                handleSubmit();
            }
        }
    };

    const handleSubmit = async () => {
        if (!validateStep(4)) return;

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
        setStep(prev => prev - 1);
        scrollToTop();
    };

    const renderStep = () => {
        if (isSuccess) return <SuccessStep />;

        const stepContent = (() => {
            switch (step) {
                case 1: return <Step1Identity data={formData} update={updateFormData} />;
                case 2: return <Step2Professional data={formData} update={updateFormData} />;
                case 3: return <Step3Commitment data={formData} update={updateFormData} />;
                case 4: return <Step4Consent data={formData} update={updateFormData} />;
                default: return <Step1Identity data={formData} update={updateFormData} />;
            }
        })();

        return (
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                {stepContent}
            </motion.div>
        );
    };

    const getStepDetails = (stepNum: number) => {
        switch (stepNum) {
            case 1: return { title: "Identitas Diri", nextLabel: "Latar Belakang Pendidikan" };
            case 2: return { title: "Profil Profesional", nextLabel: "Komitmen" };
            case 3: return { title: "Komitmen Pelayanan", nextLabel: "Validasi" };
            case 4: return { title: "Validasi Data", nextLabel: "Selesai" };
            default: return { title: "", nextLabel: "" };
        }
    };

    const currentDetails = getStepDetails(step);


    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-white transition-colors duration-300 flex flex-col">
            {/* Navigation Bar - Matching Landing Page */}
            <header className="sticky top-0 z-50 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 lg:px-20 py-3 flex items-center justify-between shadow-sm backdrop-blur-md">
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

            <main className="max-w-[1000px] mx-auto px-4 py-12 w-full flex-grow">
                {/* Header Section - Hide on Success */}
                {!isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-10 text-center"
                    >
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 text-primary">
                            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>edit_document</span>
                        </div>
                        <h1 className="text-black dark:text-white text-3xl md:text-4xl font-black tracking-tight mb-3">
                            Pendaftaran Database Jemaat
                        </h1>
                        <p className="text-black/80 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                            Mari bergabung dalam database profesional. Bantu kami melayani Anda dan jemaat dengan lebih baik.
                        </p>
                    </motion.div>
                )}

                {/* Progress Bar - Updated Theme - Hide on Success */}
                {!isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="flex flex-col gap-4 p-6 mb-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700"
                    >
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Langkah {step} dari 4</span>
                                <p className="text-black dark:text-white text-xl font-bold">
                                    {currentDetails.title}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-slate-200 dark:text-slate-700">{progressPercentage}%</span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                            <div className="h-3 rounded-full bg-primary transition-all duration-500 ease-out shadow-lg shadow-primary/30" style={{ width: `${(step / 4) * 100}%` }}></div>
                        </div>
                        <div className="grid grid-cols-4 text-center mt-2">
                            <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${step >= 1 ? 'text-primary' : 'text-black/40 dark:text-slate-600'}`}>Identitas</span>
                            <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${step >= 2 ? 'text-primary' : 'text-black/40 dark:text-slate-600'}`}>Pendidikan</span>
                            <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${step >= 3 ? 'text-primary' : 'text-black/40 dark:text-slate-600'}`}>Keahlian</span>
                            <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${step >= 4 ? 'text-primary' : 'text-black/40 dark:text-slate-600'}`}>Review</span>
                        </div>
                    </motion.div>
                )}

                {/* Form Card - Updated Theme */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden ${isSuccess ? 'max-w-xl mx-auto' : ''}`}
                >
                    <div className="p-8 md:p-10">
                        {renderStep()}
                    </div>

                    {/* Footer / Navigation - Hide on Success */}
                    {!isSuccess && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 md:p-8 flex justify-between items-center border-t border-slate-100 dark:border-slate-700">
                            <button
                                onClick={prevStep}
                                disabled={step === 1}
                                className={`flex items-center gap-2 text-black/60 hover:text-primary font-bold text-sm transition-colors py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                                Sebelumnya
                            </button>

                            <button
                                onClick={nextStep}
                                disabled={isSubmitting}
                                className={`bg-primary hover:bg-primary/90 text-black px-8 h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        {step === 4 ? 'Kirim Data' : 'Lanjutkan'}
                                        <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </motion.div>


            </main>

            <Footer />
        </div>
    );
};

export default FormPage;
