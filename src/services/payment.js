import { apiFetch } from "./api";

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

// Display prices only, read from build-time env vars (VITE_PLAN_PRICE_*)
// instead of being hardcoded. There is no public plans endpoint yet, so
// these MUST be kept in sync by hand with the real charge amounts in
// back/.env's PLAN_PRICE_*_INR — changing either one alone will make the
// price shown here disagree with what Razorpay actually charges.
// NOTE: Vite bakes these in at build time, not read at runtime — after
// changing q_paper/.env you need to rebuild/redeploy for it to take effect.
const priceLabel = (rupees) => `₹${rupees}`;

export const PLANS = [
  { id: "monthly", label: "Monthly", price: priceLabel(import.meta.env.VITE_PLAN_PRICE_MONTHLY ?? 1), period: "/month" },
  { id: "yearly", label: "Yearly", price: priceLabel(import.meta.env.VITE_PLAN_PRICE_YEARLY ?? 10), period: "/year" },
  { id: "lifetime", label: "Lifetime", price: priceLabel(import.meta.env.VITE_PLAN_PRICE_LIFETIME ?? 25), period: " once" },
];

let scriptPromise = null;
function loadRazorpayScript() {
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
  return scriptPromise;
}

async function createOrder(plan) {
  const res = await apiFetch("/api/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Could not start checkout");
  return data.order;
}

async function verifyPayment(payload) {
  const res = await apiFetch("/api/payment/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Payment verification failed");
  return data;
}

/**
 * Creates a Razorpay order, opens the Checkout widget, verifies the
 * completed payment with the backend, then calls onSuccess/onError.
 */
export async function openCheckout({ plan, user, onSuccess, onError }) {
  try {
    const order = await createOrder(plan);
    await loadRazorpayScript();

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "NIT KKR PYQs",
      description: `${plan[0].toUpperCase()}${plan.slice(1)} plan`,
      prefill: { email: user?.email, name: user?.name },
      handler: async (response) => {
        try {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          onSuccess?.();
        } catch (err) {
          onError?.(err);
        }
      },
      modal: {
        ondismiss: () => onError?.(new Error("Checkout cancelled")),
      },
    });
    rzp.open();
  } catch (err) {
    onError?.(err);
  }
}
