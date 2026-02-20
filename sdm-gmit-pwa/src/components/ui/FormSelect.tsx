import React from 'react';

interface FormSelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    options: FormSelectOption[] | string[];
    placeholder?: string;
    required?: boolean;
    className?: string;
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
}) => {
    const normalizedOptions: FormSelectOption[] = options.map(opt =>
        typeof opt === 'string' ? { value: opt, label: opt } : opt
    );

    return (
        <div className={`flex flex-col group relative ${className}`}>
            <label
                htmlFor={id}
                className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal pb-2 flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300"
            >
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
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
