import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

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
    const { phone, password, shopName, slug } = await req.json()
    if (!phone || !password || !shopName || !slug) {
      return respond({ error: "Missing required fields." }, 400)
    }

    // Check slug availability
    const { data: existingSlug } = await supabase
      .from("vendors").select("id").eq("slug", slug).maybeSingle()
    if (existingSlug) return respond({ error: "That Shop ID was taken. Please choose another." }, 409)

    // Check phone not already registered
    const { data: existingVendor } = await supabase
      .from("vendors").select("id").eq("phone", phone).maybeSingle()
    if (existingVendor) return respond({ error: "This phone is already registered. Please Login." }, 409)

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      phone,
      password,
      phone_confirm: true,
    })

    if (authError) {
      if (authError.message.toLowerCase().includes("already")) {
        return respond({ error: "This phone is already registered. Please Login." }, 409)
      }
      return respond({ error: authError.message }, 500)
    }

    // Create vendor with 14-day trial
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    const { error: vendorError } = await supabase.from("vendors").insert({
      id: authData.user.id,
      shop_name: shopName,
      slug,
      phone,
      plan_type: "Trial",
      trial_ends_at: trialEndsAt.toISOString(),
      is_admin: false,
    })

    if (vendorError) {
      await supabase.auth.admin.deleteUser(authData.user.id)
      return respond({ error: vendorError.message }, 500)
    }

    return respond({ success: true })

  } catch (err) {
    console.error("complete-registration error:", err)
    return respond({ error: err.message || "Registration failed." }, 500)
  }
})