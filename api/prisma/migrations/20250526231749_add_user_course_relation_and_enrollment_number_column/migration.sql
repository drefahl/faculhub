/*
  Warnings:

  - A unique constraint covering the columns `[enrollmentNumber]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "courseId" INTEGER,
ADD COLUMN     "enrollmentNumber" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "user_enrollment_unique" ON "user"("enrollmentNumber");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
