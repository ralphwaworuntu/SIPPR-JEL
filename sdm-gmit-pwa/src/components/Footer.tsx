import { Heart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-8 pt-12 text-center md:text-left transition-colors font-display">
            <div className="max-w-[1240px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-4">GMIT Emaus Liliba</h4>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Mewujudkan jemaat yang bertumbuh, berakar dalam Kristus, dan berdampak bagi sesama.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white mb-4">Akses Cepat</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Beranda</a></li>
                            <li><a href="#tentang" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Tentang Program</a></li>
                            <li><a href="#fitur" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Fitur</a></li>
                            <li><a href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Admin Login</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white mb-4">Hubungi Kami</h4>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li>Jl. Emaus, Liliba, Kupang</li>
                            <li>Nusa Tenggara Timur</li>
                            <li>sekretariat@gmitemausliliba.org</li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white mb-4">Ikuti Kami</h4>
                        <div className="flex gap-4 justify-center md:justify-start">
                            {/* Placeholder Social Links */}
                            {['facebook', 'youtube', 'instagram'].map((social) => (
                                <a key={social} href="#" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all">
                                    <span className="capitalize text-xs">{social[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-500">
                    <p>
                        © {new Date().getFullYear()} GMIT Emaus Liliba. Developed by UPPMJ & Satuan Pelayanan Profesional.
                        <span className="block mt-2 md:inline md:mt-0 md:ml-4 opacity-70">
                            Crafted with <Heart className="inline w-3 h-3 text-red-500 fill-red-500 mx-0.5" /> for the Kingdom.
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
