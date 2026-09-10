export const NOW = new Date('2026-09-09T09:00:00+05:30');

let simulatedTime = NOW.getTime();

export const getClock = () => new Date(simulatedTime);

export const advanceClock = (hours: number) => {
  simulatedTime += hours * 60 * 60 * 1000;
  // TODO: emit clock:advanced event via bus
};

export const resetClock = () => {
  simulatedTime = NOW.getTime();
  // TODO: emit clock:reset event via bus
};
