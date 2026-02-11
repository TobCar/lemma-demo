import { NextResponse } from "next/server";

const isDev = process.env.NODE_ENV === "development";

export function safeErrorResponse(message: string, status: number) {
  // Message in the network call will be the full error in dev, but a generic message in prod to avoid leaking info.
  return NextResponse.json(
    {
      error: isDev ? message : "Something went wrong",
    },
    { status },
  );
}
