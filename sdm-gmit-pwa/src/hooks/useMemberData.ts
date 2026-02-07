import { useState, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

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

export const useMemberData = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSector, setFilterSector] = useState("Semua");
    const [filterGender, setFilterGender] = useState("Semua");
    const [filterAgeCategory, setFilterAgeCategory] = useState("Semua");
    const [filterStatus, setFilterStatus] = useState("Semua");

    const [sortConfig, setSortConfig] = useState<{ key: keyof Member | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

    // Fetch Data from API
    const { data: rawMembers = [], isLoading, isError } = useQuery({
        queryKey: ['members', { searchTerm, filterSector, filterGender, filterAgeCategory, filterStatus }],
        queryFn: async () => {
            const params: Record<string, any> = {};
            if (searchTerm) params.search = searchTerm;
            if (filterSector !== "Semua") params.sector = filterSector;
            if (filterGender !== "Semua") params.gender = filterGender;
            if (filterAgeCategory !== "Semua") params.ageCategory = filterAgeCategory;
            if (filterStatus !== "Semua") params.status = filterStatus;

            const response = await apiClient.get<Member[]>('/members', { params });
            return response.data;
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });

    const setMembers = (action: Member[] | ((prev: Member[]) => Member[])) => {
        const queryKey = ['members', { searchTerm, filterSector, filterGender, filterAgeCategory, filterStatus }];
        queryClient.setQueryData(queryKey, (oldData: Member[] | undefined) => {
            const current = oldData || [];
            return typeof action === 'function' ? action(current) : action;
        });
    };

    // Client-side Sorting (Optional: can be moved to backend too, but keeping here for responsiveness)
    const members = useMemo(() => {
        let result = [...rawMembers];
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
    }, [rawMembers, sortConfig]);

    const handleSort = (key: keyof Member) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Stats Calculation (based on the currently fetched/filtered data)
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
            growth: 12, // Placeholder
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
        filteredMembers: members, // Alias for compatibility
        searchTerm, setSearchTerm,
        filterSector, setFilterSector,
        filterGender, setFilterGender,
        filterAgeCategory, setFilterAgeCategory,
        filterStatus, setFilterStatus,
        sortConfig, handleSort,
        stats,
        isLoading,
        isError
    };
};
