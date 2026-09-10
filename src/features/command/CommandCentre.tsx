import React, { useEffect, useState } from 'react';
import { detectClusters } from '../../services/radar';
import type { ClusterDetails } from '../../services/radar';
import marketsRoutesData from '../../mock/markets_routes.json';
import { haversine } from '../../engines/haversine';
import { MapContainer, TileLayer, Circle, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { RiskBadge } from '../../design/RiskBadge';

// Helper to center map
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function CommandCentre() {
  const [clusters, setClusters] = useState<ClusterDetails[]>([]);

  useEffect(() => {
    setClusters(detectClusters());
  }, []);

  const highRiskClusters = clusters.filter(c => c.priorityScore > 100);

  // Compute blocked routes
  const processedRoutes = marketsRoutesData.routes.map(route => {
    let isBlocked = false;
    for (const cluster of highRiskClusters) {
      const cLat = cluster.reports[0].lat;
      const cLng = cluster.reports[0].lng;
      // Check if any waypoint is within 10km containment zone
      const intersects = route.waypoints.some(wp => haversine(cLat, cLng, wp.lat, wp.lng) <= 10);
      if (intersects) {
        isBlocked = true;
        break;
      }
    }
    return { ...route, isBlocked };
  });

  const center: [number, number] = highRiskClusters.length > 0 
    ? [highRiskClusters[0].reports[0].lat, highRiskClusters[0].reports[0].lng]
    : [30.484, 76.594]; // Default Rajpura

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mt-6 -mx-6 md:-mx-12 lg:-mx-16">
      <div className="bg-espresso text-cream px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-widest uppercase">Command Centre</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-risk-deep-rust" />
            <span className="text-sm">Containment Zones (10km)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-risk-deep-rust" />
            <span className="text-sm">Blocked Routes</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer center={center} zoom={10} className="w-full h-full">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <MapUpdater center={center} />

          {/* Containment Zones */}
          {highRiskClusters.map(c => {
            const lat = c.reports[0].lat;
            const lng = c.reports[0].lng;
            return (
              <React.Fragment key={`zone-${c.id}`}>
                <Circle 
                  center={[lat, lng]} 
                  radius={10000} // 10km in meters
                  pathOptions={{ color: '#A63A28', fillColor: '#A63A28', fillOpacity: 0.15, weight: 2, dashArray: '5, 10' }}
                />
                <Marker position={[lat, lng]}>
                  <Popup>
                    <strong>Cluster #{c.id}</strong><br/>
                    {c.primaryDiseaseMatch}<br/>
                    Priority: {c.priorityScore}
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

          {/* Routes */}
          {processedRoutes.map(route => {
            const positions: [number, number][] = route.waypoints.map(wp => [wp.lat, wp.lng]);
            return (
              <Polyline
                key={route.route_id}
                positions={positions}
                pathOptions={{ 
                  color: route.isBlocked ? '#A63A28' : '#2C3E2D', // deep-rust if blocked, else dark-green
                  weight: route.isBlocked ? 4 : 3,
                  opacity: 0.8
                }}
              >
                <Popup>
                  <strong>{route.name}</strong><br/>
                  Type: {route.type}<br/>
                  Status: {route.isBlocked ? <span className="text-risk-deep-rust font-bold">BLOCKED</span> : 'ACTIVE'}
                </Popup>
              </Polyline>
            );
          })}

          {/* Markets */}
          {marketsRoutesData.markets.map(m => (
            <Circle
              key={m.market_id}
              center={[m.lat, m.lng]}
              radius={1000}
              pathOptions={{ color: '#E0AD52', fillColor: '#E0AD52', fillOpacity: 0.8, weight: 1 }}
            >
              <Popup>
                <strong>{m.name}</strong><br/>
                Capacity: {m.capacity}
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>
      
      {/* Sidebar Overlay for restricted areas */}
      <div className="absolute top-32 left-8 bg-cream/95 backdrop-blur shadow-xl border border-espresso/10 p-6 rounded-soft w-80 z-[1000]">
        <h2 className="text-sm font-bold text-espresso-40 uppercase tracking-widest mb-4">Active Containment</h2>
        {highRiskClusters.length === 0 ? (
          <p className="text-sm text-espresso-70">No active containment zones.</p>
        ) : (
          <div className="space-y-4">
            {highRiskClusters.map(c => (
              <div key={c.id} className="border-l-2 border-risk-deep-rust pl-3 py-1">
                <div className="font-bold">{c.primaryDiseaseMatch}</div>
                <div className="text-sm text-espresso-70 mb-1">{c.villageIds.join(', ')}</div>
                <RiskBadge tier={c.priorityScore > 200 ? 'CRITICAL' : 'HIGH'} label="10km Lockdown" />
              </div>
            ))}
          </div>
        )}
        <h2 className="text-sm font-bold text-espresso-40 uppercase tracking-widest mt-6 mb-4">Route Restrictions</h2>
        <div className="text-sm font-bold text-risk-deep-rust">
          {processedRoutes.filter(r => r.isBlocked).length} Routes Blocked
        </div>
      </div>
    </div>
  );
}
