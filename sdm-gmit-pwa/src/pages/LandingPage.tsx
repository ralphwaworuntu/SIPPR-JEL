import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import heroBg from '../assets/hero-bg.png';
import { Footer } from '../components/Footer';
import { Globe, Activity, Users } from 'lucide-react';
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
                    {/* Left Column */}
                    <div className="flex justify-start items-center gap-4">
                        {/* Hamburger (Mobile Only) */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Brand (Desktop Only - Left Aligned) */}
                        <div
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="hidden md:flex items-center gap-3 cursor-pointer group"
                        >
                            <div className="size-9 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm ring-2 ring-primary/20">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                                </svg>
                            </div>
                            <span className="text-slate-900 dark:text-white text-lg font-bold tracking-tight whitespace-nowrap">
                                GMIT Emaus Liliba
                            </span>
                        </div>
                    </div>

                    {/* Center Column */}
                    <div className="flex justify-center items-center">
                        {/* Brand (Mobile Only - Center Aligned) */}
                        <div
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="md:hidden flex items-center justify-center gap-2 cursor-pointer group"
                        >
                            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                                </svg>
                            </div>
                            {/* Hidden text on very small screens if needed, otherwise visible */}
                            <h2 className="text-slate-900 dark:text-white text-base font-bold tracking-tight whitespace-nowrap hidden sm:block">Emaus Liliba</h2>
                        </div>

                        {/* Navigation Links (Desktop Only - Center Aligned) */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Tentang</a>
                            <a href="#stats" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Statistik</a>
                            <a href="#kontak" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Kontak</a>
                        </nav>
                    </div>

                    {/* Right Column: Actions (Always Visible) */}
                    <div className="flex justify-end items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden lg:block text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
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
                {/* HERO SECTION */}
                <section className="w-full max-w-[1240px] px-6 md:px-12 lg:px-20 pt-24 lg:pt-32 pb-20 lg:pb-28 flex flex-col items-center text-center">
                    <div className="max-w-4xl flex flex-col items-center gap-8 mb-16 relative z-10">
                        <span className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-[10px] font-bold tracking-[0.2em] uppercase border border-slate-200 dark:border-slate-700">
                            Sistem Database Terpadu
                        </span>
                        <h1 className="text-slate-900 dark:text-white text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[1.05] tracking-tight">
                            Optimalkan Potensi <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-300 dark:to-white">
                                Pelayanan Jemaat
                            </span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-2xl leading-relaxed max-w-2xl font-medium">
                            Platform digital komprehensif untuk mendata, mengelola, dan mengembangkan talenta profesional jemaat GMIT Emaus Liliba.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 w-full justify-center">
                            <button
                                onClick={() => navigate('/form')}
                                className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-[0.98]"
                            >
                                Isi Data Jemaat
                            </button>
                            <button
                                onClick={() => document.getElementById('alur')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
                            >
                                Pelajari Alurnya
                            </button>
                        </div>

                        <div className="pt-8 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 font-bold opacity-80">
                            <div className="flex -space-x-3">
                                {['A', 'B', 'C', 'D'].map((char, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs text-slate-600 dark:text-slate-300 font-bold uppercase shadow-sm">
                                        {char}
                                    </div>
                                ))}
                            </div>
                            <span className="tracking-wide text-xs">Bergabung dengan <span className="text-slate-900 dark:text-white">1,200+</span> Jemaat lainnya</span>
                        </div>
                    </div>

                    {/* Wide Hero Image */}
                    <div className="w-full relative z-0">
                        <div className="relative w-full aspect-[21/9] md:aspect-[2/1] bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50">
                            <img src={heroBg} alt="Hero Dashboard" className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700 ease-out" />

                            {/* Gradient Overlay for Depth */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 via-transparent to-transparent dark:from-slate-950/80 dark:via-transparent dark:to-transparent pointer-events-none"></div>
                        </div>
                    </div>
                </section>

                {/* STATS STRIP (Floating Overlap) */}
                <section className="w-full max-w-[1000px] px-6 relative z-20 -mt-16 md:-mt-24 mb-12">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 p-8 md:p-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100 dark:divide-slate-800">
                            {[
                                { label: "Jemaat Terdata", value: 1240, suffix: "+" },
                                { label: "Kategori Keahlian", value: 45, suffix: "" },
                                { label: "Program Aktif", value: 12, suffix: "" },
                                { label: "Tahun Pelayanan", value: 25, suffix: "+" }
                            ].map((stat, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center px-2">
                                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                                        <CountUp end={stat.value} suffix={stat.suffix} />
                                    </h3>
                                    <p className="text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PROCESS SECTION (ALUR) */}
                <section className="py-24 w-full bg-white dark:bg-slate-950" id="alur">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        <div className="text-center max-w-2xl mx-auto mb-20">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Bagaimana Caranya?</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                                Alur Pendaftaran <br /> Digital
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                Proses pendataan dirancang sesederhana mungkin untuk memudahkan seluruh lapisan jemaat.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>

                            {[
                                { step: "01", title: "Isi Formulir", desc: "Lengkapi data diri dan keluarga melalui form digital yang tersedia.", icon: "edit_document" },
                                { step: "02", title: "Verifikasi Admin", desc: "Data akan divalidasi oleh tim sekretariat untuk memastikan keakuratan.", icon: "verified" },
                                { step: "03", title: "Terdaftar Resmi", desc: "Anda resmi terdata dan dapat mengakses layanan digital gereja.", icon: "badge" },
                            ].map((item, i) => (
                                <Reveal key={i} delay={i * 100}>
                                    <div className="flex flex-col items-center text-center bg-white dark:bg-slate-950 p-6">
                                        <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 flex items-center justify-center mb-8 shadow-sm relative">
                                            <span className="material-symbols-outlined text-4xl text-slate-700 dark:text-slate-200">
                                                {item.icon}
                                            </span>
                                            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold border-4 border-white dark:border-slate-950">
                                                {item.step}
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section className="py-24 w-full bg-slate-50 dark:bg-slate-900" id="fitur">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                            <div className="max-w-2xl">
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Fitur Unggulan</span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                    Solusi Digital untuk <br /> Pelayanan Gereja
                                </h2>
                            </div>
                            <button onClick={() => navigate('/form')} className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                Lihat Semua Fitur
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: "Kartu Digital Jemaat", desc: "Akses kartu identitas jemaat digital kapan saja dari smartphone Anda.", icon: "id_card" },
                                { title: "Pohon Keluarga", desc: "Visualisasi struktur keluarga yang jelas dan terhubung.", icon: "diversity_3" },
                                { title: "Riwayat Pelayanan", desc: "Catat dan pantau jejak keaktifan pelayanan Anda di gereja.", icon: "history_edu" },
                                { title: "Update Mandiri", desc: "Kemudahan memperbarui data kontak atau profesi secara real-time.", icon: "edit_square" },
                                { title: "Satu Data", desc: "Integrasi data pusat yang mencegah duplikasi dan ketidaksesuaian.", icon: "database" },
                                { title: "Keamanan Privasi", desc: "Data dilindungi dengan enkripsi standar industri untuk keamanan.", icon: "lock" }

                            ].map((feature, i) => (
                                <Reveal key={i} delay={i * 50}>
                                    <div className="group bg-white dark:bg-slate-950 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-none duration-300">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-colors">
                                                <span className="material-symbols-outlined text-xl">
                                                    {feature.icon}
                                                </span>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">arrow_outward</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section className="py-24 w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
                    <div className="max-w-[800px] mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4">Pertanyaan Umum</h2>
                            <p className="text-slate-500 dark:text-slate-400">Informasi yang mungkin Anda butuhkan.</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { q: "Siapa yang wajib mengisi data ini?", a: "Seluruh anggota jemaat GMIT Emaus Liliba, baik kepala keluarga maupun anggota keluarga lainnya yang sudah sidi maupun belum." },
                                { q: "Apakah data saya aman?", a: "Ya, kami menggunakan protokol keamanan standar dan data hanya diakses oleh tim sekretariat gereja untuk kepentingan pelayanan." },
                                { q: "Bagaimana jika saya pindah domisili?", a: "Anda dapat menghubungi admin sekretariat atau melakukan update mandiri melalui fitur perubahan data jika sudah tersedia akun." }
                            ].map((faq, i) => (
                                <Reveal key={i} delay={i * 50}>
                                    <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FINAL CTA */}
                <section className="py-32 w-full bg-slate-900 dark:bg-black text-white px-6">
                    <div className="max-w-[1240px] mx-auto bg-slate-800/50 dark:bg-slate-900/50 rounded-[3rem] p-12 md:p-24 text-center border border-slate-700/50 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Siap Untuk <br /> Bergabung?</h2>
                            <p className="text-slate-300 text-xl font-medium mb-10 leading-relaxed">
                                Mari bersama-sama membangun database jemaat yang akurat demi pelayanan yang lebih baik dan tepat sasaran.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => navigate('/form')}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all active:scale-[0.98]"
                                >
                                    Isi Data Sekarang
                                </button>
                                <button
                                    onClick={() => document.getElementById('kontak')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-transparent border border-slate-600 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-[0.98]"
                                >
                                    Hubungi Bantuan
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CONTACT INFO (Minified) */}
                <section className="py-16 w-full bg-white dark:bg-slate-950" id="kontak">
                    <div className="max-w-[1240px] mx-auto px-6 text-center">
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-8">Butuh Bantuan Langsung?</p>
                        <div className="flex flex-col md:flex-row justify-center gap-8 md:gap-16">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Kantor Sekretariat</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Jl. Emaus No. 1, Liliba, Kupang</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Email & Telepon</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">admin@gmitemausliliba.org<br />(0380) 123-4567</p>
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
