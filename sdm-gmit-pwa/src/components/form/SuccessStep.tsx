import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import type { FormData } from '../../types';
import jsPDF from 'jspdf';
import logoGmitUrl from '../../assets/logo-gmit.png';

interface SuccessStepProps {
    formData: FormData;
    registrationId: number | null;
}

const SuccessStep = ({ formData, registrationId }: SuccessStepProps) => {
    const navigate = useNavigate();

    // Trigger confetti on mount
    useEffect(() => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    // Save registration ID to localStorage for returning user detection
    useEffect(() => {
        if (registrationId) {
            localStorage.setItem('gmit-registration-id', registrationId.toString());
        }
    }, [registrationId]);

    // Format registration ID properly
    const displayId = registrationId
        ? `REG-${registrationId.toString().padStart(4, '0')}`
        : `REG-XXXX`;

    const handleSaveProof = async () => {
        // Fetch Ketua Lingkungan name
        let ketuaLingkungan = '';
        if (formData.lingkungan) {
            try {
                const resp = await fetch(`/api/pendamping-by-lingkungan/${formData.lingkungan}`);
                if (resp.ok) {
                    const data = await resp.json();
                    ketuaLingkungan = data.name || '';
                }
            } catch { /* ignore */ }
        }

        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let y = 20;

        // --- Load logo image ---
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = () => reject();
                img.src = logoGmitUrl;
            });
            const logoSize = 20;
            doc.addImage(img, 'PNG', (pageWidth - logoSize) / 2, y, logoSize, logoSize);
            y += logoSize + 4;
        } catch {
            // If logo fails to load, skip it
            y += 5;
        }

        // --- Header ---
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('GEREJA MASEHI INJILI DI TIMOR', pageWidth / 2, y, { align: 'center' });
        y += 7;
        doc.setFontSize(12);
        doc.text('Jemaat Emaus Liliba', pageWidth / 2, y, { align: 'center' });
        y += 6;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Bukti Pendaftaran Pendataan Jemaat 2026', pageWidth / 2, y, { align: 'center' });
        y += 4;

        // --- Divider ---
        doc.setDrawColor(50, 50, 50);
        doc.setLineWidth(0.8);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        // --- Registration ID ---
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 100, 100);
        doc.text('ID REGISTRASI', margin, y);
        y += 6;
        doc.setFontSize(18);
        doc.setTextColor(30, 30, 30);
        doc.text(displayId, margin, y);
        y += 10;

        // --- Status Badge ---
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        const statusText = 'STATUS: MENUNGGU VERIFIKASI ADMIN';
        doc.setFillColor(255, 243, 205); // amber-100
        doc.setDrawColor(217, 175, 50);
        const badgeWidth = doc.getTextWidth(statusText) + 10;
        doc.roundedRect(margin, y - 4, badgeWidth, 8, 2, 2, 'FD');
        doc.setTextColor(146, 106, 7); // amber-700
        doc.text(statusText, margin + 5, y + 1);
        y += 14;

        // --- Personal Data Section ---
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Data Pendaftar', margin, y);
        y += 2;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 7;

        const dataRows = [
            ['Nama Lengkap (KK)', formData.fullName || '-'],
            ['Nomor Kartu Keluarga', formData.kkNumber || '-'],
            ['NIK', formData.nik || '-'],
            ['Jenis Kelamin', formData.gender || '-'],
            ['Lingkungan / Rayon', `Lingkungan ${formData.lingkungan || '-'} / Rayon ${formData.rayon || '-'}`],
            ['Alamat', formData.address || '-'],
            ['No. Telepon / WA', formData.phone || '-'],
            ['Jumlah Anggota Keluarga', formData.familyMembers || '-'],
        ];

        doc.setFontSize(9);
        for (const [label, value] of dataRows) {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(120, 120, 120);
            doc.text(label, margin, y);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(30, 30, 30);

            // Handle long text wrapping for address
            if (label === 'Alamat' && value.length > 50) {
                const lines = doc.splitTextToSize(value, pageWidth - margin - 75);
                doc.text(lines, 75, y);
                y += 5 * lines.length;
            } else {
                doc.text(value, 75, y);
                y += 7;
            }
        }

        y += 5;

        // --- Timeline / Next Steps ---
        doc.setTextColor(30, 30, 30);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Status Proses', margin, y);
        y += 2;
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;

        doc.setFontSize(9);
        // Step 1: Data Terkirim (green)
        doc.setFillColor(16, 185, 129);
        doc.circle(margin + 3, y - 1.5, 2.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(5, 150, 105);
        doc.text('Data Terkirim', margin + 10, y);
        y += 7;

        // Step 2: Proses Verifikasi (amber)
        doc.setFillColor(245, 158, 11);
        doc.circle(margin + 3, y - 1.5, 2.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(146, 106, 7);
        doc.text('Proses Verifikasi Admin (Maks. 1x24 jam)', margin + 10, y);
        y += 7;

        // Step 3: Tervalidasi (gray - pending)
        doc.setFillColor(200, 200, 200);
        doc.circle(margin + 3, y - 1.5, 2.5, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text('Tervalidasi & Masuk Database', margin + 10, y);
        y += 15;

        // --- Signature Area ---
        const now = new Date();
        const dateStr = `Kupang, ${now.getDate()} ${['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][now.getMonth()]} ${now.getFullYear()}`;

        doc.setTextColor(30, 30, 30);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');

        // Left: Kepala Keluarga
        doc.text(dateStr, margin, y);
        y += 25;
        doc.setFont('helvetica', 'bold');
        doc.text(formData.fullName || '..............................', margin, y);
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Kepala Keluarga', margin, y);

        // Right: Ketua Rayon / Lingkungan
        const rightX = pageWidth - margin - 50;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Mengetahui,', rightX, y - 30);
        doc.setFont('helvetica', 'bold');
        doc.text(ketuaLingkungan || '..............................', rightX, y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(`Ketua Lingkungan ${formData.lingkungan || ''}`, rightX, y + 5);

        // --- Footer ---
        y = doc.internal.pageSize.getHeight() - 15;
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 5;
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'italic');
        doc.text('Dokumen ini digenerate secara otomatis oleh sistem SIPPR GMIT Jemaat Emaus Liliba.', pageWidth / 2, y, { align: 'center' });

        doc.save(`Bukti-Pendaftaran-${displayId}.pdf`);
    };

    return (
        <div className="flex flex-col items-center justify-center py-6 md:py-10 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-50 dark:from-green-900/40 dark:to-emerald-900/20 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/20 border border-green-200 dark:border-green-800 animate-scale-in">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">check_circle</span>
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 animate-fade-in-up">Pendaftaran Terkirim!</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-lg animate-fade-in-up delay-100">
                Terima kasih telah melengkapi data Saudara/i. Partisipasi Anda sangat berharga bagi pertumbuhan dan masa depan pelayanan Jemaat Emaus Liliba.
            </p>

            {/* Registration Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl max-w-lg w-full mb-10 text-left relative overflow-hidden animate-fade-in-up delay-200 group">

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>

                <div className="flex justify-between items-start mb-6 relative z-20">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status Registrasi</p>
                        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-800/50 w-fit">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">MENUNGGU VERIFIKASI</span>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-amber-200 dark:text-amber-700/30 text-5xl absolute -top-2 -right-2">hourglass_top</span>
                </div>

                <div className="space-y-6">
                    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">ID Registrasi</p>
                        <p className="font-mono text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-widest">{displayId}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Nama Lengkap</p>
                            <p className="font-bold text-slate-900 dark:text-slate-200">{formData.fullName || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Nomor KK</p>
                            <p className="font-bold text-slate-900 dark:text-slate-200 font-mono tracking-wider">{formData.kkNumber || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Rayon / Lingkungan</p>
                            <p className="font-bold text-slate-900 dark:text-slate-200">Rayon {formData.rayon || '-'} / {formData.lingkungan || '-'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">No. Telepon / WA</p>
                            <p className="font-bold text-slate-900 dark:text-slate-200">{formData.phone || '-'}</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-200">Langkah Selanjutnya:</p>

                        {/* Timeline */}
                        <div className="relative pl-6 space-y-4">
                            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

                            <div className="relative z-10">
                                <span className="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 bg-emerald-500"></span>
                                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Data Terkirim</h4>
                            </div>

                            <div className="relative z-10">
                                <span className="absolute -left-[27px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 bg-amber-500"></span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">Proses Verifikasi Admin</h4>
                                <p className="text-xs text-slate-500 mt-0.5 inline-block bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">Maks. 1x24 jam</p>
                            </div>

                            <div className="relative z-10 opacity-50">
                                <span className="absolute -left-[27px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 bg-slate-300 dark:bg-slate-600"></span>
                                <h4 className="text-sm font-bold text-slate-500">Tervalidasi & Masuk Database</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-lg mx-auto animate-fade-in-up delay-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    <button
                        onClick={handleSaveProof}
                        className="h-14 rounded-xl font-black text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full ring-2 ring-indigo-500/50 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900"
                    >
                        <span className="material-symbols-outlined font-bold">picture_as_pdf</span>
                        Simpan Bukti (PDF)
                    </button>
                    <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-14 rounded-xl font-black text-white bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#0F7569] shadow-xl shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 w-full"
                    >
                        <span className="material-symbols-outlined font-bold">chat</span>
                        Hubungi Admin / WA
                    </a>
                </div>
                <button
                    onClick={() => navigate('/status')}
                    className="h-12 rounded-xl font-bold text-indigo-700 hover:bg-indigo-100 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 transition-colors w-full border border-indigo-200 dark:border-indigo-800 flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">search</span>
                    Cek Status Registrasi
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="h-12 rounded-xl font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors w-full border border-slate-300 dark:border-slate-600"
                >
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    );
};

export default SuccessStep;
