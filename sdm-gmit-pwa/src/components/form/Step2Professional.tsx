import React, { useEffect } from 'react';
import { type FormData } from '../../types';
import SectionHeader from '../ui/SectionHeader';
import FormRadioGroup from '../ui/FormRadioGroup';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
    goToStep: (step: number, editing?: boolean) => void;
}

const selectClass = "w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-300 appearance-none text-sm";

const textareaClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-300 text-sm resize-none min-h-[100px]";

const CountSelect = ({ id, value, onChange, max = 20, startFrom = 0, placeholder = 'Pilih...' }: {
    id: string; value: string; onChange: (val: string) => void; max?: number; startFrom?: number; placeholder?: string;
}) => (
    <div className="relative">
        <select className={selectClass} id={id} value={value} onChange={(e) => onChange(e.target.value)}>
            <option value="">{placeholder}</option>
            {[...Array(max - startFrom + 1)].map((_, i) => (
                <option key={i + startFrom} value={String(i + startFrom)}>{i + startFrom}</option>
            ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
    </div>
);

// Generate year list from current year down to 2000
const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => String(currentYear - i));

const Step2Professional: React.FC<StepProps> = ({ data, update }) => {
    const totalMembers = parseInt(data.familyMembers || '0');
    const maleMembers = parseInt(data.familyMembersMale || '0');
    const femaleMembers = parseInt(data.familyMembersFemale || '0');

    const isFieldsFilled = data.familyMembers && data.familyMembersMale && data.familyMembersFemale;
    const isFamilyCountValid = !isFieldsFilled || (maleMembers + femaleMembers === totalMembers);

    const totalSidi = parseInt(data.familyMembersSidi || '0');
    const isSidiFieldsFilled = data.familyMembersSidi && data.familyMembersSidiMale && data.familyMembersSidiFemale;
    const isSidiCountValid = !isSidiFieldsFilled || (parseInt(data.familyMembersSidiMale) + parseInt(data.familyMembersSidiFemale) === totalSidi);

    // Auto calculate non-Sidi members
    useEffect(() => {
        if (data.familyMembers) {
            const calculatedNonSidi = Math.max(0, totalMembers - totalSidi).toString();
            if (data.familyMembersNonSidi !== calculatedNonSidi) {
                update({ familyMembersNonSidi: calculatedNonSidi });
            }
        }
    }, [data.familyMembers, data.familyMembersSidi, data.familyMembersNonSidi, totalMembers, totalSidi, update]);

    const SuccessMessage = ({ message }: { message: string }) => (
        <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5 mt-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg max-w-fit animate-fadeIn">
            <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
            {message}
        </p>
    );

    const ValidationError = ({ message }: { message: string }) => (
        <p className="text-red-500 text-xs font-medium flex items-center gap-1.5 mt-2 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg max-w-fit animate-fadeIn">
            <span className="material-symbols-outlined text-sm shrink-0">warning</span>
            {message}
        </p>
    );

    return (
        <div className="flex flex-col gap-8">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">family_star</span>
                Informasi Keluarga
            </h3>

            {/* 1. Jumlah Anggota Keluarga */}
            <div className="space-y-4">
                <SectionHeader title="Jumlah Anggota Keluarga" />
                <div className="flex flex-col gap-4">
                    <div className="max-w-[200px] flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Anggota Keluarga</label>
                        <CountSelect
                            id="familyMembers"
                            value={data.familyMembers}
                            onChange={(val) => update({
                                familyMembers: val,
                                familyMembersMale: '',
                                familyMembersFemale: '',
                                familyMembersOutside: '',
                                familyMembersSidi: '',
                                familyMembersSidiMale: '',
                                familyMembersSidiFemale: '',
                                familyMembersNonBaptized: '',
                                familyMembersNonSidi: ''
                            })}
                            max={20}
                            startFrom={1}
                            placeholder="Pilih Total..."
                        />
                    </div>

                    {totalMembers > 0 && (
                        <div className="space-y-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Laki-laki</label>
                                    <CountSelect
                                        id="familyMembersMale"
                                        value={data.familyMembersMale}
                                        onChange={(val) => update({ familyMembersMale: val })}
                                        max={Math.max(0, totalMembers - femaleMembers)}
                                        placeholder="Jumlah..."
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Perempuan</label>
                                    <CountSelect
                                        id="familyMembersFemale"
                                        value={data.familyMembersFemale}
                                        onChange={(val) => update({ familyMembersFemale: val })}
                                        max={Math.max(0, totalMembers - maleMembers)}
                                        placeholder="Jumlah..."
                                    />
                                </div>
                            </div>

                            {!isFamilyCountValid && isFieldsFilled && (
                                <ValidationError message="Total Laki-laki & Perempuan tidak sesuai dengan Jumlah Anggota Keluarga" />
                            )}
                            {isFamilyCountValid && isFieldsFilled && totalMembers > 0 && (
                                <SuccessMessage message="Distribusi data sudah sesuai dengan total anggota." />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Di Luar Kupang */}
            <div className="space-y-4">
                <SectionHeader title="Jumlah Anggota Keluarga yang menetap di luar Kota Kupang" />
                <div className="max-w-[200px]">
                    <CountSelect id="familyMembersOutside" value={data.familyMembersOutside} onChange={(val) => update({ familyMembersOutside: val })} max={totalMembers} placeholder="Jumlah..." />
                </div>
            </div>

            {/* 3. Sidi Members */}
            <div className="space-y-4">
                <SectionHeader title="Jumlah Anggota Sidi" />
                <div className="flex flex-col gap-4">
                    <div className="max-w-[200px] flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Anggota Sidi</label>
                        <CountSelect
                            id="familyMembersSidi"
                            value={data.familyMembersSidi}
                            onChange={(val) => update({
                                familyMembersSidi: val,
                                familyMembersSidiMale: '',
                                familyMembersSidiFemale: ''
                            })}
                            max={totalMembers}
                            placeholder="Pilih Total..."
                        />
                    </div>

                    {totalSidi > 0 && (
                        <div className="space-y-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Sidi Laki-laki</label>
                                    <CountSelect
                                        id="familyMembersSidiMale"
                                        value={data.familyMembersSidiMale}
                                        onChange={(val) => update({ familyMembersSidiMale: val })}
                                        max={Math.max(0, totalSidi - parseInt(data.familyMembersSidiFemale || '0'))}
                                        placeholder="Jumlah..."
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Sidi Perempuan</label>
                                    <CountSelect
                                        id="familyMembersSidiFemale"
                                        value={data.familyMembersSidiFemale}
                                        onChange={(val) => update({ familyMembersSidiFemale: val })}
                                        max={Math.max(0, totalSidi - parseInt(data.familyMembersSidiMale || '0'))}
                                        placeholder="Jumlah..."
                                    />
                                </div>
                            </div>

                            {!isSidiCountValid && isSidiFieldsFilled && (
                                <ValidationError message="Total Sidi Laki-laki & Perempuan tidak sesuai dengan Total Sidi" />
                            )}
                            {isSidiCountValid && isSidiFieldsFilled && totalSidi > 0 && (
                                <SuccessMessage message="Distribusi data sudah sesuai dengan total anggota sidi." />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* 4. Not Baptized */}
            <div className="space-y-4">
                <SectionHeader title="Anggota Keluarga belum di Baptis" />
                <div className="max-w-[200px]">
                    <CountSelect id="familyMembersNonBaptized" value={data.familyMembersNonBaptized} onChange={(val) => update({ familyMembersNonBaptized: val })} max={parseInt(data.familyMembersNonSidi || '0')} />
                </div>
            </div>

            {/* 5. Not Sidi */}
            <div className="space-y-4">
                <SectionHeader title="Anggota Keluarga belum Sidi" />
                <div className="max-w-[300px]">
                    <div className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] cursor-not-allowed text-sm font-semibold">
                        {data.familyMembersNonSidi || '0'} Orang
                    </div>
                </div>
            </div>

            {/* 6. Diakonia Recipient */}
            <div className="space-y-4">
                <SectionHeader title="Apakah penerima Diakonia dari GMIT JEL?" />
                <FormRadioGroup
                    name="diakonia_recipient"
                    id="diakonia_recipient"
                    options={['Ya', 'Tidak']}
                    value={data.diakonia_recipient}
                    onChange={(val) => {
                        update({ diakonia_recipient: val as 'Ya' | 'Tidak' });
                        // Reset follow-up fields when switching to "Tidak"
                        if (val === 'Tidak') {
                            update({ diakonia_recipient: 'Tidak', diakonia_year: '', diakonia_type: '' });
                        }
                    }}
                    columns={2}
                />
            </div>

            {/* 7. Diakonia Details (Conditional) */}
            {data.diakonia_recipient === 'Ya' && (
                <div className="space-y-4">
                    <SectionHeader title="Tahun berapa dan Diakonia apa saja?" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Year Select */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="diakonia_year" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tahun Penerimaan</label>
                            <div className="relative">
                                <select
                                    id="diakonia_year"
                                    className={selectClass}
                                    value={data.diakonia_year}
                                    onChange={(e) => update({ diakonia_year: e.target.value })}
                                >
                                    <option value="">Pilih Tahun...</option>
                                    {yearOptions.map((year) => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
                            </div>
                        </div>
                    </div>
                    {/* Diakonia Type Textarea */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="diakonia_type" className="text-xs font-semibold text-slate-600 dark:text-slate-400">Jenis Diakonia yang Diterima</label>
                        <textarea
                            id="diakonia_type"
                            className={textareaClass}
                            value={data.diakonia_type}
                            onChange={(e) => update({ diakonia_type: e.target.value })}
                            placeholder="Tuliskan jenis diakonia yang pernah diterima..."
                            rows={3}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
export default Step2Professional;
