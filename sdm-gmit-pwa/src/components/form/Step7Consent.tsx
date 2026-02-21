import React from 'react';
import { type FormData } from '../../types';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
}

const Step7Consent: React.FC<StepProps> = ({ data, update }) => {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const calculateAge = (dob: string) => {
        if (!dob) return '-';
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    // Card Component for consistent styling
    const SummaryCard = ({ title, icon, color, children }: { title: string, icon: string, color: string, children: React.ReactNode }) => (
        <div className={`bg-white dark:bg-[#1a2e20] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col`}>
            <div className={`px-5 py-4 flex items-center gap-3 border-b border-slate-50 dark:border-white/5 ${color} bg-opacity-10 dark:bg-opacity-20 shrink-0`}>
                <div className={`p-2 rounded-lg ${color} text-white shadow-sm`}>
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </div>
                <h4 className="font-bold text-gray-800 dark:text-white text-base tracking-wide">{title}</h4>
            </div>
            <div className="p-5 text-sm flex-grow">
                {children}
            </div>
        </div>
    );

    const LabelValue = ({ label, value, fullWidth = false }: { label: string, value: React.ReactNode, fullWidth?: boolean }) => {
        const isEmpty = !value || value === '-' || value === '0';
        return (
            <div className={`flex flex-col gap-1 ${fullWidth ? 'col-span-full' : ''}`}>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">{label}</span>
                <span className={`font-medium text-sm leading-relaxed ${isEmpty ? 'text-gray-400 dark:text-gray-600 italic' : 'text-gray-900 dark:text-gray-100'}`}>{value || '-'}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto pb-6">
            {/* Header Section */}
            <div className="text-center space-y-2 mb-6 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm border border-emerald-200 dark:border-emerald-800 animate-scaleIn">
                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Validasi Data</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                    Mohon periksa kembali seluruh data yang telah Anda isi sebelum melakukan pengiriman final.
                    Pastikan tidak ada kesalahan penulisan atau data yang terlewat.
                </p>
            </div>

            {/* Privacy Notice - Distinct Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#1a2e20] dark:to-[#132018] rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900/30 shadow-sm relative overflow-hidden animate-fade-in-up delay-100">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <span className="material-symbols-outlined text-9xl">security</span>
                </div>
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                    <div className="bg-white dark:bg-white/10 p-3 rounded-xl shadow-sm text-emerald-600 dark:text-emerald-400 shrink-0 transform transition-transform hover:scale-110">
                        <span className="material-symbols-outlined text-2xl animate-pulse">lock</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Pernyataan Privasi & Kerahasiaan</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm text-justify">
                            Data yang Anda kirimkan melalui formulir ini akan disimpan dalam <strong>Database GMIT Emaus Liliba</strong>.
                            Data ini bersifat <strong>RAHASIA</strong> dan hanya akan digunakan untuk keperluan pelayanan gereja, pemetaan potensi jemaat,
                            serta pengembangan program pelayanan yang lebih tepat sasaran.
                            Data tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* STEP 1: Identitas Diri */}
                <div className="animate-fade-in-up delay-100 h-full">
                    <SummaryCard title="Identitas Kepala Keluarga" icon="person" color="bg-blue-500">
                        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                            <LabelValue label="Nama Lengkap" value={data.fullName} fullWidth />
                            <LabelValue label="Jenis Kelamin" value={data.gender} />
                            <LabelValue label="Tanggal Lahir" value={data.dateOfBirth} />
                            <LabelValue label="Usia" value={`${calculateAge(data.dateOfBirth)} Tahun`} />
                            <LabelValue label="No. Telepon / WA" value={data.phone} />
                            <LabelValue label="Lingkungan" value={data.lingkungan} />
                            <LabelValue label="Rayon" value={data.rayon} />
                            <LabelValue label="Alamat Lengkap" value={data.address} fullWidth />
                        </div>
                    </SummaryCard>
                </div>

                {/* STEP 2: Informasi Keluarga */}
                <div className="animate-fade-in-up delay-100 h-full">
                    <SummaryCard title="Statistik Keluarga" icon="groups" color="bg-indigo-500">
                        <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                            <LabelValue label="Total Anggota" value={<span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{data.familyMembers || '0'}</span>} />
                            <LabelValue label="Laki-laki" value={data.familyMembersMale || '0'} />
                            <LabelValue label="Perempuan" value={data.familyMembersFemale || '0'} />

                            <div className="col-span-full h-px bg-gray-100 dark:bg-white/5 my-1"></div>

                            <LabelValue label="Anggota Sidi" value={data.familyMembersSidi || '0'} />
                            <LabelValue label="Sidi Laki-laki" value={data.familyMembersSidiMale || '0'} />
                            <LabelValue label="Sidi Perempuan" value={data.familyMembersSidiFemale || '0'} />

                            <LabelValue label="Belum Baptis" value={data.familyMembersNonBaptized || '0'} />
                            <LabelValue label="Di Luar Kupang" value={data.familyMembersOutside || '0'} />
                        </div>
                    </SummaryCard>
                </div>

                {/* STEP 3 & 4: Anggota Keluarga Profesional & Pelayanan - Full Width */}
                <div className="col-span-full animate-fade-in-up delay-200 h-full">
                    <SummaryCard title="Anggota Keluarga Profesional & Komitmen Pelayanan" icon="volunteer_activism" color="bg-rose-500">
                        <div className="mb-4">
                            <LabelValue label="Status Keluarga Memiliki Profesional" value={data.willingnessToServe} />
                        </div>

                        {data.professionalFamilyMembers && data.professionalFamilyMembers.length > 0 ? (
                            <div className={`grid grid-cols-1 ${data.professionalFamilyMembers.length >= 2 ? 'md:grid-cols-2' : ''} gap-4`}>
                                {data.professionalFamilyMembers.map((member, idx) => (
                                    <div key={idx} className="bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 p-4 hover:border-rose-200 dark:hover:border-rose-800 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h5 className="font-bold text-gray-900 dark:text-white text-sm">{member.name}</h5>
                                                <p className="text-xs text-gray-500">{member.workplace} • {member.position}</p>
                                            </div>
                                            {member.skillType && (
                                                <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 text-[10px] font-bold uppercase rounded tracking-wide border border-rose-100 dark:border-rose-900">
                                                    {member.skillType}
                                                </span>
                                            )}
                                        </div>

                                        {member.specificSkills && member.specificSkills.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {member.specificSkills.map((s, i) => (
                                                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white dark:bg-black/20 text-gray-600 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-700">
                                                        {s}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-2 mt-2 space-y-2">
                                            <div className="grid grid-cols-2 gap-2">
                                                <LabelValue label="Minat Pelayanan" value={member.churchServiceInterest} />
                                                <LabelValue label="Bidang" value={member.serviceInterestArea} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <LabelValue label="Kontribusi" value={member.contributionForm?.join(', ')} />
                                                <LabelValue label="Komunitas" value={member.communityConsent ? '✅ Setuju' : '❌ Tidak'} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-center text-sm text-gray-500 italic">
                                Tidak ada detail anggota keluarga profesional yang ditambahkan.
                            </div>
                        )}
                    </SummaryCard>
                </div>

                {/* STEP 4: Pendidikan Anak */}
                <div className="animate-fade-in-up delay-200 h-full">
                    <SummaryCard title="Pendidikan Anak" icon="school" color="bg-orange-500">
                        <div className="space-y-4">
                            <LabelValue label="Status Anak Sekolah" value={data.education_schoolingStatus} />
                            {(data.education_schoolingStatus === 'Ya' || data.education_schoolingStatus === 'Tidak') && (
                                <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-orange-50/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-semibold border-b border-orange-100 dark:border-white/5">
                                            <tr>
                                                <th className="px-3 py-2">Jenjang</th>
                                                <th className="px-3 py-2 text-center">Sekolah</th>
                                                <th className="px-3 py-2 text-center">Putus</th>
                                                <th className="px-3 py-2 text-center">Tdk Kul/Kerja</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                            {[
                                                { lbl: 'TK/PAUD', sch: data.education_inSchool_tk_paud, drop: data.education_dropout_tk_paud, unem: '-' },
                                                { lbl: 'SD', sch: data.education_inSchool_sd, drop: data.education_dropout_sd, unem: data.education_unemployed_sd },
                                                { lbl: 'SMP', sch: data.education_inSchool_smp, drop: data.education_dropout_smp, unem: data.education_unemployed_smp },
                                                { lbl: 'SMA/K', sch: data.education_inSchool_sma, drop: data.education_dropout_sma, unem: data.education_unemployed_sma },
                                            ].map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-3 py-2 font-medium">{row.lbl}</td>
                                                    <td className="px-3 py-2 text-center text-gray-500">{row.sch || '-'}</td>
                                                    <td className="px-3 py-2 text-center text-gray-500">{row.drop || '-'}</td>
                                                    <td className="px-3 py-2 text-center text-gray-500">{row.unem || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <LabelValue label="Anak Bekerja" value={`${data.education_working} Orang`} />
                        </div>
                    </SummaryCard>
                </div>

                {/* STEP 5: Ekonomi */}
                <div className="animate-fade-in-up delay-300 h-full">
                    <SummaryCard title="Ekonomi & Aset" icon="paid" color="bg-emerald-500">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                            <LabelValue label="Pekerjaan (Lainnya)" value={data.economics_headOccupation === 'Lainnya' ? data.economics_headOccupationOther : data.economics_headOccupation} />
                            <LabelValue label="Pendapatan" value={`${data.economics_incomeRange} ${data.economics_incomeRangeDetailed ? `(${data.economics_incomeRangeDetailed})` : ''}`} />

                            <div className="col-span-full space-y-2 bg-emerald-50/50 dark:bg-white/5 p-3 rounded-xl border border-emerald-100 dark:border-white/5">
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">Pengeluaran Bulanan</span>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex justify-between"><span>Pangan:</span> <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.economics_expense_food)}</span></div>
                                    <div className="flex justify-between"><span>Listrik/Air:</span> <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.economics_expense_utilities)}</span></div>
                                    <div className="flex justify-between"><span>Pendidikan:</span> <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.economics_expense_education)}</span></div>
                                    <div className="flex justify-between"><span>Lainnya:</span> <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(data.economics_expense_other)}</span></div>
                                </div>
                            </div>

                            <LabelValue label="Status Rumah" value={`${data.economics_houseStatus} (${data.economics_houseType})`} />
                            <LabelValue label="Sumber Air" value={data.economics_waterSource} />

                            <div className="col-span-full">
                                <span className="text-[11px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500 block mb-1">Aset</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {data.economics_assets && data.economics_assets.length > 0 && !data.economics_assets.includes('Tidak ada') ? (
                                        data.economics_assets.map(asset => {
                                            let qty = 0;
                                            if (asset === 'Motor') qty = data.economics_asset_motor_qty;
                                            if (asset === 'Mobil') qty = data.economics_asset_mobil_qty;
                                            if (asset === 'Kulkas') qty = data.economics_asset_kulkas_qty;
                                            if (asset === 'Laptop/Komputer') qty = data.economics_asset_laptop_qty;
                                            if (asset === 'Televisi') qty = data.economics_asset_tv_qty;
                                            return (
                                                <span key={asset} className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-[11px] font-medium border border-emerald-100 dark:border-emerald-800">
                                                    {asset} {qty > 0 && <b>({qty})</b>}
                                                </span>
                                            );
                                        })
                                    ) : '-'}
                                </div>
                            </div>
                        </div>
                    </SummaryCard>
                </div>

                {/* STEP 5: Usaha (Kondisional) */}
                {data.economics_hasBusiness === 'Ya' && (
                    <div className="animate-fade-in-up delay-300 h-full">
                        <SummaryCard title="Detail Usaha" icon="store" color="bg-cyan-500">
                            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                                <LabelValue label="Nama Usaha" value={data.economics_businessName} fullWidth />
                                <LabelValue label="Jenis" value={data.economics_businessType === 'Lainnya' ? data.economics_businessTypeOther : data.economics_businessType} />
                                <LabelValue label="Lama Usaha" value={data.economics_businessDuration} />
                                <LabelValue label="Lokasi" value={data.economics_businessLocation} />
                                <LabelValue label="Karyawan" value={data.economics_businessEmployeeCount} />
                                <LabelValue label="Modal" value={`${formatCurrency(data.economics_businessCapital)} (${data.economics_businessCapitalSource})`} fullWidth />
                                <LabelValue label="Omzet/Bulan" value={data.economics_businessTurnover} />

                                <div className="col-span-full mt-2 pt-2 border-t border-dashed border-cyan-100 dark:border-white/10 space-y-3">
                                    <LabelValue label="Pemasaran" value={`${data.economics_businessMarketing} (${data.economics_businessMarketArea})`} fullWidth />
                                    <LabelValue label="Kendala Utama" value={data.economics_businessIssues} fullWidth />
                                    <LabelValue label="Kebutuhan Dukungan" value={data.economics_businessNeeds} fullWidth />
                                </div>
                            </div>
                        </SummaryCard>
                    </div>
                )}

                {/* STEP 6: Kesehatan */}
                <div className="animate-fade-in-up delay-300 h-full">
                    <SummaryCard title="Kesehatan & Sosial" icon="medical_services" color="bg-red-500">
                        <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                            <LabelValue label="Sakit (30 Hari)" value={data.health_sick30Days} />
                            <LabelValue label="Penyakit Kronis" value={data.health_chronicSick === 'Ya' ? (data.health_chronicDisease === 'Lainnya' ? data.health_chronicDiseaseOther : data.health_chronicDisease) : 'Tidak'} />
                            <LabelValue label="BPJS Kesehatan" value={data.health_hasBPJS} />
                            <LabelValue label="BPJS Ketenagakerjaan" value={data.health_hasBPJSKetenagakerjaan} />
                            <LabelValue label="Bantuan Sosial" value={data.health_socialAssistance} />
                            <LabelValue label="Disabilitas" value={data.health_hasDisability} />

                            {data.health_hasDisability === 'Ya' && (
                                <div className="col-span-full bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-white/5">
                                    <span className="text-[11px] uppercase tracking-wider font-semibold text-red-600 dark:text-red-400 block mb-2">Detail Disabilitas</span>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { l: 'Fisik', v: data.health_disabilityPhysical },
                                            { l: 'Intelektual', v: data.health_disabilityIntellectual },
                                            { l: 'Mental', v: data.health_disabilityMental },
                                            { l: 'Sensorik', v: data.health_disabilitySensory }
                                        ].filter(x => x.v && x.v !== 'Tidak Ada').map((x, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-white dark:bg-black/20 text-red-600 dark:text-red-300 text-xs rounded border border-red-100 dark:border-red-900/30">
                                                {x.l}: {x.v}
                                            </span>
                                        ))}
                                        {data.health_disabilityDouble && <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded font-bold">Ganda</span>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </SummaryCard>
                </div>
            </div>

            {/* ACTION SECTION - Distinct from previous sections but naturally flows */}
            <div className="z-30 pt-2">
                <div className="bg-white/90 dark:bg-[#1a2e20]/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-800 p-5 rounded-2xl shadow-2xl flex flex-col gap-4 max-w-3xl mx-auto ring-4 ring-emerald-500/10 transform transition-all animate-slide-in-up">
                    <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="relative flex items-center mt-1">
                            <input
                                type="checkbox"
                                id="agreedToPrivacy"
                                className="peer appearance-none w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all cursor-pointer hover:border-emerald-400"
                                checked={data.agreedToPrivacy}
                                onChange={(e) => update({ agreedToPrivacy: e.target.checked })}
                            />
                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-base font-bold animate-scaleIn">check</span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            Saya menyatakan bahwa seluruh data yang saya isi adalah <b>BENAR</b> dan sesuai dengan kondisi sebenarnya.
                            Saya bertanggung jawab penuh atas kebenaran data ini.
                        </span>
                    </label>

                    <div className="h-px bg-gray-100 dark:bg-white/5"></div>

                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                id="dataValidated"
                                className="peer appearance-none w-6 h-6 border-2 border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 checked:bg-emerald-500 checked:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 transition-all cursor-pointer hover:border-emerald-400"
                                checked={data.dataValidated}
                                onChange={(e) => update({ dataValidated: e.target.checked })}
                            />
                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-base font-bold">check</span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-bold text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Saya telah memeriksa kembali seluruh data (Validasi Final)
                        </span>
                    </label>
                </div>
            </div>

            <div className="h-4"></div> {/* Small spacer for final layout */}
        </div>
    );

};

export default Step7Consent;
