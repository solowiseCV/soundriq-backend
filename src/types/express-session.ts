import "express-session";

declare module "express-session" {
  interface Session {
    artistId?: string;
  }
}
