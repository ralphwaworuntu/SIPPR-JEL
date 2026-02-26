import React, { useState, useRef, useEffect } from 'react';

interface FormSelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label?: string | React.ReactNode;
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: FormSelectOption[] | string[];
    placeholder?: string;
    required?: boolean;
    className?: string;
    tooltipText?: React.ReactNode;
}

const FormSelect: React.FC<FormSelectProps> = ({
    label,
    id,
    value,
    onChange,
    options,
    placeholder = 'Pilih...',
    required = false,
    className = '',
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

    const normalizedOptions: FormSelectOption[] = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    return (
        <div className={`flex flex-col group relative ${className}`}>
            {label && (
                <label
                    htmlFor={id}
                    className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal pb-2 flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300 relative z-10"
                >
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
            <div className="relative">
                <select
                    className={`w-full rounded-xl text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] h-12 px-4 text-base appearance-none outline-none transition-all duration-300 ${!value ? 'text-slate-400 dark:text-slate-600' : ''
                        }`}
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="">{placeholder}</option>
                    {normalizedOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
                    expand_more
                </span>
            </div>
        </div>
    );
};

export default FormSelect;
