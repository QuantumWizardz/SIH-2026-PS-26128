import { Server, Database, Shield, Activity, RefreshCw } from 'lucide-react';
import { Button } from '../../design/Button';

const APIs = [
  { name: 'INAPH Database', type: 'Health Records', status: 'connected', latency: '45ms', lastSync: '2 mins ago' },
  { name: 'e-Pashuhaat', type: 'Market Data', status: 'connected', latency: '120ms', lastSync: '15 mins ago' },
  { name: 'IMD Weather Services', type: 'Environmental Context', status: 'connected', latency: '30ms', lastSync: 'Real-time' },
  { name: 'NDDB Dairy Network', type: 'Production Metrics', status: 'degraded', latency: '850ms', lastSync: '2 hours ago' },
];

export function ApiIntegrations() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">System Integrations</h1>
          <p className="text-lg text-espresso-70">Live status of government API bridges.</p>
        </div>
        <Button variant="secondary" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Run Diagnostics
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {APIs.map((api, i) => (
          <div key={i} className="bg-cream p-6 rounded-soft border border-espresso/10 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${api.status === 'connected' ? 'bg-risk-forest/10 text-risk-forest' : 'bg-risk-ochre/10 text-risk-ochre'}`}>
                  {api.name.includes('Database') ? <Database className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{api.name}</h3>
                  <div className="text-sm text-espresso-70">{api.type}</div>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest px-2 py-1 rounded ${
                api.status === 'connected' ? 'bg-risk-forest text-white' : 'bg-risk-ochre text-white'
              }`}>
                {api.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-espresso/10 pt-4 mt-auto">
              <div>
                <div className="text-xs text-espresso-40 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Activity className="w-3 h-3" /> Latency
                </div>
                <div className="font-mono font-bold">{api.latency}</div>
              </div>
              <div>
                <div className="text-xs text-espresso-40 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Last Sync
                </div>
                <div className="font-mono font-bold">{api.lastSync}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
