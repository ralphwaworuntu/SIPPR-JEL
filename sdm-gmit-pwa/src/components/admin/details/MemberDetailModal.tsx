import { toast } from '../../ui/Toast';
import { jsPDF } from 'jspdf';
import { calculateAge } from '../../../hooks/useMemberData';

interface MemberDetailModalProps {
    member: any;
    onClose: () => void;
    onEdit?: () => void;
}

// Helper component for detail rows
const DetailRow = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex justify-between items-center border-b border-slate-50 dark:border-slate-800/50 pb-2">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{value || "-"}</span>
    </div>
);

const SectionTitle = ({ icon, title }: { icon: string; title: string }) => (
    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2">
        <span className="material-symbols-outlined text-slate-400 text-lg">{icon}</span> {title}
    </h4>
);

const TagList = ({ items, color = "blue" }: { items: string[] | undefined; color?: string }) => {
    const colorMap: Record<string, string> = {
        blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
        green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800",
        violet: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-800",
        red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
    };
    if (!Array.isArray(items) || items.length === 0) return <span className="text-[10px] text-slate-400 italic">Tidak ada data</span>;
    return (
        <div className="flex flex-wrap gap-1.5">
            {items.map((item, i) => (
                <span key={i} className={`px-2 py-1 text-[10px] font-bold rounded-lg border ${colorMap[color]}`}>{item}</span>
            ))}
        </div>
    );
};

