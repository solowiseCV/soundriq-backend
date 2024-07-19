import prisma, { User, BlacklistedToken, ArtistProfile } from "../config/database";

type CreateUserInput = Omit<User, "createdAt" | "updatedAt"> & {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  artistProfile?: {
    fullName?: string;
    artistName?: string;
    dateOfBirth?: string;
    profilePhoto?: string;
    bannerImage?: string;
    signatureSound?: string;
    countryOfOrigin?: string;
    bio?: string;
    musicGenre?: string;
    appleMusicAddress?: string;
    spotifyAddress?: string;
    soundCloudAddress?: string;
    youtubeAddress?: string;
    instagramAddress?: string;
    tiktokAddress?: string;
    manager?: string;
  };
};

export const createUser = async (
  data: CreateUserInput
): Promise<User> => {
  const { artistProfile, ...userData } = data;

  const user = await prisma.user.create({
    data: {
      ...userData,
      artistProfile: artistProfile
        ? {
            create: artistProfile,
          }
        : undefined,
    },
    // include: { artistProfile: true },
  });

  return user;

};

export const updateUser = async (
  data: CreateUserInput
): Promise<User> => {

  const { artistProfile } = data;

  return await prisma.user.update({
    
    where: { id: data.id },
    data: {
      artistProfile: artistProfile
        ? {
            update: {
              ...artistProfile,
            }
          }
        : undefined,
    },
    include: { artistProfile: true },
    },
  );
}

export const findArtistByUserId = async (userId: string): Promise<ArtistProfile | null> => {
  return await prisma.artistProfile.findFirst({ where: { userId } });
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getAllArtists = async (): Promise<ArtistProfile[]> => {
  return await prisma.artistProfile.findMany();
}

export const logoutUser = async (token: string): Promise<BlacklistedToken> => {
  const blacklistedToken = await prisma.blacklistedToken.findFirst({
    where: { token },
  });

  if (blacklistedToken) {
    throw new Error("Logged out already!");
  }

  return await prisma.blacklistedToken.create({ data: { token } });
};

export const savePasswordResetToken = async (userId: string, token: string) => {
  const expirationTime = new Date();
  expirationTime.setMinutes(expirationTime.getMinutes() + 10); // Token expires in 10 minutes

  const user = await prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expiresAt: expirationTime,
    },
  });

};

export const findUserByPasswordResetToken = async (
  token: string
): Promise<User | null> => {
  const passwordResetToken = await prisma.passwordResetToken.findFirst({
    where: { token },
  });

  if (!passwordResetToken) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: passwordResetToken.userId },
  });

  return user;
};

export const resetPassword = async (userId: string, password: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { password: password },
  });
};

export const invalidateResetToken = async (token: string) => {
  // fix this
  await prisma.passwordResetToken.deleteMany({
    where: { token: token },
  });
};
