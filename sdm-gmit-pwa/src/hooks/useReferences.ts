import { useState, useEffect } from 'react';

export interface References {
    sectors: string[];
    categories: string[];
    lingkungan: string[];
    rayons: string[];
    jobCategories: string[];
    educationLevels: string[];
    statusGerejawi: string[];
    gender: string[];
    interestAreas: string[];
    contributionTypes: string[];
    willingnessToServe: string[];
}

// Initial empty state matching the interface
const INITIAL_REFERENCES: References = {
    sectors: [],
    categories: [],
    lingkungan: [],
    rayons: [],
    jobCategories: [],
    educationLevels: [],
    statusGerejawi: [],
    gender: [],
    interestAreas: [],
    contributionTypes: [],
    willingnessToServe: []
};

export const useReferences = () => {
    const [references, setReferences] = useState<References>(INITIAL_REFERENCES);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReferences = async () => {
            try {
                // In development, might need full URL if proxy isn't set, but usually vite proxy handles /api
                const response = await fetch('/api/references');
                if (!response.ok) {
                    throw new Error('Failed to fetch references');
                }
                const data = await response.json();
                setReferences(data);
            } catch (err) {
                console.error("Error fetching reference data:", err);
                setError("Gagal memuat data referensi.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReferences();
    }, []);

    return { references, isLoading, error };
};
