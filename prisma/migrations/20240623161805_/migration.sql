/*
  Warnings:

  - The values [PARENT] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `instrument` on the `TradeBook` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `TradeBook` table. All the data in the column will be lost.
  - Added the required column `average_price` to the `TradeBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instrument_token` to the `TradeBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `TradeBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_timestamp` to the `TradeBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_type` to the `TradeBook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trading_symbol` to the `TradeBook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('UNASSIGNED', 'MASTER', 'CHILD', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'UNASSIGNED';
COMMIT;

-- AlterTable
ALTER TABLE "TradeBook" DROP COLUMN "instrument",
DROP COLUMN "price",
ADD COLUMN     "average_price" INTEGER NOT NULL,
ADD COLUMN     "instrument_token" TEXT NOT NULL,
ADD COLUMN     "order_id" TEXT NOT NULL,
ADD COLUMN     "order_timestamp" TEXT NOT NULL,
ADD COLUMN     "order_type" TEXT NOT NULL,
ADD COLUMN     "trading_symbol" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "access_token" TEXT;
