import React, { useRef, useState, useEffect } from 'react';
import { MapPin, Navigation, Info, Home, School, Trophy, Music, GlassWater } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface Location {
  id: string;
  name: string;
  type: 'festival' | 'accommodation' | 'event';
  lat: number;
  lng: number;
  distance?: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const locations: Location[] = [
  {
    id: 'festival',
    name: 'Place du Festival',
    type: 'festival',
    lat: 46.0987166,
    lng: 3.1955433,
    description: 'Cœur du 52ème festival Les Cultures du Monde',
    icon: <Navigation className="w-6 h-6" />,
    color: '#e75e5f',
  },
  {
    id: 'portes',
    name: 'Complexe sportif Les Portes Occitanes',
    type: 'accommodation',
    lat: 46.0826159,
    lng: 3.1977892,
    distance: '1.8 km',
    description: 'Hébergement sportif - Avenue des Portes Occitanes',
    icon: <Trophy className="w-6 h-6" />,
    color: '#272c38',
  },
  {
    id: 'bouzol',
    name: 'Gymnase du Bouzol',
    type: 'accommodation',
    lat: 46.08565,
    lng: 3.1988973,
    distance: '1.5 km',
    description: 'Hébergement sportif - Rue du Bouzol',
    icon: <Home className="w-6 h-6" />,
    color: '#272c38',
  },
  {
    id: 'eiffel',
    name: 'Lycée Professionnel Gustave Eiffel',
    type: 'accommodation',
    lat: 46.0855214,
    lng: 3.1970269,
    distance: '1.5 km',
    description: 'Hébergement scolaire & Self - 10 Av. de la République',
    icon: <School className="w-6 h-6" />,
    color: '#272c38',
  },
  {
    id: 'eglise',
    name: 'Concert à l\'église',
    type: 'event',
    lat: 46.1002879,
    lng: 3.1985312,
    description: 'Concert à l\'église Sainte Croix de Gannat',
    icon: <Music className="w-6 h-6" />,
    color: '#375ea9',
  },
  {
    id: 'cabaret',
    name: 'Soirée Cabaret',
    type: 'event',
    lat: 46.0974857,
    lng: 3.1967891,
    description: 'Spectacle et convivialité en soirée',
    icon: <Music className="w-6 h-6" />,
    color: '#375ea9',
  },
];

// Component to adjust map view
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);
  return null;
}

export default function MapGenerator() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);

  const festival = locations.find(l => l.type === 'festival')!;
  const center: [number, number] = [46.093, 3.197];

  return (
    <div className="min-h-screen bg-ancm-cream p-4 md:p-8 font-sans text-ancm-dark">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-serif text-ancm-red"
            >
              Se repérer à Gannat
            </motion.h1>
            <p className="text-lg font-light opacity-70 italic">Festival de Gannat Les Cultures du Monde</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-2xl border-2 border-[#1a1a1a]/5 overflow-hidden relative z-0"
            ref={mapRef}
          >
            <div className="h-[600px] w-full">
              <MapContainer 
                center={center} 
                zoom={14} 
                className="h-full w-full"
                scrollWheelZoom={true}
              >
                <MapResizer />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {locations.map(loc => (
                  <Marker 
                    key={loc.id} 
                    position={[loc.lat, loc.lng]}
                    eventHandlers={{
                      click: () => setSelectedLoc(loc),
                    }}
                  >
                    <Popup>
                      <div className="p-1">
                        <h3 className="font-bold text-ancm-red">{loc.name}</h3>
                        <p className="text-xs text-gray-600">{loc.description}</p>
                        {loc.distance && (
                          <p className="text-xs font-bold mt-1">Distance: {loc.distance}</p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Draw lines from festival to accommodations */}
                {locations.filter(l => l.type === 'accommodation').map(acc => (
                  <Polyline 
                    key={`line-${acc.id}`}
                    positions={[
                      [festival.lat, festival.lng],
                      [acc.lat, acc.lng]
                    ]}
                    pathOptions={{ 
                      color: '#e75e5f', 
                      dashArray: '10, 10',
                      weight: 2,
                      opacity: 0.6
                    }}
                  />
                ))}
              </MapContainer>
            </div>
            
            {/* Map Overlay Title */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-md border border-gray-200 z-[1000]">
              <h2 className="text-sm font-bold uppercase tracking-wider text-ancm-red">Plan de Gannat</h2>
              <p className="text-[10px] text-gray-500">Signalétique Artistes & Événements</p>
            </div>
          </motion.div>

          {/* Sidebar Section */}
          <div className="space-y-6 lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-ancm-yellow"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-ancm-yellow" />
                Lieux Clés
              </h2>
              <p className="text-sm leading-relaxed opacity-80 mb-4">
                Cliquez sur un lieu pour voir les détails ou utilisez la liste ci-dessous.
              </p>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {locations.map((loc, index) => (
                  <motion.div
                    key={loc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedLoc(loc)}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]",
                      selectedLoc?.id === loc.id 
                        ? "border-ancm-yellow bg-ancm-yellow/5 shadow-sm" 
                        : "border-gray-100 bg-white hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        loc.type === 'festival' ? "bg-ancm-red text-white" : 
                        loc.type === 'event' ? "bg-ancm-blue text-white" : "bg-gray-100 text-ancm-dark"
                      )}>
                        {React.cloneElement(loc.icon as React.ReactElement, { className: "w-4 h-4" })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold truncate">{loc.name}</h3>
                        <p className="text-[10px] text-gray-500 truncate">{loc.type === 'accommodation' ? `Hébergement (${loc.distance})` : loc.type === 'event' ? 'Événement' : 'Lieu Principal'}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Selected Info Card */}
            {selectedLoc && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-ancm-dark text-white p-6 rounded-2xl shadow-xl"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg leading-tight">{selectedLoc.name}</h3>
                  <button onClick={() => setSelectedLoc(null)} className="text-white/50 hover:text-white">×</button>
                </div>
                <p className="text-sm text-white/70 mb-4">{selectedLoc.description}</p>
                {selectedLoc.distance && (
                  <div className="flex items-center gap-2 text-xs font-bold bg-white/10 p-2 rounded-lg">
                    <MapPin className="w-3 h-3 text-ancm-yellow" />
                    Distance Festival: {selectedLoc.distance}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-ancm-dark/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-ancm-dark/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-ancm-yellow rounded-full flex items-center justify-center text-ancm-dark font-serif text-2xl">A</div>
            <div>
              <p className="font-bold text-ancm-dark">ANCM</p>
              <p>Association Nationale Cultures du Monde</p>
            </div>
          </div>
          <div className="flex gap-6">
            <a href="https://www.lesculturesdumonde.org" target="_blank" rel="noopener noreferrer" className="hover:text-ancm-red transition-colors">Site Web</a>
            <a href="mailto:rafael.villamizar@ancm.ong" className="hover:text-ancm-red transition-colors">Contact</a>
            <p>© 2026 - 52ème Festival de Gannat</p>
          </div>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 4px;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
    </div>
  );
}
