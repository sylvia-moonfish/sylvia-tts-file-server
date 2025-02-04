import fs from "fs";
import { join } from "path";

import { NextRequest, NextResponse } from "next/server";

import { getUser, saveUser } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId") as string;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const dbUser = await getUser(userId);

    if (!dbUser)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const audio = formData.get("audio") as Blob;
    const promptId = formData.get("promptId") as string;

    if (!audio || !promptId)
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );

    const fileDir = join(
      process.cwd(),
      "public",
      "recordings",
      dbUser.username
    );
    const filePath = join(fileDir, `${promptId}.wav`);

    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

    const arrayBuffer = await audio.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    fs.writeFileSync(filePath, uint8Array);

    dbUser.recordings[promptId] = filePath;
    saveUser(dbUser);

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Error saving recording: ", error);

    return NextResponse.json(
      { error: "Failed to save recordings." },
      { status: 500 }
    );
  }
}
