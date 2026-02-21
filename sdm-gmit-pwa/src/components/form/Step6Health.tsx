import React, { useRef, useEffect } from 'react';
import { type FormData } from '../../types';
import FormRadioGroup from '../ui/FormRadioGroup';
import FormSelect from '../ui/FormSelect';
import FormMultiSelect from '../ui/FormMultiSelect';
import SectionHeader from '../ui/SectionHeader';

interface StepProps {
    data: FormData;
    update: (data: Partial<FormData>) => void;
    goToStep: (step: number, editing?: boolean) => void;
}

const Step6Health: React.FC<StepProps> = ({ data, update }) => {
    // Refs for auto-focus on "Other" inputs
    const chronicDiseaseOtherRef = useRef<HTMLInputElement>(null);
    const disabilityPhysicalOtherRef = useRef<HTMLInputElement>(null);
    const disabilityIntellectualOtherRef = useRef<HTMLInputElement>(null);
    const disabilityMentalOtherRef = useRef<HTMLInputElement>(null);
    const disabilitySensoryOtherRef = useRef<HTMLInputElement>(null);

    // Auto-focus effects
    useEffect(() => {
        if (data.health_chronicDisease.includes('Lainnya') && chronicDiseaseOtherRef.current) {
            chronicDiseaseOtherRef.current.focus();
        }
    }, [data.health_chronicDisease]);

    useEffect(() => {
        if (data.health_disabilityPhysical.includes('Lainnya') && disabilityPhysicalOtherRef.current) {
            disabilityPhysicalOtherRef.current.focus();
        }
    }, [data.health_disabilityPhysical]);

    useEffect(() => {
        if (data.health_disabilityIntellectual.includes('Lainnya') && disabilityIntellectualOtherRef.current) {
            disabilityIntellectualOtherRef.current.focus();
        }
    }, [data.health_disabilityIntellectual]);

    useEffect(() => {
        if (data.health_disabilityMental.includes('Lainnya') && disabilityMentalOtherRef.current) {
            disabilityMentalOtherRef.current.focus();
        }
    }, [data.health_disabilityMental]);

    useEffect(() => {
        if (data.health_disabilitySensory.includes('Lainnya') && disabilitySensoryOtherRef.current) {
            disabilitySensoryOtherRef.current.focus();
        }
    }, [data.health_disabilitySensory]);

    // Cleanup effects when main option changes
    useEffect(() => {
        if (data.health_chronicSick === 'Tidak') {
            update({
                health_chronicDisease: [],
                health_chronicDiseaseOther: ''
            });
        }
    }, [data.health_chronicSick]);

    useEffect(() => {
        if (data.health_hasDisability === 'Tidak') {
            update({
                health_disabilityPhysical: [],
                health_disabilityPhysicalOther: '',
                health_disabilityIntellectual: [],
                health_disabilityIntellectualOther: '',
                health_disabilityMental: [],
                health_disabilityMentalOther: '',
                health_disabilitySensory: [],
                health_disabilitySensoryOther: '',
                health_disabilityDouble: false
            });
        }
    }, [data.health_hasDisability]);

    const otherInputClass = "w-full mt-2 h-11 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] outline-none transition-all duration-200 text-sm";

    return (
        <div className="space-y-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-black dark:text-white">
                <span className="material-symbols-outlined text-primary">medical_services</span>
                Kondisi Kesehatan & Sosial
            </h3>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3 mb-2 animate-fadeIn border border-blue-100 dark:border-blue-800/50 shadow-sm shadow-blue-100/50 dark:shadow-none">
                <span className="material-symbols-outlined text-blue-500 text-xl shrink-0 mt-0.5">shield_locked</span>
                <p className="leading-relaxed">Data kondisi kesehatan dan disabilitas ini digunakan <strong>hanya untuk pemetaan kebutuhan pelayanan pastoral gereja</strong> (diakonia). Majelis Jemaat menjamin kerahasiaan informasi medis keluarga Anda.</p>
            </div>

            {/* 1. Sakit 30 Hari Terakhir */}
            <div className="space-y-4">
                <SectionHeader title="Apakah ada anggota keluarga yang mengalami sakit dalam 30 hari terakhir?" />
                <FormRadioGroup
                    name="health_sick30Days"
                    options={['Ya, rawat inap', 'Ya, rawat jalan', 'Tidak ada']}
                    value={data.health_sick30Days}
                    onChange={(val) => update({ health_sick30Days: val })}
                    columns={3}
                />
            </div>

            {/* 2. Sakit Menahun */}
            <div className="space-y-4">
                <SectionHeader title="Apakah ada anggota keluarga sakit menahun?" />
                <FormRadioGroup
                    name="health_chronicSick"
                    options={['Ya', 'Tidak']}
                    value={data.health_chronicSick}
                    onChange={(val) => update({ health_chronicSick: val })}
                    columns={2}
                />

                {/* 3. Jenis Penyakit Menahun (Conditional) */}
                {data.health_chronicSick === 'Ya' && (
                    <div className="space-y-4 pl-4 border-l-2 border-primary/20 mt-4">
                        <FormMultiSelect
                            label="Apa jenis penyakit menahun?"
                            id="health_chronicDisease"
                            options={['Jantung', 'Hipertensi/Darah Tinggi', 'Diabetes Militus', 'Stroke', 'Penyakit Paru (TBC/Asma)', 'Kanker', 'Lainnya']}
                            value={data.health_chronicDisease}
                            onChange={(val) => update({ health_chronicDisease: val })}
                            placeholder="Pilih Penyakit (Bisa > 1)..."
                        />
                        {data.health_chronicDisease.includes('Lainnya') && (
                            <div className="mt-2">
                                <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Sebutkan penyakit lainnya:</label>
                                <input
                                    ref={chronicDiseaseOtherRef}
                                    type="text"
                                    className={otherInputClass}
                                    placeholder="Tuliskan jenis penyakit..."
                                    value={data.health_chronicDiseaseOther || ''}
                                    onChange={(e) => update({ health_chronicDiseaseOther: e.target.value })}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 4. BPJS Kesehatan */}
            <div className="space-y-4">
                <SectionHeader title="Apakah memiliki BPJS Kesehatan?" />
                <FormRadioGroup
                    name="health_hasBPJS"
                    options={['Ya', 'Tidak']}
                    value={data.health_hasBPJS}
                    onChange={(val) => update({ health_hasBPJS: val })}
                    columns={2}
                />
            </div>

            {/* 5. Pengobatan Teratur */}
            <div className="space-y-4">
                <SectionHeader title="Apakah mendapat pengobatan yang teratur dari Fasilitas Kesehatan?" />
                <FormRadioGroup
                    name="health_regularTreatment"
                    options={['Ya', 'Tidak']}
                    value={data.health_regularTreatment}
                    onChange={(val) => update({ health_regularTreatment: val })}
                    columns={2}
                />
            </div>

            {/* 6. BPJS Ketenagakerjaan */}
            <div className="space-y-4">
                <SectionHeader title="Apakah memiliki BPJS Ketenagakerjaan?" />
                <FormRadioGroup
                    name="health_hasBPJSKetenagakerjaan"
                    options={['Ya', 'Tidak']}
                    value={data.health_hasBPJSKetenagakerjaan}
                    onChange={(val) => update({ health_hasBPJSKetenagakerjaan: val })}
                    columns={2}
                />
            </div>

            {/* 7. Bansos */}
            <div className="space-y-4">
                <FormSelect
                    label="Apa jenis bantuan sosial yang diterima?"
                    id="health_socialAssistance"
                    options={['PKH', 'BPNT', 'BLT', 'Tidak']}
                    value={data.health_socialAssistance}
                    onChange={(val) => update({ health_socialAssistance: val })}
                    placeholder="Pilih Jenis Bansos..."
                    required={true}
                />
            </div>

            {/* 8. Disabilitas */}
            <div className="space-y-6 bg-red-50/50 dark:bg-red-950/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/20">
                <div className="space-y-4">
                    <SectionHeader title="Apakah ada anggota keluarga penyandang disabilitas?" />
                    <FormRadioGroup
                        name="health_hasDisability"
                        options={['Ya', 'Tidak']}
                        value={data.health_hasDisability}
                        onChange={(val) => update({ health_hasDisability: val })}
                        columns={2}
                    />
                </div>

                {/* Conditional Disabilitas Questions 9-13 */}
                {data.health_hasDisability === 'Ya' && (
                    <div className="space-y-6 pl-0 md:pl-4 md:border-l-2 md:border-primary/20 pt-2">
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3.5 rounded-xl text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2">
                            <span className="material-symbols-outlined text-amber-600 text-lg shrink-0 mt-0.5">info</span>
                            <p><strong>Perhatian:</strong> Mohon lengkapi detail jenis disabilitas di bawah ini. Pilih "Tidak Ada" jika kategori tersebut tidak berlaku.</p>
                        </div>

                        {/* 13. Disabilitas Ganda */}
                        <div className="space-y-3">
                            <SectionHeader title="Disabilitas Ganda" />
                            <label className={`cursor-pointer p-4 border-2 rounded-xl flex items-center gap-4 transition-all duration-200 ${data.health_disabilityDouble ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10' : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${data.health_disabilityDouble
                                    ? 'border-primary bg-primary'
                                    : 'border-slate-300 dark:border-slate-600'
                                    }`}>
                                    {data.health_disabilityDouble && (
                                        <span className="material-symbols-outlined text-slate-900 dark:text-white text-sm">check</span>
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={data.health_disabilityDouble || false}
                                    onChange={(e) => {
                                        const isDouble = e.target.checked;
                                        const updates: any = { health_disabilityDouble: isDouble };

                                        if (!isDouble) {
                                            updates.health_disabilityPhysical = [];
                                            updates.health_disabilityIntellectual = [];
                                            updates.health_disabilityMental = [];
                                            updates.health_disabilitySensory = [];
                                            updates.health_disabilityPhysicalOther = '';
                                            updates.health_disabilityIntellectualOther = '';
                                            updates.health_disabilityMentalOther = '';
                                            updates.health_disabilitySensoryOther = '';
                                        }
                                        update(updates);
                                    }}
                                    className="sr-only"
                                />
                                <div>
                                    <span className="font-semibold text-slate-900 dark:text-white block text-sm">Kombinasi lebih dari satu jenis disabilitas</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">Centang jika anggota keluarga memiliki lebih dari satu jenis kategori disabilitas di bawah ini.</span>
                                </div>
                            </label>
                        </div>

                        {(() => {
                            const isPhysicalChosen = (data.health_disabilityPhysical?.length ?? 0) > 0;
                            const isIntellectualChosen = (data.health_disabilityIntellectual?.length ?? 0) > 0;
                            const isMentalChosen = (data.health_disabilityMental?.length ?? 0) > 0;
                            const isSensoryChosen = (data.health_disabilitySensory?.length ?? 0) > 0;
                            const anyChosen = isPhysicalChosen || isIntellectualChosen || isMentalChosen || isSensoryChosen;

                            return (
                                <div className="space-y-6">
                                    {/* 9. Disabilitas Fisik */}
                                    {(data.health_disabilityDouble || !anyChosen || isPhysicalChosen) && (
                                        <div className="space-y-3">
                                            <FormMultiSelect
                                                label="Disabilitas Fisik"
                                                id="health_disabilityPhysical"
                                                options={['Lumpuh', 'Amputasi', 'Cerebral Palsy', 'Gangguan tulang/sendi', 'Pasca stroke', 'Lainnya']}
                                                value={data.health_disabilityPhysical}
                                                onChange={(val) => {
                                                    const updates: any = { health_disabilityPhysical: val };
                                                    if (!data.health_disabilityDouble && val.length > 0) {
                                                        updates.health_disabilityIntellectual = [];
                                                        updates.health_disabilityMental = [];
                                                        updates.health_disabilitySensory = [];
                                                        updates.health_disabilityIntellectualOther = '';
                                                        updates.health_disabilityMentalOther = '';
                                                        updates.health_disabilitySensoryOther = '';
                                                    }
                                                    update(updates);
                                                }}
                                                placeholder="Pilih Jenis (Bisa > 1)..."
                                            />
                                            {data.health_disabilityPhysical.includes('Lainnya') && (
                                                <input
                                                    ref={disabilityPhysicalOtherRef}
                                                    type="text"
                                                    className={otherInputClass}
                                                    placeholder="Sebutkan disabilitas fisik..."
                                                    value={data.health_disabilityPhysicalOther || ''}
                                                    onChange={(e) => update({ health_disabilityPhysicalOther: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* 10. Disabilitas Intelektual */}
                                    {(data.health_disabilityDouble || !anyChosen || isIntellectualChosen) && (
                                        <div className="space-y-3">
                                            <FormMultiSelect
                                                label="Disabilitas Intelektual"
                                                id="health_disabilityIntellectual"
                                                options={['Down Syndrome', 'Tunagrahita Ringan', 'Tunagrahita Sedang', 'Tunagrahita Berat', 'Lainnya']}
                                                value={data.health_disabilityIntellectual}
                                                onChange={(val) => {
                                                    const updates: any = { health_disabilityIntellectual: val };
                                                    if (!data.health_disabilityDouble && val.length > 0) {
                                                        updates.health_disabilityPhysical = [];
                                                        updates.health_disabilityMental = [];
                                                        updates.health_disabilitySensory = [];
                                                        updates.health_disabilityPhysicalOther = '';
                                                        updates.health_disabilityMentalOther = '';
                                                        updates.health_disabilitySensoryOther = '';
                                                    }
                                                    update(updates);
                                                }}
                                                placeholder="Pilih Jenis (Bisa > 1)..."
                                            />
                                            {data.health_disabilityIntellectual.includes('Lainnya') && (
                                                <input
                                                    ref={disabilityIntellectualOtherRef}
                                                    type="text"
                                                    className={otherInputClass}
                                                    placeholder="Sebutkan disabilitas intelektual..."
                                                    value={data.health_disabilityIntellectualOther || ''}
                                                    onChange={(e) => update({ health_disabilityIntellectualOther: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* 11. Disabilitas Mental */}
                                    {(data.health_disabilityDouble || !anyChosen || isMentalChosen) && (
                                        <div className="space-y-3">
                                            <FormMultiSelect
                                                label="Disabilitas Mental"
                                                id="health_disabilityMental"
                                                options={['Skizofrenia', 'Bipolar', 'Depresi Berat', 'Gangguan Kecemasan Berat', 'Autisme', 'ADHD/GPPH', 'Lainnya']}
                                                value={data.health_disabilityMental}
                                                onChange={(val) => {
                                                    const updates: any = { health_disabilityMental: val };
                                                    if (!data.health_disabilityDouble && val.length > 0) {
                                                        updates.health_disabilityPhysical = [];
                                                        updates.health_disabilityIntellectual = [];
                                                        updates.health_disabilitySensory = [];
                                                        updates.health_disabilityPhysicalOther = '';
                                                        updates.health_disabilityIntellectualOther = '';
                                                        updates.health_disabilitySensoryOther = '';
                                                    }
                                                    update(updates);
                                                }}
                                                placeholder="Pilih Jenis (Bisa > 1)..."
                                            />
                                            {data.health_disabilityMental.includes('Lainnya') && (
                                                <input
                                                    ref={disabilityMentalOtherRef}
                                                    type="text"
                                                    className={otherInputClass}
                                                    placeholder="Sebutkan disabilitas mental..."
                                                    value={data.health_disabilityMentalOther || ''}
                                                    onChange={(e) => update({ health_disabilityMentalOther: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* 12. Disabilitas Sensorik */}
                                    {(data.health_disabilityDouble || !anyChosen || isSensoryChosen) && (
                                        <div className="space-y-3">
                                            <FormMultiSelect
                                                label="Disabilitas Sensorik"
                                                id="health_disabilitySensory"
                                                options={['Tunanetra', 'Tunarungu', 'Gangguan Wicara', 'Tunarungu-Wicara', 'Lainnya']}
                                                value={data.health_disabilitySensory}
                                                onChange={(val) => {
                                                    const updates: any = { health_disabilitySensory: val };
                                                    if (!data.health_disabilityDouble && val.length > 0) {
                                                        updates.health_disabilityPhysical = [];
                                                        updates.health_disabilityIntellectual = [];
                                                        updates.health_disabilityMental = [];
                                                        updates.health_disabilityPhysicalOther = '';
                                                        updates.health_disabilityIntellectualOther = '';
                                                        updates.health_disabilityMentalOther = '';
                                                    }
                                                    update(updates);
                                                }}
                                                placeholder="Pilih Jenis (Bisa > 1)..."
                                            />
                                            {data.health_disabilitySensory.includes('Lainnya') && (
                                                <input
                                                    ref={disabilitySensoryOtherRef}
                                                    type="text"
                                                    className={otherInputClass}
                                                    placeholder="Sebutkan disabilitas sensorik..."
                                                    value={data.health_disabilitySensoryOther || ''}
                                                    onChange={(e) => update({ health_disabilitySensoryOther: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                    </div>
                )}
            </div>

        </div>
    );
};

export default Step6Health;
