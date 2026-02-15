const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_ENDPOINT =
   "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

if (!GEMINI_API_KEY) {
   console.error("⚠️  GEMINI_API_KEY not found in environment variables");
}

export async function generateStudyPack({ subject, specificTopic }) {
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
- Subtopics should be clear learning objectives
- Study notes should be concise and actionable
- Quiz questions should test understanding, not just memorization
- Each quiz must have exactly 4 options labeled A, B, C, D
- The "answer" field must be a single letter: "A", "B", "C", or "D"
- Hints should guide thinking without giving away the answer directly
- Generate exactly 10 quiz questions

Return ONLY the JSON object, no additional text.`;

   try {
      const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            contents: [
               {
                  parts: [{ text: prompt }],
               },
            ],
         }),
      });

      if (!response.ok) {
         const errorData = await response.json();
         throw new Error(
            errorData.error?.message || "Gemini API request failed",
         );
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
         throw new Error("No response from Gemini API");
      }

      // Clean the response (remove markdown code blocks if present)
      let cleanedText = text.trim();
      if (cleanedText.startsWith("```json")) {
         cleanedText = cleanedText
            .replace(/```json\n?/, "")
            .replace(/\n?```$/, "");
      } else if (cleanedText.startsWith("```")) {
         cleanedText = cleanedText.replace(/```\n?/, "").replace(/\n?```$/, "");
      }

      const parsed = JSON.parse(cleanedText);

      // Validate structure
      if (!parsed.subtopics || !Array.isArray(parsed.subtopics)) {
         throw new Error("Invalid response: missing subtopics array");
      }
      if (!parsed.studyNotes || !Array.isArray(parsed.studyNotes)) {
         throw new Error("Invalid response: missing studyNotes array");
      }
      if (!parsed.quizzes || !Array.isArray(parsed.quizzes)) {
         throw new Error("Invalid response: missing quizzes array");
      }

      // Validate quiz structure
      parsed.quizzes.forEach((quiz, idx) => {
         if (!quiz.question || !quiz.options || !quiz.answer || !quiz.hint) {
            throw new Error(
               `Invalid quiz at index ${idx}: missing required fields`,
            );
         }
         if (quiz.options.length !== 4) {
            throw new Error(
               `Invalid quiz at index ${idx}: must have exactly 4 options`,
            );
         }
         if (!["A", "B", "C", "D"].includes(quiz.answer)) {
            throw new Error(
               `Invalid quiz at index ${idx}: answer must be A, B, C, or D`,
            );
         }
      });

      return parsed;
   } catch (error) {
      console.error("Gemini API Error:", error);

      if (error.message.includes("API key")) {
         throw new Error("Invalid API key configuration");
      }
      if (error.message.includes("quota")) {
         throw new Error("API quota exceeded. Please try again later.");
      }
      if (error instanceof SyntaxError) {
         throw new Error("Failed to parse AI response. Please try again.");
      }

      throw error;
   }
}
