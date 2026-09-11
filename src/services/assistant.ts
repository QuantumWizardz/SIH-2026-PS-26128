import diseasesData from '../mock/diseases.json';
import facilitiesData from '../mock/facilities.json';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  ui?: any; // For rendering custom UI components in chat
}

// Simple rule-based parser
export const processUserMessage = async (message: string): Promise<ChatMessage> => {
  const lowerMsg = message.toLowerCase();
  let responseText = "I'm sorry, I didn't understand that. You can ask about diseases, facility locations, or report symptoms.";
  let ui = null;

  // Flow 1: Disease lookup
  // "What are the symptoms of LSD?"
  if (lowerMsg.includes('symptom') || lowerMsg.includes('disease')) {
    const matchedDisease = diseasesData.find(d => 
      lowerMsg.includes(d.abbreviation.toLowerCase()) || 
      (d.disease_name.en && lowerMsg.includes(d.disease_name.en.toLowerCase()))
    );

    if (matchedDisease) {
      responseText = `Here is information on ${matchedDisease.disease_name.en} (${matchedDisease.abbreviation}):`;
      ui = {
        type: 'disease_card',
        disease: matchedDisease
      };
    } else {
      responseText = "Which disease are you asking about? For example, ask about LSD or FMD.";
    }
  }

  // Flow 2: Facility lookup
  // "Where is the nearest lab?"
  else if (lowerMsg.includes('lab') || lowerMsg.includes('facility') || lowerMsg.includes('hospital')) {
    // Just find a diagnostic lab in Rajpura (V01) as default for demo
    const lab = facilitiesData.find(f => f.type === 'diagnostic_laboratory');
    if (lab) {
      responseText = `The nearest lab is ${lab.name}.`;
      ui = {
        type: 'facility_card',
        facility: lab,
        whyRecommended: [
          'It is the closest facility with the required diagnostic capabilities.',
          'Currently marked as available with high capacity.',
          'Maintains cold chain for sample integrity.'
        ]
      };
    } else {
      responseText = "I couldn't find a nearby facility.";
    }
  }

  // Flow 3: Reporting flow
  // "My cow has a fever"
  else if (lowerMsg.includes('my') || lowerMsg.includes('has a') || lowerMsg.includes('fever')) {
    // Extract species
    let species = 'unknown';
    if (lowerMsg.includes('cow')) species = 'cattle';
    if (lowerMsg.includes('buffalo')) species = 'buffalo';
    if (lowerMsg.includes('pig')) species = 'pig';
    
    // Extract symptom
    let symptom = 'unknown';
    if (lowerMsg.includes('fever')) symptom = 'fever';

    responseText = `I've prepared a draft report for your ${species} with ${symptom}. Please provide your village ID to submit it.`;
    ui = {
      type: 'draft_report',
      species,
      symptom
    };
  }
  
  else if (lowerMsg.includes('v01') || lowerMsg.includes('village')) {
    responseText = "Thank you. Your report has been submitted successfully to the local authorities.";
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: crypto.randomUUID(),
        sender: 'assistant',
        text: responseText,
        ui
      });
    }, 800); // Simulated 800ms delay
  });
};
