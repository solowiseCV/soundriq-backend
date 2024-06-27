import { createArtist, getAllArtists } from "../models/artistModel";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../utils/jwt";

class ArtistService {
  static async registerArtist(artistData: any) {
    const hashedPassword = await bcrypt.hash(artistData.password, 10);
    const artist = await createArtist({
      ...artistData,
      password: hashedPassword,
    });
    if (artist) {
      return artist;
    }
    throw new Error("Artist not created");
  }

  //   static async loginArtist(email: string, password: string) {
  //     const artist = await findArtistByEmail(email);
  //     if (!artist) {
  //       throw new Error("artist not found");
  //     }

  //     const isPasswordValid = await bcrypt.compare(password, artist.password);
  //     if (!isPasswordValid) {
  //       throw new Error("Invalid credentials");
  //     }

  //     const token = generateToken(artist.id);

  //     return { token, artist };
  //   }

  //   static async getArtist(email: string) {
  //     const artist = await findArtistByEmail(email);
  //     return artist;
  //   }

  static async getAllArtists() {
    const artists = await getAllArtists();
    return artists;
  }
}

export default ArtistService;
