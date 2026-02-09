import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { LingkunganChart } from '../components/admin/LingkunganChart';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentActivity } from '../components/dashboard/RecentActivity';



import { useSession } from '../lib/auth-client';
import { useSettings } from '../hooks/useSettings';
import { useMemberData } from '../hooks/useMemberData';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { DashboardSkeleton } from '../components/skeletons/DashboardSkeleton';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Data Definitions
type ChartDataPoints = {
    labels: string[];
    data: number[];
    colors: string[];
    type: 'doughnut' | 'bar';
    totalLabel?: string;
};

const TITLES: Record<string, { title: string, subtitle: string }> = {
    'gender': { title: "Distribusi Gender", subtitle: "Laki-laki vs Perempuan" },
    'willingness': { title: "Minat Pelayanan", subtitle: "Kesediaan Jemaat" },
    'education': { title: "Pendidikan", subtitle: "Tingkat Pendidikan" },
    'sector': { title: "Sektor", subtitle: "Sebaran Wilayah" }
};

interface DynamicChartProps {
    initialMetric: 'gender' | 'willingness' | 'education' | 'sector';
    customData: ChartDataPoints;
}

const DynamicChart = ({ initialMetric, customData }: DynamicChartProps) => {

    const [viewType, setViewType] = useState<'chart' | 'table'>('chart');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const data = customData;
    const info = TITLES[initialMetric] || { title: "Chart", subtitle: "" };

    // ChartJS Data Structure
    const chartJsData = {
        labels: data.labels,
        datasets: [{
            label: 'Jumlah',
            data: data.data,
            backgroundColor: data.colors,
            borderWidth: 0,
            hoverOffset: 4,
            borderRadius: data.type === 'bar' ? 4 : 0,
            barThickness: data.type === 'bar' ? 20 : undefined,
        }]
    };

    // Calculate total for center text in doughnut
    const total = data.data.reduce((a, b) => a + b, 0);
    const centerValue = initialMetric === 'willingness'
        ? (total > 0 ? `${Math.round((data.data[0] / total) * 100)}%` : '0%')
        : total.toLocaleString();

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col relative group">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{info.title}</h3>
                    <p className="text-xs text-slate-500">{info.subtitle}</p>
                </div>
                <div className="relative">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 size-6 flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">more_horiz</span>
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 w-40 overflow-hidden z-20 animate-fade-in-up">
                            <div className="p-1">
                                <button onClick={() => { setViewType('chart'); setIsMenuOpen(false); }} className={`w-full text-left px-2 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 rounded-lg ${viewType === 'chart' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                                    <span className="material-symbols-outlined text-sm">bar_chart</span> Grafik
                                </button>
                                <button onClick={() => { setViewType('table'); setIsMenuOpen(false); }} className={`w-full text-left px-2 py-1.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 rounded-lg ${viewType === 'table' ? 'text-primary font-bold' : 'text-slate-600 dark:text-slate-300'}`}>
                                    <span className="material-symbols-outlined text-sm">table_chart</span> Tabel
                                </button>
                            </div>
                        </div>
                    )}
                    {isMenuOpen && <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>}
                </div>
            </div>

            <div className="flex-1 min-h-[140px] flex flex-col justify-center">
                {viewType === 'chart' ? (
                    <div className="relative h-32 w-full flex items-center justify-center">
                        {data.type === 'doughnut' ? (
                            <>
                                <Doughnut data={chartJsData} options={{ cutout: '75%', plugins: { legend: { display: false } }, maintainAspectRatio: false }} />
                                <div className="absolute flex flex-col items-center pointer-events-none">
                                    <span className="text-xl font-black text-slate-900 dark:text-white">{centerValue}</span>
                                </div>
                            </>
                        ) : (
                            <Bar
                                data={chartJsData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { beginAtZero: true, display: false },
                                        x: { grid: { display: false }, ticks: { display: false } }
                                    }
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <div className="h-32 overflow-y-auto w-full custom-scrollbar pr-1">
                        <table className="w-full text-xs text-left">
                            <tbody>
                                {data.labels.map((label, idx) => {
                                    const val = data.data[idx];
                                    return (
                                        <tr key={label} className="border-b border-slate-100 dark:border-slate-800/50">
                                            <td className="py-1 font-medium text-slate-700 dark:text-slate-300 truncate max-w-[80px]">{label}</td>
                                            <td className="py-1 text-right text-slate-500">{val}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Compact Legend */}
            {viewType === 'chart' && (
                <div className="flex justify-center gap-2 mt-2 flex-wrap">
                    {data.labels.slice(0, 3).map((label, i) => (
                        <div key={label} className="flex items-center gap-1">
                            <span className="size-2 rounded-full" style={{ backgroundColor: data.colors[i] }}></span>
                            <span className="text-[10px] font-medium text-slate-500 truncate max-w-[60px]">{label}</span>
                        </div>
                    ))}
                    {data.labels.length > 3 && <span className="text-[10px] text-slate-400">+{data.labels.length - 3}</span>}
                </div>
            )}
        </div>
    );
};

const AdminDashboard = () => {
    const { data: session } = useSession();
    const { profile } = useSettings();
    const navigate = useNavigate();
    const user = session?.user;

    // Get Real Data (Split into stats and list for performance)
    // Get Real Data (Split into stats and list for performance)
    console.log("AdminDashboard: Loading data...");
    const { data: stats, isLoading: isStatsLoading, isError: isStatsError, error: statsError } = useDashboardStats();
    const { members, isLoading: isMembersLoading, isError: isMembersError } = useMemberData();

    // Get 5 most recent members based on createdAt
    const recentMembers = useMemo(() => {
        if (!members) return [];
        return [...members]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [members]);

    // Calculate new members last 7 days
    const newMembersCount = useMemo(() => {
        if (!members) return 0;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return members.filter(m => new Date(m.createdAt) >= sevenDaysAgo).length;
    }, [members]);

    // Transform API stats to Chart Data
    const chartsData = useMemo(() => {
        if (!stats) return null;

        // Use upstream type definition or careful access if needed, but keeping stashed logic for structure
        type DistributionType = Record<string, number>;
        const distributions = stats.distributions; // Assuming stats structure matches what we expect from stashed logic

        // Gender
        const genderLabels = Object.keys(stats.distributions.gender);
        const genderData = Object.values(stats.distributions.gender);

        // Willingness - Note: DB stores "Aktif", "On-demand", "Not-available"
        const willLabels = ["Aktif", "On-demand"];
        const willData = [
            stats.distributions.willingness["Aktif"] || 0,
            stats.distributions.willingness["On-demand"] || 0
        ];

        // Education
        const eduOrder = ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'];
        const eduLabels = Object.keys(stats.distributions.education).sort((a, b) => eduOrder.indexOf(a) - eduOrder.indexOf(b));
        const eduData = eduLabels.map(k => stats.distributions.education[k]);

        // Sector
        const sectorLabels = Object.keys(stats.distributions.sector);
        const sectorData = Object.values(stats.distributions.sector);

        return {
            gender: {
                labels: genderLabels,
                data: genderData,
                colors: ['#10b981', '#cbd5e1'],
                type: 'doughnut' as const,
                totalLabel: 'Total'
            },
            willingness: {
                labels: willLabels,
                data: willData,
                colors: ['#10b981', '#cbd5e1', '#f43f5e'],
                type: 'doughnut' as const,
                totalLabel: 'Bersedia'
            },
            education: {
                labels: eduLabels,
                data: eduData,
                colors: Array(eduLabels.length).fill('#6366f1'),
                type: 'bar' as const,
                totalLabel: 'Total'
            },
            sector: {
                labels: sectorLabels,
                data: sectorData,
                colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
                type: 'bar' as const,
                totalLabel: 'Jemaat'
            }
        };
    }, [stats]);

    if (isStatsLoading || isMembersLoading) {
        console.log("AdminDashboard: Data is loading...");
        return (
            <AdminLayout title="Dashboard Overview">
                <DashboardSkeleton />
            </AdminLayout>
        );
    }

    if (isStatsError || isMembersError || !stats) {
        console.error("AdminDashboard: Error loading data", { isStatsError, isMembersError, statsError });
        return (
            <AdminLayout title="Dashboard Overview">
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center">
                    <div className="size-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-3xl">error</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Gagal Memuat Data</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                        {statsError instanceof Error ? statsError.message : "Terjadi kesalahan saat mengambil statistik dashboard dari server."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                        Coba Lagi
                    </button>
                </div>
            </AdminLayout>
        );
    }

    if (isStatsLoading || isMembersLoading) {
        return (
            <AdminLayout title="Dashboard Overview">
                <DashboardSkeleton />
            </AdminLayout>
        );
    }

    if (!stats || !chartsData) return null; // Should handle error state ideally

    return (
        <AdminLayout title="Dashboard Overview">

            {/* 1. Bento Grid Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 animate-fade-in-up">
                {/* Greeting & Summary (Expanded) */}
                <div className="md:col-span-3 lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center h-60 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 relative z-10">
                        Halo, {profile?.firstName || user?.name || 'Admin'}! 👋
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md relative z-10">
                        Ada <strong className="text-slate-900 dark:text-white">{members?.length || 0} jemaat</strong> terdaftar.
                        Minggu ini ada <strong className="text-green-600">{newMembersCount} penambahan</strong> data baru.
                    </p>
                </div>


            </div>

            {/* 2. Main Analytics Grid (Bento Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <DynamicChart initialMetric="gender" customData={chartsData.gender} />
                <DynamicChart initialMetric="willingness" customData={chartsData.willingness} />
                <DynamicChart initialMetric="education" customData={chartsData.education} />
                <DynamicChart initialMetric="sector" customData={chartsData.sector} />
            </div>

            {/* 3. Lingkungan & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lingkungan Chart (2 cols) */}
                <div className="lg:col-span-2 h-[400px]">
                    <LingkunganChart members={members} />
                </div>
                {/* Activity (1 col) */}
                <div className="lg:col-span-1 h-[400px]">
                    <RecentActivity recentMembers={recentMembers} />
                </div>
            </div>

        </AdminLayout>
    );
};

export default AdminDashboard;
