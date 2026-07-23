import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../models/prisma";

export async function createElection(req: Request, res: Response) {
  try {
    const {
      title,
      description,
      organizerId,
      votingMethod,
      requiredKycLevel,
      startTime,
      endTime,
      quorumThreshold,
      options,
    } = req.body;

    if (!title || !organizerId || !startTime || !endTime || !options?.length) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "Missing required fields" });
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "startTime must be before endTime" });
      return;
    }

    if (options.length < 2) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: "At least 2 options required" });
      return;
    }

    const election = await prisma.election.create({
      data: {
        title,
        description: description || "",
        organizerId,
        votingMethod: votingMethod || "one_person_one_vote",
        requiredKycLevel: requiredKycLevel || 1,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        quorumThreshold: quorumThreshold || 1,
        options: {
          create: options.map((opt: any, i: number) => ({
            label: opt.label,
            description: opt.description || "",
            metadata: opt.metadata || undefined,
            position: i,
          })),
        },
      },
      include: { options: true },
    });

    res.status(201).json(election);
  } catch (error: any) {
    console.error("createElection error:", error);
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function getElection(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const election = await prisma.election.findUnique({
      where: { id },
      include: { options: { orderBy: { position: "asc" } } },
    });

    if (!election) {
      res.status(404).json({ code: "NOT_FOUND", message: "Election not found" });
      return;
    }

    res.json(election);
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function listElections(req: Request, res: Response) {
  try {
    const { status, organizerId, page = "1", limit = "20" } = req.query;
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const where: any = {};
    if (status) where.status = status;
    if (organizerId) where.organizerId = organizerId;

    const [elections, total] = await Promise.all([
      prisma.election.findMany({
        where,
        include: { options: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit as string),
      }),
      prisma.election.count({ where }),
    ]);

    res.json({
      elections,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function updateElectionStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["draft", "registration", "voting", "tallying", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ code: "VALIDATION_ERROR", message: `Invalid status: ${status}` });
      return;
    }

    const election = await prisma.election.update({
      where: { id },
      data: { status },
      include: { options: true },
    });

    res.json(election);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ code: "NOT_FOUND", message: "Election not found" });
      return;
    }
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function addVoteOption(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { label, description, metadata } = req.body;

    const election = await prisma.election.findUnique({ where: { id } });
    if (!election) {
      res.status(404).json({ code: "NOT_FOUND", message: "Election not found" });
      return;
    }

    if (election.status !== "draft") {
      res.status(400).json({ code: "INVALID_STATE", message: "Can only add options to draft elections" });
      return;
    }

    const maxPosition = await prisma.voteOption.findFirst({
      where: { electionId: id },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const option = await prisma.voteOption.create({
      data: {
        electionId: id,
        label,
        description: description || "",
        metadata: metadata || undefined,
        position: (maxPosition?.position ?? -1) + 1,
      },
    });

    res.status(201).json(option);
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}

export async function deleteElection(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const election = await prisma.election.findUnique({ where: { id } });
    if (!election) {
      res.status(404).json({ code: "NOT_FOUND", message: "Election not found" });
      return;
    }

    if (election.status !== "draft") {
      res.status(400).json({ code: "INVALID_STATE", message: "Can only delete draft elections" });
      return;
    }

    await prisma.election.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ code: "INTERNAL_ERROR", message: error.message });
  }
}
