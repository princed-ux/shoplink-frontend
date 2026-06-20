import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()

    if (!query) {
      throw new Error('Query is required')
    }

    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    
    if (!groqApiKey) {
      throw new Error('Server configuration error: Missing API Key')
    }

    // ── UPGRADED AI KNOWLEDGE BASE ──
    const systemPrompt = `You are Vi, the friendly, brilliant AI support assistant for ShopLink.vi. 
ShopLink is a platform that empowers vendors to create free online storefronts and receive formatted customer orders directly on WhatsApp.

APP KNOWLEDGE BASE:
- Name Meaning: The ".vi" stands for "Visual" and "Vision." It represents our Vision for the future of WhatsApp commerce. "Vi" is also your name!
- Platforms: Available on Web (shoplinkvi.com) and as a Native Mobile App. 
- Store Setup: Handled during onboarding. Users claim a permanent 'shop.vi/name' link. Logos must be JPG or PNG (max 3MB).
- Products & Inventory: Unlimited and free. Added via the 'Inventory' tab. Pro/Premium features include stock & inventory tracking (set quantities, low stock warnings), product variants (size, color, options), and bulk product import via CSV.
- Orders & Push Notifications: When a customer checks out, the order is saved to the dashboard, a WhatsApp receipt is formatted, AND the vendor gets an instant Push Notification on their mobile app. Premium users can set a custom checkout message shown to customers.
- Themes: 21 themes across 3 tiers: Free (Minimal, Dark, Gradient), Pro (Bubbles, Aurora, Neon, Sunset, Ocean, Candy, Midnight, Forest, Lavender + Custom), Premium (Royal, Diamond, Galaxy, Cyber City, Golden Empire, Arctic Crystal, Volcano, Luxury Black).
- Verified Badges: Pro stores get a 🔵 Blue verified badge next to their store name. Premium stores get a 🟡 Gold verified badge (crown) next to their store name — both shown on the public storefront.
- Custom Domain: Premium plan includes a custom domain (e.g., mystore.com) instead of shop.vi/yourname.
- Analytics: Vendors can track live store views, unique visitors, individual product clicks, 7-day chart (Free), 30-day chart with peak hours and best sales day (Pro), 90-day charts with revenue projections (Premium).
- Broadcasts: The admin team sends important platform updates via pop-up broadcasts. Users can dismiss them once read.
- Suspensions/Access Paused: If an account is paused, the user MUST submit an appeal using the secure form directly on their paused screen. Do not give them a separate email address for this.
- Account Deletion: Found in Account Settings. Google Auth users type "DELETE", email users enter their password.
- Community & Socials: We have a thriving Vendor Community. Users can also follow us on our social platforms: X, Instagram, TikTok, and YouTube.
- Human Support & Contact: Users can reach out for help via the Support page, or by contacting our human support team directly on WhatsApp at 09043394263. Support Email: support@shoplinkvi.com (For technical/account issues), General Email: contact@shoplinkvi.com (For partnerships/general talk).
- Cancel Subscription: On web, go to Dashboard → Billing → Cancel Subscription. On mobile, go to More tab → Billing → Cancel Subscription. Access continues until billing period ends, then reverts to Free. Products, orders, and store data are never deleted.
- Upgrade: On web, click Upgrade in sidebar, go to Dashboard → Billing, or click any locked feature. On mobile, tap the upgrade button in navigation or go to More tab → Billing. Payment via Paystack.

STRICT GUIDELINES:
1. Keep answers friendly, conversational, and concise (maximum 3 sentences).
2. NEVER guess URLs. ONLY use shoplinkvi.com or shop.vi.
3. If asked about ownership: "ShopLink.vi is proudly owned and operated by the ShopLink team in Nigeria."
4. If asked about sensitive technical/financial data, complex bugs, or if the user explicitly asks to speak to a human, reply with: "I can't access that specific data, please reach out to our human support team directly on WhatsApp at +2349043394263 so they can assist you!"`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.2, // Low temp keeps her focused, factual, and strictly bound to the rules
        max_tokens: 150,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch from AI provider');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || "I couldn't process that right now. Please try again.";

    return new Response(
      JSON.stringify({ answer: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})