import React, { useEffect } from 'react';
import { type FormData } from '../../types';
import FormRadioGroup from '../ui/FormRadioGroup';
import FormSelect from '../ui/FormSelect';
import SectionHeader from '../ui/SectionHeader';
import { FormTooltip } from '../ui/FormTooltip';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
    goToStep: (step: number, editing?: boolean) => void;
}

const selectClass = "w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-300 appearance-none text-sm";

const CountSelect = ({ id, value, onChange, max = 20, startFrom = 0, placeholder = 'Pilih...' }: {
    id: string; value: number; onChange: (val: number) => void; max?: number; startFrom?: number; placeholder?: string;
}) => (
    <div className="relative">
        <select className={selectClass} id={id} value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)}>
            <option value="0">{placeholder}</option>
            {[...Array(max - startFrom + 1)].map((_, i) => (
                <option key={i + startFrom} value={i + startFrom}>{i + startFrom}</option>
            ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
    </div>
);

const Step4Education: React.FC<StepProps> = ({ data, update }) => {
    const showInSchool = data.education_schoolingStatus === 'Ya';
    const showDropout = data.education_schoolingStatus === 'Ya' || data.education_schoolingStatus === 'Tidak';

    const totalInSchool = data.education_totalInSchool || 0;
    const allocatedInSchool = (data.education_inSchool_tk_paud || 0) +
        (data.education_inSchool_sd || 0) +
        (data.education_inSchool_smp || 0) +
        (data.education_inSchool_sma || 0) +
        (data.education_inSchool_university || 0);

    const isSummaryValid = totalInSchool === 0 || allocatedInSchool === totalInSchool;

    const totalDropout = data.education_totalDropout || 0;
    const allocatedDropout = (data.education_dropout_sd || 0) +
        (data.education_dropout_smp || 0) +
        (data.education_dropout_sma || 0) +
        (data.education_dropout_university || 0);

    const isDropoutSummaryValid = totalDropout === 0 || allocatedDropout === totalDropout;

    const totalUnemployed = data.education_totalUnemployed || 0;
    const allocatedUnemployed = (data.education_unemployed_sd || 0) +
        (data.education_unemployed_smp || 0) +
        (data.education_unemployed_sma || 0) +
        (data.education_unemployed_university || 0);

    const isUnemployedSummaryValid = totalUnemployed === 0 || allocatedUnemployed === totalUnemployed;

    useEffect(() => {
        if (!showInSchool) {
            // Don't auto-clear to prevent data loss on accidental clicks
        }
    }, [showInSchool]);

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">school</span>
                Bidang Pendidikan
            </h3>

            {/* Question 1: Schooling Status */}
            <div className="space-y-4">
                <SectionHeader title="Apakah semua anak usia sekolah (7-18 tahun) di rumah ini sedang bersekolah?" tooltipText="Pilih kondisi pendidikan anak di rumah tersebut." />
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
            {showInSchool && (
                <div className="space-y-6 pl-4 border-l-2 border-primary/20">
                    <div className="space-y-4">
                        <SectionHeader title="Total anak sekolah dan distribusinya:" tooltipText="Isi jumlah total dan jenjang pendidikan anak yang sedang bersekolah." />
                        <div className="max-w-[200px] flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Total Anak Sekolah <FormTooltip text="Jumlah seluruh anak yang masih sekolah." /></label>
                            <CountSelect
                                id="totalInSchool"
                                value={totalInSchool}
                                onChange={(val) => update({
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

                    {totalInSchool > 0 && (
                        <div className="space-y-4 animate-fadeIn">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {[
                                    { label: 'TK/PAUD', field: 'education_inSchool_tk_paud' },
                                    { label: 'SD', field: 'education_inSchool_sd' },
                                    { label: 'SMP', field: 'education_inSchool_smp' },
                                    { label: 'SMA', field: 'education_inSchool_sma' },
                                    { label: 'Perguruan Tinggi', field: 'education_inSchool_university' },
                                ].map(({ label, field }) => {
                                    const currentVal = (data[field as keyof FormData] as number) || 0;
                                    const otherAllocated = allocatedInSchool - currentVal;
                                    const maxPossible = totalInSchool - otherAllocated;

                                    return (
                                        <div key={field} className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">{label} <FormTooltip text={`Jumlah anak yang sedang sekolah di tingkat ${label}.`} /></label>
                                            <CountSelect
                                                id={field}
                                                value={currentVal}
                                                onChange={(val) => update({ [field]: val })}
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
                    )}
                </div>
            )}

            {/* Question 3: Dropouts */}
            {showDropout && (
                <div className="space-y-6">
                    <div className="space-y-4">
                        <SectionHeader title="Anak Putus Sekolah:" tooltipText="Isi jumlah dan jenjang pendidikan terakhir anak yang putus sekolah." />
                        <div className="max-w-[200px] flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Total Anak Putus Sekolah <FormTooltip text="Total anak usia sekolah yang tidak lagi bersekolah." /></label>
                            <CountSelect
                                id="totalDropout"
                                value={totalDropout}
                                onChange={(val) => update({
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

                    {totalDropout > 0 && (
                        <div className="space-y-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'SD', field: 'education_dropout_sd' },
                                    { label: 'SMP', field: 'education_dropout_smp' },
                                    { label: 'SMA', field: 'education_dropout_sma' },
                                    { label: 'Perguruan Tinggi', field: 'education_dropout_university' },
                                ].map(({ label, field }) => {
                                    const currentVal = (data[field as keyof FormData] as number) || 0;
                                    const otherAllocated = allocatedDropout - currentVal;
                                    const maxPossible = totalDropout - otherAllocated;

                                    return (
                                        <div key={field} className="flex flex-col gap-2">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">{label} <FormTooltip text={`Jumlah anak putus sekolah di tingkat ${label}.`} /></label>
                                            <CountSelect
                                                id={field}
                                                value={currentVal}
                                                onChange={(val) => update({ [field]: val })}
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
                    )}
                </div>
            )}

            {/* Question 4: Graduated but Unemployed */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <SectionHeader title="Anak Tamat Sekolah Belum Bekerja:" tooltipText="Isi jumlah dan jenjang pendidikan tamatan anak yang belum bekerja." />
                    <div className="max-w-[200px] flex flex-col gap-2">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Total Anak Belum Bekerja <FormTooltip text="Total anak yang sudah tamat sekolah namun belum mendapat pekerjaan." /></label>
                        <CountSelect
                            id="totalUnemployed"
                            value={totalUnemployed}
                            onChange={(val) => update({
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

                {totalUnemployed > 0 && (
                    <div className="space-y-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'SD', field: 'education_unemployed_sd' },
                                { label: 'SMP', field: 'education_unemployed_smp' },
                                { label: 'SMA', field: 'education_unemployed_sma' },
                                { label: 'Perguruan Tinggi', field: 'education_unemployed_university' },
                            ].map(({ label, field }) => {
                                const currentVal = (data[field as keyof FormData] as number) || 0;
                                const otherAllocated = allocatedUnemployed - currentVal;
                                const maxPossible = totalUnemployed - otherAllocated;

                                return (
                                    <div key={field} className="flex flex-col gap-2">
                                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">{label} <FormTooltip text={`Jumlah anak belum bekerja tamatan ${label}.`} /></label>
                                        <CountSelect
                                            id={field}
                                            value={currentVal}
                                            onChange={(val) => update({ [field]: val })}
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
                )}
            </div>

            {/* Question 5: Working Children */}
            <div className="space-y-4">
                <SectionHeader title="Jumlah anak sudah bekerja:" tooltipText="Total anak di rumah ini yang sudah memiliki pekerjaan dan berpenghasilan." />
                <div className="flex flex-col gap-2 max-w-[200px]">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Total Orang <FormTooltip text="Jumlah anak di KK ini yang sudah bekerja." /></label>
                    <CountSelect
                        id="education_working"
                        value={data.education_working || 0}
                        onChange={(val) => update({ education_working: val })}
                        max={15}
                        placeholder="Pilih Total..."
                    />
                </div>
            </div>

            {/* Question 6: Scholarship */}
            <div className="space-y-4">
                <SectionHeader title="Penerima Beasiswa:" tooltipText="Apakah ada anggota keluarga yang sedang menerima beasiswa pendidikan?" />
                <div className="max-w-md space-y-4">
                    <FormRadioGroup
                        label="Apakah saat ini sedang menerima beasiswa?"
                        id="education_hasScholarship"
                        name="education_hasScholarship"
                        options={['Ya', 'Tidak']}
                        value={data.education_hasScholarship || ''}
                        onChange={(val) => {
                            if (val === 'Tidak') {
                                update({ education_hasScholarship: val as 'Ya' | 'Tidak', education_scholarshipType: '' });
                            } else {
                                update({ education_hasScholarship: val as 'Ya' | 'Tidak' });
                            }
                        }}
                        tooltipText="Pilih Ya jika ada anggota keluarga yang sedang menerima beasiswa."
                    />

                    {data.education_hasScholarship === 'Ya' && (
                        <div className="animate-fadeIn pl-4 border-l-2 border-primary/20">
                            <FormSelect
                                label="Jenis Beasiswa"
                                id="education_scholarshipType"
                                value={data.education_scholarshipType || ''}
                                onChange={(val) => update({ education_scholarshipType: val })}
                                options={['LPDP', 'PIP', 'KIP']}
                                placeholder="Pilih Jenis Beasiswa"
                                required
                                tooltipText="Pilih jenis beasiswa yang diterima."
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step4Education;
