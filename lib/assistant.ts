export type AssistantContext = {
  name: string;
  streak: number;
  tasksLeft: number;
  tasksDone: number;
  tasksTotal: number;
  habitsDone: number;
  habitsTotal: number;
  water: number;
  waterGoal: number;
  calories: number;
  protein: number;
  proteinGoal: number;
  caloriesBurned: number;
  urgentProject?: string;
  projects: { name: string; deadline: string; progress: number; status: string }[];
};

export function systemPrompt(ctx: AssistantContext) {
  return [
    "You are Mahesh OS — a concise, motivating personal-operating-system assistant embedded in a life dashboard.",
    "You help with productivity, fitness, diet, learning, career and finances. Be specific, warm, and actionable.",
    "Keep replies under 120 words. Use the user's real data below; never invent numbers that contradict it.",
    "Prefer 1-3 crisp suggestions over long essays. No markdown headers.",
    "",
    "USER SNAPSHOT (live):",
    JSON.stringify(ctx, null, 2),
  ].join("\n");
}

/** Deterministic, context-aware fallback used when no ANTHROPIC_API_KEY is configured. */
export function simulate(message: string, c: AssistantContext): string {
  const l = message.toLowerCase();
  const urgent = c.urgentProject ?? "your top project";

  if (l.includes("week") || l.includes("plan"))
    return `Here's a focused week: front-load ${urgent} (nearest deadline). Block deep-work mornings for coding, afternoons for applications and learning. You have ${c.tasksLeft} open tasks — batch the quick ones tomorrow AM. Protect one full rest day.`;
  if (l.includes("workout") || l.includes("gym") || l.includes("train"))
    return `Good day to train. Based on your split, hit Push (bench, OHP, incline DB, cable fly) at RPE 8 — add 2.5kg on bench if last week felt easy. You've burned ${c.caloriesBurned} kcal so far; aim for 500+.`;
  if (l.includes("diet") || l.includes("eat") || l.includes("protein") || l.includes("food"))
    return `You're at ${c.protein}g protein and ${c.calories} kcal today. To reach ${c.proteinGoal}g, add a whey shake + 200g chicken or paneer at dinner. Water is ${c.water}/${c.waterGoal} — top it up.`;
  if (l.includes("productiv") || l.includes("analyze") || l.includes("score"))
    return `Snapshot: ${c.habitsDone}/${c.habitsTotal} habits done, ${c.tasksDone}/${c.tasksTotal} tasks complete, ${c.streak}-day streak. Consistency is your edge. Biggest lever today: close out ${urgent}.`;
  if (l.includes("idea") || l.includes("project"))
    return `Three ideas that fit your stack: 1) An AI deload-planner from your gym logs. 2) A shared-auth "second brain" API across your projects. 3) A public build-in-progress changelog for your portfolio. Want me to scope one?`;
  if (l.includes("career") || l.includes("job") || l.includes("interview"))
    return `Career move: tighten your top project's README + a 60-sec demo video — recruiters skim fast. Do 1 mock system-design and 2 DSA sets this week. Your live offers give you leverage; don't accept the first number.`;
  return `Got it. You have ${c.tasksLeft} open tasks and a ${c.streak}-day streak. Want me to draft a plan around ${urgent}, or review your training and diet for today?`;
}
