import { NextResponse } from "next/server";

import { getPrompts } from "@/lib/db";

export async function GET() {
  try {
    const prompts = await getPrompts();

    return NextResponse.json(prompts);
  } catch (error) {
    console.error("Failed fetching prompts: ", error);

    return NextResponse.json(
      { error: "Failed to fetch prompts." },
      { status: 500 }
    );
  }
}
