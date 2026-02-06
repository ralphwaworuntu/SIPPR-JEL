import { useState, useMemo, useEffect } from 'react';

// Types moved here for reuse
export interface Member {
    id: string;
    name: string;
    sector: string;
    education: string;
    job: string;
    skills: string[];
    initials: string;
    gender: "Laki-laki" | "Perempuan";
    birthDate: string; // YYYY-MM-DD
    createdAt: string; // ISO Date String
    statusGerejawi: "Sidi" | "Baptis" | "Katekisasi";
}

export const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

export const getAgeCategory = (age: number) => {
    if (age <= 12) return "Anak";
    if (age <= 17) return "Remaja";
    if (age <= 30) return "Pemuda";
    if (age <= 60) return "Dewasa";
    return "Lansia";
};

// Initial MOCK DATA
const MOCK_MEMBERS: Member[] = [
    { name: "John Doe", id: "M-00245", sector: "Efata", education: "S2", job: "Senior Developer", skills: ["Python", "SQL"], initials: "JD", gender: "Laki-laki", birthDate: "1985-05-15", createdAt: "2023-01-15T08:00:00Z", statusGerejawi: "Sidi" },
    { name: "Jane Smith", id: "M-00289", sector: "Betel", education: "S1", job: "Perawat", skills: ["P3K", "Anak"], initials: "JS", gender: "Perempuan", birthDate: "1992-10-20", createdAt: "2023-03-10T09:30:00Z", statusGerejawi: "Sidi" },
    { name: "Robert King", id: "M-00312", sector: "Sion", education: "D3", job: "Wiraswasta", skills: ["Manajemen", "Pemasaran"], initials: "RK", gender: "Laki-laki", birthDate: "1978-02-12", createdAt: "2023-05-20T14:15:00Z", statusGerejawi: "Baptis" },
    { name: "Alice Wong", id: "M-00105", sector: "Eden", education: "S3", job: "Dosen", skills: ["Penelitian", "Publikasi"], initials: "AW", gender: "Perempuan", birthDate: "1980-08-30", createdAt: "2023-06-05T11:00:00Z", statusGerejawi: "Sidi" },
    { name: "Charlie Brown", id: "M-00441", sector: "Efata", education: "SMA", job: "Pelajar", skills: ["Musik"], initials: "CB", gender: "Laki-laki", birthDate: "2008-01-10", createdAt: "2024-01-12T16:45:00Z", statusGerejawi: "Katekisasi" },
    { name: "Sarah Connor", id: "M-00555", sector: "Betel", education: "S1", job: "Wirausaha", skills: ["Cooking", "Management"], initials: "SC", gender: "Perempuan", birthDate: "1995-03-12", createdAt: "2024-02-28T10:20:00Z", statusGerejawi: "Sidi" },
    { name: "Michael Jordan", id: "M-00230", sector: "Sion", education: "S1", job: "Atlet", skills: ["Basket", "Olahraga"], initials: "MJ", gender: "Laki-laki", birthDate: "1988-02-17", createdAt: "2024-04-15T13:10:00Z", statusGerejawi: "Sidi" },
    { name: "Emily Blunt", id: "M-00111", sector: "Eden", education: "S2", job: "Aktris", skills: ["Akting", "Menyanyi"], initials: "EB", gender: "Perempuan", birthDate: "1983-02-23", createdAt: "2025-01-05T09:00:00Z", statusGerejawi: "Sidi" },
    { name: "Tom Holland", id: "M-00777", sector: "Efata", education: "SMA", job: "Aktor", skills: ["Akting", "Gymnastic"], initials: "TH", gender: "Laki-laki", birthDate: "1996-06-01", createdAt: "2025-03-20T15:30:00Z", statusGerejawi: "Sidi" },
    { name: "Zendaya", id: "M-00888", sector: "Betel", education: "SMA", job: "Aktris", skills: ["Akting", "Menyanyi", "Modeling"], initials: "Z", gender: "Perempuan", birthDate: "1996-09-01", createdAt: "2025-03-22T10:00:00Z", statusGerejawi: "Sidi" },
    { name: "Grandpa Joe", id: "M-00999", sector: "Sion", education: "SD", job: "Pensiunan", skills: ["Berkebun"], initials: "GJ", gender: "Laki-laki", birthDate: "1950-01-01", createdAt: "2025-05-18T08:45:00Z", statusGerejawi: "Sidi" },
    { name: "Baby Shark", id: "M-00123", sector: "Eden", education: "TK", job: "Balita", skills: ["Main", "Tidur"], initials: "BS", gender: "Laki-laki", birthDate: "2022-01-01", createdAt: "2025-06-01T07:15:00Z", statusGerejawi: "Baptis" }
];

