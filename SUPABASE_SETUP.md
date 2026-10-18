# Owner login, orders, and paid-order notifications

Do not send passwords, PayFast passphrases, Meta tokens, or Supabase service-role keys in chat or put them in the Vite app.

## Configure the storefront's Supabase connection

The frontend reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` at build time. Set both in Vercel under **Project → Settings → Environment Variables**, using the Project URL and anon/publishable key from the correct active Supabase project, then redeploy. Never use a `service_role` key in either variable. The app currently retains its existing values as local fallbacks; if those point to an unavailable project, login and signup will fail to fetch.

In Supabase **Authentication → URL Configuration**, set the Site URL to a deployed storefront URL and add both `https://broer-hood-36-org.vercel.app` and `https://broer.hood.36.org` to the allowed redirect URLs (plus `http://localhost:3000` only if you need local testing). Signup confirmation links return to the current browser origin; local signup therefore requires localhost in the allowlist. The client enables PKCE, session persistence in local storage, and confirmation callback detection. Confirmation links are single-use and normally expire after one hour; expired or reused links show a friendly in-app message. If a fresh link still opens an error page, verify these Supabase URL settings and that the email template uses Supabase's confirmation URL rather than a hardcoded localhost URL; application code cannot override a dashboard URL allowlist or a hardcoded email-template destination. A login error saying “Invalid email or password” means the account/password was not accepted by the configured project; verify the account exists there, confirm its email, and check that the deployed environment variables point to that same project. Do not send passwords or private keys when requesting help.

## 1. Set up the single admin account

1. In Supabase **Authentication → Users**, create or keep the owner account `broer.hood.36@gmail.com` and confirm the address.
2. Set a new password in Supabase. The password was shared in chat and should be changed before using the site.
3. The login form uses Supabase Auth. A valid login for this exact email opens the admin dashboard. Public signup cannot create this admin account.
4. In Supabase **SQL Editor**, run [`supabase/owner-security.sql`](./supabase/owner-security.sql). Database policies also enforce this one admin identity; the frontend check is not the security boundary.

## 2. PayFast sandbox checkout

The checkout implementation is sandbox-only. The browser never receives the PayFast passphrase or determines the payable total: `payfast-create-payment` requires a signed-in customer, reads prices from the server-side `store_catalog`, creates a `pending` order, and returns a signed PayFast form. `payfast-itn` checks the signature, asks PayFast to validate the notification, checks merchant/order/amount/status, and only then marks the order `payment_confirmed`. A browser return to the shop is not proof of payment.

To set up sandbox payments:

1. Run [`supabase/owner-security.sql`](./supabase/owner-security.sql) once if it has not already been applied. Apply the payment catalog/order migration with `npx supabase db push` after linking the correct Supabase project.
2. In **Supabase → Project Settings → Edge Functions → Secrets**, set these names using your **PayFast sandbox** account credentials (not your live credentials):
   - `PAYFAST_MERCHANT_ID`
   - `PAYFAST_MERCHANT_KEY`
   - `PAYFAST_PASSPHRASE` (set the sandbox Salt Passphrase if configured in the sandbox account)
   - `APP_URL` (for example, `https://your-storefront.example`; `http://localhost:3000` is allowed for local sandbox testing)

   Do not put these values in Vite environment variables, source files, or chat. Supabase supplies the function's Supabase URL and service-role key at runtime; never expose or copy the service-role key to the browser.
3. Deploy all three functions:

   ```powershell
   npx supabase functions deploy sync-storefront-catalog
   npx supabase functions deploy payfast-create-payment
   npx supabase functions deploy payfast-itn
   ```

4. Sign in as the approved store owner, open **Admin → Supabase & PayFast Configuration**, and choose **Sync payment catalog**. This copies current storefront SKU/name/category/price/availability to the server-owned payment catalog. Repeat after changing storefront prices or availability. Checkout refuses products missing from the verified catalog or marked unavailable.
5. Sign in with a confirmed customer account, test checkout, and complete a PayFast sandbox wallet payment. Check the order becomes `payment_confirmed` only after the PayFast ITN is verified.

If checkout says the secure catalog is not ready, apply the SQL migration and sync the catalog. If the sync/API returns an authorization error, verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` belong to the same active project and the owner policies are installed. Adding merchant secrets alone does not deploy or activate Edge Functions.

This implementation posts only to `https://sandbox.payfast.co.za/eng/process` and validates against the sandbox endpoint. It cannot take live payments. Do not switch to live endpoints or credentials until the sandbox flow and order/notification handling have been reviewed and tested.

## 3. Paid-order notification functions

The PayFast ITN handler compares PayFast's validated server notification with the server-calculated order total before changing the order to `payment_confirmed`. That status change is the only event that should trigger owner alerts.

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

The public storefront still reads products from the static source catalog. Database-only product changes do not automatically appear in the storefront or the PayFast catalog. After changing a static product's price or availability, redeploy the storefront and run **Sync payment catalog** again; admin-only products are not available for PayFast checkout.
