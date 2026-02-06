import { useRef, useEffect } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface StatsCounterProps {
    value: number;
    label: string;
    suffix?: string;
    duration?: number;
}

export const StatsCounter = ({ value, label, suffix = "+", duration = 2 }: StatsCounterProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });

    // Motion value initialization
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
        duration: duration * 1000 // duration is not directly utilized by spring but we control setting value
    });

    useEffect(() => {
        if (inView) {
            motionValue.set(value);
        }
    }, [inView, value, motionValue]);

    // Update text content with rounded numbers
    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest).toLocaleString('id-ID') + suffix;
            }
        });
    }, [springValue, suffix]);

    return (
        <div className="flex flex-col items-center">
            <span
                ref={ref}
                className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2"
            >
                0{suffix}
            </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium text-sm tracking-wider uppercase">
                {label}
            </span>
        </div>
    );
};
