const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// --- Rate limiter (in-memory, per serverless instance) ---
const requests = new Map();

function rateLimiter(ip) {
   const now = Date.now();
   const windowMs = 60 * 1000;
   const maxRequests = 10;

   if (!requests.has(ip)) requests.set(ip, []);

   const recent = requests.get(ip).filter((t) => now - t < windowMs);

   if (recent.length >= maxRequests) {
      return {
         limited: true,
         retryAfter: Math.ceil((recent[0] + windowMs - now) / 1000),
      };
   }

   recent.push(now);
   requests.set(ip, recent);
   return { limited: false };
}

// --- Topic validation ---
function containsBlockedTopic(text = "") {
   return /(poop|toilet|feces|shit|sex|porn|nude|gambling|drug|drugs|meth|cocaine|weapon|bomb|kill|murder)/i.test(
      text,
   );
}

function isLikelyAcademic(subject = "", specificTopic = "") {
   const combined = `${subject || ""} ${specificTopic || ""}`.trim();
   if (!combined) return false;
   if (containsBlockedTopic(combined)) return false;

   const academicPattern =
      /(math|algebra|geometry|calculus|statistics|physics|chemistry|biology|history|geography|economics|accounting|programming|computer science|literature|grammar|science|research|exam|lesson|theorem|equation|analysis|engineering|medicine|law|psychology|philosophy)/i;

   return (
      academicPattern.test(combined) ||
      (specificTopic.trim().split(/\s+/).length >= 2 &&
         specificTopic.trim().length >= 4)
   );
}

// --- Gemini API call ---
async function generateStudyPack({ subject, specificTopic }) {
   const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();

   if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in server environment");
   }

   const subjectPart = subject ? ` in ${subject}` : "";

   const prompt = `You are an expert educator. Generate a comprehensive study pack for the topic: "${specificTopic}"${subjectPart}.

Please provide the response in the following JSON format ONLY (no markdown, no code blocks, just pure JSON):

{
  "subtopics": [array of 5-10 key subtopics or checkpoints to cover],
  "studyNotes": [array of 5-10 concise bullet points with essential study hints and key concepts],
  "quizzes": [
    {
      "question": "Multiple choice question text",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "answer": "A",
      "hint": "A helpful hint if the student gets it wrong"
    }
    ... (generate exactly 10 quiz questions)
  ]
}

Requirements:
- Topic must be academic/school-related only
- Subtopics should be clear learning objectives
- Study notes should be concise and actionable
- Quiz questions should test understanding, not just memorization
- Each quiz must have exactly 4 options labeled A, B, C, D
- The "answer" field must be a single letter: "A", "B", "C", or "D"
- Hints should guide thinking without giving away the answer directly
- Generate exactly 10 quiz questions

Return ONLY the JSON object, no additional text.`;

   const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
         contents: [{ parts: [{ text: prompt }] }],
      }),
   });

   if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || "Gemini API request failed");
   }

   const data = await response.json();
   const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

   if (!text) throw new Error("No response from Gemini API");

   let cleanedText = text.trim();
   if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
         .replace(/```json\n?/, "")
         .replace(/\n?```$/, "");
   } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "");
   }

   const parsed = JSON.parse(cleanedText);

   if (!Array.isArray(parsed.subtopics))
      throw new Error("Invalid response: missing subtopics array");
   if (!Array.isArray(parsed.studyNotes))
      throw new Error("Invalid response: missing studyNotes array");
   if (!Array.isArray(parsed.quizzes))
      throw new Error("Invalid response: missing quizzes array");

   parsed.quizzes.forEach((quiz, idx) => {
      if (!quiz.question || !quiz.options || !quiz.answer || !quiz.hint)
         throw new Error(
            `Invalid quiz at index ${idx}: missing required fields`,
         );
      if (quiz.options.length !== 4)
         throw new Error(
            `Invalid quiz at index ${idx}: must have exactly 4 options`,
         );
      if (!["A", "B", "C", "D"].includes(quiz.answer))
         throw new Error(
            `Invalid quiz at index ${idx}: answer must be A, B, C, or D`,
         );
   });

   return parsed;
}

// --- Vercel serverless handler ---
export default async function handler(req, res) {
   // CORS
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
   res.setHeader("Access-Control-Allow-Headers", "Content-Type");

   if (req.method === "OPTIONS") return res.status(200).end();
   if (req.method !== "POST")
      return res.status(405).json({ error: "Method not allowed" });

   // Rate limit
   const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown";

   const rl = rateLimiter(ip);
   if (rl.limited) {
      return res.status(429).json({
         error: "Too many requests. Please wait a moment before trying again.",
         retryAfter: rl.retryAfter,
      });
   }

   try {
      const { subject, specificTopic } = req.body;

      if (!specificTopic || specificTopic.trim() === "") {
         return res.status(400).json({ error: "Specific topic is required" });
      }

      if (!isLikelyAcademic(subject, specificTopic)) {
         return res.status(400).json({
            error: "Study pack generation accepts academic topics only. Please enter a school-related topic.",
         });
      }

      const studyPack = await generateStudyPack({ subject, specificTopic });

      return res.status(200).json({ success: true, data: studyPack });
   } catch (err) {
      console.error("Handler error:", err);

      if (err.message.includes("API key")) {
         return res.status(500).json({ error: "Server configuration error." });
      }
      if (err.message.includes("quota")) {
         return res
            .status(503)
            .json({ error: "API quota exceeded. Please try again later." });
      }
      if (err instanceof SyntaxError) {
         return res
            .status(500)
            .json({ error: "Failed to parse AI response. Please try again." });
      }

      return res
         .status(500)
         .json({ error: err.message || "An unexpected error occurred" });
   }
}
