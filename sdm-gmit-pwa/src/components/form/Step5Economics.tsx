import React, { useRef, useEffect } from 'react';
import { type FormData } from '../../types';
import FormRadioGroup from '../ui/FormRadioGroup';
import FormSelect from '../ui/FormSelect';
import FormMultiSelect from '../ui/FormMultiSelect';
import SectionHeader from '../ui/SectionHeader';
import { FormTooltip } from '../ui/FormTooltip';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
    goToStep: (step: number, editing?: boolean) => void;
}

const occupationOptions = [
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

const incomeRanges = [
    '< Rp 500.000',
    'Rp 500.000 - 600.000',
    'Rp 600.000 - 750.000',
    'Rp 750.000 - 1.100.000',
    'Rp 1.100.000 - 1.800.000',
    'Rp 1.800.000 - 2.800.000',
    'Rp 2.800.000 - 4.000.000',
    'Rp 4.000.000 - 6.500.000',
    '≥ Rp 6.500.000'
];

const detailedIncomeRanges = [
    'Rp 6.500.000 - 12.000.000',
    '> Rp 12.000.000'
];

const getIncomeNumericValues = (range: string, detailed: string) => {
    if (range === '≥ Rp 6.500.000') {
        if (detailed === 'Rp 6.500.000 - 12.000.000') return { min: 6500000, max: 12000000 };
        if (detailed === '> Rp 12.000.000') return { min: 12000000, max: Infinity };
        return { min: 6500000, max: Infinity };
    }
    if (range === '< Rp 500.000') return { min: 0, max: 499999 };
    if (range === 'Rp 500.000 - 600.000') return { min: 500000, max: 600000 };
    if (range === 'Rp 600.000 - 750.000') return { min: 600000, max: 750000 };
    if (range === 'Rp 750.000 - 1.100.000') return { min: 750000, max: 1100000 };
    if (range === 'Rp 1.100.000 - 1.800.000') return { min: 1100000, max: 1800000 };
    if (range === 'Rp 1.800.000 - 2.800.000') return { min: 1800000, max: 2800000 };
    if (range === 'Rp 2.800.000 - 4.000.000') return { min: 2800000, max: 4000000 };
    if (range === 'Rp 4.000.000 - 6.500.000') return { min: 4000000, max: 6500000 };
    return { min: 0, max: 0 };
};

const selectClass = "w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-300 appearance-none text-sm";

const CountSelect = ({ id, value, onChange, max = 20, startFrom = 0, placeholder = 'Pilih...', required = false }: {
    id: string; value: number; onChange: (val: number) => void; max?: number; startFrom?: number; placeholder?: string; required?: boolean;
}) => (
    <div className="relative">
        <select
            className={selectClass}
            id={id}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            required={required}
        >
            <option value="0">{placeholder}</option>
            {[...Array(max - startFrom + 1)].map((_, i) => (
                <option key={i + startFrom} value={i + startFrom}>{i + startFrom}</option>
            ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">expand_more</span>
    </div>
);

function FormatRupiah({ value, onChange, required = false }: { value: number, onChange: (val: number) => void, required?: boolean }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^\d]/g, '');
        onChange(parseInt(raw) || 0);
    };
    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 dark:text-slate-400">Rp</span>
            <input
                type="text"
                className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-200 text-base font-semibold"
                value={value ? new Intl.NumberFormat('id-ID').format(value) : ''}
                onChange={handleChange}
                placeholder="0"
                required={required}
            />
        </div>
    );
}

const otherInputClass = "w-full mt-2 h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-200 text-sm";

