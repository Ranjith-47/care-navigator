import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------- AI TRIAGE BACKEND --------------------
app.post("/api/triage", async (req, res) => {
  try {
    const { messages, symptomCategory, redFlag } = req.body;

    const systemPrompt = `
You are a safe medical triage assistant using CDC, WHO, and NHS guidelines.
You DO NOT diagnose.
You ask follow-up questions, detect risk patterns, and guide users safely.

IMPORTANT RULES:
- DO NOT escalate to emergency unless symptoms are truly life-threatening.
- If redFlag = true, ask more clarifying questions instead of immediately escalating.
- Keep responses short, supportive, structured.

Symptom Category: ${symptomCategory || "unknown"}
Potential red flag detected: ${redFlag ? "Possible concern — investigate more" : "None"}
`;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.3,
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("Groq Error:", error);
    res.status(500).json({ error: "AI backend failed" });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🔥 Groq AI backend running at http://localhost:${PORT}`)
);
