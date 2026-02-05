
export const Footer = () => {
    // We might not need navigation inside the footer component itself if it's just links, 
    // but the LandingPage footer has navigation links. 
    // Let's check if useNavigate is used. The original code doesn't use navigate in the footer specifically, 
    // but just in case we need it or for future consistency.export const Footer = () => {
    return (
        <footer className="w-full text-center text-xs text-slate-500 dark:text-slate-600 py-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
            © {new Date().getFullYear()} GMIT Emaus Liliba. Crafted with <span className="material-symbols-outlined text-primary align-middle text-sm px-1">favorite</span> by UPPMJ & Unit Multimedia.
        </footer>
    );
};
