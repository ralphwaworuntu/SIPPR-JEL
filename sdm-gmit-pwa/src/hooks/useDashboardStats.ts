import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

export interface DashboardStats {
    total: number;
    totalSouls: number;
    totalSidi: number;
    activeSkills: number;
    growth: number;
    professionalCount: number;
    professionalFamilyCount: number;
    volunteerCount: number;
    educationCount: number;
    sick30DaysCount: number;
    regularTreatmentCount: number;
    distributions: {
        gender: Record<string, number>;
        education: Record<string, number>;
        willingness: Record<string, number>;
        lingkungan: Record<string, number>;
        rayon: Record<string, number>;
        diakonia: Record<string, number>;
        assets: Record<string, number>;
        businessTurnover: Record<string, number>;
        businessIssues: Record<string, number>;
        businessTraining: Record<string, number>;
        businessNeeds: Record<string, number>;
        waterSource: Record<string, number>;
        disabilities: Record<string, number>;
        chronics: Record<string, number>;
    };
}

export const useDashboardStats = (rayon: string = 'Semua', lingkungan: string = 'Semua') => {
    return useQuery({
        queryKey: ['dashboard-stats', rayon, lingkungan],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (rayon && rayon !== 'Semua') params.append('rayon', rayon);
            if (lingkungan && lingkungan !== 'Semua') params.append('lingkungan', lingkungan);

            const response = await apiClient.get<DashboardStats>(`/dashboard/stats?${params.toString()}`);
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
