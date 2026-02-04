import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import heroSlide1 from '../assets/hero-slide-1.jpg';
import heroSlide2 from '../assets/hero-slide-2.jpg';
import { Reveal } from '../components/Reveal';
import { Footer } from '../components/Footer';


const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const backgroundImages = [heroSlide1, heroSlide2];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d1b12] dark:text-white transition-colors duration-300 min-h-screen font-display flex flex-col">
            {/* Top Navigation Bar - Solid & Clean (Reference Match) */}
            <header className="sticky top-0 z-50 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 md:px-10 lg:px-20 py-3 flex items-center justify-between shadow-sm relative backdrop-blur-md transition-all duration-300">
                {/* Logo Section */}
                <div className="flex items-center gap-4 z-20 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                    <span className="text-slate-700 dark:text-white font-bold text-xl tracking-tight transition-transform duration-300 group-hover:scale-105 group-hover:text-primary">GMIT Emaus Liliba</span>
                </div>

                {/* Centered Desktop Navigation */}
                <nav className={`hidden ${isMenuOpen ? '' : 'lg:flex'} absolute inset-0 items-center justify-center pointer-events-none`}>
                    <div className="flex items-center gap-8 pointer-events-auto">
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-all hover:scale-105 bg-transparent border-none cursor-pointer">Depan</button>
                        <a className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-all hover:scale-105" href="#about">Tentang Kami</a>
                        <a className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-all hover:scale-105" href="#stats">Post</a>
                        <button onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-600 dark:text-slate-300 text-sm font-semibold hover:text-primary transition-all hover:scale-105 bg-transparent border-none cursor-pointer">Kontak</button>
                    </div>
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3 z-20">
                    {/* Login Button - Dark Grey Rounded */}
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center justify-center rounded-lg h-10 px-5 bg-slate-600 text-white text-sm font-bold hover:bg-slate-700 transition-all shadow-sm hover:scale-105 hover:shadow-md active:scale-95"
                    >
                        Login
                    </button>

                    {/* Menu Button - White Square */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`lg:hidden flex items-center justify-center size-10 rounded-lg border transition-all shadow-sm ${isMenuOpen ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>{isMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>

                {/* Dropdown Menu (Vertical List Below Header) */}
                {isMenuOpen && (
                    <div className="absolute top-full left-0 right-0 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl flex flex-col py-4 px-4 md:px-10 lg:px-20 animate-fade-in-down">
                        <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMenuOpen(false); }} className="py-3 text-left text-slate-700 dark:text-slate-200 font-semibold text-base hover:text-primary transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 bg-transparent">Depan</button>
                        <a onClick={() => setIsMenuOpen(false)} className="py-3 text-slate-700 dark:text-slate-200 font-semibold text-base hover:text-primary transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0" href="#about">Tentang Kami</a>
                        <a onClick={() => setIsMenuOpen(false)} className="py-3 text-slate-700 dark:text-slate-200 font-semibold text-base hover:text-primary transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0" href="#stats">Post</a>
                        <button onClick={() => { document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' }); setIsMenuOpen(false); }} className="py-3 text-left text-slate-700 dark:text-slate-200 font-semibold text-base hover:text-primary transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0 bg-transparent">Kontak</button>
                    </div>
                )}
            </header>

            <main className="flex flex-col items-center w-full">
                {/* Hero Section - Full Screen Immersive */}
                <section
                    className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden"
                >
                    {/* Background Images Slider */}
                    {backgroundImages.map((img, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${index === currentBgIndex ? 'opacity-100' : 'opacity-0'}`}
                            style={{ backgroundImage: `url(${img})` }}
                        />
                    ))}
                    {/* Dark Overlay for readability */}
                    {/* Dark Overlay for readability - Darker to match reference style */}
                    <div className="absolute inset-0 bg-black/60"></div>

                    {/* Content Container */}
                    <div className="relative z-10 px-4 md:px-10 lg:px-20 text-center flex flex-col items-center gap-8 max-w-[1000px]">
                        <div className="flex flex-col gap-4 items-center">
                            <Reveal delay={200}>
                                <div className="flex flex-col items-center gap-2 mb-2">
                                    <h2 className="text-white text-xl md:text-3xl font-bold uppercase tracking-[0.15em] drop-shadow-lg">
                                        GMIT EMAUS LILIBA
                                    </h2>
                                </div>
                            </Reveal>

                            <Reveal delay={400}>
                                <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-black italic leading-tight tracking-tight drop-shadow-xl">
                                    "Pendataan dan Pemetaan <br className="hidden md:block" />
                                    SDM Profesional"
                                </h1>
                            </Reveal>

                            <Reveal delay={600}>
                                <p className="text-slate-100 text-lg md:text-xl font-medium leading-relaxed max-w-[800px] drop-shadow-md">
                                    "Layanilah seorang akan yang lain, sesuai dengan karunia yang telah diperoleh tiap-tiap orang sebagai pengurus yang baik dari kasih karunia Allah."
                                    <span className="block mt-2 text-sm text-slate-300 font-normal opacity-90">(1 Petrus 4:10)</span>
                                </p>
                            </Reveal>
                        </div>

                        <Reveal delay={800} className="w-full md:w-auto">
                            <div className="flex flex-wrap justify-center gap-4 mt-4 w-full md:w-auto">
                                <button
                                    onClick={() => navigate('/form')}
                                    className="min-w-[110px] cursor-pointer rounded-full h-10 px-6 bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    Mulai
                                </button>
                            </div>
                        </Reveal>
                    </div>

                    {/* Gradient Fade at Bottom of Hero for Smooth Transition */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background-light to-transparent z-0 pointer-events-none"></div>
                </section>

                {/* Stats Bar - Clean Block Layout (No Overlap) */}
                <section className="w-full max-w-[1200px] px-4 md:px-20 lg:px-40 py-16 bg-transparent" id="stats">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Reveal delay={0} className="h-full">
                            <div className="group flex flex-col gap-4 rounded-3xl p-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 h-full">
                                <span className="material-symbols-outlined text-primary mb-2 text-4xl">groups</span>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Jemaat Terdata</p>
                                    <p className="text-slate-900 dark:text-white text-4xl font-extrabold mt-1">1,240+</p>
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={200} className="h-full">
                            <div className="group flex flex-col gap-4 rounded-3xl p-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 h-full">
                                <span className="material-symbols-outlined text-primary mb-2 text-4xl">verified_user</span>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Kategori Keahlian</p>
                                    <p className="text-slate-900 dark:text-white text-4xl font-extrabold mt-1">45</p>
                                </div>
                            </div>
                        </Reveal>
                        <Reveal delay={400} className="h-full">
                            <div className="group flex flex-col gap-4 rounded-3xl p-8 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all duration-300 h-full">
                                <span className="material-symbols-outlined text-primary mb-2 text-4xl">volunteer_activism</span>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Program Pelayanan</p>
                                    <p className="text-slate-900 dark:text-white text-4xl font-extrabold mt-1">12</p>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* Feature Section with Organic Gradient */}
                <section className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-950 pb-24 pt-10" id="about">
                    <div className="max-w-[1200px] mx-auto px-4 md:px-20 lg:px-40 flex flex-col gap-12 @container">
                        <div className="flex flex-col gap-4 text-center items-center">
                            <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight max-w-[720px]">
                                Mengapa Pendataan dan Pemetaan SDM Profesional GMIT Emaus Liliba Sangat Penting?
                            </h2>
                            <div className="w-20 h-1.5 bg-primary rounded-full"></div>
                            <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg font-normal leading-relaxed max-w-[720px]">
                                Program ini merupakan langkah strategis kita untuk mengidentifikasi potensi, mensinergikan kolaborasi, dan melakukan perencanaan berbasis data yang lebih baik untuk pelayanan gereja.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <Reveal delay={0} className="h-full">
                                <div className="group flex flex-col gap-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 h-full">
                                    <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-primary group-hover:text-slate-900 transition-all">
                                        <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>search_check</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-slate-900 dark:text-white text-xl font-bold">Identifikasi Potensi</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                                            Mengenali kekayaan talenta, profesi, dan keahlian spesifik yang Tuhan titipkan kepada setiap anggota jemaat.
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                            {/* Feature 2 */}
                            <Reveal delay={200} className="h-full">
                                <div className="group flex flex-col gap-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 h-full">
                                    <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-primary group-hover:text-slate-900 transition-all">
                                        <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>diversity_3</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-slate-900 dark:text-white text-xl font-bold">Sinergi & Kolaborasi</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                                            Membangun jejaring profesional antar jemaat guna mendukung pelayanan internal yang lebih efektif serta misi eksternal yang lebih berdampak nyata bagi masyarakat.
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                            {/* Feature 3 */}
                            <Reveal delay={400} className="h-full">
                                <div className="group flex flex-col gap-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 hover:border-primary/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 h-full">
                                    <div className="size-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 group-hover:bg-primary group-hover:text-slate-900 transition-all">
                                        <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>Database</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-slate-900 dark:text-white text-xl font-bold">Perencanaan Berbasis Data</h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                                            Menyediakan pangkalan data yang akurat dan valid sebagai dasar penyusunan program pelayanan yang tepat sasaran, inovatif, dan relevan dengan kebutuhan jemaat.                                   </p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>


            </main>

            {/* Footer */}
            <Footer />



        </div >
    );
};

export default LandingPage;
