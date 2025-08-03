import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  // очищаем cookie userId
  cookieStore.set("userId", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // сразу истекает
  });

  return NextResponse.json({ message: "logged out" });
}