import { Router } from "express";
import {
  generateVoteProof,
  verifyVoteProof,
  getProverStatus,
} from "../controllers/zk-proof.controller";

const router = Router();

router.post("/prove", generateVoteProof);
router.post("/verify", verifyVoteProof);
router.get("/status", getProverStatus);

export default router;
