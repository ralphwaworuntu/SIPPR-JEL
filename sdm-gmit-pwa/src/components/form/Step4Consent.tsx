import React from 'react';
import { type FormData } from '../../types';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
}

const Step4Consent: React.FC<StepProps> = ({ data, update }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#0d1b12] dark:text-white">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                Validation & Consent
            </h3>

            <div className="bg-[#e7f3eb] dark:bg-[#1d3324] border border-[#cfe7d7] dark:border-[#2a4532] rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="bg-white dark:bg-[#102216] p-3 rounded-full shadow-sm text-primary">
                    <span className="material-symbols-outlined">security</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-[#0d1b12] dark:text-white mb-2">Data Privacy Statement</h3>
                    <p className="text-[#0d1b12] dark:text-[#f8fcf9] leading-relaxed mb-4 text-sm">
                        The data you submit through this form will be stored in the GMIT Emaus Liliba database.
                        This data is <strong>CONFIDENTIAL</strong> and will only be used for church ministry purposes, congregation potential mapping,
                        and economic empowerment programs. Data will not be shared with third parties without your consent.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#0d1b12] dark:text-white">Data Confirmation</h3>

                <div className="bg-background-light dark:bg-background-dark border border-[#cfe7d7] dark:border-[#1d3324] rounded-xl overflow-hidden text-sm">
                    <div className="bg-[#e7f3eb] dark:bg-[#1d3324] px-4 py-2 border-b border-[#cfe7d7] dark:border-[#2a4532] font-medium text-[#0d1b12] dark:text-white">Identity Summary</div>
                    <div className="p-4 grid grid-cols-2 gap-2">
                        <div className="text-[#4c9a66]">Name:</div>
                        <div className="font-medium text-[#0d1b12] dark:text-white">{data.fullName || '-'}</div>
                        <div className="text-[#4c9a66]">Gender:</div>
                        <div className="font-medium text-[#0d1b12] dark:text-white">{data.gender || '-'}</div>
                        <div className="text-[#4c9a66]">Profession:</div>
                        <div className="font-medium text-[#0d1b12] dark:text-white">{data.jobTitle || '-'}</div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <label className="flex items-start gap-3 cursor-pointer p-4 border rounded-xl hover:bg-[#e7f3eb] dark:hover:bg-[#1d3324] transition-colors border-[#cfe7d7] dark:border-[#1d3324]">
                        <input
                            type="checkbox"
                            className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary border-gray-300 accent-primary"
                            checked={data.agreedToPrivacy}
                            onChange={(e) => update({ agreedToPrivacy: e.target.checked })}
                        />
                        <span className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm leading-relaxed">
                            I declare that the data I have filled in is correct and true.
                            I agree for this data to be managed by the church for ministry purposes.
                        </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-[#e7f3eb] dark:hover:bg-[#1d3324] transition-colors border-[#cfe7d7] dark:border-[#1d3324]">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300 accent-primary"
                            checked={data.dataValidated}
                            onChange={(e) => update({ dataValidated: e.target.checked })}
                        />
                        <span className="text-[#0d1b12] dark:text-[#f8fcf9] font-bold text-sm">
                            I have validated my data (Data Validation)
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Step4Consent;
