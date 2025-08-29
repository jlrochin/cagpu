-- AlterTable
ALTER TABLE "users" ADD COLUMN     "service_id" VARCHAR(50);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
