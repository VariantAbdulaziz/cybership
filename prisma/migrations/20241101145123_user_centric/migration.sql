/*
  Warnings:

  - Added the required column `created_by_id` to the `customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "created_by_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "created_by_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "created_by_id" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "app_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
