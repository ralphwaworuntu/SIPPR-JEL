import { useState, useMemo, useEffect } from 'react';
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

type TabKey = 'semua' | 'identitas' | 'keluarga' | 'profesional' | 'komitmen' | 'pendidikan' | 'ekonomi' | 'kesehatan';

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
const ChartCard = ({ title, subtitle, icon, iconColor, data, className = "" }: { title: string; subtitle: string; icon: string; iconColor: string; data: ChartDataPoints; className?: string }) => {
    const [viewType, setViewType] = useState<'chart' | 'table'>('chart');
    const centerValue = useMemo(() => data.data.reduce((acc, val) => acc + val, 0), [data.data]);
    const isEmpty = centerValue === 0;

    const chartJsData = {
        labels: data.labels,
        datasets: [{
            data: isEmpty ? data.labels.map(() => 1) : data.data,
            backgroundColor: isEmpty ? data.labels.map(() => '#f1f5f9') : data.colors,
            borderColor: 'transparent',
            borderRadius: data.type === 'bar' ? 12 : 0,
            borderSkipped: false,
            hoverOffset: isEmpty ? 0 : 15,
        }]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: !isEmpty }
        },
        scales: {
            y: {
                display: false,
                beginAtZero: true,
                suggestedMax: isEmpty ? 1 : undefined
            },
            x: {
                grid: { display: false },
                ticks: {
                    display: data.labels.length <= 12,
                    font: { size: 9, weight: 800 },
                    color: '#94a3b8'
                },
                border: { display: false }
            }
        }
    };

    return (
        <div className={`bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 border border-slate-200 dark:border-white/5 shadow-card transition-all duration-500 flex flex-col group relative overflow-hidden ${className}`}>
            <div className="flex items-center justify-between mb-8 relative z-10 shrink-0">
                <div className="flex items-center gap-4 min-w-0 pr-4">
                    <div className="size-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 transition-transform group-hover:scale-110 duration-500" style={{ backgroundColor: iconColor }}>
                        <span className="material-symbols-outlined text-2xl filled">{icon}</span>
                    </div>
                    <div className="min-w-0 pr-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{subtitle}</p>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{title}</h3>
                    </div>
                </div>
                <div className="flex bg-slate-50 dark:bg-white/5 rounded-xl p-1 shrink-0">
                    <button onClick={() => setViewType('chart')} disabled={isEmpty} className={`p-2 rounded-lg transition-all ${viewType === 'chart' ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-slate-400'} ${isEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <span className="material-symbols-outlined text-sm filled">analytics</span>
                    </button>
                    <button onClick={() => setViewType('table')} disabled={isEmpty} className={`p-2 rounded-lg transition-all ${viewType === 'table' ? 'bg-white dark:bg-slate-800 shadow-md text-primary' : 'text-slate-400'} ${isEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 relative z-10">
                {viewType === 'chart' ? (
                    <div className="w-full flex-1 flex items-center justify-center min-h-0">
                        {data.type === 'doughnut' ? (
                            <div className="relative w-full h-full max-h-[220px] flex items-center justify-center">
                                <Doughnut data={chartJsData} options={{ cutout: '82%', plugins: { legend: { display: false }, tooltip: { enabled: !isEmpty } }, maintainAspectRatio: false }} />
                                <div className="absolute flex flex-col items-center pointer-events-none">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{centerValue}</span>
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{data.totalLabel || 'TOTAL'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full max-h-[220px]">
                                <Bar data={chartJsData} options={barOptions} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto w-full custom-scrollbar pr-2 min-h-0">
                        <table className="w-full text-[11px] text-left border-separate border-spacing-y-1">
                            <tbody>
                                {data.labels.map((label, idx) => (
                                    <tr key={label} className="group/row bg-slate-50/80 dark:bg-white/5 rounded-xl transition-all">
                                        <td className="py-2.5 pl-3 font-bold text-slate-600 dark:text-slate-400 rounded-l-xl border-l-4" style={{ borderColor: isEmpty ? '#f1f5f9' : data.colors[idx] }}>{label}</td>
                                        <td className="py-2.5 text-right text-slate-900 dark:text-white font-black pr-3 rounded-r-xl">{data.data[idx]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {viewType === 'chart' && !isEmpty && (
                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 shrink-0 overflow-x-auto custom-scrollbar-h">
                    <div className="flex flex-wrap gap-4 pb-2">
                        {data.labels.map((l, i) => (
                            <div key={l} className="flex items-center gap-2 whitespace-nowrap">
                                <div className="size-2 rounded-full" style={{ backgroundColor: data.colors[i % data.colors.length] }}></div>
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{l}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ─────────────────────────────────────────
// Redesigned Dashboard Components
// ─────────────────────────────────────────

const MetricCard = ({ title, value, subValue, trend, gradient, icon, onClick }: { title: string; value: string | number; subValue: string; trend?: string; gradient?: string; icon: string; onClick?: () => void }) => (
    <div
        onClick={onClick}
        className={`rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between group h-48 relative overflow-hidden border shadow-card border-slate-100 dark:border-white/5 ${gradient ? gradient : 'bg-white dark:bg-slate-900'} ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''} ${!gradient && 'hover:-translate-y-1'}`}
    >
        <div className="flex justify-between items-start relative z-10">
            <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${gradient ? 'text-white/60' : 'text-slate-400'}`}>{title}</p>
                <div className="flex items-baseline gap-2">
                    <h4 className={`text-3xl font-black tracking-tighter leading-none ${gradient ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{value.toLocaleString()}</h4>
                    <span className={`text-[8px] font-bold ${gradient ? 'text-white/40' : 'text-slate-400'}`}>TOTAL</span>
                </div>
            </div>
            <div className={`size-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${gradient
                ? 'bg-white/20 text-white'
                : 'bg-slate-50 dark:bg-white/5 text-slate-400'
                }`}>
                <span className="material-symbols-outlined text-[24px] filled">{icon}</span>
            </div>
        </div>

        <div className="mt-4 relative z-10">
            <div className="flex items-center justify-between">
                <p className={`text-[11px] font-bold ${gradient ? 'text-white/80' : 'text-slate-400'}`}>{subValue}</p>
                {trend && (
                    <span className={`text-[9px] font-black px-2 py-1 rounded-lg ${gradient ? 'bg-white/30 text-white' : 'bg-emerald-50 text-emerald-600'}`}>+{trend}</span>
                )}
            </div>
        </div>
    </div>
);










// ─────────────────────────────────────────
// Legacy Stat Count Card (Restored for detail tabs)
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

    const [showRecentModal, setShowRecentModal] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);


    const [globalFilterRayon, setGlobalFilterRayon] = useState('Semua');
    const [globalFilterLingkungan, setGlobalFilterLingkungan] = useState('Semua');

    const lingkunganRayonMap: Record<string, number[]> = {
        '1': [1, 2, 17],
        '2': [12, 13, 16],
        '3': [7, 14, 15],
        '4': [3, 8, 9],
        '5': [5, 10],
        '6': [6, 20],
        '7': [4, 18],
        '8': [11, 19],
    };

    const availableRayons = globalFilterLingkungan !== 'Semua' ? lingkunganRayonMap[globalFilterLingkungan] || [] : Array.from({ length: 20 }, (_, i) => i + 1);


    const { data: stats, isLoading: isStatsLoading, isError: isStatsError, error: statsError } = useDashboardStats(globalFilterRayon, globalFilterLingkungan);
    const { members: allMembers, isLoading: isMembersLoading, isError: isMembersError } = useMemberData();

    // Filter members based on global filters
    const members = useMemo(() => {
        if (!allMembers) return [];
        return allMembers.filter(m => {
            const rMatch = globalFilterRayon === 'Semua' || m.rayon === globalFilterRayon;
            const lMatch = globalFilterLingkungan === 'Semua' || m.lingkungan === globalFilterLingkungan;
            return rMatch && lMatch;
        });
    }, [allMembers, globalFilterRayon, globalFilterLingkungan]);







    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    const user = session?.user;



    const recentMembers = useMemo(() => {
        if (!members) return [];
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        return members
            .filter(m => m.createdAt && new Date(m.createdAt) >= thirtyDaysAgo)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [members]);


    const filteredMembers = useMemo(() => {
        if (!members) return [];
        return members.filter(m => {
            const search = searchQuery.toLowerCase();
            return m.name.toLowerCase().includes(search) ||
                (m.nik && m.nik.includes(search)) ||
                (m.kkNumber && m.kkNumber.includes(search));
        });
    }, [members, searchQuery]);



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

    const sakramenData = useMemo<ChartDataPoints>(() => {
        const totalJiwa = stats?.totalSouls || 0;
        const belum = members.reduce((acc, m) => acc + (Number(m.familyMembersNonBaptized) || 0), 0);
        const sudahBaptis = Math.max(0, totalJiwa - belum);
        return {
            labels: ['Sudah Baptis', 'Belum Baptis'],
            data: [sudahBaptis, belum],
            colors: ['#064e1c', '#94a3b8'],
            type: 'doughnut'
        };
    }, [members, stats]);

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




    const profAnalytics = useMemo(() => {
        const profs: any[] = [];

        members.forEach(m => {
            // Map Head of Household if they have skills or job category
            if (m.jobCategory && m.jobCategory !== '-') {
                profs.push({
                    id: m.id,
                    name: m.name,
                    category: m.jobCategory,
                    jobTitle: m.jobTitle || '-',
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

        // Final Expert List
        const filteredExperts = profs;

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
    }, [members]);

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



    const workingChildrenCount = useMemo(() => members.reduce((acc, m) => acc + (Number(m.education_working) || 0), 0), [members]);

    // NEW CHARTS: Ekonomic
    const assetsData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'bar' };
        const d = stats.distributions.assets || {};
        const sorted = Object.entries(d).sort((a, b) => b[1] - a[1]).slice(0, 6);
        return {
            labels: sorted.map(e => e[0].substring(0, 15)),
            data: sorted.map(e => e[1]),
            colors: Array(sorted.length).fill('#10b981'),
            type: 'bar'
        };
    }, [stats]);

    const turnoverData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'doughnut' };
        const d = stats.distributions.businessTurnover || {};
        return {
            labels: Object.keys(d),
            data: Object.values(d),
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
            type: 'doughnut'
        };
    }, [stats]);

    const businessIssuesData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'bar' };
        const d = stats.distributions.businessIssues || {};
        return {
            labels: Object.keys(d).map(k => k.substring(0, 15)),
            data: Object.values(d),
            colors: Array(Object.keys(d).length).fill('#f43f5e'),
            type: 'bar'
        };
    }, [stats]);

    const businessNeedsData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'doughnut' };
        const d = stats.distributions.businessNeeds || {};
        return {
            labels: Object.keys(d),
            data: Object.values(d),
            colors: ['#a855f7', '#fbbf24', '#34d399', '#f43f5e', '#60a5fa'],
            type: 'doughnut'
        };
    }, [stats]);

    const waterSourceData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'doughnut' };
        const d = stats.distributions.waterSource || {};
        return {
            labels: Object.keys(d),
            data: Object.values(d),
            colors: ['#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6'],
            type: 'doughnut'
        };
    }, [stats]);

    // NEW CHARTS: Health
    const disabilitiesDistributionData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'doughnut' };
        const d = stats.distributions.disabilities || {};
        return {
            labels: Object.keys(d),
            data: Object.values(d),
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
            type: 'doughnut'
        };
    }, [stats]);

    const chronicsDistributionData = useMemo<ChartDataPoints>(() => {
        if (!stats) return { labels: [], data: [], colors: [], type: 'bar' };
        const d = stats.distributions.chronics || {};
        return {
            labels: Object.keys(d).map(k => k.substring(0, 15)),
            data: Object.values(d),
            colors: Array(Object.keys(d).length).fill('#ef4444'),
            type: 'bar'
        };
    }, [stats]);

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
                <div className={activeTab === 'semua' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" : "grid grid-cols-1 gap-6"}>
                    <CountCard title="Total Kepala Keluarga" subtitle="Kepala Keluarga terdaftar" value={stats?.total || 0} icon="home" gradient="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400" />
                    <CountCard title="Total Jemaat" subtitle="Jumlah anggota keluarga" value={stats?.totalSouls || 0} icon="groups" gradient="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" />
                    <ChartCard title="Rasio Gender" subtitle="Distribusi L/P anggota keluarga" icon="transgender" iconColor="#3b82f6" data={genderData} />
                    <ChartCard title="Distribusi Lingkungan" subtitle="Jumlah KK per Lingkungan" icon="location_on" iconColor="#10b981" data={lingkunganData} />
                    <ChartCard title="Distribusi Rayon" subtitle="Jumlah KK per Rayon" icon="grid_view" iconColor="#f59e0b" data={rayonData} />
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
                <div className={activeTab === 'semua' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6" : "grid grid-cols-1 gap-6 mb-6"}>
                    <ChartCard title="Progress Sakramen" subtitle="Status Baptis Jemaat" icon="water_drop" iconColor="#3b82f6" data={sakramenData} />
                    <ChartCard title="Komposisi Sidi" subtitle="Distribusi L/P Sidi" icon="diversity_1" iconColor="#ec4899" data={sidiCompositionData} />
                    <ChartCard title="Domisili Jemaat" subtitle="Rasio Menetap vs Diaspora" icon="home_pin" iconColor="#10b981" data={residencyData} />
                    <ChartCard title="Penerima Diakonia" subtitle="KK penerima bantuan gereja" icon="handshake" iconColor="#f59e0b" data={diakoniaData} />
                    <ChartCard title="Tren Diakonia" subtitle="Penerima dari tahun ke tahun" icon="trending_up" iconColor="#6366f1" data={diakoniaTrendData} />
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
                <div className={activeTab === 'semua' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" : "grid grid-cols-1 gap-6 mb-8"}>
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
                    <ChartCard title="Minat Pelayanan" subtitle="Alignment Profesi vs Minat" icon="psychology" iconColor="#8b5cf6" data={profAnalytics.alignmentChart} />
                </div>

                {/* 2. Charts */}
                <div className={activeTab === 'semua' ? "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" : "grid grid-cols-1 gap-6 mb-8"}>
                    <ChartCard title="Peta Kontribusi" subtitle="Distribusi bentuk kontribusi" icon="volunteer_activism" iconColor="#6366f1" data={profAnalytics.contributionChart} />
                    <ChartCard title="Top 5 Kategori Keahlian" subtitle="Bidang utama jemaat" icon="award_star" iconColor="#f59e0b" data={profAnalytics.topSkillsChart} />

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
                <div className={activeTab === 'semua' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "grid grid-cols-1 gap-6"}>
                    <ChartCard title="Minat Pelayanan" subtitle="Kesediaan kepala keluarga" icon="person_check" iconColor="#10b981" data={willingnessData} />
                    <ChartCard title="Area Pelayanan" subtitle="Bidang minat (aggregated)" icon="interests" iconColor="#a78bfa" data={interestAreasData} />
                    <ChartCard title="Bentuk Kontribusi" subtitle="Jenis kontribusi (aggregated)" icon="card_giftcard" iconColor="#f472b6" data={contributionData} />
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
                <div className={activeTab === 'semua' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "grid grid-cols-1 gap-6"}>
                    <ChartCard title="Status Sekolah Anak" subtitle="KK dengan anak sekolah" icon="school" iconColor="#10b981" data={schoolingStatusData} />
                    <ChartCard title="Anak Bersekolah" subtitle="Total anak per jenjang" icon="stairs" iconColor="#3b82f6" data={schoolLevelData} />
                    <ChartCard title="Putus Sekolah" subtitle="Total anak putus sekolah" icon="error" iconColor="#f43f5e" data={dropoutData} />
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
                <div className={activeTab === 'semua' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "grid grid-cols-1 gap-6"}>
                    <ChartCard title="Pendapatan (KK)" subtitle="Range pendapatan rumah tangga" icon="payments" iconColor="#34d399" data={incomeData} />
                    <ChartCard title="Status Rumah" subtitle="Kepemilikan rumah keluarga" icon="house" iconColor="#60a5fa" data={houseStatusData} />
                    <ChartCard title="Sumber Air" subtitle="Fasilitas sumber air primer" icon="water_drop" iconColor="#0ea5e9" data={waterSourceData} />
                    <ChartCard title="Kepemilikan Usaha" subtitle="Punya usaha produktif?" icon="storefront" iconColor="#4ade80" data={businessData} />
                </div>
                {businessData.data[0] > 0 && (
                    <div className={activeTab === 'semua' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6" : "grid grid-cols-1 gap-6 mt-6"}>
                        <ChartCard title="Aset Dominan" subtitle="Kepemilikan aset tertinggi" icon="diamond" iconColor="#10b981" data={assetsData} />
                        <ChartCard title="Omset Usaha" subtitle="Rentang omset bulanan UMKM" icon="trending_up" iconColor="#3b82f6" data={turnoverData} />
                        <ChartCard title="Kendala Usaha" subtitle="Top 5 Kendala UMKM" icon="warning" iconColor="#f43f5e" data={businessIssuesData} />
                        <ChartCard title="Kebutuhan Pelatihan" subtitle="Bantuan yg dibutuhkan" icon="model_training" iconColor="#a855f7" data={businessNeedsData} />
                    </div>
                )}
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
                <div className={activeTab === 'semua' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "grid grid-cols-1 gap-6"}>
                    <ChartCard title="Cakupan BPJS" subtitle="Status kepesertaan KK" icon="medical_services" iconColor="#10b981" data={bpjsData} />
                    <ChartCard title="Penyakit Kronis" subtitle="KK dengan riwayat kronis" icon="monitor_heart" iconColor="#ef4444" data={chronicData} />
                    <CountCard title="Sakit Berlanjut" subtitle="30 Hari Terakhir" value={stats?.sick30DaysCount || 0} icon="sick" gradient="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400" />
                    <CountCard title="Pengobatan Rutin" subtitle="Sedang terapi/obat" value={stats?.regularTreatmentCount || 0} icon="medication" gradient="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className={activeTab === 'semua' ? "grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6" : "grid grid-cols-1 gap-6 mt-6"}>
                    <ChartCard title="Jenis Disabilitas" subtitle="Kategori Disabilitas (Semua)" icon="accessible_forward" iconColor="#3b82f6" data={disabilitiesDistributionData} />
                    <ChartCard title="Top 5 Penyakit Kronis" subtitle="Penyakit Dominan (Semua)" icon="coronavirus" iconColor="#ef4444" data={chronicsDistributionData} />
                </div>
            </div>
        )
    };

    const growthPercentage = useMemo(() => {
        if (!members || members.length === 0) return 0;
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        const newMembers = members.filter(m => {
            if (!m.createdAt) return false;
            return new Date(m.createdAt) >= thirtyDaysAgo;
        }).length;
        if (members.length === newMembers) return 100;
        return ((newMembers / (members.length - newMembers)) * 100).toFixed(1);
    }, [members]);

    const renderTabContent = () => {
        if (activeTab === 'semua') {
            return (
                <div className="space-y-8 animate-fade-in-up pb-10">
                    <div className="grid grid-cols-12 gap-4 md:gap-8 items-stretch">
                        {/* 1. Dashboard Header - Compact & Informative */}
                        <div className="col-span-12 flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-card overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -mr-32 -mt-32"></div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center justify-between gap-4">
                                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                                        Halo, {profile?.firstName || user?.name || 'Admin'}! ⛪
                                    </h2>
                                </div>
                                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 max-w-sm mt-2">
                                    Sistem <span className="text-emerald-500">Aktif</span> dengan <span className="text-slate-900 dark:text-white font-black">{(stats?.total || 0).toLocaleString()} KK</span> ({stats?.totalSouls?.toLocaleString()} Jemaat) terdaftar.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 relative z-10 w-full sm:w-80">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate('/admin/members?action=add')}
                                        className="flex-1 h-12 md:h-14 px-4 md:px-8 bg-[#064e1c] text-white font-black text-[10px] md:text-[11px] uppercase tracking-widest rounded-xl md:rounded-2xl shadow-2xl shadow-emerald-900/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 md:gap-3 whitespace-nowrap"
                                    >
                                        <span className="material-symbols-outlined text-lg">person_add</span>
                                        Tambah Jemaat
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Global Filters */}
                        <div className="col-span-12 lg:col-span-8 flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-sm h-full">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <span className="material-symbols-outlined text-primary">filter_alt</span>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Filter Global:</span>
                            </div>
                            <div className="flex gap-4 w-full sm:w-auto flex-1">
                                <div className="flex-1 sm:max-w-xs relative group">
                                    <select
                                        value={globalFilterLingkungan}
                                        onChange={(e) => {
                                            setGlobalFilterLingkungan(e.target.value);
                                            setGlobalFilterRayon('Semua');
                                        }}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/20 appearance-none"
                                    >
                                        <option value="Semua">Semua Lingkungan</option>
                                        {Array.from({ length: 8 }, (_, i) => i + 1).map(l => (
                                            <option key={l} value={l.toString()}>Lingkungan {l}</option>))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                </div>
                                <div className="flex-1 sm:max-w-xs relative group">
                                    <select
                                        value={globalFilterRayon}
                                        onChange={(e) => setGlobalFilterRayon(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary/20 appearance-none"
                                    >
                                        <option value="Semua">Semua Rayon</option>
                                        {availableRayons.map((r) => (
                                            <option key={r} value={r.toString()}>Rayon {r}</option>
                                        ))}
                                    </select>
                                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Quick Mini Metrics */}
                        <div className="col-span-12 lg:col-span-4">
                            <div
                                onClick={() => setShowRecentModal(true)}
                                className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-card overflow-hidden relative group flex flex-col justify-center transition-all hover:border-emerald-500/30 cursor-pointer hover:shadow-2xl hover:shadow-emerald-500/5 active:scale-95 h-full"
                            >
                                <div className="absolute top-0 right-0 p-5 opacity-10 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 text-emerald-500">
                                    <span className="material-symbols-outlined text-4xl">trending_up</span>
                                </div>
                                <div className="relative z-10">
                                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">Pertumbuhan Jemaat</p>
                                    <div className="flex items-baseline gap-2">
                                        <h4 className="text-3xl font-black text-slate-900 dark:text-white">+{growthPercentage}%</h4>
                                        <span className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase">30 Hari</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full mt-4 overflow-hidden shadow-inner mb-2">
                                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${Math.min(100, Number(growthPercentage))}%` }}></div>
                                    </div>
                                    <span className="text-[8px] font-bold text-slate-400 hover:text-emerald-500 flex items-center gap-1 transition-colors">
                                        Lihat Jemaat Baru
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Metric Row - Dense & Colorful Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MetricCard title="Data Umum Keluarga" value={stats?.total || 0} subValue="Unit basis data utama" trend="" gradient="bg-gradient-to-br from-[#064e1c] to-[#0a8a32]" icon="family_restroom" onClick={() => setActiveTab('identitas')} />
                        <MetricCard title="Data Anggota Keluarga" value={stats?.totalSouls || 0} subValue="Informasi anggota keluarga" trend="" gradient="bg-gradient-to-br from-blue-600 to-indigo-600" icon="groups" onClick={() => setActiveTab('keluarga')} />
                        <MetricCard title="Profesi & Pelayanan" value={stats?.professionalCount || 0} subValue="Tenaga ahli & pelayan" trend="" gradient="bg-gradient-to-br from-orange-500 to-amber-600" icon="engineering" onClick={() => setActiveTab('profesional')} />
                        <MetricCard title="Pendidikan" value={stats?.educationCount || 0} subValue="Data pendidikan keluarga" trend="" gradient="bg-gradient-to-br from-teal-500 to-cyan-600" icon="auto_stories" onClick={() => setActiveTab('pendidikan')} />
                        <MetricCard title="Ekonomi & Aset" value={stats?.total || 0} subValue="Ekonomi & Aset Keluarga" trend="" gradient="bg-gradient-to-br from-violet-600 to-purple-700" icon="account_balance_wallet" onClick={() => setActiveTab('ekonomi')} />
                        <MetricCard title="Kesehatan" value={stats?.total || 0} subValue="Data Kesehatan Keluarga" trend="" gradient="bg-gradient-to-br from-rose-500 to-pink-600" icon="health_and_safety" onClick={() => setActiveTab('kesehatan')} />
                    </div>
                </div>
            );
        }

        return (
            <div className="animate-fade-in-up">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight capitalize leading-none mb-2">
                            Detail {activeTab}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data Statistik Terpadu</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActiveTab('semua')}
                            className="h-12 px-6 bg-slate-900 dark:bg-white/5 text-white dark:text-slate-400 font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-3 group"
                        >
                            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            KEMBALI KE Dashboard
                        </button>
                    </div>
                </div>
                {sections[activeTab as keyof typeof sections]}
            </div>
        );
    };

    // ─────────────────────────────
    // LOADING / ERROR STATES
    // ─────────────────────────────
    if (isStatsLoading || isMembersLoading) {
        return (
            <AdminLayout title="Dashboard">
                <DashboardSkeleton />
            </AdminLayout>
        );
    }

    if (isStatsError || isMembersError || !stats) {
        return (
            <AdminLayout title="Dashboard">
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
                    <div className="size-20 bg-red-50 text-red-600 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                        <span className="material-symbols-outlined text-4xl">error</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Kesalahan Koneksi Sistem</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
                        {statsError instanceof Error ? statsError.message : "Kami mengalami masalah saat mengambil statistik dasbor. Silakan periksa koneksi Anda."}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95"
                    >
                        COBA LAGI
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Dashboard">
            <div className="min-h-screen bg-slate-50/50 dark:bg-transparent p-4 lg:p-8 relative">
                <div className="max-w-[1600px] mx-auto relative">
                    {renderTabContent()}
                </div>
            </div>

            {/* Diakonia Modal */}
            {/* Recent Members Modal */}
            {/* Command Palette Search Modal */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)}></div>
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in slide-in-from-top-4 duration-300 border border-slate-100 dark:border-white/5">
                        <div className="p-2 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                            <div className="relative flex items-center">
                                <div className="size-12 flex items-center justify-center text-slate-400">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Ketik Nama, NIK, atau Nomor KK..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none text-base font-bold text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 py-4"
                                />
                                <div className="flex items-center gap-2 pr-4">
                                    <span className="text-[10px] font-black text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">ESC</span>
                                    <button
                                        onClick={() => setIsSearchOpen(false)}
                                        className="size-8 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {!searchQuery ? (
                                <div className="p-8 text-center text-slate-400">
                                    <span className="material-symbols-outlined text-4xl mb-3 opacity-20">person_search</span>
                                    <p className="text-xs font-bold uppercase tracking-widest">Masukkan kriteria pencarian...</p>
                                </div>
                            ) : filteredMembers.length > 0 ? (
                                <div className="p-4 space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-3">Hasil Pencarian ({filteredMembers.length})</p>
                                    {filteredMembers.slice(0, 8).map((m) => (
                                        <div
                                            key={m.id}
                                            onClick={() => {
                                                navigate(`/admin/members?id=${m.id}`);
                                                setIsSearchOpen(false);
                                                setSearchQuery('');
                                            }}
                                            className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-slate-100 dark:hover:border-white/5"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
                                                    {m.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{m.name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold text-slate-400">Rayon {m.rayon}</span>
                                                        <span className="size-1 rounded-full bg-slate-200"></span>
                                                        <span className="text-[10px] font-bold text-slate-400">{m.nik || 'N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">chevron_right</span>
                                        </div>
                                    ))}
                                    {filteredMembers.length > 8 && (
                                        <button
                                            onClick={() => {
                                                navigate('/admin/members');
                                                setIsSearchOpen(false);
                                            }}
                                            className="w-full py-4 text-center text-[10px] font-black text-primary hover:bg-primary/5 rounded-2xl transition-all uppercase tracking-widest"
                                        >
                                            Lihat Semua {filteredMembers.length} Hasil
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="p-20 text-center">
                                    <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">search_off</span>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Tidak Ditemukan</h3>
                                    <p className="text-sm font-bold text-slate-400">Tidak ada jemaat yang cocok dengan "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showRecentModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowRecentModal(false)}></div>
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-500 border border-white/10">
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Pendaftaran Baru</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">30 Hari Terakhir ({recentMembers.length})</p>
                                </div>
                                <button
                                    onClick={() => setShowRecentModal(false)}
                                    className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {recentMembers.length > 0 ? (
                                    recentMembers.map((m) => (
                                        <div
                                            key={m.id}
                                            onClick={() => {
                                                navigate(`/admin/members?id=${m.id}`);
                                                setShowRecentModal(false);
                                            }}
                                            className="group p-5 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-transparent hover:border-emerald-500/30 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="size-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xl shadow-inner">
                                                    {m.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">{m.name}</h4>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rayon {m.rayon}</span>
                                                        <span className="size-1 rounded-full bg-slate-300"></span>
                                                        <span className="text-[10px] font-bold text-emerald-500/70">{new Date(m.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="size-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <span className="material-symbols-outlined text-emerald-500">arrow_forward</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center">
                                        <div className="size-20 bg-slate-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-300">
                                            <span className="material-symbols-outlined text-4xl">person_search</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest leading-none">Belum Ada Data</h3>
                                        <p className="text-sm font-bold text-slate-300 mt-2">Belum ada pendaftaran dalam 30 hari terakhir</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => navigate('/admin/members')}
                                className="w-full mt-10 py-5 bg-[#064e1c] text-white font-black rounded-2xl tracking-widest hover:shadow-2xl hover:shadow-emerald-900/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                LIHAT SEMUA JEMAAT
                                <span className="material-symbols-outlined text-sm">groups</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {selectedFamilyForDiakonia && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedFamilyForDiakonia(null)}></div>
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-10">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{selectedFamilyForDiakonia.name}</h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Riwayat Diakonia</p>

                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-700">
                                {selectedFamilyForDiakonia.diakonia_recipient === 'Ya' ? (
                                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                                        Menerima dukungan <span className="text-emerald-600 font-black">{selectedFamilyForDiakonia.diakonia_type}</span> pada tahun <span className="text-slate-900 dark:text-white font-black">{selectedFamilyForDiakonia.diakonia_year}</span>.
                                    </p>
                                ) : (
                                    <p className="text-slate-400 italic">Tidak ada catatan diakonia sebelumnya untuk jemaat ini.</p>
                                )}
                            </div>

                            <button
                                onClick={() => setSelectedFamilyForDiakonia(null)}
                                className="w-full mt-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl tracking-widest active:scale-95 transition-all"
                            >
                                TUTUP DETAIL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};
export default AdminDashboard;