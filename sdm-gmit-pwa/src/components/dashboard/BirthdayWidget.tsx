import { useMemo } from 'react';
import { useMemberData } from '../../hooks/useMemberData';

export const BirthdayWidget = () => {
    const { members } = useMemberData();

    const upcomingBirthdays = useMemo(() => {
        if (!members) return [];
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        return members
            .filter(m => m && m.birthDate) // Ensure member and birthDate exist
            .map(m => {
                const birthDate = new Date(m.birthDate);
                if (isNaN(birthDate.getTime())) return null;

                let targetDate = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

                return {
                    ...m,
                    thisYearBirthday: targetDate,
                    age: today.getFullYear() - birthDate.getFullYear()
                };
            })
            .filter((m): m is any => {
                if (!m) return false;

                const bMonth = new Date(m.birthDate).getMonth();
                const bDate = new Date(m.birthDate).getDate();

                const tMonth = today.getMonth();
                const tDate = today.getDate();

                if (bMonth === tMonth && bDate >= tDate) return true;
                if (bMonth === (tMonth + 1) % 12 && bDate <= 7) return true;

                return false;
            })
            .sort((a, b) => {
                const dateA = new Date(a.birthDate).getDate();
                const dateB = new Date(b.birthDate).getDate();
                return dateA - dateB;
            })
            .slice(0, 5);
    }, [members]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-pink-500">cake</span>
                    Ulang Tahun
                </h3>
                <span className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-xs font-bold px-2 py-1 rounded-lg">
                    {upcomingBirthdays.length} Minggu Ini
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                {upcomingBirthdays.length > 0 ? (
                    upcomingBirthdays.map(member => (
                        <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-colors group">
                            <div className="size-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold shadow-md shadow-pink-200 dark:shadow-pink-900/20">
                                {member.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm">{member.name}</h4>
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <span className="text-pink-500 font-bold">
                                        {new Date(member.birthDate).getDate()} {new Date(member.birthDate).toLocaleString('id-ID', { month: 'short' })}
                                    </span>
                                    • Ke-{member.age}
                                </p>
                            </div>
                            <button className="size-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-200 transition-all opacity-0 group-hover:opacity-100" title="Kirim Ucapan">
                                <span className="material-symbols-outlined text-sm">send</span>
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 py-4">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
                        <p className="text-xs text-center">Tidak ada yang berulang tahun<br />dalam waktu dekat.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
