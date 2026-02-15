const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to generate study pack");
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

         // Check if it's a network error (offline)
         if (err.message === "Failed to fetch" || !navigator.onLine) {
            throw new Error(
               "No internet connection. Study pack generation requires internet access.",
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
