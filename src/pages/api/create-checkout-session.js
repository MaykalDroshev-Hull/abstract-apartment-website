// pages/api/create-checkout-session.js
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }
  const { amount, checkIn, checkOut, guests, firstName, lastName, telephone } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Deposit for booking",
              description: `Check-in: ${checkIn}, Check-out: ${checkOut}, Guests: ${guests}`,
            },
            unit_amount: amount, // in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&telephone=${encodeURIComponent(telephone)}`,
      cancel_url: `${req.headers.origin}/payment?cancelled=true`,
      metadata: {
        checkIn,
        checkOut,
        guests,
        firstName,
        lastName,
        telephone,
      },

    });


    res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
