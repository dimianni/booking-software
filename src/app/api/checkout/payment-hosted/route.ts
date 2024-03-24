import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
  amount: z.number(),
  products: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().min(1, "Quantity must be at least 1!"),
      price: z.number(),
    })
  ),
});

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const body = await request.json();
    const input = inputSchema.parse(body);

    const moreInfo = {
      currency: "EUR",
      reference: "ORD-123A",
      billing: {
        address: {
          country: "DE",
        },
      },
      customer: {
        name: "John Smith",
        email: "john.smith@example.com",
      },
      "3ds": {
        enabled: true,
      },
      allow_payment_methods: ["card"],
      processing_channel_id: process.env.PROCESSING_CHANNEL_ID,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
      failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failure`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    };

    const combinedData = {
      ...moreInfo, // Spread the properties of `moreInfo`
      ...input, // Then spread the properties of `body` (which is your `cartData`)
      // Note: If both objects contain properties with the same name, `body` properties will overwrite `moreInfo` properties
    };

    const paymentResponse = await fetch(
      "https://api.sandbox.checkout.com/hosted-payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SECRET_KEY}`,
        },
        body: JSON.stringify(combinedData),
      }
    );

    const paymentData = await paymentResponse.json();
    console.log(paymentData);

    // If the request is successful, redirect the customer to the giropay page
    if (paymentData._links && paymentData._links.redirect) {
      return NextResponse.json({ paymentData }, { status: 200 });
      // res.status(200).json(paymentData);
    } else {
      const errorResponse = {
        error: "Payment initiation failed",
        status: paymentData.status,
        code: paymentData.response_code,
        summary: paymentData.response_summary,
      };

      // Handle other statuses or errors
      // res.status(400).json({ errorResponse });
      return NextResponse.json({ errorResponse }, { status: 400 });
    }
  } catch (error) {
    //   res.status(500).json({ error: error.message });
    const errorMessage = (error as Error).message;

    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
