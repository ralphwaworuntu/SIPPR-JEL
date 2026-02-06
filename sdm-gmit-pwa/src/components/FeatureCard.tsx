import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { MouseEvent } from "react";

interface FeatureCardProps {
    title: string;
    desc: string;
    icon: string;
    gradient: string;
    delay?: number;
}

export const FeatureCard = ({ title, desc, icon, gradient, delay = 0 }: FeatureCardProps) => {
    // Mouse position state for tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring animation for the tilt
    const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();

        // Calculate mouse position relative to card center
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const mouseX = clientX - centerX;
        const mouseY = clientY - centerY;

        // Rotation intensity
        rotateX.set(mouseY / -10); // Tilt X axis based on Y position
        rotateY.set(mouseX / 10);  // Tilt Y axis based on X position

        // Spotlight gradient position
        x.set(clientX - left);
        y.set(clientY - top);
    }

    function handleMouseLeave() {
        rotateX.set(0);
        rotateY.set(0);
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay * 0.1, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="group relative h-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm hover:shadow-xl transition-shadow duration-300 transform perspective-1000"
        >
            {/* Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${x}px ${y}px,
                            rgba(99, 102, 241, 0.1),
                            transparent 80%
                        )
                    `,
                }}
            />

            <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <span className="material-symbols-outlined text-2xl text-white">
                        {icon}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {title}
                </h3>

                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {desc}
                </p>
            </div>
        </motion.div>
    );
};
