import { stripe } from "@/lib/stripe";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    try {
      const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "10,000 Aesthetic Proof Credits",
              description: "Generate up to 10,000 premium review images.",
            },
            unit_amount: 1900, // $19.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dashboard?status=success`,
      cancel_url: `${origin}/dashboard?status=cancelled`,
      metadata: {
        userId: user.id,
      },
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
