"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

export async function generateApiKey() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const newKey = `ap_${crypto.randomBytes(24).toString("hex")}`;

  const { error } = await supabase
    .from("api_keys")
    .insert([
      {
        user_id: user.id,
        key: newKey,
        credits_left: 0, // Initial credits
      },
    ]);

  if (error) {
    console.error("Error generating API key:", error);
    throw new Error("Failed to generate API key");
  }

  revalidatePath("/dashboard");
}
