import { useState, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

// Types moved here for reuse
export interface Member {
    id: string;
    name: string;
    address?: string;
    latitude?: number | null;
    longitude?: number | null;
    phone?: string;
    sector: string;
    lingkungan: string;
    rayon: string;
    education: string;
    educationLevel?: string;
    major?: string;
    job: string;
    jobCategory: string;
    jobTitle?: string;
    companyName?: string;
    yearsOfExperience?: number;
    skills: string[];
    willingnessToServe?: string;
    interestAreas: string[];
    contributionTypes: string[];
    initials: string;
    gender: "Laki-laki" | "Perempuan";
    birthDate: string; // YYYY-MM-DD
    statusGerejawi?: string;
    createdAt: string; // ISO Date String
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
            return response.data.map(m => ({
                ...m,
                skills: Array.isArray(m.skills)
                    ? m.skills
                    : (typeof m.skills === 'string'
                        ? (m.skills as string).split(',').map(s => s.trim()).filter(Boolean)
                        : []),
                interestAreas: Array.isArray(m.interestAreas)
                    ? m.interestAreas
                    : (typeof m.interestAreas === 'string'
                        ? JSON.parse(m.interestAreas)
                        : []),
                contributionTypes: Array.isArray(m.contributionTypes)
                    ? m.contributionTypes
                    : (typeof m.contributionTypes === 'string'
                        ? JSON.parse(m.contributionTypes)
                        : []),
            }));
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
            if (!m) return;
            // Sector
            const sector = m.sector || "Lainnya";
            sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
            if (sectorCounts[sector] > maxCount) {
                maxCount = sectorCounts[sector];
                dominant = sector;
            }

            // Gender
            const gender = m.gender;
            if (gender && genderCounts[gender] !== undefined) {
                genderCounts[gender]++;
            }

            // Education
            const edu = m.education || "Lainnya";
            educationCounts[edu] = (educationCounts[edu] || 0) + 1;

            // Willingness
            if (m.willingnessToServe) {
                const status = m.willingnessToServe === 'Aktif' ? 'Bersedia' : (m.willingnessToServe === 'On-demand' ? 'Ragu-ragu' : 'Tidak');
                willingnessCounts[status]++;
            } else if (m.birthDate) {
                const age = calculateAge(m.birthDate);
                if (age > 17 && age < 60) {
                    willingnessCounts["Bersedia"]++;
                } else if (age >= 60) {
                    willingnessCounts["Tidak"]++;
                } else {
                    willingnessCounts["Ragu-ragu"]++;
                }
            }
        });

        // Calculate Profession/Skill stats
        const professionalCount = members.filter(m => m.education && (m.education.startsWith('S') || m.education === 'D3')).length;
        const skillCount = members.reduce((acc, curr) => acc + (curr.skills?.length || 0), 0);

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

    // Mutations
    const addMutation = useMutation({
        mutationFn: (newMember: Omit<Member, "id">) => apiClient.post('/members', newMember),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: (member: Member) => apiClient.put(`/members/${member.id}`, member),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiClient.delete(`/members/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
        },
    });

    const importMutation = useMutation({
        mutationFn: (formData: FormData) => apiClient.post('/members/import', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        },
    });

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
        isError,
        addMutation,
        updateMutation,
        deleteMutation,
        importMutation
    };
};
