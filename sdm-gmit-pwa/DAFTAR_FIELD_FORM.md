# Daftar Field Form Pemutakhiran Data Jemaat

Berikut adalah daftar lengkap semua data (field) yang dikumpulkan melalui Form Pemutakhiran Data di landing page. Data ini terbagi menjadi beberapa tahapan (Steps):

## Step 1: Identitas (Identity)
- `kkNumber`: Nomor Kartu Keluarga
- `nik`: NIK
- `fullName`: Nama Lengkap Kepala Keluarga
- `gender`: Jenis Kelamin
- `dateOfBirth`: Tanggal Lahir
- `age`: Usia
- `phone`: Nomor Telepon/ WhatsApp Aktif
- `lingkungan`: Lingkungan
- `rayon`: Rayon
- `address`: Alamat Lengkap

## Step 2: Diakonia & Pekerjaan (Diakonia & Professional)
- `diakonia_recipient`: Penerima Diakonia (Ya / Tidak)
- `diakonia_year`: Tahun Menerima Diakonia
- `diakonia_type`: Jenis Diakonia
- `educationLevel`: Tingkat Pendidikan Terakhir
- `major`: Jurusan Pendidikan
- `jobCategory`: Kategori Pekerjaan (KBJI)
- `jobTitle`: Jabatan/Spesialisasi
- `companyName`: Nama Instansi/Perusahaan
- `yearsOfExperience`: Lama Bekerja (Tahun)
- `skills`: Keahlian/Keterampilan Khusus (Array)

## Step 3: Komitmen Pelayanan (Commitment)
- `willingnessToServe`: Kesediaan Melayani (Aktif / On-demand)
- `interestAreas`: Bidang Pelayanan yang Diminati (Array)
- `contributionTypes`: Bentuk Kontribusi (Array)
- `professionalFamilyMembers`: Data Anggota Keluarga Profesional (Array Objek: Nama, Keahlian, Tempat Kerja, dll)

## Step 4: Pendidikan Anak (Education)
- `education_schoolingStatus`: Status Anak Usia Sekolah
- `education_totalInSchool`: Total Anak Masih Sekolah
- `education_inSchool_tk_paud`: Anak Sekolah TK/PAUD
- `education_inSchool_sd`: Anak Sekolah SD
- `education_inSchool_smp`: Anak Sekolah SMP
- `education_inSchool_sma`: Anak Sekolah SMA
- `education_inSchool_university`: Anak Sekolah Perguruan Tinggi
- `education_totalDropout`: Total Anak Putus Sekolah
- `education_dropout_tk_paud`: Putus Sekolah TK/PAUD
- `education_dropout_sd`: Putus Sekolah SD
- `education_dropout_smp`: Putus Sekolah SMP
- `education_dropout_sma`: Putus Sekolah SMA
- `education_dropout_university`: Putus Perguruan Tinggi
- `education_totalUnemployed`: Total Menganggur
- `education_unemployed_sd`: Menganggur Lulusan SD
- `education_unemployed_smp`: Menganggur Lulusan SMP
- `education_unemployed_sma`: Menganggur Lulusan SMA
- `education_unemployed_university`: Menganggur Lulusan Perguruan Tinggi
- `education_working`: Anak Sudah Bekerja

## Step 5: Ekonomi & Aset (Economics)
- `economics_headOccupation`: Pekerjaan Kepala Keluarga
- `economics_headOccupationOther`: Pekerjaan Kepala Keluarga (Lainnya)
- `economics_spouseOccupation`: Pekerjaan Pasangan
- `economics_spouseOccupationOther`: Pekerjaan Pasangan (Lainnya)
- `economics_incomeRange`: Rentang Pendapatan Rata-rata
- `economics_incomeRangeDetailed`: Detail Pendapatan (Bila > 5jt)
- `economics_expense_food`: Pengeluaran Pangan
- `economics_expense_utilities`: Pengeluaran Listrik/Air/Telepon
- `economics_expense_education`: Pengeluaran Pendidikan
- `economics_expense_other`: Pengeluaran Lainnya
- `economics_hasBusiness`: Punya Usaha Sendiri (Ya / Tidak)
- `economics_businessName`: Nama Usaha
- `economics_businessType`: Bidang Usaha
- `economics_businessDuration`: Lama Usaha Berjalan
- `economics_businessStatus`: Status Kepemilikan Usaha
- `economics_businessLocation`: Lokasi Usaha
- `economics_businessEmployeeCount`: Jumlah Tenaga Kerja
- `economics_businessCapital`: Modal Usaha
- `economics_businessCapitalSource`: Sumber Modal
- `economics_businessPermit`: Izin Usaha
- `economics_businessTurnover`: Omset Per Tahun
- `economics_businessMarketing`: Cara Pemasaran
- `economics_businessMarketArea`: Wilayah Pemasaran
- `economics_businessIssues`: Kendala Usaha
- `economics_businessNeeds`: Kebutuhan Pengembangan Usaha
- `economics_businessSharing`: Bersedia Berbagi Ilmu Bisnis
- `economics_businessTraining`: Pelatihan Usaha yg Diinginkan
- `economics_houseStatus`: Status Kepemilikan Rumah
- `economics_houseType`: Jenis Bangunan Rumah
- `economics_houseIMB`: Status IMB
- `economics_hasAssets`: Kepemilikan Aset Barang/Lahan
- `economics_totalAssets`: Estimasi Total Nilai Aset
- `economics_assets`: List Aset yg Dimiliki
- `economics_asset_motor_qty`: Jumlah Motor
- `economics_asset_mobil_qty`: Jumlah Mobil
- `economics_asset_kulkas_qty`: Jumlah Kulkas
- `economics_asset_laptop_qty`: Jumlah Komputer/Laptop
- `economics_asset_tv_qty`: Jumlah TV
- `economics_asset_internet_qty`: Jumlah Sambungan Internet
- `economics_asset_lahan_qty`: Jumlah Lahan Tambahan Bersertifikat
- `economics_landStatus`: Status Lahan Rumah
- `economics_waterSource`: Sumber Air
- `economics_electricity_capacities`: Kapasitas Listrik Terpasang
- `economics_electricity_total_cost`: Pengeluaran Listrik/Bulan

## Step 6: Kesehatan & Disabilitas (Health)
- `health_sick30Days`: Anggota yang Sakit 30 Hari Terakhir
- `health_chronicSick`: Ada yang Menderita Sakit Kronis
- `health_chronicDisease`: Jenis Penyakit Kronis
- `health_hasBPJS`: Kepemilikan JKN/KIS/BPJS Kesehatan
- `health_regularTreatment`: Rutin Berobat & Konsumsi Obat
- `health_hasBPJSKetenagakerjaan`: Kepemilikan Jamsostek/BPJS Ketenagakerjaan
- `health_socialAssistance`: Menerima Bantuan Sosial
- `health_hasDisability`: Anggota Keluarga Disabilitas
- `health_disabilityPhysical`: Disabilitas Fisik
- `health_disabilityIntellectual`: Disabilitas Intelektual
- `health_disabilityMental`: Disabilitas Mental
- `health_disabilitySensory`: Disabilitas Sensorik
- `health_disabilityDouble`: Disabilitas Ganda

## Step 7: Persetujuan (Consent)
- `agreedToPrivacy`: Persetujuan Kebijakan Privasi
- `dataValidated`: Konfirmasi Kebenaran Data
