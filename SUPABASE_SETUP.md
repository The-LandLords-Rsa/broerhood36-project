# Owner login, orders, and paid-order notifications

Do not send passwords, PayFast passphrases, Meta tokens, or Supabase service-role keys in chat or put them in the Vite app.

## Configure the storefront's Supabase connection

The frontend reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` at build time. Set both in Vercel under **Project → Settings → Environment Variables**, using the Project URL and anon/publishable key from the correct active Supabase project, then redeploy. Never use a `service_role` key in either variable. The app currently retains its existing values as local fallbacks; if those point to an unavailable project, login and signup will fail to fetch.

## 1. Set up the single admin account

1. In Supabase **Authentication → Users**, create or keep the owner account `broer.hood.36@gmail.com` and confirm the address.
2. Set a new password in Supabase. The password was shared in chat and should be changed before using the site.
3. The login form uses Supabase Auth. A valid login for this exact email opens the admin dashboard. Public signup cannot create this admin account.
4. In Supabase **SQL Editor**, run [`supabase/owner-security.sql`](./supabase/owner-security.sql). Database policies also enforce this one admin identity; the frontend check is not the security boundary.

## 2. Paid-order notification functions

The storefront currently does **not** initiate a PayFast payment or receive PayFast's verified payment callback. The return URL and customer clicking a button are not payment proof. COD and manual EFT have been removed; online payment methods remain disabled until the live catalog is loaded into Supabase and the server-side payment flow is configured. Checkout does not create an order until a verified online payment flow is available. Do not manually change orders to paid to simulate a PayFast payment.

For the verified workflow, the PayFast ITN handler must validate PayFast's server notification, compare its amount with the server-calculated order total, and only then change an order to `payment_confirmed`. That status change is the only event that should trigger the owner alerts.

### Configure automatic WhatsApp

Automatic WhatsApp delivery requires a Meta WhatsApp Business Cloud API number and an approved template. In Meta WhatsApp Manager, create an approved utility template named `order_paid_notification`, language `en`, with three body text variables in this order: order ID, customer name, and paid total.

In Supabase **Project Settings → Edge Functions → Secrets**, add:

- `ORDER_WEBHOOK_SECRET`: a long random secret used by the database webhook header.
- `META_WHATSAPP_TOKEN`: the server-side Meta access token.
- `META_PHONE_NUMBER_ID`: the Meta Business sender phone-number ID (not either owner's recipient number).
- `META_GRAPH_API_VERSION`: the current supported numeric Graph API version (for example, `vNN.N`; replace the placeholder with a version supported by Meta).
- `WHATSAPP_PAID_ORDER_TEMPLATE`: `order_paid_notification` or the approved template name.
- `WHATSAPP_TEMPLATE_LANGUAGE`: `en` or the template's approved language code.
- `OWNER_WHATSAPP_NUMBERS`: both owner recipient numbers in international digits-only format, separated by a comma.

Deploy from the project folder:

```powershell
npx supabase login
npx supabase link --project-ref YOUR_SUPABASE_PROJECT_REF
npx supabase functions deploy order-paid-whatsapp
```

In Supabase **Database → Webhooks**, create an `UPDATE` webhook for `public.orders` pointing to:

`https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/order-paid-whatsapp`

Set request headers `Content-Type: application/json` and `x-order-webhook-secret: THE_SECRET_YOU_SAVED`. The function ignores updates unless the order changes to `payment_confirmed`, so the webhook must include both `record` and `old_record`.

The function currently expects an approved template and valid Meta credentials. Test it with a verified payment only after the PayFast callback is deployed. Until the Meta setup is done, WhatsApp alerts are not sent.

### Optional paid-order email

The Resend function now also sends only when an order first changes to `payment_confirmed`. Configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `OWNER_NOTIFICATION_EMAILS`, deploy `order-email`, and create a separate `UPDATE` webhook using the same event/secret pattern if paid-order email alerts are wanted.

## 3. Known admin/catalog limitation

The admin can view orders and update fulfillment details. Product data used by the public storefront still comes from the static source catalog; database-only product changes do not yet update every storefront page. The catalog must be migrated to a database-backed source before the admin can safely set the authoritative PayFast amount or make live price changes.
