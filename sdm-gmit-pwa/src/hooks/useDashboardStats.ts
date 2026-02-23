import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

export interface DashboardStats {
    total: number;
    totalSouls: number;
    totalSidi: number;
    sectorDominant: string;
    activeSkills: number;
    growth: number;
    professionalCount: number;
    professionalFamilyCount: number;
    volunteerCount: number;
    distributions: {
        sector: Record<string, number>;
        gender: Record<string, number>;
        education: Record<string, number>;
        willingness: Record<string, number>;
        lingkungan: Record<string, number>;
        rayon: Record<string, number>;
    };
}

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const response = await apiClient.get<DashboardStats>('/dashboard/stats');
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
