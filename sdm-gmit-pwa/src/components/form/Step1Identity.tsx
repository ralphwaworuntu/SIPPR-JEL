import MapPicker from '../MapPicker';
import type { FormData } from '../../types';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
}

const Step1Identity = ({ data, update }: StepProps) => {

    const calculateAge = (dob: string) => {
        if (!dob) return '';
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} Years Old`;
    };

    return (
        <>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#0d1b12] dark:text-white">
                <span className="material-symbols-outlined text-primary">person</span>
                Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex flex-col">
                    <label className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Full Name</label>
                    <input
                        className="form-input w-full rounded-lg text-[#0d1b12] dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base placeholder-gray-400"
                        placeholder="e.g. John Doe"
                        type="text"
                        value={data.fullName}
                        onChange={(e) => update({ fullName: e.target.value })}
                    />
                </div>

                {/* Gender */}
                <div className="flex flex-col">
                    <label className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Gender</label>
                    <select
                        className="form-select w-full rounded-lg text-[#0d1b12] dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                        value={data.gender}
                        onChange={(e) => update({ gender: e.target.value as 'Laki-laki' | 'Perempuan' })}
                    >
                        <option value="">Select Gender</option>
                        <option value="Laki-laki">Male</option>
                        <option value="Perempuan">Female</option>
                    </select>
                </div>

                {/* Date of Birth & Age */}
                <div className="flex flex-col relative">
                    <label className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Date of Birth</label>
                    <div className="relative flex items-center">
                        <input
                            className="form-input w-full rounded-lg text-[#0d1b12] dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base"
                            type="date"
                            value={data.dateOfBirth}
                            onChange={(e) => update({ dateOfBirth: e.target.value })}
                        />
                        {data.dateOfBirth && (
                            <span className="absolute right-3 bg-primary/20 text-[#0d1b12] dark:text-primary text-xs font-bold px-2 py-1 rounded">
                                {calculateAge(data.dateOfBirth)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col">
                    <label className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Phone Number</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-[#cfe7d7] dark:border-[#1d3324] bg-[#e7f3eb] dark:bg-[#1d3324] text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-medium">
                            +62
                        </span>
                        <input
                            className="form-input w-full rounded-r-lg text-[#0d1b12] dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-base placeholder-gray-400"
                            placeholder="812 3456 7890"
                            type="tel"
                            value={data.phone}
                            onChange={(e) => update({ phone: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <hr className="my-10 border-[#e7f3eb] dark:border-[#1d3324]" />

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#0d1b12] dark:text-white">
                <span className="material-symbols-outlined text-primary">location_on</span>
                Residential Location (Kupang City)
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Street Address</label>
                        <textarea
                            className="form-textarea w-full rounded-lg text-[#0d1b12] dark:text-[#f8fcf9] border border-[#cfe7d7] dark:border-[#1d3324] bg-background-light dark:bg-background-dark focus:border-primary focus:ring-1 focus:ring-primary h-32 px-4 py-3 text-base resize-none placeholder-gray-400"
                            placeholder="Enter your full residential address..."
                            value={data.address}
                            onChange={(e) => update({ address: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                        <p className="text-xs text-[#0d1b12] dark:text-[#f8fcf9] flex items-start gap-2">
                            <span className="material-symbols-outlined text-sm text-primary">info</span>
                            Pinning your exact location helps the church coordinate local ministry and assistance.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-3 flex flex-col">
                    <label className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold leading-normal pb-2">Pin Your Location</label>
                    <div className="relative w-full h-[300px] rounded-xl overflow-hidden border-2 border-[#cfe7d7] dark:border-[#1d3324]">
                        <MapPicker
                            position={[data.latitude || -10.1772, data.longitude || 123.6070]}
                            onLocationSelect={(lat, lng) => update({ latitude: lat, longitude: lng })}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step1Identity;
