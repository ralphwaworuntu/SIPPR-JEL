import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
export interface Notification {
    id: number;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success';
    isRead: boolean;
    createdAt: string;
}

export const useNotifications = () => {
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const response = await apiClient.get('/notifications');
            return response.data as Notification[];
        },
        refetchInterval: 10000, // Poll every 10 seconds
    });

    const markAsRead = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.put(`/notifications/${id}/read`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const markAllAsRead = useMutation({
        mutationFn: async () => {
            await apiClient.post('/notifications/mark-all-read');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return {
        notifications,
        isLoading,
        unreadCount,
        markAsRead: markAsRead.mutate,
        markAllAsRead: markAllAsRead.mutate
    };
};
