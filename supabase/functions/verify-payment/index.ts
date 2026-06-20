// supabase/functions/verify-payment/index.ts
// Verifies a Paystack payment and updates the vendor's plan in the database
// Called after a successful Paystack payment in DashboardLayout

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Maps Paystack amounts (kobo) to plan names
const AMOUNT_TO_PLAN: Record<number, string> = {
  80000:   'Basic',
  150000:  'Growth',
  300000:  'Pro',
  600000:  'Business',
  1200000: 'Unlimited',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reference } = await req.json()

    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Missing payment reference.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // --- Step 1: Verify the payment with Paystack ---
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')!}`,
        },
      }
    )

    const paystackData = await paystackRes.json()

    if (!paystackRes.ok || paystackData?.data?.status !== 'success') {
      throw new Error('Payment verification failed. Please contact support.')
    }

    const { amount, metadata } = paystackData.data
    const vendorId = metadata?.vendorId

    if (!vendorId) {
      throw new Error('Missing vendor ID in payment metadata.')
    }

    // --- Step 2: Map the amount to a plan name ---
    const planName = AMOUNT_TO_PLAN[amount]
    if (!planName) {
      throw new Error(`Unknown plan amount: ${amount}`)
    }

    // --- Step 3: Update the vendor's plan in Supabase ---
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')!
    )

    // Fetch current vendor to check trial status
    const { data: vendor, error: fetchError } = await supabase
      .from('vendors')
      .select('trial_ends_at, plan_type')
      .eq('id', vendorId)
      .single()

    if (fetchError || !vendor) throw new Error('Vendor not found.')

    const trialActive = vendor.trial_ends_at && new Date(vendor.trial_ends_at) > new Date()

    // If trial is still active, queue the plan (it activates when trial ends)
    // If trial is expired, activate immediately
    const updatePayload = trialActive
      ? { plan_type: planName }   // Queue it — trial still running
      : { plan_type: planName }   // Activate immediately

    const { data: updatedVendor, error: updateError } = await supabase
      .from('vendors')
      .update(updatePayload)
      .eq('id', vendorId)
      .select('*')
      .single()

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, vendor: updatedVendor }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('verify-payment error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Payment verification failed.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})