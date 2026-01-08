// ===================================================
// Care Navigator – Rule-Based Symptom Triage Engine
// No AI | Fast | Offline | Deterministic | Safe
// ===================================================

// -------------------------------
// TYPES
// -------------------------------
export interface Recommendation {
  level: "self-care" | "teleconsult" | "urgent";
  title: string;
  description: string;
  actions: string[];
}

export interface RedFlag {
  message: string;
  action: string;
}

export interface IrrelevantResponse {
  type: "irrelevant";
  message: string;
}

export interface ValidationResponse {
  type: "accepted" | "retry";
  message?: string;
  value?: any;
}

export interface StepResult {
  advance: boolean;
  botMessage?: string;
  value?: any;
}

// -------------------------------
// HEALTH INTENT KEYWORDS
// -------------------------------
const HEALTH_KEYWORDS = [
  "pain","fever","cough","cold","headache","migraine",
  "vomit","nausea","breath","breathing","chest",
  "stomach","abdominal","dizzy","infection","injury",
  "bleeding","seizure","fits","fainted","unconscious",
  "symptom","sick","ill","medicine","doctor",
  "hospital","emergency","bp","blood pressure",
  "diabetes","asthma","temperature","fatigue","weakness","throat",
  "diarrhea","cramps","allergy","rash","swelling","high","cold","chills","body ache","coughing","sneezing"
  ,"congestion","sore throat","photophobia","urine","sprain","twist","bruise","cardiac","convulsions",
  "chest pain","chest tightness","heart pain","pressure","difficulty breathing",
  "can't breathe","shortness of breath","uncontrolled bleeding","blood won't stop","loss of taste","loss of smell"
  ,"food poisoning","itchy eyes","recent food","lower abdomen","abdominal pain","myalgia"
];

// -------------------------------
// INTENT CHECK
// -------------------------------
export function isHealthRelated(text: string): boolean {
  return HEALTH_KEYWORDS.some(k =>
    text.toLowerCase().includes(k)
  );
}

export function irrelevantMessageResponse(): IrrelevantResponse {
  return {
    type: "irrelevant",
    message:
      "I can help only with health-related concerns. Please describe your symptoms (e.g., fever, pain, cough)."
  };
}

// -------------------------------
// RED FLAGS
// -------------------------------
const RED_FLAG_PATTERNS = [
  {
    keywords: ["chest pain","chest tightness","heart pain","pressure","heart attack","cardiac arrest"],
    message: "Possible cardiac-related emergency.",
    action: "Go to the nearest 24×7 hospital or call 108 immediately."
  },
  {
    keywords: ["difficulty breathing","can't breathe","shortness of breath","breathlessness"],
    message: "Severe breathing difficulty detected.",
    action: "Call 108 immediately."
  },
  {
    keywords: ["uncontrolled bleeding","blood won't stop","bleeding heavily","severe bleeding"],
    message: "Risk of major blood loss.",
    action: "Apply pressure and seek emergency care. Call 108 now."
  },
  {
    keywords: ["fainted","unconscious","loss of consciousness","collapsed"],
    message: "Possible loss of consciousness.",
    action: "Call 108 now."
  },
  {
    keywords: ["seizure","fits","convulsions"],
    message: "Seizure activity detected.",
    action: "Seek urgent medical care. Call 108."
  },
  {
    keywords: ["blood vomit","vomiting blood","hematemesis","coughing blood","blood cough"],
    message: "Severe internal bleeding detected.",
    action: "Call 108 immediately. Do not eat or drink."
  },
  {
    keywords: ["severe abdominal pain","intense pain","unbearable pain","acute pain"],
    message: "Severe abdominal pain detected.",
    action: "Call 108 immediately. Seek emergency care."
  },
  {
    keywords: ["stroke","facial drooping","arm weakness","speech difficulty"],
    message: "Possible stroke detected.",
    action: "Call 108 immediately. Time is critical."
  },
  {
    keywords: ["poison","overdose","toxic","poisoning"],
    message: "Possible poisoning or overdose.",
    action: "Call emergency (108) or poison control immediately."
  },
  {
    keywords: ["severe allergic reaction","anaphylaxis","swelling throat","unable to swallow"],
    message: "Severe allergic reaction detected.",
    action: "Call 108 immediately. Seek epinephrine if available."
  }
];

