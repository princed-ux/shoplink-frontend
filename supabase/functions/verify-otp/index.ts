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
    const { phone, otp, type } = await req.json()

    if (!phone || !otp || !type) return respond({ error: "Missing required fields." }, 400)
    if (!["register", "reset"].includes(type)) return respond({ error: "type must be register or reset" }, 400)

    const cleanPhone = phone.replace(/^\+/, "")

    const { data: otpRecord } = await supabase
      .from("otp_verifications")
      .select("*")
      .eq("phone", cleanPhone)
      .eq("type", type)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!otpRecord) return respond({ error: "No pending verification found. Request a new code." }, 400)
    if (new Date(otpRecord.expires_at) < new Date()) return respond({ error: "Code expired. Please request a new one." }, 400)

    const verifyRes = await fetch("https://api.sendchamp.com/api/v1/verification/confirm", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SENDCHAMP_API_KEY")}`,
      },
      body: JSON.stringify({
        verification_reference: otpRecord.reference,
        verification_code: otp.toString().trim(),
      }),
    })

    const verifyData = await verifyRes.json()
    console.log("Sendchamp verify response:", JSON.stringify(verifyData))

    const verified =
      verifyData?.data?.status === "success" ||
      verifyData?.status === "success" ||
      verifyData?.code === 200

    if (!verified) return respond({ error: "Invalid code. Please check and try again." }, 400)

    await supabase
      .from("otp_verifications")
      .update({ used: true })
      .eq("id", otpRecord.id)

    return respond({ success: true, verified: true, phone })

  } catch (err) {
    console.error("verify-otp error:", err)
    return respond({ error: err.message || "Verification failed." }, 500)
  }
})