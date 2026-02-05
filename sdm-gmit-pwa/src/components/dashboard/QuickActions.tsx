import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        { label: 'Tambah Jemaat', icon: 'person_add', color: 'from-blue-500 to-blue-600', path: '/admin/members?action=add' },
        { label: 'Input KK Baru', icon: 'family_restroom', color: 'from-indigo-500 to-indigo-600', path: '/admin/families?action=add' },
        { label: 'Buat Laporan', icon: 'description', color: 'from-emerald-500 to-emerald-600', path: '/admin/reports' },
        { label: 'Broadcast Pesan', icon: 'campaign', color: 'from-rose-500 to-rose-600', path: '/admin/settings' }, // Placeholder path
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 gap-4 h-full">
            {actions.map((action, idx) => (
                <button
                    key={idx}
                    onClick={() => navigate(action.path)}
                    className="group relative overflow-hidden rounded-2xl p-4 flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-transparent transition-all hover:shadow-lg hover:-translate-y-1"
                >
                    <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className={`size-10 rounded-xl bg-gradient-to-br ${action.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                        <span className="material-symbols-outlined">{action.icon}</span>
                    </div>
                    <div className="text-left">
                        <span className="block text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{action.label}</span>
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-500">Klik untuk akses</span>
                    </div>
                </button>
            ))}
        </div>
    );
};
