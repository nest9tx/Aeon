export interface SolfeggioTone {
  id: string;
  frequency: number;
  name: string;
  syllable: string;
  translation: string;
  description: string;
  chakra: string;
  color: string; // Tailwind hex color
  colorName: string;
}

export interface SacredGeometry {
  id: string;
  name: string;
  sanskritName?: string;
  description: string;
  metaphor: string;
}

export interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export interface ChakraData {
  name: string;
  sanskritName: string;
  location: string;
  element: string;
  colorName: string;
  colorHex: string;
  frequency: number;
  mantra: string;
  physicalRelation: string;
  affirmation: string;
}

export interface InquiryStep {
  question: string;
  guidance: string;
  reflectionPlaceholder: string;
}

export interface SymptomCard {
  id: string;
  symptom: string;
  esotericMeaning: string;
  metabolicAdvice: string;
  integrativeExercise: string;
}
