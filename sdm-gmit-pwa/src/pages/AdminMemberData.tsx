

const AdminMemberData = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#0d1b12] dark:text-[#f8fcf9] min-h-screen flex flex-col">
            {/* Navbar Component (Reused/Similar to Admin Dashboard but keeping local for specific design match) */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#e7f3eb] dark:border-[#1b2e21] px-10 py-3 bg-background-light dark:bg-background-dark sticky top-0 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-[#0d1b12] dark:text-[#f8fcf9]">
                        <div className="size-6 text-primary">
                            <span className="material-symbols-outlined text-3xl">church</span>
                        </div>
                        <h2 className="text-[#0d1b12] dark:text-[#f8fcf9] text-lg font-bold leading-tight tracking-[-0.015em]">GMIT Emaus Liliba</h2>
                    </div>
                    <label className="flex flex-col min-w-40 !h-10 max-w-64 hidden md:flex">
                        <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                            <div className="text-[#4c9a66] flex border-none bg-[#e7f3eb] dark:bg-[#1b2e21] items-center justify-center pl-4 rounded-l-lg border-r-0">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0d1b12] dark:text-[#f8fcf9] focus:outline-0 focus:ring-0 border-none bg-[#e7f3eb] dark:bg-[#1b2e21] focus:border-none h-full placeholder:text-[#4c9a66] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal" placeholder="Search member records..." />
                        </div>
                    </label>
                </div>
                <div className="flex flex-1 justify-end gap-8 items-center">
                    <div className="flex items-center gap-9 hidden lg:flex">
                        <a className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-medium leading-normal hover:text-primary transition-colors" href="/admin">Dashboard</a>
                        <a className="text-primary text-sm font-bold leading-normal border-b-2 border-primary" href="#">Member Management</a>
                        <a className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Reports</a>
                        <a className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Settings</a>
                    </div>
                    <button className="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#0d1b12] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-all shadow-md">
                        <span className="truncate">Add Member</span>
                    </button>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDaSny3xWKY_3ZURYiXIkzDviC6TusAQ5TRDJy7rsv8kHM3oIboTSRjyJH591wGP2O2gyztn1KXeBVfCdZgftlAazB1u8ucDG1LhMTWv1PYqDwSIJJtMhz0Cww3RGbFW4r2heSsZ6zRI_2LDmzUGmLinNnsLCFo39UOcjHBo2tBHSL7yvX0QZiqQExGb0QcJmGXbEshtHKcs3EYyHTWLN8slVPXC7CbV270LEeIZexxdH3oHMnqCo9WTIbzkubiyPDstXCC7E-OAzM")' }}></div>
                </div>
            </header>

            <main className="flex flex-col flex-1 px-4 md:px-10 py-8 w-full">
                {/* Page Heading Component */}
                <div className="flex flex-wrap justify-between gap-3 mb-6">
                    <div className="flex min-w-72 flex-col gap-1">
                        <p className="text-[#0d1b12] dark:text-[#f8fcf9] text-4xl font-black leading-tight tracking-[-0.033em]">Member Data Management</p>
                        <p className="text-[#4c9a66] text-base font-normal leading-normal">Manage congregation professional skills data and human resource analytics.</p>
                    </div>
                    <div className="flex gap-3 items-end">
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-[#e7f3eb] dark:bg-[#1b2e21] text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold leading-normal tracking-[0.015em] border border-[#cfe7d7] dark:border-[#2a4a35] hover:bg-[#cfe7d7] dark:hover:bg-[#2a4a35] transition-colors">
                            <span className="material-symbols-outlined text-lg">download</span>
                            <span className="truncate">Export to CSV</span>
                        </button>
                    </div>
                </div>

                {/* Stats Component */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a4a35] bg-white dark:bg-[#152a1c] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#4c9a66] text-sm font-medium leading-normal">Total Members</p>
                            <span className="material-symbols-outlined text-[#4c9a66]">groups</span>
                        </div>
                        <p className="text-[#0d1b12] dark:text-[#f8fcf9] tracking-light text-3xl font-bold leading-tight">1,240</p>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-[#078829]">trending_up</span>
                            <p className="text-[#078829] text-sm font-bold leading-normal">+12% from last month</p>
                        </div>
                    </div>
                    <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a4a35] bg-white dark:bg-[#152a1c] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#4c9a66] text-sm font-medium leading-normal">Top Industry Sector</p>
                            <span className="material-symbols-outlined text-[#4c9a66]">domain</span>
                        </div>
                        <p className="text-[#0d1b12] dark:text-[#f8fcf9] tracking-light text-3xl font-bold leading-tight">Education</p>
                        <p className="text-[#4c9a66] text-sm font-medium leading-normal">24% of congregation</p>
                    </div>
                    <div className="flex min-w-[200px] flex-1 flex-col gap-2 rounded-xl p-6 border border-[#cfe7d7] dark:border-[#2a4a35] bg-white dark:bg-[#152a1c] shadow-sm">
                        <div className="flex justify-between items-start">
                            <p className="text-[#4c9a66] text-sm font-medium leading-normal">Active Skills Logged</p>
                            <span className="material-symbols-outlined text-[#4c9a66]">psychology</span>
                        </div>
                        <p className="text-[#0d1b12] dark:text-[#f8fcf9] tracking-light text-3xl font-bold leading-tight">3,450</p>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs text-[#078829]">trending_up</span>
                            <p className="text-[#078829] text-sm font-bold leading-normal">+5% increase</p>
                        </div>
                    </div>
                </div>

                {/* Chips / Filters Component */}
                <div className="flex flex-col gap-4 bg-white dark:bg-[#152a1c] rounded-xl border border-[#cfe7d7] dark:border-[#2a4a35] p-2 shadow-sm mb-6">
                    <div className="flex gap-3 p-2 flex-wrap items-center">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#4c9a66] px-2">
                            <span className="material-symbols-outlined text-lg">filter_alt</span>
                            Filters:
                        </div>
                        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7f3eb] dark:bg-[#1b2e21] pl-4 pr-3 border border-transparent hover:border-[#4c9a66] transition-all">
                            <p className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-medium leading-normal">All Sectors</p>
                            <span className="material-symbols-outlined text-[#0d1b12] dark:text-[#f8fcf9]">expand_more</span>
                        </button>
                        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7f3eb] dark:bg-[#1b2e21] pl-4 pr-3 border border-transparent hover:border-[#4c9a66] transition-all">
                            <p className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-medium leading-normal">Education Level</p>
                            <span className="material-symbols-outlined text-[#0d1b12] dark:text-[#f8fcf9]">expand_more</span>
                        </button>
                        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7f3eb] dark:bg-[#1b2e21] pl-4 pr-3 border border-transparent hover:border-[#4c9a66] transition-all">
                            <p className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-medium leading-normal">Job Title</p>
                            <span className="material-symbols-outlined text-[#0d1b12] dark:text-[#f8fcf9]">expand_more</span>
                        </button>
                        <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#e7f3eb] dark:bg-[#1b2e21] pl-4 pr-3 border border-transparent hover:border-[#4c9a66] transition-all">
                            <p className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-medium leading-normal">Active Status</p>
                            <span className="material-symbols-outlined text-[#0d1b12] dark:text-[#f8fcf9]">expand_more</span>
                        </button>
                        <div className="ml-auto flex gap-2">
                            <button className="text-[#4c9a66] text-sm font-bold px-3 hover:underline">Clear All</button>
                        </div>
                    </div>
                </div>

                {/* Table Component */}
                <div className="bg-white dark:bg-[#152a1c] rounded-xl border border-[#cfe7d7] dark:border-[#2a4a35] shadow-sm overflow-hidden flex-1">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#f8fcf9] dark:bg-[#102216] border-b border-[#cfe7d7] dark:border-[#2a4a35]">
                                    <th className="px-6 py-4 text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold uppercase tracking-wider w-12">
                                        <input className="rounded text-primary focus:ring-primary bg-background-light dark:bg-background-dark border-[#cfe7d7] dark:border-[#2a4a35]" type="checkbox" />
                                    </th>
                                    <th className="px-6 py-4 text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold uppercase tracking-wider min-w-[200px]">Name</th>
                                    <th className="px-6 py-4 text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold uppercase tracking-wider min-w-[150px]">Sector</th>
                                    <th className="px-6 py-4 text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold uppercase tracking-wider min-w-[150px]">Education</th>
                                    <th className="px-6 py-4 text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold uppercase tracking-wider min-w-[150px]">Job Title</th>
                                    <th className="px-6 py-4 text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold uppercase tracking-wider min-w-[200px]">Skills</th>
                                    <th className="px-6 py-4 text-[#4c9a66] text-sm font-bold uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#cfe7d7] dark:divide-[#2a4a35]">
                                {[
                                    { name: "John Doe", id: "M-00245", sector: "Technology", education: "Master's Degree", job: "Senior Developer", skills: ["Python", "SQL"], initials: "JD" },
                                    { name: "Jane Smith", id: "M-00289", sector: "Healthcare", education: "Bachelor's Degree", job: "Registered Nurse", skills: ["First Aid", "Pediatrics"], initials: "JS" },
                                    { name: "Robert King", id: "M-00312", sector: "Agriculture", education: "Diploma", job: "Field Manager", skills: ["Irrigation", "Soil Mgmt"], initials: "RK" },
                                    { name: "Alice Wong", id: "M-00105", sector: "Education", education: "PhD", job: "Professor", skills: ["Research", "Ethics"], initials: "AW" }
                                ].map((member, idx) => (
                                    <tr key={idx} className="hover:bg-background-light dark:hover:bg-[#1b2e21] transition-colors">
                                        <td className="px-6 py-4">
                                            <input className="rounded text-primary focus:ring-primary bg-background-light dark:bg-background-dark border-[#cfe7d7] dark:border-[#2a4a35]" type="checkbox" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{member.initials}</div>
                                                <div>
                                                    <p className="text-[#0d1b12] dark:text-[#f8fcf9] text-sm font-bold">{member.name}</p>
                                                    <p className="text-[#4c9a66] text-xs">{member.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-[#e7f3eb] dark:bg-[#1b2e21] text-[#0d1b12] dark:text-[#f8fcf9] text-xs font-bold rounded-full border border-[#cfe7d7] dark:border-[#2a4a35]">{member.sector}</span>
                                        </td>
                                        <td className="px-6 py-4 text-[#4c9a66] text-sm">{member.education}</td>
                                        <td className="px-6 py-4 text-[#0d1b12] dark:text-[#f8fcf9] text-sm">{member.job}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {member.skills.map((skill, skIdx) => (
                                                    <span key={skIdx} className="bg-[#e7f3eb] dark:bg-[#1b2e21] px-2 py-0.5 rounded text-[10px] font-bold">{skill}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-4">
                                                <button className="text-primary hover:text-opacity-80 font-bold text-sm flex items-center gap-1 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                                    View
                                                </button>
                                                <button className="text-red-500 hover:text-red-600 font-bold text-sm flex items-center gap-1 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">delete</span>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Component */}
                    <div className="px-6 py-4 border-t border-[#cfe7d7] dark:border-[#2a4a35] flex items-center justify-between bg-[#f8fcf9] dark:bg-[#102216]">
                        <div className="text-[#4c9a66] text-sm font-medium">
                            Showing <span className="text-[#0d1b12] dark:text-[#f8fcf9] font-bold">1-10</span> of <span className="text-[#0d1b12] dark:text-[#f8fcf9] font-bold">1,240</span> members
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 rounded hover:bg-[#e7f3eb] dark:hover:bg-[#1b2e21] disabled:opacity-30" disabled>
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="h-8 w-8 rounded flex items-center justify-center bg-primary text-[#0d1b12] font-bold text-sm shadow-sm">1</button>
                            <button className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#e7f3eb] dark:hover:bg-[#1b2e21] text-sm font-bold transition-colors">2</button>
                            <button className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#e7f3eb] dark:hover:bg-[#1b2e21] text-sm font-bold transition-colors">3</button>
                            <span className="px-1 text-[#4c9a66]">...</span>
                            <button className="h-8 w-8 rounded flex items-center justify-center hover:bg-[#e7f3eb] dark:hover:bg-[#1b2e21] text-sm font-bold transition-colors">124</button>
                            <button className="p-2 rounded hover:bg-[#e7f3eb] dark:hover:bg-[#1b2e21] transition-colors">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="px-10 py-6 border-t border-[#cfe7d7] dark:border-[#2a4a35] mt-auto">
                    <div className="flex justify-between items-center text-xs text-[#4c9a66] font-medium">
                        <p>© 2024 GMIT Emaus Liliba HR Portal. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a className="hover:text-primary transition-colors" href="#">Data Privacy Policy</a>
                            <a className="hover:text-primary transition-colors" href="#">Admin Support</a>
                            <a className="hover:text-primary transition-colors" href="#">System Logs</a>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default AdminMemberData;
