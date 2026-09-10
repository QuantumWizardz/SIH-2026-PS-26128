import { useState } from 'react';
import { MessageSquare, BellRing } from 'lucide-react';
import { RiskBadge } from '../../design/RiskBadge';

const alerts = [
  {
    id: 1,
    type: 'sms',
    language: 'punjabi',
    target: 'Farmers in Rajpura (10km radius)',
    trigger: 'FMD Cluster Confirmed',
    content: "ਸਾਵਧਾਨ: ਤੁਹਾਡੇ ਇਲਾਕੇ ਵਿੱਚ ਮੂੰਹ-ਖੁਰ (FMD) ਦੀ ਪੁਸ਼ਟੀ ਹੋਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣੇ ਪਸ਼ੂਆਂ ਨੂੰ ਵੱਖਰਾ ਰੱਖੋ ਅਤੇ ਟੀਕਾਕਰਨ ਕਰਵਾਓ।",
    status: 'dispatched'
  },
  {
    id: 2,
    type: 'whatsapp',
    language: 'english',
    target: 'Veterinary Officers (Patiala District)',
    trigger: 'Priority > 200 Threshold Reached',
    content: "🚨 HIGH PRIORITY ALERT: Multi-village FMD outbreak confirmed in Rajpura block. Deploy response units immediately. Reference: Cluster #104",
    status: 'delivered'
  },
  {
    id: 3,
    type: 'sms',
    language: 'punjabi',
    target: 'Registered Herds (Sangrur)',
    trigger: 'Weather Context (Heat Stress)',
    content: "ਮੌਸਮ ਚੇਤਾਵਨੀ: ਅਗਲੇ 3 ਦਿਨਾਂ ਲਈ ਤਾਪਮਾਨ 40 ਡਿਗਰੀ ਤੋਂ ਉੱਪਰ ਰਹੇਗਾ। ਪਸ਼ੂਆਂ ਨੂੰ ਛਾਂ ਵਿੱਚ ਰੱਖੋ ਅਤੇ ਪਾਣੀ ਦੀ ਘਾਟ ਨਾ ਆਉਣ ਦਿਓ।",
    status: 'queued'
  }
];

export function AlertsDispatcher() {
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter(a => filter === 'all' || a.type === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Alerts Dispatcher (F11)</h1>
        <p className="text-lg text-espresso-70">Multilingual mass-notification system simulating SMS and WhatsApp broadcasts.</p>
      </div>

      <div className="flex gap-4 border-b border-espresso/10 pb-4">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-bold rounded-t-soft ${filter === 'all' ? 'bg-terracotta text-cream' : 'bg-transparent text-espresso'}`}
        >
          All Alerts
        </button>
        <button 
          onClick={() => setFilter('sms')}
          className={`px-4 py-2 text-sm font-bold rounded-t-soft flex items-center gap-2 ${filter === 'sms' ? 'bg-terracotta text-cream' : 'bg-transparent text-espresso'}`}
        >
          <MessageSquare className="w-4 h-4" /> SMS Only
        </button>
        <button 
          onClick={() => setFilter('whatsapp')}
          className={`px-4 py-2 text-sm font-bold rounded-t-soft flex items-center gap-2 ${filter === 'whatsapp' ? 'bg-terracotta text-cream' : 'bg-transparent text-espresso'}`}
        >
          <BellRing className="w-4 h-4" /> WhatsApp Only
        </button>
      </div>

      <div className="space-y-6">
        {filtered.map(alert => (
          <div key={alert.id} className="bg-cream p-6 rounded-soft shadow-sm border border-espresso/10 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 flex-shrink-0 space-y-4 border-r border-espresso/10 pr-6">
              <div className="flex items-center gap-2 text-sm font-bold text-espresso-40 uppercase tracking-widest">
                {alert.type === 'sms' ? <MessageSquare className="w-4 h-4" /> : <BellRing className="w-4 h-4" />}
                {alert.type}
              </div>
              <div>
                <div className="text-xs text-espresso-70 mb-1">Status</div>
                <RiskBadge 
                  tier={alert.status === 'delivered' ? 'NORMAL' : alert.status === 'dispatched' ? 'WATCH' : 'HIGH'} 
                  label={alert.status.toUpperCase()} 
                />
              </div>
              <div>
                <div className="text-xs text-espresso-70 mb-1">Target Audience</div>
                <div className="font-bold text-sm">{alert.target}</div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="text-xs text-espresso-70 mb-1 uppercase tracking-widest font-bold">Trigger Event</div>
                <div className="text-risk-deep-rust font-bold">{alert.trigger}</div>
              </div>
              <div className="bg-white p-4 rounded border border-espresso/10 relative">
                <div className="absolute top-0 right-0 bg-espresso text-cream text-[10px] uppercase font-bold px-2 py-1 rounded-bl rounded-tr">
                  {alert.language}
                </div>
                <p className="font-medium text-lg leading-relaxed pt-2">
                  {alert.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
