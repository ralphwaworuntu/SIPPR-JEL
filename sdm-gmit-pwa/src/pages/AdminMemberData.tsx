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
import { useMemberData, calculateAge, calculateCompleteness, type Member } from '../hooks/useMemberData';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { TableSkeleton } from '../components/skeletons/TableSkeleton';

const AdminMemberData = () => {
    const [searchParams] = useSearchParams();

    // Custom Hook
    const {
        members, setMembers, filteredMembers,
        searchTerm, setSearchTerm,
        filterLingkungan, setFilterLingkungan,
        filterRayon, setFilterRayon,
        filterGender, setFilterGender,
        filterAgeCategory, setFilterAgeCategory,
        filterWillingness, setFilterWillingness,
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
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [tableTab, setTableTab] = useState<'Identitas' | 'Keluarga & Diakonia' | 'Profesi & Pelayanan' | 'Pendidikan' | 'Ekonomi' | 'Kesehatan'>('Identitas');
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

    const handleDownloadTemplate = () => {
        const headers = [
            "Nomor Kartu Keluarga", "NIK", "Nama Lengkap", "Jenis Kelamin", "Tanggal Lahir", "Usia", "Nomor Telepon/ WhatsApp Aktif",
            "Lingkungan", "Rayon", "Alamat Lengkap",
            "Total Anggota Keluarga", "Laki-laki", "Perempuan", "Di Luar Kota", "Sudah Sidi", "Sidi Laki-laki", "Sidi Perempuan", "Belum Baptis", "Belum Sidi",
            "Penerima Diakonia", "Tahun Diakonia", "Jenis Diakonia",
            "Pendidikan Terakhir", "Jurusan", "Kategori Pekerjaan", "Jabatan", "Nama Instansi", "Lama Kerja (Tahun)", "Daftar Keahlian",
            "Kesediaan Melayani", "Minat Pelayanan", "Bentuk Kontribusi",
            "Status Anak Bersekolah", "TK/PAUD (Sekolah)", "SD (Sekolah)", "SMP (Sekolah)", "SMA (Sekolah)", "Universitas (Sekolah)",
            "TK/PAUD (Putus)", "SD (Putus)", "SMP (Putus)", "SMA (Putus)", "Universitas (Putus)", "Anak Sudah Bekerja",
            "Pekerjaan KK", "Pekerjaan Pasangan", "Range Pendapatan", "Pengeluaran Pangan", "Pengeluaran Utilitas", "Pengeluaran Pendidikan", "Pengeluaran Lainnya",
            "Punya Usaha?", "Nama Usaha", "Jenis Usaha", "Status Rumah", "Jenis Rumah", "Sumber Air", "Daftar Aset",
            "Sakit 30 Hari Terakhir", "Penyakit Kronis", "Daftar Penyakit", "BPJS Kesehatan", "BPJS Ketenagakerjaan", "Bantuan Sosial", "Disabilitas", "Daftar Disabilitas",
        ];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "template_import_jemaat.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

        const tabParam = searchParams.get('tab');
        if (tabParam) {
            setTableTab(tabParam as any);
        }

        // Also support deep linking filters if needed
        const filterWillingnessParam = searchParams.get('willingness');
        if (filterWillingnessParam) {
            setFilterWillingness(filterWillingnessParam);
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
        const headers = [
            "Nomor Kartu Keluarga", "NIK", "Nama Lengkap", "Jenis Kelamin", "Tanggal Lahir", "Usia", "Nomor Telepon/ WhatsApp Aktif",
            "Lingkungan", "Rayon", "Alamat Lengkap",
            "Total Anggota Keluarga", "Laki-laki", "Perempuan", "Di Luar Kota", "Sudah Sidi", "Sidi Laki-laki", "Sidi Perempuan", "Belum Baptis", "Belum Sidi",
            "Penerima Diakonia", "Tahun Diakonia", "Jenis Diakonia",
            "Pendidikan Terakhir", "Jurusan", "Kategori Pekerjaan", "Jabatan", "Nama Instansi", "Lama Kerja (Tahun)", "Daftar Keahlian",
            "Kesediaan Melayani", "Minat Pelayanan", "Bentuk Kontribusi",
            "Status Anak Bersekolah", "TK/PAUD (Sekolah)", "SD (Sekolah)", "SMP (Sekolah)", "SMA (Sekolah)", "Universitas (Sekolah)",
            "TK/PAUD (Putus)", "SD (Putus)", "SMP (Putus)", "SMA (Putus)", "Universitas (Putus)",
            "SD (Tidak Sekolah)", "SMP (Tidak Sekolah)", "SMA (Tidak Sekolah)", "Universitas (Tidak Sekolah)", "Anak Sudah Bekerja",
            "Pekerjaan KK", "Pekerjaan Pasangan", "Range Pendapatan", "Pengeluaran Pangan", "Pengeluaran Utilitas", "Pengeluaran Pendidikan", "Pengeluaran Lainnya",
            "Punya Usaha?", "Nama Usaha", "Jenis Usaha", "Status Rumah", "Jenis Rumah", "Sumber Air", "Daftar Aset",
            "Sakit 30 Hari Terakhir", "Penyakit Kronis", "Daftar Penyakit", "BPJS Kesehatan", "BPJS Ketenagakerjaan", "Bantuan Sosial", "Disabilitas", "Daftar Disabilitas",
            "Latitude", "Longitude"
        ];

        const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const arrStr = (v: any) => Array.isArray(v) ? v.join('; ') : (v || '');

        const rows = filteredMembers.map(m => {
            const getDisabilityList = () => {
                const arr: string[] = [];
                if (m.health_disabilityPhysical?.length) arr.push(...m.health_disabilityPhysical);
                if (m.health_disabilityIntellectual?.length) arr.push(...m.health_disabilityIntellectual);
                if (m.health_disabilityMental?.length) arr.push(...m.health_disabilityMental);
                if (m.health_disabilitySensory?.length) arr.push(...m.health_disabilitySensory);
                return arr;
            };

            return [
                esc(m.kkNumber), esc(m.nik), esc(m.name), esc(m.gender), esc(m.birthDate), calculateAge(m.birthDate), esc(m.phone),
                esc(m.lingkungan), esc(m.rayon), esc(m.address),
                m.familyMembers || 0, m.familyMembersMale || 0, m.familyMembersFemale || 0, m.familyMembersOutside || 0, m.familyMembersSidi || 0, m.familyMembersSidiMale || 0, m.familyMembersSidiFemale || 0, m.familyMembersNonBaptized || 0, m.familyMembersNonSidi || 0,
                esc(m.diakonia_recipient), esc(m.diakonia_year), esc(m.diakonia_type),
                esc(m.educationLevel || m.education), esc(m.major), esc(m.jobCategory), esc(m.jobTitle), esc(m.companyName), m.yearsOfExperience || 0, esc(arrStr(m.skills)),
                esc(m.willingnessToServe), esc(arrStr(m.interestAreas)), esc(arrStr(m.contributionTypes)),
                esc(m.education_schoolingStatus), m.education_inSchool_tk_paud || 0, m.education_inSchool_sd || 0, m.education_inSchool_smp || 0, m.education_inSchool_sma || 0, m.education_inSchool_university || 0,
                m.education_dropout_tk_paud || 0, m.education_dropout_sd || 0, m.education_dropout_smp || 0, m.education_dropout_sma || 0, m.education_dropout_university || 0,
                m.education_unemployed_sd || 0, m.education_unemployed_smp || 0, m.education_unemployed_sma || 0, m.education_unemployed_university || 0, m.education_working || 0,
                esc(m.economics_headOccupation), esc(m.economics_spouseOccupation), esc(m.economics_incomeRange), m.economics_expense_food || 0, m.economics_expense_utilities || 0, m.economics_expense_education || 0, m.economics_expense_other || 0,
                esc(m.economics_hasBusiness), esc(m.economics_businessName), esc(m.economics_businessType), esc(m.economics_houseStatus), esc(m.economics_houseType), esc(m.economics_waterSource), esc(arrStr(m.economics_assets)),
                esc(m.health_sick30Days), esc(m.health_chronicSick), esc(arrStr(m.health_chronicDisease)), esc(m.health_hasBPJS), esc(m.health_hasBPJSKetenagakerjaan), esc(m.health_socialAssistance), esc(m.health_hasDisability), esc(arrStr(getDisabilityList())),
                m.latitude || "", m.longitude || ""
            ].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join("\n");
        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `data_jemaat_EMAUS_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(`CSV berhasil diexport (${filteredMembers.length} jemaat)`);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        const arrStr = (v: any) => Array.isArray(v) ? v.join(', ') : (v || '-');

        doc.setFontSize(18);
        doc.text("Laporan Data Jemaat Terpadu - Emaus Liliba", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Total Jemaat: ${filteredMembers.length} | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 30);

        const baseTableConfig = {
            theme: 'grid' as const,
            headStyles: { fillColor: [51, 65, 85] as [number, number, number], textColor: [255, 255, 255] as [number, number, number], fontStyle: 'bold' as const },
            styles: { fontSize: 8, cellPadding: 2 },
            alternateRowStyles: { fillColor: [248, 250, 252] as [number, number, number] },
        };

        // 1. Identitas
        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text("Tabel 1: Identitas", 14, 40);
        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "Nomor Kartu Keluarga", "NIK", "Nama Lengkap", "Gender", "Tanggal Lahir", "Usia", "Nomor Telepon/ WhatsApp Aktif", "Lingkungan", "Rayon", "Alamat Lengkap"]],
            body: filteredMembers.map((m, i) => [i + 1, m.kkNumber || '-', m.nik || '-', m.name, m.gender, m.birthDate, calculateAge(m.birthDate), m.phone || '-', m.lingkungan, m.rayon, m.address?.substring(0, 30) || '-']),
            startY: 45,
            columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 45 } }
        });

        // 2. Keluarga & Diakonia
        doc.addPage();
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Total Jemaat: ${filteredMembers.length} | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 15);
        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text("Tabel 2: Keluarga & Diakonia", 14, 25);
        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "Nama Lengkap", "Total Anggota Keluarga", "Laki-laki", "Perempuan", "Di Luar Kota", "Sudah Sidi", "Penerima Diakonia", "Jenis Diakonia"]],
            body: filteredMembers.map((m, i) => [i + 1, m.name, m.familyMembers || 0, m.familyMembersMale || 0, m.familyMembersFemale || 0, m.familyMembersOutside || 0, m.familyMembersSidi || 0, m.diakonia_recipient || '-', m.diakonia_type?.substring(0, 30) || '-']),
            startY: 30,
            columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 45 } }
        });

        // 3. Profesi & Pelayanan
        doc.addPage();
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Total Jemaat: ${filteredMembers.length} | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 15);
        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text("Tabel 3: Profesi & Pelayanan", 14, 25);
        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "Nama Lengkap", "Pendidikan Terakhir", "Kategori Pekerjaan", "Daftar Keahlian", "Kesediaan Melayani", "Minat Pelayanan", "Bentuk Kontribusi"]],
            body: filteredMembers.map((m, i) => [i + 1, m.name, m.educationLevel || m.education || '-', m.jobCategory || '-', arrStr(m.skills), m.willingnessToServe || '-', arrStr(m.interestAreas), arrStr(m.contributionTypes)]),
            startY: 30,
            columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 35 }, 4: { cellWidth: 50 }, 6: { cellWidth: 40 }, 7: { cellWidth: 40 } }
        });

        // 4. Pendidikan Anak
        doc.addPage();
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Total Jemaat: ${filteredMembers.length} | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 15);
        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text("Tabel 4: Pendidikan Anak (Keluarga)", 14, 25);
        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "Nama Lengkap", "Status Anak Bersekolah", "Total Bersekolah", "Total Putus Sekolah", "Anak Sudah Bekerja"]],
            body: filteredMembers.map((m, i) => {
                const totalIn = (m.education_inSchool_tk_paud || 0) + (m.education_inSchool_sd || 0) + (m.education_inSchool_smp || 0) + (m.education_inSchool_sma || 0) + (m.education_inSchool_university || 0);
                const totalOut = (m.education_dropout_tk_paud || 0) + (m.education_dropout_sd || 0) + (m.education_dropout_smp || 0) + (m.education_dropout_sma || 0) + (m.education_dropout_university || 0);
                return [i + 1, m.name, m.education_schoolingStatus || '-', totalIn, totalOut, m.education_working || 0]
            }),
            startY: 30,
            columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 60 } }
        });

        // 5. Ekonomi
        doc.addPage();
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Total Jemaat: ${filteredMembers.length} | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 15);
        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text("Tabel 5: Ekonomi & Aset", 14, 25);
        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "Nama Lengkap", "Range Pendapatan", "Punya Usaha?", "Modal Usaha", "Status Rumah", "Sumber Air", "Total Aset", "Biaya Listrik"]],
            body: filteredMembers.map((m, i) => [i + 1, m.name, m.economics_incomeRange || '-', m.economics_hasBusiness || '-', m.economics_businessCapital ? `Rp${m.economics_businessCapital.toLocaleString('id-ID')}` : '-', m.economics_houseStatus || '-', m.economics_waterSource || '-', m.economics_totalAssets || 0, m.economics_electricity_total_cost ? `Rp${m.economics_electricity_total_cost.toLocaleString('id-ID')}` : 0]),
            startY: 30,
            columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 45 } }
        });

        // 6. Kesehatan
        doc.addPage();
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Total Jemaat: ${filteredMembers.length} | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 15);
        doc.setFontSize(14);
        doc.setTextColor(50);
        doc.text("Tabel 6: Kesehatan & Disabilitas", 14, 25);
        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "Nama Lengkap", "Sakit 30 Hari Terakhir", "Penyakit Kronis", "BPJS Kesehatan", "Bantuan Sosial", "Disabilitas", "Daftar Disabilitas"]],
            body: filteredMembers.map((m, i) => {
                const arr: string[] = [];
                if (m.health_disabilityPhysical?.length) arr.push(...m.health_disabilityPhysical);
                if (m.health_disabilityIntellectual?.length) arr.push(...m.health_disabilityIntellectual);
                if (m.health_disabilityMental?.length) arr.push(...m.health_disabilityMental);
                if (m.health_disabilitySensory?.length) arr.push(...m.health_disabilitySensory);
                if (m.health_disabilityDouble) arr.push("Ganda/Multi");
                return [i + 1, m.name, m.health_sick30Days || '-', m.health_chronicSick || '-', m.health_hasBPJS || '-', m.health_socialAssistance || '-', m.health_hasDisability || '-', arrStr(arr)];
            }),
            startY: 30,
            columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 40 }, 7: { cellWidth: 40 } }
        });

        doc.save(`Laporan_Jemaat_Emaus_Liliba_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("PDF berhasil diexport");
    };

    return (
        <AdminLayout title="Data Jemaat">
            <div className="min-h-screen bg-slate-50/30 dark:bg-transparent p-4 lg:p-8">
                <div className="w-full mx-auto">
                    {/* Page Header */}
                    <div className="flex flex-wrap justify-between gap-6 mb-8">
                        <div className="flex min-w-72 flex-col gap-1">
                            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-tight">Manajemen Data Jemaat Emaus Liliba</h1>
                            <p className="text-slate-500 text-sm font-medium">Kelola profil lengkap dan data jemaat.</p>
                        </div>
                        <div className="flex gap-3 items-end flex-wrap">
                            <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-5 h-11 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 font-bold text-slate-700 dark:text-slate-200 text-sm shadow-sm transition-all active:scale-95">
                                <span className="material-symbols-outlined text-xl text-primary font-icon">upload_file</span>
                                Import Data
                            </button>
                            <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm bg-white dark:bg-slate-800">
                                <button onClick={handleExportCSV} className="px-4 h-11 hover:bg-slate-50 dark:hover:bg-slate-700/50 border-r border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2 transition-all tooltip" title="Export ke CSV">
                                    <span className="material-symbols-outlined text-xl text-green-500 font-icon">csv</span> CSV
                                </button>
                                <button onClick={handleExportPDF} className="px-4 h-11 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2 transition-all tooltip" title="Export ke PDF">
                                    <span className="material-symbols-outlined text-xl text-red-500 font-icon">picture_as_pdf</span> PDF
                                </button>
                            </div>
                            <button onClick={() => { setIsEditMode(false); setIsAddModalOpen(true); }} className="flex items-center gap-2 px-6 h-11 rounded-xl bg-primary text-slate-900 font-black text-sm shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all active:scale-95">
                                <span className="material-symbols-outlined text-xl font-icon">person_add</span>
                                TAMBAH JEMAAT
                            </button>
                        </div>
                    </div>


                    {/* Bulk Action Bar */}
                    {selectedIds.length > 0 && (
                        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700">
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
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Lingkungan Dominan</p>
                                <span className="material-symbols-outlined text-primary/80">domain</span>
                            </div>
                            <p className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold">{stats.lingkunganDominant !== "-" ? `Ling. ${stats.lingkunganDominant}` : "-"}</p>
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
                                    value={filterLingkungan}
                                    onChange={(e) => setFilterLingkungan(e.target.value)}
                                    className="h-10 pl-3 pr-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium border-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                                >
                                    <option value="Semua">Semua Lingkungan</option>
                                    {[...Array(8)].map((_, i) => (
                                        <option key={i + 1} value={`${i + 1}`}>Lingkungan {i + 1}</option>
                                    ))}
                                </select>
                                <select
                                    value={filterRayon}
                                    onChange={(e) => setFilterRayon(e.target.value)}
                                    className="h-10 pl-3 pr-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium border-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                                >
                                    <option value="Semua">Semua Rayon</option>
                                    {[...Array(20)].map((_, i) => (
                                        <option key={i + 1} value={`${i + 1}`}>Rayon {i + 1}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold border transition-colors ${showAdvancedFilters ? 'bg-primary/10 text-primary border-primary/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                                >
                                    <span className="material-symbols-outlined text-lg">tune</span>
                                    Filter
                                </button>
                                {/* Clear Filter Button - Only visible if filters active */}
                                {(searchTerm || filterLingkungan !== "Semua" || filterRayon !== "Semua" || filterGender !== "Semua" || filterAgeCategory !== "Semua" || filterWillingness !== "Semua") &&
                                    <button
                                        onClick={() => { setSearchTerm(""); setFilterLingkungan("Semua"); setFilterRayon("Semua"); setFilterGender("Semua"); setFilterAgeCategory("Semua"); setFilterWillingness("Semua"); }}
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
                                    <label className="block text-xs font-bold text-slate-500 mb-1">Kesediaan Melayani</label>
                                    <select
                                        value={filterWillingness}
                                        onChange={(e) => setFilterWillingness(e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="Semua">Semua</option>
                                        <option value="Aktif">Ya, bersedia aktif</option>
                                        <option value="On-demand">Ya, bersedia bila dibutuhkan</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Table View Tabs */}
                    <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none pb-1">
                        {['Identitas', 'Keluarga & Diakonia', 'Profesi & Pelayanan', 'Pendidikan', 'Ekonomi', 'Kesehatan'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setTableTab(tab as any)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${tableTab === tab ? 'bg-primary text-slate-900 shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                                Data {tab.replace(' & Diakonia', '').replace(' & Pelayanan', '')}
                            </button>
                        ))}
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
                                                {(() => {
                                                    const baseCols = [
                                                        { label: "Nama Lengkap", key: "name", width: "min-w-[250px]" },
                                                        { label: "Lingkungan", key: "lingkungan", width: "min-w-[100px]" },
                                                        { label: "Rayon", key: "rayon", width: "min-w-[100px]" }
                                                    ];
                                                    let cols: any[] = [];
                                                    switch (tableTab) {
                                                        case 'Identitas': cols = [...baseCols, { label: "No. KK", key: "kkNumber", width: "min-w-[150px]" }, { label: "NIK", key: "nik", width: "min-w-[150px]" }, { label: "Usia", key: "birthDate", width: "w-20" }, { label: "Anggota (KK)", key: "familyMembers", width: "w-24" }, { label: "Alamat", key: "address", width: "min-w-[200px]" }]; break;
                                                        case 'Keluarga & Diakonia': cols = [...baseCols, { label: "L", key: "familyMembersMale", width: "w-16" }, { label: "P", key: "familyMembersFemale", width: "w-16" }, { label: "Luar Kupang", key: "familyMembersOutside", width: "w-24" }, { label: "Sidi", key: "familyMembersSidi", width: "w-20" }, { label: "Belum Baptis", key: "familyMembersNonBaptized", width: "w-24" }, { label: "Belum Sidi", key: "familyMembersNonSidi", width: "w-24" }, { label: "Diakonia", key: "diakonia_recipient", width: "min-w-[130px]" }]; break;
                                                        case 'Profesi & Pelayanan': cols = [...baseCols, { label: "Pendidikan", key: "educationLevel", width: "min-w-[120px]" }, { label: "Jurusan", key: "major", width: "min-w-[120px]" }, { label: "Pekerjaan", key: "jobCategory", width: "min-w-[150px]" }, { label: "Jabatan", key: "jobTitle", width: "min-w-[150px]" }, { label: "Tempat Kerja", key: "companyName", width: "min-w-[150px]" }, { label: "Keahlian", key: "skills", width: "min-w-[200px]" }, { label: "Status Relawan", key: "willingnessToServe", width: "min-w-[130px]" }]; break;
                                                        case 'Pendidikan': cols = [...baseCols, { label: "Status Sekolah", key: "education_schoolingStatus", width: "min-w-[150px]" }, { label: "Total Bersekolah", key: "education_inSchool_sd", width: "min-w-[150px]" }, { label: "Total Putus Sekolah", key: "education_dropout_sd", width: "min-w-[180px]" }, { label: "Total Tidak Sekolah", key: "education_unemployed_sd", width: "min-w-[180px]" }, { label: "Total Bekerja", key: "education_working", width: "min-w-[120px]" }]; break;
                                                        case 'Ekonomi': cols = [...baseCols, { label: "Pekerjaan KK", key: "economics_headOccupation", width: "min-w-[150px]" }, { label: "Pek. Pasangan", key: "economics_spouseOccupation", width: "min-w-[150px]" }, { label: "Pendapatan", key: "economics_incomeRange", width: "min-w-[150px]" }, { label: "Usaha UMKM", key: "economics_hasBusiness", width: "min-w-[120px]" }, { label: "Status Rumah", key: "economics_houseStatus", width: "min-w-[120px]" }, { label: "Sumber Air", key: "economics_waterSource", width: "min-w-[120px]" }]; break;
                                                        case 'Kesehatan': cols = [...baseCols, { label: "Sakit 30 Hari", key: "health_sick30Days", width: "min-w-[100px]" }, { label: "Sakit Kronis", key: "health_chronicSick", width: "min-w-[100px]" }, { label: "Disabilitas", key: "health_hasDisability", width: "min-w-[100px]" }, { label: "Berobat Rutin", key: "health_regularTreatment", width: "min-w-[100px]" }, { label: "BPJS JKN", key: "health_hasBPJS", width: "min-w-[100px]" }, { label: "BPJS Naker", key: "health_hasBPJSKetenagakerjaan", width: "min-w-[100px]" }, { label: "Bansos", key: "health_socialAssistance", width: "min-w-[100px]" }]; break;
                                                        default: cols = baseCols;
                                                    }
                                                    cols.push({ label: "Kelengkapan", key: "name", width: "w-20" }); // Metric column
                                                    return cols.map((col: any) => (
                                                        <th
                                                            key={col.label}
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
                                                    ));
                                                })()}
                                                <th className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                            {currentMembers.length > 0 ? (
                                                currentMembers.map((member) => (
                                                    <tr
                                                        key={member.id}
                                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer"
                                                        onClick={() => {
                                                            setSelectedMember(member);
                                                            setIsDetailModalOpen(true);
                                                        }}
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
                                                            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">Ling. {member.lingkungan}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full border border-slate-200 dark:border-slate-700">Rayon {member.rayon}</span>
                                                        </td>
                                                        {tableTab === 'Identitas' && (
                                                            <>
                                                                <td className="px-6 py-4 text-xs font-mono text-slate-500">{member.kkNumber || '-'}</td>
                                                                <td className="px-6 py-4 text-xs font-mono text-slate-500">{member.nik || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-bold">{calculateAge(member.birthDate)} Thn</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.familyMembers || 0} Org</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{member.address || '-'}</td>
                                                            </>
                                                        )}
                                                        {tableTab === 'Keluarga & Diakonia' && (
                                                            <>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.familyMembersMale || 0}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.familyMembersFemale || 0}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.familyMembersOutside || 0}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.familyMembersSidi || 0}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.familyMembersNonBaptized || 0}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.familyMembersNonSidi || 0}</td>
                                                                <td className="px-6 py-4 text-sm">
                                                                    <div className="flex flex-col gap-1 items-start">
                                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${member.diakonia_recipient === 'Ya' ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' : 'text-slate-400'}`}>{member.diakonia_recipient === 'Ya' ? 'PENERIMA' : 'TIDAK'}</span>
                                                                        {member.diakonia_recipient === 'Ya' && <span className="text-[9px] font-medium text-slate-400">{member.diakonia_type} ({member.diakonia_year})</span>}
                                                                    </div>
                                                                </td>
                                                            </>
                                                        )}
                                                        {tableTab === 'Profesi & Pelayanan' && (
                                                            <>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.educationLevel || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.major || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{member.jobCategory || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.jobTitle || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.companyName || '-'}</td>
                                                                <td className="px-6 py-4">
                                                                    <div className="flex -space-x-1 overflow-hidden">
                                                                        {(member.skills || []).slice(0, 3).map((s: string, i: number) => (
                                                                            <div key={i} className="inline-block size-6 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-600" title={s}>{s[0]}</div>
                                                                        ))}
                                                                        {(member.skills || []).length > 3 && <div className="inline-block size-6 rounded-full bg-slate-50 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-400">+{(member.skills || []).length - 3}</div>}
                                                                        {(member.skills || []).length === 0 && <span className="text-sm text-slate-400">-</span>}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${['Aktif', 'Active', 'Ya'].includes(member.willingnessToServe || '') ? 'bg-green-100 text-green-600 border-green-200' : member.willingnessToServe === 'On-demand' ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{['Aktif', 'Active', 'Ya'].includes(member.willingnessToServe || '') ? 'AKTIF' : member.willingnessToServe === 'On-demand' ? 'ON-DEMAND' : 'UMUM'}</span>
                                                                </td>
                                                            </>
                                                        )}
                                                        {tableTab === 'Pendidikan' && (
                                                            <>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 truncate max-w-[150px]">{member.education_schoolingStatus || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-emerald-600 font-bold dark:text-emerald-400">{((member.education_inSchool_tk_paud || 0) + (member.education_inSchool_sd || 0) + (member.education_inSchool_smp || 0) + (member.education_inSchool_sma || 0) + (member.education_inSchool_university || 0)) || '-'} Org</td>
                                                                <td className="px-6 py-4 text-sm text-red-600 font-bold dark:text-red-400">{((member.education_dropout_tk_paud || 0) + (member.education_dropout_sd || 0) + (member.education_dropout_smp || 0) + (member.education_dropout_sma || 0) + (member.education_dropout_university || 0)) || '-'} Org</td>
                                                                <td className="px-6 py-4 text-sm text-amber-600 font-bold dark:text-amber-400">{((member.education_unemployed_sd || 0) + (member.education_unemployed_smp || 0) + (member.education_unemployed_sma || 0) + (member.education_unemployed_university || 0)) || '-'} Org</td>
                                                                <td className="px-6 py-4 text-sm font-bold text-slate-600 dark:text-slate-400">{member.education_working || '-'} Org</td>
                                                            </>
                                                        )}
                                                        {tableTab === 'Ekonomi' && (
                                                            <>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.economics_headOccupation || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.economics_spouseOccupation || '-'}</td>
                                                                <td className="px-6 py-4 text-sm font-medium text-emerald-600">{member.economics_incomeRange || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.economics_hasBusiness === 'Ya' ? member.economics_businessType || 'Punya Usaha' : 'Tidak Ada'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.economics_houseStatus || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.economics_waterSource || '-'}</td>
                                                            </>
                                                        )}
                                                        {tableTab === 'Kesehatan' && (
                                                            <>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.health_sick30Days || '-'}</td>
                                                                <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${member.health_chronicSick === 'Ya' ? 'bg-red-100 text-red-600' : 'text-slate-400'}`}>{member.health_chronicSick === 'Ya' ? 'ADA' : '-'}</span></td>
                                                                <td className="px-6 py-4 text-sm"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${member.health_hasDisability === 'Ya' ? 'bg-amber-100 text-amber-600' : 'text-slate-400'}`}>{member.health_hasDisability === 'Ya' ? 'ADA' : '-'}</span></td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.health_regularTreatment || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.health_hasBPJS || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.health_hasBPJSKetenagakerjaan || '-'}</td>
                                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{member.health_socialAssistance || '-'}</td>
                                                            </>
                                                        )}
                                                        <td className="px-6 py-4">
                                                            {(() => {
                                                                const c = calculateCompleteness(member);
                                                                const bg = c.color === 'green' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                                                    : c.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
                                                                        : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
                                                                return <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${bg}`}>{c.percent}%</span>;
                                                            })()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedMember(member);
                                                                        setIsEditMode(true);
                                                                        setIsDetailModalOpen(false);
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
                                                            <p className="font-bold text-slate-900 dark:text-white mb-0.5">{member.name}</p>
                                                            <p className="text-xs text-slate-500 flex items-center gap-1.5"><span className="material-symbols-outlined text-[12px]">wc</span>{member.gender} <span className="text-[10px]">•</span> <span className="material-symbols-outlined text-[12px]">cake</span>{calculateAge(member.birthDate)} Thn</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Ling. {member.lingkungan} / Rayon {member.rayon}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                                                    <div>
                                                        <span className="block text-[10px] uppercase tracking-wider mb-0.5">Pekerjaan & Kelengkapan</span>
                                                        <div className="mt-0.5 flex flex-wrap gap-1 items-center">
                                                            <span className="font-medium text-slate-700 dark:text-slate-300">{member.jobCategory || member.job}</span>
                                                            {(() => {
                                                                const c = calculateCompleteness(member);
                                                                const bg = c.color === 'green' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30'
                                                                    : c.color === 'yellow' ? 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30'
                                                                        : 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30';
                                                                return <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded border ${bg}`}>{c.percent}% Lengkap</span>;
                                                            })()}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="block text-[10px] uppercase tracking-wider mb-0.5">Pend. & Status Pelayanan</span>
                                                        <div className="mt-0.5 flex flex-wrap gap-1">
                                                            <span className="font-medium text-slate-700 dark:text-slate-300">{member.education}</span>
                                                            <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold border ${['Aktif', 'Active', 'Ya'].includes(member.willingnessToServe || '') ? 'bg-green-100 text-green-600 border-green-200' : member.willingnessToServe === 'On-demand' ? 'bg-amber-100 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{['Aktif', 'Active', 'Ya'].includes(member.willingnessToServe || '') ? 'AKTIF' : member.willingnessToServe === 'On-demand' ? 'ON-DEMAND' : 'UMUM'}</span>
                                                        </div>
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
                                            onClick={() => {
                                                setSelectedMember(member);
                                                setIsDetailModalOpen(true);
                                            }}
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
                                                    <p className="text-sm text-slate-500">Ling. {member.lingkungan} • Rayon {member.rayon}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Pekerjaan</span>
                                                    <span className="font-medium dark:text-slate-200">{member.jobCategory || member.job}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Pelayanan</span>
                                                    <span className="font-medium dark:text-slate-200">{['Aktif', 'Active', 'Ya'].includes(member.willingnessToServe || '') ? 'Relawan' : member.willingnessToServe === 'On-demand' ? 'On-demand' : 'Umum'}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex flex-wrap gap-1">
                                                {Array.isArray(member.skills) && member.skills.slice(0, 3).map((skill, skIdx) => (
                                                    <span key={skIdx} className="bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">{skill}</span>
                                                ))}
                                                {Array.isArray(member.skills) && member.skills.length > 3 && <span className="text-xs text-slate-400 pl-1">+{member.skills.length - 3}</span>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                                            <p>Tidak ada data member yang cocok dengan filter Anda.</p>
                                            <button
                                                onClick={() => { setSearchTerm(""); setFilterLingkungan("Semua"); setFilterRayon("Semua"); setFilterGender("Semua"); setFilterAgeCategory("Semua"); setFilterWillingness("Semua"); }}
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
                        onClose={() => {
                            setIsAddModalOpen(false);
                            if (!isDetailModalOpen) setSelectedMember(null);
                        }}
                        title={isEditMode ? "Edit Data Jemaat" : "Tambah Jemaat Baru"}
                    >
                        <AddMemberForm
                            onClose={() => setIsAddModalOpen(false)}
                            initialData={isEditMode ? selectedMember : undefined}
                            onSuccess={() => {
                                // All mutations inside AddMemberForm already invalidate query
                                setIsAddModalOpen(false);
                            }}
                        />
                    </Modal>

                    <Modal
                        isOpen={isDetailModalOpen}
                        onClose={() => {
                            setIsDetailModalOpen(false);
                            setSelectedMember(null);
                        }}
                        title="Detail Jemaat"
                        maxWidth="max-w-7xl"
                    >
                        <MemberDetailModal
                            member={selectedMember}
                            onClose={() => {
                                setIsDetailModalOpen(false);
                                setSelectedMember(null);
                            }}
                            onEdit={() => {
                                setIsDetailModalOpen(false);
                                setIsEditMode(true);
                                setIsAddModalOpen(true);
                            }}
                        />
                    </Modal>

                    {/* Import Modal */}
                    <Modal
                        isOpen={isImportModalOpen}
                        onClose={() => setIsImportModalOpen(false)}
                        title="Import Data Jemaat"
                        maxWidth="max-w-4xl"
                    >
                        <div className="flex flex-col gap-6">
                            {/* Template Instructions */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm">
                                <h4 className="font-bold flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-base">info</span>
                                    Panduan Import Data
                                </h4>
                                <ul className="list-disc pl-5 space-y-1 mb-4 opacity-90">
                                    <li>Pastikan format file adalah <b>.csv</b> (Comma Separated Values).</li>
                                    <li>Format tanggal di kolom "Tanggal Lahir" gunakan pola <code>YYYY-MM-DD</code> (misal: 1990-12-31).</li>
                                    <li>Untuk data ganda seperti Daftar Keahlian atau Daftar Penyakit, gunakan titik koma <code>;</code> sebagai pemisah (contoh: <code>Memasak;Menjahit</code>).</li>
                                    <li>Gunakan file template yang telah kami sediakan untuk memastikan seluruh format kolom sesuai. Kolom opsional boleh dikosongkan.</li>
                                </ul>
                                <button
                                    onClick={handleDownloadTemplate}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-sm">download</span>
                                    Download Template CSV
                                </button>
                            </div>

                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-700 dark:text-slate-300">
                                    Referensi Kolom Wajib (Sekilas)
                                </div>
                                <div className="max-h-40 overflow-y-auto p-4 text-xs text-slate-600 dark:text-slate-400 font-mono leading-relaxed bg-slate-50/50 dark:bg-slate-900/50">
                                    <p><b>Identitas:</b> Nomor Kartu Keluarga, NIK, Nama Lengkap Kepala Keluarga, Jenis Kelamin, Tanggal Lahir, Nomor Telepon/ WhatsApp Aktif, Lingkungan, Rayon, Alamat Lengkap</p>
                                    <p className="mt-2"><b>Keluarga:</b> Total Anggota Keluarga, Laki-laki, Perempuan, Di Luar Kota, Sudah Sidi, Sidi Laki-laki, Sidi Perempuan, Belum Baptis, Belum Sidi</p>
                                    <p className="mt-2"><b>Diakonia:</b> Penerima Diakonia, Tahun Diakonia, Jenis Diakonia</p>
                                    <p className="mt-2"><b>Profesional:</b> Pendidikan Terakhir, Jurusan, Kategori Pekerjaan, Jabatan, Nama Instansi, Lama Kerja (Tahun), Daftar Keahlian</p>
                                    <p className="mt-2"><b>Pelayanan:</b> Kesediaan Melayani, Minat Pelayanan, Bentuk Kontribusi</p>
                                    <p className="mt-2"><b>Pendidikan Anak:</b> Status Anak Bersekolah, TK/PAUD (Sekolah)... s/d Universitas (Putus), Anak Sudah Bekerja</p>
                                    <p className="mt-2"><b>Ekonomi:</b> Pekerjaan KK, Pekerjaan Pasangan, Range Pendapatan, Pengeluaran Pangan... s/d Punya Usaha?, Daftar Aset</p>
                                    <p className="mt-2 text-primary dark:text-primary">* Disarankan untuk mengunduh template CSV agar tidak ada judul kolom yang terlewat.</p>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 relative ${isDragActive
                                    ? 'border-primary bg-primary/10 scale-[1.02]'
                                    : importFile
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10 dark:border-green-800'
                                        : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                {importFile ? (
                                    <div className="flex flex-col items-center gap-3 animate-fade-in-up">
                                        <div className="size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-500 mb-2">
                                            <span className="material-symbols-outlined text-3xl">task</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 dark:text-white text-lg">{importFile.name}</p>
                                            <p className="text-sm font-medium text-green-600 dark:text-green-400">File CSV Siap Diimport ({(importFile.size / 1024).toFixed(2)} KB)</p>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2">Klik lagi jika ingin mengganti file</p>
                                    </div>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-5xl text-slate-400 mb-4 group-hover:text-primary transition-colors">cloud_upload</span>
                                        <p className="font-bold text-slate-900 dark:text-white text-lg">Klik atau drag & drop file CSV ke sini</p>
                                        <p className="text-sm text-slate-500 mt-2">Maximum file size: 5MB</p>
                                    </>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => { setIsImportModalOpen(false); setImportFile(null); }}
                                    className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleImportSubmit}
                                    disabled={!importFile || importMutation.isPending}
                                    className="px-6 py-2.5 bg-primary text-slate-900 font-bold rounded-xl hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all active:scale-95"
                                >
                                    {importMutation.isPending ? (
                                        <>
                                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                            Memproses...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">upload</span>
                                            Mulai Import
                                        </>
                                    )}
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
                                    <option value="lingkungan">Lingkungan</option>
                                    <option value="rayon">Rayon</option>
                                    <option value="willingnessToServe">Kesediaan Melayani</option>
                                    <option value="gender">Jenis Kelamin</option>
                                </select>
                            </div>

                            {bulkEditField === 'lingkungan' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Lingkungan Baru</label>
                                    <select
                                        value={bulkEditValue}
                                        onChange={(e) => setBulkEditValue(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="">-- Pilih Lingkungan --</option>
                                        {[...Array(8)].map((_, i) => (
                                            <option key={i + 1} value={`${i + 1}`}>Lingkungan {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {bulkEditField === 'rayon' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Rayon Baru</label>
                                    <select
                                        value={bulkEditValue}
                                        onChange={(e) => setBulkEditValue(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="">-- Pilih Rayon --</option>
                                        {[...Array(20)].map((_, i) => (
                                            <option key={i + 1} value={`${i + 1}`}>Rayon {i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {bulkEditField === 'willingnessToServe' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Kesediaan Baru</label>
                                    <select
                                        value={bulkEditValue}
                                        onChange={(e) => setBulkEditValue(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/50"
                                    >
                                        <option value="">-- Pilih Kesediaan --</option>
                                        <option value="Aktif">Aktif</option>
                                        <option value="On-demand">On-demand</option>
                                        <option value="Belum bersedia">Belum bersedia</option>
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
                    <ConfirmDialog
                        isOpen={confirmDialog.isOpen}
                        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                        onConfirm={confirmDialog.action}
                        title={confirmDialog.title}
                        message={confirmDialog.message}
                        variant={confirmDialog.variant}
                    />
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminMemberData;
