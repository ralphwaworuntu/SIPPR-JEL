# Changelog

Semua perubahan yang dibuat sejak commit `c4b79c7` (Tambah username & password pada menu enumerator & pendamping, modal pengaturan akun login).

---

## 1. Enumerator Dashboard — Personalisasi & Form Kunjungan

### Perubahan
- **Banner personalized** — Menampilkan "Selamat Datang, [Nama Enumerator]!" berdasarkan data login.
- **Kartu "Kunjungan"** — Menggantikan kartu "Data Keluarga", menampilkan jumlah kunjungan yang sudah diselesaikan.
- **Kartu "Tugas Kunjungan" dan "Progres"** dihapus.
- **Form Tambah Kunjungan Baru** — Kartu memanjang dengan:
  - Dropdown **Pilih Rayon** — Filter keluarga berdasarkan rayon.
  - Dropdown **Kepala Keluarga** — Hanya menampilkan keluarga di rayon terpilih yang belum pernah dikunjungi oleh enumerator manapun.
  - Upload **foto bukti kunjungan** dengan preview & tombol hapus.
  - Field **keterangan** dan tombol **submit**.

### Cara Kerja
- `GET /api/enumerator/me` → mengambil data enumerator berdasarkan session login.
- `GET /api/enumerator/families` → mengambil daftar keluarga + field `rayon`, memfilter keluarga yang sudah dikunjungi (oleh siapapun).
- `POST /api/enumerator/visits` → menyimpan kunjungan baru (foto diupload via `multer`).
- Frontend menggunakan `@tanstack/react-query` untuk state management server.

**File:** `EnumeratorDashboard.tsx`, `server/index.ts`

---

## 2. Halaman Kelola Kunjungan (Enumerator)

### Perubahan
- Halaman baru **"Kelola Kunjungan"** (`/enumerator/visits`) untuk enumerator mengelola kunjungan yang sudah disubmit.
- Tabel menampilkan: No, Kepala Keluarga, Foto (thumbnail + preview modal), Keterangan, Tanggal, **Status**, dan Aksi.
- **Kolom Status** menampilkan badge berwarna:
  - 🟢 **Valid** — divalidasi pendamping.
  - 🔴 **Tidak Valid** — ditolak, alasan penolakan ditampilkan di bawah badge.
  - 🟡 **Menunggu** — belum divalidasi.
- **Tombol Hapus** — Menghapus kunjungan dengan konfirmasi modal. Keluarga yang dihapus kembali tersedia di dropdown.

### Cara Kerja
- `GET /api/enumerator/visits` → mengambil semua kunjungan milik enumerator (termasuk status & alasan penolakan).
- `DELETE /api/enumerator/visits/:id` → menghapus kunjungan.
- Navigasi ditambahkan di sidebar `EnumeratorLayout.tsx`.
- Route lazy-loaded di `App.tsx`.

**File:** `EnumeratorVisits.tsx` (baru), `EnumeratorLayout.tsx`, `App.tsx`, `server/index.ts`

---

## 3. Kolom Status Kunjungan (Database)

### Perubahan
- Kolom `status` (`VARCHAR(20)`, default `'pending'`) dan `rejection_reason` (`TEXT`) ditambahkan ke tabel `visits`.

### Cara Kerja
- Kolom `status` menerima nilai: `pending`, `valid`, atau `invalid`.
- Kolom `rejection_reason` diisi saat status diubah ke `invalid`.

**File:** `server/schema.ts`

---

## 4. Dashboard Pendamping Lingkungan

### Perubahan
- **Banner personalized** — "Selamat Datang, [Nama Pendamping]!" + info Lingkungan.
- **4 Kartu Statistik:**
  - Jumlah Keluarga (di lingkungannya)
  - Jumlah Enumerator
  - Keluarga yang Sudah Dikunjungi
  - Keluarga yang Belum Dikunjungi
- **Tabel Kelola Kunjungan Enumerator** — Menampilkan semua kunjungan dari enumerator di lingkungan pendamping, lengkap dengan:
  - Nama Enumerator
  - Tombol ✅ **Validasi** — langsung set status "Valid".
  - Tombol ❌ **Tidak Valid** — buka modal untuk mengisi **alasan penolakan** (wajib), lalu set status "Tidak Valid".
  - Preview foto kunjungan.

### Cara Kerja
- `GET /api/pendamping/me` → info pendamping berdasarkan session.
- `GET /api/pendamping/stats` → statistik lingkungan (jumlah keluarga, enumerator, visited, unvisited).
- `GET /api/pendamping/visits` → semua kunjungan di lingkungan (dengan nama enumerator).
- `PUT /api/pendamping/visits/:id/validate` → mengubah status kunjungan (`valid`/`invalid` + alasan).

**File:** `PendampingDashboard.tsx` (rewrite), `server/index.ts`

---

