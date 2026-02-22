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
    mainMemberSector: string;
    mainMemberKkNumber?: string;
}

const AdminFamilyData = () => {
    const [familyMembers, setFamilyMembers] = useState<FamilyMemberExtend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSector, setFilterSector] = useState("Semua");

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

        // 2. Filter Sector
        if (filterSector !== "Semua") {
            result = result.filter(f => f.mainMemberSector === filterSector);
        }

        return result;
    }, [familyMembers, searchTerm, filterSector]);

    // Derived Logic for Pagination
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handlePrintPDF = () => {
        const doc = new jsPDF('landscape');

        doc.setFontSize(18);
        doc.text("Data Keluarga Profesional Terampil - GMIT Efata Liliba", 14, 22);
        doc.setFontSize(11);
        doc.text(`Total Anggota: ${filteredMembers.length} | Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

        const tableColumn = ["Nama Anggota", "Terkait Jemaat", "Sektor", "Keahlian", "Minat Pelayanan", "Posisi/Pekerjaan"];
        const tableRows = filteredMembers.map(m => [
            m.name,
            m.mainMemberName + (m.mainMemberKkNumber ? ` (KK: ${m.mainMemberKkNumber})` : ''),
            m.mainMemberSector,
            m.skillType,
            m.serviceInterestArea || '-',
            m.position || '-'
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
        const headers = ["Nama Anggota", "Terkait Jemaat (Kepala)", "Nomor KK", "Sektor", "Jenis Keahlian", "Minat Pelayanan", "Pekerjaan"];
        const rows = filteredMembers.map(m =>
            `"${m.name}","${m.mainMemberName}","${m.mainMemberKkNumber || ''}","${m.mainMemberSector}","${m.skillType}","${m.serviceInterestArea || ''}","${m.position || ''}"`
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
                            value={filterSector}
                            onChange={(e) => setFilterSector(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border-none text-slate-600 dark:text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary/50 cursor-pointer"
                        >
                            <option value="Semua">Semua Sektor</option>
                            <option value="Efata">Sektor Efata</option>
                            <option value="Betel">Sektor Betel</option>
                            <option value="Sion">Sektor Sion</option>
                            <option value="Eden">Sektor Eden</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 font-bold border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nama Anggota Keluarga</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Jemaat Terkait (No KK)</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Keahlian</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Minat Pelayanan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        Loading data...
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((member) => (
                                    <tr key={member._id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{member.name}</p>
                                            <p className="text-xs text-slate-500">{member.position || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-700">{member.mainMemberName}</p>
                                            <p className="text-xs text-slate-500">Sektor {member.mainMemberSector} • KK: {member.mainMemberKkNumber || '-'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">{member.skillType}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold">{member.serviceInterestArea || '-'}</span>
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
        </AdminLayout>
    );
};

export default AdminFamilyData;
