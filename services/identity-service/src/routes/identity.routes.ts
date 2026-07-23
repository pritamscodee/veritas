import { Router } from "express";
import {
  verifyAttestation,
  checkEligibility,
  issueCredential,
  getCredential,
  registerAnchor,
  listAnchors,
} from "../controllers/identity.controller";

const router = Router();

// Anchor management
router.post("/anchors", registerAnchor);
router.get("/anchors", listAnchors);

// Attestation verification
router.post("/attestations/verify", verifyAttestation);

// Eligibility checks
router.post("/eligibility", checkEligibility);

// Credential management
router.post("/credentials", issueCredential);
router.get("/credentials/:accountId/:electionId", getCredential);

export default router;
