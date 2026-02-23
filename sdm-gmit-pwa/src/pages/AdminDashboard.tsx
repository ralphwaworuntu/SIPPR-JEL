import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdminLayout } from '../components/layouts/AdminLayout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Filler } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useSession } from '../lib/auth-client';
import { useSettings } from '../hooks/useSettings';
import { useMemberData } from '../hooks/useMemberData';
import type { Member } from '../hooks/useMemberData';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { DashboardSkeleton } from '../components/skeletons/DashboardSkeleton';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Filler);

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
type TabKey = 'semua' | 'identitas' | 'keluarga' | 'profesional' | 'komitmen' | 'pendidikan' | 'ekonomi' | 'kesehatan';

interface TabDef {
    key: TabKey;
    label: string;
    icon: string;
}

const TABS: TabDef[] = [
    { key: 'semua', label: 'Semua', icon: 'apps' },
    { key: 'identitas', label: 'Identitas', icon: 'badge' },
    { key: 'keluarga', label: 'Informasi Jemaat', icon: 'diversity_3' },
    { key: 'profesional', label: 'Akademik & Profesi', icon: 'work' },
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
            borderColor: 'transparent',
            borderWidth: 0,
            hoverOffset: 12,
            borderRadius: data.type === 'bar' ? 6 : 0,
            barThickness: data.type === 'bar' ? 24 : undefined,
        }]
    };

    const centerValue = data.data.reduce((a, b) => a + b, 0);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col group">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
                </div>
                <div className="flex bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-1">
                    <button
                        onClick={() => setViewType('chart')}
                        className={`p-1.5 rounded-lg transition-all duration-300 ${viewType === 'chart' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">bar_chart</span>
                    </button>
                    <button
                        onClick={() => setViewType('table')}
                        className={`p-1.5 rounded-lg transition-all duration-300 ${viewType === 'table' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">list_alt</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-[160px] relative">
                {viewType === 'chart' ? (
                    <div className="w-full h-36 flex items-center justify-center">
                        {data.type === 'doughnut' ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Doughnut
                                    data={chartJsData}
                                    options={{
                                        cutout: '78%',
                                        plugins: { legend: { display: false } },
                                        maintainAspectRatio: false,
                                        animation: { duration: 1500, easing: 'easeOutQuart' }
                                    }}
                                />
                                <div className="absolute flex flex-col items-center pointer-events-none translate-y-1">
                                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{centerValue}</span>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total</span>
                                </div>
                            </div>
                        ) : (
                            <Bar
                                data={chartJsData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        y: { beginAtZero: true, display: false },
                                        x: {
                                            grid: { display: false },
                                            ticks: {
                                                display: data.labels.length <= 8,
                                                font: { size: 10, weight: 600 },
                                                color: '#94a3b8'
                                            },
                                            border: { display: false }
                                        }
                                    },
                                    animation: { duration: 1500, easing: 'easeOutQuart' }
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <div className="h-44 overflow-y-auto w-full custom-scrollbar pr-1">
                        <table className="w-full text-[10px] text-left">
                            <thead className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 z-10">
                                <tr>
                                    <th className="py-2.5 font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                                    <th className="py-2.5 text-right font-black text-slate-400 uppercase tracking-widest">Jumlah</th>
                                    <th className="py-2.5 text-right font-black text-slate-400 uppercase tracking-widest pl-4">%</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {data.labels.map((label, idx) => {
                                    const percentage = centerValue > 0 ? Math.round((data.data[idx] / centerValue) * 100) : 0;
                                    return (
                                        <tr key={label} className="group/row hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="py-2.5 flex items-center gap-2">
                                                <span className="size-1.5 rounded-full" style={{ backgroundColor: data.colors[idx] }}></span>
                                                <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[100px]">{label}</span>
                                            </td>
                                            <td className="py-2.5 text-right text-slate-900 dark:text-white font-black">{data.data[idx].toLocaleString()}</td>
                                            <td className="py-2.5 text-right text-slate-400 font-bold pl-4 group-hover/row:text-primary transition-colors">{percentage}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="sticky bottom-0 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 font-black">
                                <tr>
                                    <td className="py-2 text-slate-500 uppercase tracking-tighter">Total Terdata</td>
                                    <td className="py-2 text-right text-primary">{centerValue.toLocaleString()}</td>
                                    <td className="py-2 text-right text-slate-400 pl-4">100%</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>

            {/* Compact Legend */}
            {viewType === 'chart' && (
                <div className="flex justify-center gap-3 mt-4 flex-wrap">
                    {data.labels.slice(0, 3).map((label, i) => (
                        <div key={label} className="flex items-center gap-1.5 group/item">
                            <span className="size-2.5 rounded-full shadow-sm ring-2 ring-white dark:ring-slate-800" style={{ backgroundColor: data.colors[i] }}></span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[70px]">{label}</span>
                        </div>
                    ))}
                    {data.labels.length > 3 && <span className="text-[10px] font-black text-primary bg-primary/10 px-2 rounded-full">+{data.labels.length - 3} more</span>}
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────
// Stat Count Card
// ─────────────────────────────────────────
const CountCard = ({ title, subtitle, value, icon, gradient }: { title: string; subtitle: string; value: number | string; icon: string; gradient: string }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 h-full flex flex-col group overflow-hidden relative">
        <div className={`absolute -right-4 -top-4 size-24 rounded-full ${gradient} opacity-5 group-hover:scale-150 transition-transform duration-700 blur-2xl`}></div>

        <div className="mb-6 relative z-10">
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative z-10">
            <div className={`size-28 rounded-[2rem] ${gradient} border border-white dark:border-slate-800 shadow-inner flex flex-col items-center justify-center mb-2 transform group-hover:rotate-3 transition-transform duration-500`}>
                <span className="material-symbols-outlined text-4xl opacity-10 absolute pointer-events-none scale-150">{icon}</span>
                <span className="text-4xl font-black tracking-tight drop-shadow-sm">{value}</span>
            </div>
            {typeof value === 'number' && (
                <div className="h-1 w-12 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary/40 w-1/2"></div>
                </div>
            )}
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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFamilyForDiakonia, setSelectedFamilyForDiakonia] = useState<Member | null>(null);
    const [tableFilter, setTableFilter] = useState({ rayon: '', lingkungan: '' });
    const [profFilter, setProfFilter] = useState({ skill: '', level: '', willingness: '', contribution: '' });

    const user = session?.user;

    const { data: stats, isLoading: isStatsLoading, isError: isStatsError, error: statsError } = useDashboardStats();
    const { members, isLoading: isMembersLoading, isError: isMembersError } = useMemberData();


    const filteredMembers = useMemo(() => {
        if (!members) return [];
        return members.filter(m => {
            const search = searchQuery.toLowerCase();
            return m.name.toLowerCase().includes(search) ||
                (m.nik && m.nik.includes(search)) ||
                (m.kkNumber && m.kkNumber.includes(search));
        });
    }, [members, searchQuery]);

    const addressTableData = useMemo(() => {
        if (!members) return [];
        return members.filter(m => {
            const rMatch = !tableFilter.rayon || m.rayon === tableFilter.rayon;
            const lMatch = !tableFilter.lingkungan || m.lingkungan === tableFilter.lingkungan;
            return rMatch && lMatch;
        });
    }, [members, tableFilter]);

    // ─────────────────────────────
    // CHART DATA PER CATEGORY
    // ─────────────────────────────

    // Tab: Semua / Identitas

    const rayonData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'bar' };
        const r = stats.distributions.rayon;
        const keys = Object.keys(r).sort();
        return {
            labels: keys.map(k => `Rayon ${k}`),
            data: keys.map(k => r[k]),
            colors: Array(keys.length).fill('#f43f5e'),
            type: 'bar'
        };
    }, [stats]);

    const lingkunganData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'bar' };
        const l = stats.distributions.lingkungan;
        const keys = Object.keys(l).sort((a, b) => {
            const numA = parseInt(a.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.replace(/\D/g, '')) || 0;
            return numA - numB;
        });
        return {
            labels: keys.map(k => `Ling. ${k}`),
            data: keys.map(k => l[k]),
            colors: Array(keys.length).fill('#10b981'),
            type: 'bar'
        };
    }, [stats]);

    const genderData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'doughnut' };
        const g = stats.distributions.gender;
        return {
            labels: Object.keys(g),
            data: Object.values(g),
            colors: ['#6366f1', '#f43f5e'],
            type: 'doughnut'
        };
    }, [stats]);


    const diakoniaData = useMemo<ChartDataPoints>(() => {
        let ya = 0, tidak = 0;
        members.forEach(m => {
            if (m.diakonia_recipient === 'Ya') ya++;
            else if (m.diakonia_recipient === 'Tidak') tidak++;
        });
        return {
            labels: ['Penerima', 'Bukan'],
            data: [ya, tidak],
            colors: ['#f59e0b', '#e2e8f0'],
            type: 'doughnut'
        };
    }, [members]);

    const sakramenData = useMemo<ChartDataPoints>(() => {
        const totalJiwa = stats?.totalSouls || 0;
        const belum = members.reduce((acc, m) => acc + (Number(m.familyMembersNonBaptized) || 0), 0);
        const sudahBaptis = Math.max(0, totalJiwa - belum);
        return {
            labels: ['Sudah Baptis', 'Belum Baptis'],
            data: [sudahBaptis, belum],
            colors: ['#3b82f6', '#94a3b8'],
            type: 'doughnut'
        };
    }, [members, stats]);

    const residencyData = useMemo<ChartDataPoints>(() => {
        const luar = members.reduce((acc, m) => acc + (Number(m.familyMembersOutside) || 0), 0);
        const totalJiwa = stats?.totalSouls || 0;
        const dalam = Math.max(0, totalJiwa - luar);
        return {
            labels: ['Kupang', 'Luar Kota'],
            data: [dalam, luar],
            colors: ['#10b981', '#f59e0b'],
            type: 'doughnut'
        };
    }, [members, stats]);

    const sidiCompositionData = useMemo<ChartDataPoints>(() => {
        const male = members.reduce((acc, m) => acc + (Number(m.familyMembersSidiMale) || 0), 0);
        const female = members.reduce((acc, m) => acc + (Number(m.familyMembersSidiFemale) || 0), 0);
        return {
            labels: ['Laki-laki', 'Perempuan'],
            data: [male, female],
            colors: ['#3b82f6', '#ec4899'],
            type: 'doughnut'
        };
    }, [members]);

    const diakoniaTrendData = useMemo<ChartDataPoints>(() => {
        const years: Record<string, number> = {};
        members.forEach(m => {
            const isRecipient = m.diakonia_recipient === 'Ya';
            const year = m.diakonia_year;
            if (isRecipient && year) {
                years[year] = (years[year] || 0) + 1;
            } else if (isRecipient) {
                // Fallback for missing year data but marked as recipient
                const currentYear = new Date().getFullYear().toString();
                years[currentYear] = (years[currentYear] || 0) + 1;
            }
        });

        let labels = Object.keys(years).sort();
        // If no data, provide a placeholder empty state so chart renders
        if (labels.length === 0) {
            labels = [new Date().getFullYear().toString()];
            years[labels[0]] = 0;
        }

        return {
            labels,
            data: labels.map(y => years[y]),
            colors: Array(labels.length).fill('#6366f1'),
            type: 'bar'
        };
    }, [members]);


    const candidates = useMemo(() => {
        return members.filter(m => (Number(m.familyMembersNonBaptized) || 0) > 0 || (Number(m.familyMembersNonSidi) || 0) > 0);
    }, [members]);

    const profAnalytics = useMemo(() => {
        const profs: any[] = [];

        members.forEach(m => {
            // Map Head of Household if they have skills or job category
            if (m.jobCategory && m.jobCategory !== '-') {
                profs.push({
                    id: m.id,
                    name: m.name,
                    category: m.jobCategory,
                    jobTitle: m.jobTitle || m.job || '-',
                    level: '2', // Default middle for head
                    willingness: m.willingnessToServe === 'Aktif' || m.willingnessToServe === 'Ya',
                    interestArea: m.interestAreas?.[0] || '-',
                    contributions: m.contributionTypes || [],
                    isHead: true,
                    phone: m.phone
                });
            }

            // Map Professional Family Members
            if (Array.isArray(m.professionalFamilyMembers)) {
                m.professionalFamilyMembers.forEach((pm) => {
                    profs.push({
                        id: `${m.id}-pm-${pm.name}`, // Use name or a unique identifier instead of idx
                        name: pm.name,
                        category: pm.skillType || '-',
                        jobTitle: pm.position || '-',
                        level: pm.skillLevel || '1',
                        willingness: pm.churchServiceInterest === 'Ya',
                        interestArea: pm.serviceInterestArea || '-',
                        contributions: pm.contributionForm || [],
                        isHead: false,
                        phone: m.phone
                    });
                });
            }
        });

        // 1. Service Willingness Score
        const willingCount = profs.filter(p => p.willingness).length;
        const willingnessRate = profs.length > 0 ? Math.round((willingCount / profs.length) * 100) : 0;

        // 2. Contribution Map
        const contMap: Record<string, number> = {};
        profs.forEach(p => p.contributions.forEach((c: string) => { contMap[c] = (contMap[c] || 0) + 1; }));
        const contributionChart: ChartDataPoints = {
            labels: Object.keys(contMap),
            data: Object.values(contMap),
            colors: Array(Object.keys(contMap).length).fill('#6366f1'),
            type: 'bar'
        };

        // 3. Interest Alignment (Sesuai Profesi vs Lintas)
        let sesuai = 0, lintas = 0;
        profs.filter(p => p.willingness).forEach(p => {
            if (p.category.toLowerCase().includes(p.interestArea.toLowerCase()) ||
                p.interestArea.toLowerCase().includes(p.category.toLowerCase())) sesuai++;
            else lintas++;
        });
        const alignmentChart: ChartDataPoints = {
            labels: ['Sesuai Profesi', 'Lintas Profesi'],
            data: [sesuai, lintas],
            colors: ['#10b981', '#f59e0b'],
            type: 'doughnut'
        };

        // 4. Top 5 Skills
        const skillCats: Record<string, number> = {};
        profs.forEach(p => { skillCats[p.category] = (skillCats[p.category] || 0) + 1; });
        const top5 = Object.entries(skillCats).sort((a, b) => b[1] - a[1]).slice(0, 5);
        const topSkillsChart: ChartDataPoints = {
            labels: top5.map(e => e[0]),
            data: top5.map(e => e[1]),
            colors: ['#6366f1', '#818cf8', '#94a3b8', '#cbd5e1', '#e2e8f0'],
            type: 'bar'
        };

        // 5. Level Distribution per Category
        const levels: Record<string, number[]> = {}; // [L1, L2, L3]
        top5.forEach(([cat]) => {
            const counts = [0, 0, 0];
            profs.filter(p => p.category === cat).forEach(p => {
                const lvl = parseInt(p.level) || 1;
                counts[lvl - 1]++;
            });
            levels[cat] = counts;
        });

        // Final Expert List based on filters
        const filteredExperts = profs.filter(p => {
            const sMatch = !profFilter.skill || p.category === profFilter.skill;
            const lMatch = !profFilter.level || p.level === profFilter.level;
            const wMatch = !profFilter.willingness || (profFilter.willingness === 'Ya' ? p.willingness : !p.willingness);
            const cMatch = !profFilter.contribution || p.contributions.includes(profFilter.contribution);
            return sMatch && lMatch && wMatch && cMatch;
        });

        return {
            allProfs: profs,
            willingnessRate,
            contributionChart,
            alignmentChart,
            topSkillsChart,
            levels,
            filteredExperts,
            uniqueSkills: Object.keys(skillCats).sort()
        };
    }, [members, profFilter]);

    // Tab: Komitmen
    const willingnessData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'doughnut' };
        const w = stats.distributions.willingness;
        return {
            labels: ['Aktif', 'On-demand'],
            data: [w['Aktif'] || 0, w['On-demand'] || 0],
            colors: ['#10b981', '#fbbf24'],
            type: 'doughnut'
        };
    }, [stats]);

    const interestAreasData = useMemo<ChartDataPoints>(() => {
        const areas: Record<string, number> = {};
        members.forEach(m => {
            if (Array.isArray(m.interestAreas)) {
                m.interestAreas.forEach(a => { areas[a] = (areas[a] || 0) + 1; });
            }
        });
        const sorted = Object.entries(areas).sort((a, b) => b[1] - a[1]).slice(0, 6);
        return {
            labels: sorted.map(e => e[0]),
            data: sorted.map(e => e[1]),
            colors: Array(sorted.length).fill('#a78bfa'),
            type: 'bar'
        };
    }, [members]);

    const contributionData = useMemo<ChartDataPoints>(() => {
        const types: Record<string, number> = {};
        members.forEach(m => {
            if (Array.isArray(m.contributionTypes)) {
                m.contributionTypes.forEach(c => { types[c] = (types[c] || 0) + 1; });
            }
        });
        const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 6);
        return {
            labels: sorted.map(e => e[0]),
            data: sorted.map(e => e[1]),
            colors: Array(sorted.length).fill('#f472b6'),
            type: 'bar'
        };
    }, [members]);

    // Tab: Pendidikan Anak
    const schoolingStatusData = useMemo<ChartDataPoints>(() => {
        const s: Record<string, number> = { 'Ya': 0, 'Tidak': 0, 'No Kids': 0 };
        members.forEach(m => {
            if (m.education_schoolingStatus === 'Ya') s['Ya']++;
            else if (m.education_schoolingStatus === 'Tidak') s['Tidak']++;
            else s['No Kids']++;
        });
        return {
            labels: ['Sekolah', 'Tidak', 'N/A'],
            data: [s['Ya'], s['Tidak'], s['No Kids']],
            colors: ['#10b981', '#f43f5e', '#e2e8f0'],
            type: 'doughnut'
        };
    }, [members]);

    const schoolLevelData = useMemo<ChartDataPoints>(() => {
        let tk = 0, sd = 0, smp = 0, sma = 0, univ = 0;
        members.forEach(m => {
            tk += Number(m.education_inSchool_tk_paud) || 0;
            sd += Number(m.education_inSchool_sd) || 0;
            smp += Number(m.education_inSchool_smp) || 0;
            sma += Number(m.education_inSchool_sma) || 0;
            univ += Number(m.education_inSchool_university) || 0;
        });
        return {
            labels: ['TK', 'SD', 'SMP', 'SMA', 'PT'],
            data: [tk, sd, smp, sma, univ],
            colors: ['#fcd34d', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981'],
            type: 'bar'
        };
    }, [members]);

    const dropoutData = useMemo<ChartDataPoints>(() => {
        let sd = 0, smp = 0, sma = 0, univ = 0;
        members.forEach(m => {
            sd += Number(m.education_dropout_sd) || 0;
            smp += Number(m.education_dropout_smp) || 0;
            sma += Number(m.education_dropout_sma) || 0;
            univ += Number(m.education_dropout_university) || 0;
        });
        return {
            labels: ['SD', 'SMP', 'SMA', 'PT'],
            data: [sd, smp, sma, univ],
            colors: ['#f43f5e', '#f59e0b', '#eab308', '#a855f7'],
            type: 'bar'
        };
    }, [members]);

    // Tab: Ekonomi
    const incomeData = useMemo<ChartDataPoints>(() => {
        const ranges: Record<string, number> = {};
        members.forEach(m => {
            if (m.economics_incomeRange) ranges[m.economics_incomeRange] = (ranges[m.economics_incomeRange] || 0) + 1;
        });
        const sorted = Object.entries(ranges).sort((a, b) => b[1] - a[1]);
        return {
            labels: sorted.map(e => e[0]),
            data: sorted.map(e => e[1]),
            colors: Array(sorted.length).fill('#34d399'),
            type: 'bar'
        };
    }, [members]);

    const houseStatusData = useMemo<ChartDataPoints>(() => {
        const s: Record<string, number> = {};
        members.forEach(m => {
            if (m.economics_houseStatus) s[m.economics_houseStatus] = (s[m.economics_houseStatus] || 0) + 1;
        });
        return {
            labels: Object.keys(s),
            data: Object.values(s),
            colors: ['#60a5fa', '#fbbf24', '#a78bfa', '#f472b6'],
            type: 'bar'
        };
    }, [members]);

    const businessData = useMemo<ChartDataPoints>(() => {
        let ya = 0, tidak = 0;
        members.forEach(m => {
            if (m.economics_hasBusiness === 'Ya') ya++;
            else if (m.economics_hasBusiness === 'Tidak') tidak++;
        });
        return {
            labels: ['Punya Usaha', 'Tidak'],
            data: [ya, tidak],
            colors: ['#4ade80', '#e2e8f0'],
            type: 'doughnut'
        };
    }, [members]);

    const businessTypeData = useMemo<ChartDataPoints>(() => {
        const types: Record<string, number> = {};
        members.forEach(m => {
            if (m.economics_hasBusiness === 'Ya' && m.economics_businessType) {
                types[m.economics_businessType] = (types[m.economics_businessType] || 0) + 1;
            }
        });
        const sorted = Object.entries(types).sort((a, b) => b[1] - a[1]).slice(0, 6);
        return {
            labels: sorted.map(e => e[0]),
            data: sorted.map(e => e[1]),
            colors: Array(sorted.length).fill('#fbbf24'),
            type: 'bar'
        };
    }, [members]);

    // Tab: Kesehatan
    const bpjsData = useMemo<ChartDataPoints>(() => {
        const b: Record<string, number> = {};
        members.forEach(m => {
            if (m.health_hasBPJS && m.health_hasBPJS !== '-') b[m.health_hasBPJS] = (b[m.health_hasBPJS] || 0) + 1;
        });
        return {
            labels: Object.keys(b),
            data: Object.values(b),
            colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
            type: 'bar'
        };
    }, [members]);

    const chronicData = useMemo<ChartDataPoints>(() => {
        let ya = 0, tidak = 0;
        members.forEach(m => {
            if (m.health_chronicSick === 'Ya') ya++;
            else if (m.health_chronicSick === 'Tidak') tidak++;
        });
        return {
            labels: ['Ada Kronis', 'Tidak'],
            data: [ya, tidak],
            colors: ['#ef4444', '#e2e8f0'],
            type: 'doughnut'
        };
    }, [members]);

    const socialAssistData = useMemo<ChartDataPoints>(() => {
        const s: Record<string, number> = {};
        members.forEach(m => {
            if (m.health_socialAssistance && m.health_socialAssistance !== '-') s[m.health_socialAssistance] = (s[m.health_socialAssistance] || 0) + 1;
        });
        return {
            labels: Object.keys(s),
            data: Object.values(s),
            colors: ['#8b5cf6', '#cbd5e1'],
            type: 'doughnut'
        };
    }, [members]);

    const disabilityCount = useMemo(() => members.filter(m => m.health_hasDisability === 'Ya').length, [members]);
    const workingChildrenCount = useMemo(() => members.reduce((acc, m) => acc + (Number(m.education_working) || 0), 0), [members]);

    // ─────────────────────────────
    // RENDER CHART CARDS PER TAB
    // ─────────────────────────────
    const sections = {
        identitas: (
            <div className="mb-8" key="identitas">
                {activeTab === 'semua' && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">badge</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Data Umum Keluarga</h3>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <CountCard title="Total Kepala Keluarga" subtitle="Kepala Keluarga terdaftar" value={stats?.total || 0} icon="home" gradient="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400" />
                    <CountCard title="Total Jemaat" subtitle="Jumlah anggota keluarga" value={stats?.totalSouls || 0} icon="groups" gradient="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" />
                    <ChartCard title="Rasio Gender" subtitle="Distribusi L/P anggota keluarga" data={genderData} />
                    <ChartCard title="Distribusi Lingkungan" subtitle="Jumlah KK per Lingkungan" data={lingkunganData} />
                    <ChartCard title="Distribusi Rayon" subtitle="Jumlah KK per Rayon" data={rayonData} />
                </div>

                <div className="mt-6 md:mt-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-base md:text-lg text-slate-900 dark:text-white">Alamat & Lokasi Jemaat</h3>
                            <p className="text-[10px] md:text-xs text-slate-500">Daftar alamat lengkap yang dapat difilter</p>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={tableFilter.rayon}
                                onChange={e => setTableFilter(f => ({ ...f, rayon: e.target.value }))}
                                className="text-[10px] md:text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-2 md:px-3 py-2 font-bold focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Semua Rayon</option>
                                {Object.keys(stats?.distributions.rayon || {}).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <select
                                value={tableFilter.lingkungan}
                                onChange={e => setTableFilter(f => ({ ...f, lingkungan: e.target.value }))}
                                className="text-[10px] md:text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-2 md:px-3 py-2 font-bold focus:ring-2 focus:ring-primary/20"
                            >
                                <option value="">Semua Lingkungan</option>
                                {Object.keys(stats?.distributions.lingkungan || {}).map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-xs md:text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 font-bold">
                                <tr>
                                    <th className="px-4 md:px-6 py-3 md:py-4">Nama</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4">Rayon/Ling</th>
                                    <th className="hidden md:table-cell px-4 md:px-6 py-3 md:py-4">Alamat</th>
                                    <th className="px-4 md:px-6 py-3 md:py-4 text-right md:text-left">Telepon</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {addressTableData.slice(0, 8).map(m => (
                                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 md:px-6 py-3 md:py-4 font-bold text-slate-700 dark:text-slate-200 truncate max-w-[120px] md:max-w-none">{m.name}</td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-medium whitespace-nowrap">
                                            R: {m.rayon} / L: {m.lingkungan}
                                        </td>
                                        <td className="hidden md:table-cell px-4 md:px-6 py-3 md:py-4 text-xs text-slate-500 max-w-xs truncate">{m.address}</td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-primary text-right md:text-left">{m.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {addressTableData.length > 8 && (
                        <div className="p-3 md:p-4 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/30">
                            <button onClick={() => navigate('/admin/members')} className="text-[10px] md:text-xs font-black text-primary hover:underline uppercase tracking-widest">Lihat Selengkapnya ({addressTableData.length - 8} data)</button>
                        </div>
                    )}
                </div>
            </div>
        ),
        keluarga: (
            <div className="mb-8" key="keluarga">
                {activeTab === 'semua' && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">diversity_3</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Informasi Anggota Keluarga</h3>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <ChartCard title="Progress Sakramen" subtitle="Status Baptis Jemaat" data={sakramenData} />
                    <ChartCard title="Komposisi Sidi" subtitle="Distribusi L/P Sidi" data={sidiCompositionData} />
                    <ChartCard title="Domisili Jemaat" subtitle="Rasio Menetap vs Diaspora" data={residencyData} />
                    <ChartCard title="Penerima Diakonia" subtitle="KK penerima bantuan gereja" data={diakoniaData} />
                    <ChartCard title="Tren Diakonia" subtitle="Penerima dari tahun ke tahun" data={diakoniaTrendData} />
                </div>

                {/* Candidate List Filter */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
                    <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50">
                        <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Daftar Calon Baptis / Sidi</h4>
                            <p className="text-xs text-slate-500 font-medium">Otomatis menyaring anggota keluarga dengan data sakramen kosong</p>
                        </div>
                        <div className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">{candidates.length} JIWA</div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white dark:bg-slate-900">
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Nama Kepala Keluarga</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Kebutuhan Baptis</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Kebutuhan Sidi</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {candidates.slice(0, 5).map(m => (
                                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-8 py-5 font-bold text-slate-700 dark:text-slate-200">{m.name}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${Number(m.familyMembersNonBaptized) > 0 ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {m.familyMembersNonBaptized || 0} Jiwa
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${Number(m.familyMembersNonSidi) > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {m.familyMembersNonSidi || 0} Jiwa
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button
                                                onClick={() => setSelectedFamilyForDiakonia(m)}
                                                className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
                                            >
                                                Cek Riwayat
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ),
        profesional: (
            <div className="mb-8" key="profesional">
                {activeTab === 'semua' && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">work</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Profesional & Akademik</h3>
                    </div>
                )}

                {/* 1. Top Scorecards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                        <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-8xl text-primary">volunteer_activism</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Indeks Kesediaan Melayani</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-slate-900 dark:text-white">{profAnalytics.willingnessRate}%</span>
                            <span className="text-xs font-bold text-emerald-500">Willing</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 font-medium">Jiwa dari total jemaat terampil</p>
                    </div>

                    <CountCard title="Penerima Diakonia" subtitle="KK penerima bantuan gereja" value={diakoniaData.data[0] || 0} icon="handshake" gradient="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" />
                    <CountCard title="Total Tenaga Ahli" subtitle="Jiwa dengan kualifikasi khusus" value={profAnalytics.allProfs.length} icon="engineering" gradient="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400" />
                    <ChartCard title="Minat Pelayanan" subtitle="Alignment Profesi vs Minat" data={profAnalytics.alignmentChart} />
                </div>

                {/* 2. Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <ChartCard title="Peta Kontribusi" subtitle="Distribusi bentuk kontribusi" data={profAnalytics.contributionChart} />
                    <ChartCard title="Top 5 Kategori Keahlian" subtitle="Bidang utama jemaat" data={profAnalytics.topSkillsChart} />

                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
                        <div className="mb-6">
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">Distribusi Tingkat Keahlian</h3>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5">Sebaran Level 1-3 per Kategori</p>
                        </div>
                        <div className="flex-1 space-y-4">
                            {Object.entries(profAnalytics.levels).map(([cat, counts]) => {
                                const total = counts.reduce((a, b) => a + b, 0);
                                return (
                                    <div key={cat} className="space-y-1">
                                        <div className="flex justify-between items-center text-[10px] font-bold">
                                            <span className="text-slate-600 dark:text-slate-400">{cat}</span>
                                            <span className="text-slate-900 dark:text-white">{total} Jiwa</span>
                                        </div>
                                        <div className="h-2 rounded-full flex overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <div className="h-full bg-slate-300" style={{ width: `${(counts[0] / total) * 100}%` }} title="Level 1"></div>
                                            <div className="h-full bg-primary/60" style={{ width: `${(counts[1] / total) * 100}%` }} title="Level 2"></div>
                                            <div className="h-full bg-primary" style={{ width: `${(counts[2] / total) * 100}%` }} title="Level 3"></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-4 flex gap-4 justify-center">
                            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-slate-300"></span><span className="text-[9px] font-bold text-slate-400 uppercase">Lvl 1</span></div>
                            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary/60"></span><span className="text-[9px] font-bold text-slate-400 uppercase">Lvl 2</span></div>
                            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary"></span><span className="text-[9px] font-bold text-slate-400 uppercase">Lvl 3</span></div>
                        </div>
                    </div>
                </div>

                {/* 3. Expert filtering & Table */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Daftar Tenaga Ahli</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Saring personil untuk kebutuhan kegiatan jemaat</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-1.5 rounded-full uppercase tracking-widest">{profAnalytics.filteredExperts.length} HASIL</span>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Keahlian</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 ring-primary/20 transition-all"
                                    value={profFilter.skill}
                                    onChange={(e) => setProfFilter({ ...profFilter, skill: e.target.value })}
                                >
                                    <option value="">Semua Kategori</option>
                                    {profAnalytics.uniqueSkills.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Level</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 ring-primary/20 transition-all"
                                    value={profFilter.level}
                                    onChange={(e) => setProfFilter({ ...profFilter, level: e.target.value })}
                                >
                                    <option value="">Semua Level</option>
                                    <option value="1">Level 1 (Pemula)</option>
                                    <option value="2">Level 2 (Menengah)</option>
                                    <option value="3">Level 3 (Ahli)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kesediaan</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 ring-primary/20 transition-all"
                                    value={profFilter.willingness}
                                    onChange={(e) => setProfFilter({ ...profFilter, willingness: e.target.value })}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="Ya">Bersedia Melayani</option>
                                    <option value="Tidak">Belum Bersedia</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bentuk Kontribusi</label>
                                <select
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 ring-primary/20 transition-all"
                                    value={profFilter.contribution}
                                    onChange={(e) => setProfFilter({ ...profFilter, contribution: e.target.value })}
                                >
                                    <option value="">Semua Kontribusi</option>
                                    <option value="Tenaga">Tenaga</option>
                                    <option value="Pikiran">Pikiran</option>
                                    <option value="Waktu">Waktu</option>
                                    <option value="Dana/Materi">Dana/Materi</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto h-[400px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-10 bg-white dark:bg-slate-900 shadow-sm shadow-slate-100 dark:shadow-slate-800">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Nama Lengkap</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Profesi / Keahlian</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Jabatan / Posisi</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Lvl</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-right">Kontak</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {profAnalytics.filteredExperts.map((p) => (
                                    <tr key={p.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{p.name}</span>
                                                {p.isHead && <span className="text-[8px] font-black text-primary uppercase mt-0.5">Kepala Keluarga</span>}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">{p.category}</span>
                                        </td>
                                        <td className="px-8 py-5 text-xs font-medium text-slate-500">{p.jobTitle}</td>
                                        <td className="px-8 py-5">
                                            <span className={`size-6 rounded-lg flex items-center justify-center text-[10px] font-black ${p.level === '3' ? 'bg-primary text-white' :
                                                p.level === '2' ? 'bg-primary/20 text-primary' :
                                                    'bg-slate-100 text-slate-400'
                                                }`}>
                                                {p.level}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right font-black text-primary text-xs">{p.phone || '-'}</td>
                                    </tr>
                                ))}
                                {profAnalytics.filteredExperts.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 italic font-medium">Tidak ada tenaga ahli yang cocok dengan kriteria filter tersebut.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        ),
        komitmen: (
            <div className="mb-8" key="komitmen">
                {activeTab === 'semua' && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">volunteer_activism</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Komitmen Pelayanan</h3>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ChartCard title="Minat Pelayanan" subtitle="Kesediaan kepala keluarga" data={willingnessData} />
                    <ChartCard title="Area Pelayanan" subtitle="Bidang minat (aggregated)" data={interestAreasData} />
                    <ChartCard title="Bentuk Kontribusi" subtitle="Jenis kontribusi (aggregated)" data={contributionData} />
                </div>
            </div>
        ),
        pendidikan: (
            <div className="mb-8" key="pendidikan">
                {activeTab === 'semua' && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Pendidikan Anak</h3>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ChartCard title="Status Sekolah Anak" subtitle="KK dengan anak sekolah" data={schoolingStatusData} />
                    <ChartCard title="Anak Bersekolah" subtitle="Total anak per jenjang" data={schoolLevelData} />
                    <ChartCard title="Putus Sekolah" subtitle="Total anak putus sekolah" data={dropoutData} />
                    <CountCard title="Anak Bekerja" subtitle="Total anak sudah bekerja" value={workingChildrenCount} icon="work" gradient="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400" />
                </div>
            </div>
        ),
        ekonomi: (
            <div className="mb-8" key="ekonomi">
                {activeTab === 'semua' && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">paid</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Ekonomi & Aset</h3>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ChartCard title="Pendapatan (KK)" subtitle="Range pendapatan rumah tangga" data={incomeData} />
                    <ChartCard title="Status Rumah" subtitle="Kepemilikan rumah keluarga" data={houseStatusData} />
                    <ChartCard title="Kepemilikan Usaha" subtitle="Punya usaha produktif?" data={businessData} />
                    <ChartCard title="Jenis Usaha" subtitle="Kategori usaha keluarga" data={businessTypeData} />
                </div>
            </div>
        ),
        kesehatan: (
            <div className="mb-8" key="kesehatan">
                {activeTab === 'semua' && (
                    <div className="flex items-center gap-3 mb-6">
                        <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">health_and_safety</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Kesehatan & Disabilitas</h3>
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ChartCard title="Cakupan BPJS" subtitle="Status kepesertaan KK" data={bpjsData} />
                    <ChartCard title="Penyakit Kronis" subtitle="KK dengan riwayat kronis" data={chronicData} />
                    <CountCard title="Disabilitas" subtitle="Jiwa dengan disabilitas" value={disabilityCount} icon="accessible" gradient="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400" />
                    <ChartCard title="Bantuan Sosial" subtitle="Penerima bantuan bansos" data={socialAssistData} />
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
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-sm">
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
                            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
                        >
                            Coba Lagi
                        </button>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard Overview">

            {/* 1. Integrated Hero Section (Greeting + Actions) */}
            <div className="mb-8 animate-fade-in-up">
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                    {/* Background Accents - Toned down for better contrast */}
                    <div className="absolute right-0 top-0 w-full md:w-2/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none transition-all duration-1000"></div>
                    <div className="absolute -right-16 -top-16 size-48 md:size-96 bg-primary/5 rounded-full blur-3xl opacity-50"></div>

                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative z-10">
                        <div className="flex-1 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white/10 text-white dark:text-white text-[10px] font-black tracking-widest uppercase mb-6 shadow-lg shadow-black/10">
                                <span className="size-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                DATA CENTER ACTIVE
                            </div>
                            <h2 className="text-4xl md:text-5xl xl:text-6xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-[1] md:leading-[1.1]">
                                Halo, {profile?.firstName || user?.name || 'Admin'}! 👋
                            </h2>
                            <p className="text-sm md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-lg">
                                Selamat datang kembali di Pusat Data Jemaat. Kelola <strong className="text-slate-900 dark:text-white font-black px-1.5 py-0.5 bg-primary/10 rounded-md">{stats?.total || 0} KK</strong> secara efisien dan akurat.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/pendaftaran')}
                                    className="px-8 py-4 bg-slate-900 dark:bg-primary text-white font-black text-xs md:text-sm rounded-2xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
                                >
                                    <span className="material-symbols-outlined">person_add</span>
                                    INPUT DATA BARU
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-black text-xs md:text-sm rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 border-2 border-slate-100 dark:border-slate-700 shadow-md hover:-translate-y-1 active:scale-95"
                                >
                                    <span className="material-symbols-outlined">download_for_offline</span>
                                    EXPORT DATA
                                </button>
                            </div>
                        </div>

                        <div className="w-full xl:w-auto flex flex-col gap-6">
                            {/* Stats Summary Boxes - Fixed for Split Screen */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center min-w-[180px]">
                                    <span className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Sidi</span>
                                    <div className="flex items-end gap-1">
                                        <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-primary leading-none">{stats?.totalSidi || 0}</span>
                                        <span className="text-[10px] font-bold text-slate-400 mb-1">Jiwa</span>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-center min-w-[180px]">
                                    <span className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Jiwa</span>
                                    <div className="flex items-end gap-1">
                                        <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-none">{stats?.totalSouls || 0}</span>
                                        <span className="text-[10px] font-bold text-slate-400 mb-1">Live</span>
                                    </div>
                                </div>
                            </div>

                            {/* Search & Tabs - Increased Contrast */}
                            <div className="flex flex-col gap-4">
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl transition-colors group-focus-within:text-primary">person_search</span>
                                    <input
                                        type="text"
                                        placeholder="Cari Nama / NIK Warga..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-14 pr-6 py-4.5 rounded-[1.5rem] bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary shadow-sm transition-all text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl">grid_view</span>
                                    <select
                                        value={activeTab}
                                        onChange={(e) => setActiveTab(e.target.value as TabKey)}
                                        className="w-full pl-14 pr-12 py-4.5 rounded-[1.5rem] bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-[11px] font-black tracking-widest uppercase appearance-none cursor-pointer focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-slate-900 dark:text-white"
                                    >
                                        {TABS.map(tab => <option key={tab.key} value={tab.key} className="text-slate-900 dark:text-white">{tab.label === 'Semua' ? 'DISPLAY ALL METRICS' : tab.label}</option>)}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-2xl">unfold_more</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Display (Inline Shadow Card) */}
            {searchQuery && (
                <div className="mb-10 animate-fade-in-up relative z-20">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl ring-1 ring-black/5">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h4 className="text-[10px] font-black text-slate-400 tracking-widest uppercase">HASIL PENCARIAN ({filteredMembers.length})</h4>
                            <button onClick={() => setSearchQuery('')} className="text-[10px] font-black text-primary hover:underline">TUTUP</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredMembers.slice(0, 6).map(m => (
                                <div key={m.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-primary/30 transition-all shadow-sm active:scale-[0.98]">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{m.name}</span>
                                        <span className="text-[10px] text-slate-500 font-medium">NIK: {m.nik || '-'}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/admin/members/${m.id}`)}
                                            className="size-8 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-colors hover:bg-white dark:hover:bg-slate-600 shadow-inner"
                                        >
                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                        </button>
                                        <a
                                            href={`https://wa.me/${m.phone?.replace(/\D/g, '').replace(/^0/, '62')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="size-8 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                                        >
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                        </a>
                                    </div>
                                </div>
                            ))}
                            {filteredMembers.length === 0 && (
                                <div className="col-span-full py-8 text-center text-slate-400 text-sm font-medium">
                                    Tidak ada jemaat yang cocok dengan pencarian "{searchQuery}"
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Tab-Specific Chart Cards */}
            <div className="animate-fade-in-up duration-700">
                {renderTabContent()}
            </div>

            {/* Diakonia History Modal */}
            {selectedFamilyForDiakonia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedFamilyForDiakonia(null)}></div>
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-[1.25rem] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                                        <span className="material-symbols-outlined text-3xl">history</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Riwayat Diakonia</h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{selectedFamilyForDiakonia.name}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedFamilyForDiakonia(null)} className="size-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border-2 border-dashed border-slate-200 dark:border-slate-700">
                                {selectedFamilyForDiakonia.diakonia_recipient === 'Ya' ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center text-white">
                                                <span className="material-symbols-outlined">check_circle</span>
                                            </div>
                                            <div className="text-sm font-bold text-slate-900 dark:text-white">Penerima Aktif</div>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium pl-14">
                                            Keluarga ini telah menerima bantuan <strong className="text-indigo-600 dark:text-indigo-400 font-black decoration-indigo-500/30 decoration-4 underline uppercase">{selectedFamilyForDiakonia.diakonia_type || 'Umum'}</strong> pada periode anggaran tahun <strong className="text-slate-900 dark:text-white font-black">{selectedFamilyForDiakonia.diakonia_year || '-'}</strong>.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">info</span>
                                        <p className="text-sm text-slate-400 italic font-medium">Keluarga ini belum pernah terdaftar sebagai penerima bantuan diakonia.</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedFamilyForDiakonia(null)}
                                className="w-full mt-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs tracking-[0.2em] uppercase rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/5"
                            >
                                KONFIRMASI & TUTUP
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default AdminDashboard;
