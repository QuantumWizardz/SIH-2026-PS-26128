import { simulationScript } from '../mock/simulation_script';
import { advanceClock } from './clock';
import { bus } from './bus';
import { addReport } from './radar';

class SimulationEngine {
  private active = false;
  private timer: ReturnType<typeof setInterval> | null = null;
  private virtualHoursPassed = 0;

  start() {
    if (this.active) return;
    this.active = true;
    
    console.log('[Simulation] Started');
    
    // Tick every 2 seconds = 1 virtual hour
    this.timer = setInterval(() => {
      this.virtualHoursPassed += 1;
      advanceClock(1);
      
      // Check for events
      const eventsToTrigger = simulationScript.events.filter(
        e => e.triggerOffsetHours === this.virtualHoursPassed
      );
      
      eventsToTrigger.forEach(e => {
        if (e.type === 'new_report') {
          console.log('[Simulation] Injecting live report:', e.payload.report_id);
          addReport(e.payload);
          bus.emit('report:created', e.payload);
        }
      });
      
    }, 2000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.active = false;
    this.virtualHoursPassed = 0;
    console.log('[Simulation] Stopped');
  }
}

export const simulation = new SimulationEngine();
