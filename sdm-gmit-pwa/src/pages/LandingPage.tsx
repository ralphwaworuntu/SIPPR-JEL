import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Reveal } from '../components/Reveal';
import { Hero } from '../components/Hero';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    // Dark Mode State
    const [isDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    // Scroll Progress
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (buttonRef.current && buttonRef.current.contains(target)) {
                return;
            }
            if (menuRef.current && !menuRef.current.contains(target)) {
                setIsSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen]);

    // Dark Mode Effect
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    // Scroll Effect (back to top + navbar compact)
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        document.documentElement.style.scrollBehavior = 'smooth';

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    // ==========================================
    // CARA MENGUBAH FOTO DAN NAMA PENDETA
    // ==========================================
    // 1. Siapkan link foto pendeta (bisa dari url atau simpan foto di folder public/ dan gunakan '/nama-foto.jpg')
    // 2. Ubah teks pada 'src', 'name', dan 'title' di bawah ini:
    const pendetaPhotos = [
        {
            src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
            name: "Nama Pendeta 1",
            title: "Ketua Majelis Jemaat"
        },
        {
            src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
            name: "Nama Pendeta 2",
            title: "Wakil Ketua Majelis Jemaat"
        }
    ];

    // ==========================================
    // CARA MENGUBAH FOTO SLIDER KEGIATAN
    // ==========================================
    // 1. Formatnya sama, ubah 'src' dengan link foto/alamat file gambar Anda.
    // 2. Ubah 'caption' dengan judul/keterangan kegiatannya.
    // 3. Anda bisa menambah atau menghapus baris untuk menambah/mengurangi jumlah foto di slider.
    const activityPhotos = [
        { src: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1200&auto=format&fit=crop", caption: "Ibadah Minggu Pagi" },
        { src: "https://images.unsplash.com/photo-1510515152865-cde01d1c1fd6?q=80&w=1200&auto=format&fit=crop", caption: "Persekutuan Kaum Muda" },
        { src: "https://images.unsplash.com/photo-1514415008039-eba172eabdbd?q=80&w=1200&auto=format&fit=crop", caption: "Pelayanan Sosial Diakonia" },
        { src: "https://images.unsplash.com/photo-1445384763658-0400939829cd?q=80&w=1200&auto=format&fit=crop", caption: "Latihan Paduan Suara" },
        { src: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop", caption: "Sekolah Minggu Ceria" },
        { src: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1200&auto=format&fit=crop", caption: "Perayaan Hari Raya" },
    ];

    // Auto slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activityPhotos.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activityPhotos.length]);

    // Worship schedule data
    const worshipSchedule = [
        { day: "Minggu", time: "07:00 - 09:00 WITA", title: "Ibadah Umum (Pagi)", icon: "church", color: "from-indigo-500 to-blue-600" },
        { day: "Minggu", time: "17:00 - 18:30 WITA", title: "Ibadah Umum (Sore)", icon: "wb_twilight", color: "from-orange-500 to-amber-600" },
        { day: "Rabu", time: "18:00 - 19:30 WITA", title: "Ibadah Rumah Tangga", icon: "home", color: "from-emerald-500 to-teal-600" },
        { day: "Jumat", time: "18:00 - 19:30 WITA", title: "Ibadah Doa & Puji-pujian", icon: "music_note", color: "from-violet-500 to-purple-600" },
    ];

    // ==========================================
    // CARA MENGUBAH PENGUMUMAN
    // ==========================================
    // Ubah title, date, dan description di bawah ini.
    // Tambah/hapus objek untuk menambah/mengurangi jumlah pengumuman.
    const announcements = [
        {
            title: "Pendaftaran Katekisasi Sidi Angkatan 2026",
            date: "1 Maret 2026",
            description: "Pendaftaran katekisasi sidi untuk remaja dan dewasa telah dibuka. Silahkan menghubungi sekretariat gereja untuk informasi lebih lanjut.",
        },
        {
            title: "Ibadah Padang Hari Paskah",
            date: "20 April 2026",
            description: "Ibadah Padang dalam rangka perayaan Paskah akan dilaksanakan di Taman Kota Kupang, pukul 06:00 WITA. Seluruh jemaat diundang hadir.",
        },
        {
            title: "Pengumpulan Data SDM Jemaat",
            date: "Berlangsung",
            description: "Program pendataan SDM Profesional GMIT JEL masih berlangsung. Bagi jemaat yang belum mengisi formulir, silakan klik tombol 'Mulai' di halaman ini.",
        },
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen font-display selection:bg-indigo-500/30">
            {/* Scroll Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-[100]"
                style={{ scaleX }}
            />

            {/* ===== NAVBAR (Compact on Scroll) ===== */}
            <header className={`w-full sticky top-0 z-50 backdrop-blur-md shadow-sm border-b border-indigo-500/5 transition-all duration-300 ${isScrolled ? 'py-2 bg-white/90 dark:bg-slate-950/90 shadow-md' : 'py-3 bg-white/80 dark:bg-slate-950/80'}`}>
                <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between">
                    {/* Left: Brand */}
                    <div
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="flex flex-col">
                            <span className={`font-bold tracking-tight text-slate-800 dark:text-white transition-all ${isScrolled ? 'text-base' : 'text-lg'}`}>
                                GMIT <span className="text-indigo-600">JEL</span>
                            </span>
                        </div>
                    </div>

                    {/* Center: Menu (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {[
                            { name: 'Beranda', href: '#' },
                            { name: 'Visi Misi', href: '#visi-misi' },
                            { name: 'Kegiatan', href: '#kegiatan' },
                            { name: 'Pengumuman', href: '#pengumuman' },
                            { name: 'Jadwal', href: '#jadwal' },
                            { name: 'Sejarah', href: '#sejarah' },
                            { name: 'Lokasi', href: '#lokasi' },
                            { name: 'Cek Status', href: '/status' }
                        ].map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="relative text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="hidden md:block px-6 py-2.5 text-sm font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full hover:scale-105 transition-all shadow-lg"
                        >
                            Masuk
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            ref={buttonRef}
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {isSidebarOpen && (
                    <div
                        ref={menuRef}
                        className="absolute top-full left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl z-[60]"
                    >
                        <nav className="flex flex-col p-4">
                            {[
                                { name: 'Beranda', href: '#' },
                                { name: 'Visi Misi', href: '#visi-misi' },
                                { name: 'Kegiatan', href: '#kegiatan' },
                                { name: 'Pengumuman', href: '#pengumuman' },
                                { name: 'Jadwal', href: '#jadwal' },
                                { name: 'Sejarah', href: '#sejarah' },
                                { name: 'Lokasi', href: '#lokasi' },
                                { name: 'Cek Status', href: '/status' }
                            ].map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="px-4 py-4 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
                                >
                                    {item.name}
                                </a>
                            ))}
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 w-full py-3 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-lg"
                            >
                                Masuk
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            <main className="w-full">
                {/* ===== 1. HERO SECTION ===== */}
                <Hero />

                {/* ===== 2. VISI MISI + FOTO PENDETA ===== */}
                <section id="visi-misi" className="py-16 md:py-20 w-full bg-white dark:bg-slate-950">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        <Reveal delay={100}>
                            <div className="text-center mb-12 md:mb-16">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                    Visi Misi
                                </h2>
                            </div>
                        </Reveal>

                        <Reveal delay={200}>
                            <div className="flex flex-col gap-12 lg:gap-16 items-center max-w-4xl mx-auto">
                                {/* Text List */}
                                <div className="text-left w-full">
                                    <ol className="list-decimal list-outside ml-6 space-y-4 text-slate-600 dark:text-slate-300 text-lg font-medium leading-relaxed">
                                        <li className="pl-2">Mengembangkan persekutuan yang dinamis dan bermutu</li>
                                        <li className="pl-2">Meningkatkan pemberitaan firman Tuhan yang inovatif dan progresif</li>
                                        <li className="pl-2">Memberdayakan potensi jemaat untuk mengatasi masalah sosial, ketahanan ekonomi jemaat</li>
                                        <li className="pl-2">Menyatakan inklusifitas jemaat dengan jemaat di luar Jemaat Kota Baru</li>
                                        <li className="pl-2">Mengembangkan liturgi kontekstual dan konstruktif</li>
                                        <li className="pl-2">Mengembangkan tata kelola pelayanan yang bermutu</li>
                                    </ol>
                                </div>

                                {/* Foto Pendeta Container */}
                                <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center justify-center w-full mt-4">
                                    {pendetaPhotos.map((pendeta, index) => (
                                        <div key={index} className="flex flex-col items-center gap-4">
                                            <div className="relative group w-64 h-64 lg:w-72 lg:h-72">
                                                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500"></div>
                                                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
                                                    <img
                                                        src={pendeta.src}
                                                        alt={pendeta.name}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{pendeta.name}</h3>
                                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{pendeta.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>


                {/* ===== 4. PENGUMUMAN JEMAAT ===== */}
                <section id="pengumuman" className="py-16 md:py-20 w-full bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        <Reveal delay={100}>
                            <div className="text-center mb-12 md:mb-16">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold tracking-wider uppercase mb-4">
                                    Informasi Terbaru
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                    Pengumuman Jemaat
                                </h2>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {announcements.map((item, i) => (
                                <Reveal key={i} delay={100 + i * 100}>
                                    <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500"></div>
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
                                            <span className="material-symbols-outlined text-xl text-white">campaign</span>
                                        </div>
                                        <p className="text-xs font-semibold text-rose-500 dark:text-rose-400 mb-2">{item.date}</p>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{item.title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{item.description}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== 5. SLIDER FOTO KEGIATAN + DOT INDICATOR ===== */}
                <section id="kegiatan" className="py-16 md:py-20 w-full bg-white dark:bg-slate-950 overflow-hidden">
                    <Reveal delay={100}>
                        <div className="w-[90vw] max-w-[1100px] mx-auto relative">
                            <div className="h-[50vh] md:h-[70vh] relative overflow-hidden rounded-3xl shadow-2xl">
                                <motion.div
                                    className="flex h-full"
                                    style={{ width: `${activityPhotos.length * 100}%` }}
                                    animate={{ x: `-${currentSlide * (100 / activityPhotos.length)}%` }}
                                    transition={{ ease: "easeInOut", duration: 1 }}
                                >
                                    {activityPhotos.map((photo, i) => (
                                        <div key={i} className="h-full relative group/card" style={{ width: `${100 / activityPhotos.length}%` }}>
                                            <div className="w-full h-full relative overflow-hidden">
                                                <img
                                                    src={photo.src}
                                                    alt={photo.caption}
                                                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-[20s]"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
                                                    <div className="p-8 md:p-12 w-full">
                                                        <p className="text-white font-black text-3xl md:text-5xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">{photo.caption}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Dot Indicators */}
                            <div className="flex justify-center items-center gap-2.5 mt-6">
                                {activityPhotos.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentSlide(i)}
                                        className={`rounded-full transition-all duration-300 ${currentSlide === i
                                            ? 'w-8 h-3 bg-indigo-600'
                                            : 'w-3 h-3 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                                            }`}
                                        aria-label={`Slide ${i + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </section>

                {/* ===== 5. JADWAL IBADAH ===== */}
                <section id="jadwal" className="py-16 md:py-20 w-full bg-white dark:bg-slate-950">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        <Reveal delay={100}>
                            <div className="text-center mb-12 md:mb-16">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4">
                                    Jadwal Pelayanan
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                    Jadwal Ibadah
                                </h2>
                            </div>
                        </Reveal>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {worshipSchedule.map((item, i) => (
                                <Reveal key={i} delay={100 + i * 100}>
                                    <div className="relative group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                        {/* Gradient accent top */}
                                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color}`}></div>

                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                                            <span className="material-symbols-outlined text-2xl text-white">{item.icon}</span>
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{item.day}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.time}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== 6. SEJARAH / LATAR BELAKANG ===== */}
                <section id="sejarah" className="py-16 md:py-20 w-full bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-[1000px] mx-auto px-6 md:px-12 lg:px-20">
                        <Reveal delay={100}>
                            <div className="text-center max-w-4xl mx-auto">
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-indigo-600 dark:text-indigo-400 mb-4 block">
                                    Latar Belakang Program
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-8">
                                    Pendataan & Pemetaan SDM Profesional GMIT JEL
                                </h2>
                                <div className="relative group">
                                    <div className={`text-slate-500 dark:text-slate-400 text-base md:text-lg leading-relaxed text-left md:text-justify transition-all duration-300 ${!isAboutExpanded ? 'line-clamp-4 md:line-clamp-3' : ''}`}>
                                        <p className="mb-4">Gereja selain sebagai persekutuan orang percaya juga merupakan wadah pengembangan potensi jemaat secara menyeluruh. Setiap anggota jemaat memiliki profesi, keahlian, dan talenta masing-masing yang apabila dikelola dengan baik maka akan menjadi kekuatan besar bagi terlaksananya pelayanan dan sebagai kesaksian gereja di tengah masyarakat. Jemaat memiliki kemampuan profesional, keterampilan teknis, dan minat pelayanan tertentu namun belum teridentifikasi secara sistematis sehingga belum tersinergi dengan optimal dalam kegiatan gereja karena belum adanya data terstruktur terkait Sumber Daya Manusia (SDM) jemaat. Ini merupakan sebagian kecil dari peyebab pelayanan gereja bergantung pada kelompok kecil yang terlibat aktif, sementara potensi besar lainnya belum tergali.</p>
                                        <p>Menjawab kebutuhan gereja di atas, maka GMIT JEL melalui UPPMJ & Satuan Pelayanan Profesional menginisiasi program pendataan jemaat berdasarkan profesi dan keahlian, yang outputnya akan disusun dalam sebuah <b>"Bank Data SDM GMIT JEL"</b>. Tujuan umum program ini adalah untuk memetakan profesi dan kompetensi setiap anggota jemaat agar dapat dioptimalkan bagi pengembangan pelayanan gereja, pemberdayaan ekonomi jemaat, serta keterlibatan aktif dalam kegiatan sosial kemasyarakatan. Program ini bukan hanya sebuah kegiatan administratif belaka, namun merpakan langkah strategis menuju gereja yang memberdayakan, yang mana setiap anggota jemaat mengambil bagian dalam pelayanan sesuai panggilan dan kompetensinya dengan visi menjadi anggota tubuh Kristus yang bertumbuh dan berdampak.</p>
                                    </div>
                                    {/* Fade Effect Overlay */}
                                    {!isAboutExpanded && (
                                        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparent pointer-events-none"></div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                                    className="mt-8 md:mt-10 px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group shadow-sm hover:shadow-md"
                                >
                                    <span className="flex items-center gap-2">
                                        {isAboutExpanded ? 'Tutup Ringkasan' : 'Baca Selengkapnya'}
                                        <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${isAboutExpanded ? 'rotate-180' : ''}`}>
                                            expand_more
                                        </span>
                                    </span>
                                </button>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ===== 7. LOKASI & KONTAK GEREJA ===== */}
                <section id="lokasi" className="py-16 md:py-20 w-full bg-white dark:bg-slate-950">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        <Reveal delay={100}>
                            <div className="text-center mb-12 md:mb-16">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wider uppercase mb-4">
                                    Temukan Kami
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                    Lokasi & Kontak
                                </h2>
                            </div>
                        </Reveal>

                        <Reveal delay={200}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                                {/* Map */}
                                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 aspect-[4/3]">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.0!2d123.6!3d-10.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDEwJzEyLjAiUyAxMjPCsDM2JzAwLjAiRQ!5e0!3m2!1sid!2sid!4v1234567890"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Lokasi GMIT Emaus Liliba"
                                    ></iframe>
                                </div>

                                {/* Contact Info */}
                                <div className="flex flex-col justify-center gap-6">
                                    {[
                                        { icon: "location_on", title: "Alamat", desc: "Jl. Emaus, Kelurahan Liliba, Kecamatan Oebobo, Kota Kupang, Nusa Tenggara Timur" },
                                        { icon: "call", title: "Telepon", desc: "(0380) 000-000" },
                                        { icon: "mail", title: "Email", desc: "sekretariat@gmitemausliliba.org" },
                                        { icon: "schedule", title: "Jam Kantor", desc: "Senin - Jumat, 08:00 - 14:00 WITA" },
                                    ].map((contact, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                                                <span className="material-symbols-outlined text-xl text-indigo-600 dark:text-indigo-400">{contact.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{contact.title}</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{contact.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

            </main>

            {/* Back To Top */}
            {
                showBackToTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 p-3 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all z-50 animate-bounce"
                        aria-label="Back to top"
                    >
                        <ChevronUp className="w-6 h-6" />
                    </button>
                )
            }

            {/* ===== 8. FOOTER SIMPEL ===== */}
            <footer className="w-full bg-slate-50 dark:bg-slate-950 font-display">
                <div className="max-w-[1240px] mx-auto px-6">
                    <div className="pt-12 pb-6 text-center border-t border-slate-200 dark:border-slate-800">
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            Developed by GMIT Emaus Liliba. &copy; {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default LandingPage;