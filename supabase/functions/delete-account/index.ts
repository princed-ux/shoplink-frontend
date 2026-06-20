import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const respond = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })

  try {
    const { userId, phone, password, skipPasswordCheck } = await req.json()

    if (!userId) return respond({ error: "Missing userId." }, 400)

    // If not skipping password check (i.e. vendor deleting own account)
    if (!skipPasswordCheck) {
      if (!phone || !password) return respond({ error: "Missing phone or password." }, 400)

      const anonClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!
      )

      const { error: signInError } = await anonClient.auth.signInWithPassword({
        phone,
        password,
      })

      if (signInError) return respond({ error: "Incorrect password. Please try again." }, 401)
    }

    // Delete vendor row (cascades to products via FK)
    await supabase.from("vendors").delete().eq("id", userId)

    // Delete auth user completely
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
    if (deleteError) return respond({ error: deleteError.message }, 500)

    return respond({ success: true })

  } catch (err) {
    console.error("delete-account error:", err)
    return respond({ error: err.message || "Failed to delete account." }, 500)
  }
})