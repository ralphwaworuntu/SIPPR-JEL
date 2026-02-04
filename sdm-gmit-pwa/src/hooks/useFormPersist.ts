import { useEffect, useState } from 'react';

/**
 * Hook to persist form data to localStorage.
 * 
 * @param key LocalStorage key
 * @param data Current form data
 * @param onLoad Callback when data is loaded from storage
 */
export const useFormPersist = <T>(key: string, data: T, onLoad: (data: T) => void) => {
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Save to localStorage when data changes
    useEffect(() => {
        setIsSaving(true);
        const timeoutId = setTimeout(() => {
            localStorage.setItem(key, JSON.stringify(data));
            setLastSaved(new Date());
            setIsSaving(false);
        }, 800); // Slightly longer debounce to show "Saving..." state

        return () => clearTimeout(timeoutId);
    }, [key, data]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && typeof parsed === 'object') {
                    console.log('Restoring form data from draft...');
                    onLoad(parsed);
                    setLastSaved(new Date());
                }
            } catch (e) {
                console.error("Failed to parse saved draft", e);
            }
        }
    }, [key]);

    return { isSaving, lastSaved };
};
