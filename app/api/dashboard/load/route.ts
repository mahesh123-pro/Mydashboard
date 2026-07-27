import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Fetch all collections in parallel to optimize loading speed
    const [
      tasks,
      meetings,
      activity,
      habits,
      supplements,
      body,
      workouts,
      prs,
      projects,
      subscriptions,
      savingsGoals,
      transactions,
      journal,
      jobs,
      profileDoc,
      notesDoc,
      habitLogsDoc,
      healthGoalsDoc,
      healthLogsDoc,
      mealsDoc,
      financeDoc,
      settingsDoc,
    ] = await Promise.all([
      db.collection("tasks").find({}).toArray(),
      db.collection("meetings").find({}).toArray(),
      db.collection("activity").find({}).toArray(),
      db.collection("habits").find({}).toArray(),
      db.collection("supplements").find({}).toArray(),
      db.collection("body").find({}).toArray(),
      db.collection("workouts").find({}).toArray(),
      db.collection("prs").find({}).toArray(),
      db.collection("projects").find({}).toArray(),
      db.collection("subscriptions").find({}).toArray(),
      db.collection("savings_goals").find({}).toArray(),
      db.collection("transactions").find({}).toArray(),
      db.collection("journal").find({}).toArray(),
      db.collection("jobs").find({}).toArray(),
      db.collection<any>("profile").findOne({ _id: "profile" }),
      db.collection<any>("notes").findOne({ _id: "notes" }),
      db.collection<any>("habit_logs").findOne({ _id: "habit_logs" }),
      db.collection<any>("health_goals").findOne({ _id: "health_goals" }),
      db.collection<any>("health_logs").findOne({ _id: "health_logs" }),
      db.collection<any>("meals").findOne({ _id: "meals" }),
      db.collection<any>("finance").findOne({ _id: "finance" }),
      db.collection<any>("settings").findOne({ _id: "settings" }),
    ]);

    // Helper to map standard MongoDB documents back to frontend format (id instead of _id)
    const mapArray = (arr: any[]) =>
      arr.map((item) => {
        const { _id, ...rest } = item;
        return { id: _id, ...rest };
      });

    // Format single documents by removing _id
    const cleanDoc = (doc: any) => {
      if (!doc) return undefined;
      const { _id, ...rest } = doc;
      return rest;
    };

    return NextResponse.json({
      success: true,
      data: {
        profile: cleanDoc(profileDoc),
        tasks: mapArray(tasks),
        meetings: mapArray(meetings),
        activity: mapArray(activity),
        notes: notesDoc ? notesDoc.list : undefined,
        habits: mapArray(habits),
        habitLog: habitLogsDoc ? habitLogsDoc.log : undefined,
        healthLog: healthLogsDoc ? healthLogsDoc.log : undefined,
        healthGoals: cleanDoc(healthGoalsDoc),
        meals: cleanDoc(mealsDoc),
        supplements: mapArray(supplements),
        body: body.map(({ _id, ...rest }) => rest), // body has no id field, remove _id if any
        workouts: mapArray(workouts),
        prs: prs.map(({ _id, ...rest }) => rest), // prs has no id field, remove _id if any
        projects: mapArray(projects),
        finance: cleanDoc(financeDoc),
        subscriptions: mapArray(subscriptions),
        savingsGoals: mapArray(savingsGoals),
        transactions: mapArray(transactions),
        journal: mapArray(journal),
        jobs: mapArray(jobs),
        settings: cleanDoc(settingsDoc),
      },
    });
  } catch (error: any) {
    console.error("Load failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
