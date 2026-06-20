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
    const { phone, otp, newPassword } = await req.json()

    if (!phone || !otp || !newPassword) return respond({ error: "Missing required fields." }, 400)
    if (newPassword.length < 6) return respond({ error: "Password must be at least 6 characters." }, 400)

    const cleanPhone = phone.replace(/^\+/, "")

    // Find OTP record
    const { data: otpRecord } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("phone", cleanPhone)
      .eq("type", "reset")
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!otpRecord) return respond({ error: "No pending verification found. Please request a new code." }, 400)
    if (new Date(otpRecord.expires_at) < new Date()) return respond({ error: "Code has expired. Please request a new one." }, 400)

    // Compare directly — reference holds the OTP code
    if (otpRecord.reference !== otp.toString().trim()) {
      return respond({ error: "Invalid code. Please check and try again." }, 400)
    }

    // Get vendor
    const { data: vendor } = await supabase
      .from("vendors").select("id").eq("phone", phone).maybeSingle()
    if (!vendor) return respond({ error: "No account found with this number." }, 404)

    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      vendor.id, { password: newPassword }
    )
    if (updateError) return respond({ error: updateError.message }, 500)

    // Mark OTP used
    await supabase.from("otp_verifications").update({ used: true }).eq("id", otpRecord.id)

    return respond({ success: true })

  } catch (err) {
    console.error("reset-password error:", err)
    return respond({ error: err.message || "Failed to reset password." }, 500)
  }
})