import { NextResponse } from "next/server";
import { simulate, systemPrompt, type AssistantContext } from "@/lib/assistant";

export const runtime = "nodejs";

type Body = {
  message: string;
  context: AssistantContext;
  history?: { role: "user" | "assistant"; content: string }[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, context, history = [] } = body;
  if (!message?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

  const key = process.env.ANTHROPIC_API_KEY;

  // No key configured → deterministic, context-aware fallback (still genuinely useful).
  if (!key) {
    return NextResponse.json({ text: simulate(message, context), source: "simulation" });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5",
        max_tokens: 500,
        system: systemPrompt(context),
        messages: [
          ...history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
          { role: "user", content: message },
        ],
      }),
    });

    if (!res.ok) throw new Error(`Anthropic ${res.status}`);
    const data = await res.json();
    const text =
      (data.content ?? [])
        .filter((b: { type: string }) => b.type === "text")
        .map((b: { text: string }) => b.text)
        .join("")
        .trim() || simulate(message, context);

    return NextResponse.json({ text, source: "claude" });
  } catch {
    // Any upstream failure degrades gracefully to the simulation.
    return NextResponse.json({ text: simulate(message, context), source: "simulation" });
  }
}
