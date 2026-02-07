import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSearchParams } from 'react-router-dom';
import { toast } from '../components/ui/Toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { AdminLayout } from '../components/layouts/AdminLayout';
import { Modal } from '../components/ui/Modal';
import { AddMemberForm } from '../components/admin/forms/AddMemberForm';
import { MemberDetailModal } from '../components/admin/details/MemberDetailModal';
import { useMemberData, calculateAge, type Member } from '../hooks/useMemberData';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { TableSkeleton } from '../components/skeletons/TableSkeleton';

const AdminMemberData = () => {
    const [searchParams] = useSearchParams();

    // Custom Hook
    const {
        members, setMembers, filteredMembers,
        searchTerm, setSearchTerm,
        filterSector, setFilterSector,
        filterGender, setFilterGender,
        filterAgeCategory, setFilterAgeCategory,
        filterStatus, setFilterStatus,
        sortConfig, handleSort,
        stats,
        isLoading,
        deleteMutation,
        importMutation
    } = useMemberData();

    // UI State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);

    const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [bulkEditField, setBulkEditField] = useState<keyof Member | ''>('');
    const [bulkEditValue, setBulkEditValue] = useState('');

    // Confirm Dialog State
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        action: () => void;
        variant: 'danger' | 'warning' | 'info';
    }>({
        isOpen: false,
        title: "",
        message: "",
        action: () => { },
        variant: 'danger'
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Dropzone Logic
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            setImportFile(acceptedFiles[0]);
            toast.success(`File ${acceptedFiles[0].name} siap diupload`);
        }
    }, []);

    const handleImportSubmit = async () => {
        if (!importFile) return;

        const formData = new FormData();
        formData.append('file', importFile);

        try {
            await importMutation.mutateAsync(formData);
            toast.success('Data berhasil diimport');
            setIsImportModalOpen(false);
            setImportFile(null);
        } catch (error) {
            console.error(error);
            toast.error('Gagal mengimport data. Pastikan format CSV sesuai.');
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv']
        },
        maxFiles: 1
    });

    // Initial Action from URL
    useEffect(() => {
        if (searchParams.get('action') === 'add') {
            setIsAddModalOpen(true);
        }
    }, [searchParams]);


    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && !isAddModalOpen && !isImportModalOpen) {
                e.preventDefault();
                document.getElementById('search-input')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAddModalOpen, isImportModalOpen]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

    // Selection Logic
    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedIds.length === currentMembers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(currentMembers.map(m => m.id));
        }
    };

    // Bulk Handlers
    const handleBulkDelete = () => {
        setConfirmDialog({
            isOpen: true,
            title: "Hapus Data Terpilih",
            message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data member terpilih? Tindakan ini tidak dapat dibatalkan.`,
            variant: 'danger',
            action: async () => {
                try {
                    // Delete one by one for now (Promise.all could be used but might overload backend if too many)
                    await Promise.all(selectedIds.map(id => deleteMutation.mutateAsync(id)));

                    setSelectedIds([]);
                    toast.success(`${selectedIds.length} data berhasil dihapus`);
                } catch (error) {
                    toast.error("Gagal menghapus beberapa data.");
                } finally {
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                }
            }
        });
    };

    const handleBulkEditSubmit = () => {
        if (!bulkEditField || !bulkEditValue) return;

        const updatedMembers = members.map(m => {
            if (selectedIds.includes(m.id)) {
                return { ...m, [bulkEditField]: bulkEditValue };
            }
            return m;
        });

        // @ts-ignore
        setMembers(updatedMembers);
        toast.success(`${selectedIds.length} data berhasil diperbarui`);
        setIsBulkEditModalOpen(false);
        setSelectedIds([]);
    };

    // Export Logic
    const handleExportCSV = () => {
        const headers = ["Nama,ID,Sektor,Pendidikan,Pekerjaan,Keahlian,Gender,Umur,Status"];
        const rows = filteredMembers.map(m =>
            `"${m.name}","${m.id}","${m.sector}","${m.education}","${m.job}","${m.skills.join(';')}","${m.gender}","${calculateAge(m.birthDate)}","${m.statusGerejawi}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data_jemaat_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Laporan Data Jemaat", 14, 22);
        doc.setFontSize(11);
        doc.text(`Total Data: ${filteredMembers.length} | Tanggal: ${new Date().toLocaleDateString()}`, 14, 30);

        const tableColumn = ["ID", "Nama", "Sektor", "Pendidikan", "Pekerjaan", "Status"];
        const tableRows = filteredMembers.map(member => [
            member.id,
            member.name,
            member.sector,
            member.education,
            member.job,
            member.statusGerejawi
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
        });

        doc.save("laporan_jemaat.pdf");
        toast.success("PDF berhasil didownload");
    };

    return (
        <AdminLayout title="Data Jemaat">
            {/* Page Header */}
            <div className="flex flex-wrap justify-between gap-3 mb-6 animate-fade-in-up">
                <div className="flex min-w-72 flex-col gap-1">
                    <p className="text-slate-900 dark:text-white text-3xl font-black leading-tight tracking-tight">Manajemen Data</p>
                    <p className="text-slate-500 text-sm font-normal">Kelola data profesional dan potensi SDM jemaat.</p>
                </div>
                <div className="flex gap-2 items-end flex-wrap">
                    <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-4 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-bold text-slate-700 dark:text-slate-200 text-sm shadow-sm transition-colors">
                        <span className="material-symbols-outlined text-lg">upload_file</span>
                        Import
                    </button>
                    <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                        <button onClick={handleExportCSV} className="px-3 h-10 bg-white dark:bg-slate-800 hover:bg-slate-50 border-r border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">csv</span> CSV
                        </button>
                        <button onClick={handleExportPDF} className="px-3 h-10 bg-white dark:bg-slate-800 hover:bg-slate-50 font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">picture_as_pdf</span> PDF
                        </button>
                    </div>
                    <button onClick={() => { setIsEditMode(false); setIsAddModalOpen(true); }} className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-slate-900 font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-lg">add</span>
                        Tambah
                    </button>
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 animate-fade-in-up border border-slate-700">
                    <span className="font-bold text-sm">{selectedIds.length} terpilih</span>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsBulkEditModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-colors text-sm font-bold text-blue-400">
                            <span className="material-symbols-outlined text-lg">edit_note</span> Edit Massal
                        </button>
                        <button onClick={handleBulkDelete} className="flex items-center gap-2 px-3 py-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors text-sm font-bold">
                            <span className="material-symbols-outlined text-lg">delete</span> Hapus
                        </button>
                    </div>
                    <button onClick={() => setSelectedIds([])} className="ml-2 bg-slate-800 hover:bg-slate-700 rounded-full p-1 text-slate-400 transition-colors">
                        <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Jemaat</p>
                        <span className="material-symbols-outlined text-primary/80">groups</span>
                    </div>
                    <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">{stats.total}</p>
                    <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-green-500">trending_up</span>
                        <p className="text-green-500 text-xs font-bold">+{stats.growth}% bulan ini</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Sektor Dominan</p>
                        <span className="material-symbols-outlined text-primary/80">domain</span>
                    </div>
                    <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">{stats.sectorDominant}</p>
                    <p className="text-slate-500 text-xs font-medium">Populasi Terbanyak</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl p-5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total Keahlian</p>
                        <span className="material-symbols-outlined text-primary/80">psychology</span>
                    </div>
                    <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">{stats.activeSkills}</p>
                    <p className="text-slate-500 text-xs font-medium">Skill Terdata</p>
                </div>
            </div>

            {/* Filter & View Controls */}
            <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Cari (Tekan '/')"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50 focus:border-primary text-slate-900 dark:text-white placeholder:text-slate-400 font-medium transition-all"
                        />
                    </div>

                    <div className="flex gap-2 items-center overflow-x-auto">
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                            <button onClick={() => setViewMode('table')} className={`p-1.5 rounded transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                <span className="material-symbols-outlined text-xl">table_rows</span>
                            </button>
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                <span className="material-symbols-outlined text-xl">grid_view</span>
                            </button>
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <select
                            value={filterSector}
                            onChange={(e) => setFilterSector(e.target.value)}
                            className="h-10 pl-3 pr-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium border-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                        >
                            <option value="Semua">Semua Sektor</option>
                            <option value="Efata">Efata</option>
                            <option value="Betel">Betel</option>
                            <option value="Sion">Sion</option>
                            <option value="Eden">Eden</option>
                        </select>
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold border transition-colors ${showAdvancedFilters ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                        >
                            <span className="material-symbols-outlined text-lg">tune</span>
                            Filter
                        </button>
                        {/* Clear Filter Button - Only visible if filters active */}
                        {(searchTerm || filterSector !== "Semua" || filterGender !== "Semua" || filterAgeCategory !== "Semua" || filterStatus !== "Semua") &&
                            <button
                                onClick={() => { setSearchTerm(""); setFilterSector("Semua"); setFilterGender("Semua"); setFilterAgeCategory("Semua"); setFilterStatus("Semua"); }}
                                className="text-red-500 text-xs font-bold px-2 hover:bg-red-50 rounded py-1 transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg align-middle">backspace</span>
                            </button>
                        }
                    </div>
                </div>

                {showAdvancedFilters && (
                    <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-down">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Jenis Kelamin</label>
                            <select
                                value={filterGender}
                                onChange={(e) => setFilterGender(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="Semua">Semua</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Kategori Usia</label>
                            <select
                                value={filterAgeCategory}
                                onChange={(e) => setFilterAgeCategory(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="Semua">Semua</option>
                                <option value="Anak">Anak (0-12)</option>
                                <option value="Remaja">Remaja (13-17)</option>
                                <option value="Pemuda">Pemuda (18-30)</option>
                                <option value="Dewasa">Dewasa (31-60)</option>
                                <option value="Lansia">Lansia ({'>'}60)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Status Gerejawi</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="Semua">Semua</option>
                                <option value="Sidi">Sidi</option>
                                <option value="Baptis">Baptis</option>
                                <option value="Katekisasi">Katekisasi</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* List View */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col">
                {isLoading ? (
                    <TableSkeleton />
                ) : viewMode === 'table' ? (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                        <th className="px-6 py-4 w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.length === currentMembers.length && currentMembers.length > 0}
                                                onChange={toggleAll}
                                                className="rounded text-primary focus:ring-primary bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                            />
                                        </th>
                                        {[
                                            { label: "Nama Lengkap", key: "name", width: "min-w-[200px]" },
                                            { label: "Sektor", key: "sector", width: "min-w-[150px]" },
                                            { label: "Umur", key: "birthDate", width: "w-20" },
                                            { label: "Pendidikan", key: "education", width: "min-w-[150px]" },
                                            { label: "Pekerjaan", key: "job", width: "min-w-[150px]" },
                                            { label: "Status", key: "statusGerejawi", width: "min-w-[100px]" },
                                        ].map((col) => (
                                            <th
                                                key={col.key}
                                                onClick={() => handleSort(col.key as keyof Member)}
                                                className={`px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider ${col.width} cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 transition-colors select-none group`}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {col.label}
                                                    {sortConfig.key === col.key && (
                                                        <span className="material-symbols-outlined text-sm font-bold">
                                                            {sortConfig.direction === 'asc' ? 'arrow_downward' : 'arrow_upward'}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                        <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {currentMembers.length > 0 ? (
                                        currentMembers.map((member) => (
                                            <tr
                                                key={member.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                                onClick={() => setSelectedMember(member)}
                                            >
                                                <td className="px-6 py-4 relative">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-left"></div>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(member.id)}
                                                        onChange={(e) => { e.stopPropagation(); toggleSelection(member.id); }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="rounded text-primary focus:ring-primary bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold border border-primary/10 group-hover:border-primary/30 transition-colors">{member.initials}</div>
                                                        <div>
                                                            <p className="text-slate-900 dark:text-white text-sm font-bold">{member.name}</p>
                                                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                                                                <span>{member.id}</span>
                                                                <span className="size-1 rounded-full bg-slate-300"></span>
                                                                <span>{member.gender}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">{member.sector}</span>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-medium">{calculateAge(member.birthDate)} Thn</td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-sm font-medium">{member.education}</td>
                                                <td className="px-6 py-4 text-slate-900 dark:text-white text-sm font-medium">{member.job}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${member.statusGerejawi === 'Sidi' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        member.statusGerejawi === 'Baptis' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-orange-50 text-orange-600 border-orange-100'
                                                        }`}>{member.statusGerejawi}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedMember(member);
                                                                setIsEditMode(true);
                                                                setIsAddModalOpen(true);
                                                            }}
                                                            className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-primary/10 hover:text-primary transition-colors tooltip"
                                                            title="Edit"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setConfirmDialog({
                                                                    isOpen: true,
                                                                    title: "Hapus Data Member",
                                                                    message: `Apakah Anda yakin ingin menghapus data ${member.name} (${member.id})?`,
                                                                    variant: 'danger',
                                                                    action: async () => {
                                                                        try {
                                                                            await deleteMutation.mutateAsync(member.id);
                                                                            toast.success('Data berhasil dihapus');
                                                                        } catch (error) {
                                                                            toast.error('Gagal menghapus data');
                                                                        } finally {
                                                                            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                                                                        }
                                                                    }
                                                                });
                                                            }}
                                                            className="size-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors tooltip"
                                                            title="Hapus"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                                                    <p>Tidak ada data member yang cocok dengan filter Anda.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View (Fallback for Table) */}
                        <div className="md:hidden flex flex-col divide-y divide-slate-100 dark:divide-slate-800">
                            {currentMembers.length > 0 ? (
                                currentMembers.map((member) => (
                                    <div key={member.id} className="p-4 flex flex-col gap-3" onClick={() => setSelectedMember(member)}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3 items-center">
                                                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                                    {member.initials}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                                                    <p className="text-xs text-slate-500">{member.id} • {member.sector}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${member.statusGerejawi === 'Sidi' ? 'bg-green-50 text-green-600 border-green-100' :
                                                member.statusGerejawi === 'Baptis' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-orange-50 text-orange-600 border-orange-100'
                                                }`}>{member.statusGerejawi}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                                            <div>
                                                <span className="block text-[10px] uppercase tracking-wider mb-0.5">Pekerjaan</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{member.job}</span>
                                            </div>
                                            <div>
                                                <span className="block text-[10px] uppercase tracking-wider mb-0.5">Pendidikan</span>
                                                <span className="font-medium text-slate-700 dark:text-slate-300">{member.education}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 mt-1">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedMember(member);
                                                    setIsEditMode(true);
                                                    setIsAddModalOpen(true);
                                                }}
                                                className="flex-1 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmDialog({
                                                        isOpen: true,
                                                        title: "Hapus Data Member",
                                                        message: `Apakah Anda yakin ingin menghapus data ${member.name}?`,
                                                        variant: 'danger',
                                                        action: () => {
                                                            setMembers(members.filter(m => m.id !== member.id));
                                                            toast.success('Data berhasil dihapus');
                                                            setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                                                        }
                                                    });
                                                }}
                                                className="px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/30 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-500">Tidak ada data.</div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {currentMembers.length > 0 ? (
                            currentMembers.map((member) => (
                                <div
                                    key={member.id}
                                    onClick={() => setSelectedMember(member)}
                                    className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer relative group"
                                >
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(member.id)}
                                            onChange={(e) => { e.stopPropagation(); toggleSelection(member.id); }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="rounded text-primary focus:ring-primary bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">{member.initials}</div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                                            <p className="text-sm text-slate-500">{member.sector}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Pekerjaan</span>
                                            <span className="font-medium dark:text-slate-200">{member.job}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Status</span>
                                            <span className="font-medium dark:text-slate-200">{member.statusGerejawi}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-1">
                                        {member.skills.slice(0, 3).map((skill, skIdx) => (
                                            <span key={skIdx} className="bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">{skill}</span>
                                        ))}
                                        {member.skills.length > 3 && <span className="text-xs text-slate-400 pl-1">+{member.skills.length - 3}</span>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                                    <p>Tidak ada data member yang cocok dengan filter Anda.</p>
                                    <button
                                        onClick={() => { setSearchTerm(""); setFilterSector("Semua"); setFilterGender("Semua"); setFilterAgeCategory("Semua"); setFilterStatus("Semua"); }}
                                        className="mt-2 text-primary font-bold hover:underline"
                                    >
                                        Reset Filter
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 mt-auto rounded-b-xl">
                    <div className="text-slate-500 text-sm font-medium">
                        Menampilkan <span className="text-slate-900 dark:text-white font-bold">{filteredMembers.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredMembers.length)}</span> dari <span className="text-slate-900 dark:text-white font-bold">{filteredMembers.length}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-medium focus:ring-2 focus:ring-primary/50"
                        >
                            <option value={10}>10 / Halaman</option>
                            <option value={25}>25 / Halaman</option>
                            <option value={50}>50 / Halaman</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-sm font-bold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`size-8 rounded flex items-center justify-center text-sm font-bold transition-colors ${currentPage === page ? 'bg-primary text-slate-900' : 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 text-sm font-bold disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={isEditMode ? "Edit Data Jemaat" : "Tambah Jemaat Baru"}
            >
                <AddMemberForm
                    onClose={() => setIsAddModalOpen(false)}
                    initialData={isEditMode ? selectedMember : undefined}
                    onSuccess={(newData) => {
                        if (isEditMode && selectedMember) {
                            const updatedMembers = members.map(m =>
                                m.id === selectedMember.id ? {
                                    ...m,
                                    ...newData,
                                    name: newData.namaLengkap,
                                    birthDate: newData.tanggalLahir,
                                    job: newData.pekerjaan,
                                    skills: typeof newData.keahlian === 'string' ? newData.keahlian.split(',').map((s: string) => s.trim()) : m.skills
                                } : m
                            );
                            setMembers(updatedMembers);
                            toast.success("Data berhasil diperbarui");
                        } else {
                            const newId = `M-00${Math.floor(Math.random() * 899) + 100}`;
                            const initials = newData.namaLengkap.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
                            // @ts-ignore - Mocking simplifying
                            const newMember: Member = {
                                id: newId,
                                name: newData.namaLengkap,
                                initials,
                                sector: newData.sektor,
                                education: newData.pendidikan,
                                job: newData.pekerjaan,
                                skills: typeof newData.keahlian === 'string' ? newData.keahlian.split(',').map((s: string) => s.trim()) : [],
                                gender: newData.jenisKelamin,
                                birthDate: newData.tanggalLahir,
                                statusGerejawi: newData.statusGerejawi
                            };
                            setMembers([newMember, ...members]);
                            toast.success("Data berhasil ditambahkan");
                        }
                        setIsAddModalOpen(false);
                    }}
                />
            </Modal>

            <Modal
                isOpen={!!selectedMember}
                onClose={() => setSelectedMember(null)}
                title="Detail Jemaat"
            >
                <MemberDetailModal
                    member={selectedMember}
                    onClose={() => setSelectedMember(null)}
                />
            </Modal>

            {/* Import Modal */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Import Data Jemaat"
            >
                <div className="flex flex-col gap-6">
                    <div
                        {...getRootProps()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors relative ${isDragActive
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">cloud_upload</span>
                        {importFile ? (
                            <div className="flex flex-col items-center gap-2">
                                <p className="font-bold text-primary">{importFile.name}</p>
                                <p className="text-sm text-slate-500">{(importFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                        ) : (
                            <>
                                <p className="font-bold text-slate-900 dark:text-white">Klik atau drag & drop file CSV</p>
                                <p className="text-sm text-slate-500 mt-1">Format: Nama, Sektor, Pendidikan, Pekerjaan</p>
                            </>
                        )}
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => { setIsImportModalOpen(false); setImportFile(null); }}
                            className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleImportSubmit}
                            disabled={!importFile || importMutation.isPending}
                            className="px-4 py-2 bg-primary text-slate-900 font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {importMutation.isPending && <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>}
                            Upload & Import
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Bulk Edit Modal */}
            <Modal
                isOpen={isBulkEditModalOpen}
                onClose={() => setIsBulkEditModalOpen(false)}
                title={`Edit Massal (${selectedIds.length} Data)`}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pilih Kolom yang akan Diubah</label>
                        <select
                            value={bulkEditField}
                            // @ts-ignore
                            onChange={(e) => setBulkEditField(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">-- Pilih Kolom --</option>
                            <option value="sector">Sektor</option>
                            <option value="statusGerejawi">Status Gerejawi</option>
                            <option value="gender">Jenis Kelamin</option>
                        </select>
                    </div>

                    {bulkEditField === 'sector' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Sektor Baru</label>
                            <select
                                value={bulkEditValue}
                                onChange={(e) => setBulkEditValue(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">-- Pilih Sektor --</option>
                                <option value="Efata">Efata</option>
                                <option value="Betel">Betel</option>
                                <option value="Sion">Sion</option>
                                <option value="Eden">Eden</option>
                            </select>
                        </div>
                    )}

                    {bulkEditField === 'statusGerejawi' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Status Baru</label>
                            <select
                                value={bulkEditValue}
                                onChange={(e) => setBulkEditValue(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">-- Pilih Status --</option>
                                <option value="Sidi">Sidi</option>
                                <option value="Baptis">Baptis</option>
                                <option value="Katekisasi">Katekisasi</option>
                            </select>
                        </div>
                    )}

                    {bulkEditField === 'gender' && (
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Gender Baru</label>
                            <select
                                value={bulkEditValue}
                                onChange={(e) => setBulkEditValue(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">-- Pilih Gender --</option>
                                <option value="Laki-laki">Laki-laki</option>
                                <option value="Perempuan">Perempuan</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setIsBulkEditModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100">Batal</button>
                        <button onClick={handleBulkEditSubmit} className="px-6 py-2 rounded-lg font-bold bg-primary text-slate-900 shadow-lg shadow-primary/20">Simpan Perubahan</button>
                    </div>
                </div>
            </Modal>
            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmDialog.action}
                title={confirmDialog.title}
                message={confirmDialog.message}
                variant={confirmDialog.variant}
            />

        </AdminLayout>
    );
};
export default AdminMemberData;
