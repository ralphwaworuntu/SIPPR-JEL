import React, { useState, useRef, useEffect } from 'react';

interface FormRadioGroupProps {
    label?: string | React.ReactNode;
    required?: boolean;
    name: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    columns?: 1 | 2 | 3 | 4;
    id?: string;
    tooltipText?: React.ReactNode;
}

const colClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
    label,
    required = false,
    name,
    options,
    value,
    onChange,
    columns = 2,
    id,
    tooltipText,
}) => {
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
        <div className="flex flex-col group relative">
            {label && (
                <label className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal pb-2 flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300 relative z-10">
                    {label}
                    {required && <span className="text-red-500">*</span>}
                    {tooltipText && (
                        <div className="relative inline-flex items-center ml-1" ref={tooltipRef}>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowTooltip(!showTooltip);
                                }}
                                className="text-slate-400 hover:text-primary transition-colors focus:outline-none flex items-center bg-transparent border-none p-0 cursor-pointer"
                                aria-label="Petunjuk pengisian"
                            >
                                <span className="material-symbols-outlined text-[5px]">help</span>
                            </button>

                            {showTooltip && (
                                <div className="absolute left-[-10px] bottom-full mb-2 w-64 p-3 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-xl shadow-xl z-[100] border border-slate-700 dark:border-slate-700 font-normal leading-relaxed cursor-auto pointer-events-auto">
                                    {tooltipText}
                                    <div className="absolute -bottom-[5px] left-4 w-2.5 h-2.5 bg-slate-900 dark:bg-slate-800 border-b border-r border-slate-700 transform rotate-45"></div>
                                </div>
                            )}
                        </div>
                    )}
                </label>
            )}
            <div className={`grid ${colClasses[columns]} gap-2.5`} id={id}>
                {options.map((option) => {
                    const isSelected = value === option;
                    return (
                        <label
                            key={`${name}-${option}`}
                            className={`group cursor-pointer relative p-3.5 border-2 rounded-xl flex items-center gap-3 transition-all duration-300 select-none ${isSelected
                                ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-sm shadow-primary/10 scale-[1.02]'
                                : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:shadow-md'
                                }`}
                        >
                            {/* Custom Radio Circle */}
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${isSelected
                                ? 'border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500'
                                : 'border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-800 group-hover:border-indigo-400'
                                }`}>
                                {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-white animate-scale-in" />
                                )}
                            </div>
                            <span className={`text-sm font-semibold transition-colors flex-grow ${isSelected
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-700 dark:text-slate-200 group-hover:text-primary/70'
                                }`}>
                                {option}
                            </span>
                            {isSelected && (
                                <span className="material-symbols-outlined text-slate-900 dark:text-white text-xl animate-scale-in">
                                    check_circle
                                </span>
                            )}
                            <input
                                type="radio"
                                name={name}
                                value={option}
                                checked={isSelected}
                                onChange={() => onChange(option)}
                                className="sr-only"
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default FormRadioGroup;
