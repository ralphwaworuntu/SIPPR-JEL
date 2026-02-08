import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

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
            const response = await axios.get('http://localhost:3000/api/notifications', {
                withCredentials: true
            });
            return response.data as Notification[];
        },
        refetchInterval: 10000, // Poll every 10 seconds
    });

    const markAsRead = useMutation({
        mutationFn: async (id: number) => {
            await axios.put(`http://localhost:3000/api/notifications/${id}/read`, {}, {
                withCredentials: true
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    const markAllAsRead = useMutation({
        mutationFn: async () => {
            await axios.post('http://localhost:3000/api/notifications/mark-all-read', {}, {
                withCredentials: true
            });
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
