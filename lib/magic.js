import { Magic } from "@magic-sdk/admin";

export const magicAdmin = new Magic(process.env.MAGIC_SECRET_API_KEY);