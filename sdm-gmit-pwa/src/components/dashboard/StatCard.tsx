

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    trend?: string;
    trendUp?: boolean;
    icon?: string;
    color?: 'primary' | 'blue' | 'purple' | 'orange' | 'emerald' | 'rose';
    delay?: number;
}

const colorMap: Record<string, string> = {
    primary: 'bg-primary text-primary',
    blue: 'bg-blue-500 text-blue-600',
    orange: 'bg-orange-500 text-orange-600',
    purple: 'bg-purple-500 text-purple-600',
    emerald: 'bg-emerald-500 text-emerald-600',
    rose: 'bg-rose-500 text-rose-600',
};

export const StatCard = ({ title, value, subtitle, trend, trendUp = true, icon, color = 'primary', delay = 0 }: StatCardProps) => {
    // Parse color for background opacity vs text
    const baseColorClass = colorMap[color] || colorMap.primary;
    const [bgColor] = baseColorClass.split(' ');

    return (
        <div
            className="group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/20 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
            style={{ animationDelay: `${delay * 100}ms` }}
        >
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <span className="material-symbols-outlined text-8xl -rotate-12">{icon || 'analytics'}</span>
            </div>

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase flex-1 truncate mr-2" title={title}>{title}</p>
                        {trend && (
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${trendUp
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-600 border-rose-500/20'}`}>
                                <span className="material-symbols-outlined text-[10px]">{trendUp ? 'trending_up' : 'trending_down'}</span>
                                {trend}
                            </span>
                        )}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{value}</h3>
                    <p className="text-xs font-medium text-slate-400">{subtitle}</p>
                </div>

                <div className="mt-4 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${bgColor.replace('bg-', 'bg-')}`} style={{ width: '70%' }}></div>
                </div>
            </div>
        </div>
    );
};
