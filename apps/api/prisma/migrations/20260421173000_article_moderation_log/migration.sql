-- CreateTable
CREATE TABLE "ArticleModerationLog" (
    "id" TEXT NOT NULL,
    "articleId" UUID NOT NULL,
    "statusFrom" "ArticleStatus" NOT NULL,
    "reason" TEXT,
    "adminId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArticleModerationLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleModerationLog" ADD CONSTRAINT "ArticleModerationLog_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleModerationLog" ADD CONSTRAINT "ArticleModerationLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
