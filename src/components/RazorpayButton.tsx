
import React from "react";
import { Button } from "@/components/ui/button";
import { openRazorpay, RazorpayPaymentOptions } from "@/utils/razorpay";

interface RazorpayButtonProps extends Omit<RazorpayPaymentOptions, "onSuccess"> {
  buttonText?: string;
  onSuccess: (response: any) => void;
  onFailure?: (response: any) => void;
  disabled?: boolean;
}

const RazorpayButton: React.FC<RazorpayButtonProps> = ({
  buttonText = "Pay with Razorpay",
  disabled,
  ...props
}) => {
  const handleClick = () => {
    openRazorpay({
      ...props,
      onSuccess: props.onSuccess,
      onFailure: props.onFailure,
    });
  };

  return (
    <Button onClick={handleClick} disabled={disabled} className="w-full bg-green-600 hover:bg-green-700 text-white">
      {buttonText}
    </Button>
  );
};

export default RazorpayButton;

