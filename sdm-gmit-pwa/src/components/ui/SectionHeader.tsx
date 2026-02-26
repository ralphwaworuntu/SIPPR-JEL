import React from 'react';
import { FormTooltip } from './FormTooltip';

interface SectionHeaderProps {
    number?: number;
    title: string;
    description?: string;
    icon?: string;
    tooltipText?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ number, title, description, icon, tooltipText }) => {
    return (
        <div className="flex items-start gap-4 pb-4 mb-6 relative group">
            {/* Subtle Gradient Bottom Border */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-slate-200 via-slate-100 to-transparent dark:from-slate-700 dark:via-slate-800 dark:to-transparent"></div>
            {/* Left Accent Bar */}
            <div className="absolute left-0 top-1 bottom-5 w-[3px] rounded-r-full bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>

            <div className="pl-3 flex items-start gap-3 w-full">
                {number !== undefined && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 border border-primary/10">
                        <span className="text-primary text-sm font-black">{number}</span>
                    </div>
                )}
                {icon && !number && (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 border border-primary/10">
                        <span className="material-symbols-outlined text-primary text-base">{icon}</span>
                    </div>
                )}
                <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        {title}
                        {tooltipText && <FormTooltip text={tooltipText} />}
                    </h4>
                    {description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SectionHeader;
