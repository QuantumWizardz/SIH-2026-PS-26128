import { useState, useEffect } from 'react';
import facilitiesData from '../../mock/facilities.json';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Stethoscope, FlaskConical, Syringe, Ambulance } from 'lucide-react';

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function FacilityFinder() {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedFacility, setSelectedFacility] = useState<any>(null);

  const filteredFacilities = facilitiesData.filter(f => filterType === 'all' || f.type === filterType);

  const center: [number, number] = [30.484, 76.594]; // Rajpura Default

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'veterinary_facility': return <Stethoscope className="w-4 h-4" />;
      case 'diagnostic_laboratory': return <FlaskConical className="w-4 h-4" />;
      case 'vaccination_centre': return <Syringe className="w-4 h-4" />;
      case 'emergency_veterinary_service': return <Ambulance className="w-4 h-4" />;
      default: return <Stethoscope className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'veterinary_facility': return '#3B82F6'; // Blue
      case 'diagnostic_laboratory': return '#8B5CF6'; // Purple
      case 'vaccination_centre': return '#10B981'; // Green
      case 'emergency_veterinary_service': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mt-6 -mx-6 md:-mx-12 lg:-mx-16">
      <div className="bg-espresso text-cream px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-widest uppercase">Facility Finder</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Filter & List */}
        <div className="w-[350px] border-r border-espresso/10 bg-cream flex flex-col">
          <div className="p-6 border-b border-espresso/10">
            <h2 className="text-sm font-bold uppercase tracking-widest text-espresso-40 mb-4">Filter by Type</h2>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterType('all')}
                className={`w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors ${filterType === 'all' ? 'bg-terracotta text-cream' : 'bg-transparent text-espresso hover:bg-espresso/5'}`}
              >
                All Facilities
              </button>
              <button 
                onClick={() => setFilterType('veterinary_facility')}
                className={`w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${filterType === 'veterinary_facility' ? 'bg-terracotta text-cream' : 'bg-transparent text-espresso hover:bg-espresso/5'}`}
              >
                <Stethoscope className="w-4 h-4" /> Veterinary Hospitals
              </button>
              <button 
                onClick={() => setFilterType('diagnostic_laboratory')}
                className={`w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${filterType === 'diagnostic_laboratory' ? 'bg-terracotta text-cream' : 'bg-transparent text-espresso hover:bg-espresso/5'}`}
              >
                <FlaskConical className="w-4 h-4" /> Diagnostic Labs
              </button>
              <button 
                onClick={() => setFilterType('vaccination_centre')}
                className={`w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${filterType === 'vaccination_centre' ? 'bg-terracotta text-cream' : 'bg-transparent text-espresso hover:bg-espresso/5'}`}
              >
                <Syringe className="w-4 h-4" /> Vaccination Centres
              </button>
              <button 
                onClick={() => setFilterType('emergency_veterinary_service')}
                className={`w-full text-left px-4 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2 ${filterType === 'emergency_veterinary_service' ? 'bg-terracotta text-cream' : 'bg-transparent text-espresso hover:bg-espresso/5'}`}
              >
                <Ambulance className="w-4 h-4" /> Emergency Services
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="text-sm font-bold text-espresso-40 uppercase tracking-widest">{filteredFacilities.length} Results</div>
            {filteredFacilities.map(fac => (
              <div 
                key={fac.facility_id} 
                className={`p-4 rounded border cursor-pointer transition-colors ${selectedFacility?.facility_id === fac.facility_id ? 'border-terracotta bg-terracotta/5' : 'border-espresso/10 hover:border-espresso/30'}`}
                onClick={() => setSelectedFacility(fac)}
              >
                <div className="flex items-start gap-2 mb-1">
                  <div className="mt-1" style={{ color: getTypeColor(fac.type) }}>{getTypeIcon(fac.type)}</div>
                  <div>
                    <div className="font-bold text-espresso">{fac.name}</div>
                    <div className="text-xs text-espresso-70">{fac.village}, {fac.district}</div>
                  </div>
                </div>
                <div className="text-xs font-medium mt-2 flex gap-2">
                  <span className={`px-2 py-0.5 rounded ${fac.availability === 'available' ? 'bg-risk-forest/10 text-risk-forest' : 'bg-risk-deep-rust/10 text-risk-deep-rust'}`}>
                    {fac.availability.toUpperCase()}
                  </span>
                  {fac.cold_chain && <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">COLD CHAIN</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Map */}
        <div className="flex-1 relative z-0">
          <MapContainer center={selectedFacility ? [selectedFacility.lat, selectedFacility.lng] : center} zoom={10} className="w-full h-full">
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {selectedFacility && <MapUpdater center={[selectedFacility.lat, selectedFacility.lng]} />}

            {filteredFacilities.map(fac => {
              const isSelected = selectedFacility?.facility_id === fac.facility_id;
              const color = getTypeColor(fac.type);
              
              return (
                <CircleMarker
                  key={fac.facility_id}
                  center={[fac.lat, fac.lng]}
                  radius={isSelected ? 10 : 6}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: 0.8,
                    weight: isSelected ? 3 : 1
                  }}
                  eventHandlers={{
                    click: () => setSelectedFacility(fac)
                  }}
                >
                  <Popup>
                    <div className="font-sans">
                      <strong>{fac.name}</strong><br/>
                      Phone: {fac.phone}<br/>
                      {fac.diagnostic_capabilities.length > 0 && (
                        <div className="mt-1 text-xs">
                          <strong>Tests:</strong> {fac.diagnostic_capabilities.join(', ')}
                        </div>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