## 5. Jumlah Kunjungan Valid di Tabel Admin

### Perubahan
- Kolom **"Jumlah Kunjungan"** di tabel Kelola Enumerator (halaman Admin) sekarang menampilkan jumlah kunjungan dengan **status "Valid"** saja (bukan total kunjungan).

### Cara Kerja
- `GET /api/enumerators` → diperkaya dengan `validVisitCount` per enumerator (query `visits` WHERE `status='valid'` + `GROUP BY enumeratorId`).

**File:** `server/index.ts`, `EnumeratorPage.tsx`

---

## 6. Verifikasi Registrasi Jemaat oleh Admin

### Perubahan
- **Kolom "Status"** ditambahkan di tabel Data Jemaat (Admin) — menampilkan badge:
  - 🟢 **VALID** — sudah terverifikasi.
  - 🟡 **PENDING** — menunggu verifikasi.
- **Tombol Verifikasi** di kolom Aksi — toggle antara VALIDATED ↔ PENDING dengan konfirmasi dialog.
- Status muncul di **semua tab** tabel (Identitas, Keluarga & Diakonia, Profesi, dll).

### Cara Kerja
- Field `registrationStatus` ditambahkan ke `mapCongregantToMember` (mapping dari `congregants.status`).
- `PUT /api/members/:id/verify` → mengubah status registrasi (`PENDING`/`VALIDATED`) + update `updatedAt`.
- `verifyMutation` ditambahkan ke hook `useMemberData`.

**File:** `server/index.ts`, `useMemberData.ts`, `AdminMemberData.tsx`

---

## 7. Halaman Status — Update Dinamis & Download PDF

### Perubahan
- Halaman `/status` sudah otomatis menampilkan status terkini setelah admin memverifikasi.
- **Tombol "Unduh Bukti Pendaftaran (PDF)"** ditambahkan — jemaat bisa men-download bukti pendaftaran kapan saja.
- **Badge status di PDF dinamis:**
  - 🟢 **"STATUS: TERVALIDASI"** (badge hijau) jika sudah diverifikasi.
  - 🟡 **"STATUS: MENUNGGU VERIFIKASI ADMIN"** (badge kuning) jika belum.
- **Timeline di PDF** juga dinamis — semua step menampilkan dot hijau + timestamp ketika tervalidasi.
- **Timestamp "Tervalidasi & Masuk Database"** ditambahkan di PDF (menampilkan tanggal verifikasi).

### Cara Kerja
- `GET /api/congregants/:id/status` → sekarang juga mengembalikan `ketuaLingkungan` (nama pendamping berdasarkan lingkungan).
- PDF di-generate client-side menggunakan `jsPDF` dengan data real-time dari API.

**File:** `StatusPage.tsx`, `server/index.ts`

---

## 8. Tanda Tangan Ketua Lingkungan di PDF

### Perubahan
- Bagian tanda tangan kanan di PDF ("Mengetahui") sekarang menampilkan:
  - **Nama Ketua Lingkungan** — otomatis diambil dari data pendamping berdasarkan lingkungan jemaat.
  - Label **"Ketua Lingkungan [nomor]"** di bawah nama.
- Berlaku untuk PDF di halaman `/status` maupun saat registrasi awal (SuccessStep).

### Cara Kerja
- `GET /api/pendamping-by-lingkungan/:lingkungan` → endpoint baru untuk lookup nama pendamping berdasarkan lingkungan.
- StatusPage menggunakan `ketuaLingkungan` dari response status API.
- SuccessStep melakukan fetch ke endpoint baru saat generate PDF.

**File:** `StatusPage.tsx`, `SuccessStep.tsx`, `server/index.ts`

---

## Ringkasan File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `server/schema.ts` | Tambah kolom `status` dan `rejectionReason` di tabel `visits` |
| `server/index.ts` | 10+ endpoint baru/dimodifikasi (pendamping, enumerator, visits, verify) |
| `src/App.tsx` | Route baru `/enumerator/visits` |
| `src/hooks/useMemberData.ts` | Tambah `registrationStatus` ke `Member` + `verifyMutation` |
| `src/pages/admin/AdminMemberData.tsx` | Kolom Status + tombol verifikasi |
| `src/pages/admin/EnumeratorPage.tsx` | Kolom kunjungan valid |
| `src/pages/enumerator/EnumeratorDashboard.tsx` | Banner, kartu, form kunjungan + filter rayon |
| `src/pages/enumerator/EnumeratorVisits.tsx` | Halaman baru kelola kunjungan |
| `src/pages/pendamping/PendampingDashboard.tsx` | Rewrite dashboard pendamping |
| `src/pages/StatusPage.tsx` | Download PDF + status dinamis |
| `src/components/form/SuccessStep.tsx` | PDF tanda tangan ketua lingkungan |
| `src/components/layouts/EnumeratorLayout.tsx` | Navigasi baru |