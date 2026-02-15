import express from "express";
import { generateStudyPack } from "../utils/geminiClient.js";

const router = express.Router();

router.post("/generate-study-pack", async (req, res, next) => {
   try {
      const { subject, specificTopic } = req.body;

      // Validation
      if (!specificTopic || specificTopic.trim() === "") {
         return res.status(400).json({
            error: "Specific topic is required",
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
