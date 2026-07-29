import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();

    // Perform an atomic update of the single consolidated dashboard document
    await db.collection<any>("dashboard").replaceOne(
      { _id: "dashboard" },
      { _id: "dashboard", ...body },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Sync failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

