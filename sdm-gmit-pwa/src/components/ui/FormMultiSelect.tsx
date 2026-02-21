import React, { useState, useRef, useEffect } from 'react';

interface FormMultiSelectOption {
    value: string;
    label: string;
}

interface FormMultiSelectProps {
    label?: string;
    id: string;
    value: string[];
    onChange: (value: string[]) => void;
    options: FormMultiSelectOption[] | string[];
    placeholder?: string;
    required?: boolean;
    className?: string;
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
}) => {
    // Safety check: ensure value is always an array (prevents crash if localStorage has old string values)
    const safeValue = Array.isArray(value) ? value : [];

    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const normalizedOptions: FormMultiSelectOption[] = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
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
                    className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal pb-2 flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300"
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
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
                                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group/item ${isSelected
                                            ? 'bg-primary/10 dark:bg-primary/20 text-slate-900 dark:text-white shadow-sm'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary'
                                            }`}
                                    >
                                        <div className={`w-5.5 h-5.5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${isSelected
                                            ? 'bg-primary border-primary shadow-sm shadow-primary/30 rotate-0'
                                            : 'border-slate-300 dark:border-slate-600 group-hover/item:border-primary/50 bg-white dark:bg-slate-900 -rotate-3'
                                            }`}>
                                            {isSelected && (
                                                <span className="material-symbols-outlined text-slate-900 dark:text-slate-900 text-[18px] font-black animate-scaleIn">
                                                    check_circle
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-sm font-bold transition-colors text-left flex-1 ${isSelected ? 'text-slate-900 dark:text-white' : ''
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
                        <span key={val} className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1.5 rounded-xl text-[11px] font-bold border border-slate-200 dark:border-slate-700 shadow-sm animate-scaleIn">
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
