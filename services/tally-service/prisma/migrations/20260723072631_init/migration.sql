-- CreateTable
CREATE TABLE "KeyHolder" (
    "id" TEXT NOT NULL,
    "holderId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "shareIndex" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeyHolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecryptionShare" (
    "id" TEXT NOT NULL,
    "holderId" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "share" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DecryptionShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TallyResult" (
    "id" TEXT NOT NULL,
    "electionId" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "totalVotes" INTEGER NOT NULL,
    "quorumReached" BOOLEAN NOT NULL,
    "decryptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txHash" TEXT,

    CONSTRAINT "TallyResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThresholdConfig" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThresholdConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KeyHolder_holderId_key" ON "KeyHolder"("holderId");

-- CreateIndex
CREATE INDEX "DecryptionShare_electionId_idx" ON "DecryptionShare"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "DecryptionShare_holderId_electionId_key" ON "DecryptionShare"("holderId", "electionId");

-- CreateIndex
CREATE UNIQUE INDEX "TallyResult_electionId_key" ON "TallyResult"("electionId");

-- CreateIndex
CREATE INDEX "TallyResult_electionId_idx" ON "TallyResult"("electionId");

-- CreateIndex
CREATE UNIQUE INDEX "ThresholdConfig_key_key" ON "ThresholdConfig"("key");
