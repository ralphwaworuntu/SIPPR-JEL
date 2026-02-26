import React, { useState, useRef, useEffect } from 'react';

export const FormTooltip = ({ text }: { text: React.ReactNode }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showTooltip) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
                setShowTooltip(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showTooltip]);

    return (
        <div className="relative inline-flex items-center ml-1" ref={tooltipRef}>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowTooltip(!showTooltip);
                }}
                className="text-slate-400 hover:text-primary transition-colors focus:outline-none flex items-center bg-transparent border-none p-0 cursor-pointer"
                aria-label="Petunjuk pengisian"
            >
                <span className="material-symbols-outlined text-[5px]">help</span>
            </button>

            {showTooltip && (
                <div className="absolute left-[-10px] bottom-full mb-2 w-64 p-3 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-xl shadow-xl z-[100] border border-slate-700 dark:border-slate-700 font-normal leading-relaxed cursor-auto pointer-events-auto text-left">
                    {text}
                    <div className="absolute -bottom-[5px] left-4 w-2.5 h-2.5 bg-slate-900 dark:bg-slate-800 border-b border-r border-slate-700 transform rotate-45"></div>
                </div>
            )}
        </div>
    );
};
