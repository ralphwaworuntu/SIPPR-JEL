import React, { useState, useRef, useEffect } from 'react';

interface FormMultiSelectOption {
    value: string;
    label: string;
}

interface FormMultiSelectProps {
    label?: string | React.ReactNode;
    id: string;
    value: string[];
    onChange: (value: string[]) => void;
    options: FormMultiSelectOption[] | string[];
    placeholder?: string;
    required?: boolean;
    className?: string;
    tooltipText?: React.ReactNode;
}

const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
    label,
    id,
    value,
    onChange,
    options,
    placeholder = 'Pilih beberapa...',
    required = false,
    className = '',
    tooltipText,
}) => {
    // Safety check: ensure value is always an array (prevents crash if localStorage has old string values)
    const safeValue = Array.isArray(value) ? value : [];

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const normalizedOptions: FormMultiSelectOption[] = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setShowTooltip(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (optValue: string) => {
        const newValue = safeValue.includes(optValue)
            ? safeValue.filter(v => v !== optValue)
            : [...safeValue, optValue];
        onChange(newValue);
    };

    const displayText = safeValue.length > 0
        ? `${safeValue.length} terpilih`
        : placeholder;

    return (
        <div className={`flex flex-col group relative ${className} ${isOpen ? 'z-[100]' : 'z-10'}`} ref={containerRef}>
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
                                    e.stopPropagation();
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
                <button
                    id={id}
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full rounded-xl text-left border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)] h-12 px-4 text-base outline-none transition-all duration-300 flex items-center justify-between ${safeValue.length === 0 ? 'text-slate-400 dark:text-slate-600' : 'text-slate-900 dark:text-white font-semibold'
                        }`}
                >
                    <span className="truncate">{displayText}</span>
                    <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-[110] w-full mt-2 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden animate-fadeIn max-h-60 overflow-y-auto custom-scrollbar">
                        <div className="p-2 space-y-1">
                            {normalizedOptions.map((opt) => {
                                const isSelected = safeValue.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => toggleOption(opt.value)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group/item ${isSelected
                                            ? 'bg-primary/10 dark:bg-primary/20'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 shrink-0 ${isSelected
                                            ? 'bg-indigo-600 border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500'
                                            : 'border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-900 group-hover/item:border-indigo-400'
                                            }`}>
                                            {isSelected && (
                                                <span className="material-symbols-outlined text-white text-[14px] font-bold animate-scale-in">
                                                    check
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-sm font-semibold transition-colors text-left flex-1 ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                                            }`}>
                                            {opt.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Display selected chips below */}
            {safeValue.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5 transition-all duration-300">
                    {safeValue.map(val => (
                        <span key={val} className="inline-flex items-center gap-1.5 bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1.5 rounded-lg text-xs font-bold border border-primary/20 shadow-sm animate-scale-in">
                            {val}
                            <button
                                type="button"
                                onClick={() => toggleOption(val)}
                                className="hover:text-red-500 transition-colors flex items-center ml-0.5"
                            >
                                <span className="material-symbols-outlined text-[14px] leading-none font-bold">close</span>
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormMultiSelect;
