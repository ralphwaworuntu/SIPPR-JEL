import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d1b12] dark:text-white transition-colors duration-300 min-h-screen font-display">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-solid border-[#e7f3eb] dark:border-[#1a3523] px-4 md:px-20 lg:px-40 py-3">
                <div className="max-w-[1200px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 text-primary">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                            </svg>
                        </div>
                        <h2 className="text-[#0d1b12] dark:text-white text-lg font-bold leading-tight tracking-tight">GMIT Emaus Liliba SDM</h2>
                    </div>
                    <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                        <nav className="flex items-center gap-9">
                            <a className="text-[#0d1b12] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#about">Tentang Program</a>
                            <a className="text-[#0d1b12] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#stats">Statistik</a>
                            <a className="text-[#0d1b12] dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">Bantuan</a>
                        </nav>
                        <button
                            onClick={() => navigate('/login')}
                            className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-[#0d1b12] text-sm font-bold hover:brightness-95 transition-all"
                        >
                            Login / Register
                        </button>
                    </div>
                    {/* Mobile Menu Icon (Visual Only) */}
                    <div className="md:hidden flex items-center">
                        <span className="material-symbols-outlined text-[#0d1b12] dark:text-white">menu</span>
                    </div>
                </div>
            </header>

            <main className="flex flex-col items-center">
                {/* Hero Section */}
                <section className="w-full max-w-[1200px] px-4 md:px-20 lg:px-40 py-10 md:py-20 @container">
                    <div className="flex flex-col gap-10 md:gap-12 lg:flex-row items-center">
                        <div className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-8 justify-center order-2 lg:order-1">
                            <div className="flex flex-col gap-4 text-left">
                                <span className="inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase bg-primary/20 text-primary rounded-full w-fit">
                                    HR BANK JEMAAT
                                </span>
                                <h1 className="text-[#0d1b12] dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
                                    Optimalkan Potensi Jemaat Untuk Pelayanan
                                </h1>
                                <p className="text-[#0d1b12] dark:text-gray-400 text-base md:text-lg font-normal leading-relaxed max-w-[500px]">
                                    Sistem Manajemen SDM untuk mendata dan mengoptimalkan talenta profesional jemaat GMIT Emaus Liliba demi pelayanan yang lebih berdampak dan profesional.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => navigate('/form')}
                                    className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 md:h-14 px-6 bg-primary text-[#0d1b12] text-base font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                >
                                    Isi Data Jemaat
                                </button>
                                <button
                                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-12 md:h-14 px-6 bg-[#e7f3eb] dark:bg-white/10 text-[#0d1b12] dark:text-white text-base font-bold hover:bg-[#d5e9db] dark:hover:bg-white/20 transition-all"
                                >
                                    Pelajari Program
                                </button>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 order-1 lg:order-2">
                            <div
                                className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-center bg-no-repeat bg-cover rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-background-dark"
                                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA3xlW2f_LXgdeFZs_hU54Ftk2ZyFOZcxBMSD7F2vqeAYxbEnEtOFbdXMPSyqN_Hmq6BZlrhPxnzLe_xM-nY1IplE2Qrz8R_7liQINycb-OzDMrFJm4QoVHGFGMEwW8A4ibSOkmKOrTh6oVNvX71emVVtjZpJNAUUfDzEq6eAj5aUai835hKMClBaJpLDOKMmZwz_FufTkMj1NHzVdUxNalHu24jGrmf3aPnfQ_Hl2G3sfipzAniTErtjta-BbMX5m4zUZQKYcr3aU")' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="w-full max-w-[1200px] px-4 md:px-20 lg:px-40 py-12" id="stats">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2 rounded-2xl p-8 bg-white dark:bg-[#152c1c] border border-[#cfe7d7] dark:border-[#1a3523] shadow-sm">
                            <span className="material-symbols-outlined text-primary mb-2 text-3xl">groups</span>
                            <p className="text-[#0d1b12] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Jemaat Terdata</p>
                            <p className="text-[#0d1b12] dark:text-white text-4xl font-extrabold">1,240+</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-2xl p-8 bg-white dark:bg-[#152c1c] border border-[#cfe7d7] dark:border-[#1a3523] shadow-sm">
                            <span className="material-symbols-outlined text-primary mb-2 text-3xl">verified_user</span>
                            <p className="text-[#0d1b12] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Kategori Keahlian</p>
                            <p className="text-[#0d1b12] dark:text-white text-4xl font-extrabold">45</p>
                        </div>
                        <div className="flex flex-col gap-2 rounded-2xl p-8 bg-white dark:bg-[#152c1c] border border-[#cfe7d7] dark:border-[#1a3523] shadow-sm">
                            <span className="material-symbols-outlined text-primary mb-2 text-3xl">volunteer_activism</span>
                            <p className="text-[#0d1b12] dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Program Pelayanan</p>
                            <p className="text-[#0d1b12] dark:text-white text-4xl font-extrabold">12</p>
                        </div>
                    </div>
                </section>

                {/* Feature Section */}
                <section className="w-full bg-white dark:bg-[#0d1b12]/50 py-20" id="about">
                    <div className="max-w-[1200px] mx-auto px-4 md:px-20 lg:px-40 flex flex-col gap-12 @container">
                        <div className="flex flex-col gap-4 text-center items-center">
                            <h2 className="text-[#0d1b12] dark:text-white text-3xl md:text-4xl font-black tracking-tight max-w-[720px]">
                                Mengapa HR Bank Sangat Penting?
                            </h2>
                            <div className="w-20 h-1.5 bg-primary rounded-full"></div>
                            <p className="text-[#0d1b12] dark:text-gray-400 text-base md:text-lg font-normal leading-relaxed max-w-[720px]">
                                Kami percaya setiap keahlian profesional—baik medis, teknis, edukasi, maupun kreatif—adalah karunia Tuhan untuk kemajuan pelayanan gereja bersama.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="group flex flex-col gap-5 rounded-2xl border border-[#cfe7d7] dark:border-[#1a3523] bg-background-light dark:bg-background-dark p-8 hover:border-primary transition-all duration-300">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                    <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>database</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[#0d1b12] dark:text-white text-xl font-bold">Pendataan Digital</h3>
                                    <p className="text-[#4c9a66] dark:text-gray-400 text-sm md:text-base leading-relaxed">
                                        Transformasi data manual jemaat ke dalam sistem digital yang aman, terpusat, dan mudah diakses oleh pengurus gereja.
                                    </p>
                                </div>
                            </div>
                            {/* Feature 2 */}
                            <div className="group flex flex-col gap-5 rounded-2xl border border-[#cfe7d7] dark:border-[#1a3523] bg-background-light dark:bg-background-dark p-8 hover:border-primary transition-all duration-300">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                    <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>search_check</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[#0d1b12] dark:text-white text-xl font-bold">Pemetaan Talenta</h3>
                                    <p className="text-[#4c9a66] dark:text-gray-400 text-sm md:text-base leading-relaxed">
                                        Memudahkan gereja mencari tenaga ahli dari berbagai bidang profesi untuk kebutuhan insidentil maupun rutin.
                                    </p>
                                </div>
                            </div>
                            {/* Feature 3 */}
                            <div className="group flex flex-col gap-5 rounded-2xl border border-[#cfe7d7] dark:border-[#1a3523] bg-background-light dark:bg-background-dark p-8 hover:border-primary transition-all duration-300">
                                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                    <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>diversity_3</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-[#0d1b12] dark:text-white text-xl font-bold">Kolaborasi Pelayanan</h3>
                                    <p className="text-[#4c9a66] dark:text-gray-400 text-sm md:text-base leading-relaxed">
                                        Mengintegrasikan keahlian jemaat langsung ke program-program gereja seperti aksi sosial, edukasi, dan pembangunan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action Section */}
                <section className="w-full max-w-[1200px] px-4 md:px-20 lg:px-40 py-20">
                    <div className="relative rounded-3xl bg-primary p-8 md:p-16 lg:p-20 overflow-hidden text-center flex flex-col items-center gap-8">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24"></div>
                        <div className="relative z-10 flex flex-col gap-4">
                            <h2 className="text-[#0d1b12] text-3xl md:text-4xl lg:text-5xl font-black leading-tight max-w-[800px]">
                                Siap berkontribusi dengan talenta Anda?
                            </h2>
                            <p className="text-[#0d1b12]/80 text-lg font-medium max-w-[650px] mx-auto">
                                Mari bersama membangun jemaat yang lebih berdaya melalui pemetaan SDM yang transparan, akuntabel, dan profesional.
                            </p>
                        </div>
                        <div className="relative z-10">
                            <button
                                onClick={() => navigate('/form')}
                                className="flex min-w-[240px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-[#0d1b12] text-white text-lg font-bold hover:scale-105 transition-all shadow-xl"
                            >
                                Mulai Isi Data Sekarang
                            </button>
                            <p className="mt-4 text-sm text-[#0d1b12]/60 font-semibold italic">Proses pendaftaran hanya membutuhkan waktu 5 menit</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full bg-[#e7f3eb] dark:bg-[#08150d] py-12 px-4 md:px-20 lg:px-40 mt-10">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="size-6 text-primary">
                                <svg fill="currentColor" viewBox="0 0 48 48">
                                    <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"></path>
                                </svg>
                            </div>
                            <span className="font-bold text-lg dark:text-white">GMIT Emaus Liliba</span>
                        </div>
                        <p className="text-[#4c9a66] dark:text-gray-400 text-sm leading-relaxed max-w-sm">
                            Gereja Masehi Injili di Timor (GMIT) Jemaat Emaus Liliba. <br />
                            Jl. Piet A. Tallo, Liliba, Kota Kupang, Nusa Tenggara Timur.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-[#0d1b12] dark:text-white uppercase tracking-wider text-xs">Navigasi</h4>
                        <ul className="flex flex-col gap-2 text-sm text-[#4c9a66] dark:text-gray-400">
                            <li><a className="hover:text-primary transition-colors" href="#">Beranda</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Tentang Program</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Daftar Keahlian</a></li>
                            <li><a className="hover:text-primary transition-colors" href="#">Kebijakan Privasi</a></li>
                        </ul>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-[#0d1b12] dark:text-white uppercase tracking-wider text-xs">Kontak Kami</h4>
                        <ul className="flex flex-col gap-2 text-sm text-[#4c9a66] dark:text-gray-400">
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">mail</span> info@gmit-emaus.or.id</li>
                            <li className="flex items-center gap-2"><span className="material-symbols-outlined text-xs">call</span> +62 380 123 4567</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto border-t border-[#cfe7d7] dark:border-[#1a3523] mt-12 pt-8 text-center text-xs text-[#4c9a66] dark:text-gray-500">
                    © 2024 GMIT Emaus Liliba. All rights reserved. Built for professional ecclesiastical management.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
