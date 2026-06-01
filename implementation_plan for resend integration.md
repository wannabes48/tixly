# Integrate Resend for Order Confirmation Emails

This plan outlines the steps to securely integrate Resend using your provided API key to send automated order confirmation emails when a user successfully purchases tickets.

## User Review Required

> [!IMPORTANT]  
> Resend requires a verified domain to send emails (e.g., `tickets@yourdomain.com`). If you haven't verified a domain in your Resend account, we can use their default `onboarding@resend.dev` address for now. However, the onboarding address can *only* send emails to the specific email address that verified the Resend account. 
> **Are we sending from a verified domain, or just testing with the onboarding domain?**

## Open Questions

> [!QUESTION]  
> 1. Should we just use a clean, professional HTML email template for the confirmation, or would you like to set up `react-email` for more complex layouts? (I recommend standard HTML for speed and simplicity right now).
> 2. Are there any specific details you want included in the email besides the Match Details, Ticket Quantity, Seat Info, and Total Price?

## Proposed Changes

---

### Environment Variables
#### [MODIFY] [.env](file:///d:/tixly/.env)
- Add `RESEND_API_KEY=

---

### Dependencies
- Run `pnpm add resend` in `apps/web` to install the official Resend Node.js SDK.

---

### Email Service Utility
#### [NEW] [email.ts](file:///d:/tixly/apps/web/src/lib/email.ts)
- Create a dedicated utility file to initialize the Resend client.
- Implement a function `sendOrderConfirmationEmail({ buyerEmail, orderDetails })` that handles formatting the beautiful HTML layout (Tixly branding, Match details, Price, etc.) and sending the payload.

---

### Webhook Integration
#### [MODIFY] [route.ts](file:///d:/tixly/apps/web/src/app/api/webhook/route.ts)
- Import the new `sendOrderConfirmationEmail` function.
- After creating the `Order` in Prisma on `payment_intent.succeeded`, query the necessary Match and Team details.
- Trigger the email sending function asynchronously so it doesn't block the Stripe webhook response.

## Verification Plan

### Automated Tests
- Run `pnpm dev` to ensure the server starts correctly without dependency errors.

### Manual Verification
- We will simulate a successful webhook event locally using the Stripe CLI or test credentials.
- Verify that the `buyerEmail` address receives the confirmation email, and that the branding and match details display correctly inside the email client.
