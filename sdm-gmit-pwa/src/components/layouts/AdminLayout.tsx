import { useState } from 'react';
import { AdminHeader } from '../admin/AdminHeader';
import { AdminSidebar } from '../admin/AdminSidebar';


interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const AdminLayout = ({ children, title = "Dashboard" }: AdminLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="font-display bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden selection:bg-primary/30">
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <AdminHeader
                    title={title}
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                />

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth flex flex-col">
                    <div className="max-w-7xl mx-auto space-y-8 w-full flex-1">
                        {children}
                    </div>
                    <div className="mt-12 py-6 text-center border-t border-slate-100 dark:border-slate-800">
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            Developed by GMIT Emaus Liliba. &copy; {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