export function checkRedFlags(text: string): RedFlag | null {
  const lower = text.toLowerCase();
  for (const f of RED_FLAG_PATTERNS) {
    if (f.keywords.some(k => lower.includes(k))) {
      return { message: f.message, action: f.action };
    }
  }
  return null;
}

// -------------------------------
// DISEASE INFERENCE
// -------------------------------
// Map of common diseases to related keywords (expandable)
const DISEASE_KEYWORDS: Record<string, string[]> = {
  "Common Cold": ["runny nose", "sore throat", "sneezing", "nasal", "congestion", "cold", "high temperature", "throat", "coughing"],
  "Influenza (Flu)": ["fever", "high fever", "chills", "body ache", "myalgia", "fatigue", "weakness", "temperature", "coughing"],
  "Migraine": ["migraine", "headache", "photophobia", "nausea", "vomiting", "throbbing"],
  "Tension Headache": ["headache", "tight", "pressing", "stress"],
  "Gastritis / Stomach Infection": ["stomach", "abdominal", "pain", "nausea", "vomit", "diarrhea", "cramps", "abdominal pain"],
  "COVID-19": ["loss of taste", "loss of smell", "fever", "cough", "breath", "shortness of breath", "fatigue", "weakness", "temperature"],
  "Urinary Tract Infection": ["burning", "urine", "frequency", "lower abdomen", "abdominal pain"],
  "Food Poisoning": ["vomit", "diarrhea", "cramps", "recent food", "food poisoning", "abdominal pain", "nausea"],
  "Allergic Rhinitis": ["itchy eyes", "sneezing", "allergy", "runny nose", "congestion", "sore throat"],
  "Allergic Skin Reaction": ["rash", "swelling", "itching", "allergy", "skin", "itch"],
  "Sprain / Strain": ["injury", "sprain", "swelling", "bruise", "twist", "pain"],
  "Bronchitis": ["cough", "coughing", "chest", "breathing", "shortness of breath", "fatigue", "weakness"],
  "Asthma Attack": ["difficulty breathing", "shortness of breath", "chest", "breathing", "pressure"],
  "Bacterial Throat Infection": ["sore throat", "throat", "fever", "temperature", "pain", "difficulty swallowing"],
  "Viral Throat Infection": ["sore throat", "throat", "fever", "congestion", "coughing"],
  "Cardiac Condition": ["chest pain", "chest tightness", "heart pain", "pressure", "cardiac", "breathing difficulty"],
  "Seizure Disorder": ["seizure", "fits", "convulsions", "loss of consciousness", "fainting"],
  "Weakness / Fatigue Syndrome": ["fatigue", "weakness", "tiredness", "fever", "body ache"],
  "Skin Infection": ["rash", "swelling", "pain", "infection", "burning", "itch"],
  "Dengue Fever": ["fever", "high fever", "body ache", "myalgia", "chills", "fatigue", "weakness", "headache"],
  "Malaria": ["fever", "high fever", "chills", "sweating", "body ache", "weakness", "fatigue"],
  "Typhoid": ["fever", "high fever", "temperature", "weakness", "abdominal pain", "headache", "body ache"],
  "Chickenpox": ["rash", "fever", "temperature", "itching", "swelling", "body ache"],
  "Measles": ["rash", "fever", "cough", "runny nose", "coughing", "conjunctivitis"],
  "Pertussis (Whooping Cough)": ["cough", "coughing", "vomiting", "breathing difficulty", "shortness of breath"],
  "Pneumonia": ["fever", "temperature", "cough", "coughing", "chest pain", "breathing difficulty", "shortness of breath", "fatigue"],
  "Laryngitis": ["sore throat", "throat", "loss of voice", "pain", "coughing"],
  "Sinusitis": ["congestion", "headache", "sore throat", "throat", "cough", "pressure", "nasal"],
  "Angina": ["chest pain", "chest tightness", "pressure", "heart pain", "cardiac", "difficulty breathing"],
  "Appendicitis": ["abdominal pain", "nausea", "vomiting", "fever", "temperature", "pain"],
  "Kidney Stones": ["severe pain", "abdominal pain", "lower abdomen", "burning", "urine"],
  "Arthritis / Joint Pain": ["joint pain", "swelling", "pain", "stiffness", "weakness"],
  "Anemia": ["weakness", "fatigue", "dizziness", "dizzy", "cold"],
  "Hypertension": ["headache", "dizziness", "dizzy", "chest pain", "pressure"],
  "Hypothyroidism": ["fatigue", "weakness", "cold", "temperature", "weight gain", "tiredness"],
  "Hyperthyroidism": ["weakness", "sweating", "temperature", "heart pain", "pressure", "anxiety"],
  "Eye Strain": ["itchy eyes", "headache", "photophobia", "pain"],
  "Ear Infection": ["ear pain", "fever", "temperature", "hearing loss", "pain"],
  "Dermatitis": ["rash", "itching", "swelling", "burning", "itch", "skin"],
  "Cellulitis": ["rash", "swelling", "pain", "infection", "burning", "redness"],
  "Gout": ["joint pain", "swelling", "pain", "fever", "redness"],
  "Sciatica": ["pain", "lower abdomen", "weakness", "shooting pain", "nerve pain"],
  "Muscle Strain": ["pain", "swelling", "bruise", "injury", "weakness", "stiffness"],
  "Heat Stroke": ["fever", "high fever", "temperature", "weakness", "dizziness", "fainting", "sweating"],
  "Vertigo": ["dizziness", "dizzy", "nausea", "loss of balance", "vomiting"],
  "Constipation": ["abdominal pain", "cramps", "pain", "diarrhea"],
  "Diabetes Complications": ["weakness", "fatigue", "frequent urination", "urine"],
  "Anaphylaxis": ["difficulty breathing", "shortness of breath", "swelling", "rash", "pressure", "rapid heartbeat"],
  "Migraine Variant": ["migraine", "headache", "nausea", "vomiting", "weakness", "photophobia"],
  "Psoriasis": ["rash", "swelling", "itching", "skin", "pain", "burning"],
  "Eczema": ["rash", "itching", "swelling", "skin", "burning", "itch"],
  "Hepatitis": ["abdominal pain", "nausea", "vomiting", "fever", "weakness", "fatigue", "jaundice"],
  "Pancreatitis": ["severe pain", "abdominal pain", "nausea", "vomiting", "fever"],
};

