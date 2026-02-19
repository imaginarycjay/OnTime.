// In production (Vercel) use relative URL so /api/* hits the serverless functions.
// In local dev, fall back to the Express server at localhost:3001.
const API_BASE_URL =
   import.meta.env.VITE_API_URL ??
   (import.meta.env.DEV ? "http://localhost:3001" : "");

const studyApi = {
   async generateStudyPack({ subject, specificTopic }) {
      try {
         const response = await fetch(
            `${API_BASE_URL}/api/generate-study-pack`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  subject: subject || "",
                  specificTopic: specificTopic,
               }),
            },
         );

         if (!response.ok) {
            const rawText = await response.text();
            let parsedMessage = "";

            try {
               const errorData = JSON.parse(rawText);
               parsedMessage = errorData.error || "";
            } catch {
               const htmlMatch = rawText.match(/<pre>(.*?)<\/pre>/s);
               if (htmlMatch?.[1]) {
                  parsedMessage = htmlMatch[1]
                     .replace(/<br\s*\/?\s*>/gi, "\n")
                     .replace(/<[^>]+>/g, "")
                     .trim();
               }
            }

            throw new Error(
               parsedMessage ||
                  `Failed to generate study pack (HTTP ${response.status})`,
            );
         }

         const result = await response.json();

         if (!result.success || !result.data) {
            throw new Error("Invalid response from server");
         }

         const { subtopics, studyNotes, quizzes } = result.data;

         if (
            !Array.isArray(subtopics) ||
            !Array.isArray(studyNotes) ||
            !Array.isArray(quizzes)
         ) {
            throw new Error("Incomplete study pack data");
         }

         return result.data;
      } catch (err) {
         console.error("Study API Error:", err);

         // Offline case
         if (!window.navigator.onLine) {
            throw new Error(
               "No internet connection. Study pack generation requires internet access.",
            );
         }

         // Frontend is online but API server is not reachable
         if (err instanceof TypeError && err.message === "Failed to fetch") {
            throw new Error(
               import.meta.env.DEV
                  ? "Cannot reach study server at http://localhost:3001. Start gemini-server first."
                  : "Cannot reach the study API. Please try again later.",
            );
         }

         throw err;
      }
   },
};

if (typeof window !== "undefined") {
   window.studyApi = studyApi;
}

export default studyApi;
