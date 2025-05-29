import { SessionOptions } from "iron-session";

export interface SessionData {
    userId?: string;
    rol?: number;
    name?: string;
    lastname?: string;
    isLoggedIn: boolean;
    isAdmin: boolean;
    sucursal: number;
    nota: number;
}

export const defaultSession: SessionData = {
    isLoggedIn: false,
    isAdmin: false,
    sucursal: 0,
    nota: 0,
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