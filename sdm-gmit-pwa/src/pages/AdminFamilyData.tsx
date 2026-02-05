import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from '../components/ui/Toast';
import { AdminLayout } from '../components/layouts/AdminLayout';
import { Modal } from '../components/ui/Modal';
import { AddFamilyForm } from '../components/admin/forms/AddFamilyForm';
import { FamilyDetailModal } from '../components/admin/details/FamilyDetailModal';
import { useFamilyData, type Family } from '../hooks/useFamilyData';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

const AdminFamilyData = () => {
    const [searchParams] = useSearchParams();

    // Custom Hook
    const {
        families, setFamilies, filteredFamilies,
        searchTerm, setSearchTerm,
        filterSector, setFilterSector,
        filterStatus, setFilterStatus,
        filterMinMembers, setFilterMinMembers,
        sortConfig, handleSort,
        stats,
        bulkUpdateFamilies,
        importFamilies
    } = useFamilyData();

    // UI State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
    const [bulkEditData, setBulkEditData] = useState<{ sector: string; status: string }>({ sector: '', status: '' });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

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
    const [itemsPerPage] = useState(10);

    // Initial Action from URL
    useEffect(() => {
        if (searchParams.get('action') === 'add') {
            setIsAddModalOpen(true);
        }
    }, [searchParams]);

    // Derived Logic for Pagination
    const totalPages = Math.ceil(filteredFamilies.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFamilies.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Bulk Actions
    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleAll = () => {
        setSelectedIds(selectedIds.length === currentItems.length ? [] : currentItems.map(f => f.id));
    };

    const handleBulkDelete = () => {
        setConfirmDialog({
            isOpen: true,
            title: "Hapus Data Terpilih",
            message: `Apakah Anda yakin ingin menghapus ${selectedIds.length} KK terpilih?`,
            variant: 'danger',
            action: () => {
                setFamilies(families.filter(f => !selectedIds.includes(f.id)));
                setSelectedIds([]);
                toast.success(`${selectedIds.length} data berhasil dihapus`);
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handleBulkUpdate = () => {
        const updates: Partial<Family> = {};
        if (bulkEditData.sector) updates.sector = bulkEditData.sector;
        if (bulkEditData.status) updates.status = bulkEditData.status as any;

        if (Object.keys(updates).length > 0) {
            bulkUpdateFamilies(selectedIds, updates);
            toast.success(`${selectedIds.length} data berhasil diperbarui`);
            setIsBulkEditModalOpen(false);
            setBulkEditData({ sector: '', status: '' });
            setSelectedIds([]);
        } else {
            toast.error("Pilih setidaknya satu data untuk diubah");
        }
    };

    const handleDelete = (id: string, name: string) => {
        setConfirmDialog({
            isOpen: true,
            title: "Hapus Keluarga",
            message: `Apakah Anda yakin ingin menghapus data keluarga ${name}?`,
            variant: 'danger',
            action: () => {
                setFamilies(families.filter(f => f.id !== id));
                toast.success("Data berhasil dihapus");
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    };

    const handlePrintPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(18);
        doc.text("Data Keluarga - GMIT Jemaat Efata Liliba", 14, 22);
        doc.setFontSize(11);
        doc.text(`Total Keluarga: ${filteredFamilies.length} | Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 30);

        // Table
        const tableColumn = ["No. KK", "Kepala Keluarga", "Sektor", "Alamat", "Anggota", "Status"];
        const tableRows = filteredFamilies.map(family => [
            family.id,
            family.head,
            family.sector,
            family.address,
            family.members,
            family.status
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 163, 74] } // Primary green
        });

        doc.save("data_keluarga.pdf");
        toast.success("PDF berhasil dicetak!");
    };

    const handleExport = () => {
        const headers = ["No KK,Kepala Keluarga,Alamat,Sektor,Jml Anggota,Status"];
        const rows = filteredFamilies.map(f =>
            `"${f.id}","${f.head}","${f.address}","${f.sector}","${f.members}","${f.status}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "data_keluarga.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Data keluarga berhasil diexport!");
    };

    return (
        <AdminLayout title="Data Keluarga">
            {/* Page Header & Actions */}
            <div className="flex flex-wrap justify-between gap-4 mb-6 animate-fade-in-up">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Data Keluarga</h1>
                    <p className="text-slate-500 text-sm">Kelola data Kartu Keluarga (KK) dan domisili jemaat.</p>
                </div>
                <div className="flex gap-3 items-center">
                    <button onClick={() => setIsImportModalOpen(true)} className="flex h-10 items-center gap-2 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">upload_file</span>
                        Import
                    </button>
                    <button onClick={handlePrintPDF} className="flex h-10 items-center gap-2 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">print</span>
                        Cetak PDF
                    </button>
                    <button onClick={handleExport} className="flex h-10 items-center gap-2 px-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Export CSV
                    </button>
                    <button onClick={() => { setIsEditMode(false); setIsAddModalOpen(true); }} className="flex h-10 items-center gap-2 px-4 rounded-lg bg-primary text-slate-900 font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        Tambah KK
                    </button>
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 animate-fade-in-up border border-slate-700">
                    <span className="font-bold text-sm">{selectedIds.length} terpilih</span>
                    <div className="h-4 w-px bg-slate-700"></div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsBulkEditModalOpen(true)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-colors text-sm font-bold">
                            <span className="material-symbols-outlined text-lg">edit_note</span> Edit
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-800 rounded-lg transition-colors text-sm font-bold">
                            <span className="material-symbols-outlined text-lg">download</span> Export
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

            {/* Quick Stats Grid with Glassmorphism */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-blue-500">house</span>
                    </div>
                    <div className="size-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 z-10">
                        <span className="material-symbols-outlined text-2xl">house</span>
                    </div>
                    <div className="z-10">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total KK</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.totalFamilies}</p>
                    </div>
                </div>
                <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-orange-500">location_on</span>
                    </div>
                    <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 z-10">
                        <span className="material-symbols-outlined text-2xl">location_on</span>
                    </div>
                    <div className="z-10">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Rayon / Sektor</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.sectorCount}</p>
                    </div>
                </div>
                <div className="relative overflow-hidden bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="material-symbols-outlined text-6xl text-green-500">family_restroom</span>
                    </div>
                    <div className="size-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400 z-10">
                        <span className="material-symbols-outlined text-2xl">family_restroom</span>
                    </div>
                    <div className="z-10">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Rata-rata Anggota</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{stats.avgMembers}</p>
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            {/* Search & Filters */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 transition-all duration-300">
                <div className="p-4 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-[300px] relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Cari kepala keluarga atau nomor KK..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/50 text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                        />
                    </div>

                    {/* View Toggle & Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2 text-sm font-bold ${showAdvancedFilters ? 'bg-primary/10 border-primary text-primary' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            <span className="material-symbols-outlined text-lg">tune</span>
                            Filter
                        </button>

                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 mr-2">
                            <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                <span className="material-symbols-outlined text-xl">table_rows</span>
                            </button>
                            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow text-primary' : 'text-slate-400 hover:text-slate-600'}`}>
                                <span className="material-symbols-outlined text-xl">grid_view</span>
                            </button>
                        </div>

                        <select
                            value={filterSector}
                            onChange={(e) => setFilterSector(e.target.value)}
                            className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border-none text-slate-600 dark:text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary/50 cursor-pointer"
                        >
                            <option value="Semua">Semua Sektor</option>
                            <option value="Efata">Sektor Efata</option>
                            <option value="Betel">Sektor Betel</option>
                            <option value="Sion">Sektor Sion</option>
                            <option value="Eden">Sektor Eden</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border-none text-slate-600 dark:text-slate-300 text-sm font-bold focus:ring-2 focus:ring-primary/50 cursor-pointer"
                        >
                            <option value="Semua">Status: Semua</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Pindah">Pindah</option>
                            <option value="Non-Aktif">Non-Aktif</option>
                        </select>
                    </div>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="px-4 pb-4 animate-fade-in-up border-t border-slate-100 dark:border-slate-800 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Minimal Anggota Keluarga</label>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-400">group_add</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={filterMinMembers}
                                        onChange={(e) => setFilterMinMembers(parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border-none text-sm font-bold focus:ring-2 focus:ring-primary/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Content: Table or Grid */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-1 flex flex-col">
                {viewMode === 'table' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === currentItems.length && currentItems.length > 0}
                                            onChange={toggleAll}
                                            className="rounded text-primary focus:ring-primary bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                        />
                                    </th>
                                    <th onClick={() => handleSort('head')} className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">
                                        Kepala Keluarga {sortConfig.key === 'head' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th onClick={() => handleSort('id')} className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-slate-700 dark:hover:text-slate-200">
                                        No. KK {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alamat / Sektor</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Anggota</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {currentItems.length > 0 ? (
                                    currentItems.map((family) => (
                                        <tr
                                            key={family.id}
                                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedFamily(family)}
                                        >
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(family.id)}
                                                    onChange={(e) => { e.stopPropagation(); toggleSelection(family.id); }}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="rounded text-primary focus:ring-primary bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                                        <span className="material-symbols-outlined">person</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{family.head}</p>
                                                        <p className="text-xs text-slate-500">Kunjungan: {family.lastVisit}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-slate-400">{family.id}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-900 dark:text-white max-w-[200px] truncate">{family.address}</p>
                                                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{family.sector}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                    {family.members}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${family.status === 'Aktif'
                                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                                                    }`}>
                                                    {family.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFamily(family);
                                                            setIsEditMode(true);
                                                            setIsAddModalOpen(true);
                                                        }}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit_square</span>
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(family.id, family.head);
                                                        }}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                                            <p>Tidak ada data keluarga ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // Grid View
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {currentItems.length > 0 ? (
                            currentItems.map((family) => (
                                <div
                                    key={family.id}
                                    onClick={() => setSelectedFamily(family)}
                                    className="relative group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all cursor-pointer animate-fade-in-up"
                                >
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(family.id)}
                                            onChange={(e) => { e.stopPropagation(); toggleSelection(family.id); }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="size-5 rounded text-primary focus:ring-primary bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                                        />
                                    </div>

                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                                            <span className="material-symbols-outlined text-3xl">family_restroom</span>
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-900 dark:text-white truncate text-lg">{family.head}</h3>
                                            <p className="text-xs text-slate-500 font-mono mb-1">{family.id}</p>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase ${family.status === 'Aktif'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                {family.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-base opacity-70">location_on</span>
                                            <span className="truncate flex-1">{family.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-base opacity-70">domain</span>
                                            <span>Sektor {family.sector}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-base opacity-70">groups</span>
                                            <span>{family.members} Anggota Keluarga</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                                        <span>Last visit: {family.lastVisit}</span>
                                        <button className="text-primary font-bold hover:underline">Lihat Detail</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                                <p>Tidak ada data keluarga ditemukan.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex justify-between items-center mt-auto">
                    <p className="text-sm text-slate-500">Menampilkan {currentItems.length} dari {filteredFamilies.length} keluarga</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sebelumnya
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`size-8 text-sm font-bold rounded-lg ${currentPage === i + 1 ? 'bg-primary text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Selanjutnya
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.action}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                variant={confirmDialog.variant}
            />

            {/* Detail Modal */}
            <Modal
                isOpen={!!selectedFamily && !isAddModalOpen}
                onClose={() => setSelectedFamily(null)}
                title="Detail Keluarga"
            >
                <FamilyDetailModal
                    family={selectedFamily}
                    onClose={() => setSelectedFamily(null)}
                />
            </Modal>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title={isEditMode ? "Edit Kartu Keluarga" : "Tambah Kartu Keluarga Baru"}
            >
                <AddFamilyForm
                    onClose={() => setIsAddModalOpen(false)}
                    initialData={isEditMode ? selectedFamily : undefined}
                    onSuccess={(newData) => {
                        const newFamily: Family = {
                            id: newData.noKK,
                            head: newData.kepalaKeluarga,
                            address: newData.alamat,
                            sector: newData.sektor.replace("Sektor ", ""), // Store just name like "Efata"
                            members: isEditMode && selectedFamily ? selectedFamily.members : 1, // Preserve member count on edit
                            status: newData.status,
                            lastVisit: isEditMode && selectedFamily ? selectedFamily.lastVisit : "Belum pernah",
                            createdAt: isEditMode && selectedFamily ? selectedFamily.createdAt : new Date().toISOString()
                        };

                        if (isEditMode && selectedFamily) {
                            setFamilies(families.map(f => f.id === selectedFamily.id ? newFamily : f));
                            toast.success("Data keluarga berhasil diperbarui");
                        } else {
                            setFamilies([newFamily, ...families]);
                            toast.success("Kartu Keluarga berhasil ditambahkan");
                        }
                        setIsAddModalOpen(false);
                    }}
                />
            </Modal>

            {/* Import Modal */}
            <Modal
                isOpen={isBulkEditModalOpen}
                onClose={() => setIsBulkEditModalOpen(false)}
                title="Edit Massal Data Keluarga"
            >
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-slate-500">Anda akan mengubah data untuk <span className="font-bold text-slate-900 dark:text-white">{selectedIds.length} keluarga</span> terpilih.</p>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ubah Sektor</label>
                        <select
                            value={bulkEditData.sector}
                            onChange={(e) => setBulkEditData({ ...bulkEditData, sector: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        >
                            <option value="">-- Tidak Ubah --</option>
                            <option value="Efata">Sektor Efata</option>
                            <option value="Betel">Sektor Betel</option>
                            <option value="Sion">Sektor Sion</option>
                            <option value="Eden">Sektor Eden</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ubah Status</label>
                        <select
                            value={bulkEditData.status}
                            onChange={(e) => setBulkEditData({ ...bulkEditData, status: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                        >
                            <option value="">-- Tidak Ubah --</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Pindah">Pindah</option>
                            <option value="Non-Aktif">Non-Aktif</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={() => setIsBulkEditModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100">Batal</button>
                        <button onClick={handleBulkUpdate} className="px-6 py-2 rounded-lg font-bold bg-primary text-slate-900 shadow-lg shadow-primary/20">Simpan Perubahan</button>
                    </div>
                </div>
            </Modal>

            {/* Import Modal */}
            <Modal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                title="Import Data Keluarga"
            >
                <div className="flex flex-col gap-6">
                    <div
                        className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors relative"
                    >
                        <input
                            type="file"
                            accept=".csv"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    Papa.parse(file, {
                                        header: true,
                                        skipEmptyLines: true,
                                        complete: (results) => {
                                            const parsedData = results.data as any[];
                                            const newFamilies: Family[] = parsedData.map((row: any) => ({
                                                id: row['No KK'] || row.id || `5300${Math.floor(Math.random() * 9999999)}`,
                                                head: row['Kepala Keluarga'] || row.head || "Unknown",
                                                address: row['Alamat'] || row.address || "-",
                                                sector: row['Sektor'] || row.sector || "Efata",
                                                members: parseInt(row['Anggota'] || row.members || "1"),
                                                status: (row['Status'] || row.status || "Aktif") as any,
                                                lastVisit: row['Last Visit'] || row.lastVisit || "Belum pernah",
                                                createdAt: new Date().toISOString()
                                            }));

                                            const addedCount = importFamilies(newFamilies);
                                            toast.success(`${addedCount} data keluarga berhasil diimport!`);
                                            setIsImportModalOpen(false);
                                        },
                                        error: (error) => {
                                            toast.error(`Gagal parsing CSV: ${error.message}`);
                                        }
                                    });
                                }
                            }}
                        />
                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">cloud_upload</span>
                        <p className="font-bold text-slate-900 dark:text-white">Klik atau tarik file CSV ke sini</p>
                        <p className="text-xs text-slate-500 mt-2">Format: No KK, Kepala Keluarga, Alamat, Sektor, Anggota, Status</p>
                    </div>
                </div>
            </Modal>
        </AdminLayout >
    );
};

export default AdminFamilyData;
