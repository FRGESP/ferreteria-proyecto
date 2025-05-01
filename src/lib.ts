import { SessionOptions } from "iron-session";

export interface SessionData {
    userId?: string;
    rol?: number;
    name?: string;
    lastname?: string;
    isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
}

export const sessionOptions: SessionOptions = {
    password: process.env.SECRET_KEY!,
    cookieName: "blackwaves",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    },
    ttl: 60 * 60 * 1 * 1
}