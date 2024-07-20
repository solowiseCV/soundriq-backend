import prisma, {
  User,
  BlacklistedToken,
  ArtistProfile,
} from "../config/database";

type CreateUserInput = Omit<User, "createdAt" | "updatedAt"> & {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  artistProfile?: {
    fullName?: string;
    artistName?: string;
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

const profileFields = [
  "artistName",
  "profilePhoto",
  "bannerImage",
  "signatureSound",
  "countryOfOrigin",
  "bio",
  "musicGenre",
  "appleMusicAddress",
  "spotifyAddress",
  "soundCloudAddress",
  "youtubeAddress",
  "instagramAddress",
  "tiktokAddress",
  "manager",
];

const calculateProfileCompletion = (
  profile: Partial<ArtistProfile>
): number => {
  const totalFields = profileFields.length;
  let filledFields = 0;

  profileFields.forEach((field) => {
    if (profile[field as keyof ArtistProfile]) {
      filledFields++;
    }
  });

  const completed = Math.floor((filledFields / totalFields) * 85 );
  return completed + 15;
};

export const createUser = async (
  data: CreateUserInput
): Promise<{ user: User; profileCompletion: number }> => {
  const { artistProfile, ...userData } = data;

  const profileCompletion = 15;

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

  return { user, profileCompletion };
};

export const updateUser = async (
  data: CreateUserInput
): Promise<{ user: User; profileCompletion: number }> => {
  const { artistProfile } = data;

  const profileCompletion = artistProfile
    ? calculateProfileCompletion(artistProfile)
    : 0;

  const updatedArtist = await prisma.user.update({
    where: { id: data.id },
    data: {
      artistProfile: artistProfile
        ? {
            update: {
              ...artistProfile,
            },
          }
        : undefined,
    },
    include: { artistProfile: true },
  });

  return { user: updatedArtist, profileCompletion };
};

export const findArtistByUserId = async (
  userId: string
): Promise<ArtistProfile | null> => {
  return await prisma.artistProfile.findFirst({ where: { userId } });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getAllArtists = async (): Promise<ArtistProfile[]> => {
  return await prisma.artistProfile.findMany();
};

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
