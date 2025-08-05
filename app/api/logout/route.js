import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "logged out" });

  // очищаем cookie userId
  res.cookies.set("userId", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // сразу истекает
  });

  return res;
}