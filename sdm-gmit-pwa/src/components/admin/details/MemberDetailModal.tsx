import { toast } from '../../ui/Toast';
import { jsPDF } from 'jspdf';
import { calculateAge } from '../../../hooks/useMemberData';

interface MemberDetailModalProps {
    member: any;
    onClose: () => void;
    onEdit?: () => void;
}

export const MemberDetailModal = ({ member, onClose, onEdit }: MemberDetailModalProps) => {
    if (!member) return null;


    const handlePrintCard = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [85.6, 53.98] // ID Card standard size (CR-80)
        });

        // Background
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(0, 0, 85.6, 53.98, 'F');

        // Header Shape
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, 85.6, 12, 'F');

        // Header Text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("GEREJA MASEHI INJILI DI TIMOR (GMIT)", 42.8, 5, { align: "center" });
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text("KARTU ANGGOTA JEMAAT", 42.8, 9, { align: "center" });

        // Content
        doc.setTextColor(15, 23, 42);

        // Name
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(member.name.toUpperCase(), 5, 20);

        // ID
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text(`ID: ${member.id}`, 5, 24);

        // Details Column 1
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");

        doc.text("Sektor Kategorial", 5, 32);
        doc.setFont("helvetica", "bold");
        doc.text(": " + member.sector, 25, 32);

        doc.setFont("helvetica", "normal");
        doc.text("Rayon/Ling.", 5, 36);
        doc.setFont("helvetica", "bold");
        doc.text(`: R${member.rayon} / L${member.lingkungan}`, 25, 36);

        // Details Column 2
        doc.setFont("helvetica", "normal");
        doc.text("Gender", 5, 40);
        doc.setFont("helvetica", "bold");
        doc.text(": " + member.gender, 25, 40);

        doc.setFont("helvetica", "normal");
        doc.text("Pekerjaan", 5, 44);
        doc.setFont("helvetica", "bold");
        doc.text(": " + (member.job || member.jobCategory), 25, 44);

        // Footer Decoration
        doc.setDrawColor(37, 99, 235); // primary blue
        doc.setLineWidth(1);
        doc.line(0, 50, 85.6, 50);

        doc.setFontSize(5);
        doc.setTextColor(148, 163, 184);
        doc.text("Kartu ini adalah bukti keanggotaan yang sah.", 42.8, 52.5, { align: "center" });

        doc.save(`${member.name.replace(/\s+/g, '_')}_Card.pdf`);
        toast.success("Kartu Anggota berhasil didownload");
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in-up">
            {/* Header / Profile Summary */}
            <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>

                <div className="size-20 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-primary text-2xl font-black border-2 border-primary shadow-sm z-10 shrink-0">
                    {member.initials}
                </div>
                <div className="flex-1 z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{member.name}</h3>
                            <p className="text-slate-500 font-mono text-xs font-bold mb-1 tracking-wide text-opacity-80">ID: {member.id}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${member.willingnessToServe === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {member.willingnessToServe === 'Active' ? 'RELAWAN AKTIF' : member.willingnessToServe === 'On-demand' ? 'RELAWAN ON-DEMAND' : 'JEMAAT'}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                            Sektor Kat.: {member.sector}
                        </span>
                        <span className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                            Rayon {member.rayon}
                        </span>
                        <span className="px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                            Lingkungan {member.lingkungan}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-primary mb-1 text-xl">school</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Pendidikan</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{member.education || "-"}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-orange-500 mb-1 text-xl">cake</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Usia</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{calculateAge(member.birthDate)} Thn</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                    <span className="material-symbols-outlined text-green-500 mb-1 text-xl">medical_services</span>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Keahlian</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{Array.isArray(member.skills) ? member.skills.length : 0}</span>
                </div>
            </div>

            {/* Detailed Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="material-symbols-outlined text-slate-400 text-lg">person</span> Data Pribadi
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50 pb-2">
                            <span className="text-xs text-slate-500 font-medium">Jenis Kelamin</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{member.gender}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50 pb-2">
                            <span className="text-xs text-slate-500 font-medium">No. HP</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{member.phone || "-"}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-slate-50 dark:border-slate-800/50 pb-2">
                            <span className="text-xs text-slate-500 font-medium">Alamat</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{member.address || "-"}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="material-symbols-outlined text-slate-400 text-lg">work</span> Profil Profesional
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                        <div className="flex flex-col gap-1 border-b border-slate-50 dark:border-slate-800/50 pb-2">
                            <span className="text-xs text-slate-500 font-medium">Pekerjaan & Instansi</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{member.job || member.jobCategory} {member.companyName ? `at ${member.companyName}` : ''}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50 pb-2">
                            <span className="text-xs text-slate-500 font-medium">Lama Pengalaman</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{member.yearsOfExperience || 0} Tahun</span>
                        </div>
                        <div className="flex flex-col gap-1 border-b border-slate-50 dark:border-slate-800/50 pb-2">
                            <span className="text-xs text-slate-500 font-medium">Pendidikan & Jurusan</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{member.education} {member.major ? `- ${member.major}` : ''}</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-4">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="material-symbols-outlined text-slate-400 text-lg">volunteer_activism</span> Komitmen Pelayanan
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Minat Pelayanan</span>
                            <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(member.interestAreas) && member.interestAreas.length > 0 ? (
                                    member.interestAreas.map((area: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg border border-blue-100 dark:border-blue-800">
                                            {area}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-slate-400 italic">Belum memilih</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Bentuk Kontribusi</span>
                            <div className="flex flex-wrap gap-1.5">
                                {Array.isArray(member.contributionTypes) && member.contributionTypes.length > 0 ? (
                                    member.contributionTypes.map((type: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-[10px] font-bold rounded-lg border border-green-100 dark:border-green-800">
                                            {type}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-[10px] text-slate-400 italic">Belum memilih</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="material-symbols-outlined text-slate-400 text-lg">location_on</span> Lokasi Peta
                    </h4>
                    {member.latitude && member.longitude ? (
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${member.latitude},${member.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors text-xs font-bold text-slate-600 dark:text-slate-300"
                        >
                            <span className="material-symbols-outlined text-sm text-primary">map</span>
                            Lihat di Google Maps
                        </a>
                    ) : (
                        <span className="text-xs text-slate-400 italic">Koordinat lokasi tidak tersedia</span>
                    )}
                </div>

                <div className="col-span-1 md:col-span-2 space-y-3">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
                        <span className="material-symbols-outlined text-slate-400 text-lg">star</span> Keahlian (Skills)
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(member.skills) && member.skills.length > 0 ? (
                            member.skills.map((skill: string, idx: number) => (
                                <span key={idx} className="bg-primary/5 text-primary px-3 py-1.5 rounded-xl text-xs font-bold border border-primary/10 shadow-sm flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-slate-400 italic">Belum ada data keahlian</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                <button
                    onClick={handlePrintCard}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-lg">id_card</span>
                    Cetak Kartu Anggota
                </button>
                <div className="flex gap-2">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="px-4 py-2 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                            Edit Data
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-xl text-sm font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-all shadow-lg active:scale-95"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};
