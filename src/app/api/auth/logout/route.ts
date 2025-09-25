import { NextResponse } from "next/server";

export async function POST() {
  try {
    // In a real app, you might want to invalidate JWT tokens here
    // For now, we'll just return success since we're using localStorage
    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
