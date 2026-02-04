import React, { useState } from 'react';
import { type FormData } from '../../types';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
}

const Step2Professional: React.FC<StepProps> = ({ data, update }) => {
    const [skillInput, setSkillInput] = useState('');

    const addSkill = () => {
        if (skillInput.trim() && !data.skills.includes(skillInput.trim())) {
            update({ skills: [...data.skills, skillInput.trim()] });
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        update({ skills: data.skills.filter(skill => skill !== skillToRemove) });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-fadeIn">
            {/* Education Section */}
            <div>
                <h2 className="text-black dark:text-white text-[20px] font-bold leading-tight tracking-[-0.015em] pb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">school</span>
                    Pendidikan & Keahlian
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-black dark:text-white/90">Jenjang Pendidikan<span className="text-red-500 ml-1">*</span></label>
                        <select
                            className="w-full h-11 px-4 rounded-lg border border-[#e7f3eb] dark:border-white/10 bg-white dark:bg-[#1a2e20] text-black dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                            id="educationLevel"
                            value={data.educationLevel}
                            onChange={(e) => update({ educationLevel: e.target.value })}
                        >
                            <option value="">Pilih Jenjang</option>
                            <option value="SD">SD</option>
                            <option value="SMP">SMP</option>
                            <option value="SMA">SMA / SMK</option>
                            <option value="D3">Diploma (D3)</option>
                            <option value="S1">Sarjana (S1 / D4)</option>
                            <option value="S2">Magister (S2)</option>
                            <option value="S3">Doktor (S3)</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-black dark:text-white/90">Jurusan / Bidang Studi</label>
                        <input
                            className="w-full h-11 px-4 rounded-lg border border-[#e7f3eb] dark:border-white/10 bg-white dark:bg-[#1a2e20] text-black dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-400"
                            placeholder="Contoh: Teknik Informatika, Akuntansi"
                            type="text"
                            value={data.major}
                            onChange={(e) => update({ major: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Work Section */}
            <div>
                <h2 className="text-black dark:text-white text-[20px] font-bold leading-tight tracking-[-0.015em] pb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">work</span>
                    Pekerjaan Saat Ini
                </h2>
                <div className="grid grid-cols-1 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-black dark:text-white/90">Kategori Pekerjaan (KBJI)<span className="text-red-500 ml-1">*</span></label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#4c9a66]">search</span>
                            <select
                                className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#e7f3eb] dark:border-white/10 bg-white dark:bg-[#1a2e20] text-black dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                id="jobCategory"
                                value={data.jobCategory}
                                onChange={(e) => update({ jobCategory: e.target.value })}
                            >
                                <option value="">Pilih atau Cari Kategori...</option>
                                {[
                                    'Tenaga Profesional',
                                    'Teknisi dan Asisten Tenaga Profesional',
                                    'Tenaga Tata Usaha',
                                    'Tenaga Usaha Jasa dan Penjualan',
                                    'Pekerja Pertanian, Kehutanan dan Perikanan',
                                    'Pekerja Pengolahan, Kerajinan',
                                    'Operator dan Perakit Mesin',
                                    'Pekerja Kasar',
                                    'TNI / Polri',
                                    'Wirausaha',
                                    'Pelajar / Mahasiswa',
                                    'Mengurus Rumah Tangga',
                                    'Pensiunan',
                                    'Belum/Tidak Bekerja'
                                ].map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-[#4c9a66] italic">KBJI: Klasifikasi Baku Jenis Pekerjaan Indonesia</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-black dark:text-white/90">Instansi / Perusahaan</label>
                            <input
                                className="w-full h-11 px-4 rounded-lg border border-[#e7f3eb] dark:border-white/10 bg-white dark:bg-[#1a2e20] text-black dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-400"
                                placeholder="Nama tempat bekerja"
                                type="text"
                                value={data.companyName}
                                onChange={(e) => update({ companyName: e.target.value })}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-black dark:text-white/90">Lama Bekerja (Tahun)</label>
                            <input
                                className="w-full h-11 px-4 rounded-lg border border-[#e7f3eb] dark:border-white/10 bg-white dark:bg-[#1a2e20] text-black dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-400"
                                placeholder="0"
                                type="number"
                                min="0"
                                value={data.yearsOfExperience}
                                onChange={(e) => update({ yearsOfExperience: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-black dark:text-white/90">Jabatan Spesifik</label>
                        <input
                            className="w-full h-11 px-4 rounded-lg border border-[#e7f3eb] dark:border-white/10 bg-white dark:bg-[#1a2e20] text-black dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-400"
                            placeholder="Contoh: Senior Web Developer"
                            type="text"
                            value={data.jobTitle}
                            onChange={(e) => update({ jobTitle: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div>
                <h2 className="text-black dark:text-white text-[20px] font-bold leading-tight tracking-[-0.015em] pb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">psychology</span>
                    Keahlian Teknis & Bakat
                </h2>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-black dark:text-white/90">Tambah Keahlian</label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 h-11 px-4 rounded-lg border border-[#e7f3eb] dark:border-white/10 bg-white dark:bg-[#1a2e20] text-black dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder-gray-400"
                                placeholder="Contoh: Desain Web, Paduan Suara, Editing Video"
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <button
                                className="bg-primary hover:bg-primary/90 text-black font-bold px-6 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                                type="button"
                                onClick={addSkill}
                            >
                                <span className="material-symbols-outlined">add</span>
                                Tambah
                            </button>
                        </div>
                    </div>
                    {/* Tag Cloud Container */}
                    <div className="flex flex-wrap gap-2 p-4 min-h-[100px] border-2 border-dashed border-[#e7f3eb] dark:border-white/10 rounded-lg bg-background-light dark:bg-black/20">
                        {data.skills.length === 0 && (
                            <div className="w-full flex items-center justify-center text-gray-400 text-sm italic">
                                *Ketik dan klik 'Tambah' atau tekan Enter
                            </div>
                        )}
                        {data.skills.map((skill, index) => (
                            <div key={index} className="bg-primary/20 text-black dark:text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 border border-primary/30 animate-fadeIn">
                                {skill}
                                <button
                                    className="material-symbols-outlined text-xs hover:text-red-500 transition-colors cursor-pointer"
                                    type="button"
                                    onClick={() => removeSkill(skill)}
                                >
                                    close
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2Professional;
