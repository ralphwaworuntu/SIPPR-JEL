import React, { useEffect } from 'react';
import { type FormData } from '../../types';
import FormRadioGroup from '../ui/FormRadioGroup';
import SectionHeader from '../ui/SectionHeader';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
}

const numInputClass = "w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-200 text-base";

const Step4Education: React.FC<StepProps> = ({ data, update }) => {
    const isSchooling = data.education_schoolingStatus === 'Ya';

    useEffect(() => {
        if (!isSchooling) {
            // Don't auto-clear to prevent data loss on accidental clicks
        }
    }, [isSchooling]);

    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">school</span>
                Bidang Pendidikan
            </h3>

            {/* Question 1: Schooling Status */}
            <div className="space-y-4">
                <SectionHeader number={1} title="Apakah semua anak usia sekolah (7-18 tahun) di rumah ini sedang bersekolah?" />
                <FormRadioGroup
                    name="schoolingStatus"
                    options={['Ya', 'Tidak', 'Tidak ada anak usia sekolah']}
                    value={data.education_schoolingStatus}
                    onChange={(val) => update({ education_schoolingStatus: val as any })}
                    columns={3}
                    id="schoolingStatus"
                />
            </div>

            {/* Question 2: Currently in School (Conditional) */}
            {isSchooling && (
                <div className="space-y-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                    <SectionHeader number={2} title="Jumlah anak sekolah:" />
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'TK/PAUD', field: 'education_inSchool_tk_paud' },
                            { label: 'SD', field: 'education_inSchool_sd' },
                            { label: 'SMP', field: 'education_inSchool_smp' },
                            { label: 'SMA', field: 'education_inSchool_sma' },
                            { label: 'Perguruan Tinggi', field: 'education_inSchool_university' },
                        ].map(({ label, field }) => (
                            <div key={field} className="flex flex-col gap-2">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>
                                <input
                                    type="number"
                                    id={field}
                                    min="0"
                                    className={numInputClass}
                                    value={data[field as keyof FormData] as number}
                                    onChange={(e) => update({ [field]: parseInt(e.target.value) || 0 })}
                                    onFocus={(e) => e.target.select()}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Question 3: Dropouts */}
            <div className="space-y-4">
                <SectionHeader number={3} title="Jumlah anak yang putus sekolah:" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'SD', field: 'education_dropout_sd' },
                        { label: 'SMP', field: 'education_dropout_smp' },
                        { label: 'SMA', field: 'education_dropout_sma' },
                        { label: 'Perguruan Tinggi', field: 'education_dropout_university' },
                    ].map(({ label, field }) => (
                        <div key={field} className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>
                            <input
                                type="number"
                                id={field}
                                min="0"
                                className={numInputClass}
                                value={data[field as keyof FormData] as number}
                                onChange={(e) => update({ [field]: parseInt(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Question 4: Graduated but Unemployed */}
            <div className="space-y-4">
                <SectionHeader number={4} title="Jumlah anak tamat sekolah belum bekerja:" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'SD', field: 'education_unemployed_sd' },
                        { label: 'SMP', field: 'education_unemployed_smp' },
                        { label: 'SMA', field: 'education_unemployed_sma' },
                        { label: 'Perguruan Tinggi', field: 'education_unemployed_university' },
                    ].map(({ label, field }) => (
                        <div key={field} className="flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">{label}</label>
                            <input
                                type="number"
                                id={field}
                                min="0"
                                className={numInputClass}
                                value={data[field as keyof FormData] as number}
                                onChange={(e) => update({ [field]: parseInt(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Question 5: Working Children */}
            <div className="space-y-4">
                <SectionHeader number={5} title="Jumlah anak sudah bekerja:" />
                <div className="flex flex-col gap-2 max-w-[200px]">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Orang</label>
                    <input
                        type="number"
                        id="education_working"
                        min="0"
                        className={numInputClass}
                        value={data.education_working}
                        onChange={(e) => update({ education_working: parseInt(e.target.value) || 0 })}
                        onFocus={(e) => e.target.select()}
                    />
                </div>
            </div>

        </div>
    );
};

export default Step4Education;
