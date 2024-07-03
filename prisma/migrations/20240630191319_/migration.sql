/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `read` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "read" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_user_id_key" ON "Category"("user_id");
