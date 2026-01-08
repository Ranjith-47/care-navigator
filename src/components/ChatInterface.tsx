import { useState, useRef, useEffect } from "react";
import { Send, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import RecommendationCard from "./RecommendationCard";
import HospitalRecommendationCard from "./HospitalRecommendationCard";
import QuickReply from "./QuickReply";

import {
  TRIAGE_QUESTIONS,
  checkRedFlags,
  categorizeSymptom,
  generateRecommendation,
  isHealthRelated,
  irrelevantMessageResponse,
  processUserAnswer,
  inferPossibleDiseases,
  detectFever,
  Recommendation
} from "@/lib/triageLogic";

const ChatInterface = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recommendation, setRecommendation] =
    useState<Recommendation | null>(null);

  const [nearbyHospitals, setNearbyHospitals] = useState<any[] | null>(null);
  const [showDurationButtons, setShowDurationButtons] = useState(false);
  const [showSeverityButtons, setShowSeverityButtons] = useState(false);

  const [triageState, setTriageState] = useState({
    step: 0,
    symptom: "",
    category: null as string | null,
    age: "",
    conditions: [] as string[],
    duration: "",
    severity: 0,
    additional: [] as string[],
    hasFever: false,
    possibleDiseases: [] as string[],
    redFlag: null as null | { message: string; action: string },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(scrollToBottom, [messages, isTyping]);

  useEffect(() => {
    addMessage(
      "assistant",
      "👋 Hello! Tell me your main health symptom.\n\n⚠️ Chest pain or breathing trouble → Call 108."
    );
  }, []);

  const addMessage = (role: "user" | "assistant", content: string, isRedFlag = false) => {
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: new Date(),
        isRedFlag,
      },
    ]);
  };

  const simulateTyping = async (cb: () => void, delay = 700) => {
    setIsTyping(true);
    await new Promise(r => setTimeout(r, delay));
    setIsTyping(false);
    cb();
  };

  // ===============================
  // MAIN INPUT HANDLER
  // ===============================
  const processUserInput = async (text: string) => {
    addMessage("user", text);
    setInput("");

    // 🚫 Intent gate
    if (triageState.step === 0 && !isHealthRelated(text)) {
      const res = irrelevantMessageResponse();
      await simulateTyping(() => addMessage("assistant", res.message));
      return;
    }

    // 🚨 Red flag detection
    const redFlag = checkRedFlags(text);
    if (redFlag) {
      setTriageState(prev => ({ ...prev, redFlag }));
    }

    if (redFlag && triageState.step === 0) {
      await simulateTyping(() =>
        addMessage(
          "assistant",
          `🚨 ${redFlag.message}\n${redFlag.action}`,
          true
        )
      );
        setRecommendation(
          generateRecommendation(10, "Just started", true, null)
        );

        // Recommend nearby hospitals for follow-up (prefer cardiac if chest pain)
        try {
          const { recommendHospitals } = await import("@/lib/recommender");
          const lower = text.toLowerCase();
          const forcedCategory = lower.includes("chest") || lower.includes("chest pain")
            ? "cardiac"
            : categorizeSymptom(text);
          const rec = recommendHospitals(forcedCategory, 10);
          setNearbyHospitals(rec.hospitals.map(h => ({
            name: h.name,
            city: h.city,
            specialty: h.specialty,
            emergency24x7: h.emergency24x7,
            maps: h.maps,
            distance: h.distance
          })));
        } catch (e) {
          setNearbyHospitals(null);
        }
      return;
    }

    switch (triageState.step) {
      // First user message: capture main symptom
      case 0:
        setTriageState(prev => ({
          ...prev,
          step: 1,
          symptom: text,
          category: categorizeSymptom(text),
        }));
        await simulateTyping(() =>
          addMessage("assistant", TRIAGE_QUESTIONS[0].question)
        );
        break;

      // First additional symptoms
      case 1:
        {
          const res = processUserAnswer(1, text);
          if (!res.advance) {
            await simulateTyping(() => addMessage("assistant", res.botMessage || "Please try again."));
            return;
          }
          const additionalArr = (res.value as string) === "no" ? [] : [res.value as string];
          setTriageState(prev => ({
            ...prev,
            step: 2,
            additional: additionalArr,
          }));
          await simulateTyping(() =>
            addMessage("assistant", TRIAGE_QUESTIONS[1].question)
          );
        }
        break;

      // Second additional symptoms
      case 2:
        {
          const res = processUserAnswer(2, text);
          if (!res.advance) {
            await simulateTyping(() => addMessage("assistant", res.botMessage || "Please try again."));
            return;
          }
          const moreSymptoms = (res.value as string) === "no" ? [] : [res.value as string];
          setTriageState(prev => ({
            ...prev,
            step: 3,
            additional: [...prev.additional, ...moreSymptoms],
          }));
          await simulateTyping(() => {
            addMessage("assistant", TRIAGE_QUESTIONS[2].question);
            setShowDurationButtons(true);
          });
        }
        break;

      // Duration - Show button options
      case 3:
        {
          const res = processUserAnswer(3, text);
          if (!res.advance) {
            await simulateTyping(() => addMessage("assistant", res.botMessage || "Please try again."));
            return;
          }
          setTriageState(prev => ({ ...prev, step: 4, duration: res.value ?? text }));
          setShowDurationButtons(false);
          await simulateTyping(() => {
            addMessage("assistant", TRIAGE_QUESTIONS[3].question);
            setShowSeverityButtons(true);
          });
        }
        break;

      // Severity
      case 4:
        {
          const res = processUserAnswer(4, text);
          if (!res.advance) {
            await simulateTyping(() => addMessage("assistant", res.botMessage || "Please try again."));
            return;
          }
          setTriageState(prev => ({
            ...prev,
            step: 5,
            severity: ((res.value as number) ?? parseInt(text)) || 5,
          }));
          setShowSeverityButtons(false);
          await simulateTyping(() =>
            addMessage("assistant", TRIAGE_QUESTIONS[4].question)
          );
        }
        break;

      // Age
      case 5:
        {
          const res = processUserAnswer(5, text);
          if (!res.advance) {
            await simulateTyping(() => addMessage("assistant", res.botMessage || "Please try again."));
            return;
          }
          setTriageState(prev => ({ ...prev, step: 6, age: res.value ?? text }));
          await simulateTyping(() =>
            addMessage("assistant", TRIAGE_QUESTIONS[5].question)
          );
        }
        break;

      // Medical conditions and final analysis
      case 6:
        {
          const res = processUserAnswer(6, text);
          if (!res.advance) {
            await simulateTyping(() => addMessage("assistant", res.botMessage || "Please try again."));
            return;
          }
          setTriageState(prev => ({
            ...prev,
            step: 7,
            conditions: (res.value as string) === "no" ? [] : (res.value as string).split(",").map(s => s.trim()),
          }));

          await simulateTyping(() => addMessage("assistant", "Analyzing your symptoms…"));

          // Detect fever and generate disease inferences
          const hasF = detectFever(triageState.symptom, triageState.additional);
          const possibleDiseases = inferPossibleDiseases(triageState.symptom, triageState.additional);
          setTriageState(prev => ({ 
            ...prev, 
            possibleDiseases,
            hasFever: hasF,
            step: 7
          }));

          const rec = generateRecommendation(
            triageState.severity || 0,
            triageState.duration,
            triageState.redFlag !== null,
            triageState.category
          );

          // Append possible diseases to recommendation ONLY at the end
          if (possibleDiseases && possibleDiseases.length > 0) {
            rec.description += `\n\n**Possible conditions:** ${possibleDiseases.slice(0, 5).join(", ")}`;
          }

          setRecommendation(rec);
        }
        break;
    }
  };

  // Handler for duration button selection
  const handleDurationSelect = (duration: string) => {
    processUserInput(duration);
    setShowDurationButtons(false);
  };

  // Handler for severity button selection
  const handleSeveritySelect = (severity: string) => {
    processUserInput(severity);
    setShowSeverityButtons(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">

      <div className="border-b p-3 flex justify-between">
        <h1 className="font-semibold">Symptom Assessment</h1>
        <Button size="sm" onClick={() => window.location.reload()}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => <ChatMessage key={m.id} {...m} />)}
        {isTyping && <TypingIndicator />}
        {showDurationButtons && !recommendation && (
          <QuickReply 
            options={TRIAGE_QUESTIONS[2].options} 
            onSelect={handleDurationSelect}
            disabled={isTyping}
          />
        )}
        {showSeverityButtons && !recommendation && (
          <QuickReply 
            options={TRIAGE_QUESTIONS[3].options} 
            onSelect={handleSeveritySelect}
            disabled={isTyping}
          />
        )}
        {recommendation && (
          <>
            <RecommendationCard recommendation={recommendation} onRestart={undefined} />
            {recommendation.level === "urgent" && nearbyHospitals && (
              <div className="mt-4">
                <HospitalRecommendationCard hospitals={nearbyHospitals} title="Suggested nearby hospitals" />
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!recommendation && (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (input.trim() && !isTyping) {
              processUserInput(input.trim());
            }
          }}
          className="p-4 border-t flex gap-3"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe your symptom…"
          />
          <Button type="submit">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      )}
    </div>
  );
};

export default ChatInterface;
