import { useState } from 'react';
import slotsData from '../../mock/appointment_slots.json';
import animalsData from '../../mock/animals.json';
import { Button } from '../../design/Button';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

export function AppointmentBooking() {
  const navigate = useNavigate();
  const animal = animalsData[0]; // Assuming user owns this animal
  const availableSlots = slotsData.filter(s => s.status === 'available');

  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState('Vaccination Booster');
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = () => {
    setIsBooked(true);
    // In real app, dispatch to store/API
  };

  if (isBooked) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <CheckCircle2 className="w-24 h-24 text-risk-forest mx-auto" />
        <h1 className="text-4xl font-extrabold tracking-tight">Appointment Confirmed!</h1>
        <p className="text-lg text-espresso-70">
          Your appointment for {animal.animal_id} has been scheduled.
        </p>
        <div className="pt-8">
          <Button variant="secondary" onClick={() => navigate('/passport')}>Back to Passport</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Book Visit</h1>
        <p className="text-lg text-espresso-70">Schedule a veterinary service for Tag {animal.animal_id}</p>
      </div>

      <div className="bg-sand p-8 rounded-soft space-y-8 shadow-sm">
        {/* Step 1: Select Slot */}
        <div className={`space-y-4 ${step > 1 ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-espresso text-cream w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> 
            Select Time
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {availableSlots.map(slot => (
              <button
                key={slot.slot_id}
                onClick={() => { setSelectedSlot(slot.slot_id); setStep(2); }}
                className={`p-4 rounded border text-left transition-colors ${
                  selectedSlot === slot.slot_id 
                    ? 'border-terracotta bg-terracotta/5 shadow-inner' 
                    : 'bg-white border-espresso/10 hover:border-espresso/30'
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold mb-1">
                  <Calendar className="w-4 h-4 text-espresso-40" />
                  {slot.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-espresso-70">
                  <Clock className="w-4 h-4 text-espresso-40" />
                  {slot.start_time}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Reason */}
        <div className={`space-y-4 ${step < 2 ? 'opacity-50 pointer-events-none' : ''}`}>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-espresso text-cream w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> 
            Service Needed
          </h2>
          <select 
            className="w-full px-4 py-3 bg-white border border-espresso/20 rounded outline-none focus:border-terracotta"
            value={reason}
            onChange={e => setReason(e.target.value)}
          >
            <option>Vaccination Booster</option>
            <option>General Checkup</option>
            <option>Illness Diagnosis</option>
            <option>Artificial Insemination</option>
          </select>
        </div>

        <div className="pt-8 border-t border-espresso/10 flex justify-end">
          <Button size="lg" disabled={!selectedSlot} onClick={handleBook}>
            Confirm Booking
          </Button>
        </div>
      </div>
    </div>
  );
}
