import weatherData from '../../mock/weather.json';
import { CloudRain, Thermometer, Wind, AlertTriangle } from 'lucide-react';

export function WeatherDashboard() {
  const districts = Object.entries(weatherData.districts).map(([name, data]) => ({
    name,
    ...data
  }));

  const calculateRisk = (rainfall: number, temp: number) => {
    const risks = [];
    if (rainfall > 20 && temp > 30) {
      risks.push({ disease: 'HS / FMD Catalyst', desc: 'High humidity & temperature favors outbreak.' });
    }
    if (rainfall < 5 && temp < 15) {
      risks.push({ disease: 'PPR Catalyst', desc: 'Cold & dry conditions favor PPR.' });
    }
    if (temp > 40) {
      risks.push({ disease: 'Heat Stress', desc: 'Decreased immunity & milk yield.' });
    }
    return risks;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight">Weather Context</h1>
        <p className="text-lg text-espresso-70">Environmental conditions directly influence disease vectors and herd immunity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {districts.map((district) => {
          const risks = calculateRisk(district.rainfallLast7dMm, district.tempC);
          const hasRisk = risks.length > 0;

          return (
            <div key={district.name} className="bg-cream p-6 rounded-soft shadow-sm border border-espresso/10 flex flex-col h-full">
              <h2 className="text-xl font-bold mb-6 text-center capitalize">{district.name}</h2>
              
              <div className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-espresso-70">
                    <Thermometer className="w-5 h-5 mr-2" />
                    <span>Temperature</span>
                  </div>
                  <span className="font-bold text-lg">{district.tempC}°C</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-espresso-70">
                    <CloudRain className="w-5 h-5 mr-2" />
                    <span>Rainfall (7d)</span>
                  </div>
                  <span className="font-bold text-lg">{district.rainfallLast7dMm} mm</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-espresso-70">
                    <Wind className="w-5 h-5 mr-2" />
                    <span>Humidity</span>
                  </div>
                  <span className="font-bold text-lg">{district.humidityPct}%</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-espresso/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-espresso-40 mb-4">Risk Profile</h3>
                {hasRisk ? (
                  <div className="space-y-3">
                    {risks.map((r, i) => (
                      <div key={i} className="bg-risk-deep-rust/10 p-3 rounded border border-risk-deep-rust/20">
                        <div className="flex items-center font-bold text-risk-deep-rust mb-1 text-sm">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          {r.disease}
                        </div>
                        <div className="text-xs text-espresso-70">{r.desc}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-4 text-espresso-40">
                    <span className="text-sm font-medium">Standard baseline conditions</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
