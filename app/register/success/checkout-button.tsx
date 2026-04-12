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
        error?: string;
        url?: string;
      };

      if (!response.ok || !payload.url) {
        setErrorMessage(
          payload.error ?? "We couldn't start checkout right now. Please try again.",
        );
        return;
      }

      window.location.assign(payload.url);
    } catch {
      setErrorMessage("We couldn't start checkout right now. Please try again.");
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
        <p className="register-success-section__note" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </>
  );
}
