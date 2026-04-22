'use client';

import { useState } from "react";

type CheckoutButtonProps = {
  email: string;
};

export function CheckoutButton({ email }: CheckoutButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCheckout() {
    setIsPending(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as {
        url?: string;
      };

      if (!response.ok || !payload.url) {
        setErrorMessage("Checkout did not start. Try again when you are ready.");
        return;
      }

      window.location.assign(payload.url);
    } catch {
      setErrorMessage("Checkout did not start. Try again when you are ready.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <button
        className="register-success-actions__primary"
        disabled={isPending}
        onClick={handleCheckout}
        type="button"
      >
        {isPending ? "Redirecting to Payment..." : "Continue to Payment"}
      </button>
      {errorMessage ? (
        <div className="register-success-error" role="alert">
          <p className="register-success-error__title">Payment step paused</p>
          <p>{errorMessage}</p>
        </div>
      ) : null}
    </>
  );
}
