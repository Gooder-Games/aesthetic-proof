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
    const formData = await request.formData();
    const tier = formData.get("tier");

    let creditsToAdd = 10000;
    let unitAmount = 1900;
    let productName = "10,000 Aesthetic Proof Credits";

    if (tier === "starter") {
      creditsToAdd = 500;
      unitAmount = 500;
      productName = "500 Aesthetic Proof Credits";
    } else if (tier === "scale") {
      creditsToAdd = 10000;
      unitAmount = 5900;
      productName = "10,000 Aesthetic Proof Credits";
    } else {
      // Default to Pro / Anchor tier
      creditsToAdd = 2500;
      unitAmount = 1900;
      productName = "2,500 Aesthetic Proof Credits";
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
              description: `Generate up to ${creditsToAdd.toLocaleString()} premium review images.`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/dashboard?status=success`,
      cancel_url: `${origin}/dashboard?status=cancelled`,
      metadata: {
        userId: user.id,
        creditsToAdd: creditsToAdd.toString(),
      },
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
