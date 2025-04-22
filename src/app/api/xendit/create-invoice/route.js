import { NextResponse } from "next/server";
import axios from "axios";

const XENDIT_SECRET_KEY =
  "xnd_production_wFB9yDK19mowAUqyJzDW7SnRjiLpRl2DehXN2uUMXJ3SHE1I0jbMG8BMqydYpjV";

// 👇 Only include this in server-side code — NEVER expose to client
export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, email, orderId = Date.now(), remarks = "" } = body;

    if (!amount || !email) {
      return NextResponse.json(
        { error: "Amount and email are required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      "https://api.xendit.co/v2/invoices",
      {
        external_id: `order-${orderId}`,
        amount: Math.round(amount), // whole numbers only
        payer_email: email,
        description: `Payment for Order ${orderId}`,
        currency: "PHP",
        success_redirect_url: "http://localhost:3000/dashboard?status=success",
        failure_redirect_url: "http://localhost:3000/dashboard?status=failed",
        metadata: { order_id: orderId, remarks },
      },
      {
        auth: {
          username: XENDIT_SECRET_KEY,
          password: "", // password must be empty string per Xendit docs
        },
      }
    );

    return NextResponse.json({ invoice_url: response.data.invoice_url });
  } catch (error) {
    console.error("Xendit error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to create payment link" },
      { status: 500 }
    );
  }
}
