const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const buildPrompt = ({ subject, specificTopic }) => {
  return `You are a study-coach bot. Subject: ${subject || "General"}. Specific topic: ${specificTopic}.
Generate:
1. A list of 5-10 concise subtopics/checkpoints.
2. Matching study bullet points (hints only, no full solutions).
3. Ten MCQ quiz questions with four options each, mark the correct option letter, and add a short hint.
Respond strictly in JSON with keys: "subtopics": string[], "studyNotes": string[], "quizzes": {"question": string, "options": string[], "answer": string, "hint": string}[] and ensure quizzes length is 10.`;
};

const studyApi = {
  async generateStudyPack({ subject, specificTopic }) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key missing. Set VITE_GEMINI_API_KEY");
    }

    const prompt = buildPrompt({ subject, specificTopic });
    const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }],
        }],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch study pack");
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed.subtopics) || !Array.isArray(parsed.studyNotes) || !Array.isArray(parsed.quizzes)) {
        throw new Error("Incomplete study pack data");
      }
      return parsed;
    } catch (err) {
      console.error("Failed parsing Gemini response", err);
      throw new Error("Unable to parse study pack");
    }
  },
};

if (typeof window !== "undefined") {
  window.studyApi = studyApi;
}

export default studyApi;

