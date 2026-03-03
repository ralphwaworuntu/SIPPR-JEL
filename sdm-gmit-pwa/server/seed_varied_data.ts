import { db, pool } from "./db";
import { congregants } from "./schema";

async function seed() {
    console.log("Menambahkan 5 data kepala keluarga dengan variasi...");

    const data = [
        // 1. The "Typical Large Family"
        {
            fullName: "Bapak Andreas Manafe",
            gender: "Laki-laki",
            kkNumber: "5371010101010001",
            nik: "5371010101650001",
            dateOfBirth: "1965-05-15",
            phone: "081234567890",
            lingkungan: "Lingkungan 1",
            rayon: "Rayon Timur",
            address: "Jl. WJ Lalamentik No. 10",
            maritalStatus: "Kawin",
            marriageDate: "1990-06-20",
            marriageType: ["Gereja"],
            baptismStatus: "Sudah",
            sidiStatus: "Sudah",
            familyMembers: 5,
            familyMembersMale: 2,
            familyMembersFemale: 3,
            familyMembersSidi: 3,
            educationLevel: "S1",
            major: "Pendidikan",
            jobCategory: "PNS",
            jobTitle: "Guru SMA",
            companyName: "Dinas Pendidikan",
            yearsOfExperience: 25,
            economicsHeadOccupation: "PNS",
            economicsHeadIncomeRange: "Rp 3.000.001 - Rp 5.000.000",
            economicsExpenseFood: 2000000,
            economicsExpenseUtilities: 500000,
            economicsHouseStatus: "Milik Sendiri",
            economicsHouseType: "Permanen",
            economicsAssets: ["Motor", "TV", "Kulkas"],
            economicsAssetMotorQty: 2,
            healthSick30Days: "Tidak",
            healthChronicSick: "Tidak",
            status: "VALIDATED"
        },
        // 2. The "Elderly/Vulnerable Household"
        {
            fullName: "Ibu Maria Benu",
            gender: "Perempuan",
            kkNumber: "5371010101010002",
            nik: "5371010101500001",
            dateOfBirth: "1950-08-10",
            phone: "081345678901",
            lingkungan: "Lingkungan 2",
            rayon: "Rayon Barat",
            address: "Jl. TA Pello No. 5",
            maritalStatus: "Janda/Duda",
            baptismStatus: "Sudah",
            sidiStatus: "Sudah",
            familyMembers: 1,
            familyMembersMale: 0,
            familyMembersFemale: 1,
            diakoniaRecipient: "Ya",
            diakoniaYear: "2023",
            diakoniaType: "Sembako",
            educationLevel: "SD",
            jobCategory: "Tidak Bekerja",
            economicsHeadOccupation: "Pensiunan",
            economicsHeadIncomeRange: "Dibawah Rp 1.000.000",
            economicsExpenseFood: 500000,
            economicsHouseStatus: "Milik Sendiri",
            healthSick30Days: "Ya",
            healthChronicSick: "Ya",
            healthChronicDisease: ["Diabetes", "Hipertensi"],
            healthHasBPJS: "PBI (Gratis)",
            status: "VALIDATED"
        },
        // 3. The "Young Professional & Business Owner"
        {
            fullName: "Johanes Riwu",
            gender: "Laki-laki",
            kkNumber: "5371010101010003",
            nik: "5371010101900001",
            dateOfBirth: "1990-03-25",
            phone: "081122334455",
            lingkungan: "Lingkungan 3",
            rayon: "Rayon Utara",
            address: "Perumahan BTN No. A-12",
            maritalStatus: "Kawin",
            familyMembers: 3,
            educationLevel: "S2",
            major: "Teknik Informatika",
            jobCategory: "Wiraswasta",
            jobTitle: "Founder/CEO",
            companyName: "Tech Kupang",
            economicsHasBusiness: "Ya",
            economicsBusinessName: "Cafe Digital",
            economicsBusinessType: "Kuliner",
            economicsBusinessTurnover: "Rp 10.000.001 - Rp 25.000.000",
            economicsHeadIncomeRange: "Diatas Rp 10.000.000",
            economicsAssets: ["Mobil", "Motor", "Laptop", "Internet"],
            economicsAssetMobilQty: 1,
            economicsAssetLaptopQty: 3,
            willingnessToServe: "Aktif",
            skills: ["Multimedia", "Musik"],
            status: "VALIDATED"
        },
        // 4. The "Struggling Household"
        {
            fullName: "Markus Kase",
            gender: "Laki-laki",
            kkNumber: "5371010101010004",
            nik: "5371010101750001",
            dateOfBirth: "1975-11-12",
            phone: "082123456789",
            lingkungan: "Lingkungan 4",
            rayon: "Rayon Selatan",
            address: "Jl. Skanto No. 45",
            maritalStatus: "Kawin",
            familyMembers: 4,
            educationLevel: "SMA",
            jobCategory: "Buruh",
            jobTitle: "Buruh Bangunan",
            economicsHeadOccupation: "Buruh",
            economicsHeadIncomeRange: "Rp 1.000.001 - Rp 2.000.000",
            economicsExpenseLoan: 300000,
            economicsHouseStatus: "Kontrak/Sewa",
            economicsHouseType: "Semi Permanen",
            healthHasDisability: "Ya",
            healthDisabilityPhysical: ["Tuna Daksa"],
            status: "PENDING"
        },
        // 5. The "Education Focused"
        {
            fullName: "Ribka Tome",
            gender: "Perempuan",
            kkNumber: "5371010101010005",
            nik: "5371010101800001",
            dateOfBirth: "1980-01-01",
            phone: "081987654321",
            lingkungan: "Lingkungan 5",
            rayon: "Rayon Timur",
            address: "Jl. Frans Seda No. 22",
            maritalStatus: "Kawin",
            familyMembers: 6,
            educationLevel: "D3",
            jobCategory: "Pegawai Swasta",
            educationSchoolingStatus: "Ada yang masih sekolah",
            educationTotalInSchool: 3,
            educationInSchoolSd: 1,
            educationInSchoolSmp: 1,
            educationInSchoolUniversity: 1,
            educationHasScholarship: "Ya",
            educationScholarshipType: "Prestasi",
            economicsSpouseOccupation: "Wiraswasta",
            economicsIncomeRange: "Rp 5.000.001 - Rp 10.000.000",
            economicsExpenseEducation: 1500000,
            status: "VALIDATED"
        }
    ];

    for (const item of data) {
        // Handle JSON fields (Drizzle handles them if they are passed as objects/arrays)
        await db.insert(congregants).values(item);
    }

    console.log("5 Data demo jemaat dengan variasi berhasil ditambahkan!");
    pool.end();
}

seed().catch(err => {
    console.error("Terjadi kesalahan saat seeding:", err);
    pool.end();
});
