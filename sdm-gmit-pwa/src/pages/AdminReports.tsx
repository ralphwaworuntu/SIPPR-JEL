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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from '../components/ui/Toast';

import { AdminLayout } from '../components/layouts/AdminLayout';
import { useMemberData, calculateAge } from '../hooks/useMemberData';
import { useFamilyData } from '../hooks/useFamilyData';
import { useRef, useMemo, useState } from 'react';

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
    const [selectedYear, setSelectedYear] = useState(2026);

    // Drill-down State
    const [drillDownSector, setDrillDownSector] = useState<string | null>(null);
    const sectorChartRef = useRef<any>(null);

    // 1. Age Distribution Logic (Actually Sector/Kategorial Distribution)
    const ageData = useMemo(() => {
        const categories = {
            'Pemuda': 0,
            'Kaum Bapak': 0,
            'Kaum Perempuan': 0,
            'Lansia': 0
        };
        members.forEach(m => {
            const sector = m.sector;
            if (Object.keys(categories).includes(sector)) {
                categories[sector as keyof typeof categories]++;
            }
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

    const handleSectorClick = (_event: any, elements: any[]) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            const sectorName = sectorData.labels[index];
            setDrillDownSector(sectorName);
        }
    };

    // 5. Income Distribution
    const incomeData = useMemo(() => {
        const ranges: Record<string, number> = { '< 1 Juta': 0, '1-3 Juta': 0, '3-5 Juta': 0, '5-10 Juta': 0, '> 10 Juta': 0 };
        members.forEach(m => {
            const r = m.economics_incomeRange;
            if (r && ranges[r] !== undefined) ranges[r]++;
        });
        return { labels: Object.keys(ranges), data: Object.values(ranges) };
    }, [members]);

    // 6. BPJS Coverage
    const bpjsData = useMemo(() => {
        let pbi = 0, mandiri = 0, tidak = 0, ketenagakerjaan = 0;
        members.forEach(m => {
            if (m.health_hasBPJS === 'Ya - PBI') pbi++;
            else if (m.health_hasBPJS === 'Ya - Mandiri') mandiri++;
            else if (m.health_hasBPJS === 'Tidak') tidak++;
            if (m.health_hasBPJSKetenagakerjaan === 'Ya') ketenagakerjaan++;
        });
        return { labels: ['PBI', 'Mandiri', 'Tidak', 'Ketenagakerjaan'], data: [pbi, mandiri, tidak, ketenagakerjaan] };
    }, [members]);

    // 7. Housing Status
    const housingData = useMemo(() => {
        const statuses: Record<string, number> = {};
        members.forEach(m => {
            const s = m.economics_houseStatus;
            if (s) statuses[s] = (statuses[s] || 0) + 1;
        });
        return { labels: Object.keys(statuses), data: Object.values(statuses) };
    }, [members]);

    // 8. Social Insight Counters
    const socialInsights = useMemo(() => {
        let hasBusiness = 0, chronicSick = 0, disability = 0, diakonia = 0;
        members.forEach(m => {
            if (m.economics_hasBusiness === 'Ya') hasBusiness++;
            if (m.health_chronicSick === 'Ya') chronicSick++;
            if (m.health_hasDisability === 'Ya') disability++;
            if (m.diakonia_recipient === 'Ya') diakonia++;
        });
        return { hasBusiness, chronicSick, disability, diakonia };
    }, [members]);

    // Quick Reports Export Logic
    const generateQuickReport = (type: 'lansia' | 'sakit' | 'relawan' | 'sekolah' | 'diakonia') => {
        let title = '';
        let headers: string[] = ['No', 'Nama', 'Sektor', 'Rayon/Ling', 'Detail'];
        let data: string[][] = [];

        if (type === 'lansia') {
            title = 'Laporan Jemaat Kategori Lansia (> 60 Tahun)';
            const lansia = members.filter(m => calculateAge(m.birthDate) >= 60);
            data = lansia.map((m, i) => [(i + 1).toString(), m.name, m.sector || '-', `R${m.rayon} / L${m.lingkungan}`, `${calculateAge(m.birthDate)} Tahun`]);
        } else if (type === 'sakit') {
            title = 'Laporan Jemaat Sakit Kronis & Disabilitas';
            const sick = members.filter(m => m.health_chronicSick === 'Ya' || m.health_hasDisability === 'Ya');
            headers = ['No', 'Nama', 'Kondisi', 'Detail Gejala / Disabilitas'];
            data = sick.map((m, i) => {
                const isChronic = m.health_chronicSick === 'Ya';
                const isDisability = m.health_hasDisability === 'Ya';
                let kondisi = [];
                let detail = [];
                if (isChronic) { kondisi.push('Sakit Kronis'); detail.push((m.health_chronicDisease || []).join(', ')); }
                if (isDisability) { kondisi.push('Disabilitas'); detail.push((m.health_disabilityPhysical || []).join(', ')); }
                return [(i + 1).toString(), m.name, kondisi.join(' & '), detail.join(' | ') || '-'];
            });
        } else if (type === 'relawan') {
            title = 'Laporan Potensi Relawan';
            const relawan = members.filter(m => m.willingnessToServe === 'Active');
            headers = ['No', 'Nama', 'Kontak', 'Minat', 'Kontribusi'];
            data = relawan.map((m, i) => [(i + 1).toString(), m.name, m.phone || '-', (m.interestAreas || []).join(', ') || '-', (m.contributionTypes || []).join(', ') || '-']);
        } else if (type === 'sekolah') {
            title = 'Rekap Anak Usia Sekolah (Sedang Bersekolah/Putus)';
            const students = members.filter(m => m.education_schoolingStatus === 'Ya');
            headers = ['No', 'Nama Wali/Keluarga', 'Total Anak', 'Pendidikan'];
            data = students.map((m, i) => {
                const total = (m.education_inSchool_sd || 0) + (m.education_inSchool_smp || 0) + (m.education_inSchool_sma || 0);
                return [(i + 1).toString(), m.name, `${total} Anak`, `SD/SMP/SMA Terkait`];
            });
        } else if (type === 'diakonia') {
            title = 'Daftar Penerima Diakonia';
            const diakoniaList = members.filter(m => m.diakonia_recipient === 'Ya');
            headers = ['No', 'Nama', 'Tahun', 'Jenis Diakonia', 'Pekerjaan (Eko)'];
            data = diakoniaList.map((m, i) => [(i + 1).toString(), m.name, m.diakonia_year || '-', m.diakonia_type || '-', m.economics_headOccupation || '-']);
        }

        if (data.length === 0) {
            toast.error(`Tidak ada data untuk laporan ${title}`);
            return;
        }

        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("GEREJA MASEHI INJILI DI TIMOR (GMIT)", 14, 15);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(title, 14, 22);
        doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, 28);
        doc.line(14, 32, 196, 32);

        autoTable(doc, {
            startY: 38,
            head: [headers],
            body: data,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42], textColor: 255 }, // slate-900
            styles: { fontSize: 8 },
            alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        doc.save(`${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().getFullYear()}.pdf`);
        toast.success(`Laporan ${title} berhasil dicetak.`);
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
                            <option value={2026}>Tahun 2026</option>
                        </select>

                    </div>
                </div>

                {/* Report Section 1: Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age Distribution Chart */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="mb-6 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Distribusi Kategorial</h3>
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

                {/* Report Section 3: Economy & Social */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Income Distribution */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="mb-4">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Distribusi Pendapatan</h3>
                            <p className="text-xs text-slate-500">Range pendapatan rumah tangga</p>
                        </div>
                        <div className="flex-1 relative min-h-[200px]">
                            <Bar
                                data={{
                                    labels: incomeData.labels,
                                    datasets: [{
                                        label: 'Jumlah KK',
                                        data: incomeData.data,
                                        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
                                        borderRadius: 6,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
                                }}
                            />
                        </div>
                    </div>

                    {/* Housing Status */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                        <div className="mb-4">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Status Kepemilikan Rumah</h3>
                            <p className="text-xs text-slate-500">Jenis kepemilikan tempat tinggal</p>
                        </div>
                        <div className="flex-1 relative min-h-[200px]">
                            <Bar
                                data={{
                                    labels: housingData.labels,
                                    datasets: [{
                                        label: 'Jumlah KK',
                                        data: housingData.data,
                                        backgroundColor: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
                                        borderRadius: 6,
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, x: { grid: { display: false } } }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* BPJS Coverage */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="mb-4">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">Cakupan BPJS</h3>
                        <p className="text-xs text-slate-500">Status kepesertaan jaminan sosial</p>
                    </div>
                    <div className="h-[200px]">
                        <Bar
                            data={{
                                labels: bpjsData.labels,
                                datasets: [{
                                    label: 'Jumlah',
                                    data: bpjsData.data,
                                    backgroundColor: ['#22c55e', '#3b82f6', '#ef4444', '#eab308'],
                                    borderRadius: 6,
                                }]
                            }}
                            options={{
                                indexAxis: 'y' as const,
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { x: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } }, y: { grid: { display: false } } }
                            }}
                        />
                    </div>
                </div>

                {/* Social Insight Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800 text-center">
                        <span className="material-symbols-outlined text-emerald-500 text-3xl mb-2">storefront</span>
                        <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{socialInsights.hasBusiness}</div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-500 font-bold mt-1">Punya Usaha</div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 p-5 rounded-2xl border border-red-100 dark:border-red-800 text-center">
                        <span className="material-symbols-outlined text-red-500 text-3xl mb-2">medical_services</span>
                        <div className="text-2xl font-black text-red-700 dark:text-red-400">{socialInsights.chronicSick}</div>
                        <div className="text-xs text-red-600 dark:text-red-500 font-bold mt-1">Penyakit Kronis</div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-5 rounded-2xl border border-amber-100 dark:border-amber-800 text-center">
                        <span className="material-symbols-outlined text-amber-500 text-3xl mb-2">accessible</span>
                        <div className="text-2xl font-black text-amber-700 dark:text-amber-400">{socialInsights.disability}</div>
                        <div className="text-xs text-amber-600 dark:text-amber-500 font-bold mt-1">Disabilitas</div>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-5 rounded-2xl border border-violet-100 dark:border-violet-800 text-center">
                        <span className="material-symbols-outlined text-violet-500 text-3xl mb-2">volunteer_activism</span>
                        <div className="text-2xl font-black text-violet-700 dark:text-violet-400">{socialInsights.diakonia}</div>
                        <div className="text-xs text-violet-600 dark:text-violet-500 font-bold mt-1">Penerima Diakonia</div>
                    </div>
                </div>

                {/* Laporan Cepat (Quick Action Reports) */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <div className="mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">dynamic_feed</span>
                            Laporan Operasional Cepat
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Hasilkan tabel data instan siap cetak (PDF) untuk kebutuhan rapat atau kunjungan komisi.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button onClick={() => generateQuickReport('lansia')} className="flex flex-col items-start p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group text-left">
                            <div className="size-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">elderly</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Daftar Lansia</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Tabel jemaat berusia di atas 60 tahun untuk program kunjungan.</p>
                        </button>

                        <button onClick={() => generateQuickReport('sakit')} className="flex flex-col items-start p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group text-left">
                            <div className="size-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">medical_information</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Sakit & Disabilitas</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Daftar jemaat yang sakit kronis atau memiliki disabilitas fisik.</p>
                        </button>

                        <button onClick={() => generateQuickReport('relawan')} className="flex flex-col items-start p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group text-left">
                            <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">diversity_3</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Potensi Relawan</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Daftar jemaat yang berstatus relawan aktif berserta minat layanannya.</p>
                        </button>

                        <button onClick={() => generateQuickReport('sekolah')} className="flex flex-col items-start p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group text-left">
                            <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Anak Usia Sekolah</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Pemetaan anak-anak keluarga jemaat yang berada di usia SD/SMP/SMA.</p>
                        </button>

                        <button onClick={() => generateQuickReport('diakonia')} className="flex flex-col items-start p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all group text-left">
                            <div className="size-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined">featured_seasonal_and_gifts</span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Penerima Diakonia</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">Rekap jemaat yang menerima bantuan diakonia dari gereja / luar negeri.</p>
                        </button>
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
                                                <div className="text-xs text-slate-500">{calculateAge(member.birthDate)} Tahun • {member.sector}</div>
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
