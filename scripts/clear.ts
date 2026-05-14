import { db } from "@/lib/db";
import {
    users,
    sessions,
    accounts,
    verifications,
    chamas,
    chamaMemberships,
    contributions,
    invitations,
} from "@/lib/db/schema";
import { sql } from "drizzle-orm";

async function clear() {
    console.log("🧨 Wiping database...");

    // Order matters for foreign key constraints if they were enabled
    // But SQLite usually doesn't enforce unless PRAGMA foreign_keys = ON

    try {
        await db.delete(contributions);
        await db.delete(invitations);
        await db.delete(chamaMemberships);
        await db.delete(chamas);
        await db.delete(sessions);
        await db.delete(accounts);
        await db.delete(verifications);
        await db.delete(users);

        console.log("✅ Database wiped clean!");
    } catch (err) {
        console.error("❌ Wipe failed:", err);
        process.exit(1);
    }
}

clear();