export const MemberDetailModal = ({ member, onClose, onEdit }: MemberDetailModalProps) => {
    if (!member) return null;

    const handlePrintCard = () => {
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [85.6, 53.98]
        });

        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, 85.6, 53.98, 'F');
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 85.6, 12, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.text("GEREJA MASEHI INJILI DI TIMOR (GMIT)", 42.8, 5, { align: "center" });
        doc.setFontSize(6);
        doc.setFont("helvetica", "normal");
        doc.text("KARTU ANGGOTA JEMAAT", 42.8, 9, { align: "center" });

        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(member.name.toUpperCase(), 5, 20);

        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 116, 139);
        doc.text(`ID: ${member.id}`, 5, 24);

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
        doc.setFont("helvetica", "normal");
        doc.text("Gender", 5, 40);
        doc.setFont("helvetica", "bold");
        doc.text(": " + member.gender, 25, 40);
        doc.setFont("helvetica", "normal");
        doc.text("Pekerjaan", 5, 44);
        doc.setFont("helvetica", "bold");
        doc.text(": " + (member.job || member.jobCategory), 25, 44);

        doc.setDrawColor(37, 99, 235);
        doc.setLineWidth(1);
        doc.line(0, 50, 85.6, 50);
        doc.setFontSize(5);
        doc.setTextColor(148, 163, 184);
        doc.text("Kartu ini adalah bukti keanggotaan yang sah.", 42.8, 52.5, { align: "center" });

        doc.save(`${member.name.replace(/\s+/g, '_')}_Card.pdf`);
        toast.success("Kartu Anggota berhasil didownload");
    };

    const totalExpense = (member.economics_expense_food || 0) + (member.economics_expense_utilities || 0) + (member.economics_expense_education || 0) + (member.economics_expense_other || 0);

    return (
        <div className="flex flex-col gap-5 animate-fade-in-up max-h-[75vh] overflow-y-auto custom-scrollbar pr-1 pb-4">

            {/* Header Passport Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl border border-slate-700 relative overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 Mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                <div className="size-24 rounded-full bg-white flex items-center justify-center text-slate-800 text-3xl font-black border-4 border-slate-700 shadow-inner z-10 shrink-0">
                    {member.initials}
                </div>

                <div className="flex-1 z-10 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div>
                            <h3 className="text-2xl font-black text-white leading-tight mb-1">{member.name}</h3>
                            <div className="flex items-center gap-2">
                                <p className="text-slate-400 font-mono text-xs font-bold tracking-wider">ID: {member.id}</p>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${member.statusGerejawi === 'Sidi' ? 'bg-primary text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                                    {member.statusGerejawi || 'JEMAAT'}
                                </span>
                            </div>
                        </div>
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest border uppercase ${member.willingnessToServe === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-slate-800/50 text-slate-300 border-slate-600'}`}>
                            {member.willingnessToServe === 'Active' ? 'RELAWAN AKTIF' : member.willingnessToServe === 'On-demand' ? 'RELAWAN ON-DEMAND' : 'JEMAAT UMUM'}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                            <span className="material-symbols-outlined text-sm text-primary">domain</span>
                            Sektor {member.sector}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                            <span className="material-symbols-outlined text-sm text-primary">signpost</span>
                            R{member.rayon} L{member.lingkungan}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                            <span className="material-symbols-outlined text-sm text-primary">cake</span>
                            {calculateAge(member.birthDate)} Thn
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
                            <span className="material-symbols-outlined text-sm text-primary">family_restroom</span>
                            {member.familyMembers || 0} Anggota Keluarga
                        </div>
                    </div>
                </div>
            </div>

            {/* BENTO GRID: 6 Cards matching Form Steps 1-6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {/* Card 1 — Step 1: Identitas & Keluarga */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1 md:row-span-2">
                    <SectionTitle icon="badge" title="Identitas & Keluarga" />
                    <div className="mt-4 space-y-3">
                        <DetailRow label="No. KK" value={member.kkNumber} />
                        <DetailRow label="NIK" value={member.nik} />
                        <DetailRow label="Jenis Kelamin" value={member.gender} />
                        <DetailRow label="Tanggal Lahir" value={member.birthDate} />
                        <DetailRow label="No. HP" value={member.phone} />
                        <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 mt-2">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Alamat Lengkap</span>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{member.address || "-"}</span>
                        </div>
                        {member.latitude && member.longitude && (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${member.latitude},${member.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full mt-2 inline-flex justify-center items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                            >
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                Buka di Peta
                            </a>
                        )}

                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Anggota Keluarga</span>
                            <DetailRow label="Total Anggota" value={member.familyMembers} />
                            <DetailRow label="Laki-laki / Perempuan" value={`${member.familyMembersMale || 0} / ${member.familyMembersFemale || 0}`} />
                            <DetailRow label="Di Luar Kota" value={member.familyMembersOutside} />
                            <DetailRow label="Sidi (L/P)" value={`${member.familyMembersSidiMale || 0} / ${member.familyMembersSidiFemale || 0}`} />
                            <DetailRow label="Belum Baptis" value={member.familyMembersNonBaptized} />
                            <DetailRow label="Belum Sidi" value={member.familyMembersNonSidi} />
                        </div>
                    </div>
                </div>

                {/* Card 2 — Step 2: Diakonia & Profesional */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-2">
                    <SectionTitle icon="work" title="Diakonia & Profesional" />

                    {/* Diakonia Sub-section */}
                    <div className="mt-4 mb-4">
                        {member.diakonia_recipient === 'Ya' ? (
                            <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                                <span className="material-symbols-outlined text-indigo-500">card_giftcard</span>
                                <div>
                                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400">Penerima Diakonia ({member.diakonia_year})</p>
                                    <p className="text-[10px] text-indigo-600 font-medium">{member.diakonia_type}</p>
                                </div>
                            </div>
                        ) : (
                            <DetailRow label="Penerima Diakonia" value="Tidak" />
                        )}
                    </div>

                    {/* Profesional Sub-section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <DetailRow label="Pendidikan Terakhir" value={member.education} />
                        <DetailRow label="Jurusan" value={member.major} />
                        <DetailRow label="Kategori Pekerjaan" value={member.jobCategory} />
                        <DetailRow label="Jabatan / Pekerjaan" value={member.jobTitle || member.job} />
                        <DetailRow label="Instansi/Perusahaan" value={member.companyName} />
                        <DetailRow label="Pengalaman Profesi" value={`${member.yearsOfExperience || 0} Tahun`} />
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="block text-xs font-bold text-slate-500 mb-2">Keahlian (Skills)</span>
                        <div className="flex flex-wrap gap-2">
                            {Array.isArray(member.skills) && member.skills.length > 0 ? (
                                member.skills.map((skill: string, idx: number) => (
                                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-slate-400 italic">Belum ada data keahlian</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card 3 — Step 3: Komitmen Pelayanan */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-2">
                    <SectionTitle icon="volunteer_activism" title="Komitmen Pelayanan" />
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="bg-blue-50/50 dark:bg-blue-900/5 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                            <span className="block text-[10px] uppercase font-bold text-blue-500 mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">local_fire_department</span> Minat Pelayanan</span>
                            <TagList items={member.interestAreas} color="blue" />
                        </div>
                        <div className="bg-green-50/50 dark:bg-green-900/5 p-4 rounded-xl border border-green-100 dark:border-green-900/20">
                            <span className="block text-[10px] uppercase font-bold text-green-500 mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">handshake</span> Bentuk Kontribusi</span>
                            <TagList items={member.contributionTypes} color="green" />
                        </div>
                    </div>
                </div>

                {/* Card 4 — Step 4: Pendidikan Anak */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1">
                    <SectionTitle icon="school" title="Pendidikan Anak" />
                    <div className="mt-4 space-y-3">
                        <DetailRow label="Ada Anak Bersekolah?" value={member.education_schoolingStatus} />
                        {(member.education_inSchool_tk_paud > 0 || member.education_inSchool_sd > 0 || member.education_inSchool_smp > 0 || member.education_inSchool_sma > 0 || member.education_inSchool_university > 0) && (
                            <>
                                <div className="text-[10px] uppercase font-bold text-slate-400 pt-1">Sedang Sekolah</div>
                                <DetailRow label="TK/PAUD" value={member.education_inSchool_tk_paud} />
                                <DetailRow label="SD" value={member.education_inSchool_sd} />
                                <DetailRow label="SMP" value={member.education_inSchool_smp} />
                                <DetailRow label="SMA" value={member.education_inSchool_sma} />
                                <DetailRow label="Universitas" value={member.education_inSchool_university} />
                            </>
                        )}
                        {(member.education_dropout_tk_paud > 0 || member.education_dropout_sd > 0 || member.education_dropout_smp > 0 || member.education_dropout_sma > 0) && (
                            <>
                                <div className="text-[10px] uppercase font-bold text-red-400 pt-1">Putus Sekolah</div>
                                <DetailRow label="SD" value={member.education_dropout_sd} />
                                <DetailRow label="SMP" value={member.education_dropout_smp} />
                                <DetailRow label="SMA" value={member.education_dropout_sma} />
                            </>
                        )}
                        <DetailRow label="Sudah Bekerja" value={member.education_working} />
                    </div>
                </div>

                {/* Card 5 — Step 5: Ekonomi & Aset */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1 md:row-span-2">
                    <SectionTitle icon="paid" title="Ekonomi & Aset" />
                    <div className="mt-4 space-y-3">
                        <DetailRow label="Pekerjaan Kep. Keluarga" value={member.economics_headOccupation} />
                        <DetailRow label="Pekerjaan Pasangan" value={member.economics_spouseOccupation} />

                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20 mt-2">
                            <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1">Range Pendapatan</span>
                            <span className="text-lg font-black text-emerald-700 dark:text-emerald-500">{member.economics_incomeRange || "-"}</span>
                        </div>

                        {totalExpense > 0 && (
                            <DetailRow label="Total Pengeluaran" value={`Rp ${totalExpense.toLocaleString('id-ID')}`} />
                        )}

                        {member.economics_hasBusiness === 'Ya' && (
                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <span className="block text-xs font-bold text-slate-500 mb-2 text-primary">Info Usaha (UMKM)</span>
                                <DetailRow label="Nama Usaha" value={member.economics_businessName} />
                                <DetailRow label="Jenis Usaha" value={member.economics_businessType} />
                            </div>
                        )}

                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <DetailRow label="Status Rumah" value={member.economics_houseStatus} />
                            <DetailRow label="Jenis Rumah" value={member.economics_houseType} />
                            <DetailRow label="Sumber Air" value={member.economics_waterSource} />
                            {member.economics_hasAssets === 'Ya' && (
                                <div className="mt-2">
                                    <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Aset Tersedia</span>
                                    <TagList items={member.economics_assets} color="violet" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card 6 — Step 6: Kesehatan */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1">
                    <SectionTitle icon="health_and_safety" title="Kesehatan" />
                    <div className="mt-4 space-y-3">
                        <DetailRow label="Sakit 30 Hari Terakhir" value={member.health_sick30Days} />
                        <DetailRow label="BPJS Kesehatan" value={member.health_hasBPJS} />
                        <DetailRow label="BPJS Naker" value={member.health_hasBPJSKetenagakerjaan} />
                        <DetailRow label="Bantuan Sosial" value={member.health_socialAssistance} />

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2">
                            {member.health_chronicSick === 'Ya' ? (
                                <div className="p-2 mb-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/20">
                                    <span className="text-[10px] uppercase font-bold text-red-500 block mb-1">Penyakit Kronis</span>
                                    <TagList items={member.health_chronicDisease} color="red" />
                                </div>
                            ) : <DetailRow label="Penyakit Kronis" value="Tidak" />}

                            {member.health_hasDisability === 'Ya' ? (
                                <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded border border-amber-100 dark:border-amber-900/20">
                                    <span className="text-[10px] uppercase font-bold text-amber-600 block mb-1">Disabilitas Fisik</span>
                                    <TagList items={member.health_disabilityPhysical} color="red" />
                                </div>
                            ) : <DetailRow label="Disabilitas Fisik" value="Tidak" />}
                        </div>
                    </div>
                </div>

            </div>

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 pb-2 sticky bottom-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-1 mt-auto border-t border-slate-100 dark:border-slate-800">
                <button
                    onClick={handlePrintCard}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm group"
                >
                    <span className="material-symbols-outlined text-[20px] group-hover:text-primary transition-colors">print</span>
                    Cetak Kartu Pegangan
                </button>
                <div className="flex gap-3 w-full sm:w-auto">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">edit_document</span> Edit
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-sm font-bold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-all shadow-lg active:scale-95"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};
