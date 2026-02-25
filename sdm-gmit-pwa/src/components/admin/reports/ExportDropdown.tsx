import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from '../../ui/Toast';
import type { Member } from '../../../hooks/useMemberData';

interface ExportDropdownProps {
    members: Member[];
    onExportCSV: () => void;
}

export const ExportDropdown = ({ members, onExportCSV }: ExportDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const arrStr = (v: any) => Array.isArray(v) ? v.join(', ') : (v || '-');
    const getAge = (birthDate?: string | null) => {
        if (!birthDate) return '-';
        const dob = new Date(birthDate);
        if (isNaN(dob.getTime())) return '-';
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    };

    const baseTableConfig = {
        theme: 'grid' as const,
        headStyles: { fillColor: [51, 65, 85] as [number, number, number], textColor: [255, 255, 255] as [number, number, number], fontStyle: 'bold' as const },
        styles: { fontSize: 8, cellPadding: 2 },
        alternateRowStyles: { fillColor: [248, 250, 252] as [number, number, number] },
    };

    const generateHeader = (doc: jsPDF, title: string) => {
        doc.setFontSize(18);
        doc.text(`Laporan ${title} Jemaat - Emaus Liliba`, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Total Jemaat Diekstrak: ${members.length} | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 30);
    };

    // 1. PDF Identitas Utama
    const exportIdentitas = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        generateHeader(doc, "Master Data Identitas");
        
        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "No. KK", "NIK", "Nama Lengkap", "L/P", "Usia", "No. HP", "Lingkungan", "Rayon", "Alamat"]],
            body: members.map((m, i) => [
                i + 1, m.kkNumber || '-', m.nik || '-', m.name, 
                m.gender === 'Laki-laki' ? 'L' : m.gender === 'Perempuan' ? 'P' : '-', 
                getAge(m.birthDate), m.phone || '-', m.lingkungan, m.rayon, m.address?.substring(0, 30) || '-'
            ]),
            startY: 40,
            columnStyles: { 0: { cellWidth: 10 }, 3: { cellWidth: 45 } }
        });
        doc.save(`Laporan_Identitas_Emaus_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("Laporan Identitas berhasil diekspor");
        setIsOpen(false);
    };

    // 2. PDF UMKM & Ekonomi
    const exportEkonomi = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        generateHeader(doc, "Pemetaan UMKM & Ekonomi");

        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "Nama KK", "Pekerjaan", "Pendapatan", "Punya Usaha", "Jenis Usaha", "Status Rumah", "Aset Dominan"]],
            body: members.map((m, i) => [
                i + 1, m.name, m.economics_headOccupation || '-', m.economics_incomeRange || '-',
                m.economics_hasBusiness || '-', m.economics_businessType || '-', 
                m.economics_houseStatus || '-', 
                arrStr(m.economics_assets).substring(0, 30) || '-'
            ]),
            startY: 40,
            columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 45 } }
        });
        doc.save(`Laporan_UMKM_Ekonomi_Emaus_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("Laporan Ekonomi berhasil diekspor");
        setIsOpen(false);
    };

    // 3. PDF Kesehatan & Disabilitas
    const exportKesehatan = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        generateHeader(doc, "Kesehatan & Disabilitas");

        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "Nama Lengkap", "Usia", "BPJS JKN", "Riwayat Penyakit Kronis", "Disabilitas Fisik", "Disabilitas Mental/Lainnya"]],
            body: members.map((m, i) => [
                i + 1, m.name, getAge(m.birthDate), m.health_hasBPJS || '-',
                arrStr(m.health_chronicDisease) || '-',
                arrStr(m.health_disabilityPhysical) || '-',
                [...(m.health_disabilityIntellectual || []), ...(m.health_disabilityMental || []), ...(m.health_disabilitySensory || [])].join(', ') || '-'
            ]),
            startY: 40,
            columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 45 }, 4: { cellWidth: 60 } }
        });
        doc.save(`Laporan_Kesehatan_Emaus_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("Laporan Kesehatan berhasil diekspor");
        setIsOpen(false);
    };

    // 4. PDF Potensi Pelayanan
    const exportPelayanan = () => {
        const doc = new jsPDF({ orientation: 'landscape' });
        generateHeader(doc, "Potensi & Tenaga Ahli");

        autoTable(doc, {
            ...baseTableConfig,
            head: [["No", "Nama", "Pendidikan", "Profesi", "Keahlian Spesifik", "Kesediaan Melayani", "Bentuk Kontribusi"]],
            body: members.map((m, i) => [
                i + 1, m.name, m.educationLevel || '-', m.jobCategory || '-',
                arrStr(m.skills).substring(0, 40) || '-', m.willingnessToServe || '-',
                arrStr(m.contributionTypes) || '-'
            ]),
            startY: 40,
            columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 40 }, 4: { cellWidth: 60 } }
        });
        doc.save(`Laporan_Pelayanan_Emaus_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success("Laporan Pelayanan berhasil diekspor");
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="px-5 h-11 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-bold text-slate-700 dark:text-slate-200 text-sm flex items-center gap-2 transition-all tooltip"
                title="Pilih opsi Ekspor"
            >
                <span className="material-symbols-outlined text-xl text-primary font-icon">save_alt</span> 
                Export Laporan
                <span className="material-symbols-outlined text-sm ml-1 transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }}>expand_more</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-[100] animate-fade-in-down origin-top-right">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/80">
                        <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Master Data</p>
                    </div>
                    <button onClick={() => { onExportCSV(); setIsOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors">
                        <div className="size-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400"><span className="material-symbols-outlined text-lg">csv</span></div>
                        <div>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">Export RAW CSV</p>
                            <p className="text-[10px] text-slate-500">Seluruh 70+ Kolom (Bisa dimodif Excel)</p>
                        </div>
                    </button>
                    
                    <div className="p-3 border-y border-slate-100 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/80">
                        <p className="text-[10px] font-black tracking-widest uppercase text-slate-500">Laporan Tematik (PDF)</p>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        <button onClick={exportIdentitas} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-700/30">
                            <span className="material-symbols-outlined text-slate-400 text-xl">contact_page</span>
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Induk Identitas</p>
                                <p className="text-[10px] text-slate-500">Data KK, NIK, Usia, dll.</p>
                            </div>
                        </button>
                        <button onClick={exportEkonomi} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-700/30">
                            <span className="material-symbols-outlined text-slate-400 text-xl">storefront</span>
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Potensi UMKM & Ekonomi</p>
                                <p className="text-[10px] text-slate-500">Profil usaha, aset, pendapatan</p>
                            </div>
                        </button>
                        <button onClick={exportPelayanan} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors border-b border-slate-50 dark:border-slate-700/30">
                            <span className="material-symbols-outlined text-slate-400 text-xl">engineering</span>
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Keahlian & Pelayanan</p>
                                <p className="text-[10px] text-slate-500">Skill, kesediaan, profesi jemaat</p>
                            </div>
                        </button>
                        <button onClick={exportKesehatan} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 text-xl">monitor_heart</span>
                            <div>
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Kesehatan Khusus</p>
                                <p className="text-[10px] text-slate-500">Disabilitas & Penyakit Kronis</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
