import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';


// Fix for default marker icon missing in React Leaflet
// You might need to import marker images locally if these URLs fail, but they are standard CDN links
const customIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const locations = [
    { id: 1, name: "Rayon 1", lat: -10.175, lng: 123.63, count: 45 },
    { id: 2, name: "Rayon 2", lat: -10.172, lng: 123.64, count: 62 },
    { id: 3, name: "Rayon 3", lat: -10.178, lng: 123.635, count: 38 },
    { id: 4, name: "Rayon 4", lat: -10.174, lng: 123.625, count: 51 },
    { id: 5, name: "Rayon 5", lat: -10.180, lng: 123.632, count: 42 },
];

export const HomeMap = () => {
    return (
        <div className="w-full h-[500px] rounded-3xl overflow-hidden relative z-0 shadow-2xl border-4 border-white dark:border-slate-800">
            <div className="absolute top-4 right-4 z-[1000] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-1">Sebaran Jemaat</h4>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Live Update</span>
                </div>
            </div>

            <MapContainer
                center={[-10.1772, 123.6333]} // Coordinates for Liliba/Kupang roughly
                zoom={14}
                scrollWheelZoom={false}
                className="w-full h-full z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((loc) => (
                    <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={customIcon}>
                        <Popup>
                            <div className="p-1">
                                <h3 className="font-bold text-indigo-600">{loc.name}</h3>
                                <p className="text-sm text-slate-600">Jemaat: {loc.count} Jiwa</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 pointer-events-none border-[6px] border-white/20 rounded-3xl z-[500]"></div>
        </div>
    );
};
