import React from 'react';
import { type FormData } from '../../types';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
}

const Step4Consent: React.FC<StepProps> = ({ data, update }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                Validasi Data
            </h3>

            <div className="bg-[#e7f3eb] dark:bg-[#1d3324] border border-[#cfe7d7] dark:border-[#2a4532] rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-white dark:bg-[#102216] p-3 rounded-full shadow-sm text-primary">
                    <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-black dark:text-white mb-2">Pernyataan Privasi Data</h3>
                    <p className="text-black dark:text-[#f8fcf9] leading-relaxed mb-4 text-sm">
                        Data yang Anda kirimkan melalui formulir ini akan disimpan dalam database GMIT Emaus Liliba.
                        Data ini bersifat <strong>RAHASIA</strong> dan hanya akan digunakan untuk keperluan pelayanan gereja, pemetaan potensi jemaat,
                        dan pembentuk komunitas profesional. Data tidak akan dibagikan kepada pihak ketiga tanpa persetujuan Anda.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-bold text-black dark:text-white">Konfirmasi Data</h3>

                <div className="bg-background-light dark:bg-background-dark border border-[#cfe7d7] dark:border-[#1d3324] rounded-xl overflow-hidden text-sm">
                    {/* Identitas Diri */}
                    <div className="bg-[#e7f3eb] dark:bg-[#1d3324] px-4 py-2 border-b border-[#cfe7d7] dark:border-[#2a4532] font-bold text-black dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">person</span>
                        Identitas Pribadi
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
                        <div>
                            <div className="text-[#4c9a66] text-xs">Nama Lengkap</div>
                            <div className="font-medium text-black dark:text-white">{data.fullName || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Jenis Kelamin</div>
                            <div className="font-medium text-black dark:text-white">{data.gender || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Tanggal Lahir</div>
                            <div className="font-medium text-black dark:text-white">{data.dateOfBirth || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Nomor Telepon</div>
                            <div className="font-medium text-black dark:text-white">{data.phone || '-'}</div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="text-[#4c9a66] text-xs">Alamat</div>
                            <div className="font-medium text-black dark:text-white">{data.address || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Sektor</div>
                            <div className="font-medium text-black dark:text-white">{data.sector || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Lingkungan</div>
                            <div className="font-medium text-black dark:text-white">{data.lingkungan || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Rayon</div>
                            <div className="font-medium text-black dark:text-white">{data.rayon || '-'}</div>
                        </div>
                    </div>

                    {/* Profil Profesional */}
                    <div className="bg-[#e7f3eb] dark:bg-[#1d3324] px-4 py-2 border-y border-[#cfe7d7] dark:border-[#2a4532] font-bold text-black dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">work</span>
                        Profil Profesional
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
                        <div>
                            <div className="text-[#4c9a66] text-xs">Pendidikan Terakhir</div>
                            <div className="font-medium text-black dark:text-white">{data.educationLevel || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Program Studi/ Jurusan</div>
                            <div className="font-medium text-black dark:text-white">{data.major || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Kategori Bidang Pekerjaan</div>
                            <div className="font-medium text-black dark:text-white">{data.jobCategory || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Jabatan/ Spesialisasi Spesifik</div>
                            <div className="font-medium text-black dark:text-white">{data.jobTitle || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Instansi/ Tempat Bekerja</div>
                            <div className="font-medium text-black dark:text-white">{data.companyName || '-'}</div>
                        </div>
                        <div>
                            <div className="text-[#4c9a66] text-xs">Lama Bekerja (Tahun)</div>
                            <div className="font-medium text-black dark:text-white">{data.yearsOfExperience ? `${data.yearsOfExperience} Tahun` : '-'}</div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="text-[#4c9a66] text-xs">Keahlian Teknis & Bakat</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {data.skills && data.skills.length > 0 ? (
                                    data.skills.map((skill, index) => (
                                        <span key={index} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs text-black dark:text-white border border-slate-200 dark:border-slate-600">
                                            {skill}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-black dark:text-white">-</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Komitmen Pelayanan */}
                    <div className="bg-[#e7f3eb] dark:bg-[#1d3324] px-4 py-2 border-y border-[#cfe7d7] dark:border-[#2a4532] font-bold text-black dark:text-white flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">volunteer_activism</span>
                        Komitmen Kolaborasi & Pelayanan Profesional
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
                        <div className="md:col-span-2">
                            <div className="text-[#4c9a66] text-xs">Kesediaan Melayani</div>
                            <div className="font-medium text-black dark:text-white">{data.willingnessToServe || '-'}</div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="text-[#4c9a66] text-xs">Bidang Minat Pelayanan</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {data.interestAreas && data.interestAreas.length > 0 ? (
                                    data.interestAreas.map((area, index) => (
                                        <span key={index} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs text-black dark:text-white border border-slate-200 dark:border-slate-600">
                                            {area}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-black dark:text-white">-</span>
                                )}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <div className="text-[#4c9a66] text-xs">Bentuk Kontribusi yang Diberikan</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {data.contributionTypes && data.contributionTypes.length > 0 ? (
                                    data.contributionTypes.map((type, index) => (
                                        <span key={index} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs text-black dark:text-white border border-slate-200 dark:border-slate-600">
                                            {type}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-black dark:text-white">-</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <label className="flex items-start gap-3 cursor-pointer p-4 border rounded-xl hover:bg-[#e7f3eb] dark:hover:bg-[#1d3324] transition-colors border-[#cfe7d7] dark:border-[#1d3324]">
                        <input
                            type="checkbox"
                            id="agreedToPrivacy"
                            className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary border-gray-300 accent-primary"
                            checked={data.agreedToPrivacy}
                            onChange={(e) => update({ agreedToPrivacy: e.target.checked })}
                        />
                        <span className="text-black dark:text-[#f8fcf9] text-sm leading-relaxed">
                            Saya menyatakan bahwa data yang saya isi adalah benar dan sesuai kenyataan.
                            Saya setuju data ini dikelola oleh gereja untuk keperluan pelayanan.
                        </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-[#e7f3eb] dark:hover:bg-[#1d3324] transition-colors border-[#cfe7d7] dark:border-[#1d3324]">
                        <input
                            type="checkbox"
                            id="dataValidated"
                            className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300 accent-primary"
                            checked={data.dataValidated}
                            onChange={(e) => update({ dataValidated: e.target.checked })}
                        />
                        <span className="text-black dark:text-[#f8fcf9] font-bold text-sm">
                            Saya telah memeriksa kembali data saya (Validasi Data)
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Step4Consent;
