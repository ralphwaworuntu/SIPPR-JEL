import React, { useEffect } from 'react';
import { type FormData } from '../../types';
import SectionHeader from '../ui/SectionHeader';
import FormRadioGroup from '../ui/FormRadioGroup';
import { FormTooltip } from '../ui/FormTooltip';

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
            const updates: Partial<FormData> = {};
            const calculatedNonSidi = Math.max(0, totalMembers - totalSidi).toString();

            if (data.familyMembersNonSidi !== calculatedNonSidi) {
                updates.familyMembersNonSidi = calculatedNonSidi;

                // Adjust array size for Non Sidi Names
                const nonSidiCount = parseInt(calculatedNonSidi) || 0;
                const currentNames = data.familyMembersNonSidiNames || [];
                if (currentNames.length !== nonSidiCount) {
                    updates.familyMembersNonSidiNames = Array.from({ length: nonSidiCount }, (_, i) => currentNames[i] || '');
                }
            }

            if (calculatedNonSidi === '0' && data.familyMembersNonBaptized !== '0') {
                updates.familyMembersNonBaptized = '0';
                updates.familyMembersNonBaptizedNames = [];
            }

            if (Object.keys(updates).length > 0) {
                update(updates);
            }
        }
    }, [data.familyMembers, data.familyMembersSidi, data.familyMembersNonSidi, data.familyMembersNonSidiNames, data.familyMembersNonBaptized, totalMembers, totalSidi, update]);

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
                Data Umum Anggota Keluarga
            </h3>

            {/* 1. Jumlah Anggota Keluarga */}
            <div className="space-y-4">
                <SectionHeader title="Jumlah Anggota Keluarga" description="Tidak Termasuk Kepala Keluarga dan Anggota Keluarga Di Luar Kupang" tooltipText="Masukkan total jumlah anggota keluarga (termasuk KK) sesuai Kartu Keluarga." />
                <div className="flex flex-col gap-4">
                    <div className="max-w-[200px] flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Total Anggota Keluarga <FormTooltip text="Berapa total anggota keluarga Anda di rumah ini?" /></label>
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
                                familyMembersNonSidi: '',
                                familyMembersNonSidiNames: [],
                                familyMembersNonBaptizedNames: []
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
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Laki-laki <FormTooltip text="Jumlah anggota keluarga laki-laki." /></label>
                                    <CountSelect
                                        id="familyMembersMale"
                                        value={data.familyMembersMale}
                                        onChange={(val) => update({ familyMembersMale: val })}
                                        max={Math.max(0, totalMembers - femaleMembers)}
                                        placeholder="Jumlah..."
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Perempuan <FormTooltip text="Jumlah anggota keluarga perempuan." /></label>
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
                <SectionHeader title="Jumlah Anggota Keluarga yang menetap di luar Kota Kupang" tooltipText="Masukkan jumlah jika ada anggota keluarga yang tercatat di KK tetapi tinggal di luar atau dinas dll." />
                <div className="max-w-[200px]">
                    <CountSelect id="familyMembersOutside" value={data.familyMembersOutside} onChange={(val) => update({ familyMembersOutside: val })} max={totalMembers} placeholder="Jumlah..." />
                </div>
            </div>

            {/* 3. Sidi Members */}
            <div className="space-y-4">
                <SectionHeader title="Jumlah Anggota Sidi" tooltipText="Berapa orang dalam KK ini yang sudah dikonfirmasi/Sidi." />
                <div className="flex flex-col gap-4">
                    <div className="max-w-[200px] flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Total Anggota Sidi <FormTooltip text="Total anggota Sidi di keluarga ini." /></label>
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
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Sidi Laki-laki <FormTooltip text="Jumlah anggota Sidi laki-laki." /></label>
                                    <CountSelect
                                        id="familyMembersSidiMale"
                                        value={data.familyMembersSidiMale}
                                        onChange={(val) => update({ familyMembersSidiMale: val })}
                                        max={Math.max(0, totalSidi - parseInt(data.familyMembersSidiFemale || '0'))}
                                        placeholder="Jumlah..."
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Sidi Perempuan <FormTooltip text="Jumlah anggota Sidi perempuan." /></label>
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

            {/* 4. Not Sidi */}
            <div className="space-y-4 z-10 relative">
                <SectionHeader title="Anggota Keluarga (18 tahun ke atas) yang belum Sidi" tooltipText="Jumlah anggota yang belum Sidi (kalkulasi otomatis berdasarkan total anggota yang tidak Sidi dikurangi anggota sekolah minggu/yang belum Baptis jika ada secara logis, atau hanya menampilkan sisa belum sidi secara umum)." />
                <div className="max-w-[300px]">
                    <div className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] cursor-not-allowed text-sm font-semibold">
                        {data.familyMembersNonSidi || '0'} Orang
                    </div>
                </div>

                {/* Dynamic Name Fields for Non Sidi */}
                {parseInt(data.familyMembersNonSidi || '0') > 0 && (
                    <div className="mt-4 p-4 md:p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl animate-fade-in space-y-4 max-w-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-sm">person_add</span>
                            </div>
                            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                                Nama Anggota Belum Sidi
                            </h4>
                        </div>
                        <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed mb-4">
                            Silakan masukkan nama lengkap anggota keluarga (18 tahun ke atas) yang belum mengikuti Sidi.
                        </p>

                        <div className="space-y-3">
                            {Array.from({ length: parseInt(data.familyMembersNonSidi || '0') }).map((_, idx) => (
                                <div key={`non-sidi-${idx}`} className="relative flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Nama Anggota {idx + 1}</label>
                                    <input
                                        type="text"
                                        value={data.familyMembersNonSidiNames?.[idx] || ''}
                                        onChange={(e) => {
                                            const newNames = [...(data.familyMembersNonSidiNames || [])];
                                            newNames[idx] = e.target.value;
                                            update({ familyMembersNonSidiNames: newNames });
                                        }}
                                        placeholder={`Masukkan Nama Anggota ${idx + 1}`}
                                        className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-700/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-500 transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 5 Not Baptized */}
            <div className="space-y-4 z-10 relative">
                <SectionHeader title="Anggota Keluarga (usia 0 tahun ke atas) yang belum di Baptis" tooltipText="Total anggota dalam keluarga yang belum melangsungkan Baptisan." />
                <div className="max-w-[200px]">
                    <CountSelect id="familyMembersNonBaptized" value={data.familyMembersNonBaptized} onChange={(val) => {
                        const count = parseInt(val || '0');
                        const currentNames = data.familyMembersNonBaptizedNames || [];
                        update({
                            familyMembersNonBaptized: val,
                            familyMembersNonBaptizedNames: Array.from({ length: count }, (_, i) => currentNames[i] || '')
                        });
                    }} max={parseInt(data.familyMembersNonSidi || '0')} />
                </div>
            </div>

            {/* Dynamic Name Fields for Non Baptized */}
            {parseInt(data.familyMembersNonBaptized || '0') > 0 && (
                <div className="mt-4 p-4 md:p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl animate-fade-in space-y-4 max-w-2xl">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-sm">person_add</span>
                        </div>
                        <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                            Nama Anggota Belum Baptis
                        </h4>
                    </div>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed mb-4">
                        Silakan masukkan nama lengkap anggota keluarga (usia 0 tahun ke atas) yang belum mengikuti Baptisan.
                    </p>

                    <div className="space-y-3">
                        {Array.from({ length: parseInt(data.familyMembersNonBaptized || '0') }).map((_, idx) => (
                            <div key={`non-baptized-${idx}`} className="relative flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Nama Anggota {idx + 1}</label>
                                <input
                                    type="text"
                                    value={data.familyMembersNonBaptizedNames?.[idx] || ''}
                                    onChange={(e) => {
                                        const newNames = [...(data.familyMembersNonBaptizedNames || [])];
                                        newNames[idx] = e.target.value;
                                        update({ familyMembersNonBaptizedNames: newNames });
                                    }}
                                    placeholder={`Masukkan Nama Anggota ${idx + 1}`}
                                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-700/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-500 transition-all shadow-sm"
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 6. Diakonia Recipient */}
            <div className="space-y-4 z-10 relative">
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
                    tooltipText="Bantuan apa saja yang disalurkan oleh gereja/diakonia untuk kebutuhan dasar atau insidentil."
                />
            </div>

            {/* 7. Diakonia Details (Conditional) */}
            {
                data.diakonia_recipient === 'Ya' && (
                    <div className="space-y-4 z-10 relative">
                        <SectionHeader title="Tahun berapa dan Diakonia apa saja?" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Year Select */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="diakonia_year" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Tahun Penerimaan <FormTooltip text="Pilih tahun terakhir menerima bantuan Diakonia." /></label>
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
                        <div className="flex flex-col gap-1.5 relative z-10">
                            <label htmlFor="diakonia_type" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Jenis Diakonia yang Diterima <FormTooltip text="Contoh: Sembako, bantuan tunai, dll." /></label>
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
                )
            }
        </div >
    );
};
export default Step2Professional;
