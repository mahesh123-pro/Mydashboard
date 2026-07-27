import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Map helper to format frontend id to MongoDB _id
    const mapArray = (arr: any[]) =>
      (arr || []).map((item) => {
        if (item.id && !item._id) {
          return { _id: item.id, ...item };
        }
        return item;
      });

    // We only update keys that are present in the request body to prevent accidental wipes.
    const keys = Object.keys(body);

    for (const key of keys) {
      const data = body[key];

      switch (key) {
        // Arrays mapping to specific collections
        case "tasks":
          await db.collection("tasks").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("tasks").insertMany(mapArray(data));
          }
          break;
        case "meetings":
          await db.collection("meetings").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("meetings").insertMany(mapArray(data));
          }
          break;
        case "activity":
          await db.collection("activity").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("activity").insertMany(mapArray(data));
          }
          break;
        case "habits":
          await db.collection("habits").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("habits").insertMany(mapArray(data));
          }
          break;
        case "supplements":
          await db.collection("supplements").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("supplements").insertMany(mapArray(data));
          }
          break;
        case "body":
          await db.collection("body").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("body").insertMany(data);
          }
          break;
        case "workouts":
          await db.collection("workouts").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("workouts").insertMany(mapArray(data));
          }
          break;
        case "prs":
          await db.collection("prs").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("prs").insertMany(data);
          }
          break;
        case "projects":
          await db.collection("projects").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("projects").insertMany(mapArray(data));
          }
          break;
        case "subscriptions":
          await db.collection("subscriptions").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("subscriptions").insertMany(mapArray(data));
          }
          break;
        case "savingsGoals":
          await db.collection("savings_goals").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("savings_goals").insertMany(mapArray(data));
          }
          break;
        case "transactions":
          await db.collection("transactions").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("transactions").insertMany(mapArray(data));
          }
          break;
        case "journal":
          await db.collection("journal").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("journal").insertMany(mapArray(data));
          }
          break;
        case "jobs":
          await db.collection("jobs").deleteMany({});
          if (data && data.length > 0) {
            await db.collection("jobs").insertMany(mapArray(data));
          }
          break;

        // Single documents mapping to specific collections
        case "profile":
          if (data) {
            await db.collection<any>("profile").replaceOne(
              { _id: "profile" },
              { _id: "profile", ...data },
              { upsert: true }
            );
          }
          break;
        case "notes":
          if (data) {
            await db.collection<any>("notes").replaceOne(
              { _id: "notes" },
              { _id: "notes", list: data },
              { upsert: true }
            );
          }
          break;
        case "habitLog":
          if (data) {
            await db.collection<any>("habit_logs").replaceOne(
              { _id: "habit_logs" },
              { _id: "habit_logs", log: data },
              { upsert: true }
            );
          }
          break;
        case "healthGoals":
          if (data) {
            await db.collection<any>("health_goals").replaceOne(
              { _id: "health_goals" },
              { _id: "health_goals", ...data },
              { upsert: true }
            );
          }
          break;
        case "healthLog":
          if (data) {
            await db.collection<any>("health_logs").replaceOne(
              { _id: "health_logs" },
              { _id: "health_logs", log: data },
              { upsert: true }
            );
          }
          break;
        case "meals":
          if (data) {
            await db.collection<any>("meals").replaceOne(
              { _id: "meals" },
              { _id: "meals", ...data },
              { upsert: true }
            );
          }
          break;
        case "finance":
          if (data) {
            await db.collection<any>("finance").replaceOne(
              { _id: "finance" },
              { _id: "finance", ...data },
              { upsert: true }
            );
          }
          break;
        case "settings":
          if (data) {
            await db.collection<any>("settings").replaceOne(
              { _id: "settings" },
              { _id: "settings", ...data },
              { upsert: true }
            );
          }
          break;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Sync failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
