import React, { useState, useEffect, useRef } from 'react';
import { type FormData } from '../../types';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
    goToStep: (step: number, editing?: boolean) => void;
}

const Step3Commitment: React.FC<StepProps> = ({ data, update }) => {
    const [skillInputs, setSkillInputs] = useState<Record<number, string>>({});
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const prevLength = useRef(data.professionalFamilyMembers?.length || 0);
    const detailsRef = useRef<HTMLDetailsElement>(null);

    // Auto-close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
                detailsRef.current.removeAttribute('open');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        // Auto-initialize first member if empty
        if (!data.professionalFamilyMembers || data.professionalFamilyMembers.length === 0) {
            update({
                professionalFamilyMembers: [{
                    name: '',
                    hasProfessionalSkill: '',
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
                }]
            });
            setEditingIndex(0);
            return;
        }

        const currentLength = data.professionalFamilyMembers?.length || 0;
        if (currentLength > prevLength.current) {
            setEditingIndex(currentLength - 1);
        }
        prevLength.current = currentLength;
    }, [data.professionalFamilyMembers]);

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
            {(data.professionalFamilyMembers || []).map((member, index) => {
                if (editingIndex !== index) {
                    return (
                        <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/30 animate-fadeIn">
                            <div className="flex flex-col gap-1 flex-1">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-xl">person</span>
                                    {member.name || 'Anggota Tanpa Nama'}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    {(member.workplace || member.position) ? (
                                        <span className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">work</span>
                                            {member.position}{member.position && member.workplace ? ' di ' : ''}{member.workplace}
                                        </span>
                                    ) : (
                                        <span className="italic">Data pekerjaan belum lengkap</span>
                                    )}
                                    {data.willingnessToServe === 'Ya' && member.skillType && (
                                        <>
                                            <span className="hidden md:inline">•</span>
                                            <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-lg text-xs font-semibold">
                                                {member.skillType}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 md:w-auto w-full justify-end border-t md:border-t-0 border-slate-100 dark:border-slate-700 pt-3 md:pt-0 mt-3 md:mt-0">
                                <button
                                    type="button"
                                    onClick={() => setEditingIndex(index)}
                                    className="text-primary hover:bg-primary/10 dark:hover:bg-primary/20 bg-primary/5 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newList = [...data.professionalFamilyMembers];
                                        newList.splice(index, 1);
                                        update({ professionalFamilyMembers: newList });
                                        if (editingIndex === index) setEditingIndex(null);
                                        else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
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
                    <div key={index} className="p-5 border-2 border-primary/40 rounded-2xl bg-white dark:bg-slate-800/80 relative animate-fade-in-up transition-all duration-300 shadow-xl shadow-primary/5 mt-4 group">

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
                                        <div className="relative">
                                            <select
                                                className={`${inputClass} appearance-none pr-10`}
                                                value={member.yearsExperience || ''}
                                                onChange={(e) => {
                                                    const newList = [...data.professionalFamilyMembers];
                                                    newList[index].yearsExperience = e.target.value;
                                                    update({ professionalFamilyMembers: newList });
                                                }}
                                            >
                                                <option value="">Pilih Lama Bekerja...</option>
                                                <option value="< 1 Tahun">Kurang dari 1 Tahun</option>
                                                <option value="1-3 Tahun">1 - 3 Tahun</option>
                                                <option value="3-5 Tahun">3 - 5 Tahun</option>
                                                <option value="5-10 Tahun">5 - 10 Tahun</option>
                                                <option value="> 10 Tahun">Lebih dari 10 Tahun</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
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
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 rounded-xl font-bold transition-all duration-200 text-sm shrink-0 flex items-center gap-2 border-2 border-emerald-600/20 shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-lg">add</span>
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

                            {/* Has Professional Skill Question */}
                            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                                <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Apakah anggota ini memiliki Keahlian Profesional?<span className="text-red-500 ml-1">*</span></label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['Ya', 'Tidak'].map((opt) => (
                                        <label key={opt} className={`cursor-pointer p-3.5 border-2 rounded-xl flex items-center gap-3 transition-all duration-200 select-none ${member.hasProfessionalSkill === opt ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${member.hasProfessionalSkill === opt ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                                {member.hasProfessionalSkill === opt && <div className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name={`hasProfessionalSkill-${index}`}
                                                value={opt}
                                                checked={member.hasProfessionalSkill === opt}
                                                onChange={() => {
                                                    const newList = [...data.professionalFamilyMembers];
                                                    newList[index].hasProfessionalSkill = opt as 'Ya' | 'Tidak';
                                                    if (opt === 'Tidak') {
                                                        // Reset professional-specific fields if they select "Tidak"
                                                        newList[index].skillType = '';
                                                        newList[index].skillLevel = '';
                                                    }
                                                    update({ professionalFamilyMembers: newList });
                                                }}
                                                className="sr-only"
                                            />
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Professional Skill Section - Conditional */}
                            {member.hasProfessionalSkill === 'Ya' && (
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Jenis Keahlian Utama<span className="text-red-500 ml-1">*</span></label>
                                        <div className="relative">
                                            <select
                                                className={`${inputClass} appearance-none pr-10`}
                                                value={
                                                    !member.skillType ? "" :
                                                        [
                                                            'Kesehatan & Medis',
                                                            'Pendidikan & Pelatihan',
                                                            'Teknologi, IT & Digital',
                                                            'Teknik, Sipil & Konstruksi',
                                                            'Hukum, Advokasi & Keamanan',
                                                            'Keuangan, Akuntansi & Perbankan',
                                                            'Seni, Musik & Kreatif',
                                                            'Kewirausahaan & Bisnis',
                                                            'Pelayanan Jasa & Perdagangan',
                                                            'Administrasi & Pemerintahan',
                                                            'Agrikultur & Alam'
                                                        ].includes(member.skillType) ? member.skillType : 'Lainnya'
                                                }
                                                onChange={(e) => {
                                                    const newList = [...data.professionalFamilyMembers];
                                                    newList[index].skillType = e.target.value === 'Lainnya' ? '' : e.target.value;
                                                    update({ professionalFamilyMembers: newList });
                                                }}
                                            >
                                                <option value="">Pilih Jenis Keahlian...</option>
                                                <option value="Kesehatan & Medis">Kesehatan & Medis (Dokter, Perawat, Psikolog, dll)</option>
                                                <option value="Pendidikan & Pelatihan">Pendidikan & Pelatihan (Guru, Dosen, Tutor, dll)</option>
                                                <option value="Teknologi, IT & Digital">Teknologi, IT & Digital (Programmer, Desainer, Teknisi, dll)</option>
                                                <option value="Teknik, Sipil & Konstruksi">Teknik, Sipil & Konstruksi (Insinyur, Arsitek, Tukang, dll)</option>
                                                <option value="Hukum, Advokasi & Keamanan">Hukum, Advokasi & Keamanan (Pengacara, Polisi, dll)</option>
                                                <option value="Keuangan, Akuntansi & Perbankan">Keuangan, Akuntansi & Perbankan (Akuntan, Pegawai Bank, dll)</option>
                                                <option value="Seni, Musik & Kreatif">Seni, Musik & Kreatif (Musisi, Pemain Musik Gereja, dll)</option>
                                                <option value="Kewirausahaan & Bisnis">Kewirausahaan & Bisnis (Pedagang, Pemilik Usaha, dll)</option>
                                                <option value="Pelayanan Jasa & Perdagangan">Pelayanan Jasa & Perdagangan (Sopir, Koki, Penjahit, dll)</option>
                                                <option value="Administrasi & Pemerintahan">Administrasi & Pemerintahan (PNS, Admin, Staf, dll)</option>
                                                <option value="Agrikultur & Alam">Agrikultur & Alam (Pertanian, Peternakan, Nelayan, dll)</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                        </div>

                                        {/* Lainnya Input Box */}
                                        {member.skillType !== undefined && ![
                                            '',
                                            'Kesehatan & Medis',
                                            'Pendidikan & Pelatihan',
                                            'Teknologi, IT & Digital',
                                            'Teknik, Sipil & Konstruksi',
                                            'Hukum, Advokasi & Keamanan',
                                            'Keuangan, Akuntansi & Perbankan',
                                            'Seni, Musik & Kreatif',
                                            'Kewirausahaan & Bisnis',
                                            'Pelayanan Jasa & Perdagangan',
                                            'Administrasi & Pemerintahan',
                                            'Agrikultur & Alam'
                                        ].includes(member.skillType) && (
                                                <div className="mt-2 animate-fadeIn">
                                                    <input
                                                        type="text"
                                                        placeholder="Spesifikasikan Keahlian Utama Anda..."
                                                        className={inputClass}
                                                        value={member.skillType}
                                                        onChange={(e) => {
                                                            const newList = [...data.professionalFamilyMembers];
                                                            newList[index].skillType = e.target.value;
                                                            update({ professionalFamilyMembers: newList });
                                                        }}
                                                    />
                                                </div>
                                            )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Tingkat Keahlian (Skala 1-3)<span className="text-red-500 ml-1">*</span></label>
                                        <div className="relative">
                                            <select
                                                className={`${inputClass} appearance-none pr-10`}
                                                value={member.skillLevel || ''}
                                                onChange={(e) => {
                                                    const newList = [...data.professionalFamilyMembers];
                                                    newList[index].skillLevel = e.target.value as '1' | '2' | '3';
                                                    update({ professionalFamilyMembers: newList });
                                                }}
                                            >
                                                <option value="">Pilih Tingkat Keahlian...</option>
                                                <option value="1">1 - Tingkat Dasar (Memahami teori, butuh bimbingan)</option>
                                                <option value="2">2 - Tingkat Menengah (Mampu mandiri dengan baik)</option>
                                                <option value="3">3 - Tingkat Mahir (Sangat ahli, bisa melatih orang lain)</option>
                                            </select>
                                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
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

                                {/* Contribution Form - Multi Select Dropdown */}
                                <div className="flex flex-col gap-2 relative animate-fadeIn" style={{ zIndex: 10 }}>
                                    <label className="text-sm font-bold text-slate-800 dark:text-slate-100">Bentuk Kontribusi<span className="text-red-500 ml-1">*</span></label>
                                    <details className="group" ref={detailsRef}>
                                        <summary className={`${inputClass} flex items-center justify-between cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden`}>
                                            <span className={`block truncate ${(!member.contributionForm || member.contributionForm.length === 0) ? 'text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white font-semibold'}`}>
                                                {(!member.contributionForm || member.contributionForm.length === 0)
                                                    ? 'Pilih Bentuk Kontribusi...'
                                                    : member.contributionForm.join(', ')}
                                            </span>
                                            <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform duration-300">expand_more</span>
                                        </summary>
                                        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden transform opacity-0 scale-95 origin-top group-open:opacity-100 group-open:scale-100 transition-all duration-200 opacity-0 group-open:opacity-100 pointer-events-none group-open:pointer-events-auto flex flex-col max-h-[250px] overflow-y-auto">
                                            <div className="p-2 flex flex-col gap-1">
                                                {['Tenaga', 'Pikiran', 'Dana', 'Waktu'].map((opt) => {
                                                    const isChecked = member.contributionForm?.includes(opt) || false;
                                                    return (
                                                        <label key={opt} className={`cursor-pointer p-3 rounded-lg flex items-center gap-3 transition-colors duration-200 select-none ${isChecked ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${isChecked ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                                                                {isChecked && <span className="material-symbols-outlined text-slate-900 dark:text-white text-[14px]">check</span>}
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
                                                            <span className={`font-semibold text-sm ${isChecked ? 'text-primary dark:text-primary' : 'text-slate-700 dark:text-slate-200'}`}>{opt}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </details>
                                </div>

                                {/* Community Consent */}
                                <div className="col-span-1 md:col-span-2 pt-4 mt-2 border-t border-dashed border-slate-200 dark:border-slate-700 animate-fadeIn">
                                    <label className={`cursor-pointer flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${member.communityConsent ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
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
                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 ${member.communityConsent ? 'bg-primary border-primary' : 'border-slate-300 dark:border-slate-600'}`}>
                                            {member.communityConsent && <span className="material-symbols-outlined text-slate-900 dark:text-white text-base">check</span>}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">Persetujuan Bergabung Komunitas Profesional</span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                Saya menyetujui bahwa akan bergabung dalam komunitas profesional Jemaat GMIT Emaus Liliba untuk keperluan koordinasi dan pengembangan pelayanan.
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons inside full form */}
                            <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingIndex(null);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="bg-primary text-slate-900 dark:text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 flex items-center gap-2 shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
                                >
                                    <span className="material-symbols-outlined text-xl">save</span>
                                    Simpan Anggota Ini
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* Always show Add More button if not currently adding/editing a new empty one */}
            {editingIndex === null && (
                <button
                    type="button"
                    onClick={() => {
                        const newList = [...(data.professionalFamilyMembers || [])];
                        newList.push({
                            name: '',
                            hasProfessionalSkill: '',
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
                        });
                        update({ professionalFamilyMembers: newList });
                    }}
                    className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all duration-300 group"
                >
                    <span className="material-symbols-outlined group-hover:scale-125 transition-transform">person_add</span>
                    <span className="font-bold">Tambah Anggota Keluarga Profesional Lainnya</span>
                </button>
            )}
        </div>
    );
};

export default Step3Commitment;
