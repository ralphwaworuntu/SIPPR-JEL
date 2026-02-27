import { db } from "./db";
import { congregants } from "./schema";
import { count } from "drizzle-orm";

async function test() {
    try {
        console.log("Testing DB connection...");
        const result = await db.select({ total: count() }).from(congregants);
        console.log("Success! Total congregants:", result[0].total);
        process.exit(0);
    } catch (error) {
        console.error("DB Test Failed:", error);
        process.exit(1);
    }
}

test();
