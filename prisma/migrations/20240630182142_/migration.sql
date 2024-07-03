/*
  Warnings:

  - You are about to drop the column `category` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `email_id` on the `Email` table. All the data in the column will be lost.
  - You are about to drop the column `tag` on the `Email` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "category",
DROP COLUMN "email_id",
DROP COLUMN "tag";

-- DropEnum
DROP TYPE "Category";

-- CreateTable
CREATE TABLE "Folders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mails" TEXT[],

    CONSTRAINT "Folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "inbox" TEXT[],
    "trash" TEXT[],
    "archive" TEXT[],
    "junk" TEXT[],

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
