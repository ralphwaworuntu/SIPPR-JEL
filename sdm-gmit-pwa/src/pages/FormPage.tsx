import { useState } from 'react';
import { initialFormData, type FormData } from '../types';
import { useNavigate } from 'react-router-dom';

import Step1Identity from '../components/form/Step1Identity';
import Step2Professional from '../components/form/Step2Professional';
import Step3Commitment from '../components/form/Step3Commitment';
import Step4Consent from '../components/form/Step4Consent';

const FormPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const navigate = useNavigate();

    const updateFormData = (newData: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const nextStep = () => {
        if (step < 4) setStep(prev => prev + 1);
        else {
            // Submit logic here
            alert("Form Submitted!");
            navigate('/');
        }
    };

    const prevStep = () => setStep(prev => prev - 1);

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1Identity data={formData} update={updateFormData} />;
            case 2: return <Step2Professional data={formData} update={updateFormData} />;
            case 3: return <Step3Commitment data={formData} update={updateFormData} />;
            case 4: return <Step4Consent data={formData} update={updateFormData} />;
            default: return <Step1Identity data={formData} update={updateFormData} />;
        }
    };

    const getStepDetails = (stepNum: number) => {
        switch (stepNum) {
            case 1: return { title: "Personal Identity", nextLabel: "Educational Background" };
            case 2: return { title: "Professional Profile", nextLabel: "Commitment" };
            case 3: return { title: "Commitment", nextLabel: "Validation" };
            case 4: return { title: "Validation", nextLabel: "Finish" };
            default: return { title: "", nextLabel: "" };
        }
    };

    const currentDetails = getStepDetails(step);
    const nextDetails = getStepDetails(step + 1);

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen text-[#0d1b12] dark:text-[#f8fcf9]">
            {/* Navigation Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7f3eb] dark:border-[#1d3324] bg-background-light dark:bg-background-dark px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4 text-[#0d1b12] dark:text-[#f8fcf9] cursor-pointer" onClick={() => navigate('/')}>
                    <div className="size-6 text-primary">
                        <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">GMIT Emaus Liliba</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8 items-center hidden md:flex">
                    <div className="flex items-center gap-9">
                        <a className="text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Dashboard</a>
                        <a className="text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Members</a>
                        <a className="text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Reports</a>
                    </div>
                    <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-[#e7f3eb] dark:bg-[#1d3324] text-[#0d1b12] dark:text-[#f8fcf9] gap-2 text-sm font-bold px-3">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAedMiG-uwA0GjKvTLoJcgSD4GVOxeOOlTAbrvvmxcDY1Ucfk0WqkaGX3f_2_oGM2bmi3cwtZjwb5gHVxPY_grOgE69s5FYVVBuO_223ISRFr6d5RW7RftYGsCk3Uq3HTREaYW8MizKGz5IlHJrEwPiLbwZ0icPy37ji4aSv3QjRAJePmZK418oiPs1T0JO1RAg2ge58mQ7q20r3MO2WYhidx5xF6lGGH1dq1rPYhKg3865_aIVvwe5wwR3mcWI1JFx64cWqtqrPSc")' }}></div>
                </div>
            </header>

            <main className="max-w-[1000px] mx-auto px-4 py-10">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-[#0d1b12] dark:text-[#f8fcf9] tracking-light text-[32px] font-bold leading-tight text-center pb-2">
                        Congregation Registration
                    </h1>
                    <p className="text-[#4c9a66] dark:text-[#8bc59e] text-base font-normal leading-normal text-center">
                        Join our professional database. Help us serve you and the community better.
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-3 p-4 mb-8 bg-white dark:bg-[#162a1c] rounded-xl shadow-sm border border-[#e7f3eb] dark:border-[#1d3324]">
                    <div className="flex gap-6 justify-between items-center">
                        <p className="text-[#0d1b12] dark:text-[#f8fcf9] text-base font-bold leading-normal">
                            {step}. {currentDetails.title}
                        </p>
                        <p className="text-[#4c9a66] dark:text-[#8bc59e] text-sm font-medium leading-normal">
                            Step {step} of 4
                        </p>
                    </div>
                    <div className="rounded-full bg-[#cfe7d7] dark:bg-[#1d3324] overflow-hidden">
                        <div className="h-2.5 rounded-full bg-primary transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-primary' : 'text-[#4c9a66]'}`}>Identity</span>
                        <span className={`text-xs font-medium uppercase tracking-wider ${step >= 2 ? 'text-primary font-bold' : 'text-[#4c9a66]'}`}>Education</span>
                        <span className={`text-xs font-medium uppercase tracking-wider ${step >= 3 ? 'text-primary font-bold' : 'text-[#4c9a66]'}`}>Skills</span>
                        <span className={`text-xs font-medium uppercase tracking-wider ${step >= 4 ? 'text-primary font-bold' : 'text-[#4c9a66]'}`}>Review</span>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-[#162a1c] rounded-xl shadow-lg border border-[#e7f3eb] dark:border-[#1d3324] overflow-hidden">
                    <div className="p-8">
                        {renderStep()}
                    </div>

                    {/* Footer / Navigation */}
                    <div className="bg-[#f8fcf9] dark:bg-[#102216] p-8 flex justify-between items-center border-t border-[#e7f3eb] dark:border-[#1d3324]">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`flex items-center gap-2 text-[#4c9a66] font-bold text-sm hover:underline ${step === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className="material-symbols-outlined">arrow_back</span>
                            Previous
                        </button>
                        <div className="flex items-center gap-6">
                            {step < 4 && (
                                <span className="text-[#4c9a66] text-sm font-medium italic hidden md:block">
                                    Next: {nextDetails.title}
                                </span>
                            )}
                            <button
                                onClick={nextStep}
                                className="bg-primary text-[#0d1b12] px-10 h-12 rounded-lg font-bold text-base shadow-[0_4px_14px_0_rgba(19,236,91,0.39)] hover:brightness-105 transition-all flex items-center gap-2"
                            >
                                {step === 4 ? 'Submit Data' : 'Continue'}
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Support Info */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-[#4c9a66] dark:text-[#8bc59e]">
                        Need help? Contact the Church Secretariat at <span className="font-bold">+62 380 123 4567</span> or visit the help desk during office hours.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default FormPage;
