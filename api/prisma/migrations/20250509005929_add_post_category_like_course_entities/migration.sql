-- CreateEnum
CREATE TYPE "postType" AS ENUM ('NEWS', 'EVENT');

-- CreateTable
CREATE TABLE "like" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "postType" NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "eventDate" TIMESTAMP(3),
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" INTEGER NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_commentTopost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_commentTopost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_courseTopost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_courseTopost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "post_authorId_idx" ON "post"("authorId");

-- CreateIndex
CREATE INDEX "post_type_idx" ON "post"("type");

-- CreateIndex
CREATE INDEX "post_createdAt_idx" ON "post"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "course_code_key" ON "course"("code");

-- CreateIndex
CREATE INDEX "_commentTopost_B_index" ON "_commentTopost"("B");

-- CreateIndex
CREATE INDEX "_courseTopost_B_index" ON "_courseTopost"("B");

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "like" ADD CONSTRAINT "like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_commentTopost" ADD CONSTRAINT "_commentTopost_A_fkey" FOREIGN KEY ("A") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_commentTopost" ADD CONSTRAINT "_commentTopost_B_fkey" FOREIGN KEY ("B") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courseTopost" ADD CONSTRAINT "_courseTopost_A_fkey" FOREIGN KEY ("A") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_courseTopost" ADD CONSTRAINT "_courseTopost_B_fkey" FOREIGN KEY ("B") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
