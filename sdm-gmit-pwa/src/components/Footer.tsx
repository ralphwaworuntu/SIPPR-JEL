import { Heart, Facebook, Youtube, Instagram } from 'lucide-react';

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
                        <div className="flex flex-col gap-3">
                            {[
                                { icon: Facebook, href: "https://facebook.com/gmitemaus", label: "Facebook", username: "GMIT Emaus Liliba" },
                                { icon: Youtube, href: "https://youtube.com/@gmitemaus", label: "YouTube", username: "GMIT Emaus Official" },
                                { icon: Instagram, href: "https://instagram.com/gmit_emaus", label: "Instagram", username: "@gmit_emaus" }
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="flex items-center gap-3 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <social.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium">{social.username}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-500">
                    <p>
                        © {new Date().getFullYear()} GMIT Emaus Liliba. Developed by UPPMJ & Satuan Pelayanan Profesional.

                    </p>
                </div>
            </div>
        </footer>
    );
};
