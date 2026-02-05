import { useState } from 'react';
import { AdminHeader } from '../admin/AdminHeader';
import { AdminSidebar } from '../admin/AdminSidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export const AdminLayout = ({ children, title = "Dashboard" }: AdminLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="font-display bg-background-light dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden selection:bg-primary/30">
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <AdminHeader
                    title={title}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 scroll-smooth flex flex-col">
                    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in w-full flex-1">
                        {children}
                    </div>
                    <div className="mt-12">
                        <footer className="w-full text-center text-xs text-slate-500 dark:text-slate-600 py-6 border-t border-slate-100 dark:border-slate-800">
                            © Crafted with <span className="material-symbols-outlined text-primary align-middle text-sm">favorite</span> by UPPMJ &amp; Satuan Pelayanan Profesional GMIT Emaus Liliba.
                        </footer>
                    </div>
                </div>
            </main>
        </div>
    );
};
