import prisma, {Artist} from "../config/database";

export const createArtist = async (
  data: Omit<Artist, "id" | "createdAt" | "updatedAt">
): Promise<Artist> => {
  return await prisma.artist.create({ data });
};

export const updatedArtist = async (
  data: Omit<Artist, "createdAt" | "updatedAt">
): Promise<Artist> => {
  return await prisma.artist.update({ where: { id: data.id  }, data});
}

export const findArtistByEmail = async (email: string): Promise<Artist | null> => {
  return await prisma.artist.findUnique({ where: { email } });
};

export const getAllArtists = async (): Promise<Artist[]> => {
  return await prisma.artist.findMany();
};