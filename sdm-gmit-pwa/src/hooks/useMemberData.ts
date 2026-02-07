import { useState, useMemo, useEffect } from 'react';
import { toast } from '../components/ui/Toast';

// Types moved here for reuse
export interface Member {
    id: string;
    originalId?: number; // Keep track of DB ID
    name: string;
    phone: string;
    placeOfBirth: string;
    sector: string;
    education: string;
    job: string;
    skills: string[];
    initials: string;
    gender: "Laki-laki" | "Perempuan";
    birthDate: string; // YYYY-MM-DD
    createdAt: string; // ISO Date String
    statusGerejawi: "Sidi" | "Baptis" | "Katekisasi";
    willingnessToServe: boolean;
    status: "PENDING" | "VALIDATED";
}

// Helper to map UI Member to API payload
const mapMemberToPayload = (member: Partial<Member>) => {
    return {
        fullName: member.name,
        gender: member.gender,
        placeOfBirth: member.placeOfBirth,
        dateOfBirth: member.birthDate ? new Date(member.birthDate).toISOString() : undefined,
        // Mocking missing required fields for update if not provided
        phone: member.phone || "0000000000",
        address: "Alamat tidak tersedia",
        sector: member.sector,
        educationLevel: member.education,
        jobCategory: member.job,
        skills: member.skills,
        willingnessToServe: member.willingnessToServe,
        statusGerejawi: member.statusGerejawi
    };
};

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



export const useMemberData = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/congregants');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();

            // Map DB data to Member interface
            const mappedMembers: Member[] = data.map((item: any) => ({
                id: `M-${String(item.id).padStart(5, '0')}`,
                originalId: item.id,
                name: item.fullName,
                phone: item.phone || "-",
                placeOfBirth: item.placeOfBirth || "-",
                sector: item.sector || "Unassigned",
                education: item.educationLevel || "-",
                job: item.jobCategory || "-",
                skills: typeof item.skills === 'string' ? JSON.parse(item.skills) : (Array.isArray(item.skills) ? item.skills : []),
                initials: item.fullName ? item.fullName.substring(0, 2).toUpperCase() : "XX",
                gender: item.gender || "Laki-laki",
                birthDate: item.dateOfBirth ? new Date(item.dateOfBirth).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                createdAt: item.createdAt,
                statusGerejawi: item.statusGerejawi || "Sidi",
                willingnessToServe: Boolean(item.willingnessToServe),
                status: item.status || "PENDING"
            }));

            setMembers(mappedMembers);
        } catch (error) {
            console.error("Error fetching members:", error);
            // Fallback to empty array and show error
            toast.error("Gagal mengambil data dari server. Pastikan server backend berjalan.");
            setMembers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const addMember = async (newMemberData: any) => {
        try {
            const response = await fetch('/api/congregants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMemberData) // Ensure payload matches schema
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menambah anggota');
            }
            toast.success("Anggota berhasil ditambahkan");
            fetchMembers(); // Refresh data
            return true;
        } catch (error: any) {
            console.error("Error adding member:", error);
            toast.error(error.message);
            return false;
        }
    };

    const updateMember = async (id: string, updatedData: Partial<Member>) => {
        try {
            // Try to find original ID from members list if possible, or parse
            const member = members.find(m => m.id === id);
            const dbId = member?.originalId || parseInt(id.replace('M-', ''));

            if (isNaN(dbId)) {
                throw new Error("Invalid Member ID");
            }

            const payload = mapMemberToPayload(updatedData);

            const response = await fetch(`/api/congregants/${dbId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal update anggota');
            }

            toast.success("Data berhasil diperbarui");
            fetchMembers();
            return true;
        } catch (error: any) {
            console.error("Error updating member:", error);
            toast.error(error.message || "Gagal update anggota");
            return false;
        }
    };

    const deleteMember = async (id: string) => {
        try {
            const member = members.find(m => m.id === id);
            const dbId = member?.originalId || parseInt(id.replace('M-', ''));

            if (isNaN(dbId)) {
                throw new Error("Invalid Member ID");
            }

            const response = await fetch(`/api/congregants/${dbId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menghapus anggota');
            }

            toast.success("Anggota berhasil dihapus");
            fetchMembers();
            return true;
        } catch (error: any) {
            console.error("Error deleting member:", error);
            toast.error(error.message || "Gagal menghapus anggota");
            return false;
        }
    };

    useEffect(() => {
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

            // Willingness
            if (m.willingnessToServe) {
                willingnessCounts["Bersedia"]++;
            } else {
                willingnessCounts["Tidak"]++;
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
        isLoading,
        addMember, updateMember, deleteMember, refreshMembers: fetchMembers
    };
};
