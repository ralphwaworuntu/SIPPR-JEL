import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';
import { Play, X } from 'lucide-react';

// Declare YT for TypeScript
declare global {
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export const Hero = () => {
    const ref = useRef(null);
    const navigate = useNavigate();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // YouTube Player API
    const playerRef = useRef<any>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // Load YT API script if not already loaded
        if (isVideoModalOpen && !window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                initializePlayer();
            };
        } else if (isVideoModalOpen && window.YT) {
            // API is already loaded, just initialize
            initializePlayer();
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        }
    }, [isVideoModalOpen]);

    const initializePlayer = () => {
        if (!iframeRef.current || !window.YT) return;

        playerRef.current = new window.YT.Player(iframeRef.current, {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }

    const onPlayerStateChange = (event: any) => {
        // YT.PlayerState.ENDED is 0
        if (event.data === 0) {
            setIsVideoModalOpen(false);
            navigate('/form');
        }
    }

    return (
        <section ref={ref} className="relative w-full min-h-[85vh] flex flex-col overflow-hidden">
            {/* Parallax Background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 z-0"
            >
                <img
                    src={heroBg}
                    alt="Background"
                    className="w-full h-full object-cover scale-110" // scale to prevent white edges during parallax
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50 dark:to-slate-950"></div>
            </motion.div>

            {/* Hero Content */}
            <motion.div
                style={{ y: textY, opacity }}
                className="relative z-10 flex-1 flex items-center justify-center px-6 py-20"
            >
                <div className="max-w-4xl text-center text-white flex flex-col items-center gap-8">
                    {/* Animated Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-2"
                    >
                        {/* <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl"> */}
                        {/* Use actual logo if preferred, or keep this placeholder wrapper style if needed */}
                        {/* </div> */}
                    </motion.div>

                    {/* Staggered Text */}
                    <div className="flex flex-col items-center gap-4">


                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight drop-shadow-2xl bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300"
                        >
                            Bank Data
                            <br />
                            <span className="text-2xl md:text-4xl lg:text-5xl font-serif italic text-indigo-100 font-normal">
                                Jemaat GMIT Emaus Liliba
                            </span>
                        </motion.h1>
                    </div>



                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 pt-6"
                    >
                        <button
                            onClick={() => setIsVideoModalOpen(true)}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 relative overflow-hidden group flex items-center gap-3"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                <Play size={20} className="fill-white" />
                                MULAI
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform"></span>
                            </span>
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Video Modal - Light Theme */}
            <AnimatePresence>
                {isVideoModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setIsVideoModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                <h3 className="text-slate-800 dark:text-white font-bold text-lg">Panduan Pengisian Data</h3>
                                <button
                                    onClick={() => setIsVideoModalOpen(false)}
                                    className="p-2 text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Video Container (16:9 Aspect Ratio) */}
                            <div className="relative w-full aspect-video bg-black">
                                <iframe
                                    ref={iframeRef}
                                    className="absolute inset-0 w-full h-full"
                                    src="https://www.youtube.com/embed/ZkE-nCD_OmQ?autoplay=1&controls=0&rel=0&modestbranding=1&enablejsapi=1"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Modal Footer / Action */}
                            <div className="p-6 bg-white dark:bg-slate-900 flex justify-center border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => {
                                        setIsVideoModalOpen(false);
                                        navigate('/form');
                                    }}
                                    className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 w-full max-w-sm flex flex-col items-center justify-center"
                                >
                                    <span>Lanjut Isi Data Jemaat</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/50 animate-bounce"
            >
                <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
                <span className="material-symbols-outlined">expand_more</span>
            </motion.div>
        </section>
    );
};
