import express from "express";
import { generateStudyPack } from "../utils/geminiClient.js";

const router = express.Router();

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

router.post("/generate-study-pack", async (req, res, next) => {
   try {
      const { subject, specificTopic } = req.body;

      // Validation
      if (!specificTopic || specificTopic.trim() === "") {
         return res.status(400).json({
            error: "Specific topic is required",
         });
      }

      if (!isLikelyAcademic(subject, specificTopic)) {
         return res.status(400).json({
            error: "Study pack generation accepts academic topics only. Please enter a school-related topic.",
         });
      }

      // Generate study pack using Gemini
      const studyPack = await generateStudyPack({ subject, specificTopic });

      res.json({
         success: true,
         data: studyPack,
      });
   } catch (error) {
      next(error);
   }
});

export default router;
