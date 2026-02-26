import { useState, useEffect, useMemo } from 'react';
import { toast } from '../components/ui/Toast';
import { AdminLayout } from '../components/layouts/AdminLayout';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ProfessionalFamilyMember } from '../types';

interface FamilyMemberExtend extends ProfessionalFamilyMember {
    _id: string; // generated client-side for keys
    mainMemberId: string;
    mainMemberName: string;
    mainMemberLingkungan: string;
    mainMemberKkNumber?: string;
}

const AdminFamilyData = () => {
    const [familyMembers, setFamilyMembers] = useState<FamilyMemberExtend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterLingkungan, setFilterLingkungan] = useState("Semua");
    const [selectedMember, setSelectedMember] = useState<FamilyMemberExtend | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/family-members');
                if (!res.ok) throw new Error("Gagal mengambil data");
                const data = await res.json();

                // Assign unique id
                const structuredData = data.map((item: any, idx: number) => ({
                    ...item,
                    _id: `fam-mem-${idx}-${new Date().getTime()}`
                }));

                setFamilyMembers(structuredData);
            } catch (error) {
                console.error(error);
                toast.error("Gagal mengambil data keluarga profesional");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredMembers = useMemo(() => {
        let result = [...familyMembers];

        // 1. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(f =>
                f.name.toLowerCase().includes(lowerTerm) ||
                f.skillType.toLowerCase().includes(lowerTerm) ||
                f.mainMemberName.toLowerCase().includes(lowerTerm) ||
                (f.mainMemberKkNumber || "").toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Filter Lingkungan
        if (filterLingkungan !== "Semua") {
            result = result.filter(f => f.mainMemberLingkungan === filterLingkungan);
        }

        return result;
    }, [familyMembers, searchTerm, filterLingkungan]);

    // Derived Logic for Pagination
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handlePrintPDF = () => {
        const doc = new jsPDF('landscape');

        doc.setFontSize(18);
        doc.text("Data Keluarga Profesional Terampil - GMIT Emaus Liliba", 14, 22);
        doc.setFontSize(11);
        doc.text(`Total Anggota: ${filteredMembers.length} | Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

        const tableColumn = ["Nama Anggota", "Terkait Jemaat (Ling)", "Keahlian", "Tempat Kerja", "Minat Pelayanan"];
        const tableRows = filteredMembers.map(m => [
            m.name,
            m.mainMemberName + (m.mainMemberKkNumber ? ` (KK: ${m.mainMemberKkNumber})` : '') + ` - Ling. ${m.mainMemberLingkungan || '-'}`,
            `${m.skillType} ${m.skillLevel ? `(Lv ${m.skillLevel})` : ''}`,
            m.workplace || '-',
            m.serviceInterestArea || '-',
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 163, 74] }
        });

        doc.save("data_keluarga_profesional.pdf");
        toast.success("PDF berhasil dicetak!");
    };

    const handleExport = () => {
        const headers = ["Nama Anggota", "Terkait Jemaat (Kepala)", "Nomor KK", "Lingkungan", "Jenis Keahlian", "Tingkat Keahlian", "Tempat Kerja", "Jabatan", "Lama Bekerja", "Bidang Minat Pelayanan", "Keahlian Spesifik", "Bentuk Kontribusi", "Bersedia Pelayanan"];
        const rows = filteredMembers.map(m =>
            `"${m.name}","${m.mainMemberName}","${m.mainMemberKkNumber || ''}","${m.mainMemberLingkungan || ''}","${m.skillType}","${m.skillLevel}","${m.workplace || ''}","${m.position || ''}","${m.yearsExperience || ''}","${m.serviceInterestArea || ''}","${(m.specificSkills || []).join(', ')}","${(m.contributionForm || []).join(', ')}","${m.churchServiceInterest}"`
        );
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data_keluarga_profesional.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Data berhasil diexport!");
    };

    return (
        <AdminLayout title="Data Keluarga Profesional">
            <div className="flex flex-wrap justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Data Profesional Keluarga</h1>
                    <p className="text-slate-500 text-sm">Kelola data anggota keluarga yang memiliki keterampilan / potensi profesional.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <button onClick={handlePrintPDF} className="flex h-10 items-center gap-2 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">print</span>
                        Cetak PDF
                    </button>
                    <button onClick={handleExport} className="flex h-10 items-center gap-2 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined text-2xl">group</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Anggota</p>
                        <p className="text-3xl font-black text-slate-900">{familyMembers.length}</p>
                    </div>
                </div>
                <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                        <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Siap Pelayanan</p>
                        <p className="text-3xl font-black text-slate-900">{familyMembers.filter(m => ['Ya', 'Ya, bersedia aktif', 'Ya, bila dibutuhkan', 'Aktif', 'Active'].includes(m.churchServiceInterest)).length}</p>
                    </div>
                </div>
                <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                        <span className="material-symbols-outlined text-2xl">psychiatry</span>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Level Mahir (Lv 3)</p>
                        <p className="text-3xl font-black text-slate-900">{familyMembers.filter(m => m.skillLevel === '3').length}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 shadow-sm mb-6 pb-2">
                <div className="p-4 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Cari nama anggota, jemaat utama, atau keahlian..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-2 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">filter_list</span>
                        <select
                            value={filterLingkungan}
                            onChange={(e) => setFilterLingkungan(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border-none text-slate-600 dark:text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary/50 cursor-pointer"
                        >
                            <option value="Semua">Semua Lingkungan</option>
                            {['1', '2', '3', '4', '5', '6', '7', '8'].map(l => (
                                <option key={l} value={l}>Lingkungan {l}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 font-bold border-b border-slate-200 dark:border-slate-700">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nama & Profil</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Jemaat Terkait</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Keahlian (Level)</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Pekerjaan</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Minat Pelayanan</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        Loading data...
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((member) => (
                                    <tr key={member._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-700 dark:text-slate-300">{member.mainMemberName}</p>
                                            <p className="text-xs text-slate-500">Ling. {member.mainMemberLingkungan || '-'} • KK: {member.mainMemberKkNumber || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
                                                <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold rounded-lg">{member.skillType || '-'}</span>
                                                {member.skillLevel && <span className="text-[10px] uppercase font-bold text-slate-400">Level {member.skillLevel}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{member.position || '-'}</p>
                                            <p className="text-xs text-slate-500">{member.workplace || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{member.serviceInterestArea || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => setSelectedMember(member)} className="text-sm font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors">Detail</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        Tidak ada data yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center mt-auto">
                    <p className="text-sm text-slate-500">Menampilkan {currentItems.length} dari {filteredMembers.length} data</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                        >
                            Sebelumnya
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`size-8 text-sm font-bold rounded-lg ${currentPage === i + 1 ? 'bg-primary text-slate-900' : 'text-slate-500 hover:bg-slate-100'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg disabled:opacity-50"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedMember! && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <span className="material-symbols-outlined">person</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1">{selectedMember!.name}</h2>
                                    <p className="text-xs font-bold text-slate-500 tracking-wider">Keluarga: {selectedMember!.mainMemberName} (Lingkungan {selectedMember!.mainMemberLingkungan})</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedMember(null)} className="size-8 flex items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors">
                                <span className="material-symbols-outlined text-xl">close</span>
                            </button>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Section 1: Profil Keahlian */}
                                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-lg">school</span> Profil Keahlian
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jenis Keahlian</p>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedMember!.skillType || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tingkat Keahlian</p>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedMember!.skillLevel ? `Level ${selectedMember!.skillLevel} ${selectedMember!.skillLevel === '1' ? '(Dasar)' : selectedMember!.skillLevel === '2' ? '(Menengah)' : '(Mahir)'}` : '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Keahlian Spesifik</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {selectedMember!.specificSkills && selectedMember!.specificSkills.length > 0 ? selectedMember!.specificSkills.map((s, i) => (
                                                    <span key={i} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-md">{s}</span>
                                                )) : <span className="text-sm text-slate-500">-</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Pekerjaan */}
                                <div className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-500 text-lg">work</span> Pekerjaan
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Jabatan / Posisi</p>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedMember!.position || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tempat Kerja</p>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedMember!.workplace || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lama Bekerja</p>
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{selectedMember!.yearsExperience || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Minat Pelayanan */}
                                <div className="md:col-span-2 bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                                    <h3 className="text-sm font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-emerald-500 text-lg">volunteer_activism</span> Minat & Pelayanan
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mb-1">Kesediaan Pelayanan</p>
                                                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">{selectedMember!.churchServiceInterest || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mb-1">Bidang Minat Pelayanan</p>
                                                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{selectedMember!.serviceInterestArea || '-'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest mb-1">Bentuk Kontribusi</p>
                                            <div className="flex flex-col gap-1.5 mt-2">
                                                {selectedMember!.contributionForm && selectedMember!.contributionForm.length > 0 ? selectedMember!.contributionForm.map((c, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-white/50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-lg font-medium">
                                                        <span className="material-symbols-outlined text-emerald-500/70 text-sm">check_circle</span>
                                                        {c}
                                                    </div>
                                                )) : <span className="text-sm text-emerald-700/50">-</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </AdminLayout >
    );
};

export default AdminFamilyData;
