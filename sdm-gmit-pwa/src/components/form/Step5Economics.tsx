import React, { useRef, useEffect } from 'react';
import { type FormData } from '../../types';
import FormRadioGroup from '../ui/FormRadioGroup';
import FormSelect from '../ui/FormSelect';
import FormMultiSelect from '../ui/FormMultiSelect';
import SectionHeader from '../ui/SectionHeader';

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
    'Rp 500.000 - 999.000',
    'Rp 1.000.000 - 1.999.000',
    'Rp 2.000.000 - 2.999.000',
    'Rp 3.000.000 - 3.999.000',
    'Rp 4.000.000 - 4.999.000',
    '≥ Rp 5.000.000'
];

const detailedIncomeRanges = [
    'Rp 5.000.000 - 10.000.000',
    'Rp 10.000.000 - 20.000.000',
    '> Rp 20.000.000'
];

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

    useEffect(() => {
        if (data.economics_headOccupation === 'Lainnya' && headOtherRef.current) {
            headOtherRef.current.focus();
        }
    }, [data.economics_headOccupation]);

    useEffect(() => {
        if (data.economics_spouseOccupation === 'Lainnya' && spouseOtherRef.current) {
            spouseOtherRef.current.focus();
        }
    }, [data.economics_spouseOccupation]);

    useEffect(() => {
        if (data.economics_incomeRange !== '≥ Rp 5.000.000') {
            if (data.economics_incomeRangeDetailed) {
                update({ economics_incomeRangeDetailed: '' });
            }
        }
    }, [data.economics_incomeRange]);

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
                <SectionHeader title="Pekerjaan Utama Kepala Keluarga" />
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

            {/* 2. Pekerjaan Utama Istri */}
            <div className="space-y-4" id="spouseOccupation">
                <SectionHeader title="Pekerjaan Utama Istri" description="Opsional / Jika ada" />
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

            {/* 3. Range Pendapatan */}
            <div className="space-y-4" id="incomeRange">
                <SectionHeader title="Range Pendapatan Rumah Tangga (per bulan)" />
                <FormSelect
                    id="incomeRange"
                    options={incomeRanges}
                    value={data.economics_incomeRange}
                    onChange={(val) => update({ economics_incomeRange: val })}
                    placeholder="Pilih Range Pendapatan..."
                    required={true}
                />
                {data.economics_incomeRange === '≥ Rp 5.000.000' && (
                    <div className="animate-fadeIn mt-4 pl-4 border-l-2 border-primary/20 space-y-2">
                        <SectionHeader title="Detail Range Pendapatan (≥ Rp 5.000.000)" icon="tune" />
                        <FormSelect
                            id="incomeRangeDetailed"
                            options={detailedIncomeRanges}
                            value={data.economics_incomeRangeDetailed || ''}
                            onChange={(val) => update({ economics_incomeRangeDetailed: val })}
                            placeholder="Pilih Detail Pendapatan..."
                            required={true}
                        />
                    </div>
                )}
            </div>

            {/* 4. Estimasi Pengeluaran Rumah Tangga */}
            <div className="space-y-6 pt-8 mt-4 relative z-[30]">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
                    <span className="material-symbols-outlined text-primary">price_change</span>
                    Estimasi Pengeluaran Rumah Tangga (per bulan)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
                            Konsumsi Pangan <span className="text-xs font-normal text-slate-500">(Beras, Lauk-pauk, Minyak, dsb)</span><span className="text-red-500">*</span>
                        </label>
                        <FormatRupiah value={data.economics_expense_food} onChange={(val) => update({ economics_expense_food: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
                            Kebutuhan Dasar Non-Pangan <span className="text-xs font-normal text-slate-500">(Listrik, Air, BBM, Pulsa)</span><span className="text-red-500">*</span>
                        </label>
                        <FormatRupiah value={data.economics_expense_utilities} onChange={(val) => update({ economics_expense_utilities: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
                            Pendidikan dan Kesehatan <span className="text-xs font-normal text-slate-500">(SPP, Obat, dsb)</span><span className="text-red-500">*</span>
                        </label>
                        <FormatRupiah value={data.economics_expense_education} onChange={(val) => update({ economics_expense_education: val })} required={true} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
                            Kebutuhan Lainnya <span className="text-xs font-normal text-slate-500">(Pakaian, Hiburan, Tabungan)</span><span className="text-red-500">*</span>
                        </label>
                        <FormatRupiah value={data.economics_expense_other} onChange={(val) => update({ economics_expense_other: val })} required={true} />
                    </div>
                </div>

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
                            (data.economics_expense_education || 0) +
                            (data.economics_expense_other || 0)
                        )}
                    </div>
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
                />

                {/* Conditional Business Questions */}
                {data.economics_hasBusiness === 'Ya' && (
                    <div className="space-y-6 pl-4 border-l-2 border-primary/20 animate-fadeIn">

                        {/* Nama Usaha */}
                        <div className="flex flex-col group relative">
                            <label className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal pb-2 flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300">
                                Nama Jenis Usaha/Brand <span className="text-red-500">*</span>
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
                        />
                        {data.economics_businessType === 'Lainnya' && (
                            <input type="text" className={otherInputClass} placeholder="Sebutkan jenis usaha..." value={data.economics_businessTypeOther} onChange={(e) => update({ economics_businessTypeOther: e.target.value })} />
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
                        />
                        {data.economics_businessDuration === '> 5 tahun' && (
                            <div className="mt-2 animate-fadeIn">
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sudah berapa tahun?</label>
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
                        />
                        {data.economics_businessStatus === 'Lainnya' && (
                            <input type="text" className={otherInputClass} placeholder="Sebutkan status usaha..." value={data.economics_businessStatusOther} onChange={(e) => update({ economics_businessStatusOther: e.target.value })} />
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
                        />
                        {data.economics_businessLocation === 'Lainnya' && (
                            <input type="text" className={otherInputClass} placeholder="Sebutkan lokasi usaha..." value={data.economics_businessLocationOther} onChange={(e) => update({ economics_businessLocationOther: e.target.value })} />
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
                        />

                        {/* Modal Awal */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
                                Modal Awal Usaha <span className="text-red-500">*</span>
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
                            />
                            {data.economics_businessCapitalSource === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan sumber modal..." value={data.economics_businessCapitalSourceOther} onChange={(e) => update({ economics_businessCapitalSourceOther: e.target.value })} />
                            )}
                        </div>

                        {/* Izin Usaha */}
                        <div className="space-y-2">
                            <FormSelect
                                label="Apakah memiliki Izin Usaha (NIB/PIRT/dsb)?"
                                id="businessPermit"
                                options={['Sudah memiliki', 'Sedang dalam proses', 'Belum memiliki', 'Lainnya']}
                                value={data.economics_businessPermit}
                                onChange={(val) => update({ economics_businessPermit: val })}
                                placeholder="Pilih Status Izin..."
                                required={true}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                />
                                {data.economics_businessMarketing.includes('Lainnya') && (
                                    <input type="text" className={otherInputClass} placeholder="Sebutkan media pemasaran..." value={data.economics_businessMarketingOther} onChange={(e) => update({ economics_businessMarketingOther: e.target.value })} />
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
                            />

                            {/* Tantangan Utama */}
                            <div className="space-y-2">
                                <FormMultiSelect
                                    label="Tantangan utama usaha"
                                    id="businessIssues"
                                    options={['Modal', 'Bahan baku', 'Pemasaran', 'Manajemen', 'Tenaga kerja', 'Legalitas', 'Teknologi digital', 'Lainnya']}
                                    value={data.economics_businessIssues}
                                    onChange={(val) => update({ economics_businessIssues: val })}
                                    placeholder="Pilih Tantangan (Bisa > 1)..."
                                    required={true}
                                />
                                {data.economics_businessIssues.includes('Lainnya') && (
                                    <input type="text" className={otherInputClass} placeholder="Sebutkan tantangan..." value={data.economics_businessIssuesOther} onChange={(e) => update({ economics_businessIssuesOther: e.target.value })} />
                                )}
                            </div>

                            {/* Dukungan Dibutuhkan */}
                            <FormMultiSelect
                                label="Dukungan yang dibutuhkan saat ini"
                                id="businessNeeds"
                                options={['Tambahan modal', 'Pelatihan skill', 'Peralatan produksi', 'Izin usaha/Sertifikasi', 'Akses pasar', 'Pendampingan usaha']}
                                value={data.economics_businessNeeds}
                                onChange={(val) => update({ economics_businessNeeds: val })}
                                placeholder="Pilih Dukungan (Bisa > 1)..."
                                required={true}
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
                            />

                            {/* Minat Pelatihan */}
                            <div className="space-y-2">
                                <FormMultiSelect
                                    label="Minat mengikuti pelatihan kewirausahaan"
                                    id="businessTraining"
                                    options={['Manajemen Usaha', 'Digital Marketing', 'Lainnya']}
                                    value={data.economics_businessTraining}
                                    onChange={(val) => update({ economics_businessTraining: val })}
                                    placeholder="Pilih Minat (Bisa > 1)..."
                                    required={true}
                                />
                                {data.economics_businessTraining.includes('Lainnya') && (
                                    <input type="text" className={otherInputClass} placeholder="Sebutkan minat pelatihan..." value={data.economics_businessTrainingOther} onChange={(e) => update({ economics_businessTrainingOther: e.target.value })} />
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
                            />
                        </div>
                    )}
                </div>

                {/* Kepemilikan Aset */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <SectionHeader title="Apakah keluarga bapak/ibu memiliki aset Transportasi/Elektronik/Lahan?" />
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
                            <div className="flex flex-col gap-1.5 max-w-[200px]">
                                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Jumlah Unit Aset</label>
                                <CountSelect
                                    id="totalAssets"
                                    value={data.economics_totalAssets}
                                    onChange={(val) => update({ economics_totalAssets: val })}
                                    max={30}
                                    startFrom={1}
                                    placeholder="Total unit..."
                                    required={true}
                                />
                            </div>

                            {data.economics_totalAssets > 0 && (
                                <div className="space-y-4 animate-fadeIn">
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

                                            const otherAllocated = allocatedAssets - currentVal;
                                            const maxPossible = data.economics_totalAssets - otherAllocated;

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
                                                                    max={maxPossible > 0 ? maxPossible : 0}
                                                                    onChange={(numVal) => {
                                                                        update({ [asset.key]: numVal });

                                                                        // Sync with economics_assets array for summary display if needed
                                                                        let currentAssets = [...(data.economics_assets || [])];
                                                                        if (numVal > 0) {
                                                                            if (!currentAssets.includes(asset.label)) {
                                                                                currentAssets.push(asset.label);
                                                                            }
                                                                        } else {
                                                                            currentAssets = currentAssets.filter(a => a !== asset.label);
                                                                        }
                                                                        update({ economics_assets: currentAssets });
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Validation Feedback (Step 4 style) */}
                                    {(() => {
                                        const allocated = (data.economics_asset_motor_qty || 0) +
                                            (data.economics_asset_mobil_qty || 0) +
                                            (data.economics_asset_kulkas_qty || 0) +
                                            (data.economics_asset_laptop_qty || 0) +
                                            (data.economics_asset_tv_qty || 0) +
                                            (data.economics_asset_internet_qty || 0) +
                                            (data.economics_asset_lahan_qty || 0);
                                        const isValid = allocated === data.economics_totalAssets;

                                        return (
                                            <div className="animate-fadeIn">
                                                {!isValid && (
                                                    <div className="text-red-500 text-xs font-semibold flex items-center gap-1.5 mt-2 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg max-w-fit border border-red-200/50 dark:border-red-900/30">
                                                        <span className="material-symbols-outlined text-sm shrink-0">warning</span>
                                                        Total unit yang didata ({allocated}) belum sesuai dengan Total Aset ({data.economics_totalAssets})
                                                    </div>
                                                )}
                                                {isValid && allocated > 0 && (
                                                    <div className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 mt-2 bg-emerald-50 dark:bg-emerald-950/20 px-3 py-2 rounded-lg max-w-fit border border-emerald-200/50 dark:border-emerald-900/30">
                                                        <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
                                                        Distribusi jumlah aset sudah sesuai.
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}
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
                    <FormSelect
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
