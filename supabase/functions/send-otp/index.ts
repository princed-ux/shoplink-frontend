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
    const { phone, type } = await req.json()

    if (!phone || !type) return respond({ error: "Phone and type are required" }, 400)
    if (!["register", "reset"].includes(type)) return respond({ error: "type must be register or reset" }, 400)

    const cleanPhone = phone.replace(/^\+/, "")

    // Validate phone against vendors table
    const { data: vendor } = await supabase
      .from("vendors")
      .select("id")
      .eq("phone", phone)
      .maybeSingle()

    if (type === "register" && vendor) {
      return respond({ error: "This phone number is already registered. Please Login." }, 409)
    }
    if (type === "reset" && !vendor) {
      return respond({ error: "No account found with this number." }, 404)
    }

    // Delete old OTPs for this phone+type
    await supabase
      .from("otp_verifications")
      .delete()
      .eq("phone", cleanPhone)
      .eq("type", type)

    // Call Sendchamp WhatsApp Verification API
    const sendchampRes = await fetch("https://api.sendchamp.com/api/v1/verification/create", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Deno.env.get("SENDCHAMP_API_KEY")}`,
      },
      body: JSON.stringify({
        channel: "whatsapp",
        sender: "Sendchamp",
        token_type: "numeric",
        token_length: 6,
        expiration_time: 10,
        customer_mobile_number: cleanPhone,
        meta_data: { app: "ShopLinkVi", type },
      }),
    })

    const sendchampData = await sendchampRes.json()
    console.log("Sendchamp response:", JSON.stringify(sendchampData))

    if (!sendchampData?.data?.reference) {
      return respond({ error: sendchampData?.message || "Failed to send WhatsApp code." }, 500)
    }

    // Store Sendchamp's reference UUID in DB
    const { error: insertError } = await supabase.from("otp_verifications").insert({
      phone: cleanPhone,
      reference: sendchampData.data.reference,
      type,
      used: false,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    })

    if (insertError) {
      console.error("DB insert error:", insertError)
      return respond({ error: "Failed to store verification. Please try again." }, 500)
    }

    return respond({ success: true, message: "WhatsApp code sent!" })

  } catch (err) {
    console.error("send-otp error:", err)
    return respond({ error: err.message || "Something went wrong." }, 500)
  }
})