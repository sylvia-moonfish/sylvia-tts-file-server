import { NextRequest, NextResponse } from "next/server";

import { getUser, saveUser } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const dbUser = await getUser(userId);

    if (!dbUser)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Error getting user: ", error);

    return NextResponse.json({ error: "Failed to get user." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId") as string;

    if (!userId)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const dbUser = (await getUser(userId)) ?? {
      id: "",
      username: "",
      recordings: {},
      useVoice: 1,
      trainer: {
        isReady: false,
        submittedForTraining: false,
        model: {
          gptPath: "",
          sovitsPath: "",
          promptPath: "",
          promptText: "",
          promptLanguage: "",
        },
      },
      listener: {
        isReady: false,
        model: {
          gptPath: "",
          sovitsPath: "",
          promptPath: "",
          promptText: "",
          promptLanguage: "",
        },
      },
    };

    const username = formData.get("username") as string;

    if (!username)
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );

    dbUser.id = userId;
    dbUser.username = username;

    await saveUser(dbUser);

    return NextResponse.json(dbUser);
  } catch (error) {
    console.error("Error while saving user: ", error);

    return NextResponse.json(
      { error: "Failed to save user." },
      { status: 500 }
    );
  }
}
