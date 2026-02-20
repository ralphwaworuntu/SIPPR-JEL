import React from 'react';

interface FormInputProps {
    label: string;
    id: string;
    value: string | number;
    onChange: (value: string) => void;
    type?: 'text' | 'number' | 'tel' | 'date' | 'email';
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    prefix?: string;
    error?: string | null;
    className?: string;
    onBlur?: () => void;
    inputRef?: React.RefObject<HTMLInputElement>;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    id,
    value,
    onChange,
    type = 'text',
    placeholder,
    required = false,
    readOnly = false,
    prefix,
    error,
    className = '',
    onBlur,
    inputRef,
}) => {
    return (
        <div className={`flex flex-col group relative ${className}`}>
            <label
                htmlFor={id}
                className="text-slate-800 dark:text-slate-100 text-sm font-bold leading-normal pb-2 flex items-center gap-1 group-focus-within:text-primary transition-colors duration-300"
            >
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            <div className={`flex ${prefix ? '' : ''}`}>
                {prefix && (
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border-2 border-r-0 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold">
                        {prefix}
                    </span>
                )}
                <input
                    ref={inputRef as React.RefObject<HTMLInputElement | null>}
                    className={`w-full ${prefix ? 'rounded-r-xl' : 'rounded-xl'} text-slate-900 dark:text-white border-2 transition-all duration-300 ${error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20 hover:border-red-500/50'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary/40 focus:border-primary focus:ring-primary/20 focus:shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]'
                        } ${readOnly
                            ? 'bg-slate-50 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-white dark:bg-slate-900'
                        } focus:ring-4 h-12 px-4 text-base placeholder-slate-400 dark:placeholder-slate-600 outline-none`}
                    type={type}
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    onBlur={onBlur}
                />
            </div>
            {error && (
                <div className="flex items-center gap-1 mt-1.5 text-red-500 text-xs font-medium animate-fadeIn">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    {error}
                </div>
            )}
        </div>
    );
};

export default FormInput;
