import {
  createArtist,
  updatedArtist,
  getAllArtists,
  findArtistByEmail,
} from "../models/artistModel";
import bcrypt from "bcrypt";

class ArtistService {
  static async registerArtist(artistData: any) {
    // console.log(artistData)
    const existingArtist = await findArtistByEmail(artistData.email);

    console.log(existingArtist)
    if (existingArtist) {
      return { error: "Artist already exists" };
      // throw new Error("Artist already exists");
    }

    const hashedPassword = await bcrypt.hash(artistData.password, 10);
    const artist = await createArtist({
      ...artistData,
      password: hashedPassword,
    });
    if (artist) {
      const { fullName, email, id } = artist;
      const artistInfo = {
        fullName,
        email,
        id,
      };
      return artistInfo;
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

  static async completeProfile(artistId: Number, data: any) {
    // const artist = await findArtistByEmail(email);
    // if (!artist) {
    //   throw new Error("Artist not found");
    // }

    try {
      const updated = await updatedArtist({
        ...data,
        id: artistId,
      });

      if (updated) {
        // console.log("updated from serviee", updated);
        return updated;
      }
    } catch (error) {
      throw new Error("Profile not updated");
    }

    // const updated = await updatedArtist({
    //   ...data,
    //   id: artistId,
    // });

    // if (updated) {
    //   return updated;
    // }
    // throw new Error("Profile not updated");
  }
}

export default ArtistService;
