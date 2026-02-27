import React from 'react';
import { type FormData } from '../../types';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
    goToStep: (step: number, editing?: boolean) => void;
}

const Step7Consent: React.FC<StepProps> = ({ data, update, goToStep }) => {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    };

    const calculateAge = (dob: string) => {
        if (!dob) return '-';
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    // Card Component for consistent styling
    const SummaryCard = ({ title, icon, color, stepNumber, children }: { title: string, icon: string, color: string, stepNumber?: number, children: React.ReactNode }) => (
        <div className={`bg-white dark:bg-[#1a2e20] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden hover-lift transition-all duration-300 h-full flex flex-col`}>
            <div className={`px-5 py-4 flex items-center justify-between border-b border-slate-50 dark:border-white/5 ${color} bg-opacity-10 dark:bg-opacity-20 shrink-0`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${color} text-white shadow-sm`}>
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                    <h4 className="font-bold text-gray-800 dark:text-white text-base tracking-wide">{title}</h4>
                </div>
                {stepNumber && (
                    <button
                        onClick={() => goToStep(stepNumber, true)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/20 transition-all shadow-sm"
                    >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Edit
                    </button>
                )}
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm border border-emerald-200 dark:border-emerald-800 animate-scale-in">
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

            <div className="space-y-6">
                {/* STEP 1: Identitas Diri */}
                <div className="animate-fade-in-up delay-100">
                    <SummaryCard title="Data Umum Kepala Keluarga" icon="person" color="bg-blue-500" stepNumber={1}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-5 gap-x-6">
                            <LabelValue label="Nomor Kartu Keluarga" value={data.kkNumber} />
                            <LabelValue label="NIK" value={data.nik} />
                            <LabelValue label="Nama Lengkap Kepala Keluarga" value={data.fullName} fullWidth />
                            <LabelValue label="Jenis Kelamin" value={data.gender} />
                            <LabelValue label="Tanggal Lahir" value={formatDate(data.dateOfBirth)} />
                            <LabelValue label="Usia" value={`${calculateAge(data.dateOfBirth)} Tahun`} />


                            <div className="col-span-full h-px bg-blue-100 dark:bg-white/5 my-1"></div>
                            <LabelValue label="Golongan Darah" value={data.bloodType} />
                            <LabelValue label="Status Baptis" value={data.baptismStatus} />
                            <LabelValue label="Status Sidi" value={data.sidiStatus} />
                            <LabelValue label="Status Pernikahan" value={data.maritalStatus} />
                            {['Sudah Nikah', 'Cerai Hidup', 'Cerai Mati'].includes(data.maritalStatus) && (
                                <>
                                    <LabelValue label="Tanggal Pernikahan" value={formatDate(data.marriageDate || '')} />
                                    <LabelValue label="Usia Pernikahan" value={`${calculateAge(data.marriageDate)} Tahun`} />
                                    <LabelValue label="Jenis Pernikahan" value={
                                        data.marriageType && data.marriageType.length > 0
                                            ? data.marriageType.length === 1
                                                ? data.marriageType[0]
                                                : data.marriageType.length === 2
                                                    ? `${data.marriageType[0]} dan ${data.marriageType[1]}`
                                                    : `${data.marriageType.slice(0, -1).join(', ')}, dan ${data.marriageType[data.marriageType.length - 1]}`
                                            : '-'
                                    } />
                                </>
                            )}
                            <LabelValue label="Pendidikan Terakhir" value={data.educationLevel} />

                            <div className="col-span-full h-px bg-blue-100 dark:bg-white/5 my-1"></div>

                            <LabelValue label="Nomor Telepon/ WhatsApp Aktif" value={data.phone ? `+62${data.phone}` : '-'} />
                            <LabelValue label="Lingkungan" value={data.lingkungan} />
                            <LabelValue label="Rayon" value={data.rayon} />
                            <LabelValue label="Alamat Lengkap" value={data.address} fullWidth />
                            <LabelValue label="Kelurahan / Desa" value={data.subdistrict} />
                            <LabelValue label="Kecamatan" value={data.district} />
                            <LabelValue label="Kota / Kabupaten" value={data.city} />
                        </div>
                    </SummaryCard>
                </div>

                {/* STEP 2: Informasi Keluarga */}
                <div className="animate-fade-in-up delay-100">
                    <SummaryCard title="Data Umum Anggota Keluarga" icon="groups" color="bg-indigo-500" stepNumber={2}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                            <LabelValue label="Jumlah Anggota Keluarga" value={<span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{data.familyMembers || '0'}</span>} />
                            <LabelValue label="Laki-laki" value={data.familyMembersMale || '0'} />
                            <LabelValue label="Perempuan" value={data.familyMembersFemale || '0'} />
                            <LabelValue label="Jumlah Anggota Keluarga di Luar Kota Kupang" value={<span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{data.familyMembersOutside || '0'}</span>} />

                            <div className="col-span-full h-px bg-gray-100 dark:bg-white/5 my-1"></div>

                            <LabelValue label="Jumlah Anggota Sidi" value={<span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{data.familyMembersSidi || '0'}</span>} />
                            <LabelValue label="Laki-laki" value={data.familyMembersSidiMale || '0'} />
                            <LabelValue label="Perempuan" value={data.familyMembersSidiFemale || '0'} />
                            <LabelValue label="Belum Sidi" value={<span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{data.familyMembersNonSidi || '0'}</span>} />
                            <LabelValue label="Belum Baptis" value={data.familyMembersNonBaptized || '0'} />

                            <LabelValue label="Penerima Diakonia" value={data.diakonia_recipient} />

                            {data.diakonia_recipient === 'Ya' && (
                                <div className="col-span-full bg-indigo-50/50 dark:bg-white/5 p-4 rounded-xl border border-indigo-100 dark:border-white/5 mt-2">
                                    <span className="text-[11px] uppercase tracking-wider font-semibold text-indigo-600 dark:text-indigo-400 block mb-2">Detail Diakonia</span>
                                    <div className="grid grid-cols-3 gap-4">
                                        <LabelValue label="Tahun Penerimaan" value={data.diakonia_year} />
                                        <LabelValue label="Jenis Diakonia" value={data.diakonia_type} />
                                    </div>
                                </div>
                            )}

                            {parseInt(data.familyMembersNonSidi || '0') > 0 && (
                                <div className="col-span-full bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-xl border border-amber-100 dark:border-amber-700/30 mt-2">
                                    <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400 block mb-2">Anggota Usia 18+ Belum Sidi</span>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-2 text-sm text-gray-800 dark:text-gray-200">
                                            <span className="font-semibold">Ada anggota usia 18+ yang belum Sidi?</span>
                                            <span>{data.hasNonSidiAdult18 || '-'}</span>
                                        </div>
                                        {data.hasNonSidiAdult18 === 'Ya' && (
                                            <div className="mt-2 pt-2 border-t border-amber-100 dark:border-amber-800/30 flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-200 uppercase mb-1">Daftar Nama:</span>
                                                {data.familyMembersNonSidiNames?.map((name, idx) => (
                                                    <span key={idx} className="text-sm text-gray-800 dark:text-gray-200 font-medium ml-2">
                                                        {idx + 1}. {name || '-'}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {parseInt(data.familyMembersNonBaptized || '0') > 0 && (
                                <div className="col-span-full bg-orange-50/50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-700/30 mt-2">
                                    <span className="text-[11px] uppercase tracking-wider font-semibold text-orange-600 dark:text-orange-400 block mb-2">Nama Anggota Belum Baptis</span>
                                    <div className="flex flex-col gap-1">
                                        {data.familyMembersNonBaptizedNames?.map((name, idx) => (
                                            <span key={idx} className="text-sm text-gray-800 dark:text-gray-200 font-medium ml-2">
                                                {idx + 1}. {name || '-'}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </SummaryCard>
                </div>

                {/* STEP 3: Pendidikan Anak */}
                <div className="animate-fade-in-up delay-100">
                    <SummaryCard title="Pendidikan Keluarga" icon="school" color="bg-orange-500" stepNumber={3}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <LabelValue label="Status Anak Sekolah" value={data.education_schoolingStatus} />
                                <LabelValue label="Anak Bekerja" value={`${data.education_working} Orang`} />
                                <div className="col-span-full border-t border-orange-100 dark:border-white/5 pt-4">
                                    <LabelValue label="Penerima Beasiswa" value={data.education_hasScholarship === 'Ya' ? (data.education_scholarshipType === 'Beasiswa Lainnya' ? `Ya - ${data.education_scholarshipTypeOther}` : `Ya - ${data.education_scholarshipType}`) : 'Tidak'} />
                                </div>
                            </div>

                            {(data.education_schoolingStatus === 'Ya' || data.education_schoolingStatus === 'Tidak') && (
                                <div className="overflow-x-auto -mx-1 px-1">
                                    <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 min-w-[320px]">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-orange-50/50 dark:bg-white/5 text-gray-600 dark:text-gray-300 font-bold border-b border-orange-100 dark:border-white/5">
                                                <tr>
                                                    <th className="px-4 py-3">Jenjang Pendidikan</th>
                                                    <th className="px-3 py-3 text-center">Sekolah</th>
                                                    <th className="px-3 py-3 text-center">Putus</th>
                                                    <th className="px-3 py-3 text-center">Tdk Kul/Kerja</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                                {[
                                                    { lbl: 'TK / PAUD', sch: data.education_inSchool_tk_paud, drop: data.education_dropout_tk_paud, unem: '-' },
                                                    { lbl: 'SD / Sederajat', sch: data.education_inSchool_sd, drop: data.education_dropout_sd, unem: data.education_unemployed_sd },
                                                    { lbl: 'SMP / Sederajat', sch: data.education_inSchool_smp, drop: data.education_dropout_smp, unem: data.education_unemployed_smp },
                                                    { lbl: 'SMA / SMK / MA', sch: data.education_inSchool_sma, drop: data.education_dropout_sma, unem: data.education_unemployed_sma },
                                                    { lbl: 'PT / Universitas', sch: data.education_inSchool_university, drop: data.education_dropout_university, unem: data.education_unemployed_university },
                                                ].map((row, idx) => (
                                                    <tr key={idx} className="hover:bg-orange-50/30 dark:hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-2.5 font-semibold text-gray-700 dark:text-gray-200">{row.lbl}</td>
                                                        <td className="px-3 py-2.5 text-center text-gray-600 dark:text-gray-300 font-medium">{row.sch || '-'}</td>
                                                        <td className="px-3 py-2.5 text-center text-gray-600 dark:text-gray-300 font-medium">{row.drop || '-'}</td>
                                                        <td className="px-3 py-2.5 text-center text-gray-600 dark:text-gray-300 font-medium">{row.unem || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SummaryCard>
                </div>

                {/* STEP 4: Kesehatan */}
                <div className="animate-fade-in-up delay-100">
                    <SummaryCard title="Kesehatan Keluarga" icon="medical_services" color="bg-red-500" stepNumber={4}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <LabelValue label="Sakit Dalam 30 Hari Terakhir" value={data.health_sick30Days} />
                                <LabelValue label="Sakit menahun" value={data.health_chronicSick} />
                                <LabelValue label="Pengobatan teratur dari fasilitas kesehatan" value={data.health_regularTreatment} />
                                <LabelValue label="Memiliki BPJS Kesehatan" value={data.health_hasBPJS === 'Tidak' && data.health_bpjsNonParticipants ? <span>Tidak<div className="text-xs text-red-600 dark:text-red-400 mt-1 whitespace-pre-wrap font-medium">{data.health_bpjsNonParticipants}</div></span> : data.health_hasBPJS} />
                                <LabelValue label="Penyakit Kronis" value={data.health_chronicSick === 'Ya' ? (data.health_chronicDisease.map(d => d === 'Lainnya' ? `Lainnya (${data.health_chronicDiseaseOther})` : d).join(', ')) : 'Tidak'} />
                                <LabelValue label="Memiliki BPJS Ketenagakerjaan" value={data.health_hasBPJSKetenagakerjaan} />
                                <LabelValue label="Jenis Bantuan Sosial" value={data.health_socialAssistance} />
                            </div>

                            <div className="space-y-4">
                                <LabelValue label="Anggota Disabilitas" value={data.health_hasDisability} />
                                {data.health_hasDisability === 'Ya' && (
                                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-white/5 shadow-inner">
                                        <span className="text-[11px] uppercase tracking-wider font-semibold text-red-600 dark:text-red-400 block mb-3">Rincian Kategori Disabilitas</span>
                                        <div className="flex flex-col gap-3">
                                            {[
                                                { l: 'Fisik', v: data.health_disabilityPhysical, other: data.health_disabilityPhysicalOther },
                                                { l: 'Intelektual', v: data.health_disabilityIntellectual, other: data.health_disabilityIntellectualOther },
                                                { l: 'Mental', v: data.health_disabilityMental, other: data.health_disabilityMentalOther },
                                                { l: 'Sensorik', v: data.health_disabilitySensory, other: data.health_disabilitySensoryOther }
                                            ].filter(x => x.v && x.v.length > 0).map((x, i) => (
                                                <div key={i} className="flex flex-col gap-1">
                                                    <span className="text-[10px] font-bold text-red-800 dark:text-red-200 uppercase">{x.l}</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {x.v.map(item => (
                                                            <span key={item} className="px-2 py-0.5 bg-white dark:bg-red-950/40 text-red-600 dark:text-red-300 text-[11px] rounded-lg border border-red-100 dark:border-red-900/30 font-medium">
                                                                {item === 'Lainnya' ? `${item} (${x.other})` : item}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            {data.health_disabilityDouble && (
                                                <div className="mt-2 pt-2 border-t border-red-100 dark:border-red-900/30 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-red-500 text-sm">warning</span>
                                                    <span className="text-[11px] font-black text-red-700 dark:text-red-300 uppercase italic">Teridentifikasi Disabilitas Ganda</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </SummaryCard>
                </div>
                {/* STEP 5: Anggota Keluarga Profesional & Pelayanan */}
                <div className="animate-fade-in-up delay-200">
                    <SummaryCard title="Keahlian & Kompetensi Profesional" icon="volunteer_activism" color="bg-rose-500" stepNumber={5}>
                        {data.professionalFamilyMembers && data.professionalFamilyMembers.length > 0 ? (
                            <div className="space-y-4">
                                {data.professionalFamilyMembers.map((member, idx) => (
                                    <div key={idx} className="bg-rose-50/50 dark:bg-white/5 p-4 rounded-xl border border-rose-100 dark:border-white/5 mt-2">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                            <div className="col-span-full mb-1">
                                                <span className="text-[11px] uppercase tracking-wider font-extrabold text-rose-600 dark:text-rose-400 block mb-1">
                                                    {idx === 0 ? 'Kepala Keluarga' : `Anggota Profesional ${idx + 1}`}
                                                </span>
                                                <div className="h-0.5 w-12 bg-rose-200 dark:bg-rose-800 rounded-full"></div>
                                            </div>

                                            <LabelValue label="Nama Lengkap" value={<span className="font-bold text-rose-700 dark:text-rose-300">{member.name}</span>} fullWidth />
                                            <LabelValue label="Tempat Kerja/ Instansi" value={member.workplace} />
                                            <LabelValue label="Jabatan Saat Ini" value={member.position} />
                                            <LabelValue label="Lama Bekerja" value={member.yearsExperience} />
                                            <LabelValue label="Keahlian Spesifik" value={member.specificSkills?.join(', ') || '-'} />

                                            <div className="col-span-full h-px bg-rose-100 dark:bg-white/5 my-1"></div>

                                            <LabelValue label="Jenis Keahlian Utama" value={member.skillType} />
                                            <LabelValue label="Tingkat Keahlian" value={member.skillLevel} />
                                            <LabelValue label="Kesediaan Melayani" value={member.churchServiceInterest} />
                                            <LabelValue label="Bidang Minat Pelayanan" value={member.serviceInterestArea} />
                                            <LabelValue label="Bentuk Kontribusi" value={member.contributionForm?.join(', ')} />
                                            <LabelValue label="Gabung Komunitas" value={member.communityConsent ? '✅ Ya' : '❌ Tidak'} />

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-center text-sm text-gray-500 dark:text-gray-400 italic">
                                Tidak ada detail anggota keluarga profesional yang ditambahkan.
                            </div>
                        )}
                    </SummaryCard>
                </div>

                {/* STEP 6: Ekonomi & Usaha */}
                <div className="animate-fade-in-up delay-300">
                    <SummaryCard title="Ekonomi, Aset & Usaha" icon="paid" color="bg-emerald-500" stepNumber={6}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Row 1: Pekerjaan & Pendapatan (Full Width Block) */}
                            <div className="col-span-full bg-slate-50 dark:bg-black/20 p-5 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                                            <span className="material-symbols-outlined text-sm">work</span> Data Pekerjaan
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <LabelValue label="Pekerjaan Utama KK" value={data.economics_headOccupation === 'Lainnya' ? data.economics_headOccupationOther : data.economics_headOccupation} />
                                            <LabelValue label="Pekerjaan Istri/Suami" value={data.economics_spouseOccupation === 'Lainnya' ? data.economics_spouseOccupationOther : (data.economics_spouseOccupation || '-')} />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                                            <span className="material-symbols-outlined text-sm">account_balance_wallet</span> Data Pendapatan
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                                            <LabelValue label="Pendapatan KK" value={`${data.economics_headIncomeRange || '-'} ${data.economics_headIncomeRangeDetailed ? `(${data.economics_headIncomeRangeDetailed})` : ''}`} />
                                            <LabelValue label="Pendapatan Pasangan" value={data.economics_spouseOccupation && data.economics_spouseOccupation !== 'Ibu Rumah Tangga/Tidak Bekerja' ? `${data.economics_spouseIncomeRange || '-'} ${data.economics_spouseIncomeRangeDetailed ? `(${data.economics_spouseIncomeRangeDetailed})` : ''}` : '-'} />
                                            <div className="col-span-full mt-2 pt-2 border-t border-emerald-100 dark:border-white/5">
                                                <LabelValue label="Total Estimasi Pendapatan" value={`${data.economics_incomeRange} ${data.economics_incomeRangeDetailed ? `(${data.economics_incomeRangeDetailed})` : ''}`} fullWidth={true} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Pengeluaran Bulanan (Full Width - THE REQUEST) */}
                            <div className="col-span-full">
                                <div className="space-y-4 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-2xl border-2 border-emerald-100 dark:border-emerald-800/50 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <span className="material-symbols-outlined text-7xl text-emerald-500">receipt_long</span>
                                    </div>

                                    <h4 className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-extrabold text-emerald-700 dark:text-emerald-300">
                                        <span className="material-symbols-outlined text-sm">payments</span>
                                        Rincian Pengeluaran Bulanan
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-4 text-xs relative z-10">
                                        <div className="flex justify-between border-b border-emerald-200/50 dark:border-white/10 pb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Konsumsi Pangan:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(data.economics_expense_food)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-emerald-200/50 dark:border-white/10 pb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Non-Pangan 1:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(data.economics_expense_utilities)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-emerald-200/50 dark:border-white/10 pb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Non-Pangan 2:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(data.economics_expense_nonPanganII)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-emerald-200/50 dark:border-white/10 pb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Pinjaman:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(data.economics_expense_loan)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-emerald-200/50 dark:border-white/10 pb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Pend. & Kesehatan:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(data.economics_expense_education)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-emerald-200/50 dark:border-white/10 pb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Lainnya:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(data.economics_expense_other)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-emerald-200/50 dark:border-white/10 pb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Tak Terduga:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(data.economics_expense_unexpected)}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-emerald-200/50 dark:border-white/10 pb-2">
                                            <span className="text-slate-600 dark:text-slate-400">Peribadatan:</span>
                                            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(data.economics_expense_worship)}</span>
                                        </div>

                                        <div className="col-span-full pt-4 mt-2 border-t-2 border-emerald-300 dark:border-emerald-700 flex justify-between items-center bg-white/40 dark:bg-black/20 p-4 rounded-xl">
                                            <span className="text-xs font-black text-emerald-900 dark:text-emerald-100 uppercase tracking-widest">Total Seluruh Pengeluaran Bulanan</span>
                                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(
                                                    (data.economics_expense_food || 0) +
                                                    (data.economics_expense_utilities || 0) +
                                                    (data.economics_expense_nonPanganII || 0) +
                                                    (data.economics_expense_loan || 0) +
                                                    (data.economics_expense_education || 0) +
                                                    (data.economics_expense_other || 0) +
                                                    (data.economics_expense_unexpected || 0) +
                                                    (data.economics_expense_worship || 0)
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Row 3: Right (Unit Usaha) */}
                            <div className="border-l-0 md:border-l border-emerald-100 dark:border-white/10 pl-0 md:pl-8 space-y-6">
                                <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2 uppercase tracking-[0.2em] ml-1">
                                    <span className="material-symbols-outlined text-sm">storefront</span> Detail Unit Usaha
                                </h4>
                                <LabelValue label="Memiliki Usaha?" value={data.economics_hasBusiness} />
                                {data.economics_hasBusiness === 'Ya' ? (
                                    <div className="grid grid-cols-1 gap-y-4 mt-2 bg-emerald-50/20 dark:bg-black/20 p-4 rounded-xl border border-emerald-100/50 dark:border-white/5">
                                        <LabelValue label="Nama Usaha" value={data.economics_businessName} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <LabelValue label="Jenis" value={data.economics_businessType === 'Lainnya' ? data.economics_businessTypeOther : data.economics_businessType} />
                                            <LabelValue label="Status Usaha" value={data.economics_businessStatus === 'Lainnya' ? data.economics_businessStatusOther : data.economics_businessStatus} />
                                            <LabelValue label="Lama Usaha" value={data.economics_businessDuration === '> 5 tahun' ? `${data.economics_businessDuration} (${data.economics_businessDurationYears} tahun)` : data.economics_businessDuration} />
                                            <LabelValue label="Lokasi" value={data.economics_businessLocation === 'Lainnya' ? data.economics_businessLocationOther : data.economics_businessLocation} />
                                            <LabelValue label="Karyawan" value={data.economics_businessEmployeeCount} />
                                        </div>
                                        <LabelValue label="Modal & Sumber" value={`${formatCurrency(data.economics_businessCapital)} (${data.economics_businessCapitalSource === 'Lainnya' ? data.economics_businessCapitalSourceOther : data.economics_businessCapitalSource})`} />
                                        <LabelValue label="Omzet/Bulan" value={data.economics_businessTurnover || (data.economics_businessTurnoverValue ? formatCurrency(data.economics_businessTurnoverValue) : '-')} />
                                        <div className="pt-2 border-t border-dashed border-emerald-200 dark:border-white/10 space-y-3 mt-1">
                                            <LabelValue label="Izin Usaha" value={Array.isArray(data.economics_businessPermit) ? (data.economics_businessPermit.length > 0 ? data.economics_businessPermit.map(p => p === 'Lainnya' ? `Lainnya (${data.economics_businessPermitOther})` : p).join(', ') : '-') : (data.economics_businessPermit === 'Lainnya' ? `Lainnya (${data.economics_businessPermitOther})` : data.economics_businessPermit || '-')} />
                                            <LabelValue label="Pemasaran" value={`${Array.isArray(data.economics_businessMarketing) ? (data.economics_businessMarketing.length > 0 ? data.economics_businessMarketing.map(m => m === 'Lainnya' ? `Lainnya (${data.economics_businessMarketingOther})` : m).join(', ') : '-') : (data.economics_businessMarketing === 'Lainnya' ? `Lainnya (${data.economics_businessMarketingOther})` : data.economics_businessMarketing || '-')} (${data.economics_businessMarketArea || '-'})`} />
                                            <LabelValue label="Kendala Utama" value={Array.isArray(data.economics_businessIssues) ? (data.economics_businessIssues.length > 0 ? data.economics_businessIssues.map(i => i === 'Lainnya' ? `Lainnya (${data.economics_businessIssuesOther})` : i).join(', ') : '-') : (data.economics_businessIssues === 'Lainnya' ? `Lainnya (${data.economics_businessIssuesOther})` : data.economics_businessIssues || '-')} />
                                            <LabelValue label="Kebutuhan Dukungan" value={Array.isArray(data.economics_businessNeeds) ? (data.economics_businessNeeds.length > 0 ? data.economics_businessNeeds.map(n => n === 'Lainnya' ? `Lainnya (${data.economics_businessNeedsOther})` : n).join(', ') : '-') : (data.economics_businessNeeds === 'Lainnya' ? `Lainnya (${data.economics_businessNeedsOther})` : data.economics_businessNeeds || '-')} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-2 p-6 bg-gray-50 dark:bg-black/20 rounded-2xl text-center text-[10px] text-gray-400 dark:text-gray-500 italic border border-dashed border-gray-200 dark:border-emerald-900/30">
                                        <span className="material-symbols-outlined text-4xl mb-2 block opacity-10">inventory_2</span>
                                        Keluarga tidak memiliki unit usaha.
                                    </div>
                                )}
                            </div>

                            {/* Row 3: Left (Housing & Basic Assets) */}
                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2 uppercase tracking-[0.2em] ml-1">
                                    <span className="material-symbols-outlined text-sm">home</span> Tempat Tinggal
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <LabelValue label="Status Rumah" value={`${data.economics_houseStatus} (${data.economics_houseType})`} />
                                    {data.economics_houseType === 'Permanen' && (
                                        <LabelValue label="Status IMB" value={data.economics_houseIMB} />
                                    )}
                                    <LabelValue label="Status Tanah" value={data.economics_landStatus} />
                                    <LabelValue label="Sumber Air" value={Array.isArray(data.economics_waterSource) ? data.economics_waterSource.join(', ') : data.economics_waterSource} />

                                    <div className="col-span-full">
                                        <LabelValue
                                            label="Daya Listrik Terpasang"
                                            fullWidth={true}
                                            value={data.economics_electricity_capacities && data.economics_electricity_capacities.length > 0 ? data.economics_electricity_capacities.map(cap => {
                                                const key = `economics_electricity_${cap.replace(/\D/g, '')}_qty` as keyof typeof data;
                                                const qty = data[key] as number;
                                                return `${cap} (${qty} unit)`;
                                            }).join(', ') : '-'}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                                    <h4 className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-2 uppercase tracking-[0.2em] ml-1 mb-3">
                                        <span className="material-symbols-outlined text-sm">inventory_2</span> Daftar Aset Keluarga
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.isArray(data.economics_assets) && data.economics_assets.length > 0 && !data.economics_assets.includes('Tidak ada') ? (
                                            data.economics_assets.map(asset => {
                                                let qty = 0;
                                                if (asset === 'Motor') qty = data.economics_asset_motor_qty;
                                                if (asset === 'Mobil') qty = data.economics_asset_mobil_qty;
                                                if (asset === 'Kulkas') qty = data.economics_asset_kulkas_qty;
                                                if (asset === 'Laptop/Komputer') qty = data.economics_asset_laptop_qty;
                                                if (asset === 'Televisi') qty = data.economics_asset_tv_qty;
                                                if (asset === 'Internet/Indihome') qty = data.economics_asset_internet_qty;
                                                if (asset === 'Lahan Pertanian') qty = data.economics_asset_lahan_qty;
                                                return (
                                                    <span key={asset} className="px-3 py-1 bg-white dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                                                        {asset} {qty > 0 && <span className="ml-1 opacity-70">({qty})</span>}
                                                    </span>
                                                );
                                            })
                                        ) : <span className="text-xs italic text-gray-400">Tidak ada aset</span>}
                                    </div>
                                </div>
                            </div>


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
                                className="peer appearance-none w-6 h-6 border-2 border-slate-400 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-800 checked:bg-emerald-600 checked:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20 transition-all cursor-pointer hover:border-emerald-400"
                                checked={data.agreedToPrivacy}
                                onChange={(e) => update({ agreedToPrivacy: e.target.checked })}
                            />
                            <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-base font-bold animate-scale-in">check</span>
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
                                className="peer appearance-none w-6 h-6 border-2 border-slate-400 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-800 checked:bg-emerald-600 checked:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20 transition-all cursor-pointer hover:border-emerald-400"
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
