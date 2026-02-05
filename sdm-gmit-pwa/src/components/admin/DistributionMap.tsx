import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Center of Liliba, Kupang
const CENTER_LILIBA: [number, number] = [-10.1708, 123.6068];

// Fixed Coordinates for Sectors (Approximate distribution around center)
const SECTOR_COORDINATES: Record<string, [number, number]> = {
    'Efata': [-10.1680, 123.6050],    // North-West
    'Betel': [-10.1680, 123.6090],    // North-East
    'Sion': [-10.1740, 123.6050],     // South-West
    'Eden': [-10.1740, 123.6090],     // South-East
};

interface DistributionMapProps {
    sectorData: Record<string, number>;
}

const DistributionMap = ({ sectorData }: DistributionMapProps) => {
    // Convert dictionary to array for rendering
    const points = Object.entries(SECTOR_COORDINATES).map(([name, coords]) => ({
        name,
        coords,
        count: sectorData[name] || 0
    }));

    return (
        <MapContainer
            center={CENTER_LILIBA}
            zoom={15}
            scrollWheelZoom={false}
            className="w-full h-full rounded-2xl z-0"
            style={{ minHeight: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {points.map((point) => (
                <CircleMarker
                    key={point.name}
                    center={point.coords}
                    pathOptions={{
                        color: point.count > 0 ? '#6366f1' : '#94a3b8',
                        fillColor: point.count > 0 ? '#6366f1' : '#94a3b8',
                        fillOpacity: 0.6,
                        weight: 2
                    }}
                    radius={Math.max(10, Math.sqrt(point.count) * 5)} // Scale radius dynamically
                >
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                        <div className="text-center font-bold text-xs bg-white px-1 rounded shadow-sm border border-slate-200">
                            {point.name}: {point.count}
                        </div>
                    </Tooltip>
                    <Popup>
                        <div className="p-2 text-center">
                            <h4 className="font-bold text-lg mb-1">{point.name}</h4>
                            <p className="text-slate-600 text-sm">Total Jemaat: <b>{point.count}</b> Jiwa</p>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
};

export default DistributionMap;
