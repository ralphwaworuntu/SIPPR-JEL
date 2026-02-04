import { useState } from 'react';
import MapPicker from '../MapPicker';
import type { FormData } from '../../types';
import { checkDuplicateName } from '../../lib/validation';

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
        // Remove non-numeric
        const cleaned = ('' + value).replace(/\D/g, '');
        // 081234567890 -> 812-3456-7890 (since prefix +62 is fixed)
        // or just let them type locally
        // Simple formatter: 0812-3456-7890

        // If starts with 0, strip it since we have separate +62
        let number = cleaned;
        if (number.startsWith('0')) number = number.substring(1);
        if (number.startsWith('62')) number = number.substring(2);

        // Limit to reasonable length
        if (number.length > 15) number = number.substring(0, 15);

        return number;
        // Advanced: grouping with dashes 812-3456-7890
        // const match = number.match(/^(\d{1,3})(\d{0,4})(\d{0,4})$/);
        // if (match) {
        //    return [match[1], match[2], match[3]].filter(x => x).join('-');
        // }
        // return number;
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

    const handleSearchAddress = async () => {
        if (!data.address) return;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.address)}&limit=1`);
            const results = await response.json();
            if (results && results.length > 0) {
                const { lat, lon } = results[0];
                update({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
            } else {
                alert("Lokasi tidak ditemukan. Coba masukkan alamat yang lebih spesifik (misal: 'Jalan El Tari Kupang').");
            }
        } catch (error) {
            console.error("Geocoding error:", error);
            alert("Gagal mencari lokasi. Pastikan koneksi internet lancar.");
        }
    };

    const handleMapLocationSelect = async (lat: number, lng: number) => {
        update({ latitude: lat, longitude: lng });

        // Reverse geocoding (Limit calls to avoid spamming API)
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`);
            const result = await response.json();
            if (result && result.address) {
                const addr = result.address;
                const parts = [];

                // Format: Jalan ..., Kel. ..., Kec. ..., Kota ...
                if (addr.road) parts.push(addr.road);
                if (addr.suburb) parts.push(`Kel. ${addr.suburb}`);
                else if (addr.village) parts.push(`Desa ${addr.village}`);

                if (addr.city_district) parts.push(`Kec. ${addr.city_district}`);

                if (addr.city) parts.push(addr.city);
                else if (addr.town) parts.push(addr.town);
                else if (addr.county) parts.push(addr.county); // Kabupaten

                const formattedAddress = parts.length > 0 ? parts.join(', ') : result.display_name;

                // Confirm before overwriting if address already exists and is significant
                if (!data.address || confirm(`Ganti alamat dengan lokasi terpilih di peta?\n\nLokasi Baru: ${formattedAddress}`)) {
                    update({ address: formattedAddress });
                }
            }
        } catch (error) {
            console.error("Reverse geocoding error:", error);
        }
    };

    return (
        <>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">person</span>
                Informasi Dasar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col relative">
                    <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Nama Lengkap<span className="text-red-500 ml-1">*</span></label>
                    <input
                        className={`form-input w-full rounded-lg text-black dark:text-[#f8fcf9] border transition-colors ${nameError ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500' : 'border-[#cfe7d7] dark:border-[#1d3324] focus:border-primary focus:ring-primary'} bg-background-light dark:bg-background-dark focus:ring-1 h-12 px-4 text-base placeholder-gray-400`}
                        placeholder="Contoh: Yohanes Pembaptis"
                        type="text"
                        id="fullName"
                        value={data.fullName}
                        onChange={(e) => {
                            update({ fullName: e.target.value });
                            if (nameError) setNameError(null); // Clear error on edit
                        }}
                        onBlur={handleNameBlur}
                    />
                    {isValidating && (
                        <div className="absolute right-3 top-[3.2rem]">
                            <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full block"></span>
                        </div>
                    )}
                    {nameError && (
                        <div className="flex items-center gap-1 mt-1 text-amber-600 text-xs font-medium animate-fadeIn">
                            <span className="material-symbols-outlined text-sm">warning</span>
                            {nameError}
                        </div>
                    )}
                </div>

                {/* Gender */}
                <div className="flex flex-col">
                    <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Jenis Kelamin<span className="text-red-500 ml-1">*</span></label>
                    <select
                        className="form-select w-full rounded-lg text-black dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                        id="gender"
                        value={data.gender}
                        onChange={(e) => update({ gender: e.target.value as 'Laki-laki' | 'Perempuan' })}
                    >
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>

                {/* Date of Birth & Age */}
                {/* Date of Birth */}
                <div className="flex flex-col">
                    <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Tanggal Lahir<span className="text-red-500 ml-1">*</span></label>
                    <input
                        className="form-input w-full rounded-lg text-black dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                        type="date"
                        id="dateOfBirth"
                        value={data.dateOfBirth}
                        onChange={(e) => update({ dateOfBirth: e.target.value })}
                    />
                </div>

                {/* Age (Auto-calculated) */}
                <div className="flex flex-col">
                    <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Usia (Otomatis)</label>
                    <input
                        className="form-input w-full rounded-lg text-black/70 dark:text-white/70 border border-[#cfe7d7] dark:border-[#1d3324] bg-slate-100 dark:bg-slate-800 h-12 px-4 text-base cursor-not-allowed"
                        type="text"
                        value={calculateAge(data.dateOfBirth) || '-'}
                        readOnly
                        placeholder="-"
                    />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                    <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Nomor Telepon / WhatsApp<span className="text-red-500 ml-1">*</span></label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[#cfe7d7] dark:border-[#1d3324] bg-[#e7f3eb] dark:bg-[#1d3324] text-black dark:text-[#f8fcf9] text-sm font-medium">
                            +62
                        </span>
                        <input
                            className="form-input w-full rounded-r-lg text-black dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base placeholder-gray-400"
                            placeholder="812 3456 7890"
                            type="tel"
                            id="phone"
                            value={data.phone}
                            onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                update({ phone: formatted });
                            }}
                        />
                    </div>
                </div>
            </div>

            <hr className="my-10 border-[#e7f3eb] dark:border-[#1d3324]" />

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">groups</span>
                Data Keanggotaan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sektor Kategorial */}
                <div className="flex flex-col">
                    <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Sektor Kategorial<span className="text-red-500 ml-1">*</span></label>
                    <select
                        className="form-select w-full rounded-lg text-black dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                        id="sector"
                        value={data.sector}
                        onChange={(e) => update({ sector: e.target.value })}
                    >
                        <option value="">Pilih Sektor...</option>
                        <option value="Pemuda">Pemuda</option>
                        <option value="Kaum Perempuan">Kaum Perempuan</option>
                        <option value="Kaum Bapak">Kaum Bapak</option>
                        <option value="Lansia">Lansia</option>
                    </select>
                </div>

                {/* Lingkungan */}
                <div className="flex flex-col">
                    <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Lingkungan<span className="text-red-500 ml-1">*</span></label>
                    <select
                        className="form-select w-full rounded-lg text-black dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                        id="lingkungan"
                        value={data.lingkungan}
                        onChange={(e) => update({ lingkungan: e.target.value })}
                    >
                        <option value="">Pilih Lingkungan...</option>
                        {Array.from({ length: 7 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num.toString()}>{`Lingkungan ${num}`}</option>
                        ))}
                    </select>
                </div>

                {/* Rayon */}
                <div className="flex flex-col">
                    <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Rayon<span className="text-red-500 ml-1">*</span></label>
                    <select
                        className="form-select w-full rounded-lg text-black dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                        id="rayon"
                        value={data.rayon}
                        onChange={(e) => update({ rayon: e.target.value })}
                    >
                        <option value="">Pilih Rayon...</option>
                        {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num.toString()}>{`Rayon ${num}`}</option>
                        ))}
                    </select>
                </div>
            </div>

            <h3 className="text-lg font-bold mb-6 mt-10 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: '20px' }}>location_on</span>
                Lokasi Tempat Tinggal (Kota Kupang)
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Alamat Lengkap<span className="text-red-500 ml-1">*</span></label>
                        <textarea
                            className="form-textarea w-full rounded-lg text-black dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-32 px-4 py-3 text-base resize-none placeholder-gray-400"
                            placeholder="Masukkan alamat lengkap domisili Anda..."
                            id="address"
                            value={data.address}
                            onChange={(e) => update({ address: e.target.value })}
                        ></textarea>
                        <button
                            type="button"
                            onClick={handleSearchAddress}
                            className="mt-2 text-xs flex items-center gap-1 text-primary font-bold hover:underline"
                        >
                            <span className="material-symbols-outlined text-sm">search</span>
                            Cari & Tandai di Peta
                        </button>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-xs text-black dark:text-[#f8fcf9] flex items-start gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">info</span>
                            Menandai lokasi akurat membantu gereja dalam koordinasi pelayanan wilayah dan bantuan.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-3 flex flex-col">
                    <label className="text-black dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Tandai Lokasi Peta</label>
                    <div className="relative w-full h-[300px] rounded-xl overflow-hidden border-2 border-[#cfe7d7] dark:border-[#1d3324]">
                        <MapPicker
                            position={[data.latitude || -10.1772, data.longitude || 123.6070]}
                            onLocationSelect={handleMapLocationSelect}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step1Identity;
