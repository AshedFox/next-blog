-- CreateIndex
CREATE INDEX "Article_status_createdAt_idx" ON "Article"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Article_authorId_idx" ON "Article"("authorId");
