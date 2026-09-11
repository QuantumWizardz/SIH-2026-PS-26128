import { Link } from 'react-router-dom';
import { Radar, BookOpen, CloudRain, Map, CreditCard, Activity, PhoneCall, Zap, Stethoscope, BellRing, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LandingPage() {
  const { t } = useTranslation();

  const features = [
    { title: t('landing.features.radar.title'), desc: t('landing.features.radar.desc'), icon: Radar, to: '/radar', color: 'bg-terracotta text-cream' },
    { title: t('landing.features.triage.title'), desc: t('landing.features.triage.desc'), icon: Activity, to: '/triage', color: 'bg-risk-deep-rust text-cream' },
    { title: t('landing.features.command.title'), desc: t('landing.features.command.desc'), icon: Map, to: '/command', color: 'bg-espresso text-cream' },
    { title: t('landing.features.weather.title'), desc: t('landing.features.weather.desc'), icon: CloudRain, to: '/weather', color: 'bg-[#3B82F6] text-white' },
    { title: t('landing.features.knowledge.title'), desc: t('landing.features.knowledge.desc'), icon: BookOpen, to: '/knowledge', color: 'bg-[#10B981] text-white' },
    { title: t('landing.features.symptom.title'), desc: t('landing.features.symptom.desc'), icon: Stethoscope, to: '/symptom-checker', color: 'bg-[#8B5CF6] text-white' },
    { title: t('landing.features.facility.title'), desc: t('landing.features.facility.desc'), icon: Map, to: '/facilities', color: 'bg-[#F59E0B] text-white' },
    { title: t('landing.features.passport.title'), desc: t('landing.features.passport.desc'), icon: CreditCard, to: '/passport', color: 'bg-[#6366F1] text-white' },
    { title: t('landing.features.report.title'), desc: t('landing.features.report.desc'), icon: Zap, to: '/report', color: 'bg-risk-moss text-white' },
    { title: t('landing.features.ivr.title'), desc: t('landing.features.ivr.desc'), icon: PhoneCall, to: '/ivr', color: 'bg-risk-ochre text-white' },
    { title: t('landing.features.alerts.title'), desc: t('landing.features.alerts.desc'), icon: BellRing, to: '/alerts', color: 'bg-risk-burnt-orange text-white' },
    { title: t('landing.features.api.title'), desc: t('landing.features.api.desc'), icon: Server, to: '/integrations', color: 'bg-slate-700 text-white' }
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-cream-deep/30 -mt-6 -mx-6 md:-mx-12 lg:-mx-16 p-6 md:p-12 lg:p-16">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-espresso leading-tight">
            {t('landing.hero.title_part1')} <br/>
            <span className="text-terracotta">{t('landing.hero.title_part2')}</span>
          </h1>
          <p className="text-xl text-espresso-70 leading-relaxed">
            {t('landing.hero.subtitle')}
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


