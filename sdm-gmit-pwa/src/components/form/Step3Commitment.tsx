import React from 'react';
import { type FormData } from '../../types';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
}

const Step3Commitment: React.FC<StepProps> = ({ data, update }) => {
    const interestOptions = [
        'Pendidikan/ Mengajar',
        'Kesehatan',
        'Teknologi & Multimedia',
        'Musik & Liturgi',
        'Sosial & Diakonia',
        'Hukum & Advokasi',
        'Ekonomi & Bisnis',
        'Konstruksi & Pembangunan',
        'Administrasi & Sekretariat',
        'Transportasi & Logistik'
    ];

    const contributionOptions = [
        'Tenaga Ahli/ Konsultan',
        'Mentor/ Pelatih',
        'Dukungan Teknis',
        'Donatur/ Finansial',
        'Manajemen Proyek',
        'Relawan Lapangan'
    ];

    const handleCheckboxChange = (field: 'interestAreas' | 'contributionTypes', value: string) => {
        const current = data[field];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
        update({ [field]: updated });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">volunteer_activism</span>
                Komitmen Pelayanan
            </h3>

            <div className="space-y-4">
                <label className="text-black dark:text-[#f8fcf9] text-base font-bold leading-normal block">Kesediaan Melayani<span className="text-red-500 ml-1">*</span></label>
                <div className="grid md:grid-cols-2 gap-4" id="willingnessToServe">
                    <label className={`cursor-pointer p-4 border rounded-xl flex items-center gap-3 transition-all ${data.willingnessToServe === 'Aktif' ? 'border-primary bg-primary/10 shadow-sm' : 'border-[#cfe7d7] hover:bg-[#e7f3eb] dark:border-[#1d3324] dark:hover:bg-[#1d3324]'}`}>
                        <input
                            type="radio"
                            name="willingness"
                            value="Aktif"
                            checked={data.willingnessToServe === 'Aktif'}
                            onChange={() => update({ willingnessToServe: 'Aktif' })}
                            className="w-5 h-5 text-primary focus:ring-primary accent-primary"
                        />
                        <div>
                            <span className="block font-semibold text-black dark:text-white">Aktif/ Rutin</span>
                            <span className="text-sm text-[#4c9a66]">Bersedia terlibat dalam pelayanan rutin atau kepanitiaan tetap.</span>
                        </div>
                    </label>

                    <label className={`cursor-pointer p-4 border rounded-xl flex items-center gap-3 transition-all ${data.willingnessToServe === 'On-demand' ? 'border-primary bg-primary/10 shadow-sm' : 'border-[#cfe7d7] hover:bg-[#e7f3eb] dark:border-[#1d3324] dark:hover:bg-[#1d3324]'}`}>
                        <input
                            type="radio"
                            name="willingness"
                            value="On-demand"
                            checked={data.willingnessToServe === 'On-demand'}
                            onChange={() => update({ willingnessToServe: 'On-demand' })}
                            className="w-5 h-5 text-primary focus:ring-primary accent-primary"
                        />
                        <div>
                            <span className="block font-semibold text-black dark:text-white">Sesuai Panggilan (On-demand)</span>
                            <span className="text-sm text-[#4c9a66]">Bersedia dihubungi sewaktu-waktu jika keahlian dibutuhkan.</span>
                        </div>
                    </label>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-black dark:text-[#f8fcf9] text-base font-bold leading-normal block">Bidang Minat Pelayanan<span className="text-red-500 ml-1">*</span></label>
                <p className="text-sm text-[#4c9a66]">Pilih bidang di mana anda berminat untuk berkontribusi.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {interestOptions.map(option => (
                        <label key={option} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${data.interestAreas.includes(option) ? 'border-primary bg-primary/5' : 'border-[#cfe7d7] hover:bg-[#e7f3eb] dark:border-[#1d3324] dark:hover:bg-[#1d3324]'}`}>
                            <input
                                type="checkbox"
                                checked={data.interestAreas.includes(option)}
                                onChange={() => handleCheckboxChange('interestAreas', option)}
                                className="w-5 h-5 rounded text-primary focus:ring-primary border-[#cfe7d7] accent-primary"
                            />
                            <span className="text-black dark:text-[#f8fcf9] text-sm font-medium">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-black dark:text-[#f8fcf9] text-base font-bold leading-normal block">Bentuk Kontribusi<span className="text-red-500 ml-1">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contributionOptions.map(option => (
                        <label key={option} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${data.contributionTypes.includes(option) ? 'border-primary bg-primary/5' : 'border-[#cfe7d7] hover:bg-[#e7f3eb] dark:border-[#1d3324] dark:hover:bg-[#1d3324]'}`}>
                            <input
                                type="checkbox"
                                checked={data.contributionTypes.includes(option)}
                                onChange={() => handleCheckboxChange('contributionTypes', option)}
                                className="w-5 h-5 rounded text-primary focus:ring-primary border-[#cfe7d7] accent-primary"
                            />
                            <span className="text-black dark:text-[#f8fcf9] text-sm font-medium">{option}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Step3Commitment;
