export function errorHandler(err, req, res) {
   console.error("Error:", err);

   // Handle specific error types
   if (err.name === "ValidationError") {
      return res.status(400).json({
         error: err.message,
      });
   }

   if (err.message.includes("API key")) {
      return res.status(500).json({
         error: "Server configuration error. Please contact support.",
      });
   }

   if (err.message.includes("quota")) {
      return res.status(503).json({
         error: "Service temporarily unavailable. Please try again later.",
      });
   }

   // Default error response
   res.status(err.status || 500).json({
      error: err.message || "An unexpected error occurred",
   });
}
