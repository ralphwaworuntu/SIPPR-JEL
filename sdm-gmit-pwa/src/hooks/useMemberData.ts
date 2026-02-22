import { useState, useMemo } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

const safeJSONParse = (data: any) => {
    if (!data) return [];
    if (typeof data !== 'string') return data;
    try {
        return JSON.parse(data);
    } catch {
        if (data.trim() !== '') return [data];
        return [];
    }
};

// Types moved here for reuse
export interface ProfessionalFamilyMember {
    name: string;
    hasProfessionalSkill: string;
    skillType: string;
    skillLevel: string;
    workplace: string;
    position: string;
    yearsExperience: string;
    specificSkills: string[];
    churchServiceInterest: string;
    serviceInterestArea: string;
    contributionForm: string[];
    communityConsent: boolean;
}

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

    // Step 1: Identity extras
    kkNumber?: string;
    nik?: string;
    familyMembers?: number;
    familyMembersMale?: number;
    familyMembersFemale?: number;
    familyMembersOutside?: number;
    familyMembersSidi?: number;
    familyMembersSidiMale?: number;
    familyMembersSidiFemale?: number;
    familyMembersNonBaptized?: number;
    familyMembersNonSidi?: number;

    // Step 2: Diakonia
    diakonia_recipient?: string;
    diakonia_year?: string;
    diakonia_type?: string;

    // Step 3: Professional Family Members
    professionalFamilyMembers?: ProfessionalFamilyMember[];

    // Step 4: Education (Children)
    education_schoolingStatus?: string;
    education_inSchool_tk_paud?: number;
    education_inSchool_sd?: number;
    education_inSchool_smp?: number;
    education_inSchool_sma?: number;
    education_inSchool_university?: number;
    education_dropout_tk_paud?: number;
    education_dropout_sd?: number;
    education_dropout_smp?: number;
    education_dropout_sma?: number;
    education_dropout_university?: number;
    education_unemployed_sd?: number;
    education_unemployed_smp?: number;
    education_unemployed_sma?: number;
    education_unemployed_university?: number;
    education_working?: number;

    // Step 5: Economics
    economics_headOccupation?: string;
    economics_headOccupationOther?: string;
    economics_spouseOccupation?: string;
    economics_spouseOccupationOther?: string;
    economics_incomeRange?: string;
    economics_incomeRangeDetailed?: string;
    economics_expense_food?: number;
    economics_expense_utilities?: number;
    economics_expense_education?: number;
    economics_expense_other?: number;
    economics_hasBusiness?: string;
    economics_businessName?: string;
    economics_businessType?: string;
    economics_businessTypeOther?: string;
    economics_businessDuration?: string;
    economics_businessDurationYears?: number;
    economics_businessStatus?: string;
    economics_businessStatusOther?: string;
    economics_businessLocation?: string;
    economics_businessLocationOther?: string;
    economics_businessEmployeeCount?: string;
    economics_businessCapital?: number;
    economics_businessCapitalSource?: string;
    economics_businessCapitalSourceOther?: string;
    economics_businessPermit?: string[];
    economics_businessPermitOther?: string;
    economics_businessTurnover?: string;
    economics_businessTurnoverValue?: number;
    economics_businessMarketing?: string[];
    economics_businessMarketingOther?: string;
    economics_businessMarketArea?: string;
    economics_businessIssues?: string[];
    economics_businessIssuesOther?: string;
    economics_businessNeeds?: string[];
    economics_businessNeedsOther?: string;
    economics_businessSharing?: string;
    economics_businessTraining?: string[];
    economics_businessTrainingOther?: string;

    // Step 5: Home & Assets
    economics_houseStatus?: string;
    economics_houseType?: string;
    economics_houseIMB?: string;
    economics_hasAssets?: string;
    economics_totalAssets?: number;
    economics_assets?: string[];
    economics_asset_motor_qty?: number;
    economics_asset_mobil_qty?: number;
    economics_asset_kulkas_qty?: number;
    economics_asset_laptop_qty?: number;
    economics_asset_tv_qty?: number;
    economics_asset_internet_qty?: number;
    economics_asset_lahan_qty?: number;
    economics_landStatus?: string;
    economics_waterSource?: string;
    economics_electricity_capacities?: string[];
    economics_electricity_450_qty?: number;
    economics_electricity_900_qty?: number;
    economics_electricity_1200_qty?: number;
    economics_electricity_2200_qty?: number;
    economics_electricity_5000_qty?: number;
    economics_electricity_total_cost?: number;

    // Step 6: Health
    health_sick30Days?: string;
    health_chronicSick?: string;
    health_chronicDisease?: string[];
    health_chronicDiseaseOther?: string;
    health_hasBPJS?: string;
    health_regularTreatment?: string;
    health_hasBPJSKetenagakerjaan?: string;
    health_socialAssistance?: string;
    health_hasDisability?: string;
    health_disabilityPhysical?: string[];
    health_disabilityPhysicalOther?: string;
    health_disabilityIntellectual?: string[];
    health_disabilityIntellectualOther?: string;
    health_disabilityMental?: string[];
    health_disabilityMentalOther?: string;
    health_disabilitySensory?: string[];
    health_disabilitySensoryOther?: string;
    health_disabilityDouble?: boolean;
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

// Data completeness scoring — checks 20 key fields across 6 categories
export const calculateCompleteness = (m: Member): { percent: number; label: string; color: string } => {
    const has = (v: any) => v !== undefined && v !== null && v !== '' && v !== '-' && v !== 0;
    const hasArr = (v: any) => Array.isArray(v) && v.length > 0;
    let filled = 0;
    const total = 20;

    // Identity (5)
    if (has(m.name)) filled++;
    if (has(m.gender)) filled++;
    if (has(m.birthDate)) filled++;
    if (has(m.phone)) filled++;
    if (has(m.address)) filled++;

    // Family (3)
    if (has(m.familyMembers)) filled++;
    if (has(m.kkNumber)) filled++;
    if (has(m.nik)) filled++;

    // Professional (4)
    if (has(m.education)) filled++;
    if (has(m.jobCategory)) filled++;
    if (hasArr(m.skills)) filled++;
    if (has(m.willingnessToServe)) filled++;

    // Education (1)
    if (has(m.education_schoolingStatus)) filled++;

    // Economics (4)
    if (has(m.economics_headOccupation)) filled++;
    if (has(m.economics_incomeRange)) filled++;
    if (has(m.economics_houseStatus)) filled++;

    // Health (3)
    if (has(m.health_sick30Days)) filled++;
    if (has(m.health_hasBPJS)) filled++;
    if (has(m.health_hasDisability)) filled++;

    const percent = Math.round((filled / total) * 100);
    const label = percent >= 80 ? 'Lengkap' : percent >= 50 ? 'Sebagian' : 'Kurang';
    const color = percent >= 80 ? 'green' : percent >= 50 ? 'yellow' : 'red';
    return { percent, label, color };
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
                    : safeJSONParse(m.interestAreas),
                contributionTypes: Array.isArray(m.contributionTypes)
                    ? m.contributionTypes
                    : safeJSONParse(m.contributionTypes),
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
