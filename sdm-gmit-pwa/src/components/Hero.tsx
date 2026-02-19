import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';


export const Hero = () => {
    const ref = useRef(null);
    const navigate = useNavigate();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="relative w-full min-h-[90vh] flex flex-col overflow-hidden">
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

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="max-w-2xl text-slate-200 text-lg md:text-xl leading-relaxed font-light"
                        >

                        </motion.p>
                    </div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 pt-6"
                    >
                        <button
                            onClick={() => navigate('/form')}
                            className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Mulai
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform"></span>
                            </span>
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce"
            >
                <span className="text-xs font-medium uppercase tracking-widest">Scroll</span>
                <span className="material-symbols-outlined">expand_more</span>
            </motion.div>
        </section>
    );
};
