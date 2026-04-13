import React, { useEffect, useState, useRef } from 'react';
import { type FormData } from '../../types';
import SectionHeader from '../ui/SectionHeader';
import FormRadioGroup from '../ui/FormRadioGroup';
import { FormTooltip } from '../ui/FormTooltip';
import { checkDuplicateName } from '../../lib/validation';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
    goToStep: (step: number, editing?: boolean) => void;
}

const selectClass = "w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-300 appearance-none text-sm";

const textareaClass = "w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-300 text-sm resize-none min-h-[100px]";

const CountSelect = ({ id, value, onChange, max = 20, startFrom = 0, placeholder = 'Pilih...', required = false }: {
    id: string; value: string; onChange: (val: string) => void; max?: number; startFrom?: number; placeholder?: string; required?: boolean;
}) => (
    <div className="relative">
        <select className={selectClass} id={id} value={value} onChange={(e) => onChange(e.target.value)} required={required}>
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

// Date options for DOB
const daysOptions = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1).padStart(2, '0'), label: String(i + 1).padStart(2, '0') }));
const monthsOptions = [
    { value: '01', label: 'Januari' }, { value: '02', label: 'Februari' }, { value: '03', label: 'Maret' },
    { value: '04', label: 'April' }, { value: '05', label: 'Mei' }, { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' }, { value: '08', label: 'Agustus' }, { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' }, { value: '11', label: 'November' }, { value: '12', label: 'Desember' }
];
const dobYearsOptions = Array.from({ length: 120 }, (_, i) => {
    const y = currentYear - i;
    return { value: String(y), label: String(y) };
});

const occupationOptions = [
    'Belum Bekerja',
    'Pelajar',
    'Mahasiswa',
    'PNS',
    'PPPK',
    'Honorer',
    'Karyawan BUMN',
    'Karyawan Swasta',
    'Wiraswasta',
    'Petani',
    'Nelayan',
    'Tukang',
    'Ojek Online',
    'Sopir',
    'Pensiunan',
    'Kerja Serabutan',
    'Ibu Rumah Tangga',
    'Lainnya'
];

const calculateAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();
    let computedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        computedAge--;
    }
    return computedAge.toString();
};

