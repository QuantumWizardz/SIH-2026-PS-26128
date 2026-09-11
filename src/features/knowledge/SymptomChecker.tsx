import { useState, useMemo, useEffect } from 'react';
import { Button } from '../../design/Button';
import { matchSymptoms } from '../../engines/symptom_similarity';
import type { SymptomMatchResult } from '../../engines/symptom_similarity';
import { addReport } from '../../services/radar';
import { bus } from '../../services/bus';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import diseasesData from '../../mock/diseases.json';

export function SymptomChecker() {
  const { t, i18n } = useTranslation();
  const [species, setSpecies] = useState('cattle');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<SymptomMatchResult[] | null>(null);
  const [escalated, setEscalated] = useState(false);
  const navigate = useNavigate();

  const availableSymptoms = useMemo(() => {
    const syms = new Set<string>();
    diseasesData.forEach(d => {
      if (d.species_affected.map(s => s.toLowerCase()).includes(species.toLowerCase())) {
        d.symptoms.early.forEach(s => syms.add(s.name));
        d.symptoms.late.forEach(s => syms.add(s.name));
      }
    });
    return Array.from(syms);
  }, [species]);

  useEffect(() => {
    setSelectedSymptoms([]);
    setResults(null);
  }, [species]);

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleCheck = () => {
    const res = matchSymptoms(selectedSymptoms, species);
    setResults(res);

    // Auto-escalation rule: If FMD > 70% confidence
    const fmdMatch = res.find(r => r.diseaseId === 'fmd_001');
    if (fmdMatch && fmdMatch.confidenceScore >= 70) {
      setEscalated(true);
      // Simulate auto-report submission
      const newReport = {
        report_id: `R_AUTO_${Date.now()}`,
        timestamp: new Date().toISOString(),
        latitude: 30.485,
        longitude: 76.590, // Rajpura
        village_id: "V01",
        district: "Patiala",
        species,
        animals_affected: 1,
        deaths: 0,
        symptoms: selectedSymptoms,
        source: "mobile",
        reporter_role: "Farmer"
      };
      addReport(newReport);
      bus.emit('report:created', newReport);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">{t('symptom.title')}</h1>
        <p className="text-lg text-espresso-70">{t('symptom.subtitle')}</p>
      </div>

      <div className="bg-sand p-8 rounded-soft space-y-8">
        <div>
          <h2 className="text-xl font-bold mb-4">{t('symptom.step1')}</h2>
          <select 
            className="w-full max-w-sm px-4 py-3 bg-cream border border-espresso/20 rounded-soft outline-none focus:border-terracotta"
            value={species}
            onChange={e => setSpecies(e.target.value)}
          >
            <option value="cattle">{t('knowledge.species.cattle', 'Cattle')}</option>
            <option value="buffalo">{t('knowledge.species.buffalo', 'Buffalo')}</option>
            <option value="goat">{t('knowledge.species.goat', 'Goat')}</option>
            <option value="sheep">{t('knowledge.species.sheep', 'Sheep')}</option>
            <option value="pig">{t('knowledge.species.pig', 'Pig')}</option>
            <option value="poultry">{t('knowledge.species.poultry', 'Poultry')}</option>
          </select>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">{t('symptom.step2')}</h2>
          <div className="flex flex-wrap gap-3">
            {availableSymptoms.map(sym => {
              const isSelected = selectedSymptoms.includes(sym);
              return (
                <button
                  key={sym}
                  onClick={() => toggleSymptom(sym)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    isSelected 
                      ? 'bg-terracotta border-terracotta text-cream' 
                      : 'bg-cream border-espresso/20 text-espresso hover:border-espresso/40'
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-espresso/10">
          <Button size="lg" className="w-full sm:w-auto" onClick={handleCheck} disabled={selectedSymptoms.length === 0}>
            {t('symptom.analyze')}
          </Button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">{t('symptom.results_title')}</h2>
          {results.length === 0 ? (
            <p className="text-espresso-70">{t('symptom.no_matches')}</p>
          ) : (
            results.map((res, i) => {
              const matchedDisease = diseasesData.find(d => d.id === res.diseaseId);
              const locName = matchedDisease ? ((matchedDisease.disease_name as any)[i18n.language] || res.diseaseNameEn) : res.diseaseNameEn;
              return (
                <div key={res.diseaseId} className={`p-6 rounded-soft border ${i === 0 ? 'border-terracotta bg-terracotta/5' : 'border-espresso/10'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{locName}</h3>
                    <span className="text-lg font-bold text-terracotta">{res.confidenceScore}{t('symptom.match_pct')}</span>
                  </div>
                  <p className="text-sm text-espresso-70">{t('symptom.based_on')}{res.matchedSymptoms.join(', ').replace(/_/g, ' ')}</p>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Auto-Escalation Modal */}
      {escalated && (
        <div className="fixed inset-0 bg-espresso/80 flex items-center justify-center p-6 z-50">
          <div className="bg-cream p-8 rounded-soft max-w-md w-full shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-risk-deep-rust"></div>
            <h2 className="text-2xl font-extrabold text-risk-deep-rust">{t('symptom.escalation_title')}</h2>
            <p className="text-espresso-70">
              {t('symptom.escalation_desc1')}
            </p>
            <p className="text-sm font-bold text-espresso">
              {t('symptom.escalation_desc2')}
            </p>
            <div className="pt-4 flex gap-4">
              <Button variant="primary" onClick={() => navigate('/radar')} className="flex-1">
                {t('symptom.view_radar')}
              </Button>
              <Button variant="secondary" onClick={() => setEscalated(false)} className="flex-1">
                {t('common.close', 'Close')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
