import fs from "fs";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const filePath = path.join(
      process.cwd(),
      "recordings",
      (await params).path.join("/")
    );

    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath);

      return new Response(file, {
        headers: { "Content-Type": "audio/wav", "Cache-Control": "no-store" },
      });
    } else {
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }
  } catch (error) {
    console.error("Error retrieving file: ", error);

    return NextResponse.json(
      { error: "Error retrieving file." },
      { status: 500 }
    );
  }
}
