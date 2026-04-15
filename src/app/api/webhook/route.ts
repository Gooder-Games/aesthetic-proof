import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = (await headers()).get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret) {
       console.error("Missing Stripe Signature or Webhook Secret");
       return NextResponse.json({ error: "Configuration Error" }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const userId = session.metadata?.userId;

    if (!userId) {
       console.error("Missing userId in checkout metadata");
       return NextResponse.json({ error: "Missing Metadata" }, { status: 400 });
    }

    // Use Service Role Key to bypass RLS for credit update
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Increment credits in api_keys table
    console.log(`Fulfilling checkout for user: ${userId}`);
    
    try {
      const { data, error: rpcError } = await supabaseAdmin.rpc("increment_credits", {
           user_id_param: userId,
           increment_amount: 10000
      });

      if (rpcError) {
         console.error("Supabase RPC Error:", rpcError);
         return NextResponse.json({ error: rpcError.message }, { status: 500 });
      }
      
      console.log(`Successfully added 10,000 credits to user ${userId}`);
    } catch (err: any) {
      console.error("Critical Webhook Processing Error:", err);
      return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