const Step2Professional: React.FC<StepProps> = ({ data, update }) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [memberNameErrors, setMemberNameErrors] = useState<Record<number, string | null>>({});
    const [isValidatingMember, setIsValidatingMember] = useState<Record<number, boolean>>({});

    const prevLength = useRef(data.familyMembersDetails?.length || 0);

    const totalMembers = parseInt(data.familyMembers || '0');
    const maleMembers = parseInt(data.familyMembersMale || '0');
    const femaleMembers = parseInt(data.familyMembersFemale || '0');

    const isFieldsFilled = data.familyMembers && data.familyMembersMale && data.familyMembersFemale;
    const isFamilyCountValid = !isFieldsFilled || (maleMembers + femaleMembers === totalMembers);

    const totalSidi = parseInt(data.familyMembersSidi || '0');
    const isSidiFieldsFilled = data.familyMembersSidi && data.familyMembersSidiMale && data.familyMembersSidiFemale;
    const isSidiCountValid = !isSidiFieldsFilled || (parseInt(data.familyMembersSidiMale) + parseInt(data.familyMembersSidiFemale) === totalSidi);

    // Logic for resetting non-baptized if non-Sidi is 0
    useEffect(() => {
        if (data.familyMembersNonSidi === '0' && data.familyMembersNonBaptized !== '0') {
            update({
                familyMembersNonBaptized: '0',
                familyMembersNonBaptizedNames: []
            });
        }
    }, [data.familyMembersNonSidi, data.familyMembersNonBaptized, update]);

    useEffect(() => {
        const currentLength = data.familyMembersDetails?.length || 0;
        if (currentLength > prevLength.current) {
            setEditingIndex(currentLength - 1);
        }
        prevLength.current = currentLength;
    }, [data.familyMembersDetails]);

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
        <div className="space-y-6 animate-fadeIn">
            <div className="bg-white dark:bg-[#1a2e20] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-300">
                <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-50 dark:border-white/5 bg-indigo-500 bg-opacity-10 dark:bg-opacity-20">
                    <div className="p-2 rounded-lg bg-indigo-500 text-white shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">groups</span>
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-base tracking-wide">Data Umum Anggota Keluarga</h4>
                </div>

                <div className="p-6 space-y-8">

                    {/* 1. Jumlah Anggota Keluarga */}
                    <div className="space-y-4">
                        <SectionHeader title="Jumlah Anggota Keluarga" description="Termasuk Kepala Keluarga. Tidak termasuk anggota keluarga di luar Kota Kupang." tooltipText="Masukkan total jumlah anggota keluarga termasuk Kepala Keluarga yang tinggal serumah di Kota Kupang." />
                        <div className="flex flex-col gap-4">
                            <div className="max-w-[200px] flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Total Anggota Keluarga <span className="text-red-500 ml-1">*</span> <FormTooltip text="Berapa total anggota keluarga Anda di rumah ini?" /></label>
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
                                    required
                                />
                            </div>

                            {totalMembers > 0 && (
                                <div className="space-y-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Laki-laki <span className="text-red-500 ml-1">*</span> <FormTooltip text="Jumlah anggota keluarga laki-laki." /></label>
                                            <CountSelect
                                                id="familyMembersMale"
                                                value={data.familyMembersMale}
                                                onChange={(val) => update({ familyMembersMale: val })}
                                                max={Math.max(0, totalMembers - femaleMembers)}
                                                placeholder="Jumlah..."
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Perempuan <span className="text-red-500 ml-1">*</span> <FormTooltip text="Jumlah anggota keluarga perempuan." /></label>
                                            <CountSelect
                                                id="familyMembersFemale"
                                                value={data.familyMembersFemale}
                                                onChange={(val) => update({ familyMembersFemale: val })}
                                                max={Math.max(0, totalMembers - maleMembers)}
                                                placeholder="Jumlah..."
                                                required
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
                        <SectionHeader title="Jumlah Anggota Keluarga yang menetap di luar Kota Kupang" description="Anggota Keluarga yang Tercatat di KK tetapi tinggal di luar atau dinas dll." tooltipText="Masukkan jumlah jika ada anggota keluarga yang tercatat di KK tetapi tinggal di luar atau dinas dll." />
                        <div className="max-w-[200px] flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Jumlah di luar Kupang <span className="text-red-500 ml-1">*</span> <FormTooltip text="Berapa orang yang ada di KK tapi tidak tinggal di Kupang?" /></label>
                            <CountSelect id="familyMembersOutside" value={data.familyMembersOutside} onChange={(val) => update({ familyMembersOutside: val })} max={totalMembers} placeholder="Jumlah..." required />
                        </div>
                    </div>

                    {/* 3. Sidi Members */}
                    <div className="space-y-4">
                        <SectionHeader title="Jumlah Anggota Sidi dalam rumah saat ini" description="Termasuk Kepala Keluarga. Tidak termasuk anggota keluarga di luar Kota Kupang." tooltipText="Berapa orang dalam KK ini yang sudah Sidi." />
                        <div className="flex flex-col gap-4">
                            <div className="max-w-[200px] flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Total Anggota Sidi <span className="text-red-500 ml-1">*</span> <FormTooltip text="Total anggota Sidi di keluarga ini." /></label>
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
                                    required
                                />
                            </div>

                            {totalSidi > 0 && (
                                <div className="space-y-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Sidi Laki-laki <span className="text-red-500 ml-1">*</span> <FormTooltip text="Jumlah anggota Sidi laki-laki." /></label>
                                            <CountSelect
                                                id="familyMembersSidiMale"
                                                value={data.familyMembersSidiMale}
                                                onChange={(val) => update({ familyMembersSidiMale: val })}
                                                max={Math.max(0, totalSidi - parseInt(data.familyMembersSidiFemale || '0'))}
                                                placeholder="Jumlah..."
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Sidi Perempuan <span className="text-red-500 ml-1">*</span> <FormTooltip text="Jumlah anggota Sidi perempuan." /></label>
                                            <CountSelect
                                                id="familyMembersSidiFemale"
                                                value={data.familyMembersSidiFemale}
                                                onChange={(val) => update({ familyMembersSidiFemale: val })}
                                                max={Math.max(0, totalSidi - parseInt(data.familyMembersSidiMale || '0'))}
                                                placeholder="Jumlah..."
                                                required
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
                        <SectionHeader title="Anggota Keluarga yang Belum Sidi" tooltipText="Jumlah anggota keluarga yang belum mengikuti Sidi. Termasuk anak yang sudah dibaptis namun belum cukup umur Sidi maupun anggota dewasa yang belum Sidi." />
                        <div className="max-w-[200px] flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Jumlah Belum Sidi <span className="text-red-500 ml-1">*</span> <FormTooltip text="Berapa orang yang belum Sidi?" /></label>
                            <CountSelect
                                id="familyMembersNonSidi"
                                value={data.familyMembersNonSidi}
                                onChange={(val) => {
                                    const newCount = parseInt(val || '0');
                                    const updates: Partial<FormData> = { familyMembersNonSidi: val };

                                    // If non-sidi count decreases, trim names
                                    if ((data.familyMembersNonSidiNames || []).length > newCount) {
                                        updates.familyMembersNonSidiNames = data.familyMembersNonSidiNames.slice(0, newCount);
                                    }

                                    // If non-sidi count is less than non-baptized count, adjust non-baptized
                                    if (parseInt(data.familyMembersNonBaptized || '0') > newCount) {
                                        updates.familyMembersNonBaptized = val;
                                        updates.familyMembersNonBaptizedNames = (data.familyMembersNonBaptizedNames || []).slice(0, newCount);
                                    }

                                    update(updates);
                                }}
                                max={Math.max(0, totalMembers - totalSidi)}
                                placeholder="Jumlah..."
                                required
                            />
                        </div>

                        {/* Question: Ada anggota 18+ belum Sidi? */}
                        {parseInt(data.familyMembersNonSidi || '0') > 0 && (
                            <div className="mt-4 space-y-4">
                                <SectionHeader title="Apakah ada anggota keluarga usia 18 tahun ke atas yang belum Sidi?" tooltipText="Pilih Ya jika ada anggota keluarga berusia 18 tahun ke atas yang belum mengikuti Sidi." />
                                <FormRadioGroup
                                    name="hasNonSidiAdult18"
                                    id="hasNonSidiAdult18"
                                    options={['Ya', 'Tidak']}
                                    value={data.hasNonSidiAdult18}
                                    onChange={(val) => {
                                        update({ hasNonSidiAdult18: val as 'Ya' | 'Tidak' });
                                        if (val === 'Tidak') {
                                            update({ hasNonSidiAdult18: 'Tidak', familyMembersNonSidiNames: [] });
                                        }
                                    }}
                                    columns={2}
                                    required
                                />

                                {/* Manual Name Fields for 18+ Non Sidi Members */}
                                {data.hasNonSidiAdult18 === 'Ya' && (
                                    <div className="p-4 md:p-5 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-700/30 rounded-2xl animate-fade-in space-y-4 max-w-2xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800/50 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-sm">person_add</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300">
                                                Nama Anggota Usia 18+ yang Belum Sidi
                                            </h4>
                                        </div>
                                        <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed mb-4">
                                            Silakan masukkan nama anggota keluarga <strong>usia 18 tahun ke atas</strong> yang belum mengikuti Sidi. Klik tombol "Tambah" untuk menambahkan nama.
                                        </p>

                                        <div className="space-y-3">
                                            {(data.familyMembersNonSidiNames || []).map((name, idx) => (
                                                <div key={`non-sidi-${idx}`} className="relative flex flex-col gap-1.5">
                                                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 ml-1">Nama Anggota {idx + 1}</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={name}
                                                            onChange={(e) => {
                                                                const newNames = [...(data.familyMembersNonSidiNames || [])];
                                                                newNames[idx] = e.target.value;
                                                                update({ familyMembersNonSidiNames: newNames });
                                                            }}
                                                            placeholder={`Masukkan Nama Anggota ${idx + 1}`}
                                                            className="flex-1 px-4 py-3 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-700/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 dark:focus:border-amber-500 transition-all shadow-sm"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newNames = [...(data.familyMembersNonSidiNames || [])];
                                                                newNames.splice(idx, 1);
                                                                update({ familyMembersNonSidiNames: newNames });
                                                            }}
                                                            className="shrink-0 size-11 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all flex items-center justify-center"
                                                            title="Hapus"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">close</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {(data.familyMembersNonSidiNames || []).length < parseInt(data.familyMembersNonSidi || '0') && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newNames = [...(data.familyMembersNonSidiNames || []), ''];
                                                    update({ familyMembersNonSidiNames: newNames });
                                                }}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-100 dark:bg-amber-800/30 border border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                                Tambah Nama Anggota 18+ Belum Sidi
                                            </button>
                                        )}

                                        {/* Alasan Belum Sidi Textarea */}
                                        <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-700/30 flex flex-col gap-1.5 relative z-10">
                                            <label htmlFor="familyMembersNonSidiReason" className="text-xs font-semibold text-amber-900 dark:text-amber-300 flex items-center z-10">
                                                Mengapa belum mengikuti Sidi? <span className="text-red-500 ml-1">*</span>
                                                <FormTooltip text="Mohon jelaskan secara singkat alasan belum mengikuti Sidi." />
                                            </label>
                                            <textarea
                                                id="familyMembersNonSidiReason"
                                                className={textareaClass + " !border-amber-200 focus:!border-amber-500 focus:!ring-amber-500/20"}
                                                value={data.familyMembersNonSidiReason || ''}
                                                onChange={(e) => update({ familyMembersNonSidiReason: e.target.value })}
                                                placeholder="Berikan keterangan/alasan belum Sidi..."
                                                rows={3}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 5 Not Baptized */}
                    <div className="space-y-4 z-10 relative">
                        <SectionHeader title="Anggota Keluarga usia 0 tahun ke atas yang belum di Baptis" tooltipText="Total anggota dalam keluarga yang belum melangsungkan Baptisan." />
                        <div className="max-w-[200px] flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Jumlah Belum Baptis <span className="text-red-500 ml-1">*</span> <FormTooltip text="Total anggota yang belum dibaptis." /></label>
                            <CountSelect id="familyMembersNonBaptized" value={data.familyMembersNonBaptized} onChange={(val) => {
                                const count = parseInt(val || '0');
                                const currentNames = data.familyMembersNonBaptizedNames || [];
                                update({
                                    familyMembersNonBaptized: val,
                                    familyMembersNonBaptizedNames: Array.from({ length: count }, (_, i) => currentNames[i] || '')
                                });
                            }} max={parseInt(data.familyMembersNonSidi || '0')} required />
                        </div>
                    </div>

                    {/* Dynamic Name Fields for Non Baptized */}
                    {
                        parseInt(data.familyMembersNonBaptized || '0') > 0 && (
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
                                    Silakan masukkan nama lengkap anggota keluarga usia 0 tahun ke atas yang belum mengikuti Baptisan.
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

                                {/* Alasan Belum Baptis Textarea */}
                                <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-amber-700/30 flex flex-col gap-1.5 relative z-10">
                                    <label htmlFor="familyMembersNonBaptizedReason" className="text-xs font-semibold text-amber-900 dark:text-amber-300 flex items-center z-10">
                                        Mengapa belum dibaptis? <span className="text-red-500 ml-1">*</span>
                                        <FormTooltip text="Mohon jelaskan secara singkat alasan belum dibaptis." />
                                    </label>
                                    <textarea
                                        id="familyMembersNonBaptizedReason"
                                        className={textareaClass + " !border-amber-200 focus:!border-amber-500 focus:!ring-amber-500/20"}
                                        value={data.familyMembersNonBaptizedReason || ''}
                                        onChange={(e) => update({ familyMembersNonBaptizedReason: e.target.value })}
                                        placeholder="Berikan keterangan/alasan belum dibaptis..."
                                        rows={3}
                                        required
                                    />
                                </div>
                            </div>
                        )
                    }

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
                            required
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
                                        <label htmlFor="diakonia_year" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Tahun Penerimaan <span className="text-red-500 ml-1">*</span> <FormTooltip text="Pilih tahun terakhir menerima bantuan Diakonia." /></label>
                                        <div className="relative">
                                            <select
                                                id="diakonia_year"
                                                className={selectClass}
                                                value={data.diakonia_year}
                                                onChange={(e) => update({ diakonia_year: e.target.value })}
                                                required
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
                                    <label htmlFor="diakonia_type" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center z-10">Jenis Diakonia yang Diterima <span className="text-red-500 ml-1">*</span> <FormTooltip text="Contoh: Sembako, bantuan tunai, dll." /></label>
                                    <textarea
                                        id="diakonia_type"
                                        className={textareaClass}
                                        value={data.diakonia_type}
                                        onChange={(e) => update({ diakonia_type: e.target.value })}
                                        placeholder="Tuliskan jenis diakonia yang pernah diterima..."
                                        rows={3}
                                        required
                                    />
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            {/* 8. Detail Anggota Keluarga */}
            <div className="bg-white dark:bg-[#1a2e20] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-300">
                <div className="px-5 py-4 flex items-center gap-3 border-b border-slate-50 dark:border-white/5 bg-emerald-500 bg-opacity-10 dark:bg-opacity-20">
                    <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">person_check</span>
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-base tracking-wide flex-1">Detail Anggota Keluarga</h4>
                    <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all duration-300 ${(data.familyMembersDetails?.length || 0) === Math.max(0, parseInt(data.familyMembers || '0') - 1)
                            ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                            }`}>
                            {data.familyMembersDetails?.length || 0} / {Math.max(0, parseInt(data.familyMembers || '0') - 1)} Anggota Terisi
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-4 relative">
                    <SectionHeader title="Detail Anggota Keluarga" description="Lengkapi detail informasi untuk setiap anggota keluarga." tooltipText="Form ini ditujukan untuk mendata seluruh anggota di dalam KK (suami, istri, anak, keponakan, dll) selain Kepala Keluarga." />

                    {data.familyMembersDetails && data.familyMembersDetails.length > 0 && (
                        <div className="space-y-6">
                            {data.familyMembersDetails.map((member, idx) => {
                                const [bYear = '', bMonth = '', bDay = ''] = (member.dateOfBirth || '').split('-');
                                const updateMember = (field: keyof typeof member, value: any) => {
                                    const newDetails = [...data.familyMembersDetails];
                                    newDetails[idx] = { ...newDetails[idx], [field]: value };
                                    // Conditional resets
                                    if (field === 'religion' && value !== 'Kristen Protestan') {
                                        newDetails[idx].baptismStatus = '';
                                        newDetails[idx].baptismPlace = '';
                                        newDetails[idx].baptismDate = '';
                                        newDetails[idx].sidiPlace = '';
                                        newDetails[idx].sidiDate = '';
                                    }
                                    if (field === 'occupation' && value !== 'Lainnya') {
                                        newDetails[idx].occupationOther = '';
                                    }
                                    if (field === 'relationship' && value !== 'Lainnya') {
                                        newDetails[idx].relationshipOther = '';
                                    }
                                    update({ familyMembersDetails: newDetails });
                                };

                                const handleBapDateChange = (part: 'year' | 'month' | 'day', val: string) => {
                                    const [y = '', m = '', d = ''] = (member.baptismDate || '').split('-');
                                    let newY = y, newM = m, newD = d;
                                    if (part === 'year') newY = val;
                                    if (part === 'month') newM = val;
                                    if (part === 'day') newD = val;
                                    updateMember('baptismDate', `${newY}-${newM}-${newD}`);
                                };

                                const handleSidiDateChange = (part: 'year' | 'month' | 'day', val: string) => {
                                    const [y = '', m = '', d = ''] = (member.sidiDate || '').split('-');
                                    let newY = y, newM = m, newD = d;
                                    if (part === 'year') newY = val;
                                    if (part === 'month') newM = val;
                                    if (part === 'day') newD = val;
                                    updateMember('sidiDate', `${newY}-${newM}-${newD}`);
                                };

                                const toTitleCase = (str: string) => {
                                    return str.toLowerCase().replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
                                };

                                const handleMemberNameBlur = async () => {
                                    if (!member.fullName) return;
                                    const formattedName = toTitleCase(member.fullName);
                                    if (formattedName !== member.fullName) {
                                        updateMember('fullName', formattedName);
                                    }

                                    setIsValidatingMember((prev: Record<number, boolean>) => ({ ...prev, [idx]: true }));
                                    try {
                                        const isDuplicate = await checkDuplicateName(formattedName);
                                        if (isDuplicate) {
                                            setMemberNameErrors((prev: Record<number, string | null>) => ({ ...prev, [idx]: "Nama ini sudah terdaftar dalam database. Mohon periksa kembali." }));
                                        } else {
                                            setMemberNameErrors((prev: Record<number, string | null>) => ({ ...prev, [idx]: null }));
                                        }
                                    } catch (error) {
                                        console.error("Validation error:", error);
                                    } finally {
                                        setIsValidatingMember((prev: Record<number, boolean>) => ({ ...prev, [idx]: false }));
                                    }
                                };

                                const handleBirthPlaceBlur = () => {
                                    if (!member.birthPlace) return;
                                    const formatted = toTitleCase(member.birthPlace);
                                    if (formatted !== member.birthPlace) {
                                        updateMember('birthPlace', formatted);
                                    }
                                };

                                const handleBaptismPlaceBlur = () => {
                                    if (!member.baptismPlace) return;
                                    const formatted = toTitleCase(member.baptismPlace);
                                    if (formatted !== member.baptismPlace) {
                                        updateMember('baptismPlace', formatted);
                                    }
                                };

                                const handleSidiPlaceBlur = () => {
                                    if (!member.sidiPlace) return;
                                    const formatted = toTitleCase(member.sidiPlace);
                                    if (formatted !== member.sidiPlace) {
                                        updateMember('sidiPlace', formatted);
                                    }
                                };

                                if (editingIndex !== idx) {
                                    return (
                                        <div key={idx} id={`member-item-${idx}`} className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/30 animate-fadeIn">
                                            <div className="flex flex-col gap-1 flex-1">
                                                <h4 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary text-xl">person</span>
                                                    {member.fullName || 'Anggota Tanpa Nama'}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[16px]">badge</span>
                                                        {member.nik || 'NIK belum diisi'}
                                                    </span>
                                                    {member.relationship && (() => {
                                                        const getRelStyle = (rel: string) => {
                                                            switch (rel) {
                                                                case 'Suami': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
                                                                case 'Istri': return 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300 border-pink-200 dark:border-pink-800/50';
                                                                case 'Anak': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
                                                                case 'Orang Tua':
                                                                case 'Mertua': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
                                                                case 'Menantu':
                                                                case 'Cucu': return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/50';
                                                                default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700/50 dark:text-slate-300 border-slate-200 dark:border-slate-600/50';
                                                            }
                                                        };

                                                        const getRelIcon = (rel: string) => {
                                                            switch (rel) {
                                                                case 'Suami': return 'person';
                                                                case 'Istri': return 'person_2';
                                                                case 'Anak': return 'child_care';
                                                                case 'Orang Tua':
                                                                case 'Mertua': return 'elderly';
                                                                case 'Menantu': return 'person_add';
                                                                case 'Cucu': return 'child_friendly';
                                                                default: return 'groups';
                                                            }
                                                        };

                                                        return (
                                                            <>
                                                                <span className="hidden md:inline text-slate-300 dark:text-slate-700">•</span>
                                                                <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all duration-300 ${getRelStyle(member.relationship)}`}>
                                                                    <span className="material-symbols-outlined text-[14px]">{getRelIcon(member.relationship)}</span>
                                                                    {member.relationship === 'Lainnya' ? (member.relationshipOther || 'Lainnya') : member.relationship}
                                                                </span>
                                                            </>
                                                        );
                                                    })()}
                                                    {member.dateOfBirth && (
                                                        <>
                                                            <span className="hidden md:inline">•</span>
                                                            <span className="flex items-center gap-1 text-xs">
                                                                {calculateAge(member.dateOfBirth)} Tahun
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 md:w-auto w-full justify-end border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-3 md:pt-0 mt-3 md:mt-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingIndex(idx)}
                                                    className="text-primary hover:bg-primary/10 dark:hover:bg-primary/20 bg-primary/5 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newDetails = [...data.familyMembersDetails];
                                                        newDetails.splice(idx, 1);
                                                        update({ familyMembersDetails: newDetails });
                                                        if (editingIndex === idx) setEditingIndex(null);
                                                        else if (editingIndex !== null && editingIndex > idx) setEditingIndex(editingIndex - 1);
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
                                    <div key={idx} id={`member-item-${idx}`} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 relative shadow-sm">
                                        <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-between">
                                            Anggota Keluarga {idx + 1}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newDetails = [...data.familyMembersDetails];
                                                    newDetails.splice(idx, 1);
                                                    update({ familyMembersDetails: newDetails });
                                                }}
                                                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-2 py-1 rounded transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span> Hapus
                                            </button>
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex flex-col">
                                                <FormInput label="NIK" id={`member-${idx}-nik`} value={member.nik} onChange={(val) => updateMember('nik', val.replace(/\D/g, '').substring(0, 16))} placeholder="Nomor Induk Kependudukan (16 digit)" tooltipText="Masukkan 16 digit Nomor Induk Kependudukan (NIK) sesuai dengan e-KTP." required />
                                                {member.nik && member.nik.length > 0 && member.nik.length < 16 && (
                                                    <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                                                        <span className="material-symbols-outlined text-base">warning</span>
                                                        <span className="text-xs font-medium">NIK harus 16 digit ({member.nik.length}/16)</span>
                                                    </div>
                                                )}
                                                {member.nik && member.nik.length === 16 && (
                                                    <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                                                        <span className="material-symbols-outlined text-base">check_circle</span>
                                                        <span className="text-xs font-medium">NIK valid</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col relative">
                                                <FormInput
                                                    label="Nama Lengkap"
                                                    id={`member-${idx}-name`}
                                                    value={member.fullName}
                                                    onChange={(val) => {
                                                        updateMember('fullName', val);
                                                        if (memberNameErrors[idx]) {
                                                            setMemberNameErrors((prev: Record<number, string | null>) => ({ ...prev, [idx]: null }));
                                                        }
                                                    }}
                                                    onBlur={handleMemberNameBlur}
                                                    placeholder="Sesuai KK/KTP"
                                                    required
                                                    error={memberNameErrors[idx]}
                                                    tooltipText="Masukkan nama lengkap anggota keluarga sesuai KTP/KK."
                                                />
                                                {isValidatingMember[idx] && (
                                                    <div className="absolute right-3 top-[2.4rem]">
                                                        <span className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full block"></span>
                                                    </div>
                                                )}
                                            </div>

                                            <FormSelect label="Jenis Kelamin" id={`member-${idx}-gender`} value={member.gender} onChange={(val) => updateMember('gender', val)} options={['Laki-laki', 'Perempuan']} placeholder="Pilih Jenis Kelamin" required tooltipText="Pilih jenis kelamin sesuai KTP/KK." />
                                            <FormInput label="Tempat Lahir" id={`member-${idx}-bp`} value={member.birthPlace} onChange={(val) => updateMember('birthPlace', val)} onBlur={handleBirthPlaceBlur} placeholder="Contoh: Kupang" required tooltipText="Masukkan tempat lahir sesuai KTP/KK." />

                                            {/* Tanggal Lahir (Grid Day, Month, Year) */}
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">Tanggal Lahir <span className="text-red-500">*</span> <FormTooltip text="Masukkan tanggal lahir sesuai akta kelahiran atau e-KTP." /></label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <FormSelect id={`member-${idx}-dob-d`} value={bDay} onChange={(val) => updateMember('dateOfBirth', `${bYear}-${bMonth}-${val}`)} options={daysOptions} placeholder="Tanggal" required />
                                                    <FormSelect id={`member-${idx}-dob-m`} value={bMonth} onChange={(val) => updateMember('dateOfBirth', `${bYear}-${val}-${bDay}`)} options={monthsOptions} placeholder="Bulan" required />
                                                    <FormSelect id={`member-${idx}-dob-y`} value={bYear} onChange={(val) => updateMember('dateOfBirth', `${val}-${bMonth}-${bDay}`)} options={dobYearsOptions} placeholder="Tahun" required />
                                                </div>
                                            </div>

                                            <FormInput label="Usia" id={`member-${idx}-age`} value={calculateAge(member.dateOfBirth) || '-'} onChange={() => { }} readOnly />

                                            {/* Agama */}
                                            <div className="col-span-1 md:col-span-2 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
                                                <FormSelect label="Agama" id={`member-${idx}-religion`} value={member.religion} onChange={(val) => updateMember('religion', val)} options={['Kristen Protestan', 'Kristen Katolik', 'Hindu', 'Buddha', 'Islam', 'Konghucu']} placeholder="Pilih Agama" required tooltipText="Pilih agama sesuai KTP/AKTA." />

                                                {member.religion === 'Kristen Protestan' && (
                                                    <div className="space-y-4 pl-4 border-l-2 border-primary/20 bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-xl">
                                                        <FormRadioGroup label="Status Baptis" name={`member-${idx}-bap-stat`} value={member.baptismStatus} onChange={(val) => updateMember('baptismStatus', val)} options={['Sudah', 'Belum']} columns={2} tooltipText="Pilih apakah sudah dibaptis atau belum." required />
                                                        {member.baptismStatus === 'Sudah' && (
                                                            <>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <FormInput label="Tempat Baptis" id={`member-${idx}-bap-place`} value={member.baptismPlace} onChange={(val) => updateMember('baptismPlace', val)} onBlur={handleBaptismPlaceBlur} placeholder="Contoh: Gereja Emaus Liliba" tooltipText="Masukkan nama tempat atau gereja melakukan baptisan." required />
                                                                    <div className="flex flex-col gap-2">
                                                                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">Tanggal Baptis <span className="text-red-500">*</span> <FormTooltip text="Masukkan tanggal baptis." /></label>
                                                                        <div className="grid grid-cols-3 gap-2">
                                                                            <FormSelect id={`m-${idx}-bapd`} value={member.baptismDate?.split('-')[2] || ''} onChange={(val) => handleBapDateChange('day', val)} options={daysOptions} placeholder="Tgl" required />
                                                                            <FormSelect id={`m-${idx}-bapm`} value={member.baptismDate?.split('-')[1] || ''} onChange={(val) => handleBapDateChange('month', val)} options={monthsOptions} placeholder="Bln" required />
                                                                            <FormSelect id={`m-${idx}-bapy`} value={member.baptismDate?.split('-')[0] || ''} onChange={(val) => handleBapDateChange('year', val)} options={dobYearsOptions} placeholder="Thn" required />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <FormRadioGroup label="Status Sidi" name={`member-${idx}-sidi-stat`} value={member.sidiStatus} onChange={(val) => updateMember('sidiStatus', val)} options={['Sudah', 'Belum']} columns={2} tooltipText="Pilih apakah sudah sidi atau belum." required />
                                                                {member.sidiStatus === 'Sudah' && (
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <FormInput label="Tempat Sidi" id={`member-${idx}-sidi-place`} value={member.sidiPlace} onChange={(val) => updateMember('sidiPlace', val)} onBlur={handleSidiPlaceBlur} placeholder="Contoh: Gereja Emaus Liliba" tooltipText="Masukkan nama tempat atau gereja meneguhkan sidi." required />
                                                                        <div className="flex flex-col gap-2">
                                                                            <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">Tanggal Sidi <span className="text-red-500">*</span> <FormTooltip text="Masukkan tanggal sidi." /></label>
                                                                            <div className="grid grid-cols-3 gap-2">
                                                                                <FormSelect id={`m-${idx}-sdid`} value={member.sidiDate?.split('-')[2] || ''} onChange={(val) => handleSidiDateChange('day', val)} options={daysOptions} placeholder="Tgl" required />
                                                                                <FormSelect id={`m-${idx}-sdim`} value={member.sidiDate?.split('-')[1] || ''} onChange={(val) => handleSidiDateChange('month', val)} options={monthsOptions} placeholder="Bln" required />
                                                                                <FormSelect id={`m-${idx}-sdiy`} value={member.sidiDate?.split('-')[0] || ''} onChange={(val) => handleSidiDateChange('year', val)} options={dobYearsOptions} placeholder="Thn" required />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <FormSelect label="Golongan Darah" id={`member-${idx}-blood`} value={member.bloodType} onChange={(val) => updateMember('bloodType', val)} options={['A', 'B', 'AB', 'O', 'Tidak Tahu']} placeholder="Pilih..." required tooltipText="Pilih golongan darah sesuai dengan data medis atau e-KTP." />
                                            <FormSelect label="Pendidikan Terakhir" id={`member-${idx}-edu`} value={member.education} onChange={(val) => updateMember('education', val)} options={['Tidak Sekolah', 'Tidak Tamat SD', 'SD', 'SMP/Sederajat', 'SMA/Sederajat', 'D I', 'D II', 'D III', 'D IV/S1', 'S1', 'S2', 'S3']} placeholder="Pilih Tingkat..." required tooltipText="Pendidikan terakhir yang telah ditamatkan." />
                                            <FormSelect label="Hubungan Dengan Kepala Keluarga" id={`member-${idx}-rel`} value={member.relationship} onChange={(val) => updateMember('relationship', val)} options={['Suami', 'Istri', 'Anak Kandung', 'Keponakan', 'Anak Angkat', 'Anak Tiri', 'Menantu', 'Cucu', 'Orang Tua', 'Mertua', 'Saudara Kandung', 'Famili Lain', 'ART', 'Ipar', 'Lainnya']} placeholder="Pilih Hubungan..." required tooltipText="Pilih hubungan kekerabatan dengan Kepala Keluarga." />
                                            {member.relationship === 'Lainnya' && (
                                                <div className="animate-fadeIn">
                                                    <FormInput
                                                        label="Hubungan Lainnya"
                                                        id={`member-${idx}-rel-other`}
                                                        value={member.relationshipOther || ''}
                                                        onChange={(val) => updateMember('relationshipOther', val)}
                                                        placeholder="Tuliskan Hubungan..."
                                                        required
                                                    />
                                                </div>
                                            )}
                                            <FormSelect label="Pekerjaan" id={`member-${idx}-job`} value={member.occupation} onChange={(val) => updateMember('occupation', val)} options={occupationOptions} placeholder="Pilih Pekerjaan..." tooltipText="Pekerjaan atau aktivitas utama saat ini." />
                                            {member.occupation === 'Lainnya' && (
                                                <div className="animate-fadeIn">
                                                    <FormInput
                                                        label="Pekerjaan Lainnya"
                                                        id={`member-${idx}-job-other`}
                                                        value={member.occupationOther || ''}
                                                        onChange={(val) => updateMember('occupationOther', val)}
                                                        placeholder="Tuliskan pekerjaan..."
                                                        required
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => { setEditingIndex(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center gap-2 group"
                                            >
                                                <span className="material-symbols-outlined">save</span>
                                                Simpan Anggota Ini
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {editingIndex === null && (() => {
                        const target = Math.max(0, parseInt(data.familyMembers || '0') - 1);
                        const currentCount = (data.familyMembersDetails || []).length;
                        const reachedLimit = currentCount >= target;

                        if (target === 0) return null; // No members to add besides Head of Family

                        return (
                            <button
                                type="button"
                                disabled={reachedLimit}
                                onClick={() => {
                                    if (reachedLimit) return;
                                    const newDetails = [...(data.familyMembersDetails || [])];
                                    newDetails.push({
                                        nik: '', fullName: '', gender: '', birthPlace: '', dateOfBirth: '', religion: '', bloodType: '', education: '', relationship: '', relationshipOther: '', occupation: '', occupationOther: '', baptismStatus: '', baptismPlace: '', baptismDate: '', sidiStatus: '', sidiPlace: '', sidiDate: ''
                                    });
                                    update({ familyMembersDetails: newDetails });
                                    setEditingIndex(newDetails.length - 1);
                                }}
                                className={`w-full mt-4 py-6 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 transition-all duration-300 group ${reachedLimit
                                    ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60'
                                    : 'border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary hover:bg-primary/5'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-inner ${reachedLimit ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-primary group-hover:text-white'
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl">{reachedLimit ? 'check' : 'person_add'}</span>
                                </div>
                                <span className="font-bold text-base tracking-tight">
                                    {reachedLimit
                                        ? 'Semua Anggota Sudah Ditambahkan'
                                        : 'Tambah Anggota Keluarga'}
                                </span>
                                {!reachedLimit && (
                                    <span className="text-xs text-slate-400">
                                        Masih ada {target - currentCount} anggota lagi yang perlu di data
                                    </span>
                                )}
                            </button>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
};

export default Step2Professional;
