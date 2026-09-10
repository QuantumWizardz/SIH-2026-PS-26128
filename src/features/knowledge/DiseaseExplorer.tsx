import { useState } from 'react';
import diseasesData from '../../mock/diseases.json';
import { RiskBadge } from '../../design/RiskBadge';
import { Button } from '../../design/Button';
import { ArchMask } from '../../design/ArchMask';

export function DiseaseExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('All');

  const filtered = diseasesData.filter(d => {
    const matchesSearch = d.disease_name.en.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.abbreviation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = selectedSpecies === 'All' || d.species_affected.includes(selectedSpecies);
    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-cream-deep/30 p-8 rounded-soft border border-espresso/5">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Knowledge Base</h1>
          <p className="text-espresso-70 text-lg">Browse standard definitions for surveillance diseases.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search disease..." 
            className="px-4 py-3 bg-transparent border-b border-espresso-40 focus:border-terracotta outline-none text-base w-full sm:w-64"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 py-3 bg-transparent border-b border-espresso-40 focus:border-terracotta outline-none text-base"
            value={selectedSpecies}
            onChange={e => setSelectedSpecies(e.target.value)}
          >
            <option value="All">All Species</option>
            <option value="Cattle">Cattle</option>
            <option value="Buffalo">Buffalo</option>
            <option value="Goat">Goat</option>
            <option value="Sheep">Sheep</option>
            <option value="Pig">Pig</option>
            <option value="Poultry">Poultry</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filtered.map(disease => (
          <div key={disease.id} className="bg-white p-8 rounded-soft shadow-sm border border-espresso/5 flex flex-col sm:flex-row gap-8">
            <div className="hidden sm:block">
              <ArchMask width={120} height={160} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-espresso-40 mb-1">{disease.abbreviation}</div>
                  <h3 className="text-2xl font-bold">{disease.disease_name.en}</h3>
                </div>
                <RiskBadge 
                  tier={disease.severity.toUpperCase() as any} 
                  label={disease.severity} 
                />
              </div>
              
              {disease.zoonotic && (
                <div className="text-xs font-bold text-risk-oxblood bg-risk-oxblood/10 px-2 py-1 inline-block rounded">
                  ⚠️ ZOONOTIC RISK
                </div>
              )}

              <div>
                <strong className="text-sm">Species:</strong> <span className="text-sm text-espresso-70">{disease.species_affected.join(', ')}</span>
              </div>

              <div>
                <strong className="text-sm">Transmission:</strong>
                <ul className="text-sm text-espresso-70 list-disc pl-4 mt-1">
                  {disease.transmission_mode.slice(0, 2).map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>

              <div className="pt-4 border-t border-espresso/10">
                <Button variant="secondary" size="sm">View Full Protocol</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
