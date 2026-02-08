# Panduan Menjalankan Project Secara Lokal

Project ini terdiri dari dua bagian: **Backend (Server)** dan **Frontend (Client)**. Keduanya harus dijalankan agar aplikasi bekerja dengan baik.

## 1. Persiapan Awal (Prerequisites)

Pastikan Anda memiliki:
- **Node.js** terinstal.
- **MySQL** terinstal dan berjalan.
- **Git** (opsional, untuk clone).

## 2. Setup Backend (Server)

Backend menangani database dan API.

1.  Buka terminal baru.
2.  Masuk ke folder server:
    ```bash
    cd server
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Cek konfigurasi database di file `.env`. Pastikan username dan password MySQL sesuai dengan komputer Anda. Defaultnya:
    ```env
    DATABASE_URL=mysql://root:@localhost:3306/sdm_gmit
    ```
    *(Jika MySQL Anda menggunakan password, ubah `root:@localhost` menjadi `root:password_anda@localhost`)*
5.  Buat Database:
    ```bash
    npx tsx create_db.ts
    ```
6.  Buat Tabel (Migrasi Awal):
    ```bash
    npx tsx init_db.ts
    ```
7.  Jalankan Server:
    ```bash
    npm run dev
    ```
    Server akan berjalan di `http://localhost:3000`.

## 3. Setup Frontend (Client)

Frontend adalah tampilan aplikasi yang Anda lihat di browser.

1.  Buka terminal **baru** (biarkan terminal server tetap berjalan).
2.  Pastikan berada di folder root project (`sdm-gmit-pwa`).
3.  Install dependencies (jika belum):
    ```bash
    npm install
    ```
4.  Jalankan Frontend:
    ```bash
    npm run dev
    ```
5.  Akses aplikasi di browser melalui URL yang muncul (biasanya `http://localhost:5173`).

## 4. Setup Akun Admin

Untuk login pertama kali, Anda perlu membuat akun admin default.

1.  Pastikan Backend dan Frontend sudah berjalan.
2.  Buka browser dan akses: `http://localhost:5173/seed-user`
3.  Klik tombol **"Create Admin User"**.
4.  Jika sukses, status akan berubah menjadi "User created!".
5.  Sekarang akses halaman login: `http://localhost:5173/login`
6.  Gunakan kredensial berikut:
    - **Email**: `admin@gmitemaus.org`
    - **Password**: `admin123`

## Catatan
- Jika terjadi error koneksi database, pastikan MySQL service sudah Start (misal lewat XAMPP atau Services).
- Pastikan port 3000 (server) dan 5173 (client) tidak sedang digunakan aplikasi lain.
