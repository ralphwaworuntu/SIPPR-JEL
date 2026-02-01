import { useState } from 'react';
import { authClient } from '../lib/auth-client';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    // const { data: session } = useSession(); // Will enable when server is running
    // const session = { user: { name: 'Admin', email: 'admin@gmit.org' } }; // Mock session
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await authClient.signOut();
        navigate('/login');
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex overflow-hidden">
            {/* Sidebar */}
            <aside className={`w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col shrink-0 transition-all duration-300 fixed md:static z-20 h-full ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">church</span>
                    </div>
                    <div>
                        <h1 className="text-sm font-bold leading-none">GMIT Emaus</h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Liliba HR Management</p>
                    </div>
                </div>

                <nav className="flex-1 py-4 flex flex-col gap-1">
                    <a className="flex items-center gap-3 px-6 py-3 bg-primary/20 border-r-4 border-primary text-slate-900 dark:text-white font-medium" href="/admin">
                        <span className="material-symbols-outlined text-primary">dashboard</span>
                        Dashboard
                    </a>
                    <a className="flex items-center gap-3 px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="/admin/members">
                        <span className="material-symbols-outlined">table_view</span>
                        Member Data
                    </a>
                    <a className="flex items-center gap-3 px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">
                        <span className="material-symbols-outlined">groups</span>
                        Congregation
                    </a>
                    <a className="flex items-center gap-3 px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" href="#">
                        <span className="material-symbols-outlined">bar_chart</span>
                        Reports
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <a className="flex items-center gap-3 px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                        <span className="material-symbols-outlined">settings</span>
                        Settings
                    </a>
                    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex items-center gap-3 cursor-pointer" onClick={handleLogout}>
                        <div className="size-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDaqIGv_LpUetHEhUCQk3Zqcdt6OJC7Gp3VusVRiqSoeH5V4mkBvFq79wCG9WWqY-kqv0rm7vG_Zg6SQFGm9nDgICQUbcMkyPr3TetKlUbxdNtm7ypW1iChPa75pUk5C9d6P40AZL4r49mlKYnoqJ5QukR47O5QSo_v70zE08ktYmNIxjUtc1LcdeMbI4XJjoBAdFA6O8MQ68HcLbiQVg87_Mzw-kfnQ-OuhXTcPuVlUY1sWzqqvmYKhvNooQ_3qldPNG41ARYl9mE')" }}></div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate">Pdt. Admin</p>
                            <p className="text-[10px] text-slate-500 truncate">Log Out</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto h-screen">
                {/* Top Navbar */}
                <header className="sticky top-0 z-10 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-slate-500" onClick={() => setSidebarOpen(true)}>
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-xl font-bold tracking-tight">Admin Dashboard Overview</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative hidden lg:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Search congregation data..."
                                type="text"
                            />
                        </div>
                        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-background-dark"></span>
                        </button>
                        <button className="flex items-center gap-2 bg-primary text-slate-900 px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-sm">add</span>
                            New Member
                        </button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 w-full space-y-8 pb-20">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Members</p>
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] font-bold">+12.5%</span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-extrabold">1,240</h3>
                                <p className="text-xs text-slate-400 mt-1">Verified registrations</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Professionals</p>
                                <span className="bg-blue-500/10 text-blue-500 px-2 py-1 rounded-md text-[10px] font-bold">+5.2%</span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-extrabold">450</h3>
                                <p className="text-xs text-slate-400 mt-1">Available for church tasks</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Service Volunteers</p>
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] font-bold">Stable</span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-extrabold">310</h3>
                                <p className="text-xs text-slate-400 mt-1">Regular Sunday service</p>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Skills Identified</p>
                                <span className="bg-purple-500/10 text-purple-500 px-2 py-1 rounded-md text-[10px] font-bold">+24%</span>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-3xl font-extrabold">82</h3>
                                <p className="text-xs text-slate-400 mt-1">Unique professional categories</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section: Pie Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Gender Distribution */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">Gender Distribution</h3>
                                <span className="material-symbols-outlined text-slate-400 cursor-pointer">more_horiz</span>
                            </div>
                            <div className="flex items-center justify-center h-64 relative">
                                {/* SVG Pie Chart Representation */}
                                <svg className="w-48 h-48 -rotate-90" viewBox="0 0 32 32">
                                    <circle cx="16" cy="16" fill="transparent" r="16" stroke="#13ec5b" strokeDasharray="55 100" strokeWidth="32"></circle>
                                    <circle cx="16" cy="16" fill="transparent" r="16" stroke="#e2e8f0" strokeDasharray="45 100" strokeDashoffset="-55" strokeWidth="32"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-bold">1,240</span>
                                    <span className="text-xs text-slate-500">Total</span>
                                </div>
                            </div>
                            <div className="flex justify-center gap-8 mt-4">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-primary"></span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Female (55%)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-slate-200"></span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Male (45%)</span>
                                </div>
                            </div>
                        </div>

                        {/* Willingness to Serve */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">Willingness to Serve</h3>
                                <span className="material-symbols-outlined text-slate-400 cursor-pointer">more_horiz</span>
                            </div>
                            <div className="flex items-center justify-center h-64 relative">
                                <svg className="w-48 h-48 -rotate-90" viewBox="0 0 32 32">
                                    <circle cx="16" cy="16" fill="transparent" r="16" stroke="#13ec5b" strokeDasharray="75 100" strokeWidth="32"></circle>
                                    <circle cx="16" cy="16" fill="transparent" r="16" stroke="#e2e8f0" strokeDasharray="15 100" strokeDashoffset="-75" strokeWidth="32"></circle>
                                    <circle cx="16" cy="16" fill="transparent" r="16" stroke="#f43f5e" strokeDasharray="10 100" strokeDashoffset="-90" strokeWidth="32"></circle>
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-2xl font-bold">75%</span>
                                    <span className="text-xs text-slate-500">Willing</span>
                                </div>
                            </div>
                            <div className="flex justify-center gap-6 mt-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-primary"></span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Willing</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-slate-200"></span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Undecided</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="size-3 rounded-full bg-red-500"></span>
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Not Willing</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Histogram: Education Levels */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-bold text-lg">Education Levels</h3>
                                <p className="text-sm text-slate-500">Distribution of formal education across the congregation</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-50 transition-colors">Export PDF</button>
                            </div>
                        </div>
                        <div className="h-64 flex items-end gap-4 px-4">
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group cursor-pointer overflow-hidden" style={{ height: '20%' }}>
                                    <div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-colors h-full"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Primary</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group cursor-pointer overflow-hidden" style={{ height: '45%' }}>
                                    <div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-colors h-full"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">High School</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group cursor-pointer overflow-hidden" style={{ height: '85%' }}>
                                    <div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-colors h-full"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Bachelor's</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group cursor-pointer overflow-hidden" style={{ height: '60%' }}>
                                    <div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-colors h-full"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Master's</span>
                            </div>
                            <div className="flex-1 flex flex-col items-center gap-2">
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg relative group cursor-pointer overflow-hidden" style={{ height: '30%' }}>
                                    <div className="absolute bottom-0 w-full bg-primary/40 group-hover:bg-primary transition-colors h-full"></div>
                                </div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Doctorate</span>
                            </div>
                        </div>
                    </div>

                    {/* Geographic Distribution Map */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-lg">Member Distribution</h3>
                                <p className="text-sm text-slate-500">Live heatmap of congregation residency in Liliba</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                    <span className="material-symbols-outlined">filter_list</span>
                                </button>
                                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                    <span className="material-symbols-outlined">fullscreen</span>
                                </button>
                            </div>
                        </div>
                        <div className="h-[400px] w-full bg-slate-200 dark:bg-slate-800 relative">
                            {/* Map Placeholder Image Style */}
                            <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDUf0aKl_-pIEU6dhsxwnBxqd5rHF5v3EvQFtUXMPSzXZesMVeew24t8P-_uHmT3RMZQoZcCsExzNFo_ImuTwhXWz2zqjXglosFbapmJhKBPc3_CxvieucPGRumyHTE-0ZqcKpK7qxevxD9JJ0Jcd8Jc1J_I5bTRIS1dEw8alJEpE_wr3HwxExVsRNdyDXDPgc0pUqzfCo-EkWm3E8t63OWVlSgUtnx7B-7buzvGp1VfBL1cFR6GRRgIOpTrw8l8yMeSvWEANOY-yY')" }}></div>

                            {/* UI Overlays for Map */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button className="size-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center rounded-lg shadow-lg hover:bg-slate-50 transition-colors">
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                                <button className="size-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center rounded-lg shadow-lg hover:bg-slate-50 transition-colors">
                                    <span className="material-symbols-outlined">remove</span>
                                </button>
                            </div>
                            <div className="absolute bottom-4 left-4 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl max-w-xs">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Map Legend</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="size-3 bg-primary rounded-full ring-4 ring-primary/20"></div>
                                        <span className="text-xs font-medium">High Density (&gt;50 families)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="size-3 bg-primary/40 rounded-full"></div>
                                        <span className="text-xs font-medium">Medium Density (20-50 families)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="size-3 bg-slate-400 rounded-full"></div>
                                        <span className="text-xs font-medium">Low Density (&lt;20 families)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-sm pt-8">
                        © 2024 GMIT Emaus Liliba - HR Management System. Built for Church Growth.
                    </footer>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
