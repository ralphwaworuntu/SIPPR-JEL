import { useNavigate } from 'react-router-dom';
import type { Member } from "../../hooks/useMemberData";

interface RecentActivityProps {
    recentMembers: Member[];
}

export const RecentActivity = ({ recentMembers }: RecentActivityProps) => {
    const navigate = useNavigate();
    return (
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-800 shadow-sm p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Member Terbaru</h3>
                    <p className="text-xs text-slate-500">Jemaat yang baru ditambahkan/terdaftar</p>
                </div>
                <button onClick={() => navigate('/admin/members')} className="text-xs font-bold text-primary hover:underline">Lihat Semua</button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                {recentMembers.map((member, idx) => (
                    <div key={member.id} className="flex gap-4 group animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="flex flex-col items-center">
                            <div className="size-8 rounded-full flex items-center justify-center shrink-0 text-emerald-500 bg-emerald-500/10">
                                <span className="material-symbols-outlined text-sm">person_add</span>
                            </div>
                            {idx !== recentMembers.length - 1 && <div className="w-px h-full bg-slate-200 dark:bg-slate-800 my-1 group-hover:bg-primary/20 transition-colors"></div>}
                        </div>
                        <div className="pb-4">
                            <p className="text-sm text-slate-800 dark:text-slate-200">
                                <span className="font-bold">{member.name}</span> terdaftar sebagai jemaat baru.
                            </p>
                            <div className="flex gap-2 mt-1">
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">Ling. {member.lingkungan}</span>
                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{member.statusGerejawi}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {recentMembers.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm">Belum ada data member baru.</div>
                )}
            </div>
        </div>
    );
};
