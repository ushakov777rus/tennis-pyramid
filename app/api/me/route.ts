import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  // в 15.4.2 cookies() синхронная!
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    return NextResponse.json({ loggedIn: false });
  }

  // запрос в Supabase
  const { data, error } = await supabase
    .from("users")
    .select("id, name, role")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ loggedIn: false });
  }

  return NextResponse.json({
    loggedIn: true,
    user: data,
  });
}