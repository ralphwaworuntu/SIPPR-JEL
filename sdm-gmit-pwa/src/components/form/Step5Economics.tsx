import React, { useRef, useEffect } from 'react';
import { type FormData } from '../../types';
import FormRadioGroup from '../ui/FormRadioGroup';
import SectionHeader from '../ui/SectionHeader';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
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

function FormatRupiah({ value, onChange }: { value: number, onChange: (val: number) => void }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^\d]/g, '');
        onChange(parseInt(raw) || 0);
    };
    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">Rp</span>
            <input
                type="text"
                className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-200 text-base font-semibold"
                value={value ? new Intl.NumberFormat('id-ID').format(value) : ''}
                onChange={handleChange}
                placeholder="0"
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

            {/* 1. Pekerjaan Utama Kepala Keluarga */}
            <div className="space-y-4" id="headOccupation">
                <SectionHeader number={1} title="Pekerjaan Utama Kepala Keluarga" />
                <FormRadioGroup
                    name="headOccupation"
                    options={occupationOptions}
                    value={data.economics_headOccupation}
                    onChange={(val) => update({ economics_headOccupation: val })}
                    columns={4}
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
                <SectionHeader number={2} title="Pekerjaan Utama Istri" description="Opsional / Jika ada" />
                <FormRadioGroup
                    name="spouseOccupation"
                    options={occupationOptions}
                    value={data.economics_spouseOccupation}
                    onChange={(val) => update({ economics_spouseOccupation: val })}
                    columns={4}
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
                <SectionHeader number={3} title="Range Pendapatan Rumah Tangga (per bulan)" />
                <FormRadioGroup
                    name="incomeRange"
                    options={incomeRanges}
                    value={data.economics_incomeRange}
                    onChange={(val) => update({ economics_incomeRange: val })}
                    columns={2}
                />
                {data.economics_incomeRange === '≥ Rp 5.000.000' && (
                    <div className="animate-fadeIn mt-4 pl-4 border-l-2 border-primary/20">
                        <SectionHeader title="Detail Range Pendapatan (≥ Rp 5.000.000)" icon="tune" />
                        <FormRadioGroup
                            name="incomeRangeDetailed"
                            options={detailedIncomeRanges}
                            value={data.economics_incomeRangeDetailed || ''}
                            onChange={(val) => update({ economics_incomeRangeDetailed: val })}
                            columns={2}
                        />
                    </div>
                )}
            </div>

            {/* 4. Estimasi Pengeluaran Rumah Tangga */}
            <div className="space-y-6 pt-8 mt-4 relative">
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
                        <FormatRupiah value={data.economics_expense_food} onChange={(val) => update({ economics_expense_food: val })} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
                            Kebutuhan Dasar Non-Pangan <span className="text-xs font-normal text-slate-500">(Listrik, Air, BBM, Pulsa)</span><span className="text-red-500">*</span>
                        </label>
                        <FormatRupiah value={data.economics_expense_utilities} onChange={(val) => update({ economics_expense_utilities: val })} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
                            Pendidikan dan Kesehatan <span className="text-xs font-normal text-slate-500">(SPP, Obat, dsb)</span><span className="text-red-500">*</span>
                        </label>
                        <FormatRupiah value={data.economics_expense_education} onChange={(val) => update({ economics_expense_education: val })} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1">
                            Kebutuhan Lainnya <span className="text-xs font-normal text-slate-500">(Pakaian, Hiburan, Tabungan)</span><span className="text-red-500">*</span>
                        </label>
                        <FormatRupiah value={data.economics_expense_other} onChange={(val) => update({ economics_expense_other: val })} />
                    </div>
                </div>

                {/* Total Pengeluaran */}
                <div className="bg-gradient-to-r from-primary/5 to-emerald-50 dark:from-primary/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-primary/20 dark:border-primary/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">Total Pengeluaran Rumah Tangga</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total estimasi pengeluaran per bulan</p>
                    </div>
                    <div className="text-3xl font-black text-primary">
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
            <div className="space-y-6 pt-8 mt-4 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
                    <span className="material-symbols-outlined text-primary">storefront</span>
                    Kepemilikan Usaha Ekonomi Keluarga
                </h3>

                <div className="space-y-3">
                    <SectionHeader number={1} title="Apakah keluarga memiliki usaha ekonomi produktif?" />
                    <FormRadioGroup
                        name="hasBusiness"
                        options={['Ya', 'Tidak']}
                        value={data.economics_hasBusiness}
                        onChange={(val) => update({ economics_hasBusiness: val as 'Ya' | 'Tidak' })}
                        columns={2}
                    />
                </div>

                {/* Conditional Business Questions */}
                {data.economics_hasBusiness === 'Ya' && (
                    <div className="space-y-6 pl-4 border-l-2 border-primary/20 animate-fadeIn">

                        {/* Nama Usaha */}
                        <div className="space-y-2">
                            <SectionHeader number={2} title="Nama Jenis Usaha/Brand" />
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
                        <div className="space-y-2">
                            <SectionHeader number={3} title="Jenis Usaha" />
                            <FormRadioGroup
                                name="businessType"
                                options={['Perdagangan', 'Kuliner', 'Jasa', 'Kerajinan', 'Peternakan', 'Pertanian/Perkebunan', 'Lainnya']}
                                value={data.economics_businessType}
                                onChange={(val) => update({ economics_businessType: val })}
                                columns={3}
                            />
                            {data.economics_businessType === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan jenis usaha..." value={data.economics_businessTypeOther} onChange={(e) => update({ economics_businessTypeOther: e.target.value })} />
                            )}
                        </div>

                        {/* Lama Usaha */}
                        <div className="space-y-2">
                            <SectionHeader number={4} title="Lama Usaha Berjalan" />
                            <FormRadioGroup
                                name="businessDuration"
                                options={['< 1 tahun', '1-3 tahun', '4-5 tahun', '> 5 tahun']}
                                value={data.economics_businessDuration}
                                onChange={(val) => update({ economics_businessDuration: val })}
                                columns={4}
                            />
                            {data.economics_businessDuration === '> 5 tahun' && (
                                <div className="mt-2 animate-fadeIn">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sudah berapa tahun?</label>
                                    <input type="number" className={otherInputClass} placeholder="Contoh: 10" value={data.economics_businessDurationYears || ''} onChange={(e) => update({ economics_businessDurationYears: parseInt(e.target.value) || 0 })} />
                                </div>
                            )}
                        </div>

                        {/* Status Usaha */}
                        <div className="space-y-2">
                            <SectionHeader number={5} title="Status Usaha" />
                            <FormRadioGroup
                                name="businessStatus"
                                options={['Milik Sendiri', 'Usaha Keluarga', 'Kerja Sama', 'Lainnya']}
                                value={data.economics_businessStatus}
                                onChange={(val) => update({ economics_businessStatus: val })}
                                columns={2}
                            />
                            {data.economics_businessStatus === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan status usaha..." value={data.economics_businessStatusOther} onChange={(e) => update({ economics_businessStatusOther: e.target.value })} />
                            )}
                        </div>

                        {/* Lokasi Usaha */}
                        <div className="space-y-2">
                            <SectionHeader number={6} title="Lokasi Usaha" />
                            <FormRadioGroup
                                name="businessLocation"
                                options={['Rumah', 'Toko/Kios', 'Pasar', 'Online', 'Lainnya']}
                                value={data.economics_businessLocation}
                                onChange={(val) => update({ economics_businessLocation: val })}
                                columns={3}
                            />
                            {data.economics_businessLocation === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan lokasi usaha..." value={data.economics_businessLocationOther} onChange={(e) => update({ economics_businessLocationOther: e.target.value })} />
                            )}
                        </div>

                        {/* Jumlah Tenaga Kerja */}
                        <div className="space-y-2">
                            <SectionHeader number={7} title="Jumlah Tenaga Kerja" />
                            <FormRadioGroup
                                name="businessEmployeeCount"
                                options={['1 orang', '2-5 orang', '6-10 orang', '> 10 orang']}
                                value={data.economics_businessEmployeeCount}
                                onChange={(val) => update({ economics_businessEmployeeCount: val })}
                                columns={4}
                            />
                        </div>

                        {/* Modal Awal */}
                        <div className="space-y-2">
                            <SectionHeader number={8} title="Modal Awal Usaha" />
                            <FormatRupiah value={data.economics_businessCapital} onChange={(val) => update({ economics_businessCapital: val })} />
                        </div>

                        {/* Sumber Modal */}
                        <div className="space-y-2">
                            <SectionHeader number={9} title="Sumber Modal" />
                            <FormRadioGroup
                                name="businessCapitalSource"
                                options={['Pribadi', 'Pinjaman Keluarga', 'Pinjaman Bank/Koperasi', 'Program Pemerintah', 'Lainnya']}
                                value={data.economics_businessCapitalSource}
                                onChange={(val) => update({ economics_businessCapitalSource: val })}
                                columns={3}
                            />
                            {data.economics_businessCapitalSource === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan sumber modal..." value={data.economics_businessCapitalSourceOther} onChange={(e) => update({ economics_businessCapitalSourceOther: e.target.value })} />
                            )}
                        </div>

                        {/* Izin Usaha */}
                        <div className="space-y-2">
                            <SectionHeader number={10} title="Apakah memiliki Izin Usaha?" />
                            <FormRadioGroup
                                name="businessPermit"
                                options={['Tidak Ada', 'SKU', 'NIB', 'Lainnya']}
                                value={data.economics_businessPermit}
                                onChange={(val) => update({ economics_businessPermit: val })}
                                columns={4}
                            />
                            {data.economics_businessPermit === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan izin usaha..." value={data.economics_businessPermitOther} onChange={(e) => update({ economics_businessPermitOther: e.target.value })} />
                            )}
                        </div>

                        {/* Omzet Per Bulan */}
                        <div className="space-y-2">
                            <SectionHeader number={11} title="Rata-rata omzet per bulan" />
                            <FormRadioGroup
                                name="businessTurnover"
                                options={['< 2 juta', '2-5 juta', '5-10 juta', '> 10 juta']}
                                value={data.economics_businessTurnover}
                                onChange={(val) => update({ economics_businessTurnover: val })}
                                columns={4}
                            />
                            {data.economics_businessTurnover === '> 10 juta' && (
                                <div className="mt-2 animate-fadeIn">
                                    <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Berapa Rupiah?</label>
                                    <FormatRupiah value={data.economics_businessTurnoverValue} onChange={(val) => update({ economics_businessTurnoverValue: val })} />
                                </div>
                            )}
                        </div>

                        {/* Cara Pemasaran */}
                        <div className="space-y-2">
                            <SectionHeader number={12} title="Cara Pemasaran Utama" />
                            <FormRadioGroup
                                name="businessMarketing"
                                options={['Mulut ke mulut', 'Offline', 'Online', 'Jaringan Gereja', 'Lainnya']}
                                value={data.economics_businessMarketing}
                                onChange={(val) => update({ economics_businessMarketing: val })}
                                columns={3}
                            />
                            {data.economics_businessMarketing === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan cara pemasaran..." value={data.economics_businessMarketingOther} onChange={(e) => update({ economics_businessMarketingOther: e.target.value })} />
                            )}
                        </div>

                        {/* Wilayah Pemasaran */}
                        <div className="space-y-2">
                            <SectionHeader number={13} title="Wilayah Pemasaran" />
                            <FormRadioGroup
                                name="businessMarketArea"
                                options={['Lokal jemaat', 'Kota Kupang', 'Luar Kota Kupang', 'Luar NTT']}
                                value={data.economics_businessMarketArea}
                                onChange={(val) => update({ economics_businessMarketArea: val })}
                                columns={2}
                            />
                        </div>

                        {/* Tantangan Utama */}
                        <div className="space-y-2">
                            <SectionHeader number={14} title="Tantangan utama usaha" />
                            <FormRadioGroup
                                name="businessIssues"
                                options={['Modal', 'Bahan baku', 'Pemasaran', 'Manajemen', 'Tenaga kerja', 'Legalitas', 'Teknologi digital', 'Lainnya']}
                                value={data.economics_businessIssues}
                                onChange={(val) => update({ economics_businessIssues: val })}
                                columns={4}
                            />
                            {data.economics_businessIssues === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan tantangan..." value={data.economics_businessIssuesOther} onChange={(e) => update({ economics_businessIssuesOther: e.target.value })} />
                            )}
                        </div>

                        {/* Dukungan Dibutuhkan */}
                        <div className="space-y-2">
                            <SectionHeader number={15} title="Dukungan yang dibutuhkan" />
                            <FormRadioGroup
                                name="businessNeeds"
                                options={['Pelatihan Usaha', 'Pemasaran Digital', 'Akses Modal', 'Akses Pasar', 'Pendampingan', 'Lainnya']}
                                value={data.economics_businessNeeds}
                                onChange={(val) => update({ economics_businessNeeds: val })}
                                columns={3}
                            />
                            {data.economics_businessNeeds === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan dukungan..." value={data.economics_businessNeedsOther} onChange={(e) => update({ economics_businessNeedsOther: e.target.value })} />
                            )}
                        </div>

                        {/* Berbagi Ilmu */}
                        <div className="space-y-2">
                            <SectionHeader number={16} title="Bersedia berbagi ilmu berusaha dengan jemaat lainnya?" />
                            <FormRadioGroup
                                name="businessSharing"
                                options={['Ya', 'Tidak']}
                                value={data.economics_businessSharing}
                                onChange={(val) => update({ economics_businessSharing: val as 'Ya' | 'Tidak' })}
                                columns={2}
                            />
                        </div>

                        {/* Minat Pelatihan */}
                        <div className="space-y-2">
                            <SectionHeader number={17} title="Minat pelatihan" />
                            <FormRadioGroup
                                name="businessTraining"
                                options={['Manajemen Usaha', 'Digital Marketing', 'Lainnya']}
                                value={data.economics_businessTraining}
                                onChange={(val) => update({ economics_businessTraining: val })}
                                columns={2}
                            />
                            {data.economics_businessTraining === 'Lainnya' && (
                                <input type="text" className={otherInputClass} placeholder="Sebutkan minat pelatihan..." value={data.economics_businessTrainingOther} onChange={(e) => update({ economics_businessTrainingOther: e.target.value })} />
                            )}
                        </div>

                    </div>
                )}
            </div>

            {/* 6. Kepemilikan Rumah & Aset Keluarga */}
            <div className="space-y-6 pt-8 mt-4 relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent"></div>
                <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
                    <span className="material-symbols-outlined text-primary">home_work</span>
                    Kepemilikan Rumah & Aset Keluarga
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Rumah */}
                    <div className="space-y-2">
                        <SectionHeader number={1} title="Status Rumah" />
                        <FormRadioGroup
                            name="houseStatus"
                            options={['Milik sendiri', 'Kontrak', 'Keluarga', 'Menumpang']}
                            value={data.economics_houseStatus}
                            onChange={(val) => update({ economics_houseStatus: val })}
                            columns={2}
                        />
                    </div>

                    {/* Tipe Rumah */}
                    <div className="space-y-2">
                        <SectionHeader number={2} title="Tipe Rumah" />
                        <FormRadioGroup
                            name="houseType"
                            options={['Permanen', 'Semi permanen', 'Darurat']}
                            value={data.economics_houseType}
                            onChange={(val) => {
                                update({ economics_houseType: val });
                                if (val !== 'Permanen') update({ economics_houseIMB: '' });
                            }}
                            columns={2}
                        />
                    </div>

                    {/* IMB (Conditional) */}
                    {data.economics_houseType === 'Permanen' && (
                        <div className="space-y-2 animate-fadeIn col-span-1 md:col-span-2">
                            <SectionHeader number={3} title="Apakah memiliki Izin Mendirikan Bangunan (IMB)?" />
                            <FormRadioGroup
                                name="houseIMB"
                                options={['Memiliki IMB', 'Tidak memiliki IMB']}
                                value={data.economics_houseIMB}
                                onChange={(val) => update({ economics_houseIMB: val })}
                                columns={2}
                            />
                        </div>
                    )}
                </div>

                {/* Kepemilikan Aset */}
                <div className="space-y-3">
                    <SectionHeader number={4} title="Kepemilikan Aset" description="Boleh pilih lebih dari satu" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { label: 'Motor', key: 'economics_asset_motor_qty' },
                            { label: 'Mobil', key: 'economics_asset_mobil_qty' },
                            { label: 'Kulkas', key: 'economics_asset_kulkas_qty' },
                            { label: 'Laptop/Komputer', key: 'economics_asset_laptop_qty' },
                            { label: 'Televisi', key: 'economics_asset_tv_qty' },
                            { label: 'Internet/Indihome', key: 'economics_asset_internet_qty' },
                            { label: 'Lahan Pertanian', key: 'economics_asset_lahan_qty' },
                            { label: 'Tidak ada', key: null }
                        ].map((asset) => {
                            const isSelected = (data.economics_assets || []).includes(asset.label);
                            const isNone = asset.label === 'Tidak ada';

                            return (
                                <div key={asset.label} className={`p-3.5 border-2 rounded-xl transition-all duration-200 ${isSelected ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'}`}>
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-3 cursor-pointer select-none flex-grow">
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                                {isSelected && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="sr-only"
                                                checked={isSelected}
                                                onChange={() => {
                                                    let newAssets = [...(data.economics_assets || [])];
                                                    if (isNone) {
                                                        if (!isSelected) {
                                                            newAssets = ['Tidak ada'];
                                                            update({
                                                                economics_assets: newAssets,
                                                                economics_asset_motor_qty: 0,
                                                                economics_asset_mobil_qty: 0,
                                                                economics_asset_kulkas_qty: 0,
                                                                economics_asset_laptop_qty: 0,
                                                                economics_asset_tv_qty: 0,
                                                                economics_asset_internet_qty: 0,
                                                                economics_asset_lahan_qty: 0
                                                            });
                                                        } else {
                                                            update({ economics_assets: [] });
                                                        }
                                                    } else {
                                                        newAssets = newAssets.filter(a => a !== 'Tidak ada');
                                                        if (isSelected) {
                                                            newAssets = newAssets.filter(a => a !== asset.label);
                                                            if (asset.key) update({ [asset.key]: 0 });
                                                        } else {
                                                            newAssets.push(asset.label);
                                                            if (asset.key) update({ [asset.key]: 1 });
                                                        }
                                                        update({ economics_assets: newAssets });
                                                    }
                                                }}
                                            />
                                            <span className="text-sm font-semibold text-slate-800 dark:text-white">{asset.label}</span>
                                        </label>

                                        {/* Quantity Input */}
                                        {isSelected && !isNone && asset.key && (
                                            <div className="flex items-center gap-2 animate-fadeIn">
                                                <span className="text-xs text-slate-500">Jml:</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-16 h-8 px-2 text-center rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-primary outline-none text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                                    value={data[asset.key as keyof typeof data] as number || ''}
                                                    onChange={(e) => update({ [asset.key!]: parseInt(e.target.value) || 0 })}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Status Kepemilikan Tanah */}
                    <div className="space-y-2">
                        <SectionHeader number={5} title="Status Kepemilikan Tanah" />
                        <FormRadioGroup
                            name="landStatus"
                            options={['SHM', 'Tidak ada SHM', 'Pelepasan Hak', 'Jaga tanah orang']}
                            value={data.economics_landStatus}
                            onChange={(val) => update({ economics_landStatus: val })}
                            columns={1}
                        />
                    </div>

                    {/* Jenis Sumber Air Minum */}
                    <div className="space-y-2">
                        <SectionHeader number={6} title="Jenis sumber air minum utama" />
                        <FormRadioGroup
                            name="waterSource"
                            options={['Air Kemasan/Isi Ulang', 'PDAM', 'Sumur Gali/Pompa']}
                            value={data.economics_waterSource}
                            onChange={(val) => update({ economics_waterSource: val })}
                            columns={1}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Step5Economics;
