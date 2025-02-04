import { unlink } from "fs/promises";
import { join } from "path";

import { NextRequest, NextResponse } from "next/server";

import { getUser, saveUser } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const promptId = (await params).id;
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const dbUser = await getUser(userId);

    if (!dbUser)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    if (dbUser.recordings[promptId]) {
      const filePath = join(
        process.cwd(),
        "recordings",
        dbUser.recordings[promptId]
      );

      await unlink(filePath);
      delete dbUser.recordings[promptId];
      await saveUser(dbUser);
    }

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Error deleting recording: ", error);

    return NextResponse.json(
      { error: "Failed to delete recording." },
      { status: 500 }
    );
  }
}
