-- DropForeignKey
ALTER TABLE "Email" DROP CONSTRAINT "Email_sender_fkey";

-- AddForeignKey
ALTER TABLE "Email" ADD CONSTRAINT "Email_reciver_fkey" FOREIGN KEY ("reciver") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
