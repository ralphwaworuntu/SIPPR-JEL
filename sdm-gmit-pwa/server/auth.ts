import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: ["http://localhost:5173", "http://192.168.1.31:5173", "http://192.168.1.31:3000", "http://192.168.56.1:5173"],
});
