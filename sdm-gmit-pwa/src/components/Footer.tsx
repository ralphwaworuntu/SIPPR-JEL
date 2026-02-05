import { Heart } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="w-full text-center text-xs text-slate-500 dark:text-slate-600 py-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
            © Crafted with <Heart className="inline w-3 h-3 text-red-500 fill-red-500 mx-1" /> by UPPMJ &amp; Satuan Pelayanan Profesional GMIT Emaus Liliba.
        </footer>
    );
};
