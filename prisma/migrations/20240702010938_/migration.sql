/*
  Warnings:

  - Added the required column `star` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "star" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Draft" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Draft_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Draft" ADD CONSTRAINT "Draft_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
