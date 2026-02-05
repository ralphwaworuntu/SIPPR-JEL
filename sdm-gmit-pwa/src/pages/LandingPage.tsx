import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import heroBg from '../assets/hero-bg.png';
import { Footer } from '../components/Footer';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                                © 2024 GMIT Emaus Liliba <br /> All rights reserved.
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

                {/* Stats Section */}
                <section className="w-full bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800" id="stats">
                    <div className="max-w-[1200px] mx-auto px-4 md:px-20 lg:px-40 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                            {[
                                { icon: "groups", label: "Jemaat Terdata", value: "1,240+" },
                                { icon: "verified_user", label: "Kategori Keahlian", value: "45" },
                                { icon: "volunteer_activism", label: "Program Aktif", value: "12" }
                            ].map((stat, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center px-4 py-4 md:py-0">
                                    <span className="material-symbols-outlined text-primary text-4xl mb-4">{stat.icon}</span>
                                    <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</h3>
                                    <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full px-4 md:px-20 lg:px-40 py-24" id="about">
                    <div className="max-w-[1200px] mx-auto flex flex-col gap-16">
                        <div className="text-center max-w-2xl mx-auto space-y-4">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">Features</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Sistem Manajemen Terintegrasi
                            </h2>
                            <p className="text-slate-500 text-lg">
                                Mengelola data jemaat kini lebih mudah, aman, dan efisien dengan teknologi terkini.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: "database",
                                    title: "Pendataan Digital",
                                    desc: "Transformasi data manual ke digital yang aman dan terpusat.",
                                    color: "bg-blue-500"
                                },
                                {
                                    icon: "search_check",
                                    title: "Pemetaan Talenta",
                                    desc: "Pencarian tenaga ahli jemaat yang cepat dan akurat.",
                                    color: "bg-emerald-500"
                                },
                                {
                                    icon: "diversity_3",
                                    title: "Kolaborasi Pelayanan",
                                    desc: "Sinergi antar jemaat untuk pelayanan yang berdampak.",
                                    color: "bg-purple-500"
                                }
                            ].map((feature, idx) => (
                                <div key={idx} className="group bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800 hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md">
                                    <div className={`size-14 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary mb-6`}>
                                        <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full px-4 md:px-20 lg:px-40 pb-24">
                    <div className="max-w-[1200px] mx-auto">
                        <div className="rounded-2xl bg-slate-900 dark:bg-primary/20 relative overflow-hidden px-8 py-20 text-center">

                            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    Siap Berkontribusi?
                                </h2>
                                <p className="text-slate-300 text-lg">
                                    Mari bersama membangun jemaat yang lebih berdaya guna. Data Anda aman dan vertikal hanya untuk kepentingan pelayanan.
                                </p>
                                <button
                                    onClick={() => navigate('/form')}
                                    className="px-10 py-4 bg-white text-slate-900 rounded-lg font-bold text-lg shadow-sm hover:bg-slate-50 transition-colors"
                                >
                                    Mulai Isi Formulir
                                </button>
                                <p className="text-slate-400 text-sm font-medium">✨ Gratis, Aman, dan Terintegrasi</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default LandingPage;
