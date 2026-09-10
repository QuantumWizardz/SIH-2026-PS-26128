import { useEffect, useState } from 'react';
import { detectClusters } from '../../services/radar';
import type { ClusterDetails } from '../../services/radar';
import { bus } from '../../services/bus';
import { OutbreakMap } from './OutbreakMap';
import { RadarSidebar } from './RadarSidebar';
import { simulation } from '../../services/simulation';
import { Button } from '../../design/Button';

export function RadarPage() {
  const [clusters, setClusters] = useState<ClusterDetails[]>([]);
  const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);

  const refreshClusters = () => {
    const updated = detectClusters();
    setClusters(updated);
    // Auto-select top priority if none selected
    if (updated.length > 0 && selectedClusterId === null) {
      setSelectedClusterId(updated[0].id);
    }
  };

  useEffect(() => {
    // Initial load
    refreshClusters();

    // Listen to live events
    const handleReportCreated = () => {
      console.log('RadarPage: Received report:created event, re-clustering...');
      refreshClusters();
    };

    bus.on('report:created', handleReportCreated);

    return () => {
      bus.off('report:created', handleReportCreated);
    };
  }, []);

  const selectedCluster = clusters.find(c => c.id === selectedClusterId) || clusters[0];

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -mt-6 -mx-6 md:-mx-12 lg:-mx-16">
      {/* Simulation Control Bar */}
      <div className="bg-espresso text-cream px-6 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="font-bold tracking-wide">F3 Outbreak Radar</span>
          <span className="text-espresso-40">Live Monitoring</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button size="sm" variant="secondary" className="border-cream text-cream hover:bg-cream/10" onClick={() => simulation.start()}>
            Start Simulation
          </Button>
          <Button size="sm" variant="secondary" className="border-cream text-cream hover:bg-cream/10" onClick={() => simulation.stop()}>
            Stop
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Map */}
        <div className="flex-1 relative bg-sand">
          <OutbreakMap clusters={clusters} selectedClusterId={selectedCluster?.id} onSelectCluster={setSelectedClusterId} />
        </div>

        {/* Right Side: Details Panel */}
        <div className="w-[400px] border-l border-espresso/10 bg-cream flex flex-col overflow-y-auto">
          {selectedCluster ? (
            <RadarSidebar cluster={selectedCluster} />
          ) : (
            <div className="p-8 text-espresso-70 italic">No clusters detected within the 72-hour window.</div>
          )}
        </div>
      </div>
    </div>
  );
}
