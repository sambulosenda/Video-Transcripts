import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { trials } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userTrial = await db
      .select()
      .from(trials)
      .where(eq(trials.userId, userId))
      .limit(1);

    if (userTrial.length === 0) {
      // Create a new trial for the user
      await db.insert(trials).values({
        userId,
        transcriptsUsed: 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      });
      return NextResponse.json({ transcriptsUsed: 0, hasActiveTrial: true });
    }

    const { transcriptsUsed, expiresAt } = userTrial[0];
    const hasActiveTrial = transcriptsUsed < 3 && new Date() < expiresAt;

    return NextResponse.json({ transcriptsUsed, hasActiveTrial });
  } catch (error) {
    console.error("Error in trial API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userTrial = await db
      .select()
      .from(trials)
      .where(eq(trials.userId, userId))
      .limit(1);

    if (userTrial.length === 0) {
      return NextResponse.json({ error: "Trial not found" }, { status: 404 });
    }

    const { transcriptsUsed, expiresAt } = userTrial[0];
    const newTranscriptsUsed = transcriptsUsed + 1;
    const hasActiveTrial = newTranscriptsUsed < 3 && new Date() < expiresAt;

    await db
      .update(trials)
      .set({ transcriptsUsed: newTranscriptsUsed })
      .where(eq(trials.userId, userId));

    return NextResponse.json({
      transcriptsUsed: newTranscriptsUsed,
      hasActiveTrial,
    });
  } catch (error) {
    console.error("Error updating trial usage:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
