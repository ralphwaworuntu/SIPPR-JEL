import { db, pool } from "./db";
import { congregants } from "./schema";

async function seed() {
    console.log("Menghapus data lama jika ada...");
    // await db.delete(congregants); // Opsional: hapus dulu

    console.log("Menambahkan 20 data demo...");

    for (let i = 0; i < 20; i++) {
        const isMale = Math.random() > 0.5;
        const firstName = isMale ? ["Andreas", "Johanes", "Markus", "Matius", "Lukas"][Math.floor(Math.random() * 5)] : ["Maria", "Marta", "Ribka", "Sara", "Ester"][Math.floor(Math.random() * 5)];
        const lastName = ["Tome", "Manafe", "Lopo", "Kase", "Benu", "Bussi", "Riwu", "Kolo"][Math.floor(Math.random() * 8)];

        await db.insert(congregants).values({
            fullName: `${firstName} ${lastName}`,
            gender: isMale ? "Laki-laki" : "Perempuan",
            dateOfBirth: new Date(1960 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString().split('T')[0],
            phone: "0812" + Math.floor(Math.random() * 100000000).toString().padStart(8, '0'),
            lingkungan: `Lingkungan ${Math.floor(Math.random() * 5) + 1}`,
            rayon: `Rayon ${['Timur', 'Selatan', 'Barat', 'Utara'][Math.floor(Math.random() * 4)]}`,
            address: `Jalan ${['W.J Lementik', 'T.A. Pello', 'Skanto', 'Frans Seda'][Math.floor(Math.random() * 4)]} No. ${Math.floor(Math.random() * 100)}`,
            educationLevel: ["S1", "S2", "SMA", "D3", "S3"][Math.floor(Math.random() * 5)],
            major: ["Teologi", "Pendidikan Agama Kristen", "Hukum", "Kehutanan", "Peternakan", "Kesehatan"][Math.floor(Math.random() * 6)],
            jobCategory: ["Ahli", "Pendeta", "Guru", "Wiraswasta", "PNS", "Pegawai Swasta"][Math.floor(Math.random() * 6)],
            jobTitle: ["Staf Ahli", "Kepala Seksi", "Pengajar", "Pengusaha", "Dokter"][Math.floor(Math.random() * 5)],
            companyName: "Instansi " + ["Pemerintah Provinsi", "Pemerintah Kota", "Swasta A", "Swasta B", "Klinik"][Math.floor(Math.random() * 5)],
            yearsOfExperience: Math.floor(Math.random() * 25),
            skills: ["Mengajar", "Bermain Musik", "Penyuluhan", "Khotbah", "Bina Anak"].slice(0, Math.floor(Math.random() * 3) + 1),
            willingnessToServe: ["Aktif", "On-demand", "Not-available"][Math.floor(Math.random() * 3)],
            interestAreas: ["Pelayanan Kaum Bapak", "Pelayanan Perempuan", "Pemuda", "Anak SM"][Math.floor(Math.random() * 4)],
            contributionTypes: ["Berkhotbah", "Sumbangan Material", "Pikirk Tenaga"].slice(0, Math.floor(Math.random() * 3) + 1),
            status: ["PENDING", "VALIDATED"][Math.floor(Math.random() * 2)]
        });
    }
    console.log("20 Data demo jemaat (Congregants) berhasil ditambahkan!");
    pool.end();
}

seed().catch(err => {
    console.error("Terjadi kesalahan:", err);
    pool.end();
});
