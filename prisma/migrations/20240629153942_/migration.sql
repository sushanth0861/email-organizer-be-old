/*
  Warnings:

  - You are about to drop the column `access_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `broker` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `child` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `order_book` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `parent` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `secret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `today_pnl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `total_pnl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `trade_book` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `OrderBook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TradeBook` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PERSONAL', 'FINANCE', 'CLIENTS', 'FRIENDS', 'TRAVEL', 'JUNK');

-- DropForeignKey
ALTER TABLE "OrderBook" DROP CONSTRAINT "OrderBook_user_id_fkey";

-- DropForeignKey
ALTER TABLE "TradeBook" DROP CONSTRAINT "TradeBook_user_id_fkey";

-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "access_token",
DROP COLUMN "broker",
DROP COLUMN "child",
DROP COLUMN "email",
DROP COLUMN "key",
DROP COLUMN "name",
DROP COLUMN "order_book",
DROP COLUMN "parent",
DROP COLUMN "role",
DROP COLUMN "secret",
DROP COLUMN "today_pnl",
DROP COLUMN "total_pnl",
DROP COLUMN "trade_book",
ADD COLUMN     "date_of_birth" TEXT,
ADD COLUMN     "email_id" TEXT NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "phone_number" TEXT;

-- DropTable
DROP TABLE "OrderBook";

-- DropTable
DROP TABLE "TradeBook";

-- DropEnum
DROP TYPE "Broker";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "TransactionType";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "reciver" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "email_time_stamp" TIMESTAMP(3) NOT NULL,
    "tag" TEXT NOT NULL,
    "category" "Category" NOT NULL DEFAULT 'PERSONAL',
    "orignal_email_id" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_id_key" ON "User"("email_id");

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_sender_fkey" FOREIGN KEY ("sender") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
