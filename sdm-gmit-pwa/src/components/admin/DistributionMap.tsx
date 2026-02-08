import { useState } from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Center of Liliba, Kupang
const CENTER_LILIBA: [number, number] = [-10.1708, 123.6068];

// Filter types
type FilterType = 'lingkungan' | 'education' | 'jobCategory' | 'sector' | 'willingness';

// Color palettes for each filter type
const COLOR_PALETTES: Record<FilterType, Record<string, string>> = {
    lingkungan: {
        '1': '#ef4444', // Red
        '2': '#f97316', // Orange
        '3': '#eab308', // Yellow
        '4': '#22c55e', // Green
        '5': '#06b6d4', // Cyan
        '6': '#3b82f6', // Blue
        '7': '#8b5cf6', // Violet
        'Luar Wilayah': '#64748b', // Slate
    },
    education: {
        'SD': '#fca5a5',
        'SMP': '#fdba74',
        'SMA': '#fcd34d',
        'SMA/SMK': '#fcd34d',
        'D3': '#86efac',
        'S1': '#22d3ee',
        'S2': '#818cf8',
        'S3': '#c084fc',
    },
    jobCategory: {
        'Profesional': '#3b82f6',
        'Wiraswasta': '#22c55e',
        'Pegawai Swasta': '#f97316',
        'PNS/ASN': '#8b5cf6',
        'Mahasiswa/Pelajar': '#06b6d4',
        'Ibu Rumah Tangga': '#ec4899',
        'Pensiunan': '#64748b',
        'Belum Bekerja': '#94a3b8',
    },
    sector: {
        'Pemuda': '#3b82f6',
        'Kaum Perempuan': '#ec4899',
        'Kaum Bapak': '#10b981',
        'Lansia': '#f59e0b',
    },
    willingness: {
        'Aktif': '#22c55e',
        'On-demand': '#eab308',
        'Not-available': '#ef4444',
    },
};

// Filter labels
const FILTER_LABELS: Record<FilterType, string> = {
    lingkungan: 'Lingkungan',
    education: 'Pendidikan',
    jobCategory: 'Pekerjaan',
    sector: 'Sektor Kategorial',
    willingness: 'Minat Pelayanan',
};

// Custom marker icon
const createMarkerIcon = (color: string) => L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
});

interface MemberLocation {
    id: string;
    name: string;
    sector: string;
    lingkungan?: string;
    education?: string;
    jobCategory?: string;
    willingnessToServe?: string;
    latitude?: number | null;
    longitude?: number | null;
}

interface DistributionMapProps {
    sectorData: Record<string, number>;
    members?: MemberLocation[];
}

const DistributionMap = ({ sectorData: _sectorData, members = [] }: DistributionMapProps) => {
    const [activeFilter, setActiveFilter] = useState<FilterType>('lingkungan');

    // Filter members with valid coordinates
    const membersWithLocation = members.filter(m => m.latitude && m.longitude && m.latitude !== 0 && m.longitude !== 0);

    // Get color for a member based on active filter
    const getMarkerColor = (member: MemberLocation): string => {
        const palette = COLOR_PALETTES[activeFilter];
        let value: string | undefined;

        switch (activeFilter) {
            case 'lingkungan':
                value = member.lingkungan;
                break;
            case 'education':
                value = member.education;
                break;
            case 'jobCategory':
                value = member.jobCategory;
                break;
            case 'sector':
                value = member.sector;
                break;
            case 'willingness':
                value = member.willingnessToServe;
                break;
        }

        return palette[value || ''] || '#6b7280';
    };

    // Calculate legend items based on active filter and actual data
    const legendItems = (() => {
        const counts: Record<string, number> = {};
        const palette = COLOR_PALETTES[activeFilter];

        membersWithLocation.forEach(m => {
            let value: string | undefined;
            switch (activeFilter) {
                case 'lingkungan': value = m.lingkungan; break;
                case 'education': value = m.education; break;
                case 'jobCategory': value = m.jobCategory; break;
                case 'sector': value = m.sector; break;
                case 'willingness': value = m.willingnessToServe; break;
            }
            if (value) {
                counts[value] = (counts[value] || 0) + 1;
            }
        });

        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .map(([name, count]) => ({
                name,
                count,
                color: palette[name] || '#6b7280'
            }));
    })();

    return (
        <MapContainer
            center={CENTER_LILIBA}
            zoom={14}
            scrollWheelZoom={true}
            className="w-full h-full rounded-2xl z-0"
            style={{ minHeight: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render individual member markers */}
            {membersWithLocation.map((member) => (
                <Marker
                    key={member.id}
                    position={[member.latitude!, member.longitude!]}
                    icon={createMarkerIcon(getMarkerColor(member))}
                >
                    <Popup>
                        <div className="p-1 text-center">
                            <h4 className="font-bold text-sm">{member.name}</h4>
                            <p className="text-xs text-slate-500">Ling. {member.lingkungan} • {member.sector}</p>
                            <p className="text-[10px] text-slate-400">{member.education} • {member.jobCategory}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Filter Dropdown - Top Right */}
            <div className="absolute top-4 right-4 z-[1000]">
                <select
                    value={activeFilter}
                    onChange={(e) => setActiveFilter(e.target.value as FilterType)}
                    className="px-3 py-2 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl text-xs font-bold text-slate-700 shadow-lg cursor-pointer focus:ring-2 focus:ring-primary/50 focus:outline-none"
                >
                    {Object.entries(FILTER_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                    ))}
                </select>
            </div>

            {/* Legend Overlay - Bottom Left */}
            {legendItems.length > 0 && (
                <div className="absolute bottom-4 left-4 p-3 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg z-[1000] max-h-48 overflow-y-auto">
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        {FILTER_LABELS[activeFilter]}
                    </h4>
                    <div className="space-y-1">
                        {legendItems.map(item => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="size-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                                <span className="text-[10px] font-medium text-slate-700 truncate">
                                    {activeFilter === 'lingkungan' ? `Ling. ${item.name}` : item.name}: {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </MapContainer>
    );
};

export default DistributionMap;
