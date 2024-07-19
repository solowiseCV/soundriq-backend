-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_artistId_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "ArtistProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
