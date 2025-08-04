
import { listen } from "@colyseus/tools";
 import app from "./app.config.js";

// ─── Add CORS for matchmaking endpoints ──────────────────────────────────────
import { matchMaker } from "@colyseus/core";

// matchMaker.controller.getCorsHeaders = (req) => ({
//   "Access-Control-Allow-Origin": req.headers.origin,
//   "Access-Control-Allow-Credentials": "true",
//   "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
//   "Access-Control-Allow-Methods": "OPTIONS, GET, POST",
//   "Vary": "Origin",
// });


// ───────────────────────────────────────────────────────────────────────────────

 // Create and listen on 2567 (or PORT environment variable.)
 listen(app);
