import { useState } from 'react';
import type { FormData } from '../../types';
import { checkDuplicateName } from '../../lib/validation';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
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
        const cleaned = ('' + value).replace(/\D/g, '');
        let number = cleaned;
        if (number.startsWith('0')) number = number.substring(1);
        if (number.startsWith('62')) number = number.substring(2);
        if (number.length > 15) number = number.substring(0, 15);
        return number;
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

    const lingkunganOptions = Array.from({ length: 8 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Lingkungan ${i + 1}`
    }));

    const rayonOptions = Array.from({ length: 20 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Rayon ${i + 1}`
    }));

    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">person</span>
                Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    label="Usia (Otomatis)"
                    id="age"
                    value={calculateAge(data.dateOfBirth) || '-'}
                    onChange={() => { }}
                    readOnly
                />

                {/* Phone Number */}
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

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lingkungan */}
                <FormSelect
                    label="Lingkungan"
                    id="lingkungan"
                    value={data.lingkungan}
                    onChange={(val) => update({ lingkungan: val })}
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
                    placeholder="Pilih Rayon..."
                    required
                />
            </div>

            {/* Alamat Lengkap */}
            <div className="flex flex-col group relative">
                <label className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal pb-2 flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300">
                    Alamat Lengkap (RT/RW/Kel/Kec/Kota)<span className="text-red-500">*</span>
                </label>
                <textarea
                    className="w-full rounded-xl text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] h-32 px-4 py-3 text-base resize-none placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all duration-300"
                    placeholder="Contoh: Jl. El Tari No. 1, RT 001/RW 002, Kel. Oebobo, Kec. Oebobo, Kota Kupang"
                    id="address"
                    value={data.address}
                    onChange={(e) => update({ address: e.target.value })}
                ></textarea>
            </div>
        </div>
    );
};

export default Step1Identity;
