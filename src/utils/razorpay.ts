
/**
 * Utility functions to load and trigger the Razorpay payment gateway.
 * Add your Razorpay API key below!
 */
const RAZORPAY_KEY_ID = ""; // <-- Paste your Razorpay Key ID here

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const scriptId = "razorpay-js";
    if (document.getElementById(scriptId)) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface RazorpayPaymentOptions {
  amount: number;             // Amount in INR, e.g. 50000 (paise)
  order_id?: string;          // Your backend order id (if created from backend)
  name: string;               // Merchant/shop name
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  onSuccess: (response: any) => void;
  onFailure?: (response: any) => void;
}

export const openRazorpay = async (options: RazorpayPaymentOptions) => {
  await loadRazorpayScript();
  // @ts-ignore
  const Razorpay = window.Razorpay;
  if (!Razorpay) {
    alert("Razorpay SDK failed to load.");
    return;
  }

  const paymentOptions = {
    key: RAZORPAY_KEY_ID,
    amount: options.amount,
    currency: "INR",
    name: options.name,
    description: options.description || "",
    image: options.image,
    order_id: options.order_id,
    prefill: options.prefill,
    notes: options.notes,
    handler: function (response: any) {
      options.onSuccess(response);
    },
    theme: { color: "#D7263D" },
    modal: {
      ondismiss: function() {
        if (options.onFailure) options.onFailure({ reason: "User closed payment form" });
      }
    }
  };

  const rzp = new Razorpay(paymentOptions);
  rzp.open();
};

