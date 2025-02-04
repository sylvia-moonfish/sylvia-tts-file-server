import { NextRequest, NextResponse } from "next/server";

import { getUser, saveUser } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const dbUser = await getUser(userId);

    if (!dbUser)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    dbUser.submittedForTraining = true;
    await saveUser(dbUser);

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Error submitting for training: ", error);

    return NextResponse.json(
      { error: "Failed to submit for training." },
      { status: 500 }
    );
  }
}
