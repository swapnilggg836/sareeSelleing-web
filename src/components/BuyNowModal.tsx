
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import RazorpayButton from "@/components/RazorpayButton";
import { openRazorpay } from "@/utils/razorpay";

interface BuyNowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string;
    name: string;
    images?: { url: string; alt?: string }[];
    price: number;
    color?: string;
  } | null;
}

// Extra reduced size for modal
const COMPACT_MODAL_CLASS = "max-w-xs !w-[320px] p-3 sm:rounded-lg"; // About 10px reduced

const STATES = [
  "Maharashtra", "Gujarat", "Rajasthan", "Delhi",
  "Karnataka", "Tamil Nadu", "West Bengal", "Uttar Pradesh"
];

const BuyNowModal: React.FC<BuyNowModalProps> = ({
  open,
  onOpenChange,
  product,
}) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [submitting, setSubmitting] = useState(false);

  if (!product) return null;

  const handleChange = (key: string, value: string) => {
    setCustomer((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    for (const key of ["name", "phone", "email", "address", "city", "state", "pincode"]) {
      if (!customer[key as keyof typeof customer]) {
        toast.error(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  const handleCODSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const orderData = {
        items: [{
          productId: product.id,
          quantity,
          color: product.color,
        }],
        shippingAddress: {
          fullName: customer.name,
          phone: customer.phone,
          email: customer.email,
          addressLine1: customer.address,
          addressLine2: "",
          city: customer.city,
          state: customer.state,
          pincode: customer.pincode,
          country: customer.country,
        },
        paymentMethod: "cod",
      };
      const resp = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
        },
        body: JSON.stringify(orderData),
      });
      const result = await resp.json();
      if (resp.ok && result.success) {
        toast.success("Order placed successfully!");
        onOpenChange(false);
        navigate("/orders");
      } else {
        throw new Error(result.error || "Failed to place order");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      await openRazorpay({
        amount: product.price * quantity * 100,
        name: "Dwarkadish Saree Store",
        description: `Buy: ${product.name}`,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        notes: {
          address: `${customer.address}, ${customer.city}, ${customer.state}, ${customer.pincode}`,
          product: product.name,
        },
        onSuccess: async (response: any) => {
          // Place order after payment
          try {
            const orderData = {
              items: [{
                productId: product.id,
                quantity,
                color: product.color,
              }],
              shippingAddress: {
                fullName: customer.name,
                phone: customer.phone,
                email: customer.email,
                addressLine1: customer.address,
                addressLine2: "",
                city: customer.city,
                state: customer.state,
                pincode: customer.pincode,
                country: customer.country,
              },
              paymentMethod: "razorpay",
              paymentInfo: { razorpay: response },
            };
            const resp = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/orders`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
              },
              body: JSON.stringify(orderData),
            });
            const result = await resp.json();
            if (resp.ok && result.success) {
              toast.success("Order placed successfully!");
              onOpenChange(false);
              navigate("/orders");
            } else {
              throw new Error(result.error || "Failed to place order");
            }
          } catch (error: any) {
            toast.error(error.message || "Failed to place order");
          }
        },
        onFailure: () => {
          toast.error("Payment failed or cancelled");
          setSubmitting(false);
        }
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to start payment");
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={COMPACT_MODAL_CLASS}>
        <DialogHeader>
          <DialogTitle className="text-base mb-1">Buy Now: <span className="font-semibold">{product.name}</span></DialogTitle>
          <DialogDescription className="mb-1 text-xs">
            Enter your details to place order
          </DialogDescription>
        </DialogHeader>
        {/* Mini Image/Info */}
        <div className="flex items-center gap-3 mb-2">
          {product.images?.[0]?.url && (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="h-10 w-10 object-cover rounded"
            />
          )}
          <div>
            <div className="font-semibold text-sm">{product.name}</div>
            <div className="text-xs">Price: ₹{product.price.toLocaleString()}</div>
            {product.color && <div className="text-xs">Color: {product.color}</div>}
          </div>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-2 mb-1">
          <Label className="min-w-0 flex-1 text-xs">Qty</Label>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
            className="h-7 w-20 px-2 py-1 text-xs"
          />
          <div className="flex-1 text-right text-xs font-bold">
            Total: ₹{(product.price * quantity).toLocaleString()}
          </div>
        </div>
        <hr className="my-1" />

        {/* Address Form, 2 cols for compactness */}
        <form onSubmit={paymentMethod === "cod" ? handleCODSubmit : e => { e.preventDefault(); handleRazorpayPayment(); }}>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <Label className="text-xs">Name*</Label>
              <Input
                value={customer.name}
                required
                onChange={e => handleChange("name", e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Phone*</Label>
              <Input
                value={customer.phone}
                required
                onChange={e => handleChange("phone", e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Email*</Label>
              <Input
                type="email"
                value={customer.email}
                required
                onChange={e => handleChange("email", e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Address*</Label>
              <Input
                value={customer.address}
                required
                onChange={e => handleChange("address", e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">City*</Label>
              <Input
                value={customer.city}
                required
                onChange={e => handleChange("city", e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">State*</Label>
              <select
                value={customer.state}
                required
                onChange={e => handleChange("state", e.target.value)}
                className="h-7 w-full border rounded text-xs bg-white dark:bg-gray-950"
              >
                <option value="">Select State</option>
                {STATES.map(s => (
                  <option value={s} key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-xs">Pincode*</Label>
              <Input
                value={customer.pincode}
                required
                onChange={e => handleChange("pincode", e.target.value)}
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Country</Label>
              <Input
                value={customer.country}
                readOnly
                className="h-7 text-xs bg-gray-100"
              />
            </div>
          </div>
          {/* Payment method: Stylized Toggle */}
          <div className="flex items-center gap-2 mb-3">
            <Button
              type="button"
              onClick={() => setPaymentMethod("cod")}
              className={`flex-1 rounded-full h-7 p-0 text-xs ${paymentMethod === "cod" ? "bg-crimson-600 text-white" : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"}`}
            >
              Cash On Delivery
            </Button>
            <Button
              type="button"
              onClick={() => setPaymentMethod("razorpay")}
              className={`flex-1 rounded-full h-7 p-0 text-xs ${paymentMethod === "razorpay" ? "bg-green-600 text-white" : "bg-gray-200 text-black dark:bg-gray-800 dark:text-white"}`}
            >
              Pay Online
            </Button>
          </div>
          {/* Payment Button */}
          {paymentMethod === "razorpay" ? (
            <Button
              type="button"
              className="w-full h-8 text-xs bg-green-600 hover:bg-green-700"
              disabled={submitting}
              onClick={handleRazorpayPayment}
            >
              {submitting ? "Processing..." : `Pay ₹${(product.price * quantity).toLocaleString()} & Place Order`}
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full h-8 text-xs"
              disabled={submitting}
            >
              {submitting ? "Placing Order..." : `Place Order (COD) - ₹${(product.price * quantity).toLocaleString()}`}
            </Button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BuyNowModal;
