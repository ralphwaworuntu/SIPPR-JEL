
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-300 py-16 px-4 md:px-20 lg:px-40 relative overflow-hidden" id="footer">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                {/* Column 1: Brand */}
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-2xl font-bold text-white mb-4">GMIT Emaus Liliba</h2>
                    <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
                        Membangun jemaat yang mandiri, misioner, dan berdaya guna bagi kemuliaan Tuhan. Bergabunglah bersama kami dalam pelayanan.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all duration-300">
                            <Facebook size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300">
                            <Instagram size={18} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300">
                            <Twitter size={18} />
                        </a>
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-6">Navigasi</h3>
                    <ul className="space-y-4">
                        <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Beranda</a></li>
                        <li><a href="#about" className="hover:text-white hover:translate-x-1 transition-all inline-block">Tentang Kami</a></li>
                        <li><a href="#stats" className="hover:text-white hover:translate-x-1 transition-all inline-block">Statistik</a></li>
                        <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Program Pelayanan</a></li>
                    </ul>
                </div>

                {/* Column 3: Contact */}
                <div>
                    <h3 className="text-white font-semibold text-lg mb-6">Hubungi Kami</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                            <span>Jl. Emaus No. 1, Liliba, Kupang, NTT</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-indigo-400 shrink-0" />
                            <span>(0380) 1234567</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
                            <span>sekretariat@gmitemaus.org</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                <p>© 2026 GMIT Emaus Liliba. All rights reserved.</p>
                <p className="flex items-center gap-1">
                    Made with <span className="text-red-500 animate-pulse">❤</span> by Tim Multimedia & IT
                </p>
            </div>
        </footer>
    );
};
