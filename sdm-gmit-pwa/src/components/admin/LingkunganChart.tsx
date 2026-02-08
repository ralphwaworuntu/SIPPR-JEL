import { useMemo } from 'react';

interface LingkunganChartProps {
    members: Array<{ lingkungan?: string }>;
}

// Colors for each Lingkungan
const LINGKUNGAN_COLORS: Record<string, string> = {
    '1': '#ef4444',
    '2': '#f97316',
    '3': '#eab308',
    '4': '#22c55e',
    '5': '#06b6d4',
    '6': '#3b82f6',
    '7': '#8b5cf6',
    'Luar Wilayah': '#64748b',
};

export const LingkunganChart = ({ members }: LingkunganChartProps) => {
    // Calculate distribution
    const distribution = useMemo(() => {
        const counts: Record<string, number> = {};
        let maxCount = 0;

        members.forEach(m => {
            const ling = m.lingkungan || 'Tidak Diketahui';
            counts[ling] = (counts[ling] || 0) + 1;
            if (counts[ling] > maxCount) maxCount = counts[ling];
        });

        // Sort by lingkungan number
        const sorted = Object.entries(counts).sort((a, b) => {
            const numA = parseInt(a[0]) || 99;
            const numB = parseInt(b[0]) || 99;
            return numA - numB;
        });

        return { data: sorted, max: maxCount };
    }, [members]);

    const total = members.length;

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Sebaran Lingkungan</h3>
                        <p className="text-xs text-slate-500">{total} jemaat terdaftar</p>
                    </div>
                    <span className="material-symbols-outlined text-primary">location_city</span>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 p-4 overflow-y-auto">
                {distribution.data.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                        Belum ada data
                    </div>
                ) : (
                    <div className="space-y-3">
                        {distribution.data.map(([lingkungan, count]) => {
                            const percentage = distribution.max > 0 ? (count / distribution.max) * 100 : 0;
                            const color = LINGKUNGAN_COLORS[lingkungan] || '#6b7280';

                            return (
                                <div key={lingkungan} className="group">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {lingkungan === 'Tidak Diketahui' ? lingkungan : `Lingkungan ${lingkungan}`}
                                        </span>
                                        <span className="text-xs font-bold text-slate-500">
                                            {count} <span className="text-[10px] font-normal">({((count / total) * 100).toFixed(0)}%)</span>
                                        </span>
                                    </div>
                                    <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                                        <div
                                            className="h-full rounded-lg transition-all duration-500 ease-out group-hover:opacity-80"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: color,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Legend */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex flex-wrap gap-2">
                    {Object.entries(LINGKUNGAN_COLORS).slice(0, 7).map(([num, color]) => (
                        <div key={num} className="flex items-center gap-1">
                            <div className="size-2 rounded-full" style={{ backgroundColor: color }} />
                            <span className="text-[9px] text-slate-500">L{num}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
