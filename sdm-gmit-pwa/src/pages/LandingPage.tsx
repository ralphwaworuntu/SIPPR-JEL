import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import heroBg from '../assets/hero-bg.png';
import { Footer } from '../components/Footer';
import { Globe, Activity, Users, Heart } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { CountUp } from '../components/CountUp';
import heroSlide2 from '../assets/hero-slide-2.jpg';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const features = [
        {
            title: "Database Terintegrasi",
            desc: "Sistem pendataan jemaat yang komprehensif, mencakup data pribadi, keluarga, dan potensi pelayanan.",
            icon: <Globe className="h-10 w-10 text-indigo-500 mb-4" />,
            delay: 100
        },
        {
            title: "Identifikasi Potensi",
            desc: "Temukan dan kembangkan talenta jemaat untuk pelayanan dengan fitur pemetaan minat dan bakat.",
            icon: <Activity className="h-10 w-10 text-pink-500 mb-4" />,
            delay: 200
        },
        {
            title: "Sinergi Kolaborasi",
            desc: "Hubungkan profesional dan pelayan Tuhan untuk dampak yang lebih besar dalam pelayanan gereja.",
            icon: <Users className="h-10 w-10 text-purple-500 mb-4" />,
            delay: 300
        }
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen font-display selection:bg-primary/20">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4 shadow-sm">
                <div className="max-w-[1200px] mx-auto grid grid-cols-3 items-center">
                    {/* Left: Hamburger Menu */}
                    <div className="flex justify-start">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Center: Brand */}
                    <div
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center justify-center gap-2 cursor-pointer group"
                    >
                        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight whitespace-nowrap hidden md:block">GMIT Emaus Liliba</h2>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex justify-end items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden md:block text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/form')}
                            className="px-4 py-2 bg-slate-900 dark:bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:opacity-90 transition-all active:scale-95 whitespace-nowrap"
                        >
                            Daftar
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar / Mobile Menu Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-[60]">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>

                    {/* Drawer */}
                    <div className="absolute top-0 left-0 w-[280px] h-full bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl p-6 transform transition-transform duration-300 ease-in-out">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Menu</h3>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 -mr-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <nav className="flex flex-col gap-2">
                            <a
                                href="#about"
                                onClick={() => setIsSidebarOpen(false)}
                                className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                            >
                                Tentang Program
                            </a>
                            <a
                                href="#stats"
                                onClick={() => setIsSidebarOpen(false)}
                                className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                            >
                                Statistik
                            </a>
                            <a
                                href="#kontak"
                                onClick={() => setIsSidebarOpen(false)}
                                className="block px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                            >
                                Kontak
                            </a>
                            <div className="my-2 h-px bg-slate-100 dark:bg-slate-800"></div>
                            <button
                                onClick={() => { navigate('/login'); setIsSidebarOpen(false); }}
                                className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                            >
                                Login Admin
                            </button>
                        </nav>

                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-xs text-center text-slate-400">
                                © {new Date().getFullYear()} GMIT Emaus Liliba <br /> All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex flex-col items-center">
                {/* Hero Section */}
                <section className="w-full max-w-[1200px] px-4 md:px-20 lg:px-40 py-20 lg:py-24">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2 flex flex-col gap-8 order-2 lg:order-1 text-center lg:text-left">
                            <div className="flex flex-col gap-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold tracking-widest uppercase w-fit mx-auto lg:mx-0">
                                    Sistem Database Terpadu
                                </span>
                                <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                                    Optimalkan Potensi <br />
                                    <span className="text-primary">Jemaat Untuk Pelayanan</span>
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Platform digital komprehensif untuk mendata, mengelola, dan mengembangkan talenta profesional jemaat GMIT Emaus Liliba.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button
                                    onClick={() => navigate('/form')}
                                    className="px-8 py-3.5 bg-primary text-white rounded-lg font-bold text-lg hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                                >
                                    Isi Data Jemaat
                                </button>
                                <button
                                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-lg font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                                >
                                    Pelajari Lebih Lanjut
                                </button>
                            </div>
                            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 font-medium">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] text-slate-600 font-bold">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <span>Bergabung dengan 1,200+ Jemaat lainnya</span>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 order-1 lg:order-2">
                            <div className="relative">
                                <div
                                    className="relative w-full aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700"
                                >
                                    <img src={heroBg} alt="Hero" className="w-full h-full object-cover" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STATS SECTION (From Remote, Styled with Clean Layout) */}
                <section className="relative z-30 mt-10 px-4 pb-20 w-full max-w-[1200px]" id="stats">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Jemaat Terdata", value: 1240, suffix: "+", icon: "groups" },
                            { label: "Kategori Keahlian", value: 45, icon: "verified_user" },
                            { label: "Program Aktif", value: 12, icon: "volunteer_activism" }
                        ].map((stat, idx) => (
                            <Reveal key={idx} delay={idx * 200}>
                                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-primary">
                                            <span className="material-symbols-outlined text-3xl">
                                                {stat.icon}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-5xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                                        <CountUp end={stat.value} suffix={stat.suffix} />
                                    </h3>
                                    <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">{stat.label}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* LATAR BELAKANG SECTION (From Remote) */}
                <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900 w-full" id="about">
                    <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <Reveal>
                            <div className="relative rounded-2xl overflow-hidden shadow-lg h-[400px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 mix-blend-multiply opacity-80 z-10"></div>
                                <img src={heroSlide2} alt="Latar Belakang" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <Globe className="w-24 h-24 text-white/50" />
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={200}>
                            <div>
                                <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Latar Belakang</span>
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                    Membangun Pelayanan Berbasis <span className="text-primary">Data</span>
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                    Program pendataan ini lahir dari kebutuhan untuk memahami potensi dan pergumulan setiap anggota jemaat secara real-time dan akurat.
                                </p>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                    Dengan database yang terintegrasi, gereja dapat merancang program pelayanan yang lebih tepat sasaran, efektif, dan menjangkau setiap pribadi.
                                </p>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* OBJECTIVES SECTION (From Remote) */}
                <section className="py-24 px-4 w-full" id="tujuan">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <Reveal>
                                <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">Tujuan</span>
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                                    Platform Digital untuk <br />
                                    <span className="text-primary">Pelayan Masa Depan</span>
                                </h2>
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((item, i) => (
                                <Reveal key={i} delay={item.delay}>
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-6">
                                            {item.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                            {item.desc}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CONTACT FORM SECTION (From Remote) */}
                <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900 w-full" id="kontak">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <Reveal>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Hubungi Kami</h2>
                            <p className="text-slate-600 dark:text-slate-400">Punya pertanyaan atau butuh bantuan? Kirimkan pesan kepada kami.</p>
                        </Reveal>
                    </div>
                    <Reveal delay={200}>
                        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-0 transition-all text-slate-900 dark:text-white outline-none" placeholder="Nama Anda" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                        <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-0 transition-all text-slate-900 dark:text-white outline-none" placeholder="email@contoh.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pesan</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-primary focus:bg-white dark:focus:bg-slate-900 focus:ring-0 transition-all text-slate-900 dark:text-white resize-none outline-none" placeholder="Tulis pesan Anda disini..."></textarea>
                                </div>
                                <button type="submit" className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>
                    </Reveal>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
