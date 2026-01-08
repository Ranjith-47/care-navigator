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
  "diabetes","asthma"
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
    keywords: ["chest pain","chest tightness","heart pain","pressure"],
    message: "Possible cardiac-related emergency.",
    action: "Go to the nearest 24×7 hospital or call 108 immediately."
  },
  {
    keywords: ["difficulty breathing","can't breathe","shortness of breath"],
    message: "Severe breathing difficulty detected.",
    action: "Call 108 immediately."
  },
  {
    keywords: ["uncontrolled bleeding","blood won't stop"],
    message: "Risk of major blood loss.",
    action: "Apply pressure and seek emergency care."
  },
  {
    keywords: ["fainted","unconscious"],
    message: "Possible loss of consciousness.",
    action: "Call 108 now."
  },
  {
    keywords: ["seizure","fits","convulsions"],
    message: "Seizure activity detected.",
    action: "Seek urgent medical care."
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
// -------------------------------
export const TRIAGE_QUESTIONS = [
  { id: 1, question: "What is your age?", options: [] },
  {
    id: 2,
    question: "Do you have any existing medical conditions? (e.g., diabetes, asthma, BP)",
    options: []
  },
  {
    id: 3,
    question: "How long have you had this symptom?",
    options: ["Few hours", "1 day", "2–3 days", "More than 3 days"]
  },
  {
    id: 4,
    question: "On a scale of 1–10, how severe is your symptom?",
    options: ["1","2","3","4","5","6","7","8","9","10"]
  },
  { id: 5, question: "Do you have any additional symptoms?", options: [] }
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

    case 1: {
      const age = Number(text);
      if (!Number.isInteger(age) || age <= 0 || age > 120) {
        return { type: "retry", message: "I can help you only with medical related problems \nPlease enter a valid age in numbers (e.g., 25)." };
      }
      return { type: "accepted", value: age };
    }

    case 2: {
      if (!isHealthRelated(text) && text !== "no" && text !== "none") {
        return { type: "retry", message: "Please mention a medical condition or type 'no'." };
      }
      return { type: "accepted", value: text };
    }

    case 3: {
      const allowed = ["few hours", "1 day", "2–3 days", "more than 3 days"];
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
      if (!isHealthRelated(text) && text !== "no") {
        return { type: "retry", message: "Please describe health-related symptoms or type 'no'." };
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
