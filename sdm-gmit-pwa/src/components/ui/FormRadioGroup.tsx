import React from 'react';

interface FormRadioGroupProps {
    name: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    columns?: 1 | 2 | 3 | 4;
    id?: string;
}

const colClasses: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};

const FormRadioGroup: React.FC<FormRadioGroupProps> = ({ name, options, value, onChange, columns = 2, id }) => {
    return (
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
                            ? 'border-primary bg-primary'
                            : 'border-slate-300 dark:border-slate-600 group-hover:border-primary/50'
                            }`}>
                            {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white animate-scaleIn" />
                            )}
                        </div>
                        <span className={`text-sm font-semibold transition-colors flex-grow ${isSelected
                            ? 'text-primary dark:text-primary'
                            : 'text-slate-700 dark:text-slate-200 group-hover:text-primary/70'
                            }`}>
                            {option}
                        </span>
                        {isSelected && (
                            <span className="material-symbols-outlined text-primary text-xl animate-scaleIn">
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
    );
};

export default FormRadioGroup;
