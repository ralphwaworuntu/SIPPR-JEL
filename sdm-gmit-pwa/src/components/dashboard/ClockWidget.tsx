import { useState, useEffect } from 'react';

export const ClockWidget = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = date.getHours();
    let greeting = 'Selamat Pagi';
    let icon = 'sunny';

    if (hours >= 11 && hours < 15) {
        greeting = 'Selamat Siang';
        icon = 'wb_sunny';
    } else if (hours >= 15 && hours < 19) {
        greeting = 'Selamat Sore';
        icon = 'wb_twilight';
    } else if (hours >= 19 || hours < 5) {
        greeting = 'Selamat Malam';
        icon = 'dark_mode';
    }

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                    <span className="material-symbols-outlined text-sm">{icon}</span>
                    <span className="text-xs font-bold tracking-wide uppercase">{greeting}</span>
                </div>
                <h2 className="text-4xl font-black tracking-tight mt-2 min-w-[140px]">
                    {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </h2>
                <p className="text-indigo-100 font-medium text-sm mt-1">
                    {date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
            </div>

            <div className="mt-6 flex gap-3 relative z-10">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex-1 border border-white/10">
                    <span className="text-xs text-indigo-100 block mb-1">Minggu ke-</span>
                    <span className="font-bold text-lg">
                        {Math.ceil(date.getDate() / 7)}
                    </span>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 flex-1 border border-white/10">
                    <span className="text-xs text-indigo-100 block mb-1">Minggu Liturgi</span>
                    <span className="font-bold text-lg">
                        Epifania
                    </span>
                </div>
            </div>
        </div>
    );
};
