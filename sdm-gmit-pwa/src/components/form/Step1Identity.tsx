import { useState } from 'react';
import type { FormData } from '../../types';
import { checkDuplicateName } from '../../lib/validation';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';
import FormMultiSelect from '../ui/FormMultiSelect';
import FormRadioGroup from '../ui/FormRadioGroup';
import { FormTooltip } from '../ui/FormTooltip';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
    goToStep: (step: number, editing?: boolean) => void;
}

const KUPANG_DATA: Record<string, string[]> = {
    "Alak": ["Alak", "Batuplat", "Fatufeto", "Mantasi", "Manulai II", "Manutapen", "Naioni", "Namosain", "Nunbaun Delha", "Nunbaun Sabu", "Nunhila", "Penkase Oeleta"],
    "Kelapa Lima": ["Kelapa Lima", "Lasiana", "Oesapa", "Oesapa Barat", "Oesapa Selatan"],
    "Kota Lama": ["Air Mata", "Bonipoi", "Fatubesi", "Lai-lai Bisi Kopan", "Merdeka", "Nefonaek", "Oeba", "Pasir Panjang", "Solor", "Tode Kisar"],
    "Kota Raja": ["Airnona", "Bakunase", "Bakunase II", "Fontein", "Kuanino", "Naikoten I", "Naikoten II", "Nunleu"],
    "Maulafa": ["Belo", "Fatukoa", "Kolhua", "Maulafa", "Naikolan", "Naimata", "Oepura", "Penfui", "Sikumana"],
    "Oebobo": ["Fatuli", "Kayu Putih", "Liliba", "Oebobo", "Oebufu", "Oetete", "Tuak Daun Merah"]
};

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
        if (!dob || dob.length < 10) return '';
        const today = new Date();
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) return '';
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

    const daysOptions = Array.from({ length: 31 }, (_, i) => ({
        value: String(i + 1).padStart(2, '0'),
        label: String(i + 1)
    }));

    const monthsOptions = [
        { value: '01', label: 'Januari' },
        { value: '02', label: 'Februari' },
        { value: '03', label: 'Maret' },
        { value: '04', label: 'April' },
        { value: '05', label: 'Mei' },
        { value: '06', label: 'Juni' },
        { value: '07', label: 'Juli' },
        { value: '08', label: 'Agustus' },
        { value: '09', label: 'September' },
        { value: '10', label: 'Oktober' },
        { value: '11', label: 'November' },
        { value: '12', label: 'Desember' }
    ];

    const currentYear = new Date().getFullYear();
    const yearsOptions = Array.from({ length: 120 }, (_, i) => {
        const y = currentYear - i;
        return { value: String(y), label: String(y) };
    });

    const [dobYear = '', dobMonth = '', dobDay = ''] = (data.dateOfBirth || '').split('-');

    const handleDobChange = (part: 'year' | 'month' | 'day', val: string) => {
        let newY = dobYear;
        let newM = dobMonth;
        let newD = dobDay;
        if (part === 'year') newY = val;
        if (part === 'month') newM = val;
        if (part === 'day') newD = val;
        update({ dateOfBirth: `${newY}-${newM}-${newD}` });
    };

    const [marYear = '', marMonth = '', marDay = ''] = (data.marriageDate || '').split('-');

    const handleMarChange = (part: 'year' | 'month' | 'day', val: string) => {
        let newY = marYear;
        let newM = marMonth;
        let newD = marDay;
        if (part === 'year') newY = val;
        if (part === 'month') newM = val;
        if (part === 'day') newD = val;
        update({ marriageDate: `${newY}-${newM}-${newD}` });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">person</span>
                Data Umum Kepala Keluarga
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
                        tooltipText="Masukkan 16 digit Nomor Kartu Keluarga yang tertera pada bagian atas KK Anda."
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
                        tooltipText="Masukkan 16 digit Nomor Induk Kependudukan (NIK) sesuai dengan e-KTP."
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
                        label="Nama Lengkap Kepala Keluarga"
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
                        tooltipText="Masukkan nama lengkap kepala keluarga sesuai KTP, tanpa gelar akademik atau keagamaan (opsional)."
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
                <div className="flex flex-col gap-2 relative z-20">
                    <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                        Tanggal Lahir <span className="text-red-500">*</span>
                        <FormTooltip text="Masukkan tanggal lahir sesuai akta kelahiran atau e-KTP." />
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        <FormSelect
                            id="dobDay"
                            value={dobDay}
                            onChange={(val) => handleDobChange('day', val)}
                            options={daysOptions}
                            placeholder="Tanggal"
                            required
                        />
                        <FormSelect
                            id="dobMonth"
                            value={dobMonth}
                            onChange={(val) => handleDobChange('month', val)}
                            options={monthsOptions}
                            placeholder="Bulan"
                            required
                        />
                        <FormSelect
                            id="dobYear"
                            value={dobYear}
                            onChange={(val) => handleDobChange('year', val)}
                            options={yearsOptions}
                            placeholder="Tahun"
                            required
                        />
                    </div>
                </div>

                {/* Age (Auto-calculated) */}
                <FormInput
                    label="Usia"
                    id="age"
                    value={calculateAge(data.dateOfBirth) || '-'}
                    onChange={() => { }}
                    readOnly

                />

                {/* Blood Type */}
                <FormSelect
                    label="Golongan Darah"
                    id="bloodType"
                    value={data.bloodType}
                    onChange={(val) => update({ bloodType: val })}
                    options={['A', 'B', 'AB', 'O']}
                    placeholder="Pilih Golongan Darah"
                    required
                    tooltipText="Pilih golongan darah sesuai dengan data medis atau e-KTP."
                />

                {/* Baptism Status */}
                <FormRadioGroup
                    label="Status Baptis"
                    name="baptismStatus"
                    value={data.baptismStatus}
                    onChange={(val) => update({ baptismStatus: val as any })}
                    options={['Sudah', 'Belum']}
                    columns={2}
                    required
                    tooltipText="Pilih apakah sudah dibaptis atau belum."
                />

                {/* Sidi Status */}
                <FormRadioGroup
                    label="Status Sidi"
                    name="sidiStatus"
                    value={data.sidiStatus}
                    onChange={(val) => update({ sidiStatus: val as any })}
                    options={['Sudah', 'Belum']}
                    columns={2}
                    required
                    tooltipText="Pilih apakah sudah sidi atau belum."
                />

                {/* Marital Status */}
                <FormSelect
                    label="Status Pernikahan"
                    id="maritalStatus"
                    value={data.maritalStatus}
                    onChange={(val) => update({ maritalStatus: val })}
                    options={['Belum Nikah', 'Sudah Nikah', 'Cerai Hidup', 'Cerai Mati']}
                    placeholder="Pilih Status Nikah"
                    required
                    tooltipText="Pilih status pernikahan saat ini."
                />

                {/* Conditional Marriage Fields */}
                {['Sudah Nikah', 'Cerai Hidup', 'Cerai Mati'].includes(data.maritalStatus) && (
                    <>
                        <div className="flex flex-col gap-2 relative z-20">
                            <label className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1 z-10">
                                Tanggal Nikah <span className="text-red-500">*</span>
                                <FormTooltip text="Masukkan tanggal pernikahan." />
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                <FormSelect
                                    id="marDay"
                                    value={marDay}
                                    onChange={(val) => handleMarChange('day', val)}
                                    options={daysOptions}
                                    placeholder="Tanggal"
                                    required
                                />
                                <FormSelect
                                    id="marMonth"
                                    value={marMonth}
                                    onChange={(val) => handleMarChange('month', val)}
                                    options={monthsOptions}
                                    placeholder="Bulan"
                                    required
                                />
                                <FormSelect
                                    id="marYear"
                                    value={marYear}
                                    onChange={(val) => handleMarChange('year', val)}
                                    options={yearsOptions}
                                    placeholder="Tahun"
                                    required
                                />
                            </div>
                        </div>

                        <FormInput
                            label="Usia Pernikahan"
                            id="marriageAge"
                            value={calculateAge(data.marriageDate) || '-'}
                            onChange={() => { }}
                            readOnly

                        />

                        <FormMultiSelect
                            label="Jenis Pernikahan"
                            id="marriageType"
                            value={data.marriageType}
                            onChange={(val) => update({ marriageType: val })}
                            options={['Nikah Adat', 'Nikah Gereja', 'Nikah Catatan Sipil', 'Nikah Dinas']}
                            placeholder="Pilih Jenis Pernikahan (Bisa >1)"
                            required
                            tooltipText="Pilih satu atau lebih jenis pernikahan yang diakui."
                        />
                    </>
                )}

                {/* Education */}
                <FormSelect
                    label="Pendidikan Terakhir"
                    id="educationLevel"
                    value={data.educationLevel}
                    onChange={(val) => update({ educationLevel: val })}
                    options={['Tidak Tamat SD', 'SD', 'SMP/Sederajat', 'SMA/Sederajat', 'D I', 'D II', 'D III', 'D IV/S1', 'S1', 'S2', 'S3']}
                    placeholder="Pilih Tingkat Pendidikan"
                    required
                    tooltipText="Pendidikan terakhir yang telah ditamatkan."
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
                        tooltipText="Gunakan nomor yang aktif dan dapat dihubungi, disarankan nomor yang terdaftar di WhatsApp."
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
                    tooltipText="Pilih Lingkungan tempat tinggal saat ini di Jemaat Emaus Liliba."
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
                    tooltipText="Pilih Rayon sesuai Lingkungan tempat tinggal."
                />
            </div>

            {/* Alamat Lengkap */}
            <div className="flex flex-col group relative">
                <div className="flex flex-col pb-2 gap-1">
                    <label className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300 relative z-10">
                        Alamat Lengkap<span className="text-red-500">*</span>
                        <FormTooltip text="Masukkan alamat domisili saat ini, lengkap dengan RT/RW, dan jalan/gang. Contoh: Jl. Kiu Leu No. 1, RT.001/RW.002." />
                    </label>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        Contoh: Jl. Kiu Leu No. 1, RT.001/RW.002
                    </span>
                </div>
                <textarea
                    className="w-full rounded-xl text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] h-32 px-4 py-3 text-base resize-none placeholder-slate-400 dark:placeholder-slate-600 outline-none transition-all duration-300"
                    id="address"
                    value={data.address}
                    onChange={(e) => update({ address: e.target.value })}
                ></textarea>
                {data.address && data.address.trim().length > 0 && data.address.trim().length < 7 && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-amber-600 dark:text-amber-400 animate-fadeIn">
                        <span className="material-symbols-outlined text-base">warning</span>
                        <span className="text-xs font-medium">Alamat terlalu singkat, minimal 7 karakter ({data.address.trim().length}/7)</span>
                    </div>
                )}
                {data.address && data.address.trim().length >= 7 && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                        <span className="material-symbols-outlined text-base">check_circle</span>
                        <span className="text-xs font-medium">Panjang alamat sudah memadai</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Kota/Kabupaten */}
                <FormSelect
                    label="Kota/Kabupaten"
                    id="city"
                    value={data.city}
                    onChange={(val) => {
                        if (val !== data.city) {
                            update({ city: val, district: '', subdistrict: '' });
                        }
                    }}
                    options={['Kota Kupang']}
                    placeholder="Pilih Kota/Kabupaten"
                    required
                    tooltipText="Pilih Kota atau Kabupaten tempat domisili."
                />

                {/* Kecamatan */}
                <FormSelect
                    label="Kecamatan"
                    id="district"
                    value={data.district}
                    onChange={(val) => {
                        if (val !== data.district) {
                            update({ district: val, subdistrict: '' });
                        }
                    }}
                    options={data.city === 'Kota Kupang' ? Object.keys(KUPANG_DATA) : []}
                    placeholder={data.city === 'Kota Kupang' ? "Pilih Kecamatan..." : "Pilih Kota dahulu..."}
                    required={data.city === 'Kota Kupang'}
                    tooltipText="Pilih Kecamatan domisili."
                />

                {/* Kelurahan */}
                <FormSelect
                    label="Kelurahan/Desa"
                    id="subdistrict"
                    value={data.subdistrict}
                    onChange={(val) => update({ subdistrict: val })}
                    options={data.district && KUPANG_DATA[data.district] ? KUPANG_DATA[data.district] : []}
                    placeholder={data.district ? "Pilih Kelurahan..." : "Pilih Kecamatan..."}
                    required={data.city === 'Kota Kupang'}
                    tooltipText="Pilih Kelurahan atau Desa domisili."
                />
            </div>
        </div>
    );
};

export default Step1Identity;
