// app/api/logout/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Logout error:", error);
      return NextResponse.json({ error: "Ошибка при выходе" }, { status: 500 });
    }

    return NextResponse.json({ message: "Выход выполнен успешно" });

  } catch (e) {
    console.error("Logout route error:", e);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  }
}