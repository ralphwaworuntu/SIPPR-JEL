import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import heroBg from '../assets/hero-bg.png';
import logoGmit from '../assets/logo-gmit.png';
import { Footer } from '../components/Footer';
import { Reveal } from '../components/Reveal';
import { Moon, Sun, ChevronUp, MapPin, Phone, Mail } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAboutExpanded, setIsAboutExpanded] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            // Don't close if clicking on the hamburger button
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

    // Scroll Effect (Back to Top & Smooth Scroll settings)
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
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

    return (
        <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300 min-h-screen font-display selection:bg-primary/20">
            {/* Top Navigation Bar */}
            <header className="w-full sticky top-0 z-50 bg-white dark:bg-slate-950 shadow-sm py-3 transition-all duration-300">
                <div className="max-w-[1240px] mx-auto px-6 flex items-center justify-between">
                    {/* Left: Brand */}
                    <div
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <img
                            src={logoGmit}
                            alt="Logo GMIT Emaus Liliba"
                            className="h-12 w-auto"
                        />
                        <div className="hidden sm:flex flex-col">
                            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-white -mt-1">
                                GMIT EMAUS LILIBA
                            </span>
                        </div>
                    </div>

                    {/* Center: Menu (Desktop) */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {[
                            { name: 'Depan', href: '#' },
                            { name: 'Tentang Program', href: '#tentang' },
                            { name: 'Visi & Misi', href: '#tujuan' },
                            { name: 'Alur Pengisian', href: '#alur' },
                            { name: 'Fitur Unggulan', href: '#fitur' },
                            { name: 'FAQ', href: '#faq' }
                        ].map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                {item.name}
                            </a>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className="hidden md:block px-6 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md"
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
                        className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg z-[60]"
                    >
                        <nav className="flex flex-col">
                            {[
                                { name: 'Depan', href: '#' },
                                { name: 'Tentang Program', href: '#tentang' },
                                { name: 'Visi & Misi', href: '#tujuan' },
                                { name: 'Alur Pengisian', href: '#alur' },
                                { name: 'Fitur Unggulan', href: '#fitur' },
                                { name: 'FAQ', href: '#faq' }
                            ].map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            <main className="w-full">
                {/* HERO SECTION */}
                <section className="relative w-full min-h-[85vh] flex flex-col overflow-hidden">
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={heroBg}
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-black/50"></div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
                        <div className="max-w-4xl text-center text-white flex flex-col items-center gap-6">
                            {/* Logo & Title */}
                            <div className="flex flex-col items-center gap-6">

                                <h1 className="text-xl md:text-2xl lg:text-3xl font-medium italic leading-relaxed drop-shadow-lg">
                                    Pendataan & Pemetaan SDM Profesional<br />
                                    Jemaat GMIT Emaus Liliba
                                </h1>
                            </div>


                            {/* CTA Button - Outlined */}
                            <div className="pt-4">
                                <button
                                    onClick={() => navigate('/form')}
                                    className="px-10 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold text-base hover:bg-white hover:text-slate-900 transition-all duration-300"
                                >
                                    Mulai
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TENTANG SECTION */}
                <section id="tentang" className="pt-16 pb-24 w-full bg-white dark:bg-slate-950">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        <div className="text-center max-w-3xl mx-auto">
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">
                                Latar Belakang Program
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                                Pendataan dan Pemetaan SDM Profesional Jemaat GMIT Emaus Liliba
                            </h2>
                            <div className="relative">
                                <p className={`text-slate-500 dark:text-slate-400 text-lg leading-relaxed text-justify transition-all duration-300 ${!isAboutExpanded ? 'line-clamp-3' : ''}`}>
                                    Sistem Informasi ini dibangun untuk menjawab kebutuhan gereja, maka GMIT JEL melalui UPPMJ dan Satuan Pelayanan Profesional menginisiasi program pendataan jemaat berdasarkan profesi dan keahlian, yang outputnya akan disusun dalam sebuah “Bank Data SDM GMIT JEL”. Tujuan umum program ini adalah untuk memetakan profesi dan kompetensi setiap anggota jemaat agar dapat dioptimalkan bagi pengembangan pelayanan gereja, pemberdayaan ekonomi jemaat, serta keterlibatan aktif dalam kegiatan sosial kemasyarakatan. Program ini bukan hanya sebuah kegiatan administratif belaka, namun merupakan langkah strategis menuju gereja yang memberdayakan, yang mana setiap anggota jemaat mengambil bagian dalam pelayanan sesuai panggilan dan kompetensinya dengan visi menjadi anggota tubuh Kristus yang bertumbuh dan berdampak.
                                </p>
                                {/* Fade Effect Overlay */}
                                {!isAboutExpanded && (
                                    <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white dark:from-slate-950 to-transparent pointer-events-none"></div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                                className="mt-4 inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
                            >
                                {isAboutExpanded ? 'Tutup' : 'Selengkapnya'}
                                <span className={`material-symbols-outlined text-lg transition-transform duration-300 ${isAboutExpanded ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* TUJUAN PROGRAM SECTION */}
                <section id="tujuan" className="py-24 w-full bg-white dark:bg-slate-950">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4">
                                Visi & Misi
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                                Tujuan Program
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Identifikasi Potensi",
                                    desc: "Memetakan potensi dan keahlian setiap jemaat untuk dioptimalkan dalam pelayanan.",
                                    icon: "search",
                                    color: "from-emerald-400 to-teal-500"
                                },
                                {

                                    title: "Sinergi & Kolaborasi",
                                    desc: "Membangun kerja sama antar jemaat sesuai bidang keahlian untuk pelayanan yang efektif.",
                                    icon: "diversity_3",
                                    color: "from-teal-400 to-cyan-500"
                                },
                                {

                                    title: "Perencanaan Berbasis Data",
                                    desc: "Membuat keputusan pelayanan yang tepat berdasarkan data yang akurat dan terkini.",
                                    icon: "analytics",
                                    color: "from-cyan-400 to-blue-500"
                                }
                            ].map((goal, i) => (
                                <Reveal key={i} delay={i * 100}>
                                    <div className="group relative h-full">
                                        {/* Card */}
                                        <div className="relative h-full p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1 overflow-hidden">
                                            {/* Background Number */}
                                            <span className="absolute -right-4 -top-4 text-[120px] font-black text-slate-100 dark:text-slate-800/50 leading-none pointer-events-none select-none"></span>

                                            {/* Icon */}
                                            <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${goal.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <span className="material-symbols-outlined text-3xl text-white">{goal.icon}</span>
                                            </div>

                                            <h3 className="relative text-xl font-bold text-slate-900 dark:text-white mb-3">{goal.title}</h3>
                                            <p className="relative text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                                {goal.desc}
                                            </p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ALUR PENGISIAN */}
                <section id="alur" className="py-28 w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 overflow-hidden">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        {/* Header */}
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-6">
                                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                <span className="text-xs font-bold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
                                    3 Langkah Mudah
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                                Alur Pengisian Data
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                                Proses pendataan dirancang sesederhana mungkin untuk memudahkan seluruh lapisan jemaat
                            </p>
                        </div>

                        {/* Timeline Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    step: "01",
                                    title: "Akses Portal",
                                    desc: "Buka website dan klik tombol 'Daftar' atau 'Isi Data Jemaat'",
                                    icon: "computer",
                                    gradient: "from-blue-500 to-indigo-600"
                                },
                                {
                                    step: "02",
                                    title: "Lengkapi Data",
                                    desc: "Isi data diri, keluarga, dan keprofesian dengan lengkap",
                                    icon: "edit_note",
                                    gradient: "from-indigo-500 to-purple-600"
                                },
                                {
                                    step: "03",
                                    title: "Selesai",
                                    desc: "Data tersimpan aman dan akan divalidasi oleh admin",
                                    icon: "verified",
                                    gradient: "from-purple-500 to-pink-600"
                                }
                            ].map((item, i) => (
                                <Reveal key={i} delay={i * 150}>
                                    <div className="group relative">
                                        {/* Connector Line */}
                                        {i < 2 && (
                                            <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-transparent dark:from-slate-700 z-0"></div>
                                        )}

                                        {/* Card */}
                                        <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800 group-hover:-translate-y-2">
                                            {/* Step Badge */}
                                            <div className={`absolute -top-4 left-8 px-4 py-1.5 rounded-full bg-gradient-to-r ${item.gradient} text-white text-sm font-bold shadow-lg`}>
                                                Step {item.step}
                                            </div>

                                            {/* Icon */}
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 mt-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <span className="material-symbols-outlined text-3xl text-white">{item.icon}</span>
                                            </div>

                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{item.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FITUR KEUNGGULAN */}
                <section id="fitur" className="py-24 w-full bg-slate-50 dark:bg-slate-900">
                    <div className="max-w-[1240px] mx-auto px-6 md:px-12 lg:px-20">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs font-bold tracking-wider uppercase mb-4">
                                Teknologi & Inovasi
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                                Fitur Unggulan Platform
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                Dirancang dengan antarmuka modern dan fitur lengkap untuk kemudahan jemaat
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { title: "Keamanan Data", desc: "Enkripsi end-to-end untuk melindungi privasi data jemaat.", icon: "security", gradient: "from-rose-500 to-pink-600" },
                                { title: "Akses Mudah", desc: "Dapat diakses kapan saja melalui Smartphone (Mobile Friendly).", icon: "devices", gradient: "from-amber-500 to-orange-600" },
                                { title: "Update Real-time", desc: "Perubahan data langsung terupdate di sistem pusat database.", icon: "sync", gradient: "from-emerald-500 to-teal-600" },
                                { title: "Pencarian Bakat", desc: "Fitur smart search untuk menemukan SDM sesuai kebutuhan pelayanan.", icon: "person_search", gradient: "from-blue-500 to-indigo-600" },
                                { title: "Laporan Visual", desc: "Dashboard statistik visual untuk pemantauan pertumbuhan jemaat.", icon: "query_stats", gradient: "from-violet-500 to-purple-600" },
                                { title: "Integrasi Pelayanan", desc: "Terhubung langsung dengan program kerja majelis jemaat.", icon: "hub", gradient: "from-cyan-500 to-blue-600" }
                            ].map((feature, i) => (
                                <Reveal key={i} delay={i * 50}>
                                    <div className="group h-full p-6 rounded-2xl bg-white dark:bg-slate-800 hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-700 group-hover:-translate-y-1">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                                            <span className="material-symbols-outlined text-2xl text-white">{feature.icon}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ SECTION */}
                <section id="faq" className="py-24 w-full bg-white dark:bg-slate-950">
                    <div className="max-w-[900px] mx-auto px-6">
                        <div className="text-center mb-16">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wider uppercase mb-4">
                                FAQ
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
                                Pertanyaan Yang Sering Diajukan
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { q: "Apakah data saya terjamin kerahasiaannya?", a: "Sangat terjamin. Sistem ini dikelola oleh tim khusus yang disumpah jabatan, dan data hanya digunakan untuk kepentingan internal pelayanan gereja." },
                                { q: "Bagaimana jika saya tidak memiliki email?", a: "Anda dapat meminta bantuan keluarga atau admin sekretariat di gereja untuk membantu proses pendaftaran." },
                                { q: "Apakah data ini wajib diisi oleh semua jemaat?", a: "Ya, sangat diharapkan partisipasi seluruh jemaat agar perencanaan pelayanan gereja dapat berjalan maksimal dan tepat sasaran." },
                                { q: "Bisakah saya mengubah data setelah pendaftaran?", a: "Bisa. Anda akan diberikan akses akun untuk masuk dan memperbarui data profil Anda kapan saja jika ada perubahan." }
                            ].map((faq, i) => (
                                <Reveal key={i} delay={i * 50}>
                                    <details className="group bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 open:shadow-lg transition-all duration-300 overflow-hidden">
                                        <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white pr-4">{faq.q}</h3>
                                            <span className="material-symbols-outlined text-slate-400 flex-shrink-0 transform group-open:rotate-180 transition-transform">expand_more</span>
                                        </summary>
                                        <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800">
                                            <div className="pt-4">{faq.a}</div>
                                        </div>
                                    </details>
                                </Reveal>
                            ))}
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