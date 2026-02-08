import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { toast } from '../components/ui/Toast';

import { AdminLayout } from '../components/layouts/AdminLayout';
import { useMemberData, calculateAge } from '../hooks/useMemberData';
import { useFamilyData } from '../hooks/useFamilyData';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { useRef, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AdminReports = () => {
    const { members, stats: memberStats } = useMemberData();
    const { families } = useFamilyData();
    const reportRef = useRef<HTMLDivElement>(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Drill-down State
    const [drillDownSector, setDrillDownSector] = useState<string | null>(null);
    const sectorChartRef = useRef<any>(null);

    // 1. Age Distribution Logic
    const ageData = useMemo(() => {
        const categories = { 'Anak (0-12)': 0, 'Remaja (13-17)': 0, 'Pemuda (18-30)': 0, 'Dewasa (31-60)': 0, 'Lansia (60+)': 0 };
        members.forEach(m => {
            const age = calculateAge(m.birthDate);
            if (age <= 12) categories['Anak (0-12)']++;
            else if (age <= 17) categories['Remaja (13-17)']++;
            else if (age <= 30) categories['Pemuda (18-30)']++;
            else if (age <= 60) categories['Dewasa (31-60)']++;
            else categories['Lansia (60+)']++;
        });
        return {
            labels: Object.keys(categories),
            data: Object.values(categories)
        };
    }, [members]);

    // 2. Growth Logic (Filtered by Selected Year)
    const growthData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const counts = new Array(12).fill(0);

        // Filter members by selected year
        members.forEach(m => {
            const date = new Date(m.createdAt);
            if (date.getFullYear() === selectedYear) {
                const monthIdx = date.getMonth();
                counts[monthIdx]++;
            }
        });

        // Make cumulative for the year
        let runningTotal = 0;
        const cumulative = counts.map((count) => {
            runningTotal += count;
            return runningTotal;
        });

        return {
            labels: months,
            data: cumulative,
            monthly: counts,
            totalForYear: runningTotal
        };
    }, [members, selectedYear]);

    // 3. Sector Analysis Logic
    const sectorData = useMemo(() => {
        // Compare Family count vs Member count per sector
        const sectors = Object.keys(memberStats.distributions.sector);
        const familyCounts = sectors.map(s => families.filter(f => f.sector === s).length);
        const memberCounts = sectors.map(s => memberStats.distributions.sector[s] || 0);

        return {
            labels: sectors,
            datasets: [
                {
                    label: 'Jumlah KK',
                    data: familyCounts,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                },
                {
                    label: 'Jumlah Anggota',
                    data: memberCounts,
                    backgroundColor: '#10b981',
                    borderRadius: 4
                }
            ]
        };
    }, [memberStats, families]);

    // 4. Recent Logs Logic (Filtered by Selected Year)
    const recentLogs = useMemo(() => {
        const memberLogs = members.map(m => ({
            type: 'member',
            date: new Date(m.createdAt),
            user: 'Admin',
            action: `Anggota Baru: ${m.name}`,
            status: 'Sukses'
        }));

        const familyLogs = families.map(f => ({
            type: 'family',
            date: new Date(f.createdAt),
            user: 'Sekretariat',
            action: `KK Baru: ${f.head}`,
            status: 'Sukses'
        }));

        return [...memberLogs, ...familyLogs]
            .filter(log => log.date.getFullYear() === selectedYear)
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 10); // Show top 10 for report
    }, [members, families, selectedYear]);

    const handleExportExcel = () => {
        const wb = XLSX.utils.book_new();

        // Sheet 1: Summary Statistics
        const summaryData = [
            ['Laporan Statistik Jemaat GMIT'],
            ['Tahun', selectedYear],
            ['Tanggal Cetak', new Date().toLocaleDateString('id-ID')],
            [''],
            ['Ringkasan Sektor'],
            ['Sektor', 'Jumlah KK', 'Jumlah Anggota', 'Rata-rata Anggota/KK'],
            ...sectorData.labels.map((s, i) => [
                s,
                sectorData.datasets[0].data[i],
                sectorData.datasets[1].data[i],
                (sectorData.datasets[1].data[i] / (sectorData.datasets[0].data[i] || 1)).toFixed(2)
            ])
        ];
        const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Ringkasan");

        // Sheet 2: Member Data (All)
        const memberRows = members.map(m => ({
            ID: m.id,
            Nama: m.name,
            Sektor: m.sector,
            'Jenis Kelamin': m.gender,
            'Tanggal Lahir': new Date(m.birthDate).toLocaleDateString('id-ID'),
            Usia: calculateAge(m.birthDate),
            Status: m.statusGerejawi
        }));
        const wsMembers = XLSX.utils.json_to_sheet(memberRows);
        XLSX.utils.book_append_sheet(wb, wsMembers, "Data Anggota");

        // Sheet 3: Family Data
        const familyRows = families.map(f => ({
            'No KK': f.id,
            'Kepala Keluarga': f.head,
            Sektor: f.sector,
            'Jumlah Anggota': f.members,
            Alamat: f.address,
            Status: f.status
        }));
        const wsFamilies = XLSX.utils.json_to_sheet(familyRows);
        XLSX.utils.book_append_sheet(wb, wsFamilies, "Data KK");

        XLSX.writeFile(wb, `Data_Jemaat_GMIT_${selectedYear}.xlsx`);
        toast.success("Data berhasil diexport ke Excel!");
    };

    const handleSectorClick = (_event: any, elements: any[]) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            const sectorName = sectorData.labels[index];
            setDrillDownSector(sectorName);
        }
    };

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;

        try {
            toast.info("Sedang membuat PDF...");

            // 1. Capture Dashboard Image
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            // Page 1: Visual Dashboard
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // Page 2: Detailed Data Tables
            pdf.addPage();

            // Header Page 2
            pdf.setFontSize(16);
            pdf.text(`Detail Laporan Statistik - Tahun ${selectedYear}`, 14, 20);
            pdf.setFontSize(10);
            pdf.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 26);

            // Table 1: Sector Summary
            (pdf as any).autoTable({
                startY: 35,
                head: [['Sektor', 'Jumlah KK', 'Jumlah Anggota', 'Rata-rata/KK']],
                body: sectorData.labels.map((sector, i) => [
                    sector,
                    sectorData.datasets[0].data[i],
                    sectorData.datasets[1].data[i],
                    (sectorData.datasets[1].data[i] / (sectorData.datasets[0].data[i] || 1)).toFixed(1)
                ]),
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246] }
            });

            // Table 2: New Members List (Top 20 of selected year)
            const yearMembers = members
                .filter(m => new Date(m.createdAt).getFullYear() === selectedYear)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            // @ts-ignore
            (pdf as any).autoTable({
                // @ts-ignore
                startY: (pdf as any).lastAutoTable.finalY + 15,
                head: [['Tanggal', 'Nama', 'Sektor', 'Usia', 'Status']],
                body: yearMembers.map(m => [
                    new Date(m.createdAt).toLocaleDateString('id-ID'),
                    m.name,
                    m.sector,
                    calculateAge(m.birthDate),
                    m.statusGerejawi
                ]),
                theme: 'striped',
                headStyles: { fillColor: [16, 185, 129] }
            });

            // Footer
            const pageCount = pdf.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.text('Sistem Database GMIT - Dokumen Rahasia', 14, pdf.internal.pageSize.getHeight() - 10);
                pdf.text(`Halaman ${i} dari ${pageCount}`, pdf.internal.pageSize.getWidth() - 30, pdf.internal.pageSize.getHeight() - 10);
            }

            pdf.save(`Laporan_Lengkap_GMIT_${selectedYear}.pdf`);
            toast.success("Laporan lengkap berhasil didownload!");
        } catch (error) {
            console.error(error);
            toast.error("Gagal membuat PDF");
        }
    };

    return (
        <AdminLayout title="Laporan & Statistik">
            <div className="flex flex-col gap-6" ref={reportRef}>
                {/* Header Section */}
                <div className="flex justify-between items-end bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Laporan & Analisis</h1>
                        <p className="text-slate-500 text-sm">Data statistik & Operasional Jemaat</p>
                    </div>
                    <div className="flex gap-2 print:hidden" data-html2canvas-ignore>
                        <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            className="h-10 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm focus:ring-2 focus:ring-primary outline-none shadow-sm cursor-pointer"
                        >
                            <option value={2023}>Tahun 2023</option>
                            <option value={2024}>Tahun 2024</option>
                            <option value={2025}>Tahun 2025</option>
                        </select>
                        <button onClick={handleExportExcel} className="flex h-10 items-center gap-2 px-4 rounded-lg bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20">
                            <span className="material-symbols-outlined text-lg">table_view</span>
                            Export Excel
                        </button>
                        <button onClick={handleDownloadPDF} className="flex h-10 items-center gap-2 px-4 rounded-lg bg-primary text-slate-900 font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Report Section 1: Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age Distribution Chart */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Distribusi Usia</h3>
                        </div>
                        <div className="flex-1 relative min-h-[250px]">
                            <Bar
                                data={{
                                    labels: ageData.labels,
                                    datasets: [{
                                        label: 'Jml Jemaat',
                                        data: ageData.data,
                                        backgroundColor: ['#93c5fd', '#60a5fa', '#3b82f6', '#22c55e', '#16a34a', '#f97316', '#ef4444'],
                                        borderRadius: 6,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                        x: { grid: { display: false } }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Sector Density Chart (New) */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Kepadatan Sektor <span className="text-xs font-normal text-slate-500">(Klik untuk detail)</span></h3>
                        </div>
                        <div className="flex-1 relative min-h-[250px]">
                            <Bar
                                ref={sectorChartRef}
                                data={sectorData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { position: 'top' as const } },
                                    scales: {
                                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
                                        x: { grid: { display: false } }
                                    },
                                    onClick: handleSectorClick
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Growth Chart */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                    <div className="mb-6 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pertumbuhan Jemaat ({selectedYear})</h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><div className="size-2 rounded-full bg-yellow-500"></div> Akumulatif</span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full relative">
                        <Line
                            data={{
                                labels: growthData.labels,
                                datasets: [{
                                    label: 'Total Pertumbuhan',
                                    data: growthData.data,
                                    borderColor: '#eab308',
                                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                                    tension: 0.4,
                                    fill: true
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: 'rgba(0,0,0,0.05)' } },
                                    x: { grid: { display: false } }
                                }
                            }}
                        />
                        <div className="absolute top-0 right-0 text-xl font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-lg">
                            Total: +{growthData.totalForYear}
                        </div>
                    </div>
                </div>

                {/* Recent Logs (Filtered) */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">Log Aktivitas ({selectedYear})</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                            <tr>
                                <th className="px-6 py-3 font-bold">Waktu</th>
                                <th className="px-6 py-3 font-bold">User</th>
                                <th className="px-6 py-3 font-bold">Aktivitas</th>
                                <th className="px-6 py-3 font-bold text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {recentLogs.map((log, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-6 py-3 text-slate-600 dark:text-slate-400">
                                        <span className="font-bold text-slate-900 dark:text-white">{log.date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span> <span className="text-xs text-slate-400">/ {log.date.toLocaleDateString('id-ID')}</span>
                                    </td>
                                    <td className="px-6 py-3 text-slate-900 dark:text-white font-medium">{log.user}</td>
                                    <td className="px-6 py-3 text-slate-600 dark:text-slate-300">{log.action}</td>
                                    <td className="px-6 py-3 text-right">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">{log.status}</span>
                                    </td>
                                </tr>
                            ))}
                            {recentLogs.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Belum ada aktivitas tercatat pada tahun {selectedYear}.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Drill-down Modal */}
                {drillDownSector && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[80vh] flex flex-col animate-scale-in">
                            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-xl font-bold">Detail Sektor: {drillDownSector}</h3>
                                <button onClick={() => setDrillDownSector(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto">
                                <div className="mb-4 grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                        <div className="text-sm text-slate-500">Jumlah KK</div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                                            {families.filter(f => f.sector === drillDownSector).length}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                        <div className="text-sm text-slate-500">Jumlah Anggota</div>
                                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                                            {members.filter(m => m.sector === drillDownSector).length}
                                        </div>
                                    </div>
                                </div>
                                <h4 className="font-bold mb-3 text-sm text-slate-500 uppercase tracking-wider">Daftar Anggota</h4>
                                <div className="space-y-2">
                                    {members.filter(m => m.sector === drillDownSector).map(member => (
                                        <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${member.gender === 'Laki-laki' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                                                {member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-900 dark:text-white">{member.name}</div>
                                                <div className="text-xs text-slate-500">{calculateAge(member.birthDate)} Tahun • {member.statusGerejawi}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl flex justify-end">
                                <button onClick={() => setDrillDownSector(null)} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>


        </AdminLayout>
    );
};

export default AdminReports;
