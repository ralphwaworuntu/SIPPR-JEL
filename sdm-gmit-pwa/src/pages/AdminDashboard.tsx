import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdminLayout } from '../components/layouts/AdminLayout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { LingkunganChart } from '../components/admin/LingkunganChart';

import { RecentActivity } from '../components/dashboard/RecentActivity';

import { useSession } from '../lib/auth-client';
import { useSettings } from '../hooks/useSettings';
import { useMemberData, calculateCompleteness, calculateAge, getAgeCategory } from '../hooks/useMemberData';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { DashboardSkeleton } from '../components/skeletons/DashboardSkeleton';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
type TabKey = 'semua' | 'identitas' | 'profesional' | 'komitmen' | 'pendidikan' | 'ekonomi' | 'kesehatan';

interface TabDef {
    key: TabKey;
    label: string;
    icon: string;
}

const TABS: TabDef[] = [
    { key: 'semua', label: 'Semua', icon: 'apps' },
    { key: 'identitas', label: 'Identitas', icon: 'badge' },
    { key: 'profesional', label: 'Profesional', icon: 'work' },
    { key: 'komitmen', label: 'Komitmen', icon: 'volunteer_activism' },
    { key: 'pendidikan', label: 'Pendidikan', icon: 'school' },
    { key: 'ekonomi', label: 'Ekonomi', icon: 'paid' },
    { key: 'kesehatan', label: 'Kesehatan', icon: 'health_and_safety' },
];

type ChartDataPoints = {
    labels: string[];
    data: number[];
    colors: string[];
    type: 'doughnut' | 'bar';
    totalLabel?: string;
};

