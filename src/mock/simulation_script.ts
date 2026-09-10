

export const simulationScript = {
  // Live simulation events that trigger over time
  events: [
    {
      id: "SIM_01",
      triggerOffsetHours: 1, // 1 hour after NOW
      type: "new_report",
      payload: {
        report_id: "R_SIM_01",
        village_id: "V01",
        latitude: 30.484,
        longitude: 76.594,
        species: "cattle",
        symptoms: ["fever", "mouth_lesions", "lameness"],
        animals_affected: 3,
        deaths: 0,
        source: "mobile",
        reporter_role: "Farmer"
      }
    },
    {
      id: "SIM_02",
      triggerOffsetHours: 3,
      type: "new_report",
      payload: {
        report_id: "R_SIM_02",
        village_id: "V02",
        latitude: 30.355,
        longitude: 76.640,
        species: "buffalo",
        symptoms: ["fever", "excessive_salivation"],
        animals_affected: 2,
        deaths: 0,
        source: "ivr",
        reporter_role: "Farmer"
      }
    }
  ]
};
