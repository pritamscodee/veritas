import { Router } from "express";
import {
  submitDecryptionShare,
  finalizeTally,
  getResult,
  registerKeyHolder,
  getKeyHolders,
  getShareStatus,
} from "../controllers/tally.controller";

const router = Router();

// Key holder management
router.post("/key-holders", registerKeyHolder);
router.get("/key-holders", getKeyHolders);

// Decryption shares
router.post("/shares", submitDecryptionShare);
router.get("/shares/:electionId", getShareStatus);

// Tally
router.post("/finalize/:electionId", finalizeTally);
router.get("/results/:electionId", getResult);

export default router;