export const useMemberData = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch('/api/congregants');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();

                // Map DB data to Member interface
                const mappedMembers: Member[] = data.map((item: any) => ({
                    id: `M-${String(item.id).padStart(5, '0')}`,
                    name: item.fullName,
                    sector: item.sector || "Unassigned",
                    education: item.educationLevel || "-",
                    job: item.jobCategory || "-",
                    skills: Array.isArray(item.skills) ? item.skills : [],
                    initials: item.fullName ? item.fullName.substring(0, 2).toUpperCase() : "XX",
                    gender: item.gender || "Laki-laki",
                    birthDate: item.dateOfBirth ? new Date(item.dateOfBirth).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    createdAt: item.createdAt,
                    statusGerejawi: "Sidi" // Defaulting as discussed
                }));

                setMembers(mappedMembers);
            } catch (error) {
                console.error("Error fetching members:", error);
                // Fallback to mock data or empty? Let's use mock if empty for demo purposes or empty
                setMembers(MOCK_MEMBERS); // Keep mock as fallback or remove if strictly real data
            } finally {
                setIsLoading(false);
            }
        };

        fetchMembers();
    }, []);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterSector, setFilterSector] = useState("Semua");
    const [filterGender, setFilterGender] = useState("Semua");
    const [filterAgeCategory, setFilterAgeCategory] = useState("Semua");
    const [filterStatus, setFilterStatus] = useState("Semua");

    const [sortConfig, setSortConfig] = useState<{ key: keyof Member | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

    // Derived Logic
    const filteredMembers = useMemo(() => {
        let result = [...members];

        // 1. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(m =>
                m.name.toLowerCase().includes(lowerTerm) ||
                m.id.toLowerCase().includes(lowerTerm) ||
                m.job.toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Sector
        if (filterSector !== "Semua") {
            result = result.filter(m => m.sector === filterSector);
        }

        // 3. Gender
        if (filterGender !== "Semua") {
            result = result.filter(m => m.gender === filterGender);
        }

        // 4. Age Category
        if (filterAgeCategory !== "Semua") {
            result = result.filter(m => {
                const age = calculateAge(m.birthDate);
                const category = getAgeCategory(age);
                return category === filterAgeCategory;
            });
        }

        // 5. Status Gerejawi
        if (filterStatus !== "Semua") {
            result = result.filter(m => m.statusGerejawi === filterStatus);
        }

        // 6. Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                // @ts-ignore
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                // @ts-ignore
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return result;
    }, [members, searchTerm, filterSector, filterGender, filterAgeCategory, filterStatus, sortConfig]);

    const handleSort = (key: keyof Member) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Stats
    const stats = useMemo(() => {
        // Simple Counters
        const sectorCounts: Record<string, number> = {};
        const genderCounts: Record<string, number> = { "Laki-laki": 0, "Perempuan": 0 };
        const educationCounts: Record<string, number> = {};
        const willingnessCounts: Record<string, number> = { "Bersedia": 0, "Ragu-ragu": 0, "Tidak": 0 };

        let maxCount = 0;
        let dominant = "-";

        members.forEach(m => {
            // Sector
            sectorCounts[m.sector] = (sectorCounts[m.sector] || 0) + 1;
            if (sectorCounts[m.sector] > maxCount) {
                maxCount = sectorCounts[m.sector];
                dominant = m.sector;
            }

            // Gender
            if (genderCounts[m.gender] !== undefined) {
                genderCounts[m.gender]++;
            }

            // Education
            educationCounts[m.education] = (educationCounts[m.education] || 0) + 1;

            // Willingness (Mock logic based on age/status for now as field doesn't exist)
            // In real app, this would be a field in Member interface
            const age = calculateAge(m.birthDate);
            if (m.statusGerejawi === "Sidi" && age > 17 && age < 60) {
                willingnessCounts["Bersedia"]++;
            } else if (age > 60) {
                willingnessCounts["Tidak"]++;
            } else {
                willingnessCounts["Ragu-ragu"]++;
            }
        });

        // Calculate Profession/Skill stats
        const professionalCount = members.filter(m => m.education.startsWith('S') || m.education === 'D3').length;
        const skillCount = members.reduce((acc, curr) => acc + curr.skills.length, 0);

        return {
            total: members.length,
            sectorDominant: dominant,
            activeSkills: skillCount,
            growth: 12, // Mock growth for now
            professionalCount,
            volunteerCount: willingnessCounts["Bersedia"],
            distributions: {
                sector: sectorCounts,
                gender: genderCounts,
                education: educationCounts,
                willingness: willingnessCounts
            }
        };
    }, [members]);

    return {
        members,
        setMembers,
        filteredMembers,
        searchTerm, setSearchTerm,
        filterSector, setFilterSector,
        filterGender, setFilterGender,
        filterAgeCategory, setFilterAgeCategory,
        filterStatus, setFilterStatus,
        sortConfig, handleSort,
        stats,
        isLoading
    };
};
