import { useState } from 'react';
import { type Family } from '../../../hooks/useFamilyData';

interface FamilyDetailModalProps {
    family: Family | null;
    onClose: () => void;
    onEdit?: () => void;
}

export const FamilyDetailModal = ({ family, onClose, onEdit }: FamilyDetailModalProps) => {
    const [subTab, setSubTab] = useState<'anggota' | 'riwayat'>('anggota');

    if (!family) return null;

    // Mock Family Members logic (Simulated for UI demo)
    // In real app, this would fetch from useMemberData or API by familyId
    const familyMembers = [
        { name: family.head, status: "Kepala Keluarga", gender: "Laki-laki", age: 45 }, // Dynamic head
        ...(family.members > 1 ? Array.from({ length: family.members - 1 }).map((_, i) => ({
            name: `Anggota Keluarga ${i + 1}`,
            status: i === 0 ? "Istri" : "Anak",
            gender: i === 0 ? "Perempuan" : "Laki-laki",
            age: 20 - i * 5
        })) : [])
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Header Info */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">family_restroom</span>
                            {family.head}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">{family.address} ({family.sector})</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${family.status === 'Aktif'
                        ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                        : 'bg-slate-100 text-slate-500'
                        }`}>
                        {family.status}
                    </span>
                </div>
                <div className="flex gap-4 mt-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">confirmation_number</span>
                        {family.id}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">event</span>
                        Terakhir dikunjungi: {family.lastVisit}
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">calendar_month</span>
                        Terdaftar: {new Date(family.createdAt).toLocaleDateString('id-ID')}
                    </div>
                </div>
            </div>

            {/* Sub Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setSubTab('anggota')}
                    className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${subTab === 'anggota' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
                >
                    Anggota Keluarga ({family.members})
                </button>
                <button
                    onClick={() => setSubTab('riwayat')}
                    className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${subTab === 'riwayat' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
                >
                    Riwayat Kunjungan
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[200px]">
                {subTab === 'anggota' && (
                    <div className="space-y-2 animate-fade-in">
                        {familyMembers.map((member, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-sm">person</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</p>
                                        <p className="text-xs text-slate-500">{member.gender}, {member.age} thn</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {member.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {subTab === 'riwayat' && (
                    <div className="text-center py-8 text-slate-500 animate-fade-in">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">history_edu</span>
                        <p className="text-sm">Belum ada riwayat kunjungan tercatat.</p>
                        <button className="mt-4 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                            + Catat Kunjungan
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-lg">edit_square</span>
                        Edit Data
                    </button>
                )}
                <button
                    onClick={onClose}
                    className="px-6 py-2 rounded-xl text-sm font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                >
                    Tutup
                </button>
            </div>
        </div>
    );
};
