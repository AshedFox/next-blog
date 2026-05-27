-- CreateTable
CREATE TABLE "ArticleStats" (
    "articleId" UUID NOT NULL,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleStats_pkey" PRIMARY KEY ("articleId")
);

-- AddForeignKey
ALTER TABLE "ArticleStats" ADD CONSTRAINT "ArticleStats_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
