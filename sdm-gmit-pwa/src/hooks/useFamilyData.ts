import { useState, useMemo } from 'react';

export interface Family {
    id: string; // No. KK
    head: string; // Kepala Keluarga
    address: string;
    sector: string;
    members: number; // Count of members
    status: "Aktif" | "Pindah" | "Non-Aktif";
    lastVisit: string; // Date string or "Belum pernah"
    createdAt: string; // ISO String
}

const MOCK_FAMILIES: Family[] = [
    { id: "53001002001", head: "Bpk. Thomas Anderson", address: "Jl. Mawar No. 12", sector: "Efata", members: 4, status: "Aktif", lastVisit: "12 Jan 2024", createdAt: "2023-01-01T00:00:00Z" },
    { id: "53001002002", head: "Ibu Sarah Connor", address: "Jl. Melati Blok B", sector: "Betel", members: 3, status: "Aktif", lastVisit: "02 Feb 2024", createdAt: "2023-02-15T00:00:00Z" },
    { id: "53001002003", head: "Bpk. John Wick", address: "Perumahan Damai Indah, No. 88", sector: "Sion", members: 1, status: "Pindah", lastVisit: "10 Dec 2023", createdAt: "2023-03-20T00:00:00Z" },
    { id: "53001002004", head: "Kel. Peter Parker", address: "Jl. Jaring Laba-laba, No. 20", sector: "Eden", members: 2, status: "Aktif", lastVisit: "28 Jan 2024", createdAt: "2023-04-10T00:00:00Z" },
    { id: "53001002005", head: "Bpk. Tony Stark", address: "Jl. Teknologi No. 1", sector: "Efata", members: 5, status: "Aktif", lastVisit: "15 Mar 2024", createdAt: "2023-05-01T00:00:00Z" },
    { id: "53001002006", head: "Bpk. Steve Rogers", address: "Jl. Pahlawan No. 45", sector: "Betel", members: 1, status: "Aktif", lastVisit: "Belum pernah", createdAt: "2023-06-01T00:00:00Z" },
    { id: "53001002007", head: "Bpk. Bruce Banner", address: "Jl. Hijau No. 7", sector: "Sion", members: 3, status: "Non-Aktif", lastVisit: "01 Jan 2024", createdAt: "2023-07-01T00:00:00Z" },
    { id: "53001002008", head: "Bpk. Thor Odinson", address: "Jl. Asgard No. 9", sector: "Eden", members: 4, status: "Aktif", lastVisit: "20 Feb 2024", createdAt: "2023-08-01T00:00:00Z" },
];

export const useFamilyData = () => {
    const [families, setFamilies] = useState<Family[]>(MOCK_FAMILIES);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterSector, setFilterSector] = useState("Semua");
    const [filterStatus, setFilterStatus] = useState("Semua");
    const [filterMinMembers, setFilterMinMembers] = useState<number>(0);
    const [sortConfig, setSortConfig] = useState<{ key: keyof Family | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });

    const filteredFamilies = useMemo(() => {
        let result = [...families];

        // 1. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(f =>
                f.head.toLowerCase().includes(lowerTerm) ||
                f.id.includes(lowerTerm) ||
                f.address.toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Filter Sector
        if (filterSector !== "Semua") {
            result = result.filter(f => f.sector === filterSector);
        }

        // 3. Filter Status
        if (filterStatus !== "Semua") {
            result = result.filter(f => f.status === filterStatus);
        }

        // 4. Min Members Filter
        if (filterMinMembers > 0) {
            result = result.filter(f => f.members >= filterMinMembers);
        }

        // 4. Sort
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
        return result;
    }, [families, searchTerm, filterSector, filterStatus, filterMinMembers, sortConfig]);

    const handleSort = (key: keyof Family) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const bulkUpdateFamilies = (ids: string[], updates: Partial<Family>) => {
        setFamilies(prev => prev.map(f => ids.includes(f.id) ? { ...f, ...updates } : f));
    };

    const stats = useMemo(() => {
        const totalFamilies = families.length;
        const activeFamilies = families.filter(f => f.status === 'Aktif').length;
        const totalMembers = families.reduce((acc, curr) => acc + curr.members, 0);
        const avgMembers = totalFamilies > 0 ? (totalMembers / totalFamilies).toFixed(1) : "0";
        const sectorCounts = families.reduce((acc, curr) => {
            acc[curr.sector] = (acc[curr.sector] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const sectorCount = Object.keys(sectorCounts).length;

        return {
            totalFamilies,
            activeFamilies,
            avgMembers,
            sectorCount,
            sectorCounts
        };
    }, [families]);

    const importFamilies = (newFamilies: Family[]) => {
        setFamilies(prev => {
            const existingIds = new Set(prev.map(f => f.id));
            const uniqueNewFamilies = newFamilies.filter(f => !existingIds.has(f.id));
            return [...uniqueNewFamilies, ...prev];
        });
        return newFamilies.length;
    };

    return {
        families,
        setFamilies,
        filteredFamilies,
        searchTerm, setSearchTerm,
        filterSector, setFilterSector,
        filterStatus, setFilterStatus,
        filterMinMembers, setFilterMinMembers,
        sortConfig, handleSort,
        stats,
        bulkUpdateFamilies,
        importFamilies
    };
};
