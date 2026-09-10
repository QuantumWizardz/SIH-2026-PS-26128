import { useState, useEffect } from 'react';
import { Button } from '../../design/Button';
import { bus } from '../../services/bus';
import { addReport } from '../../services/radar';
import { WifiOff, Wifi, UploadCloud, CheckCircle2 } from 'lucide-react';

const SYMPTOMS_LIST = [
  "fever", "mouth_lesions", "excessive_salivation", "skin_nodules", 
  "lameness", "nasal_discharge", "diarrhoea", "reduced_appetite", 
  "swelling", "coughing", "sudden_death"
];

export function OfflineReporter() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState<any[]>([]);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form state
  const [village, setVillage] = useState('V01');
  const [species, setSpecies] = useState('cattle');
  const [animalsAffected, setAnimalsAffected] = useState(1);
  const [deaths, setDeaths] = useState(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);

  useEffect(() => {
    // Load queue
    const saved = localStorage.getItem('pashu_offline_queue');
    if (saved) {
      try { setQueue(JSON.parse(saved)); } catch (e) {}
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveQueue = (newQueue: any[]) => {
    setQueue(newQueue);
    localStorage.setItem('pashu_offline_queue', JSON.stringify(newQueue));
  };

  const toggleSymptom = (sym: string) => {
    setSymptoms(prev => 
      prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]
    );
  };

  const handleSubmit = () => {
    const report = {
      report_id: `R_OFF_${Date.now()}`,
      timestamp: new Date().toISOString(),
      latitude: 30.485, // Mocks based on village could be injected
      longitude: 76.590,
      village_id: village,
      district: "Patiala", // Mock
      species,
      animals_affected: animalsAffected,
      deaths,
      symptoms,
      source: isOnline ? "mobile" : "offline_sync",
      reporter_role: "Farmer"
    };

    if (isOnline) {
      // Send immediately
      addReport(report);
      bus.emit('report:created', report);
    } else {
      // Queue it
      saveQueue([...queue, report]);
    }

    setIsSubmitted(true);
  };

  const handleSync = () => {
    if (!isOnline) return;
    queue.forEach(report => {
      addReport(report);
      bus.emit('report:created', report);
    });
    saveQueue([]);
  };

  const resetForm = () => {
    setStep(1);
    setSymptoms([]);
    setAnimalsAffected(1);
    setDeaths(0);
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      {/* Network Status Bar */}
      <div className={`p-4 flex items-center justify-between rounded-soft font-bold text-cream shadow-sm ${isOnline ? 'bg-risk-forest' : 'bg-risk-deep-rust'}`}>
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          {isOnline ? 'Online - Connected to Command Centre' : 'Offline Mode - Reports will be queued'}
        </div>
        {!isOnline && queue.length > 0 && (
          <div className="text-sm bg-black/20 px-3 py-1 rounded">
            {queue.length} Pending
          </div>
        )}
        {isOnline && queue.length > 0 && (
          <Button variant="secondary" size="sm" onClick={handleSync} className="flex items-center gap-2 border-transparent hover:bg-black/10">
            <UploadCloud className="w-4 h-4" /> Sync Now ({queue.length})
          </Button>
        )}
      </div>

      {isSubmitted ? (
        <div className="bg-sand p-12 rounded-soft text-center space-y-6">
          <CheckCircle2 className="w-24 h-24 text-risk-forest mx-auto" />
          <h2 className="text-3xl font-extrabold tracking-tight">Report Saved!</h2>
          <p className="text-lg text-espresso-70">
            {isOnline 
              ? 'Your report has been sent securely to the command centre.' 
              : 'Your report is safely queued on your device and will send automatically when connection is restored.'}
          </p>
          <div className="pt-8">
            <Button onClick={resetForm}>Report Another Case</Button>
          </div>
        </div>
      ) : (
        <div className="bg-sand p-8 rounded-soft space-y-8 shadow-sm">
          <div className="text-center space-y-2 mb-8 border-b border-espresso/10 pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">File Outbreak Report</h1>
            <p className="text-espresso-70">Step {step} of 2</p>
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-espresso-70 mb-2">Village</label>
                <select 
                  className="w-full px-4 py-3 bg-white border border-espresso/20 rounded outline-none focus:border-terracotta"
                  value={village}
                  onChange={e => setVillage(e.target.value)}
                >
                  <option value="V01">Rajpura (V01)</option>
                  <option value="V02">Ghanaur (V02)</option>
                  <option value="V06">Bhadson (V06)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-espresso-70 mb-2">Species Affected</label>
                <select 
                  className="w-full px-4 py-3 bg-white border border-espresso/20 rounded outline-none focus:border-terracotta"
                  value={species}
                  onChange={e => setSpecies(e.target.value)}
                >
                  <option value="cattle">Cattle</option>
                  <option value="buffalo">Buffalo</option>
                  <option value="goat">Goat</option>
                  <option value="sheep">Sheep</option>
                  <option value="pig">Pig</option>
                  <option value="poultry">Poultry</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-espresso-70 mb-2">Sick Animals</label>
                  <input 
                    type="number" min="1" 
                    className="w-full px-4 py-3 bg-white border border-espresso/20 rounded outline-none focus:border-terracotta"
                    value={animalsAffected}
                    onChange={e => setAnimalsAffected(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-espresso-70 mb-2">Deaths</label>
                  <input 
                    type="number" min="0" 
                    className="w-full px-4 py-3 bg-white border border-espresso/20 rounded outline-none focus:border-terracotta"
                    value={deaths}
                    onChange={e => setDeaths(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="pt-8 flex justify-end">
                <Button onClick={() => setStep(2)}>Next Step</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-espresso-70 mb-4">Select Observed Symptoms</label>
                <div className="flex flex-wrap gap-3">
                  {SYMPTOMS_LIST.map(sym => {
                    const isSelected = symptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        onClick={() => toggleSymptom(sym)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                          isSelected 
                            ? 'bg-terracotta border-terracotta text-cream shadow-inner' 
                            : 'bg-white border-espresso/20 text-espresso hover:border-espresso/40'
                        }`}
                      >
                        {sym.replace(/_/g, ' ')}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-espresso-70 mb-2">Attach Media (Optional)</label>
                <div className="border-2 border-dashed border-espresso/20 rounded-soft p-8 text-center text-espresso-40 hover:bg-espresso/5 transition-colors cursor-pointer">
                  Click to take photo or record audio
                </div>
              </div>

              <div className="pt-8 flex justify-between">
                <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleSubmit} disabled={symptoms.length === 0}>
                  {isOnline ? 'Submit Report' : 'Save to Queue'}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
