import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Users, Globe, ShieldCheck, Quote } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

import heroSlide1 from '../assets/hero-slide-1.jpg';
import heroSlide2 from '../assets/hero-slide-2.jpg';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { CountUp } from '../components/CountUp';
import { BentoGrid, BentoGridItem } from '../components/ui/BentoGrid';
import { HomeMap } from '../components/HomeMap';
import { cn } from '../lib/utils';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const backgroundImages = [heroSlide1, heroSlide2];

    const { scrollYProgress } = useScroll();
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    // Parallax & Typing Effect State
    const [textIndex, setTextIndex] = useState(0);
    const words = ["Terdata", "Terhubung", "Terlayani"];

    useEffect(() => {
        const interval = setInterval(() => {
            setTextIndex((current) => (current + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Feature Data adapted for Bento Grid
    const features = [
        {
            title: "Database Terintegrasi",
            desc: "Sistem pendataan jemaat yang komprehensif, mencakup data pribadi, keluarga, dan potensi pelayanan dalam satu platform aman.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 relative overflow-hidden group/chart">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm grid grid-cols-3 gap-2 p-2 opacity-50 group-hover/chart:opacity-100 transition-opacity">
                        <div className="col-span-2 h-2 bg-white/20 rounded"></div>
                        <div className="h-2 bg-white/20 rounded"></div>
                        <div className="h-8 bg-white/20 rounded col-span-3 mt-2"></div>
                        <div className="h-2 bg-white/20 rounded col-span-1 mt-2"></div>
                    </div>
                    <Globe className="absolute bottom-2 right-2 text-white/20 w-16 h-16 group-hover/chart:scale-110 transition-transform" />
                </div>
            ),
            icon: <Globe className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-2",
        },
        {
            title: "Identifikasi Potensi",
            desc: "Temukan dan kembangkan talenta jemaat untuk pelayanan.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 items-center justify-center">
                    <Activity className="w-12 h-12 text-white animate-pulse" />
                </div>
            ),
            icon: <Activity className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-1",
        },
        {
            title: "Sinergi Kolaborasi",
            desc: "Hubungkan profesional dan pelayan Tuhan untuk dampak yang lebih besar.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                    <div className="flex items-center justify-center h-full gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">JP</div>
                        <div className="w-8 h-px bg-slate-600"></div>
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xs">MK</div>
                    </div>
                </div>
            ),
            icon: <Users className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-1",
        },
        {
            title: "Keamanan & Privasi",
            desc: "Data Anda dilindungi dengan standar enkripsi industri terkini.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex-col items-center justify-center gap-2">
                    <ShieldCheck className="w-10 h-10 text-green-500" />
                    <span className="text-xs font-mono text-green-600 bg-green-100 px-2 py-0.5 rounded">AES-256 Encrypted</span>
                </div>
            ),
            icon: <ShieldCheck className="h-4 w-4 text-neutral-500" />,
            className: "md:col-span-2",
        },
    ];

    const testimonials = [
        "Sistem ini sangat membantu kami dalam mengorganisir data jemaat dengan lebih rapi.",
        "Fitur pemetaan potensi sangat inovatif! Kami jadi tahu siapa yang bisa melayani di bidang musik.",
        "Tampilan yang sangat modern dan mudah digunakan, bahkan untuk orang tua.",
        "Keamanan data terjamin, membuat kami tenang memberikan informasi pribadi.",
        "Terima kasih tim multimedia atas inovasi luar biasa ini!"
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans overflow-x-hidden selection:bg-indigo-500/30">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform-origin-0 z-[100]"
                style={{ scaleX }}
            />

            {/* Header / Navbar */}
            <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <span className="text-slate-800 dark:text-white font-bold text-lg tracking-tight hidden sm:block">
                            Emaus<span className="text-indigo-600">Liliba</span>
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {['Beranda', 'Tentang', 'Fitur', 'Kontak'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="relative text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                            >
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden sm:block px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all active:scale-95"
                        >
                            Masuk
                        </button>
                        <button
                            onClick={() => navigate('/form')}
                            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-full shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 active:scale-95"
                        >
                            Mulai <ArrowRight size={16} />
                        </button>
                        <button
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden"
                        >
                            <div className="px-4 py-4 flex flex-col gap-4">
                                {['Beranda', 'Tentang', 'Fitur', 'Kontak'].map((item, i) => (
                                    <motion.a
                                        key={item}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        href={`#${item.toLowerCase()}`}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-slate-600 dark:text-slate-300 font-medium py-2 border-b border-slate-100 dark:border-slate-800/50"
                                    >
                                        {item}
                                    </motion.a>
                                ))}
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-left py-2 font-medium text-indigo-600"
                                >
                                    Login Admin
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main>
                {/* HERO SECTION with Parallax */}
                <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden" id="beranda">
                    {backgroundImages.map((img, index) => (
                        <motion.div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${index === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}
                            style={{
                                backgroundImage: `url(${img})`,
                                y: useTransform(scrollYProgress, [0, 1], ['0%', '50%']) // Simple parallax
                            }}
                        />
                    ))}

                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 z-10" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay z-10"></div>

                    <div className="relative z-20 max-w-5xl mx-auto px-4 text-center mt-20">
                        <Reveal delay={100}>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8 hover:bg-white/10 transition-colors cursor-default">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-medium text-green-300 tracking-wide uppercase">Official Portal SDM</span>
                            </div>
                        </Reveal>

                        <Reveal delay={300}>
                            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">
                                Emaus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">Liliba</span>
                            </h1>
                        </Reveal>

                        <div className="h-20 mb-8 flex justify-center items-center">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={words[textIndex]}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-2xl md:text-4xl font-light text-slate-200 tracking-wide"
                                >
                                    Jemaat yang <span className="font-serif italic text-indigo-400">{words[textIndex]}</span>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <Reveal delay={700}>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                <button
                                    onClick={() => navigate('/form')}
                                    className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_-15px_rgba(255,255,255,0.5)] flex items-center gap-2 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-2">Mulai Sekarang <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                                </button>
                                <button
                                    onClick={() => document.getElementById('fitur')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/5 hover:border-white/40 transition-all flex items-center gap-2"
                                >
                                    Pelajari Sistem
                                </button>
                            </div>
                        </Reveal>
                    </div>

                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-70 cursor-pointer z-20"
                        onClick={() => document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] text-white/50 tracking-[0.3em] uppercase">Scroll</span>
                            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
                        </div>
                    </motion.div>
                </section>

                {/* STATS SECTION */}
                <section className="relative z-30 -mt-24 px-4 pb-20" id="stats">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Jemaat Terdata", value: 1240, suffix: "+", icon: "groups" },
                            { label: "Kategori Keahlian", value: 45, icon: "verified_user" },
                            { label: "Program Aktif", value: 12, icon: "volunteer_activism" }
                        ].map((stat, idx) => (
                            <Reveal key={idx} delay={idx * 200}>
                                <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl group-hover:bg-indigo-500 transition-colors duration-300">
                                            <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 group-hover:text-white text-3xl transition-colors">
                                                {stat.icon}
                                            </span>
                                        </div>
                                    </div>
                                    <h3 className="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                                        <CountUp end={stat.value} suffix={stat.suffix} />
                                    </h3>
                                    <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* BENTO GRID FEATURES */}
                <section className="py-32 px-4 bg-slate-50 dark:bg-slate-950" id="fitur">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <Reveal>
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-xs mb-3 block">Fitur Utama</span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                                    Platform Digital untuk <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Pelayan Masa Depan</span>
                                </h2>
                            </Reveal>
                        </div>

                        <BentoGrid>
                            {features.map((item, i) => (
                                <BentoGridItem
                                    key={i}
                                    title={item.title}
                                    description={item.desc}
                                    header={item.header}
                                    icon={item.icon}
                                    className={cn(item.className, "cursor-pointer hover:border-indigo-500/50 dark:hover:border-indigo-400/50")}
                                />
                            ))}
                        </BentoGrid>
                    </div>
                </section>

                {/* MAP SECTION */}
                <section className="py-24 px-4 bg-white dark:bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <Reveal>
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                    Menjangkau Setiap Sudut <span className="text-indigo-600">Jemaat</span>
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                    Memahami persebaran jemaat membantu kami dalam merencanakan pelayanan rayon yang lebih efektif dan personal.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { title: "Pemetaan Rayon", desc: "Digitalisasi batas rayon dan sektor." },
                                        { title: "Analisis Demografi", desc: "Data real-time untuk pengambilan keputusan majelis." },
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">check_circle</span>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                                                <p className="text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>

                        <Reveal delay={200}>
                            <HomeMap />
                        </Reveal>
                    </div>
                </section>

                {/* TESTIMONIALS MARQUEE */}
                <section className="py-20 bg-slate-50 dark:bg-slate-950 overflow-hidden border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Suara Jemaat</h2>
                    </div>

                    <div className="relative flex overflow-x-hidden">
                        <div className="animate-marquee whitespace-nowrap flex gap-8 py-4">
                            {[...testimonials, ...testimonials].map((text, i) => (
                                <div key={i} className="inline-block w-[350px] md:w-[450px] bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 mx-4 whitespace-normal">
                                    <Quote className="w-8 h-8 text-indigo-200 mb-4" />
                                    <p className="text-slate-600 dark:text-slate-300 text-lg italic leading-relaxed">"{text}"</p>
                                </div>
                            ))}
                        </div>
                        {/* Marquee Gradients */}
                        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10"></div>
                        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10"></div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="py-32 px-4 bg-white dark:bg-slate-900 relative">
                    <div className="max-w-5xl mx-auto relative z-10">
                        <div className="bg-slate-900 dark:bg-indigo-950 rounded-[3rem] p-8 md:p-20 text-center text-white shadow-2xl overflow-hidden relative group">
                            {/* Animated Background Mesh */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] group-hover:bg-indigo-500/40 transition-colors duration-700"></div>

                            <div className="relative z-10">
                                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Siap Melayani Bersama?</h2>
                                <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                                    Mari daftarkan data diri Anda untuk kemudahan pelayanan dan sinergi jemaat yang lebih baik.
                                </p>
                                <button
                                    onClick={() => navigate('/form')}
                                    className="px-12 py-6 bg-white text-slate-900 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                                >
                                    Isi Formulir Data Diri
                                </button>
                                <p className="mt-8 text-sm text-slate-500 uppercase tracking-widest font-semibold">Gratis & Aman</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
