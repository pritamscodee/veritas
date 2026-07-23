import { Router } from "express";
import {
  createElection,
  getElection,
  listElections,
  updateElectionStatus,
  addVoteOption,
  deleteElection,
} from "../controllers/election.controller";

const router = Router();

router.post("/", createElection);
router.get("/", listElections);
router.get("/:id", getElection);
router.patch("/:id/status", updateElectionStatus);
router.post("/:id/options", addVoteOption);
router.delete("/:id", deleteElection);

export default router;