const Step5Economics: React.FC<StepProps> = ({ data, update }) => {
    const headOtherRef = useRef<HTMLInputElement>(null);
    const spouseOtherRef = useRef<HTMLInputElement>(null);
    const businessTypeOtherRef = useRef<HTMLInputElement>(null);
    const businessStatusOtherRef = useRef<HTMLInputElement>(null);
    const businessLocationOtherRef = useRef<HTMLInputElement>(null);
    const businessCapitalSourceOtherRef = useRef<HTMLInputElement>(null);
    const businessPermitOtherRef = useRef<HTMLInputElement>(null);
    const businessMarketingOtherRef = useRef<HTMLInputElement>(null);
    const businessIssuesOtherRef = useRef<HTMLInputElement>(null);
    const businessTrainingOtherRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (data.economics_headOccupation === 'Lainnya' && headOtherRef.current) {
            headOtherRef.current.focus();
        }
    }, [data.economics_headOccupation]);

    useEffect(() => {
        if (data.economics_businessType === 'Lainnya' && businessTypeOtherRef.current) {
            businessTypeOtherRef.current.focus();
        }
    }, [data.economics_businessType]);

    useEffect(() => {
        if (data.economics_businessStatus === 'Lainnya' && businessStatusOtherRef.current) {
            businessStatusOtherRef.current.focus();
        }
    }, [data.economics_businessStatus]);

    useEffect(() => {
        if (data.economics_businessLocation === 'Lainnya' && businessLocationOtherRef.current) {
            businessLocationOtherRef.current.focus();
        }
    }, [data.economics_businessLocation]);

    useEffect(() => {
        if (data.economics_businessCapitalSource === 'Lainnya' && businessCapitalSourceOtherRef.current) {
            businessCapitalSourceOtherRef.current.focus();
        }
    }, [data.economics_businessCapitalSource]);

    useEffect(() => {
        if (data.economics_businessPermit.includes('Lainnya') && businessPermitOtherRef.current) {
            businessPermitOtherRef.current.focus();
        }
    }, [data.economics_businessPermit]);

    useEffect(() => {
        if (data.economics_businessMarketing.includes('Lainnya') && businessMarketingOtherRef.current) {
            businessMarketingOtherRef.current.focus();
        }
    }, [data.economics_businessMarketing]);

    useEffect(() => {
        if (data.economics_businessIssues === 'Lainnya' && businessIssuesOtherRef.current) {
            businessIssuesOtherRef.current.focus();
        }
    }, [data.economics_businessIssues]);

    useEffect(() => {
        if (data.economics_businessTraining === 'Lainnya' && businessTrainingOtherRef.current) {
            businessTrainingOtherRef.current.focus();
        }
    }, [data.economics_businessTraining]);

    useEffect(() => {
        if (data.economics_spouseOccupation === 'Lainnya' && spouseOtherRef.current) {
            spouseOtherRef.current.focus();
        }
    }, [data.economics_spouseOccupation]);

    useEffect(() => {
        const head = getIncomeNumericValues(data.economics_headIncomeRange || '', data.economics_headIncomeRangeDetailed || '');
        const spouse = getIncomeNumericValues(data.economics_spouseIncomeRange || '', data.economics_spouseIncomeRangeDetailed || '');

        const maxHead = head.max === Infinity ? head.min * 1.5 : head.max;
        const maxSpouse = spouse.max === Infinity ? spouse.min * 1.5 : spouse.max;

        const totalMid = ((head.min + maxHead) / 2) + ((spouse.min + maxSpouse) / 2);

        let inferredRange = '';
        let inferredDetailed = '';
        if (totalMid >= 12000000) { inferredRange = '≥ Rp 6.500.000'; inferredDetailed = '> Rp 12.000.000'; }
        else if (totalMid >= 6500000) { inferredRange = '≥ Rp 6.500.000'; inferredDetailed = 'Rp 6.500.000 - 12.000.000'; }
        else if (totalMid >= 4000000) { inferredRange = 'Rp 4.000.000 - 6.500.000'; }
        else if (totalMid >= 2800000) { inferredRange = 'Rp 2.800.000 - 4.000.000'; }
        else if (totalMid >= 1800000) { inferredRange = 'Rp 1.800.000 - 2.800.000'; }
        else if (totalMid >= 1100000) { inferredRange = 'Rp 1.100.000 - 1.800.000'; }
        else if (totalMid >= 750000) { inferredRange = 'Rp 750.000 - 1.100.000'; }
        else if (totalMid >= 600000) { inferredRange = 'Rp 600.000 - 750.000'; }
        else if (totalMid >= 500000) { inferredRange = 'Rp 500.000 - 600.000'; }
        else if (totalMid >= 0 && (data.economics_headIncomeRange || data.economics_spouseIncomeRange)) { inferredRange = '< Rp 500.000'; }

        if (data.economics_incomeRange !== inferredRange || data.economics_incomeRangeDetailed !== inferredDetailed) {
            update({ economics_incomeRange: inferredRange, economics_incomeRangeDetailed: inferredDetailed });
        }
    }, [
        data.economics_headIncomeRange, data.economics_headIncomeRangeDetailed,
        data.economics_spouseIncomeRange, data.economics_spouseIncomeRangeDetailed
    ]);

    useEffect(() => {
        if (data.economics_headIncomeRange !== '≥ Rp 6.500.000') {
            if (data.economics_headIncomeRangeDetailed) {
                update({ economics_headIncomeRangeDetailed: '' });
            }
        }
    }, [data.economics_headIncomeRange]);

    useEffect(() => {
        if (data.economics_spouseIncomeRange !== '≥ Rp 6.500.000') {
            if (data.economics_spouseIncomeRangeDetailed) {
                update({ economics_spouseIncomeRangeDetailed: '' });
            }
        }
    }, [data.economics_spouseIncomeRange]);

    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">paid</span>
                Sumber Pendapatan Utama Keluarga
            </h3>

            <div className="bg-slate-100/50 dark:bg-slate-800/50 p-5 rounded-2xl text-sm text-slate-700 dark:text-slate-200 flex items-start gap-4 mb-2 animate-fadeIn border border-slate-200 dark:border-slate-700/50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/40"></div>
                <span className="material-symbols-outlined text-primary text-2xl shrink-0">shield_locked</span>
                <p className="leading-relaxed font-semibold">
                    Kerahasiaan data bapak/ibu sangat kami jaga dan hanya digunakan untuk kepentingan pemetaan pelayanan gereja saja.
                </p>
            </div>

            {/* 1. Pekerjaan Utama Kepala Keluarga */}
            <div className="space-y-4" id="headOccupation">
                <SectionHeader title="Pekerjaan Utama Kepala Keluarga" tooltipText="Pilih pekerjaan utama yang memberikan penghasilan terbesar." />
                <FormSelect
                    id="headOccupation"
                    options={occupationOptions}
                    value={data.economics_headOccupation}
                    onChange={(val) => update({ economics_headOccupation: val })}
                    placeholder="Pilih Pekerjaan..."
                    required={true}
                />
                {data.economics_headOccupation === 'Lainnya' && (
                    <div className="animate-fadeIn mt-2">
                        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Pekerjaan Lainnya:</label>
                        <input
                            ref={headOtherRef}
                            type="text"
                            id="headOccupationOther"
                            className={otherInputClass}
                            placeholder="Tuliskan pekerjaan..."
                            value={data.economics_headOccupationOther}
                            onChange={(e) => update({ economics_headOccupationOther: e.target.value })}
                        />
                    </div>
                )}
            </div>

            {/* Range Pendapatan Kepala Keluarga */}
            <div className="space-y-4" id="headIncomeRange">
                <SectionHeader title="Range Pendapatan Utama Kepala Keluarga (per bulan)" tooltipText="Pendapatan utama dari pekerjaan kepala keluarga." />
                <FormSelect
                    id="headIncomeRange"
                    options={incomeRanges}
                    value={data.economics_headIncomeRange}
                    onChange={(val) => update({ economics_headIncomeRange: val })}
                    placeholder="Pilih Range Pendapatan..."
                    required={true}
                />
                {data.economics_headIncomeRange === '≥ Rp 6.500.000' && (
                    <div className="animate-fadeIn mt-4 pl-4 border-l-2 border-primary/20 space-y-2">
                        <SectionHeader title="Detail Range Pendapatan Kepala Keluarga (≥ Rp 6.500.000)" icon="tune" tooltipText="Pilih detail range untuk pendapatan kepala keluarga di atas 6,5 juta." />
                        <FormSelect
                            id="headIncomeRangeDetailed"
                            options={detailedIncomeRanges}
                            value={data.economics_headIncomeRangeDetailed || ''}
                            onChange={(val) => update({ economics_headIncomeRangeDetailed: val })}
                            placeholder="Pilih Detail Pendapatan..."
                            required={true}
                        />
                    </div>
                )}
            </div>

            {/* 2. Pekerjaan Utama Istri */}
            <div className="space-y-4" id="spouseOccupation">
                <SectionHeader title="Pekerjaan Utama Istri/Suami" description="Opsional / Jika ada" tooltipText="Pilih pekerjaan pasangan jika ada." />
                <FormSelect
                    id="spouseOccupation"
                    options={occupationOptions}
                    value={data.economics_spouseOccupation}
                    onChange={(val) => update({ economics_spouseOccupation: val })}
                    placeholder="Pilih Pekerjaan..."
                    required={true}
                />
                {data.economics_spouseOccupation === 'Lainnya' && (
                    <div className="animate-fadeIn mt-2">
                        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Pekerjaan Lainnya:</label>
                        <input
                            ref={spouseOtherRef}
                            type="text"
                            id="spouseOccupationOther"
                            className={otherInputClass}
                            placeholder="Tuliskan pekerjaan..."
                            value={data.economics_spouseOccupationOther}
                            onChange={(e) => update({ economics_spouseOccupationOther: e.target.value })}
                        />
                    </div>
                )}
            </div>

            {/* Range Pendapatan Istri/Suami */}
            <div className="space-y-4" id="spouseIncomeRange">
                <SectionHeader title="Range Pendapatan Utama Istri/Suami (per bulan)" tooltipText="Pendapatan utama dari pekerjaan istri/suami." description="Kosongkan jika tidak ada" />
                <FormSelect
                    id="spouseIncomeRange"
                    options={incomeRanges}
                    value={data.economics_spouseIncomeRange}
                    onChange={(val) => update({ economics_spouseIncomeRange: val })}
                    placeholder="Pilih Range Pendapatan..."
                    required={false}
                />
                {data.economics_spouseIncomeRange === '≥ Rp 6.500.000' && (
                    <div className="animate-fadeIn mt-4 pl-4 border-l-2 border-primary/20 space-y-2">
                        <SectionHeader title="Detail Range Pendapatan Istri/Suami (≥ Rp 6.500.000)" icon="tune" tooltipText="Pilih detail range untuk pendapatan istri/suami di atas 6,5 juta." />
                        <FormSelect
                            id="spouseIncomeRangeDetailed"
                            options={detailedIncomeRanges}
                            value={data.economics_spouseIncomeRangeDetailed || ''}
                            onChange={(val) => update({ economics_spouseIncomeRangeDetailed: val })}
                            placeholder="Pilih Detail Pendapatan..."
                            required={false}
                        />
                    </div>
                )}
            </div>

            {/* 3. Range Pendapatan Keseluruhan (Auto) */}
            <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Total Range Pendapatan Rumah Tangga</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total estimasi range pendapatan per bulan</p>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-primary transition-colors duration-300">
                    {data.economics_incomeRange === '≥ Rp 6.500.000' && data.economics_incomeRangeDetailed
                        ? data.economics_incomeRangeDetailed
                        : (data.economics_incomeRange || "-")}
                </div>
            </div>

            {/* 4. Estimasi Pengeluaran Rumah Tangga */}
            <div className="space-y-6 pt-8 mt-4 relative z-[30]">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
                    <span className="material-symbols-outlined text-primary">price_change</span>
                    Estimasi Pengeluaran Rumah Tangga (per bulan)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                            Konsumsi Pangan <span className="text-xs font-normal text-slate-500">(Beras, Lauk-pauk, Minyak, dll)</span><span className="text-red-500">*</span> <FormTooltip text="Estimasi biaya makan minum sehari-hari." />
                        </label>
                        <FormatRupiah value={data.economics_expense_food} onChange={(val) => update({ economics_expense_food: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                            Kebutuhan Dasar Non-Pangan 1 <span className="text-xs font-normal text-slate-500">(Listrik, Air, BBM, dll)</span><span className="text-red-500">*</span> <FormTooltip text="Biaya operasional rumah tangga rutin." />
                        </label>
                        <FormatRupiah value={data.economics_expense_utilities} onChange={(val) => update({ economics_expense_utilities: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                            Kebutuhan Dasar Non-Pangan 2 <span className="text-xs font-normal text-slate-500">(Rokok, Sirih Pinang, Pulsa, Paket Data, dll)</span><span className="text-red-500">*</span> <FormTooltip text="Biaya konsumsi tambahan di luar kebutuhan pokok." />
                        </label>
                        <FormatRupiah value={data.economics_expense_nonPanganII} onChange={(val) => update({ economics_expense_nonPanganII: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                            Beban Pinjaman Bank/Koperasi <span className="text-xs font-normal text-slate-500">(Pinjaman Bank/Koperasi)</span><span className="text-red-500">*</span> <FormTooltip text="Cicilan bulanan yang harus dibayar." />
                        </label>
                        <FormatRupiah value={data.economics_expense_loan} onChange={(val) => update({ economics_expense_loan: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                            Pendidikan & Kesehatan <span className="text-xs font-normal text-slate-500">(SPP, Obat, dsb)</span><span className="text-red-500">*</span> <FormTooltip text="Biaya sekolah anak dan biaya berobat." />
                        </label>
                        <FormatRupiah value={data.economics_expense_education} onChange={(val) => update({ economics_expense_education: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                            Kebutuhan Lainnya <span className="text-xs font-normal text-slate-500">(Pakaian, Hiburan, Tabungan)</span><span className="text-red-500">*</span> <FormTooltip text="Biaya transportasi, pakaian, atau hiburan." />
                        </label>
                        <FormatRupiah value={data.economics_expense_other} onChange={(val) => update({ economics_expense_other: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                            Kebutuhan Tak Terduga <span className="text-xs font-normal text-slate-500">(Kumpul keluarga, Dukacita, Sumbangan lainnya, dll)</span><span className="text-red-500">*</span> <FormTooltip text="Biaya transportasi, pakaian, atau hiburan." />
                        </label>
                        <FormatRupiah value={data.economics_expense_unexpected} onChange={(val) => update({ economics_expense_unexpected: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2 relative z-10">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                            Kebutuhan Peribadatan <span className="text-xs font-normal text-slate-500">(Kumpul keluarga, Dukacita, Sumbangan lainnya, dll)</span><span className="text-red-500">*</span> <FormTooltip text="Biaya transportasi, pakaian, atau hiburan." />
                        </label>
                        <FormatRupiah value={data.economics_expense_worship} onChange={(val) => update({ economics_expense_worship: val })} required={true} />
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Total Pengeluaran */}
                    <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Total Pengeluaran Rumah Tangga</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Total estimasi pengeluaran per bulan</p>
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-primary transition-colors duration-300">
                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(
                                (data.economics_expense_food || 0) +
                                (data.economics_expense_utilities || 0) +
                                (data.economics_expense_nonPanganII || 0) +
                                (data.economics_expense_loan || 0) +
                                (data.economics_expense_education || 0) +
                                (data.economics_expense_other || 0) +
                                (data.economics_expense_unexpected || 0) +
                                (data.economics_expense_worship || 0)
                            )}
                        </div>
                    </div>

                    {/* Sisa Pendapatan */}
                    {(() => {
                        const totalExpenses = (data.economics_expense_food || 0) +
                            (data.economics_expense_utilities || 0) +
                            (data.economics_expense_nonPanganII || 0) +
                            (data.economics_expense_loan || 0) +
                            (data.economics_expense_education || 0) +
                            (data.economics_expense_other || 0) +
                            (data.economics_expense_unexpected || 0) +
                            (data.economics_expense_worship || 0);

                        const incomeStr = data.economics_incomeRange === '≥ Rp 6.500.000' && data.economics_incomeRangeDetailed ? data.economics_incomeRangeDetailed : (data.economics_incomeRange || '');
                        const parsedIncome = getIncomeNumericValues(data.economics_incomeRange || '', data.economics_incomeRangeDetailed || '');

                        if (!parsedIncome || (parsedIncome.min === 0 && parsedIncome.max === 0 && incomeStr !== '< Rp 500.000')) {
                            return (
                                <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-300"></div>
                                    <div>
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Sisa Pendapatan Rumah Tangga</h4>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Selisih total pendapatan dan pengeluaran</p>
                                    </div>
                                    <div className="text-3xl font-black text-slate-400">-</div>
                                </div>
                            );
                        }

                        const minRemain = parsedIncome.min - totalExpenses;
                        const maxRemain = parsedIncome.max - totalExpenses;
                        const format = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

                        let displayStr = '';
                        let isNegative = maxRemain < 0;
                        let isWarning = minRemain < 0 && maxRemain >= 0;

                        if (parsedIncome.max === Infinity) {
                            displayStr = `> ${format(minRemain)}`;
                            isNegative = minRemain < 0;
                            isWarning = false;
                        } else {
                            displayStr = `${format(minRemain)} s/d ${format(maxRemain)}`;
                        }

                        const textColorClass = isNegative ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500';
                        const bgColorClass = isNegative ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500';

                        return (
                            <div className="bg-slate-50 dark:bg-slate-800/20 p-6 rounded-2xl border-2 border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 w-1.5 h-full ${bgColorClass}`}></div>
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Sisa Pendapatan Rumah Tangga</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        Selisih total pendapatan dan pengeluaran
                                        {isNegative && <FormTooltip text="Peringatan: Total pengeluaran melebihi batas maksimal estimasi pendapatan keluarga." />}
                                        {isWarning && <FormTooltip text="Perhatian: Total pengeluaran mungkin melebihi pendapatan tergantung nominal aslinya." />}
                                    </p>
                                </div>
                                <div className={`text-2xl md:text-3xl font-black transition-colors duration-300 ${textColorClass}`}>
                                    {displayStr}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* 5. Kepemilikan Usaha Ekonomi Keluarga */}
            <div className="space-y-6 pt-8 mt-4 relative z-[20]">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
                    <span className="material-symbols-outlined text-primary">storefront</span>
                    Kepemilikan Usaha Ekonomi Keluarga
                </h3>

                <FormRadioGroup
                    label="Apakah keluarga memiliki usaha ekonomi produktif?"
                    name="hasBusiness"
                    id="hasBusiness"
                    options={['Ya', 'Tidak']}
                    value={data.economics_hasBusiness}
                    onChange={(val) => update({ economics_hasBusiness: val as 'Ya' | 'Tidak' })}
                    columns={2}
                    required={true}
                    tooltipText="Usaha yang dijalankan untuk menambah penghasilan keluarga."
                />

                {/* Conditional Business Questions */}
                {data.economics_hasBusiness === 'Ya' && (
                    <div className="space-y-6 pl-4 border-l-2 border-primary/20 animate-fadeIn">

                        {/* Nama Usaha */}
                        <div className="flex flex-col group relative z-10">
                            <label className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal pb-2 flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300 z-10">
                                Nama Jenis Usaha/Brand <span className="text-red-500">*</span> <FormTooltip text="Nama usaha yang dijalankan." />
                            </label>
                            <textarea
                                className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all duration-200 resize-none h-24 capitalize text-base"
                                placeholder="Contoh: Kios Mama Maria"
                                value={data.economics_businessName}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const capitalized = val.charAt(0).toUpperCase() + val.slice(1);
                                    update({ economics_businessName: capitalized });
                                }}
                            />
                        </div>

                        {/* Jenis Usaha */}
                        <FormSelect
                            label="Jenis Usaha"
                            id="businessType"
                            options={['Perdagangan', 'Kuliner', 'Jasa', 'Kerajinan', 'Peternakan', 'Pertanian/Perkebunan', 'Lainnya']}
                            value={data.economics_businessType}
                            onChange={(val) => update({ economics_businessType: val })}
                            placeholder="Pilih Jenis Usaha..."
                            required={true}
                            tooltipText="Kategori bidang usaha."
                        />
                        {data.economics_businessType === 'Lainnya' && (
                            <div className="mt-2 animate-fadeIn">
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Jenis Usaha Lainnya:</label>
                                <input
                                    ref={businessTypeOtherRef}
                                    type="text"
                                    className={otherInputClass}
                                    placeholder="Tuliskan jenis usaha..."
                                    value={data.economics_businessTypeOther}
                                    onChange={(e) => update({ economics_businessTypeOther: e.target.value })}
                                />
                            </div>
                        )}

                        {/* Lama Usaha */}
                        <FormSelect
                            label="Lama Usaha Berjalan"
                            id="businessDuration"
                            options={['< 1 tahun', '1-3 tahun', '4-5 tahun', '> 5 tahun']}
                            value={data.economics_businessDuration}
                            onChange={(val) => update({ economics_businessDuration: val })}
                            placeholder="Pilih Lama Usaha..."
                            required={true}
                            tooltipText="Sudah berapa lama usaha ini ditekuni."
                        />
                        {data.economics_businessDuration === '> 5 tahun' && (
                            <div className="mt-2 animate-fadeIn relative z-10">
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1 z-10">Sudah berapa tahun? <FormTooltip text="Tulis angka tahun saja." /></label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className={otherInputClass}
                                    placeholder="Contoh: 10"
                                    value={data.economics_businessDurationYears || ''}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        update({ economics_businessDurationYears: val ? parseInt(val) : 0 });
                                    }}
                                />
                            </div>
                        )}

                        {/* Status Usaha */}
                        <FormSelect
                            label="Status Usaha"
                            id="businessStatus"
                            options={['Milik Sendiri', 'Usaha Keluarga', 'Kerja Sama', 'Lainnya']}
                            value={data.economics_businessStatus}
                            onChange={(val) => update({ economics_businessStatus: val })}
                            placeholder="Pilih Status Usaha..."
                            required={true}
                            tooltipText="Kepemilikan usaha."
                        />
                        {data.economics_businessStatus === 'Lainnya' && (
                            <div className="mt-2 animate-fadeIn">
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Status Lainnya:</label>
                                <input
                                    ref={businessStatusOtherRef}
                                    type="text"
                                    className={otherInputClass}
                                    placeholder="Tuliskan status usaha..."
                                    value={data.economics_businessStatusOther}
                                    onChange={(e) => update({ economics_businessStatusOther: e.target.value })}
                                />
                            </div>
                        )}

                        {/* Lokasi Usaha */}
                        <FormSelect
                            label="Lokasi Usaha"
                            id="businessLocation"
                            options={['Rumah', 'Toko/Kios', 'Pasar', 'Online', 'Lainnya']}
                            value={data.economics_businessLocation}
                            onChange={(val) => update({ economics_businessLocation: val })}
                            placeholder="Pilih Lokasi Usaha..."
                            required={true}
                            tooltipText="Tempat utama menjalankan usaha."
                        />
                        {data.economics_businessLocation === 'Lainnya' && (
                            <div className="mt-2 animate-fadeIn">
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Lokasi Lainnya:</label>
                                <input
                                    ref={businessLocationOtherRef}
                                    type="text"
                                    className={otherInputClass}
                                    placeholder="Tuliskan lokasi usaha..."
                                    value={data.economics_businessLocationOther}
                                    onChange={(e) => update({ economics_businessLocationOther: e.target.value })}
                                />
                            </div>
                        )}

                        {/* Tenaga Kerja */}
                        <FormSelect
                            label="Jumlah Tenaga Kerja"
                            id="businessEmployeeCount"
                            options={['Dikelola sendiri', '1-2 Orang', '3-5 Orang', '> 5 Orang']}
                            value={data.economics_businessEmployeeCount}
                            onChange={(val) => update({ economics_businessEmployeeCount: val })}
                            placeholder="Pilih Jumlah..."
                            required={true}
                            tooltipText="Termasuk pemilik jika ikut bekerja."
                        />

                        {/* Modal Awal */}
                        <div className="flex flex-col gap-2 relative z-10">
                            <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                                Modal Awal Usaha <span className="text-red-500">*</span> <FormTooltip text="Perkiraan modal saat pertama kali memulai usaha." />
                            </label>
                            <FormatRupiah value={data.economics_businessCapital} onChange={(val) => update({ economics_businessCapital: val })} required={true} />
                        </div>

                        {/* Sumber Modal */}
                        <div className="space-y-2">
                            <FormSelect
                                label="Sumber Modal Utama"
                                id="businessCapitalSource"
                                options={['Dana sendiri', 'Pinjaman Bank', 'Pinjaman Koperasi', 'Bantuan Pemerintah', 'Lainnya']}
                                value={data.economics_businessCapitalSource}
                                onChange={(val) => update({ economics_businessCapitalSource: val })}
                                placeholder="Pilih Sumber Modal..."
                                required={true}
                                tooltipText="Asal modal yang paling besar."
                            />
                            {data.economics_businessCapitalSource === 'Lainnya' && (
                                <div className="mt-2 animate-fadeIn">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Sumber Lainnya:</label>
                                    <input
                                        ref={businessCapitalSourceOtherRef}
                                        type="text"
                                        id="businessCapitalSourceOther"
                                        className={otherInputClass}
                                        placeholder="Tuliskan sumber modal..."
                                        value={data.economics_businessCapitalSourceOther}
                                        onChange={(e) => update({ economics_businessCapitalSourceOther: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Izin Usaha */}
                        <div className="space-y-2 mt-4">
                            <FormMultiSelect
                                label="Apakah memiliki Izin Usaha?"
                                id="businessPermit"
                                options={['Tidak ada', 'SKU', 'NIB', 'SIUP', 'SITU', 'SIUI', 'Lainnya']}
                                value={data.economics_businessPermit}
                                onChange={(val) => update({ economics_businessPermit: val })}
                                placeholder="Pilih Status Izin..."
                                required={true}
                                tooltipText="Pilih legalitas yang dimiliki."
                            />
                            {data.economics_businessPermit.includes('Lainnya') && (
                                <div className="animate-fadeIn mt-2">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Jenis Izin Lainnya:</label>
                                    <input
                                        ref={businessPermitOtherRef}
                                        type="text"
                                        id="businessPermitOther"
                                        className={otherInputClass}
                                        placeholder="Tuliskan jenis izin usaha..."
                                        value={data.economics_businessPermitOther}
                                        onChange={(e) => update({ economics_businessPermitOther: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {/* Cara Pemasaran */}
                            <div className="space-y-2">
                                <FormMultiSelect
                                    label="Cara Pemasaran Utama"
                                    id="businessMarketing"
                                    options={['Offline/Toko fisik', 'WhatsApp/Media Sosial', 'Marketplace (Shopee/Tokped)', 'Titip di warung/toko', 'Lainnya']}
                                    value={data.economics_businessMarketing}
                                    onChange={(val) => update({ economics_businessMarketing: val })}
                                    placeholder="Pilih Cara Pemasaran (Bisa > 1)..."
                                    required={true}
                                    tooltipText="Metode utama menjual produk/jasa."
                                />
                                {data.economics_businessMarketing.includes('Lainnya') && (
                                    <div className="mt-2 animate-fadeIn">
                                        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Media Lainnya:</label>
                                        <input
                                            ref={businessMarketingOtherRef}
                                            type="text"
                                            className={otherInputClass}
                                            placeholder="Sebutkan media pemasaran..."
                                            value={data.economics_businessMarketingOther}
                                            onChange={(e) => update({ economics_businessMarketingOther: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Wilayah Pemasaran */}
                            <FormSelect
                                label="Wilayah Pemasaran"
                                id="businessMarketArea"
                                options={['Sekitar lingkungan rumah', 'Satu kelurahan/kecamatan', 'Kota Kupang', 'Luar Kota Kupang (NTT)', 'Nasional/Luar NTT', 'Ekspor']}
                                value={data.economics_businessMarketArea}
                                onChange={(val) => update({ economics_businessMarketArea: val })}
                                placeholder="Pilih Wilayah Pemasaran..."
                                required={true}
                                tooltipText="Jangkauan pembeli."
                            />

                            {/* Tantangan Utama */}
                            <div className="space-y-2">
                                <FormSelect
                                    label="Tantangan utama usaha"
                                    id="businessIssues"
                                    options={['Modal', 'Bahan baku', 'Pemasaran', 'Manajemen', 'Tenaga kerja', 'Legalitas', 'Teknologi digital', 'Lainnya']}
                                    value={data.economics_businessIssues}
                                    onChange={(val) => update({ economics_businessIssues: val })}
                                    placeholder="Pilih Tantangan (Bisa > 1)..."
                                    required={true}
                                    tooltipText="Kendala yang paling sering dihadapi."
                                />
                                {data.economics_businessIssues === 'Lainnya' && (
                                    <div className="mt-2 animate-fadeIn">
                                        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Tantangan Lainnya:</label>
                                        <input
                                            ref={businessIssuesOtherRef}
                                            type="text"
                                            className={otherInputClass}
                                            placeholder="Sebutkan tantangan..."
                                            value={data.economics_businessIssuesOther}
                                            onChange={(e) => update({ economics_businessIssuesOther: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Dukungan Dibutuhkan */}
                            <FormSelect
                                label="Dukungan utama yang dibutuhkan saat ini"
                                id="businessNeeds"
                                options={['Tambahan modal', 'Pelatihan skill', 'Peralatan produksi', 'Izin usaha/Sertifikasi', 'Akses pasar', 'Pendampingan usaha']}
                                value={data.economics_businessNeeds}
                                onChange={(val) => update({ economics_businessNeeds: val })}
                                placeholder="Pilih Dukungan (Bisa > 1)..."
                                required={true}
                                tooltipText="Bantuan yang paling diharapkan untuk mengembangkan usaha."
                            />

                            {/* Pengetahuan Berbagi */}
                            <FormRadioGroup
                                label="Bersedia berbagi ilmu berusaha dengan jemaat lainnya?"
                                name="businessSharing"
                                id="businessSharing"
                                options={['Ya', 'Tidak']}
                                value={data.economics_businessSharing}
                                onChange={(val) => update({ economics_businessSharing: val as 'Ya' | 'Tidak' })}
                                columns={2}
                                required={true}
                                tooltipText="Kesediaan menjadi narasumber atau mentor."
                            />

                            {/* Minat Pelatihan */}
                            <div className="space-y-2">
                                <FormSelect
                                    label="Minat mengikuti pelatihan kewirausahaan"
                                    id="businessTraining"
                                    options={['Manajemen Usaha', 'Digital Marketing', 'Lainnya']}
                                    value={data.economics_businessTraining}
                                    onChange={(val) => update({ economics_businessTraining: val })}
                                    placeholder="Pilih Minat (Bisa > 1)..."
                                    required={true}
                                    tooltipText="Jenis pelatihan yang diinginkan."
                                />
                                {data.economics_businessTraining === 'Lainnya' && (
                                    <div className="mt-2 animate-fadeIn">
                                        <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan Minat Lainnya:</label>
                                        <input
                                            ref={businessTrainingOtherRef}
                                            type="text"
                                            className={otherInputClass}
                                            placeholder="Sebutkan minat pelatihan..."
                                            value={data.economics_businessTrainingOther}
                                            onChange={(e) => update({ economics_businessTrainingOther: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 6. Kepemilikan Rumah & Aset Keluarga */}
            <div className="space-y-6 pt-8 mt-4 relative z-[10]">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
                    <span className="material-symbols-outlined text-primary">home_work</span>
                    Kepemilikan Rumah & Aset Keluarga
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Rumah */}
                    <FormSelect
                        label="Status Rumah"
                        id="houseStatus"
                        options={['Milik sendiri', 'Kontrak', 'Keluarga', 'Menumpang']}
                        value={data.economics_houseStatus}
                        onChange={(val) => update({ economics_houseStatus: val })}
                        placeholder="Pilih Status Rumah..."
                        required={true}
                        tooltipText="Status kepemilikan tempat tinggal saat ini."
                    />

                    {/* Tipe Rumah */}
                    <FormSelect
                        label="Tipe Rumah"
                        id="houseType"
                        options={['Permanen', 'Semi permanen', 'Darurat']}
                        value={data.economics_houseType}
                        onChange={(val) => {
                            update({ economics_houseType: val });
                            if (val !== 'Permanen') update({ economics_houseIMB: '' });
                        }}
                        placeholder="Pilih Tipe Rumah..."
                        required={true}
                        tooltipText="Kondisi bangunan fisik rumah."
                    />

                    {/* IMB (Conditional) */}
                    {data.economics_houseType === 'Permanen' && (
                        <div className="col-span-1 md:col-span-2">
                            <FormRadioGroup
                                label="Apakah memiliki Izin Mendirikan Bangunan (IMB)?"
                                name="houseIMB"
                                options={['Memiliki IMB', 'Tidak memiliki IMB']}
                                value={data.economics_houseIMB}
                                onChange={(val) => update({ economics_houseIMB: val })}
                                columns={2}
                                required={true}
                                tooltipText="Legalitas bangunan tempat tinggal."
                            />
                        </div>
                    )}
                </div>

                {/* Kepemilikan Aset */}
                <div className="space-y-6 pt-4">
                    <div className="space-y-4">
                        <SectionHeader title="Apakah keluarga bapak/ibu memiliki aset Transportasi/Elektronik/Lahan?" tooltipText="Pilih Ya jika memiliki salah satu atau lebih aset berharga." />
                        <FormRadioGroup
                            name="hasAssets"
                            options={['Ya', 'Tidak ada']}
                            value={data.economics_hasAssets}
                            onChange={(val) => {
                                update({
                                    economics_hasAssets: val as 'Ya' | 'Tidak ada',
                                    economics_totalAssets: val === 'Tidak ada' ? 0 : data.economics_totalAssets
                                });
                                if (val === 'Tidak ada') {
                                    update({
                                        economics_assets: [],
                                        economics_asset_motor_qty: 0,
                                        economics_asset_mobil_qty: 0,
                                        economics_asset_kulkas_qty: 0,
                                        economics_asset_laptop_qty: 0,
                                        economics_asset_tv_qty: 0,
                                        economics_asset_internet_qty: 0,
                                        economics_asset_lahan_qty: 0
                                    });
                                }
                            }}
                            columns={2}
                            required={true}
                        />
                    </div>

                    {data.economics_hasAssets === 'Ya' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="space-y-4 animate-fadeIn mt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { label: 'Motor', key: 'economics_asset_motor_qty', icon: 'motorcycle' },
                                        { label: 'Mobil', key: 'economics_asset_mobil_qty', icon: 'directions_car' },
                                        { label: 'Kulkas', key: 'economics_asset_kulkas_qty', icon: 'kitchen' },
                                        { label: 'Laptop/Komputer', key: 'economics_asset_laptop_qty', icon: 'laptop' },
                                        { label: 'Televisi', key: 'economics_asset_tv_qty', icon: 'tv' },
                                        { label: 'Internet/Indihome', key: 'economics_asset_internet_qty', icon: 'wifi' },
                                        { label: 'Lahan Pertanian', key: 'economics_asset_lahan_qty', icon: 'potted_plant' }
                                    ].map((asset) => {
                                        const assetKey = asset.key as keyof typeof data;
                                        const currentVal = (data[assetKey] as number) || 0;
                                        const allocatedAssets = (data.economics_asset_motor_qty || 0) +
                                            (data.economics_asset_mobil_qty || 0) +
                                            (data.economics_asset_kulkas_qty || 0) +
                                            (data.economics_asset_laptop_qty || 0) +
                                            (data.economics_asset_tv_qty || 0) +
                                            (data.economics_asset_internet_qty || 0) +
                                            (data.economics_asset_lahan_qty || 0);

                                        return (
                                            <div key={asset.label} className="p-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-800/30 hover:border-primary/40 transition-all duration-300 overflow-hidden shadow-sm">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                                                            <span className="material-symbols-outlined text-primary text-xl">{asset.icon}</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{asset.label}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 shrink-0">
                                                        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Jml:</span>
                                                        <div className="w-20">
                                                            <CountSelect
                                                                id={asset.key}
                                                                value={currentVal}
                                                                max={30}
                                                                onChange={(numVal) => {
                                                                    const newAllocatedAssets = allocatedAssets - currentVal + numVal;

                                                                    // Sync with economics_assets array for summary display if needed
                                                                    let currentAssets = [...(data.economics_assets || [])];
                                                                    if (numVal > 0) {
                                                                        if (!currentAssets.includes(asset.label)) {
                                                                            currentAssets.push(asset.label);
                                                                        }
                                                                    } else {
                                                                        currentAssets = currentAssets.filter(a => a !== asset.label);
                                                                    }
                                                                    update({
                                                                        [asset.key]: numVal,
                                                                        economics_assets: currentAssets,
                                                                        economics_totalAssets: newAllocatedAssets
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Summary of Assets */}
                                {(() => {
                                    const allocated = (data.economics_asset_motor_qty || 0) +
                                        (data.economics_asset_mobil_qty || 0) +
                                        (data.economics_asset_kulkas_qty || 0) +
                                        (data.economics_asset_laptop_qty || 0) +
                                        (data.economics_asset_tv_qty || 0) +
                                        (data.economics_asset_internet_qty || 0) +
                                        (data.economics_asset_lahan_qty || 0);

                                    return (
                                        <div className="animate-fadeIn mt-4">
                                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/60 group-hover:bg-primary transition-colors"></div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Total Keseluruhan Aset</h4>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">Total unit aset yang didata</p>
                                                </div>
                                                <div className="text-3xl font-black text-primary transition-colors duration-300">
                                                    {allocated} <span className="text-sm font-semibold text-slate-500">Unit</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Kepemilikan Tanah */}
                    <FormSelect
                        label="Status Kepemilikan Tanah"
                        id="landStatus"
                        options={['SHM', 'Tidak ada SHM', 'Pelepasan Hak', 'Jaga tanah orang']}
                        value={data.economics_landStatus}
                        onChange={(val) => update({ economics_landStatus: val })}
                        placeholder="Pilih Status Tanah..."
                        required={true}
                    />

                    {/* Jenis Sumber Air Minum */}
                    <FormMultiSelect
                        label="Jenis sumber air minum utama"
                        id="waterSource"
                        options={['Air Kemasan/Isi Ulang', 'PDAM', 'Sumur Gali/Pompa']}
                        value={data.economics_waterSource}
                        onChange={(val) => update({ economics_waterSource: val })}
                        placeholder="Pilih Sumber Air..."
                        required={true}
                    />

                    {/* Daya Listrik (Multi-select with Quantities) */}
                    <div className="space-y-6">
                        <FormMultiSelect
                            label="Daya listrik terpasang (Bisa pilih > 1)"
                            id="electricity_capacities"
                            options={['450 KVA', '900 KVA', '1.200 KVA', '2.200 KVA', '5.000 KVA']}
                            value={data.economics_electricity_capacities}
                            onChange={(val) => {
                                update({ economics_electricity_capacities: val });
                                // Reset quantities for unselected options
                                const options = ['450 KVA', '900 KVA', '1.200 KVA', '2.200 KVA', '5.000 KVA'];
                                const updates: any = {};
                                options.forEach(opt => {
                                    if (!val.includes(opt)) {
                                        const key = `economics_electricity_${opt.replace(/\D/g, '')}_qty`;
                                        updates[key] = 0;
                                    }
                                });
                                update(updates);
                            }}
                            placeholder="Pilih Daya Listrik..."
                            required={true}
                        />

                        {data.economics_electricity_capacities.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn pl-4 border-l-2 border-primary/20">
                                {data.economics_electricity_capacities.map((cap) => {
                                    const fieldKey = `economics_electricity_${cap.replace(/\D/g, '')}_qty` as keyof FormData;
                                    return (
                                        <div key={cap} className="p-4 border-2 border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-800/30 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary text-xl">bolt</span>
                                                </div>
                                                <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{cap}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">Jumlah:</span>
                                                <div className="w-20">
                                                    <CountSelect
                                                        id={fieldKey}
                                                        value={data[fieldKey] as number || 0}
                                                        onChange={(num) => update({ [fieldKey]: num })}
                                                        max={10}
                                                        startFrom={1}
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Step5Economics;
