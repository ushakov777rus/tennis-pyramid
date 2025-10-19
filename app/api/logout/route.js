// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      return NextResponse.json({ error: "Failed to sign out" }, { status: 500 });
    }

    return NextResponse.json({ message: "Sign-out successful" });

  } catch (e) {
    console.error("Logout route error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