export function inferPossibleDiseases(text: string, additionalSymptoms: string[] = []): string[] {
  const lower = (text + " " + additionalSymptoms.join(" ")).toLowerCase();
  const scores: Record<string, number> = {};
  for (const [disease, kws] of Object.entries(DISEASE_KEYWORDS)) {
    scores[disease] = 0;
    for (const k of kws) {
      if (lower.includes(k)) scores[disease] += 1;
    }
  }
  // Return diseases with at least one match, sorted by score desc
  return Object.entries(scores)
    .filter(([, sc]) => sc > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([d]) => d);
}

export function detectFever(text: string, additionalSymptoms: string[] = []): boolean {
  const feverKws = ["fever", "temperature", "hot", "febrile", "chills", "high fever"];
  const lower = (text + " " + additionalSymptoms.join(" ")).toLowerCase();
  return feverKws.some(k => lower.includes(k));
}

// -------------------------------
// CATEGORY
// -------------------------------
export function categorizeSymptom(symptom: string): string {
  const s = symptom.toLowerCase();
  if (s.includes("breath") || s.includes("cough") || s.includes("chest")) return "respiratory";
  if (s.includes("fever") || s.includes("infection")) return "infection";
  if (s.includes("headache") || s.includes("dizzy")) return "neurological";
  if (s.includes("stomach") || s.includes("vomit")) return "gastro";
  if (s.includes("pain") || s.includes("injury")) return "general-pain";
  return "general";
}

