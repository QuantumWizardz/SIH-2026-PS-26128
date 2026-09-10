import type { ClusterDetails } from '../../services/radar';
import { RiskBadge } from '../../design/RiskBadge';
import { ScoreDial } from '../../design/ScoreDial';
import { EvidenceList } from '../../design/EvidenceList';
import { Button } from '../../design/Button';
import { Activity } from 'lucide-react';

interface RadarSidebarProps {
  cluster: ClusterDetails;
}

export function RadarSidebar({ cluster }: RadarSidebarProps) {
  // Determine tier based on priority score (0-400+ range)
  let tier: 'NORMAL' | 'WATCH' | 'HIGH' | 'CRITICAL' = 'NORMAL';
  if (cluster.priorityScore > 200) tier = 'CRITICAL';
  else if (cluster.priorityScore > 100) tier = 'HIGH';
  else if (cluster.priorityScore > 50) tier = 'WATCH';

  // Normalize score to 100 max for the dial display
  const dialScore = Math.min(100, Math.round((cluster.priorityScore / 300) * 100));

  return (
    <div className="p-8 space-y-8">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-espresso-40 uppercase tracking-widest">Cluster #{cluster.id}</span>
          <RiskBadge tier={tier} label={tier} />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight leading-none mb-4">
          {cluster.primaryDiseaseMatch}
        </h2>
        <div className="flex space-x-6 text-sm text-espresso-70 mb-6">
          <div><strong className="text-espresso text-xl">{cluster.totalCases}</strong> cases</div>
          <div><strong className="text-espresso text-xl">{cluster.totalDeaths}</strong> deaths</div>
          <div><strong className="text-espresso text-xl">{cluster.villageIds.length}</strong> villages</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 py-8 border-y border-espresso/10">
        <ScoreDial 
          score={dialScore} 
          label="Investigation Priority" 
          tier={tier} 
          size={100} 
        />
        <div className="flex flex-col justify-center">
          <div className="text-xs font-bold text-espresso-40 uppercase mb-2">Evolution</div>
          <div className="text-2xl font-bold text-espresso tabular-nums">{cluster.reports.length} <span className="text-sm text-espresso-70 font-medium">reports</span></div>
          <div className="text-sm text-espresso-70">over {cluster.durationHours} hours</div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-espresso-40 uppercase mb-4 tracking-widest">Decision Evidence</h3>
        <EvidenceList reasons={cluster.evidence} />
      </div>

      <div className="pt-4 flex flex-col space-y-3">
        <Button variant="primary" className="w-full justify-center">
          <Activity className="w-4 h-4 mr-2" />
          Escalate to Command Centre
        </Button>
        <Button variant="secondary" className="w-full justify-center">
          View Raw Reports
        </Button>
      </div>
    </div>
  );
}
