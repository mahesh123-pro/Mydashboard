import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";
import {
  seedProfile,
  seedHabits,
  buildHabitLog,
  healthGoals,
  buildHealthLog,
  seedMeals,
  seedSupplements,
  buildBody,
  buildWorkouts,
  seedPRs,
  seedProjects,
  financeSummary,
  seedSubscriptions,
  seedSavingsGoals,
  seedTransactions,
  seedTasks,
  seedMeetings,
  seedActivity,
  seedJournal,
  seedJobs,
  seedNotes,
  defaultSettings,
} from "../lib/data/seed";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf-8");
    for (const line of envFile.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.endsWith("\r")) {
          value = value.substring(0, value.length - 1);
        }
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    }
  }
}

async function main() {
  loadEnv();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  const client = new MongoClient(uri);
  await client.connect();
  console.log("Connected successfully!");

  const db = client.db();

  const collections = [
    { name: "profile", data: seedProfile, type: "object" },
    { name: "habits", data: seedHabits, type: "array" },
    { name: "habit_logs", data: { _id: "habit_logs", log: buildHabitLog() }, type: "object" },
    { name: "health_goals", data: { _id: "health_goals", ...healthGoals }, type: "object" },
    { name: "health_logs", data: { _id: "health_logs", log: buildHealthLog() }, type: "object" },
    { name: "meals", data: { _id: "meals", ...seedMeals }, type: "object" },
    { name: "supplements", data: seedSupplements, type: "array" },
    { name: "body", data: buildBody(), type: "array" },
    { name: "workouts", data: buildWorkouts(), type: "array" },
    { name: "prs", data: seedPRs, type: "array" },
    { name: "projects", data: seedProjects, type: "array" },
    { name: "finance", data: { _id: "finance", ...financeSummary }, type: "object" },
    { name: "subscriptions", data: seedSubscriptions, type: "array" },
    { name: "savings_goals", data: seedSavingsGoals, type: "array" },
    { name: "transactions", data: seedTransactions, type: "array" },
    { name: "tasks", data: seedTasks, type: "array" },
    { name: "meetings", data: seedMeetings, type: "array" },
    { name: "activity", data: seedActivity, type: "array" },
    { name: "journal", data: seedJournal, type: "array" },
    { name: "jobs", data: seedJobs, type: "array" },
    { name: "notes", data: { _id: "notes", list: seedNotes }, type: "object" },
    { name: "settings", data: { _id: "settings", ...defaultSettings }, type: "object" }
  ];

  for (const col of collections) {
    console.log(`Seeding collection: ${col.name}...`);
    const collection = db.collection(col.name);
    
    // Clear existing data
    await collection.deleteMany({});
    
    if (col.type === "array") {
      const arr = col.data as any[];
      if (arr.length > 0) {
        // Map _id from id if present to make standard MongoDB documents
        const docs = arr.map(item => {
          if (item.id && !item._id) {
            return { _id: item.id, ...item };
          }
          return item;
        });
        await collection.insertMany(docs);
      }
    } else {
      const obj = col.data as any;
      if (col.name === "profile" && !obj._id) {
        obj._id = "profile";
      }
      await collection.insertOne(obj);
    }
  }

  console.log("Database seeded successfully!");
  await client.close();
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
