import prisma from "../../src/config/database";
import bcrypt from "bcrypt";

async function main() {
  await prisma.user.deleteMany();

  // Array of users to seed
  const users = [
    {
      name: "Adele",
      dateOfBirth: "1988-05-05",
      email: "adele@gmail.com",
      password: await bcrypt.hash("password123", 10),
      artistProfile: {
        create: {
          artistName: "Adele",
          musicGenre: "Pop",
          bio: "I am a singer",
          countryOfOrigin: "UK",
          profilePhoto: "https://example.com/photo1.jpg",
          bannerImage: "https://example.com/banner1.jpg",
          signatureSound: "https://example.com/sound1.mp3",
          appleMusicAddress: "https://example.com/apple1",
          spotifyAddress: "https://example.com/spotify1",
          soundCloudAddress: "https://example.com/soundcloud1",
          youtubeAddress: "https://example.com/youtube1",
          instagramAddress: "https://example.com/instagram1",
          tiktokAddress: "https://example.com/tiktok1",
          manager: "Manager 1",
        },
      },
    },
    {
      name: "Drake",
      dateOfBirth: "1986-10-24",
      email: "drake@gmail.com",
      password: await bcrypt.hash("password123", 10),
      artistProfile: {
        create: {
          artistName: "Drake",
          musicGenre: "Hip Hop",
          bio: "I am a rapper",
          countryOfOrigin: "Canada",
          profilePhoto: "https://example.com/photo2.jpg",
          bannerImage: "https://example.com/banner2.jpg",
          signatureSound: "https://example.com/sound2.mp3",
          appleMusicAddress: "https://example.com/apple2",
          spotifyAddress: "https://example.com/spotify2",
          soundCloudAddress: "https://example.com/soundcloud2",
          youtubeAddress: "https://example.com/youtube2",
          instagramAddress: "https://example.com/instagram2",
          tiktokAddress: "https://example.com/tiktok2",
          manager: "Manager 2",
        },
      },
    },

    {
      name: "Beyonce",
      dateOfBirth: "1981-09-04",
      email: "beyonce",
      password: await bcrypt.hash("password123", 10),
      artistProfile: {
        create: {
          artistName: "Beyonce",
          musicGenre: "Pop",
          bio: "I am a singer",
          countryOfOrigin: "USA",
          profilePhoto: "https://example.com/photo3.jpg",
          bannerImage: "https://example.com/banner3.jpg",
          signatureSound: "https://example.com/sound3.mp3",
          appleMusicAddress: "https://example.com/apple3",
          spotifyAddress: "https://example.com/spotify3",
          soundCloudAddress: "https://example.com/soundcloud3",
          youtubeAddress: "https://example.com/youtube3",
          instagramAddress: "https://example.com/instagram3",
          tiktokAddress: "https://example.com/tiktok3",
          manager: "Manager 3",
        },
      },
    },
    {
      name: "Kanye West",
      dateOfBirth: "1977-06-08",
      email: "kayne@gmail.com",
      password: await bcrypt.hash("password123", 10),
      artistProfile: {
        create: {
          artistName: "Kanye West",
          musicGenre: "Hip Hop",
          bio: "I am a rapper",
          countryOfOrigin: "USA",
          profilePhoto: "https://example.com/photo4.jpg",
          bannerImage: "https://example.com/banner4.jpg",
          signatureSound: "https://example.com/sound4.mp3",
          appleMusicAddress: "https://example.com/apple4",
          spotifyAddress: "https://example.com/spotify4",
          soundCloudAddress: "https://example.com/soundcloud4",
          youtubeAddress: "https://example.com/youtube4",
          instagramAddress: "https://example.com/instagram4",
          tiktokAddress: "https://example.com/tiktok4",
          manager: "Manager 4",
        },
      },
    },
    {
      name: "Ed Sheeran",
      dateOfBirth: "1991-02-17",
      email: "ed@gmail.com",
      password: await bcrypt.hash("password123", 10),
      artistProfile: {
        create: {
          artistName: "Ed Sheeran",
          musicGenre: "Pop",
          bio: "I am a singer",
          countryOfOrigin: "UK",
          profilePhoto: "https://example.com/photo5.jpg",
          bannerImage: "https://example.com/banner5.jpg",
          signatureSound: "https://example.com/sound5.mp3",
          appleMusicAddress: "https://example.com/apple5",
          spotifyAddress: "https://example.com/spotify5",
          soundCloudAddress: "https://example.com/soundcloud5",
          youtubeAddress: "https://example.com/youtube5",
          instagramAddress: "https://example.com/instagram5",
          tiktokAddress: "https://example.com/tiktok5",
          manager: "Manager 5",
        },
      },
    },
    {
      name: "Rihanna",
      dateOfBirth: "1988-02-20",
      email: "rihana@gmail.com",
      password: await bcrypt.hash("password123", 10),
      artistProfile: {
        create: {
          artistName: "Rihanna",
          musicGenre: "Pop",
          bio: "I am a singer",
          countryOfOrigin: "Barbados",
          profilePhoto: "https://example.com/photo6.jpg",
          bannerImage: "https://example.com/banner6.jpg",
          signatureSound: "https://example.com/sound6.mp3",
          appleMusicAddress: "https://example.com/apple6",
          spotifyAddress: "https://example.com/spotify6",
          soundCloudAddress: "https://example.com/soundcloud6",
          youtubeAddress: "https://example.com/youtube6",
          instagramAddress: "https://example.com/instagram6",
          tiktokAddress: "https://example.com/tiktok6",
          manager: "Manager 6",
        },
      },
    },
  ];

  // Loop through the users array and create a new user for each
  users.forEach(async (user: any) => {
    const users = await prisma.user.create({
      data: user,
      include: {
        artistProfile: true,
      },
    });
    console.log(users);
    return users;
  });
}

main()
  .catch((e) => {
    console.error(e);
    return;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
