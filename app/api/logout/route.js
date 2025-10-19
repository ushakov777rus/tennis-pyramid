// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      return NextResponse.json({ errorCode: "auth.logoutFailed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (e) {
    console.error("Logout route error:", e);
    return NextResponse.json({ errorCode: "common.internalError" }, { status: 500 });
  }
}
