-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('BUY', 'SELL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('COMPLETED', 'REJECTED', 'CANCELLED', 'PENDING');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('UNASSIGNED', 'PARENT', 'CHILD', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'UNASSIGNED',
    "child" TEXT[],
    "parent" TEXT,
    "today_pnl" INTEGER NOT NULL DEFAULT 0,
    "total_pnl" INTEGER NOT NULL DEFAULT 0,
    "trade_book" TEXT[],
    "order_book" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TradeBook" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,

    CONSTRAINT "TradeBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderBook" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "status" "OrderStatus" NOT NULL,

    CONSTRAINT "OrderBook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "TradeBook" ADD CONSTRAINT "TradeBook_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderBook" ADD CONSTRAINT "OrderBook_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
