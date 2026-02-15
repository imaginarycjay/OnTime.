const requests = new Map();

export function rateLimiter(req, res, next) {
   const ip = req.ip || req.connection.remoteAddress;
   const now = Date.now();
   const windowMs = 60 * 1000; // 1 minute
   const maxRequests = 10; // 10 requests per minute

   if (!requests.has(ip)) {
      requests.set(ip, []);
   }

   const userRequests = requests.get(ip);

   // Remove old requests outside the time window
   const recentRequests = userRequests.filter(
      (timestamp) => now - timestamp < windowMs,
   );

   if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
         error: "Too many requests. Please wait a moment before trying again.",
         retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000),
      });
   }

   recentRequests.push(now);
   requests.set(ip, recentRequests);

   next();
}
