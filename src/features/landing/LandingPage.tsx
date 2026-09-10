import { Link } from 'react-router-dom';
import { Radar, BookOpen, CloudRain, Map, CreditCard, Activity, PhoneCall, Zap, Stethoscope } from 'lucide-react';

export function LandingPage() {
  const features = [
    { title: 'Outbreak Radar', desc: 'Real-time spatial clustering & containment mapping', icon: Radar, to: '/radar', color: 'bg-terracotta text-cream' },
    { title: 'Triage Queue', desc: 'Automated prioritization of incident reports', icon: Activity, to: '/triage', color: 'bg-risk-deep-rust text-cream' },
    { title: 'Command Centre', desc: 'Geospatial market and route containment', icon: Map, to: '/command', color: 'bg-espresso text-cream' },
    { title: 'Weather Context', desc: 'Environmental catalyst tracking (IMD synced)', icon: CloudRain, to: '/weather', color: 'bg-[#3B82F6] text-white' },
    { title: 'Disease Knowledge', desc: 'Exploratory database and clinical guidelines', icon: BookOpen, to: '/knowledge', color: 'bg-[#10B981] text-white' },
    { title: 'Symptom Checker', desc: 'Self-serve diagnosis and auto-escalation', icon: Stethoscope, to: '/symptom-checker', color: 'bg-[#8B5CF6] text-white' },
    { title: 'Facility Finder', desc: 'Locate nearest hospitals and cold chains', icon: Map, to: '/facilities', color: 'bg-[#F59E0B] text-white' },
    { title: 'Animal Passport', desc: 'Digital identity and vaccination records', icon: CreditCard, to: '/passport', color: 'bg-[#6366F1] text-white' },
    { title: 'Offline Reporter', desc: 'Store-and-forward mobile reporting', icon: Zap, to: '/report', color: 'bg-risk-moss text-white' },
    { title: 'IVR Simulator', desc: 'Feature-phone reporting emulation', icon: PhoneCall, to: '/ivr', color: 'bg-risk-ochre text-white' },
    { title: 'Alerts Dispatcher', desc: 'Multilingual mass-notification via SMS/WA', icon: BellRing, to: '/alerts', color: 'bg-risk-burnt-orange text-white' },
    { title: 'API Integrations', desc: 'Status of INAPH / e-Pashuhaat bridges', icon: Server, to: '/integrations', color: 'bg-slate-700 text-white' }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-cream-deep/30 -mt-6 -mx-6 md:-mx-12 lg:-mx-16 p-6 md:p-12 lg:p-16">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-espresso leading-tight">
            Livestock Health <br/>
            <span className="text-terracotta">Intelligence Platform</span>
          </h1>
          <p className="text-xl text-espresso-70 leading-relaxed">
            An end-to-end prototype designed to detect, contain, and manage disease outbreaks using geospatial analytics and predictive modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map(f => (
            <Link key={f.to} to={f.to} className="group block h-full">
              <div className="bg-white p-6 rounded-soft shadow-sm border border-espresso/10 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-inner ${f.color} group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-terracotta transition-colors">{f.title}</h3>
                <p className="text-sm text-espresso-70 leading-relaxed">{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ensure lucide imports for LandingPage
import { BellRing, Server } from 'lucide-react';
