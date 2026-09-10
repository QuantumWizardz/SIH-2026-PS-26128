import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import type { ClusterDetails } from '../../services/radar';

// Component to dynamically center map
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

interface OutbreakMapProps {
  clusters: ClusterDetails[];
  selectedClusterId?: number;
  onSelectCluster: (id: number) => void;
}

export function OutbreakMap({ clusters, selectedClusterId, onSelectCluster }: OutbreakMapProps) {
  // Center on Punjab roughly
  let center: [number, number] = [30.484, 76.594]; // Rajpura default

  const selected = clusters.find(c => c.id === selectedClusterId);
  if (selected && selected.reports.length > 0) {
    // Center on the first report of the selected cluster
    center = [selected.reports[0].lat, selected.reports[0].lng];
  }

  return (
    <MapContainer center={center} zoom={11} className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <MapUpdater center={center} />
      
      {clusters.map(cluster => (
        <MarkerClusterGroup 
          key={cluster.id}
          chunkedLoading
          maxClusterRadius={40}
        >
          {cluster.reports.map(report => {
            const isSelected = cluster.id === selectedClusterId;
            const color = isSelected ? '#A63A28' : '#D97742'; // deep-rust or burnt-orange
            
            return (
              <CircleMarker
                key={report.report_id}
                center={[report.lat, report.lng]}
                radius={isSelected ? 8 : 6}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.7,
                  weight: isSelected ? 3 : 1
                }}
                eventHandlers={{
                  click: () => onSelectCluster(cluster.id)
                }}
              >
                <Popup>
                  <div className="text-sm font-sans">
                    <strong>Report ID: {report.report_id}</strong><br/>
                    Species: {report.species}<br/>
                    Cases: {report.animals_affected} | Deaths: {report.deaths}<br/>
                    Date: {new Date(report.timestamp).toLocaleDateString()}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MarkerClusterGroup>
      ))}
    </MapContainer>
  );
}