// -------------------------------
// TRIAGE QUESTIONS
// Reordered: Collect all symptoms first, then demographic/clinical info, then at the end show disease prediction
// -------------------------------
export const TRIAGE_QUESTIONS = [
  { id: 1, question: "Do you have any other symptoms?", options: [] },
  { id: 2, question: "Do you have any additional symptoms?", options: [] },
  {
    id: 3,
    question: "How long have you had this symptom?",
    options: ["Few hours", "1 day", "2 days", "3 days", "More than 3 days"]
  },
  {
    id: 4,
    question: "On a scale of 1–10, how severe is your symptom?",
    options: ["1","2","3","4","5","6","7","8","9","10"]
  },
  { id: 5, question: "What is your age?", options: [] },
  {
    id: 6,
    question: "Do you have any existing medical conditions? (e.g., diabetes, asthma, BP)",
    options: []
  }
];

// -------------------------------
// ANSWER VALIDATION
// -------------------------------
export function validateAnswer(
  questionId: number,
  answer: string
): ValidationResponse {

  const text = answer.trim().toLowerCase();

  switch (questionId) {

    case 1:
    case 2: {
      // Additional symptoms validation
      if (!isHealthRelated(text) && text !== "no" && text !== "none") {
        return { type: "retry", message: "Please mention symptoms or type 'no'." };
      }
      return { type: "accepted", value: text };
    }

    case 3: {
      const allowed = ["few hours", "1 day", "2 days", "3 days", "more than 3 days"];
      if (!allowed.some(d => text.includes(d))) {
        return { type: "retry", message: "Please select one of the given duration options." };
      }
      return { type: "accepted", value: text };
    }

    case 4: {
      const sev = Number(text);
      if (!Number.isInteger(sev) || sev < 1 || sev > 10) {
        return { type: "retry", message: "Severity must be a number between 1 and 10." };
      }
      return { type: "accepted", value: sev };
    }

    case 5: {
      const age = Number(text);
      if (!Number.isInteger(age) || age <= 0 || age > 120) {
        return { type: "retry", message: "Please enter a valid age in numbers (e.g., 25)." };
      }
      return { type: "accepted", value: age };
    }

    case 6: {
      if (!isHealthRelated(text) && text !== "no" && text !== "none") {
        return { type: "retry", message: "Please mention a medical condition or type 'no'." };
      }
      return { type: "accepted", value: text };
    }

    default:
      return { type: "accepted", value: text };
  }
}

// -------------------------------
// ✅ STEP CONTROLLER (THE REAL FIX)
// -------------------------------
export function processUserAnswer(
  questionId: number,
  userInput: string
): StepResult {

  const validation = validateAnswer(questionId, userInput);

  if (validation.type === "retry") {
    return {
      advance: false,
      botMessage: validation.message
    };
  }

  return {
    advance: true,
    value: validation.value
  };
}

// -------------------------------
// RECOMMENDATION ENGINE
// -------------------------------
export function generateRecommendation(
  severity: number,
  duration: string,
  redFlag: boolean,
  category: string | null
): Recommendation {

  if (redFlag) {
    return {
      level: "urgent",
      title: "Emergency Attention Required",
      description: "A serious symptom pattern was detected.",
      actions: [
        "Go to the nearest emergency hospital",
        "Call 108 immediately"
      ]
    };
  }

  if (severity >= 8 || duration.includes("More than 3")) {
    return {
      level: "teleconsult",
      title: "Doctor Consultation Recommended",
      description: "Medical evaluation within 24 hours is advised.",
      actions: [
        "Avoid self-medication",
        "Monitor symptoms closely"
      ]
    };
  }

  return {
    level: "self-care",
    title: "Self-Care Suggested",
    description: "Your symptoms appear manageable at home.",
    actions: [
      "Get adequate rest",
      "Stay hydrated",
      "Monitor for worsening"
    ]
  };
}
