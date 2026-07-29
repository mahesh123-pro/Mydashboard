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

  // 1. Drop old individual collections to keep database clean
  const oldCollections = [
    "profile", "habits", "habit_logs", "health_goals", "health_logs", "meals", 
    "supplements", "body", "workouts", "prs", "projects", "finance", 
    "subscriptions", "savings_goals", "transactions", "tasks", "meetings", 
    "activity", "journal", "jobs", "notes", "settings"
  ];
  console.log("Cleaning up old individual collections...");
  for (const name of oldCollections) {
    try {
      await db.collection(name).drop();
    } catch {
      // Ignore if collection doesn't exist or is already dropped
    }
  }

  // 2. Prepare consolidated dashboard document
  const dashboardData = {
    _id: "dashboard",
    profile: seedProfile,
    tasks: seedTasks,
    meetings: seedMeetings,
    activity: seedActivity,
    notes: seedNotes,
    habits: seedHabits,
    habitLog: buildHabitLog(),
    healthLog: buildHealthLog(),
    healthGoals: healthGoals,
    meals: seedMeals,
    supplements: seedSupplements,
    body: buildBody(),
    workouts: buildWorkouts(),
    prs: seedPRs,
    projects: seedProjects,
    finance: financeSummary,
    subscriptions: seedSubscriptions,
    savingsGoals: seedSavingsGoals,
    transactions: seedTransactions,
    journal: seedJournal,
    jobs: seedJobs,
    settings: defaultSettings
  };

  // 3. Seed consolidated dashboard document
  console.log("Seeding consolidated dashboard document...");
  await db.collection<any>("dashboard").replaceOne(
    { _id: "dashboard" },
    dashboardData,
    { upsert: true }
  );

  console.log("Database seeded successfully!");
  await client.close();
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