// ─────────────────────────────────────────
// Reusable Mini Chart Card
// ─────────────────────────────────────────
const ChartCard = ({ title, subtitle, data }: { title: string; subtitle: string; data: ChartDataPoints }) => {
    const [viewType, setViewType] = useState<'chart' | 'table'>('chart');

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

    const centerValue = data.data.reduce((a, b) => a + b, 0);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{title}</h3>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                </div>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                    <button onClick={() => setViewType('chart')} className={`p-1 rounded-md transition-all ${viewType === 'chart' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400'}`}>
                        <span className="material-symbols-outlined text-sm">bar_chart</span>
                    </button>
                    <button onClick={() => setViewType('table')} className={`p-1 rounded-md transition-all ${viewType === 'table' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400'}`}>
                        <span className="material-symbols-outlined text-sm">table_rows</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-[140px]">
                {viewType === 'chart' ? (
                    <div className="relative w-full h-32 flex items-center justify-center">
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
                                        x: { grid: { display: false }, ticks: { display: data.labels.length <= 6, font: { size: 9 } } }
                                    }
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <div className="h-32 overflow-y-auto w-full custom-scrollbar pr-1">
                        <table className="w-full text-xs text-left">
                            <tbody>
                                {data.labels.map((label, idx) => (
                                    <tr key={label} className="border-b border-slate-100 dark:border-slate-800/50">
                                        <td className="py-1 font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{label}</td>
                                        <td className="py-1 text-right text-slate-500 font-bold">{data.data[idx]}</td>
                                    </tr>
                                ))}
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

// ─────────────────────────────────────────
// Stat Count Card
// ─────────────────────────────────────────
const CountCard = ({ title, subtitle, value, icon, gradient }: { title: string; subtitle: string; value: number; icon: string; gradient: string }) => (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
        <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className={`size-24 rounded-full ${gradient} border-4 border-opacity-20 flex items-center justify-center mb-3`}>
                <span className="material-symbols-outlined text-3xl opacity-20 absolute">{icon}</span>
                <span className="text-3xl font-black">{value}</span>
            </div>
        </div>
    </div>
);

// ─────────────────────────────────────────
// Main Dashboard Component
// ─────────────────────────────────────────
const AdminDashboard = () => {
    const navigate = useNavigate();
    const { data: session } = useSession();
    const { profile } = useSettings();
    const [activeTab, setActiveTab] = useState<TabKey>('semua');

    const user = session?.user;

    const { data: stats, isLoading: isStatsLoading, isError: isStatsError, error: statsError } = useDashboardStats();
    const { members, isLoading: isMembersLoading, isError: isMembersError } = useMemberData();

    // Recent members
    const recentMembers = useMemo(() => {
        if (!members) return [];
        return [...members]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    }, [members]);

    const newMembersCount = useMemo(() => {
        if (!members) return 0;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return members.filter(m => new Date(m.createdAt) >= sevenDaysAgo).length;
    }, [members]);

    // ─────────────────────────────
    // CHART DATA PER CATEGORY
    // ─────────────────────────────

    // Tab: Semua / Identitas
    const genderData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'doughnut' };
        const g = stats.distributions.gender;
        return { labels: Object.keys(g), data: Object.values(g), colors: ['#10b981', '#cbd5e1'], type: 'doughnut', totalLabel: 'Total' };
    }, [stats]);

    const sectorData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'bar' };
        const s = stats.distributions.sector;
        return { labels: Object.keys(s), data: Object.values(s), colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'], type: 'bar' };
    }, [stats]);

    const ageData = useMemo<ChartDataPoints>(() => {
        const cats: Record<string, number> = { 'Anak': 0, 'Remaja': 0, 'Pemuda': 0, 'Dewasa': 0, 'Lansia': 0 };
        members.forEach(m => {
            if (m.birthDate) {
                const cat = getAgeCategory(calculateAge(m.birthDate));
                if (cats[cat] !== undefined) cats[cat]++;
            }
        });
        return { labels: Object.keys(cats), data: Object.values(cats), colors: ['#f59e0b', '#ec4899', '#3b82f6', '#10b981', '#8b5cf6'], type: 'bar' };
    }, [members]);

    // Tab: Profesional
    const educationData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'bar' };
        const order = ['SD', 'SMP', 'SMA', 'D3', 'S1', 'S2', 'S3'];
        const labels = Object.keys(stats.distributions.education).sort((a, b) => order.indexOf(a) - order.indexOf(b));
        return { labels, data: labels.map(k => stats.distributions.education[k]), colors: Array(labels.length).fill('#6366f1'), type: 'bar' };
    }, [stats]);

    const jobCategoryData = useMemo<ChartDataPoints>(() => {
        const cats: Record<string, number> = {};
        members.forEach(m => {
            const job = m.jobCategory || m.jobTitle;
            if (job) cats[job] = (cats[job] || 0) + 1;
        });
        const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 8);
        return { labels: sorted.map(e => e[0]), data: sorted.map(e => e[1]), colors: Array(sorted.length).fill('#0ea5e9'), type: 'bar' };
    }, [members]);

    const diakoniaData = useMemo<ChartDataPoints>(() => {
        let ya = 0, tidak = 0;
        members.forEach(m => {
            if (m.diakonia_recipient === 'Ya') ya++;
            else if (m.diakonia_recipient === 'Tidak') tidak++;
        });
        return { labels: ['Penerima', 'Bukan'], data: [ya, tidak], colors: ['#f59e0b', '#cbd5e1'], type: 'doughnut' };
    }, [members]);

    // Tab: Komitmen
    const willingnessData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'doughnut' };
        const w = stats.distributions.willingness;
        return { labels: ['Aktif', 'On-demand'], data: [w['Aktif'] || 0, w['On-demand'] || 0], colors: ['#10b981', '#cbd5e1'], type: 'doughnut' };
    }, [stats]);

    const interestAreasData = useMemo<ChartDataPoints>(() => {
        const areas: Record<string, number> = {};
        members.forEach(m => {
            if (Array.isArray(m.interestAreas)) {
                m.interestAreas.forEach(a => { areas[a] = (areas[a] || 0) + 1; });
            }
        });
        const sorted = Object.entries(areas).sort((a, b) => b[1] - a[1]).slice(0, 8);
        return { labels: sorted.map(e => e[0]), data: sorted.map(e => e[1]), colors: Array(sorted.length).fill('#8b5cf6'), type: 'bar' };
    }, [members]);

    const contributionData = useMemo<ChartDataPoints>(() => {
        const types: Record<string, number> = {};
        members.forEach(m => {
            if (Array.isArray(m.contributionTypes)) {
                m.contributionTypes.forEach(c => { types[c] = (types[c] || 0) + 1; });
            }
        });
        const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 8);
        return { labels: sorted.map(e => e[0]), data: sorted.map(e => e[1]), colors: Array(sorted.length).fill('#ec4899'), type: 'bar' };
    }, [members]);

    // Tab: Pendidikan Anak
    const schoolingStatusData = useMemo<ChartDataPoints>(() => {
        const s: Record<string, number> = { 'Ya': 0, 'Tidak': 0, 'Tidak ada anak usia sekolah': 0 };
        members.forEach(m => {
            if (m.education_schoolingStatus && s[m.education_schoolingStatus] !== undefined) s[m.education_schoolingStatus]++;
        });
        return { labels: Object.keys(s), data: Object.values(s), colors: ['#10b981', '#f43f5e', '#cbd5e1'], type: 'doughnut' };
    }, [members]);

    const schoolLevelData = useMemo<ChartDataPoints>(() => {
        let tk = 0, sd = 0, smp = 0, sma = 0, univ = 0;
        members.forEach(m => {
            tk += m.education_inSchool_tk_paud || 0;
            sd += m.education_inSchool_sd || 0;
            smp += m.education_inSchool_smp || 0;
            sma += m.education_inSchool_sma || 0;
            univ += m.education_inSchool_university || 0;
        });
        return { labels: ['TK/PAUD', 'SD', 'SMP', 'SMA', 'PT'], data: [tk, sd, smp, sma, univ], colors: ['#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'], type: 'bar' };
    }, [members]);

    const dropoutData = useMemo<ChartDataPoints>(() => {
        let sd = 0, smp = 0, sma = 0, univ = 0;
        members.forEach(m => {
            sd += m.education_dropout_sd || 0;
            smp += m.education_dropout_smp || 0;
            sma += m.education_dropout_sma || 0;
            univ += m.education_dropout_university || 0;
        });
        return { labels: ['SD', 'SMP', 'SMA', 'PT'], data: [sd, smp, sma, univ], colors: ['#f43f5e', '#f97316', '#eab308', '#a855f7'], type: 'bar' };
    }, [members]);

    // Tab: Ekonomi
    const incomeData = useMemo<ChartDataPoints>(() => {
        const ranges: Record<string, number> = {};
        members.forEach(m => {
            if (m.economics_incomeRange) ranges[m.economics_incomeRange] = (ranges[m.economics_incomeRange] || 0) + 1;
        });
        const sorted = Object.entries(ranges).sort((a, b) => b[1] - a[1]);
        return { labels: sorted.map(e => e[0]), data: sorted.map(e => e[1]), colors: Array(sorted.length).fill('#10b981'), type: 'bar' };
    }, [members]);

    const houseStatusData = useMemo<ChartDataPoints>(() => {
        const s: Record<string, number> = {};
        members.forEach(m => {
            if (m.economics_houseStatus) s[m.economics_houseStatus] = (s[m.economics_houseStatus] || 0) + 1;
        });
        return { labels: Object.keys(s), data: Object.values(s), colors: ['#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899'], type: 'bar' };
    }, [members]);

    const businessData = useMemo<ChartDataPoints>(() => {
        let ya = 0, tidak = 0;
        members.forEach(m => {
            if (m.economics_hasBusiness === 'Ya') ya++;
            else if (m.economics_hasBusiness === 'Tidak') tidak++;
        });
        return { labels: ['Punya Usaha', 'Tidak'], data: [ya, tidak], colors: ['#10b981', '#cbd5e1'], type: 'doughnut' };
    }, [members]);

    const businessTypeData = useMemo<ChartDataPoints>(() => {
        const types: Record<string, number> = {};
        members.forEach(m => {
            if (m.economics_hasBusiness === 'Ya' && m.economics_businessType) {
                types[m.economics_businessType] = (types[m.economics_businessType] || 0) + 1;
            }
        });
        const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]);
        return { labels: sorted.map(e => e[0]), data: sorted.map(e => e[1]), colors: Array(sorted.length).fill('#f59e0b'), type: 'bar' };
    }, [members]);

    // Tab: Kesehatan
    const bpjsData = useMemo<ChartDataPoints>(() => {
        const b: Record<string, number> = {};
        members.forEach(m => {
            if (m.health_hasBPJS) b[m.health_hasBPJS] = (b[m.health_hasBPJS] || 0) + 1;
        });
        return { labels: Object.keys(b), data: Object.values(b), colors: ['#10b981', '#3b82f6', '#f59e0b', '#f43f5e'], type: 'bar' };
    }, [members]);

    const chronicData = useMemo<ChartDataPoints>(() => {
        let ya = 0, tidak = 0;
        members.forEach(m => {
            if (m.health_chronicSick === 'Ya') ya++;
            else if (m.health_chronicSick === 'Tidak') tidak++;
        });
        return { labels: ['Ada Kronis', 'Tidak'], data: [ya, tidak], colors: ['#f43f5e', '#cbd5e1'], type: 'doughnut' };
    }, [members]);

    const socialAssistData = useMemo<ChartDataPoints>(() => {
        const s: Record<string, number> = {};
        members.forEach(m => {
            if (m.health_socialAssistance) s[m.health_socialAssistance] = (s[m.health_socialAssistance] || 0) + 1;
        });
        return { labels: Object.keys(s), data: Object.values(s), colors: ['#10b981', '#cbd5e1'], type: 'doughnut' };
    }, [members]);

    const disabilityCount = useMemo(() => members.filter(m => m.health_hasDisability === 'Ya').length, [members]);
    const workingChildrenCount = useMemo(() => members.reduce((acc, m) => acc + (m.education_working || 0), 0), [members]);

    // ─────────────────────────────
    // RENDER CHART CARDS PER TAB
    // ─────────────────────────────
    const sections = {
        identitas: (
            <div className="mb-4" key="identitas">
                {activeTab === 'semua' && <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">badge</span> Identitas & Demografi</h3>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <ChartCard title="Distribusi Gender" subtitle="Laki-laki vs Perempuan" data={genderData} />
                    <ChartCard title="Distribusi Umur" subtitle="Kategori usia jemaat" data={ageData} />
                    <ChartCard title="Per Sektor" subtitle="Jumlah jemaat per sektor" data={sectorData} />
                </div>
            </div>
        ),
        profesional: (
            <div className="mb-4" key="profesional">
                {activeTab === 'semua' && <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">work</span> Profesional & Akademik</h3>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <ChartCard title="Tingkat Pendidikan" subtitle="Jenjang pendidikan jemaat" data={educationData} />
                    <ChartCard title="Kategori Pekerjaan" subtitle="Pekerjaan utama jemaat" data={jobCategoryData} />
                    <ChartCard title="Penerima Diakonia" subtitle="Distribusi penerima" data={diakoniaData} />
                    <CountCard title="Keluarga Profesional" subtitle="Anggota keluarga terampil" value={stats?.professionalFamilyCount || 0} icon="engineering" gradient="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-500/20 text-violet-600 dark:text-violet-400" />
                </div>
            </div>
        ),
        komitmen: (
            <div className="mb-4" key="komitmen">
                {activeTab === 'semua' && <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">volunteer_activism</span> Komitmen Pelayanan</h3>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <ChartCard title="Minat Pelayanan" subtitle="Kesediaan jemaat melayani" data={willingnessData} />
                    <ChartCard title="Area Pelayanan" subtitle="Bidang minat pelayanan" data={interestAreasData} />
                    <ChartCard title="Bentuk Kontribusi" subtitle="Jenis kontribusi yang dipilih" data={contributionData} />
                </div>
            </div>
        ),
        pendidikan: (
            <div className="mb-4" key="pendidikan">
                {activeTab === 'semua' && <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">school</span> Pendidikan Anak</h3>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <ChartCard title="Status Sekolah Anak" subtitle="Anak yang bersekolah" data={schoolingStatusData} />
                    <ChartCard title="Jenjang Sekolah" subtitle="Distribusi per jenjang" data={schoolLevelData} />
                    <ChartCard title="Putus Sekolah" subtitle="Per jenjang pendidikan" data={dropoutData} />
                    <CountCard title="Anak Bekerja" subtitle="Total anak yang sudah bekerja" value={workingChildrenCount} icon="work" gradient="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" />
                </div>
            </div>
        ),
        ekonomi: (
            <div className="mb-4" key="ekonomi">
                {activeTab === 'semua' && <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">paid</span> Ekonomi & Aset</h3>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <ChartCard title="Distribusi Pendapatan" subtitle="Range pendapatan rumah tangga" data={incomeData} />
                    <ChartCard title="Status Rumah" subtitle="Kepemilikan rumah" data={houseStatusData} />
                    <ChartCard title="Kepemilikan Usaha" subtitle="Punya usaha produktif?" data={businessData} />
                    <ChartCard title="Jenis Usaha" subtitle="Kategori usaha keluarga" data={businessTypeData} />
                </div>
            </div>
        ),
        kesehatan: (
            <div className="mb-4" key="kesehatan">
                {activeTab === 'semua' && <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">health_and_safety</span> Kesehatan & Disabilitas</h3>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <ChartCard title="Cakupan BPJS" subtitle="Status kepesertaan BPJS" data={bpjsData} />
                    <ChartCard title="Penyakit Kronis" subtitle="Riwayat penyakit kronis" data={chronicData} />
                    <CountCard title="Disabilitas" subtitle="Jemaat dengan disabilitas" value={disabilityCount} icon="accessible" gradient="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400" />
                    <ChartCard title="Bantuan Sosial" subtitle="Status bantuan sosial" data={socialAssistData} />
                </div>
            </div>
        )
    };

    const renderTabContent = () => {
        if (activeTab === 'semua') {
            return (
                <div className="flex flex-col gap-2">
                    {Object.values(sections)}
                </div>
            );
        }
        return sections[activeTab as keyof typeof sections];
    };

    // ─────────────────────────────
    // LOADING / ERROR STATES
    // ─────────────────────────────
    if (isStatsLoading || isMembersLoading) {
        return (
            <AdminLayout title="Dashboard Overview">
                <DashboardSkeleton />
            </AdminLayout>
        );
    }

    if (isStatsError || isMembersError || !stats) {
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
                    <div className="flex gap-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-opacity"
                        >
                            Coba Lagi
                        </button>
                        <button
                            onClick={async () => {
                                await fetch('/api/auth/sign-out', { method: 'POST' });
                                localStorage.clear();
                                window.location.href = '/login';
                            }}
                            className="px-6 py-2 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-colors"
                        >
                            Keluar / Reset Sesi
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard Overview">

            {/* 1. Greeting Card */}
            <div className="mb-6 animate-fade-in-up">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center h-48 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none"></div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 relative z-10">
                        Halo, {profile?.firstName || user?.name || 'Admin'}! 👋
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-md relative z-10">
                        Ada <strong className="text-slate-900 dark:text-white">{members?.length || 0} jemaat</strong> terdaftar.
                        Minggu ini ada <strong className="text-green-600">{newMembersCount} penambahan</strong> data baru.
                    </p>
                    <button
                        onClick={() => navigate('/admin/members')}
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-sm rounded-xl transition-colors relative z-10 w-fit"
                    >
                        <span className="material-symbols-outlined text-lg">groups</span>
                        Lihat Semua Data Jemaat
                    </button>
                </div>
            </div>

            {/* 2. Category Dropdown Filter */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Statistik Jemaat</h3>
                    <p className="text-sm text-slate-500">Lihat ringkasan data per kategori</p>
                </div>
                <div className="relative min-w-[220px]">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">filter_list</span>
                    <select
                        value={activeTab}
                        onChange={(e) => setActiveTab(e.target.value as TabKey)}
                        className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold focus:ring-2 focus:ring-primary/50 shadow-sm transition-all cursor-pointer appearance-none uppercase text-sm tracking-wider"
                    >
                        {TABS.map(tab => (
                            <option key={tab.key} value={tab.key}>
                                {tab.label === 'Semua' ? 'Tampilkan Semua Data' : tab.label}
                            </option>
                        ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                </div>
            </div>

            {/* 3. Tab-Specific Chart Cards */}
            {renderTabContent()}

            {/* 4. Data Quality Widget */}
            {(() => {
                const quality = members.reduce((acc, m) => {
                    const c = calculateCompleteness(m);
                    if (c.color === 'green') acc.lengkap++;
                    else if (c.color === 'yellow') acc.sebagian++;
                    else acc.kurang++;
                    return acc;
                }, { lengkap: 0, sebagian: 0, kurang: 0 });
                const total = members.length || 1;
                return (
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-base text-slate-900 dark:text-white">Kualitas Data</h3>
                                <p className="text-xs text-slate-500">Kelengkapan pengisian data jemaat</p>
                            </div>
                            <span className="material-symbols-outlined text-slate-400">task_alt</span>
                        </div>
                        <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                            <div className="bg-green-500 rounded-l-full transition-all" style={{ width: `${(quality.lengkap / total) * 100}%` }} />
                            <div className="bg-yellow-400 transition-all" style={{ width: `${(quality.sebagian / total) * 100}%` }} />
                            <div className="bg-red-400 rounded-r-full transition-all" style={{ width: `${(quality.kurang / total) * 100}%` }} />
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-green-500"></span> Lengkap ({quality.lengkap})</span>
                            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-yellow-400"></span> Sebagian ({quality.sebagian})</span>
                            <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-400"></span> Kurang ({quality.kurang})</span>
                        </div>
                    </div>
                );
            })()}

            {/* 5. Lingkungan & Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 h-[400px]">
                    <LingkunganChart members={members} />
                </div>
                <div className="lg:col-span-1 h-[400px]">
                    <RecentActivity recentMembers={recentMembers} />
                </div>
            </div>

        </AdminLayout>
    );
};

export default AdminDashboard;
