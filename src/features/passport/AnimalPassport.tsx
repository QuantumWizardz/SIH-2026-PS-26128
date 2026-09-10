
import animalsData from '../../mock/animals.json';
import herdsData from '../../mock/herds.json';
import { Button } from '../../design/Button';
import { QrCode, ShieldCheck, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function AnimalPassport() {
  const navigate = useNavigate();
  // Assume viewing the first animal in the mock
  const animal = animalsData[0];
  const herd = herdsData.find(h => h.herd_id === animal.herd_id);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Digital Passport</h1>
          <p className="text-espresso-70 text-lg">Official health & identity record (INAPH linked).</p>
        </div>
        <Button variant="primary" onClick={() => navigate('/book-appointment')}>
          Book Vet Visit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-8">
          <div className="bg-cream p-8 rounded-soft border border-espresso/10 text-center flex flex-col items-center">
            <div className="bg-white p-4 rounded shadow-sm mb-6 inline-block">
              <QrCode className="w-32 h-32 text-espresso" />
            </div>
            <h2 className="text-2xl font-bold font-mono tracking-widest">{animal.animal_id}</h2>
            <div className="text-sm font-bold text-espresso-40 uppercase tracking-widest mt-2">Tag ID</div>
          </div>
          
          <div className="bg-risk-forest/10 p-6 rounded-soft border border-risk-forest/20 flex items-start gap-4 text-risk-forest">
            <ShieldCheck className="w-8 h-8 flex-shrink-0" />
            <div>
              <div className="font-bold mb-1">Vaccination Status: Secure</div>
              <div className="text-sm text-espresso-70">Last vaccinated on {herd?.last_vaccination_date}. Next booster due in 3 months.</div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-soft border border-espresso/10">
            <h3 className="text-lg font-bold uppercase tracking-widest text-espresso-40 mb-6 border-b border-espresso/10 pb-4">Identity Details</h3>
            <div className="grid grid-cols-2 gap-y-6">
              <div>
                <div className="text-sm text-espresso-70 mb-1">Species</div>
                <div className="font-bold text-lg capitalize">{animal.species}</div>
              </div>
              <div>
                <div className="text-sm text-espresso-70 mb-1">Breed</div>
                <div className="font-bold text-lg">{animal.breed}</div>
              </div>
              <div>
                <div className="text-sm text-espresso-70 mb-1">Age</div>
                <div className="font-bold text-lg">{animal.age_months} Months</div>
              </div>
              <div>
                <div className="text-sm text-espresso-70 mb-1">Sex</div>
                <div className="font-bold text-lg">{animal.sex}</div>
              </div>
              <div>
                <div className="text-sm text-espresso-70 mb-1">Farmer ID</div>
                <div className="font-bold text-lg">{animal.owner_id}</div>
              </div>
              <div>
                <div className="text-sm text-espresso-70 mb-1">Herd ID</div>
                <div className="font-bold text-lg">{animal.herd_id}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-soft border border-espresso/10">
            <h3 className="text-lg font-bold uppercase tracking-widest text-espresso-40 mb-6 border-b border-espresso/10 pb-4">Health History</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1"><Activity className="w-5 h-5 text-terracotta" /></div>
                <div>
                  <div className="font-bold">FMD Vaccination Booster</div>
                  <div className="text-sm text-espresso-70 mb-1">Administered by Dr. Sharma at Village Camp</div>
                  <div className="text-xs font-bold text-espresso-40 uppercase">{herd?.last_vaccination_date}</div>
                </div>
              </div>
              <div className="flex gap-4 opacity-50">
                <div className="mt-1"><Activity className="w-5 h-5 text-terracotta" /></div>
                <div>
                  <div className="font-bold">Initial Tagging & Registration</div>
                  <div className="text-sm text-espresso-70 mb-1">Registered into INAPH</div>
                  <div className="text-xs font-bold text-espresso-40 uppercase">{animal.tag_date}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
