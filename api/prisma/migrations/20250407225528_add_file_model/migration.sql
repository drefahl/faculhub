/*
  Warnings:

  - You are about to drop the column `picture` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "picture",
ADD COLUMN     "profilePicId" TEXT;

-- CreateTable
CREATE TABLE "file" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_profilePicId_fkey" FOREIGN KEY ("profilePicId") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE;
