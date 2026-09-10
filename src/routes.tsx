import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useStore } from './store';
import { useTranslation } from 'react-i18next';
import type { UserRole } from './store/sessionSlice';
import { Styleguide } from './features/styleguide/Styleguide';
import { RadarPage } from './features/radar/RadarPage';
import { DiseaseExplorer } from './features/knowledge/DiseaseExplorer';
import { SymptomChecker } from './features/knowledge/SymptomChecker';
import { CommandCentre } from './features/command/CommandCentre';
import { WeatherDashboard } from './features/weather/WeatherDashboard';
import { FacilityFinder } from './features/facilities/FacilityFinder';
import { AnimalPassport } from './features/passport/AnimalPassport';
import { AppointmentBooking } from './features/passport/AppointmentBooking';
import { OfflineReporter } from './features/reporter/OfflineReporter';
import { IVRSimulator } from './features/simulation/IVRSimulator';
import { AlertsDispatcher } from './features/simulation/AlertsDispatcher';
import { TriageQueue } from './features/triage/TriageQueue';
import { ApiIntegrations } from './features/integrations/ApiIntegrations';
import { LandingPage } from './features/landing/LandingPage';

function Shell({ children }: { children: React.ReactNode }) {
  const { currentRole, setRole } = useStore();
  const { i18n } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-espresso/10 bg-cream-deep/50">
        <div className="flex items-center space-x-8">
          <Link to="/" className="font-extrabold text-xl tracking-tight">Pashu Rakshak</Link>
          <nav className="flex space-x-6 text-sm font-medium tracking-wide overflow-x-auto pb-1 max-w-2xl whitespace-nowrap scrollbar-hide">
            <Link to="/radar" className="hover:text-terracotta transition-colors">RADAR</Link>
            <Link to="/command" className="hover:text-terracotta transition-colors">COMMAND</Link>
            <Link to="/facilities" className="hover:text-terracotta transition-colors">FACILITIES</Link>
            <Link to="/weather" className="hover:text-terracotta transition-colors">WEATHER</Link>
            <Link to="/knowledge" className="hover:text-terracotta transition-colors">DISEASES</Link>
            <Link to="/symptom-checker" className="hover:text-terracotta transition-colors">CHECKER</Link>
            <Link to="/passport" className="hover:text-terracotta transition-colors">PASSPORT</Link>
            <Link to="/report" className="hover:text-terracotta transition-colors">REPORT</Link>
            <Link to="/ivr" className="hover:text-terracotta transition-colors">IVR</Link>
            <Link to="/alerts" className="hover:text-terracotta transition-colors">ALERTS</Link>
            <Link to="/styleguide" className="hover:text-terracotta transition-colors">STYLEGUIDE</Link>
            {/* Nav links based on role will go here */}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={currentRole} 
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="bg-transparent border-b border-espresso-40 text-sm py-1 outline-none focus:border-terracotta"
          >
            <option value="Farmer">Farmer</option>
            <option value="Veterinarian">Veterinarian</option>
            <option value="FieldOfficer">Field Officer</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="bg-transparent border-b border-espresso-40 text-sm py-1 outline-none focus:border-terracotta"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
          </select>
          {/* Sync Pill (F2 placeholder) */}
          <div className="text-xs px-2 py-1 rounded-full border border-espresso/20 text-espresso-70 bg-sand">
            ✓ Connected
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-[1280px] mx-auto p-6 md:p-12 lg:p-16">
        {children}
      </main>
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/triage" element={<TriageQueue />} />
          <Route path="/command" element={<CommandCentre />} />
          <Route path="/facilities" element={<FacilityFinder />} />
          <Route path="/weather" element={<WeatherDashboard />} />
          <Route path="/knowledge" element={<DiseaseExplorer />} />
          <Route path="/symptom-checker" element={<SymptomChecker />} />
          <Route path="/passport" element={<AnimalPassport />} />
          <Route path="/book-appointment" element={<AppointmentBooking />} />
          <Route path="/report" element={<OfflineReporter />} />
          <Route path="/ivr" element={<IVRSimulator />} />
          <Route path="/alerts" element={<AlertsDispatcher />} />
          <Route path="/integrations" element={<ApiIntegrations />} />
          <Route path="/styleguide" element={<Styleguide />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}
