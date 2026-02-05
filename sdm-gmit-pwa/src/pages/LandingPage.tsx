import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Users, Globe } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

import heroSlide1 from '../assets/hero-slide-1.jpg';
import heroSlide2 from '../assets/hero-slide-2.jpg';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';
import { CountUp } from '../components/CountUp';



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
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans overflow-x-hidden selection:bg-indigo-500/30">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform-origin-0 z-[100]"
                style={{ scaleX }}
            />

            {/* Header / Navbar */}
            {/* Header / Navbar */}
            <header className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 text-slate-600 dark:text-slate-300 -ml-2"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <span className="text-slate-800 dark:text-white font-bold text-lg tracking-tight hidden sm:block">
                                Emaus<span className="text-indigo-600">Liliba</span>
                            </span>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        {['Beranda', 'Tentang', 'Tujuan', 'Kontak'].map((item) => (
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
                            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-full shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 active:scale-95"
                        >
                            Masuk
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
                                {['Beranda', 'Tentang', 'Tujuan', 'Kontak'].map((item, i) => (
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
                <section className="relative z-30 mt-10 px-4 pb-20" id="stats">
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


                {/* LATAR BELAKANG SECTION */}
                <section className="py-20 px-4 bg-white dark:bg-slate-900" id="tentang">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <Reveal>
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px]">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 mix-blend-multiply opacity-80 z-10"></div>
                                <img src={heroSlide2} alt="Latar Belakang" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <Globe className="w-24 h-24 text-white/50" />
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={200}>
                            <div>
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-xs mb-3 block">Latar Belakang</span>
                                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                    Membangun Pelayanan Berbasis <span className="text-indigo-600">Data</span>
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

                {/* BENTO GRID FEATURES */}
                <section className="py-20 px-4 bg-slate-50 dark:bg-slate-950" id="tujuan">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-3xl mx-auto mb-20">
                            <Reveal>
                                <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-xs mb-3 block">Tujuan</span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                                    Platform Digital untuk <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Pelayan Masa Depan</span>
                                </h2>
                            </Reveal>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((item, i) => (
                                <Reveal key={i} delay={item.delay}>
                                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center h-full">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6">
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



                {/* CONTACT FORM SECTION */}
                <section className="py-20 px-4 bg-slate-50 dark:bg-slate-950" id="kontak">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <Reveal>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">Hubungi Kami</h2>
                            <p className="text-slate-600 dark:text-slate-400">Punya pertanyaan atau butuh bantuan? Kirimkan pesan kepada kami.</p>
                        </Reveal>
                    </div>
                    <Reveal delay={200}>
                        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 transition-all text-slate-900 dark:text-white outline-none" placeholder="Nama Anda" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                                        <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 transition-all text-slate-900 dark:text-white outline-none" placeholder="email@contoh.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pesan</label>
                                    <textarea rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 transition-all text-slate-900 dark:text-white resize-none outline-none" placeholder="Tulis pesan Anda disini..."></textarea>
                                </div>
                                <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/30">
                                    Kirim Pesan
                                </button>
                            </form>
                        </div>
                    </Reveal>
                </section>


            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
