import { useState, useMemo, useRef } from 'react';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import DistributionMap from '../components/admin/DistributionMap';
import { StatCard } from '../components/dashboard/StatCard';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';
import { ClockWidget } from '../components/dashboard/ClockWidget';
import { BirthdayWidget } from '../components/dashboard/BirthdayWidget';
import { useSession } from '../lib/auth-client';
import { useSettings } from '../hooks/useSettings';
import { useMemberData } from '../hooks/useMemberData';
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
    const centerValue = initialMetric === 'willingness' ? `${Math.round((data.data[0] / total) * 100)}%` : total.toLocaleString();

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
    const user = session?.user;

    // Get Real Data
    const { stats, members, isLoading } = useMemberData();

    if (isLoading) {
        return (
            <AdminLayout title="Dashboard Overview">
                <DashboardSkeleton />
            </AdminLayout>
        );
    }

    // Get 5 most recent members based on createdAt
    const recentMembers = useMemo(() => {
        return [...members]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [members]);

    // Transform API stats to Chart Data
    const chartsData = useMemo(() => {
        // Gender
        const genderLabels = Object.keys(stats.distributions.gender);
        const genderData = Object.values(stats.distributions.gender);

        // Willingness
        const willLabels = ["Bersedia", "Ragu-ragu", "Tidak"];
        const willData = [
            stats.distributions.willingness["Bersedia"] || 0,
            stats.distributions.willingness["Ragu-ragu"] || 0,
            stats.distributions.willingness["Tidak"] || 0
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

    return (
        <AdminLayout title="Dashboard Overview">

            {/* 1. Bento Grid Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 animate-fade-in-up">
                {/* Clock Widget (1x2) */}
                <div className="md:col-span-1 md:row-span-1 lg:row-span-1 h-60">
                    <ClockWidget />
                </div>

                {/* Greeting & Summary (2x1) */}
                <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center h-60 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 relative z-10">
                        Halo, {profile.firstName || user?.name || 'Admin'}! 👋
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md relative z-10">
                        Ada <strong className="text-slate-900 dark:text-white">{members.length} jemaat</strong> terdaftar.
                        Minggu ini ada <strong className="text-green-600">3 penambahan</strong> data baru.
                    </p>
                    <div className="mt-6 flex gap-3 relative z-10">
                        <button
                            onClick={() => window.location.href = '#/admin/members?action=add'}
                            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold shadow-lg hover:scale-105 transition-transform"
                        >
                            + Tambah Jemaat
                        </button>
                        <button
                            onClick={() => window.location.href = '#/admin/reports'}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Lihat Laporan
                        </button>
                    </div>
                </div>

                {/* Birthday Widget (1x2) - Hidden on medium, shown on large */}
                <div className="hidden lg:block lg:col-span-1 lg:row-span-2 h-full">
                    <BirthdayWidget />
                </div>

                {/* Stat Cards Row */}
                <div className="md:col-span-3 lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Total Jemaat"
                        value={stats.total.toLocaleString()}
                        subtitle="Terverifikasi"
                        trend="+12%"
                        trendUp={true}
                        icon="groups"
                        color="primary"
                        delay={0}
                    />
                    <StatCard
                        title="Profesional"
                        value={stats.professionalCount.toLocaleString()}
                        subtitle="Aktif"
                        trend="+5%"
                        trendUp={true}
                        icon="engineering"
                        color="blue"
                        delay={1}
                    />
                    <StatCard
                        title="Relawan"
                        value={stats.volunteerCount.toLocaleString()}
                        subtitle="Pelayanan"
                        trend="Stabil"
                        trendUp={true}
                        icon="volunteer_activism"
                        color="orange"
                        delay={2}
                    />
                    <StatCard
                        title="Keahlian"
                        value={stats.activeSkills.toLocaleString()}
                        subtitle="Sektor"
                        trend="+24%"
                        trendUp={true}
                        icon="psychology"
                        color="purple"
                        delay={3}
                    />
                </div>
            </div>

            {/* 2. Main Analytics Grid (Bento Style) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
                {/* Quick Actions (1 col) */}
                <div className="lg:col-span-1">
                    <QuickActions />
                </div>

                {/* Mini Charts (3 cols) */}
                <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DynamicChart initialMetric="gender" customData={chartsData.gender} />
                    <DynamicChart initialMetric="willingness" customData={chartsData.willingness} />
                    <DynamicChart initialMetric="education" customData={chartsData.education} />
                    <DynamicChart initialMetric="sector" customData={chartsData.sector} />
                </div>
            </div>

            {/* 3. Map & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Map (2 cols) */}
                <div className="lg:col-span-2 h-[400px]">
                    <MapSection sectorData={stats.distributions.sector} />
                </div>
                {/* Activity (1 col) */}
                <div className="lg:col-span-1 h-[400px]">
                    <RecentActivity recentMembers={recentMembers} />
                </div>
            </div>

        </AdminLayout>
    );
};

interface MapSectionProps {
    sectorData: Record<string, number>;
}

const MapSection = ({ sectorData }: MapSectionProps) => {
    const mapRef = useRef<HTMLDivElement>(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            mapRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div ref={mapRef} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full flex flex-col relative group">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 absolute top-0 left-0 right-0 z-10 backdrop-blur-sm">
                <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Sebaran Domisili</h3>
                </div>
                <button onClick={toggleFullscreen} className="text-slate-400 hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <span className="material-symbols-outlined text-lg">fullscreen</span>
                </button>
            </div>

            <div className="flex-1 w-full relative bg-slate-50 dark:bg-slate-800/50 pt-14">
                <DistributionMap sectorData={sectorData} />
                {/* Legend Overlay */}
                <div className="absolute bottom-4 left-4 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg z-[400]">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Legenda</h4>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="size-2 bg-[#6366f1] rounded-full"></div>
                            <span className="text-[10px] font-medium text-slate-700 dark:text-slate-200">Ada Data</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-2 bg-slate-300 rounded-full"></div>
                            <span className="text-[10px] font-medium text-slate-700 dark:text-slate-200">Kosong</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
