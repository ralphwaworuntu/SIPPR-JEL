import React, { useState } from 'react';
import { type FormData } from '../../types';
import FormRadioGroup from '../ui/FormRadioGroup';
import SectionHeader from '../ui/SectionHeader';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
}

const Step3Commitment: React.FC<StepProps> = ({ data, update }) => {
    const [skillInputs, setSkillInputs] = useState<Record<number, string>>({});

    const handleAddSkill = (index: number) => {
        const input = skillInputs[index]?.trim();
        if (!input) return;

        const newList = [...data.professionalFamilyMembers];
        const currentSkills = newList[index].specificSkills || [];
        if (!currentSkills.includes(input)) {
            newList[index].specificSkills = [...currentSkills, input];
            update({ professionalFamilyMembers: newList });
        }
        setSkillInputs({ ...skillInputs, [index]: '' });
    };

    const removeSkill = (memberIndex: number, skillToRemove: string) => {
        const newList = [...data.professionalFamilyMembers];
        newList[memberIndex].specificSkills = newList[memberIndex].specificSkills.filter(s => s !== skillToRemove);
        update({ professionalFamilyMembers: newList });
    };

    const inputClass = "w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-200 placeholder-slate-400 dark:placeholder-slate-600 text-sm";

    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                Informasi Profesional
            </h3>

            <div className="space-y-4">
                <SectionHeader title="Apakah ada anggota keluarga yang memiliki Keahlian Profesional?" icon="work" />
                <FormRadioGroup
                    name="willingness"
                    options={['Ya', 'Tidak']}
                    value={data.willingnessToServe}
                    onChange={(val) => update({ willingnessToServe: val as 'Ya' | 'Tidak', ...(val === 'Tidak' ? { professionalFamilyMembers: [] } : {}) })}
                    columns={2}
                    id="willingnessToServe"
                />

                {(data.willingnessToServe === 'Ya' || data.willingnessToServe === 'Tidak') && (
                    <div className="animate-fadeIn mt-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-slate-900 dark:text-white text-base font-bold block">
                                {data.willingnessToServe === 'Ya' ? 'Daftar Anggota Keluarga Profesional' : 'Daftar Anggota Keluarga (Pekerjaan & Pelayanan)'}
                            </label>
                            <button
                                type="button"
                                onClick={() => {
                                    const currentList = data.professionalFamilyMembers || [];
                                    update({
                                        professionalFamilyMembers: [
                                            ...currentList,
                                            {
                                                name: '',
                                                skillType: '',
                                                skillLevel: '',
                                                workplace: '',
                                                position: '',
                                                yearsExperience: '',
                                                specificSkills: [],
                                                churchServiceInterest: '',
                                                serviceInterestArea: '',
                                                contributionForm: [],
                                                communityConsent: false
                                            }
                                        ]
                                    });
                                }}
                                className="text-sm font-semibold text-primary flex items-center gap-1 bg-primary/5 dark:bg-primary/10 px-4 py-2 rounded-xl transition-all duration-300 hover:bg-primary hover:text-white hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20"
                            >
                                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                                Tambah Anggota
                            </button>
                        </div>

                        {(data.professionalFamilyMembers || []).map((member, index) => (
                            <div key={index} className="p-5 border-2 border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800/50 relative animate-fade-in-up transition-all duration-300 hover:shadow-lg hover:border-primary/40 group">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newList = [...data.professionalFamilyMembers];
                                        newList.splice(index, 1);
                                        update({ professionalFamilyMembers: newList });
                                    }}
                                    className="absolute top-4 right-4 text-red-400 hover:text-white transition-all bg-red-50 dark:bg-red-900/20 hover:bg-red-500 p-2 rounded-xl opacity-0 group-hover:opacity-100"
                                    title="Hapus Anggota"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>

                                <div className="space-y-6">
                                    {/* Identity & Work Section */}
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Nama Anggota Keluarga<span className="text-red-500 ml-1">*</span></label>
                                            <input
                                                className={inputClass}
                                                placeholder="Nama Lengkap"
                                                type="text"
                                                value={member.name}
                                                onChange={(e) => {
                                                    const newList = [...data.professionalFamilyMembers];
                                                    newList[index].name = e.target.value;
                                                    update({ professionalFamilyMembers: newList });
                                                }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Tempat Kerja / Instansi<span className="text-red-500 ml-1">*</span></label>
                                                <input
                                                    className={inputClass}
                                                    placeholder="Nama Instansi/Perusahaan"
                                                    type="text"
                                                    value={member.workplace || ''}
                                                    onChange={(e) => {
                                                        const newList = [...data.professionalFamilyMembers];
                                                        newList[index].workplace = e.target.value;
                                                        update({ professionalFamilyMembers: newList });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Jabatan Saat Ini<span className="text-red-500 ml-1">*</span></label>
                                                <input
                                                    className={inputClass}
                                                    placeholder="Contoh: Staff, Manager"
                                                    type="text"
                                                    value={member.position || ''}
                                                    onChange={(e) => {
                                                        const newList = [...data.professionalFamilyMembers];
                                                        newList[index].position = e.target.value;
                                                        update({ professionalFamilyMembers: newList });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Lama Bekerja<span className="text-red-500 ml-1">*</span></label>
                                                <div className="flex flex-wrap gap-2">
                                                    {['< 1 Tahun', '1-3 Tahun', '3-5 Tahun', '5-10 Tahun', '> 10 Tahun'].map((opt) => (
                                                        <button
                                                            key={opt}
                                                            type="button"
                                                            onClick={() => {
                                                                const newList = [...data.professionalFamilyMembers];
                                                                newList[index].yearsExperience = opt;
                                                                update({ professionalFamilyMembers: newList });
                                                            }}
                                                            className={`px-3 py-2 text-xs font-semibold rounded-lg border-2 transition-all duration-200 ${member.yearsExperience === opt
                                                                ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                                                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-primary/40'
                                                                }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Specific Skills */}
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Keahlian Spesifik <span className="text-xs font-normal text-slate-500">(Dapat lebih dari satu)</span></label>
                                            <div className="flex gap-2">
                                                <input
                                                    className={`flex-1 ${inputClass}`}
                                                    placeholder="Ketik keahlian lalu tekan Enter atau Tambah"
                                                    type="text"
                                                    value={skillInputs[index] || ''}
                                                    onChange={(e) => setSkillInputs({ ...skillInputs, [index]: e.target.value })}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddSkill(index);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddSkill(index)}
                                                    className="bg-primary text-white px-5 rounded-xl font-semibold hover:bg-primary/90 transition-colors text-sm shrink-0"
                                                >
                                                    Tambah
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {(member.specificSkills || []).map((skill, skIndex) => (
                                                    <span key={skIndex} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSkill(index, skill)}
                                                            className="hover:text-red-500 transition-colors bg-white/50 dark:bg-black/20 rounded-full w-4 h-4 flex items-center justify-center"
                                                        >
                                                            <span className="material-symbols-outlined text-[12px] font-bold">close</span>
                                                        </button>
                                                    </span>
                                                ))}
                                                {(member.specificSkills || []).length === 0 && (
                                                    <span className="text-sm text-slate-400 italic">Belum ada keahlian spesifik ditambahkan.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Professional Skill Section - Conditional */}
                                    {data.willingnessToServe === 'Ya' && (
                                        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Jenis Keahlian Utama<span className="text-red-500 ml-1">*</span></label>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {[
                                                        { type: 'Kesehatan', desc: 'Dokter, Perawat, Bidan, Apoteker, Ahli Gizi, Psikolog.' },
                                                        { type: 'Teknologi & Digital', desc: 'IT Support, Programmer, Teknisi, Desainer Grafis, Editor Video.' },
                                                        { type: 'Hukum', desc: 'Pengacara, Advokat, Notaris, Hakim, Jaksa, Konsultan Hukum.' },
                                                        { type: 'Keuangan & Perbankan', desc: 'Akuntan, Auditor, Pegawai Bank, Konsultan Keuangan.' },
                                                        { type: 'Pendidikan', desc: 'Guru, Dosen, Pelatih, Tutor, Konselor Pendidikan.' },
                                                        { type: 'Teknik & Konstruksi', desc: 'Insinyur Sipil, Arsitek, Tukang Bangunan, Ahli Listrik.' },
                                                        { type: 'Seni, Musik & Kreatif', desc: 'Musisi, Penulis, Pelukis, Fotografer, Penari.' },
                                                        { type: 'Transportasi & Logistik', desc: 'Sopir, Pilot, Nahkoda, Mekanik, Kurir.' },
                                                        { type: 'Kuliner & Tata Busana', desc: 'Koki, Pembuat Kue, Penjahit, Desainer Fashion.' },
                                                        { type: 'Administrasi & Pemerintahan', desc: 'PNS, Sekretaris, Staff Admin, Perangkat Desa.' },
                                                        { type: 'Keamanan & Ketertiban', desc: 'TNI, POLRI, Satpam, Hansip, Petugas Keamanan.' },
                                                        { type: 'Pertanian & Alam', desc: 'Petani, Peternak, Nelayan, Ahli Lingkungan.' }
                                                    ].map((option) => (
                                                        <label key={option.type} className={`cursor-pointer p-3.5 border-2 rounded-xl flex flex-col gap-1 transition-all duration-200 relative min-h-[100px] select-none ${member.skillType === option.type ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                                            <input
                                                                type="radio"
                                                                name={`skillType-${index}`}
                                                                value={option.type}
                                                                checked={member.skillType === option.type}
                                                                onChange={() => {
                                                                    const newList = [...data.professionalFamilyMembers];
                                                                    newList[index].skillType = option.type;
                                                                    update({ professionalFamilyMembers: newList });
                                                                }}
                                                                className="sr-only"
                                                            />
                                                            <span className="font-bold text-slate-900 dark:text-white text-sm pr-6">{option.type}</span>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                                                {option.desc}
                                                            </p>
                                                            {member.skillType === option.type && (
                                                                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                                    <span className="material-symbols-outlined text-white text-sm">check</span>
                                                                </div>
                                                            )}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Tingkat Keahlian (Skala 1-3)<span className="text-red-500 ml-1">*</span></label>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    {[
                                                        { level: '1', label: 'Dasar', desc: 'Memahami teori/dasar, perlu bimbingan untuk praktik.' },
                                                        { level: '2', label: 'Menengah', desc: 'Mampu mengerjakan secara mandiri dengan hasil yang baik.' },
                                                        { level: '3', label: 'Mahir', desc: 'Sangat ahli, profesional, atau mampu melatih orang lain.' }
                                                    ].map((option) => (
                                                        <label key={option.level} className={`cursor-pointer p-3.5 border-2 rounded-xl flex flex-col gap-1 transition-all duration-200 relative select-none ${member.skillLevel === option.level ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                                            <input
                                                                type="radio"
                                                                name={`skillLevel-${index}`}
                                                                value={option.level}
                                                                checked={member.skillLevel === option.level}
                                                                onChange={() => {
                                                                    const newList = [...data.professionalFamilyMembers];
                                                                    newList[index].skillLevel = option.level as '1' | '2' | '3';
                                                                    update({ professionalFamilyMembers: newList });
                                                                }}
                                                                className="sr-only"
                                                            />
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${member.skillLevel === option.level ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                                                    {option.level}
                                                                </span>
                                                                <span className="font-bold text-slate-900 dark:text-white text-sm">{option.label}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                                {option.desc}
                                                            </p>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Service Interest Section */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex flex-col gap-3">
                                            <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Bersedia terlibat dalam pelayanan berbasis profesi?<span className="text-red-500 ml-1">*</span></label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { value: 'Ya, bersedia aktif', desc: 'Saya rindu terlibat aktif dalam pelayanan.' },
                                                    { value: 'Ya, bila dibutuhkan', desc: 'Saya bersedia bila dibutuhkan.' }
                                                ].map((opt) => (
                                                    <label key={opt.value} className={`cursor-pointer p-3.5 border-2 rounded-xl flex flex-col gap-1 transition-all duration-200 relative select-none ${member.churchServiceInterest === opt.value ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                                        <input
                                                            type="radio"
                                                            name={`serviceInterest-${index}`}
                                                            value={opt.value}
                                                            checked={member.churchServiceInterest === opt.value}
                                                            onChange={() => {
                                                                const newList = [...data.professionalFamilyMembers];
                                                                newList[index].churchServiceInterest = opt.value;
                                                                update({ professionalFamilyMembers: newList });
                                                            }}
                                                            className="sr-only"
                                                        />
                                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{opt.value}</span>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                                                            {opt.desc}
                                                        </p>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Service Interest Area */}
                                        <div className="flex flex-col gap-3 animate-fadeIn">
                                            <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Bidang Minat Pelayanan yang Diminati?<span className="text-red-500 ml-1">*</span></label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { value: 'Sesuai Profesi', desc: 'Pelayanan yang sesuai dengan keahlian profesional saya.' },
                                                    { value: 'Lintas Profesi', desc: 'Pelayanan di luar bidang keahlian utama saya.' }
                                                ].map((opt) => (
                                                    <label key={opt.value} className={`cursor-pointer p-3.5 border-2 rounded-xl flex flex-col gap-1 transition-all duration-200 relative select-none ${member.serviceInterestArea === opt.value ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                                        <input
                                                            type="radio"
                                                            name={`serviceInterestArea-${index}`}
                                                            value={opt.value}
                                                            checked={member.serviceInterestArea === opt.value}
                                                            onChange={() => {
                                                                const newList = [...data.professionalFamilyMembers];
                                                                newList[index].serviceInterestArea = opt.value;
                                                                update({ professionalFamilyMembers: newList });
                                                            }}
                                                            className="sr-only"
                                                        />
                                                        <span className="font-bold text-slate-900 dark:text-white text-sm">{opt.value}</span>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                                                            {opt.desc}
                                                        </p>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Contribution Form */}
                                        <div className="flex flex-col gap-3 animate-fadeIn">
                                            <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Bentuk Kontribusi<span className="text-red-500 ml-1">*</span></label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Tenaga', 'Pikiran', 'Dana', 'Waktu'].map((opt) => {
                                                    const isChecked = member.contributionForm?.includes(opt) || false;
                                                    return (
                                                        <label key={opt} className={`cursor-pointer p-3.5 border-2 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 select-none ${isChecked ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${isChecked ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                                                {isChecked && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                value={opt}
                                                                checked={isChecked}
                                                                onChange={(e) => {
                                                                    const newList = [...data.professionalFamilyMembers];
                                                                    const currentForms = newList[index].contributionForm || [];
                                                                    if (e.target.checked) {
                                                                        newList[index].contributionForm = [...currentForms, opt];
                                                                    } else {
                                                                        newList[index].contributionForm = currentForms.filter(item => item !== opt);
                                                                    }
                                                                    update({ professionalFamilyMembers: newList });
                                                                }}
                                                                className="sr-only"
                                                            />
                                                            <span className="font-bold text-slate-900 dark:text-white text-sm">{opt}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Community Consent */}
                                        <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-dashed border-slate-200 dark:border-slate-700 animate-fadeIn">
                                            <label className={`cursor-pointer flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${member.communityConsent ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${member.communityConsent ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                                    {member.communityConsent && <span className="material-symbols-outlined text-white text-base">check</span>}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={member.communityConsent || false}
                                                    onChange={(e) => {
                                                        const newList = [...data.professionalFamilyMembers];
                                                        newList[index].communityConsent = e.target.checked;
                                                        update({ professionalFamilyMembers: newList });
                                                    }}
                                                    className="sr-only"
                                                />
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-slate-900 dark:text-white text-sm">Persetujuan Bergabung Komunitas Profesional</span>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        Saya menyetujui bahwa akan bergabung dalam komunitas profesional Jemaat GMIT Emaus Liliba untuk keperluan koordinasi dan pengembangan pelayanan.
                                                    </p>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step3Commitment;
