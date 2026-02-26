import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import os from "os";

// Function to dynamically get all local IPv4 addresses to use as trusted origins
const getLocalIPs = () => {
    const interfaces = os.networkInterfaces();
    const ips: string[] = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(`http://${iface.address}:5173`);
                ips.push(`http://${iface.address}:3000`);
            }
        }
    }
    return ips; // We add both frontend and backend ports just in case
};

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
    }),
    emailAndPassword: {
        enabled: true
    },
    trustedOrigins: ["http://localhost:5173", "http://localhost:3000", ...getLocalIPs()],
});
