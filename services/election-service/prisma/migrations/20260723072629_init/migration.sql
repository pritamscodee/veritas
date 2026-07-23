-- CreateTable
CREATE TABLE "Election" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "organizerId" TEXT NOT NULL,
    "contractAddress" TEXT,
    "votingMethod" TEXT NOT NULL DEFAULT 'one_person_one_vote',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "requiredKycLevel" INTEGER NOT NULL DEFAULT 1,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "quorumThreshold" INTEGER NOT NULL DEFAULT 1,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoteOption" (
    "id" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "VoteOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoterCredential" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "credentialHash" TEXT NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usedAt" TIMESTAMP(3),

    CONSTRAINT "VoterCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Election_status_idx" ON "Election"("status");

-- CreateIndex
CREATE INDEX "Election_organizerId_idx" ON "Election"("organizerId");

-- CreateIndex
CREATE INDEX "Election_startTime_endTime_idx" ON "Election"("startTime", "endTime");

-- CreateIndex
CREATE INDEX "VoteOption_electionId_idx" ON "VoteOption"("electionId");

-- CreateIndex
CREATE INDEX "VoterCredential_accountId_idx" ON "VoterCredential"("accountId");

-- CreateIndex
CREATE INDEX "VoterCredential_electionId_idx" ON "VoterCredential"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "VoterCredential_accountId_electionId_key" ON "VoterCredential"("accountId", "electionId");

-- AddForeignKey
ALTER TABLE "VoteOption" ADD CONSTRAINT "VoteOption_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoterCredential" ADD CONSTRAINT "VoterCredential_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;
