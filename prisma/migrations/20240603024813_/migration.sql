-- CreateEnum
CREATE TYPE "Broker" AS ENUM ('UPSTOCKS', 'DHAN', 'ANGEL', 'ESPRESSO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "broker" "Broker" NOT NULL DEFAULT 'UPSTOCKS',
ADD COLUMN     "key" TEXT,
ADD COLUMN     "secret" TEXT;
