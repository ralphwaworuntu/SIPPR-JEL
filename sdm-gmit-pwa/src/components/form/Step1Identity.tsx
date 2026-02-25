import { useState } from 'react';
import type { FormData } from '../../types';
import { checkDuplicateName } from '../../lib/validation';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
    goToStep: (step: number, editing?: boolean) => void;
}

const Step1Identity = ({ data, update }: StepProps) => {
    const [nameError, setNameError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    const handleNameBlur = async () => {
        if (!data.fullName) return;

        // Auto-capitalize name (Title Case) on blur
        const formattedName = data.fullName.toLowerCase().replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
        if (formattedName !== data.fullName) {
            update({ fullName: formattedName });
        }

        setIsValidating(true);
        try {
            // Check formatted name to match DB better
            const isDuplicate = await checkDuplicateName(formattedName);
            if (isDuplicate) {
                setNameError("Nama ini sudah terdaftar dalam database. Mohon periksa kembali.");
            } else {
                setNameError(null);
            }
        } catch (error) {
            console.error("Validation error:", error);
        } finally {
            setIsValidating(false);
        }
    };

    const formatPhoneNumber = (value: string) => {
        let cleaned = value.replace(/\D/g, '');

        // Remove leading 62 if present
        if (cleaned.startsWith('62')) {
            cleaned = cleaned.substring(2);
        }

        // Remove any leading 0s (loop to handle multiple if typed)
        while (cleaned.startsWith('0')) {
            cleaned = cleaned.substring(1);
        }

        if (cleaned.length > 15) cleaned = cleaned.substring(0, 15);
        return cleaned;
    };

    const format16DigitNumber = (value: string) => {
        return value.replace(/\D/g, '').substring(0, 16);
    };

    const calculateAge = (dob: string) => {
        if (!dob) return '';
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} Tahun`;
    };

    const lingkunganRayonMap: Record<string, number[]> = {
        '1': [1, 2, 17],
        '2': [12, 13, 16],
        '3': [7, 14, 15],
        '4': [3, 8, 9],
        '5': [5, 10],
        '6': [6, 20],
        '7': [4, 18],
        '8': [11, 19],
    };

    const lingkunganOptions = Array.from({ length: 8 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Lingkungan ${i + 1}`
    }));

    const availableRayons = data.lingkungan ? lingkunganRayonMap[data.lingkungan] || [] : [];

    const rayonOptions = availableRayons.map((r) => ({
        value: r.toString(),
        label: `Rayon ${r}`
    }));

    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">person</span>
                Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* No Kartu Keluarga */}
                <div className="flex flex-col">
                    <FormInput
                        label="Nomor Kartu Keluarga"
                        id="kkNumber"
                        value={data.kkNumber}
                        onChange={(val) => {
                            const formatted = format16DigitNumber(val);
                            update({ kkNumber: formatted });
                        }}
                        type="tel"
                        placeholder="16 Digit Nomor KK"
                        required
                    />
                    {data.kkNumber && data.kkNumber.length > 0 && data.kkNumber.length < 16 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                            <span className="material-symbols-outlined text-base">warning</span>
                            <span className="text-xs font-medium">Nomor KK harus 16 digit ({data.kkNumber.length}/16)</span>
                        </div>
                    )}
                    {data.kkNumber && data.kkNumber.length === 16 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            <span className="text-xs font-medium">Nomor KK valid</span>
                        </div>
                    )}
                </div>

                {/* NIK */}
                <div className="flex flex-col">
                    <FormInput
                        label="NIK"
                        id="nik"
                        value={data.nik}
                        onChange={(val) => {
                            const formatted = format16DigitNumber(val);
                            update({ nik: formatted });
                        }}
                        type="tel"
                        placeholder="16 Digit NIK"
                        required
                    />
                    {data.nik && data.nik.length > 0 && data.nik.length < 16 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                            <span className="material-symbols-outlined text-base">warning</span>
                            <span className="text-xs font-medium">NIK harus 16 digit ({data.nik.length}/16)</span>
                        </div>
                    )}
                    {data.nik && data.nik.length === 16 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            <span className="text-xs font-medium">NIK valid</span>
                        </div>
                    )}
                </div>

                {/* Full Name */}
                <div className="flex flex-col relative">
                    <FormInput
                        label="Nama Kepala Keluarga"
                        id="fullName"
                        value={data.fullName}
                        onChange={(val) => {
                            update({ fullName: val });
                            if (nameError) setNameError(null);
                        }}
                        onBlur={handleNameBlur}
                        placeholder="Contoh: Heru Aldi Benu"
                        required
                        error={nameError}
                    />
                    {isValidating && (
                        <div className="absolute right-3 top-[3.2rem]">
                            <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full block"></span>
                        </div>
                    )}
                </div>

                {/* Gender */}
                <FormSelect
                    label="Jenis Kelamin"
                    id="gender"
                    value={data.gender}
                    onChange={(val) => update({ gender: val as 'Laki-laki' | 'Perempuan' })}
                    options={['Laki-laki', 'Perempuan']}
                    placeholder="Pilih Jenis Kelamin"
                    required
                />

                {/* Date of Birth */}
                <FormInput
                    label="Tanggal Lahir"
                    id="dateOfBirth"
                    value={data.dateOfBirth}
                    onChange={(val) => update({ dateOfBirth: val })}
                    type="date"
                    required
                />

                {/* Age (Auto-calculated) */}
                <FormInput
                    label="Usia"
                    id="age"
                    value={calculateAge(data.dateOfBirth) || '-'}
                    onChange={() => { }}
                    readOnly
                />

                {/* Phone Number */}
                <div className="flex flex-col">
                    <FormInput
                        label="Nomor Telepon / WhatsApp Aktif"
                        id="phone"
                        value={data.phone}
                        onChange={(val) => {
                            const formatted = formatPhoneNumber(val);
                            update({ phone: formatted });
                        }}
                        type="tel"
                        placeholder="81234567890"
                        prefix="+62"
                        required
                    />
                    {data.phone && data.phone.length > 0 && data.phone.length < 10 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                            <span className="material-symbols-outlined text-base">warning</span>
                            <span className="text-xs font-medium">Nomor telepon minimal 10 digit ({data.phone.length}/10)</span>
                        </div>
                    )}
                    {data.phone && data.phone.length >= 10 && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            <span className="text-xs font-medium">Nomor telepon valid (+62{data.phone})</span>
                        </div>
                    )}
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lingkungan */}
                <FormSelect
                    label="Lingkungan"
                    id="lingkungan"
                    value={data.lingkungan}
                    onChange={(val) => {
                        if (val !== data.lingkungan) {
                            update({ lingkungan: val, rayon: '' });
                        }
                    }}
                    options={lingkunganOptions}
                    placeholder="Pilih Lingkungan..."
                    required
                />

                {/* Rayon */}
                <FormSelect
                    label="Rayon"
                    id="rayon"
                    value={data.rayon}
                    onChange={(val) => update({ rayon: val })}
                    options={rayonOptions}
                    placeholder={data.lingkungan ? "Pilih Rayon..." : "Pilih Lingkungan dahulu..."}
                    required
                />
            </div>

            {/* Alamat Lengkap */}
            <div className="flex flex-col group relative">
                <div className="flex flex-col pb-2 gap-1">
                    <label className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300">
                        Alamat Lengkap<span className="text-red-500">*</span>
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Contoh: Jl. Kiu Leu No. 1, RT.001/RW.002, Kel. Liliba, Kec. Oebobo, Kota Kupang.
                    </span>
                </div>
                <textarea
                    className="w-full rounded-xl text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] h-32 px-4 py-3 text-base resize-none placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all duration-300"
                    id="address"
                    value={data.address}
                    onChange={(e) => update({ address: e.target.value })}
                ></textarea>
                {data.address && data.address.trim().length > 0 && data.address.trim().length < 20 && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                        <span className="material-symbols-outlined text-base">warning</span>
                        <span className="text-xs font-medium">Alamat terlalu singkat, minimal 20 karakter ({data.address.trim().length}/20)</span>
                    </div>
                )}
                {data.address && data.address.trim().length >= 20 && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        <span className="text-xs font-medium">Panjang alamat sudah memadai</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Step1Identity;
