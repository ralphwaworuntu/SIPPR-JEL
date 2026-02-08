import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
    avatar: string | null;
}

interface Notifications {
    email: boolean;
    browser: boolean;
    news: boolean;
    securityAlerts: boolean;
}

interface Security {
    twoFactor: boolean;
    sessionTimeout: boolean;
}

interface AppearanceSettings {
    accentColor: string;
    accentColorRgb: string;
    compactMode: boolean;
}

interface BroadcastItem {
    id: string;
    target: string;
    title: string;
    message: string;
    date: string;
}

const ACCENT_COLORS: Record<string, { hex: string; rgb: string }> = {
    gold: { hex: '#FFD700', rgb: '255, 215, 0' },
    blue: { hex: '#3B82F6', rgb: '59, 130, 246' },
    purple: { hex: '#8B5CF6', rgb: '139, 92, 246' },
    rose: { hex: '#F43F5E', rgb: '244, 63, 94' },
    emerald: { hex: '#10B981', rgb: '16, 185, 129' },
};

const DEFAULT_PROFILE: UserProfile = {
    firstName: 'Admin',
    lastName: 'Gereja',
    email: 'admin@gmitemaus.org',
    bio: 'Administrator sistem informasi database jemaat.',
    avatar: null
};

const DEFAULT_NOTIFICATIONS: Notifications = {
    email: true,
    browser: false,
    news: true,
    securityAlerts: true
};

const DEFAULT_SECURITY: Security = {
    twoFactor: false,
    sessionTimeout: true
};

const DEFAULT_APPEARANCE: AppearanceSettings = {
    accentColor: 'gold',
    accentColorRgb: '255, 215, 0',
    compactMode: false
};

export const useSettings = () => {
    // 1. Theme Management
    const [theme, setThemeState] = useState<Theme>(() => {
        return (localStorage.getItem('app_theme') as Theme) || 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
        localStorage.setItem('app_theme', theme);
    }, [theme]);

    const setTheme = (newTheme: Theme) => setThemeState(newTheme);

    // 2. Profile Management
    const [profile, setProfileState] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('app_profile');
        if (!saved) return DEFAULT_PROFILE;
        try {
            const parsed = JSON.parse(saved);
            return parsed || DEFAULT_PROFILE;
        } catch (e) {
            console.error("Failed to parse app_profile from localStorage", e);
            return DEFAULT_PROFILE;
        }
    });

    const updateProfile = (newProfile: Partial<UserProfile>) => {
        const updated = { ...profile, ...newProfile };
        setProfileState(updated);
        localStorage.setItem('app_profile', JSON.stringify(updated));
    };

    // 3. Notification Management
    const [notifications, setNotificationsState] = useState<Notifications>(() => {
        const saved = localStorage.getItem('app_notifications');
        if (!saved) return DEFAULT_NOTIFICATIONS;
        try {
            const parsed = JSON.parse(saved);
            return parsed || DEFAULT_NOTIFICATIONS;
        } catch (e) {
            console.error("Failed to parse app_notifications from localStorage", e);
            return DEFAULT_NOTIFICATIONS;
        }
    });

    const updateNotifications = (newNotifs: Notifications) => {
        setNotificationsState(newNotifs);
        localStorage.setItem('app_notifications', JSON.stringify(newNotifs));
    };

    // 4. Security Management
    const [security, setSecurityState] = useState<Security>(() => {
        const saved = localStorage.getItem('app_security');
        if (!saved) return DEFAULT_SECURITY;
        try {
            const parsed = JSON.parse(saved);
            return parsed || DEFAULT_SECURITY;
        } catch (e) {
            console.error("Failed to parse app_security from localStorage", e);
            return DEFAULT_SECURITY;
        }
    });

    const updateSecurity = (newSecurity: Security) => {
        setSecurityState(newSecurity);
        localStorage.setItem('app_security', JSON.stringify(newSecurity));
    };

    // 5. Appearance Management (NEW)
    const [appearance, setAppearanceState] = useState<AppearanceSettings>(() => {
        const saved = localStorage.getItem('app_appearance');
        if (!saved) return DEFAULT_APPEARANCE;
        try {
            const parsed = JSON.parse(saved);
            return parsed || DEFAULT_APPEARANCE;
        } catch (e) {
            console.error("Failed to parse app_appearance from localStorage", e);
            return DEFAULT_APPEARANCE;
        }
    });

    // Apply accent color to CSS variable
    useEffect(() => {
        const colorData = ACCENT_COLORS[appearance.accentColor] || ACCENT_COLORS.gold;
        document.documentElement.style.setProperty('--accent-color', colorData.hex);
        document.documentElement.style.setProperty('--accent-color-rgb', colorData.rgb);
    }, [appearance.accentColor]);

    const updateAppearance = (newAppearance: Partial<AppearanceSettings>) => {
        const updated = { ...appearance, ...newAppearance };
        setAppearanceState(updated);
        localStorage.setItem('app_appearance', JSON.stringify(updated));
    };

    // 6. Broadcast History Management (NEW)
    const [broadcastHistory, setBroadcastHistoryState] = useState<BroadcastItem[]>(() => {
        const saved = localStorage.getItem('broadcast_history');
        if (!saved) return [];
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse broadcast_history from localStorage", e);
            return [];
        }
    });

    const addBroadcast = (item: Omit<BroadcastItem, 'id' | 'date'>) => {
        const newItem: BroadcastItem = {
            ...item,
            id: crypto.randomUUID(),
            date: new Date().toISOString()
        };
        const updated = [newItem, ...broadcastHistory];
        setBroadcastHistoryState(updated);
        localStorage.setItem('broadcast_history', JSON.stringify(updated));
    };

    const deleteBroadcast = (id: string) => {
        const updated = broadcastHistory.filter(item => item.id !== id);
        setBroadcastHistoryState(updated);
        localStorage.setItem('broadcast_history', JSON.stringify(updated));
    };

    const clearBroadcastHistory = () => {
        setBroadcastHistoryState([]);
        localStorage.removeItem('broadcast_history');
    };

    return {
        theme,
        setTheme,
        profile,
        updateProfile,
        notifications,
        updateNotifications,
        security,
        updateSecurity,
        appearance,
        updateAppearance,
        accentColors: ACCENT_COLORS,
        broadcastHistory,
        addBroadcast,
        deleteBroadcast,
        clearBroadcastHistory
    };
};

