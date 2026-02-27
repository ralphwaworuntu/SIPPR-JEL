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
            orientation: 'portrait',
            unit: 'mm',
            format: 'a6'
        });

        // Background
        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, 105, 148, 'F');

        // Header
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, 105, 24, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("KARTU ANGGOTA JEMAAT", 52.5, 10, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Gereja Masehi Injili di Timor (GMIT)", 52.5, 16, { align: 'center' });

        // Body
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(member.name.toUpperCase(), 5, 32);

        doc.setFontSize(7);
        doc.setFont("helvetica", "normal");

        const startY = 40;
        const lh = 6;

        doc.text("NIK", 5, startY); doc.setFont("helvetica", "bold"); doc.text(`: ${member.nik || '-'}`, 30, startY); doc.setFont("helvetica", "normal");
        doc.text("No. KK", 5, startY + lh); doc.setFont("helvetica", "bold"); doc.text(`: ${member.kkNumber || '-'}`, 30, startY + lh); doc.setFont("helvetica", "normal");
        doc.text("Lingkungan", 5, startY + lh * 2); doc.setFont("helvetica", "bold"); doc.text(`: ${member.lingkungan || '-'}`, 30, startY + lh * 2); doc.setFont("helvetica", "normal");
        doc.text("Rayon", 5, startY + lh * 3); doc.setFont("helvetica", "bold"); doc.text(`: ${member.rayon || '-'}`, 30, startY + lh * 3); doc.setFont("helvetica", "normal");
        doc.text("Gender", 5, startY + lh * 4); doc.setFont("helvetica", "bold"); doc.text(`: ${member.gender || '-'}`, 30, startY + lh * 4); doc.setFont("helvetica", "normal");
        doc.text("Usia / Tgl Lahir", 5, startY + lh * 5); doc.setFont("helvetica", "bold"); doc.text(`: ${calculateAge(member.birthDate)} thn / ${member.birthDate}`, 30, startY + lh * 5); doc.setFont("helvetica", "normal");
        doc.text("Pendidikan", 5, startY + lh * 6); doc.setFont("helvetica", "bold"); doc.text(`: ${member.educationLevel || '-'}`, 30, startY + lh * 6); doc.setFont("helvetica", "normal");
        doc.text("Pekerjaan", 5, startY + lh * 7); doc.setFont("helvetica", "bold"); doc.text(`: ${member.jobCategory || '-'}`, 30, startY + lh * 7); doc.setFont("helvetica", "normal");
        doc.text("Relawan", 5, startY + lh * 8); doc.setFont("helvetica", "bold"); doc.text(`: ${['Aktif', 'Active', 'Ya'].includes(member.willingnessToServe) ? 'Aktif' : member.willingnessToServe === 'On-demand' ? 'On-demand' : '-'}`, 30, startY + lh * 8); doc.setFont("helvetica", "normal");
        doc.text("BPJS Kes", 5, startY + lh * 9); doc.setFont("helvetica", "bold"); doc.text(`: ${member.health_hasBPJS || '-'}`, 30, startY + lh * 9); doc.setFont("helvetica", "normal");

        const addr = member.address ? (member.address.length > 50 ? member.address.substring(0, 50) + "..." : member.address) : '-';
        doc.text("Alamat", 5, startY + lh * 11); doc.setFont("helvetica", "bold"); doc.text(`: ${addr}`, 30, startY + lh * 11); doc.setFont("helvetica", "normal");

        // Divider
        doc.setDrawColor(203, 213, 225); // slate-300
        doc.setLineWidth(0.5);
        doc.line(5, startY + lh * 12 + 2, 100, startY + lh * 12 + 2);

        doc.setFontSize(6);
        doc.text("Dicetak pada: " + new Date().toLocaleString('id-ID'), 5, 140);
        doc.text("Sistem Data Jemaat Emaus Liliba", 5, 144);

        doc.save(`${member.name.replace(/\s+/g, '_')}_Card.pdf`);
        toast.success("Kartu Anggota berhasil didownload");
    };

    const totalExpense = (member.economics_expense_food || 0) + (member.economics_expense_utilities || 0) + (member.economics_expense_education || 0) + (member.economics_expense_nonPanganII || 0) + (member.economics_expense_loan || 0) + (member.economics_expense_unexpected || 0) + (member.economics_expense_worship || 0) + (member.economics_expense_other || 0);

    return (
        <div className="flex flex-col animate-fade-in-up h-full max-h-full min-h-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 min-h-0">
                {/* Header Passport Card - Shrinked */}
                <div className="flex flex-row items-center gap-4 p-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 relative overflow-hidden shadow-xl shrink-0 mx-1 mt-1 ring-1 ring-white/10">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

                    <div className="size-16 rounded-full bg-slate-800 flex items-center justify-center text-white text-2xl font-black border-[3px] border-slate-700 shadow-inner z-10 shrink-0">
                        {member.name?.charAt(0) || "?"}
                    </div>

                    <div className="flex-1 z-10 w-full flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <h3 className="text-lg font-black text-white leading-none">{member.name}</h3>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${['Aktif', 'Active', 'Ya'].includes(member.willingnessToServe) ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800/50 text-slate-300 border border-slate-600'}`}>
                                    {['Aktif', 'Active', 'Ya'].includes(member.willingnessToServe) ? 'RELAWAN AKTIF' : member.willingnessToServe === 'On-demand' ? 'RELAWAN ON-DEMAND' : 'JEMAAT'}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-400">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-primary">signpost</span> Ling. {member.lingkungan} / Rayon {member.rayon}</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-primary">cake</span> {calculateAge(member.birthDate)} Tahun</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-primary">family_restroom</span> {member.familyMembers || 0} Anggota Keluarga</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[12px] text-primary">work</span> {member.jobCategory || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BENTO GRID: 6 Cards matching Form Steps 1-6 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 content-start mt-6 z-10 p-1 pb-4">

                    {/* Card 1 — Step 1: Identitas & Keluarga */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1 md:row-span-2 flex flex-col">
                        <SectionTitle icon="badge" title="Identitas Kepala Keluarga" />
                        <div className="mt-4 space-y-3">
                            <DetailRow label="Nomor Kartu Keluarga" value={member.kkNumber} />
                            <DetailRow label="NIK" value={member.nik} />
                            <DetailRow label="Nama Lengkap Kepala Keluarga" value={member.name} />
                            <DetailRow label="Jenis Kelamin" value={member.gender} />
                            <DetailRow label="Tanggal Lahir" value={member.birthDate} />
                            <DetailRow label="Usia" value={(calculateAge(member.birthDate) || '-') + " Tahun"} />
                            <DetailRow label="Golongan Darah" value={member.bloodType} />
                            <DetailRow label="Status Menikah" value={member.maritalStatus === 'Kawin' && member.marriageDate ? `Kawin (${member.marriageDate})` : member.maritalStatus} />
                            <DetailRow label="Status Baptis" value={member.baptismStatus} />
                            <DetailRow label="Status Sidi" value={member.sidiStatus} />
                            <DetailRow label="Nomor Telepon / WA" value={member.phone ? `+62 ${member.phone}` : '-'} />
                            <DetailRow label="Lingkungan" value={member.lingkungan} />
                            <DetailRow label="Rayon" value={member.rayon} />

                            <div className="flex flex-col gap-1.5 bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                                <span className="text-[10px] uppercase font-bold text-slate-400">Alamat Lengkap</span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{member.address || "-"}</span>
                                {(member.city || member.district || member.subdistrict) && (
                                    <span className="text-xs text-slate-500 font-medium">{[member.subdistrict, member.district, member.city].filter(Boolean).join(', ')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card 2 — Step 2: Keluarga & Diakonia */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1 flex flex-col">
                        <SectionTitle icon="diversity_1" title="Keluarga & Diakonia" />
                        <div className="mt-4 space-y-3">
                            <DetailRow label="Total Anggota Keluarga" value={`${member.familyMembers || 0} Orang`} />
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <div className="p-2 border border-slate-100 dark:border-slate-800 rounded bg-white dark:bg-slate-800 text-center">
                                    <span className="block text-[10px] font-bold text-slate-400">Laki-laki</span>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">{member.familyMembersMale || 0}</span>
                                </div>
                                <div className="p-2 border border-slate-100 dark:border-slate-800 rounded bg-white dark:bg-slate-800 text-center">
                                    <span className="block text-[10px] font-bold text-slate-400">Perempuan</span>
                                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">{member.familyMembersFemale || 0}</span>
                                </div>
                            </div>
                            <DetailRow label="Menetap di Luar Kupang" value={`${member.familyMembersOutside || 0} Orang`} />

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                                <DetailRow label="Total Anggota Sidi" value={`${member.familyMembersSidi || 0} Orang`} />
                                {member.familyMembersSidi > 0 && (
                                    <div className="ml-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700 space-y-1.5 mt-1 text-slate-500">
                                        <DetailRow label="Sidi (Laki-laki)" value={member.familyMembersSidiMale || 0} />
                                        <DetailRow label="Sidi (Perempuan)" value={member.familyMembersSidiFemale || 0} />
                                    </div>
                                )}
                                <DetailRow label="Belum Dibaptis" value={`${member.familyMembersNonBaptized || 0} Orang`} />
                                <DetailRow label="Belum Sidi" value={`${member.familyMembersNonSidi || 0} Orang`} />
                                {(member.familyMembersNonSidi || 0) > 0 && Array.isArray(member.familyMembersNonSidiNames) && member.familyMembersNonSidiNames.length > 0 && (
                                    <div className="ml-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700 space-y-1.5 mt-1 text-slate-500">
                                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Nama:</div>
                                        {member.familyMembersNonSidiNames.map((name: string, i: number) => (
                                            <span key={i} className="block text-xs font-medium text-slate-700 dark:text-slate-300">- {name || '-'}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
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
                        </div>
                    </div>

                    {/* Card 3 — Step 3: Profesi & Pelayanan */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1 lg:row-span-2 flex flex-col">
                        <SectionTitle icon="work" title="Profesi & Kepelayanan" />

                        {/* Backward compatibility for head of household profession */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-3 mt-1">
                            <DetailRow label="Pendidikan KK" value={member.educationLevel} />
                            <DetailRow label="Kategori Pekerjaan KK" value={member.jobCategory} />
                            {(member.interestAreas?.length > 0 || member.contributionTypes?.length > 0) && (
                                <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 bg-slate-100/50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-500 mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">local_fire_department</span>Minat Pelayanan KK</span>
                                        <TagList items={member.interestAreas} color="blue" />
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-bold text-slate-500 mb-2 flex items-center gap-1.5"><span className="material-symbols-outlined text-[14px]">handshake</span>Kontribusi KK</span>
                                        <TagList items={member.contributionTypes} color="green" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Anggota Keluarga Profesional</span>

                            {Array.isArray(member.professionalFamilyMembers) && member.professionalFamilyMembers.length > 0 ? (
                                <div className="grid grid-cols-1 gap-3">
                                    {member.professionalFamilyMembers.map((pfm: any, idx: number) => (
                                        <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700/50 pb-2 mb-2">
                                                <div>
                                                    <h5 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-primary text-sm">person</span> {pfm.name}
                                                    </h5>
                                                    {pfm.hasProfessionalSkill === 'Ya' && (
                                                        <div className="flex flex-wrap text-xs text-slate-500 gap-1 mt-1 font-medium">
                                                            <span>{pfm.position || '-'}</span>
                                                            <span>@</span>
                                                            <span className="text-slate-700 dark:text-slate-300">{pfm.workplace || '-'}</span>
                                                            <span className="mx-1">•</span>
                                                            <span className="text-primary">{pfm.yearsExperience || 0} Thn Exp</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`px-2 py-1 text-[9px] font-bold rounded uppercase ${pfm.churchServiceInterest === 'Ya' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {pfm.churchServiceInterest === 'Ya' ? 'Bersedia' : 'Ragu-ragu'}
                                                </span>
                                            </div>

                                            {pfm.hasProfessionalSkill === 'Ya' && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mt-3">
                                                    <div>
                                                        <span className="text-[10px] text-slate-400 block font-bold uppercase mb-1">Keahlian (Level {pfm.skillLevel || 1})</span>
                                                        <span className="text-slate-700 dark:text-slate-300 font-bold block mb-1">{pfm.skillType || '-'}</span>
                                                        <TagList items={pfm.specificSkills?.length ? pfm.specificSkills : undefined} color="violet" />
                                                    </div>
                                                    {pfm.churchServiceInterest === 'Ya' && (
                                                        <div>
                                                            <span className="text-[10px] text-slate-400 block font-bold uppercase mb-1">Area Pelayanan</span>
                                                            <span className="text-slate-700 dark:text-slate-300 font-bold block mb-1">{pfm.serviceInterestArea || '-'}</span>
                                                            <TagList items={pfm.contributionForm} color="blue" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/50 text-center text-xs text-slate-500 font-medium italic">
                                    Belum ada data keluarga profesional.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card 4 — Step 4: Pendidikan Anak */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1 flex flex-col">
                        <SectionTitle icon="school" title="Pendidikan Anak" />
                        <div className="mt-4 space-y-3">
                            <DetailRow label="Status Anak Bersekolah" value={member.education_schoolingStatus} />
                            {(member.education_inSchool_tk_paud > 0 || member.education_inSchool_sd > 0 || member.education_inSchool_smp > 0 || member.education_inSchool_sma > 0 || member.education_inSchool_university > 0) && (
                                <div className="mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Sedang Sekolah</span>
                                    </div>
                                    <div className="space-y-1.5 ml-1">
                                        <DetailRow label="TK/PAUD" value={member.education_inSchool_tk_paud || 0} />
                                        <DetailRow label="SD" value={member.education_inSchool_sd || 0} />
                                        <DetailRow label="SMP" value={member.education_inSchool_smp || 0} />
                                        <DetailRow label="SMA" value={member.education_inSchool_sma || 0} />
                                        <DetailRow label="Universitas" value={member.education_inSchool_university || 0} />
                                    </div>
                                </div>
                            )}
                            {(member.education_unemployed_sd > 0 || member.education_unemployed_smp > 0 || member.education_unemployed_sma > 0 || member.education_unemployed_university > 0) && (
                                <div className="mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Tidak Bersekolah</span>
                                    </div>
                                    <div className="space-y-1.5 ml-1">
                                        <DetailRow label="SD" value={member.education_unemployed_sd || 0} />
                                        <DetailRow label="SMP" value={member.education_unemployed_smp || 0} />
                                        <DetailRow label="SMA" value={member.education_unemployed_sma || 0} />
                                        <DetailRow label="Universitas" value={member.education_unemployed_university || 0} />
                                    </div>
                                </div>
                            )}
                            {(member.education_dropout_tk_paud > 0 || member.education_dropout_sd > 0 || member.education_dropout_smp > 0 || member.education_dropout_sma > 0 || member.education_dropout_university > 0) && (
                                <div className="mt-2 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">Putus Sekolah</span>
                                    </div>
                                    <div className="space-y-1.5 ml-1">
                                        <DetailRow label="TK/PAUD" value={member.education_dropout_tk_paud || 0} />
                                        <DetailRow label="SD" value={member.education_dropout_sd || 0} />
                                        <DetailRow label="SMP" value={member.education_dropout_smp || 0} />
                                        <DetailRow label="SMA" value={member.education_dropout_sma || 0} />
                                        <DetailRow label="Universitas" value={member.education_dropout_university || 0} />
                                    </div>
                                </div>
                            )}
                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 space-y-3">
                                <DetailRow label="Anak Sudah Bekerja" value={`${member.education_working || 0} Orang`} />
                                {member.education_hasScholarship === 'Ya' ? (
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                        <DetailRow label="Penerima Beasiswa" value={`Ya - ${member.education_scholarshipType === 'Beasiswa Lainnya' ? member.education_scholarshipTypeOther : member.education_scholarshipType}`} />
                                    </div>
                                ) : (
                                    <DetailRow label="Penerima Beasiswa" value="Tidak" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card 5 — Step 5: Ekonomi & Aset */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1 md:row-span-2 flex flex-col">
                        <SectionTitle icon="paid" title="Ekonomi & Aset" />
                        <div className="mt-4 space-y-3">
                            <DetailRow label="Pekerjaan Kep. Keluarga" value={member.economics_headOccupation} />
                            <DetailRow label="Pekerjaan Pasangan" value={member.economics_spouseOccupation} />

                            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20 mt-2">
                                <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1">Range Pendapatan</span>
                                <span className="text-lg font-black text-emerald-700 dark:text-emerald-500">{member.economics_incomeRange || "-"}</span>
                                {member.economics_incomeRangeDetailed && (
                                    <div className="text-xs font-bold text-emerald-600 mt-1">{member.economics_incomeRangeDetailed}</div>
                                )}
                            </div>

                            {totalExpense > 0 && (
                                <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20 mt-2">
                                    <span className="block text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 mb-1">Pengeluaran & Beban Rutin</span>
                                    <span className="text-lg font-black text-amber-700 dark:text-amber-500">{(totalExpense + (member.economics_electricity_total_cost || 0)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })}/bln</span>
                                    <div className="mt-2 space-y-1">
                                        <DetailRow label="Pengeluaran Pangan" value={member.economics_expense_food ? `Rp ${member.economics_expense_food.toLocaleString()}` : "-"} />
                                        <DetailRow label="Pengeluaran Utilitas" value={member.economics_expense_utilities ? `Rp ${member.economics_expense_utilities.toLocaleString()}` : "-"} />
                                        <DetailRow label="Pengeluaran Pendidikan" value={member.economics_expense_education ? `Rp ${member.economics_expense_education.toLocaleString()}` : "-"} />
                                        <DetailRow label="Pengeluaran Non-Pangan II" value={member.economics_expense_nonPanganII ? `Rp ${member.economics_expense_nonPanganII.toLocaleString()}` : "-"} />
                                        <DetailRow label="Cicilan/Utang" value={member.economics_expense_loan ? `Rp ${member.economics_expense_loan.toLocaleString()}` : "-"} />
                                        <DetailRow label="Aktivitas Peribadatan" value={member.economics_expense_worship ? `Rp ${member.economics_expense_worship.toLocaleString()}` : "-"} />
                                        <DetailRow label="Biaya Tak Terduga" value={member.economics_expense_unexpected ? `Rp ${member.economics_expense_unexpected.toLocaleString()}` : "-"} />
                                        <DetailRow label="Pengeluaran Lainnya" value={member.economics_expense_other ? `Rp ${member.economics_expense_other.toLocaleString()}` : "-"} />
                                        {member.economics_electricity_total_cost > 0 && <DetailRow label="Biaya Listrik" value={`Rp ${member.economics_electricity_total_cost.toLocaleString()}`} />}
                                    </div>
                                </div>
                            )}

                            {member.economics_hasBusiness === 'Ya' && (
                                <div className="mt-2 pt-3 border-t border-slate-200 dark:border-slate-700">
                                    <span className="block text-[11px] font-black uppercase text-slate-500 mb-3 text-primary tracking-wider">Info Usaha (UMKM)</span>

                                    <div className="space-y-4">
                                        {/* Kolom 1: Basic Info */}
                                        <div className="space-y-2">
                                            <DetailRow label="Nama Usaha" value={member.economics_businessName} />
                                            <DetailRow label="Jenis Usaha" value={member.economics_businessType} />
                                            <DetailRow label="Lama Usaha" value={member.economics_businessDuration} />
                                            <DetailRow label="Status Usaha" value={member.economics_businessStatus} />
                                            <DetailRow label="Lokasi Usaha" value={member.economics_businessLocation} />
                                            <DetailRow label="Jumlah Pekerja" value={member.economics_businessEmployeeCount} />
                                        </div>

                                        {/* Kolom 2: Financial & Market */}
                                        <div className="space-y-2 p-3 bg-slate-100/50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                            <DetailRow label="Modal Awal" value={member.economics_businessCapital ? `Rp ${Number(member.economics_businessCapital).toLocaleString('id-ID')}` : "-"} />
                                            <DetailRow label="Sumber Modal" value={member.economics_businessCapitalSource} />
                                            <DetailRow label="Omzet Bulanan" value={member.economics_businessTurnover} />

                                            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                                                <DetailRow label="Izin Usaha" value={Array.isArray(member.economics_businessPermit) ? member.economics_businessPermit.join(', ') : "-"} />
                                                <DetailRow label="Metode Pemasaran" value={Array.isArray(member.economics_businessMarketing) ? member.economics_businessMarketing.join(', ') : "-"} />
                                                <DetailRow label="Wilayah Pemasaran" value={member.economics_businessMarketArea} />
                                            </div>
                                        </div>

                                        {/* Kolom 3: Challenges & Support Need */}
                                        {(member.economics_businessIssues?.length > 0 || member.economics_businessNeeds?.length > 0) && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                                {member.economics_businessIssues?.length > 0 && (
                                                    <div className="p-3 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                                                        <span className="block text-[10px] uppercase font-bold text-red-600 dark:text-red-400 mb-2">Tantangan Usaha</span>
                                                        <TagList items={[member.economics_businessIssues].filter(Boolean)} color="red" />
                                                    </div>
                                                )}
                                                {member.economics_businessNeeds?.length > 0 && (
                                                    <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                                                        <span className="block text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 mb-2">Kebutuhan Dukungan</span>
                                                        <TagList items={[member.economics_businessNeeds].filter(Boolean)} color="blue" />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Kolom 4: Sharing & Training */}
                                        {(member.economics_businessSharing === 'Ya' || member.economics_businessTraining?.length > 0) && (
                                            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="block text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Networking & Pelatihan</span>
                                                    {member.economics_businessSharing === 'Ya' && (
                                                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-700 tracking-wide uppercase">Bersedia Berbagi Edukasi</span>
                                                    )}
                                                </div>
                                                {member.economics_businessTraining?.length > 0 && (
                                                    <div className="pt-1 border-t border-emerald-100/50 dark:border-emerald-800/30">
                                                        <span className="text-[10px] block font-medium text-emerald-700/70 mb-1">Topik Pelatihan Diminati:</span>
                                                        <TagList items={[member.economics_businessTraining].filter(Boolean)} color="green" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <DetailRow label="Status Rumah" value={member.economics_houseStatus} />
                                <DetailRow label="Jenis Rumah" value={member.economics_houseType} />
                                {member.economics_houseType === 'Permanen' && <DetailRow label="Status IMB" value={member.economics_houseIMB} />}
                                <DetailRow label="Status Tanah" value={member.economics_landStatus} />
                                <DetailRow label="Sumber Air" value={member.economics_waterSource} />

                                {Array.isArray(member.economics_electricity_capacities) && member.economics_electricity_capacities.length > 0 && (
                                    <div className="mt-2">
                                        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Daya Listrik Terpasang</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {member.economics_electricity_capacities.map((cap: string, i: number) => {
                                                const map: any = { '450': '450_qty', '900': '900_qty', '1300/1200': '1200_qty', '2200': '2200_qty', '>=5000': '5000_qty' };
                                                const qty = (member as any)[`economics_electricity_${map[cap]}`];
                                                return <span key={i} className="px-2 py-1 text-[10px] font-bold rounded-lg border bg-yellow-50 text-yellow-600 border-yellow-200">{cap} VA {qty ? `(${qty})` : ''}</span>;
                                            })}
                                        </div>
                                    </div>
                                )}

                                {member.economics_hasAssets === 'Ya' && (
                                    <div className="mt-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="block text-[10px] uppercase font-bold text-slate-400">Aset Tersedia</span>
                                            <span className="text-[10px] font-bold text-slate-500">Total: {member.economics_totalAssets || 0} Unit</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {Array.isArray(member.economics_assets) && member.economics_assets.map((asset: string, i: number) => {
                                                const map: any = { 'Motor': 'motor_qty', 'Mobil': 'mobil_qty', 'Kulkas': 'kulkas_qty', 'Laptop/Komputer': 'laptop_qty', 'Televisi': 'tv_qty', 'Internet/Indihome': 'internet_qty', 'Lahan Pertanian': 'lahan_qty' };
                                                const qty = (member as any)[`economics_asset_${map[asset]}`];
                                                return <span key={i} className="px-2 py-1 text-[10px] font-bold rounded-lg border bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-800">{asset} {qty ? `(${qty})` : ''}</span>;
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card 6 — Step 6: Kesehatan */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm lg:col-span-1 flex flex-col">
                        <SectionTitle icon="health_and_safety" title="Kesehatan" />
                        <div className="mt-4 space-y-3">
                            <DetailRow label="Sakit 30 Hari Terakhir" value={member.health_sick30Days} />
                            <DetailRow label="Pengobatan Teratur" value={member.health_regularTreatment} />
                            <DetailRow label="BPJS Kesehatan" value={member.health_hasBPJS} />
                            {member.health_hasBPJS === 'Tidak' && member.health_bpjsNonParticipants && (
                                <div className="ml-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700 space-y-1 mt-1 text-slate-500 mb-2">
                                    <div className="text-[10px] uppercase font-bold text-red-500 dark:text-red-400">Anggota Tanpa BPJS:</div>
                                    <span className="block text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{member.health_bpjsNonParticipants}</span>
                                </div>
                            )}
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
                                    <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded border border-amber-100 dark:border-amber-900/20 flex flex-col gap-2">
                                        <div className="flex items-center gap-1.5 justify-between">
                                            <span className="text-[10px] uppercase font-bold text-amber-600">Disabilitas</span>
                                            {member.health_disabilityDouble && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-600">Ganda/Multi</span>}
                                        </div>
                                        {Array.isArray(member.health_disabilityPhysical) && member.health_disabilityPhysical.length > 0 && (
                                            <div>
                                                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5 mt-1">Fisik</span>
                                                <TagList items={member.health_disabilityPhysical} color="red" />
                                            </div>
                                        )}
                                        {Array.isArray(member.health_disabilityIntellectual) && member.health_disabilityIntellectual.length > 0 && (
                                            <div>
                                                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5 mt-1">Intelektual</span>
                                                <TagList items={member.health_disabilityIntellectual} color="violet" />
                                            </div>
                                        )}
                                        {Array.isArray(member.health_disabilityMental) && member.health_disabilityMental.length > 0 && (
                                            <div>
                                                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5 mt-1">Mental</span>
                                                <TagList items={member.health_disabilityMental} color="blue" />
                                            </div>
                                        )}
                                        {Array.isArray(member.health_disabilitySensory) && member.health_disabilitySensory.length > 0 && (
                                            <div>
                                                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5 mt-1">Sensorik</span>
                                                <TagList items={member.health_disabilitySensory} color="green" />
                                            </div>
                                        )}
                                    </div>
                                ) : <DetailRow label="Disabilitas" value="Tidak" />}
                            </div>
                        </div>
                    </div>
                </div>

            </div> {/* Closing Scrollable Area */}

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 z-20">
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
