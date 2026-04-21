# Payment Flow — Settled on the Field

## Current Flow (4-1)

Landing → Summit → Register → Success → Stripe Checkout → Confirmation

System does NOT trust payment yet.

---

## Target Flow (4-2)

User submits registration
→ Stripe Checkout
→ Stripe webhook fires
→ System verifies event
→ Payment recorded
→ Registration marked paid
→ Confirmation becomes truthful

---

## Source of Truth

Stripe webhook (checkout.session.completed)

---

## Non-Truth Signals

- redirect success URL
- client-side state
- query params

---

## Risks

- duplicate webhook events
- missing signature verification
- race conditions between registration and payment

---

## Invariants

- Never trust client for payment
- Only trust verified Stripe events
- Payment must link to a registration