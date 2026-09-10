import { useState, useEffect } from 'react';
import { getReports } from '../../services/radar';
import { matchSymptoms } from '../../engines/symptom_similarity';
import { RiskBadge } from '../../design/RiskBadge';
import { Clock, MapPin, AlertCircle } from 'lucide-react';

type TriageItem = {
  report: any;
  tier: 'NORMAL' | 'WATCH' | 'HIGH' | 'CRITICAL' | 'ZOONOTIC';
  score: number;
  primaryDiseaseMatch: string;
  contributingFactors: string[];
};

export function TriageQueue() {
  const [items, setItems] = useState<TriageItem[]>([]);

  useEffect(() => {
    const reports = getReports();
    const evaluated = reports.map(report => {
      // Basic score
      let score = (report.animals_affected * 10) + (report.deaths * 25);
      
      const matches = matchSymptoms(report.symptoms, report.species);
      let primaryDiseaseMatch = 'Unknown';
      
      if (matches.length > 0) {
        primaryDiseaseMatch = matches[0].diseaseId.toUpperCase();
        score += matches[0].confidenceScore;
      }
      
      let tier: 'NORMAL' | 'WATCH' | 'HIGH' | 'CRITICAL' | 'ZOONOTIC' = 'NORMAL';
      if (score > 100) tier = 'CRITICAL';
      else if (score > 60) tier = 'HIGH';
      else if (score > 30) tier = 'WATCH';
      
      if (primaryDiseaseMatch.includes('ZOONOTIC')) tier = 'ZOONOTIC';

      return {
        report,
        tier,
        score: Math.round(score),
        primaryDiseaseMatch,
        contributingFactors: report.symptoms
      };
    });
    
    // Sort descending by score
    evaluated.sort((a, b) => b.score - a.score);
    setItems(evaluated);
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Triage Queue (F5)</h1>
          <p className="text-lg text-espresso-70">Automated prioritization of incoming incident reports.</p>
        </div>
        <div className="bg-cream px-6 py-3 rounded-soft border border-espresso/10 text-center">
          <div className="text-3xl font-extrabold text-risk-deep-rust">{items.filter(i => i.tier === 'CRITICAL' || i.tier === 'ZOONOTIC').length}</div>
          <div className="text-xs font-bold uppercase tracking-widest text-espresso-40">Critical</div>
        </div>
      </div>

      <div className="bg-white rounded-soft shadow-sm border border-espresso/10 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-cream border-b border-espresso/10 font-bold text-xs uppercase tracking-widest text-espresso-40">
          <div className="col-span-1">Score</div>
          <div className="col-span-3">Location</div>
          <div className="col-span-2">Species / Impact</div>
          <div className="col-span-4">Matched Disease</div>
          <div className="col-span-2 text-right">Time</div>
        </div>
        <div className="divide-y divide-espresso/10">
          {items.map(({ report, tier, score, primaryDiseaseMatch, contributingFactors }) => (
            <div key={report.report_id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-cream/50 transition-colors">
              <div className="col-span-1">
                <RiskBadge tier={tier} label={score.toString()} />
              </div>
              <div className="col-span-3">
                <div className="font-bold flex items-center gap-1"><MapPin className="w-3 h-3 text-terracotta" /> {report.village_id}</div>
                <div className="text-xs text-espresso-70">Dist: {report.district}</div>
              </div>
              <div className="col-span-2">
                <div className="font-bold capitalize">{report.species}</div>
                <div className="text-xs text-risk-deep-rust flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {report.animals_affected} sick, {report.deaths} dead
                </div>
              </div>
              <div className="col-span-4">
                <div className="font-bold">{primaryDiseaseMatch}</div>
                <div className="text-xs text-espresso-70 truncate" title={contributingFactors.join(', ')}>
                  {contributingFactors.slice(0, 2).join(', ')}...
                </div>
              </div>
              <div className="col-span-2 text-right text-sm text-espresso-70 flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" />
                {new Date(report.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
