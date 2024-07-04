/*
  Warnings:

  - Added the required column `priorityIndex` to the `Priority` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Priority" ADD COLUMN     "priorityIndex" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "statusId" SET DEFAULT 1;
