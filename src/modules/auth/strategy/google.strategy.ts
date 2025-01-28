import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";

@Injectable()
export class googleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: "http://localhost:3000/auth/google/redirect",
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const { name, emails, photos } = profile;
    const { givenName: firstName, familyName: lastName } = name;
    const [emailData] = emails;
    const [images] = photos;
    const user = {
      firtstName: firstName,
      lastName,
      email: emailData?.value,
      avatar: images?.value,
      accessToken,
    };
    done(null, user);
  }
}
