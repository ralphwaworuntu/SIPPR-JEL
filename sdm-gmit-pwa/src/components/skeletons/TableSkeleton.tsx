import { Skeleton } from "../ui/Skeleton";

export const TableSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in">
            {/* Toolbar Skeleton */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 justify-between">
                <Skeleton className="h-10 w-64 rounded-xl" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-xl" />
                    <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="p-4 grid grid-cols-6 gap-4">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};
