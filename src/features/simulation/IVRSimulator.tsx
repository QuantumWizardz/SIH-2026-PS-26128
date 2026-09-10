import { useState } from 'react';
import { Phone, PhoneOff, Mic } from 'lucide-react';
import { Button } from '../../design/Button';

// Mock IVR State Machine
const ivrPrompts: Record<string, { audio: string, options?: Record<string, string> }> = {
  root: {
    audio: "Welcome to Pashu Rakshak. For Punjabi, press 1. For English, press 2.",
    options: { "1": "punjabi_root", "2": "english_root" }
  },
  english_root: {
    audio: "To report an outbreak, press 1. For weather alerts, press 2. To speak to a vet, press 9.",
    options: { "1": "report_species", "2": "weather_info", "9": "transfer_vet" }
  },
  punjabi_root: {
    audio: "ਪਸ਼ੂ ਰੱਖਿਅਕ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ। ਬਿਮਾਰੀ ਦੀ ਰਿਪੋਰਟ ਲਈ 1 ਦਬਾਓ।",
    options: { "1": "report_species", "2": "weather_info", "9": "transfer_vet" }
  },
  report_species: {
    audio: "For Cattle, press 1. For Buffalo, press 2. For Poultry, press 3.",
    options: { "1": "report_symptoms", "2": "report_symptoms", "3": "report_symptoms" }
  },
  report_symptoms: {
    audio: "If the animal has high fever and blisters, press 1. If it has difficulty breathing, press 2.",
    options: { "1": "report_confirm", "2": "report_confirm" }
  },
  report_confirm: {
    audio: "Your report has been logged. An emergency vet will contact you shortly. Thank you.",
  },
  weather_info: {
    audio: "Heavy rain is expected in Patiala tomorrow. Please keep animals indoors.",
  },
  transfer_vet: {
    audio: "Transferring you to the nearest veterinary officer. Please hold.",
  }
};

export function IVRSimulator() {
  const [isActive, setIsActive] = useState(false);
  const [currentNode, setCurrentNode] = useState('root');
  const [transcript, setTranscript] = useState<string[]>([]);

  const handleCall = () => {
    setIsActive(true);
    setCurrentNode('root');
    setTranscript([`[System]: ${ivrPrompts.root.audio}`]);
  };

  const handleHangup = () => {
    setIsActive(false);
    setTranscript(prev => [...prev, '[System]: Call disconnected.']);
  };

  const handleKeypad = (key: string) => {
    if (!isActive) return;
    
    setTranscript(prev => [...prev, `[User Pressed]: ${key}`]);
    
    const node = ivrPrompts[currentNode];
    if (node && node.options && node.options[key]) {
      const nextNodeId = node.options[key];
      const nextNode = ivrPrompts[nextNodeId];
      setCurrentNode(nextNodeId);
      setTimeout(() => {
        setTranscript(prev => [...prev, `[System]: ${nextNode.audio}`]);
        if (!nextNode.options) {
          // End of flow
          setTimeout(() => handleHangup(), 3000);
        }
      }, 500);
    } else {
      setTimeout(() => {
        setTranscript(prev => [...prev, `[System]: Invalid option. ${node.audio}`]);
      }, 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">IVR Simulator (F10)</h1>
        <p className="text-lg text-espresso-70">Simulate farmer feature-phone interaction for offline reporting.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
        {/* Phone UI */}
        <div className="w-72 bg-espresso p-4 rounded-[2rem] shadow-2xl relative border-4 border-espresso-70 flex-shrink-0">
          {/* Screen */}
          <div className="bg-cream h-64 rounded-xl mb-6 p-4 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between text-xs text-espresso-70 font-bold mb-4">
              <span>Jio 4G</span>
              <span>100%</span>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              {isActive ? (
                <>
                  <div className="w-16 h-16 bg-risk-forest/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Mic className="w-8 h-8 text-risk-forest" />
                  </div>
                  <div className="font-bold text-lg">0181-222-3333</div>
                  <div className="text-sm text-espresso-70">Connected</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-espresso-40">Ready</div>
                  <div className="text-2xl font-bold mt-2">Pashu Helpline</div>
                </>
              )}
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
              <button 
                key={key}
                onClick={() => handleKeypad(key)}
                className="bg-espresso-70 hover:bg-espresso-40 text-cream h-12 rounded-full font-bold text-xl transition-colors active:scale-95"
              >
                {key}
              </button>
            ))}
          </div>

          {/* Call Controls */}
          <div className="flex justify-center gap-6">
            {!isActive ? (
              <button 
                onClick={handleCall}
                className="w-16 h-16 bg-risk-forest hover:bg-risk-forest/80 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Phone className="w-8 h-8" />
              </button>
            ) : (
              <button 
                onClick={handleHangup}
                className="w-16 h-16 bg-risk-deep-rust hover:bg-risk-deep-rust/80 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <PhoneOff className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>

        {/* Live Transcript */}
        <div className="w-full md:w-[400px] bg-sand p-6 rounded-soft shadow-sm border border-espresso/10 h-[500px] flex flex-col">
          <h2 className="text-sm font-bold uppercase tracking-widest text-espresso-40 mb-4 pb-4 border-b border-espresso/10">Call Transcript</h2>
          <div className="flex-1 overflow-y-auto space-y-4 font-mono text-sm pr-2">
            {transcript.length === 0 && <div className="text-espresso-40 italic">Waiting for call...</div>}
            {transcript.map((line, i) => (
              <div key={i} className={`p-3 rounded ${line.startsWith('[User') ? 'bg-white border border-espresso/10 ml-8' : 'bg-terracotta/10 text-espresso mr-8'}`}>
                {line}
              </div>
            ))}
          </div>
          <div className="pt-4 mt-4 border-t border-espresso/10">
            <Button variant="secondary" size="sm" onClick={() => setTranscript([])}>Clear Log</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
