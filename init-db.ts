import { db } from "./lib/db";
import { users } from "./lib/db/schema";

async function main() {
  console.log("Database initialized.");
  // Optional: Add seeding logic here if needed for the demo
}

main().catch(console.error);
