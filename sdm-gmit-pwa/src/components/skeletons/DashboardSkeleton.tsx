import { Skeleton } from "../ui/Skeleton";

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex justify-between items-start">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="h-6 w-12 rounded-full" />
                        </div>
                        <div>
                            <Skeleton className="h-8 w-24 mb-1" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-6">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-8 w-24" />
                    </div>
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                </div>
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <Skeleton className="h-6 w-32 mb-6" />
                    <Skeleton className="h-[300px] w-full rounded-full" />
                </div>
            </div>
        </div>
    );
};
