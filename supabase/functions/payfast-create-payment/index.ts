import { createClient } from 'npm:@supabase/supabase-js@2';
import { createPayFastSignature } from '../_shared/payfast.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });

const cleanText = (value: unknown, maximumLength: number): string =>
  typeof value === 'string' ? value.trim().slice(0, maximumLength) : '';

const validEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validSouthAfricanPhone = (value: string): boolean => {
  const normalized = value.replace(/[\s()-]/g, '').replace(/^\+27/, '0');
  return /^0[1-9]\d{8}$/.test(normalized);
};

const requiredEnv = (name: string): string => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`PayFast server configuration is missing ${name}.`);
  return value;
};

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) return jsonResponse({ error: 'Sign in before placing an order.' }, 401);

    const supabaseUrl = requiredEnv('SUPABASE_URL');
    const anonKey = requiredEnv('SUPABASE_ANON_KEY');
    const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user?.id || !user.email) {
      return jsonResponse({ error: 'Your session could not be verified. Sign in again and retry.' }, 401);
    }

    const payload = await request.json();
    const customer = payload.customer;
    const address = payload.address;
    if (typeof customer !== 'object' || customer === null || typeof address !== 'object' || address === null) {
      return jsonResponse({ error: 'Customer and delivery details are required.' }, 400);
    }

    const fullName = cleanText(customer.fullName, 100);
    const email = cleanText(customer.email, 100).toLowerCase();
    const phone = cleanText(customer.phone, 30);
    const street = cleanText(address.street, 200);
    const city = cleanText(address.city, 100);
    const province = cleanText(address.province, 80);
    const postalCode = cleanText(address.postalCode, 4);
    const deliveryNotes = cleanText(address.deliveryNotes, 300);
    if (fullName.length < 2 || !validEmail(email) || email !== user.email.toLowerCase() || !validSouthAfricanPhone(phone)) {
      return jsonResponse({ error: 'Use your signed-in email and enter a valid name and South African phone number.' }, 400);
    }
    if (street.length < 5 || city.length < 2 || !/^\d{4}$/.test(postalCode)) {
      return jsonResponse({ error: 'Enter a street address, city, and valid 4-digit postal code.' }, 400);
    }
    if (![
      'Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State',
      'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'
    ].includes(province)) {
      return jsonResponse({ error: 'Select a valid South African province.' }, 400);
    }

    if (!Array.isArray(payload.items) || payload.items.length === 0 || payload.items.length > 50) {
      return jsonResponse({ error: 'Your cart must contain 1 to 50 products.' }, 400);
    }
    const items = payload.items.map((item: Record<string, unknown>) => ({
      sku: cleanText(item.sku, 80),
      quantity: Number(item.quantity),
      selected_size: cleanText(item.selected_size, 80),
      selected_color: cleanText(item.selected_color, 80),
      selected_storage: cleanText(item.selected_storage, 80)
    }));
    if (items.some((item: { sku: string; quantity: number }) =>
      !/^[a-zA-Z0-9_-]{1,80}$/.test(item.sku) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 20
    )) {
      return jsonResponse({ error: 'The cart contains an invalid product or quantity.' }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const skuList = [...new Set(items.map((item: { sku: string }) => item.sku))];
    const { data: catalog, error: catalogError } = await serviceClient
      .from('store_catalog')
      .select('sku, name, price, is_available')
      .in('sku', skuList);
    if (catalogError) {
      console.error('Unable to read trusted payment catalog:', catalogError.message);
      return jsonResponse({ error: 'Secure checkout is not ready. The store owner must sync the payment catalog.' }, 503);
    }
    const productsBySku = new Map((catalog || []).map((product: {
      sku: string; name: string; price: number | string; is_available: boolean;
    }) => [product.sku, product]));
    if (skuList.some((sku: string) => !productsBySku.has(sku))) {
      return jsonResponse({ error: 'A cart item is missing from the verified payment catalog. Ask the store owner to sync it.' }, 409);
    }

    const orderDetails = items.map((item: {
      sku: string; quantity: number; selected_size: string; selected_color: string; selected_storage: string;
    }) => {
      const product = productsBySku.get(item.sku)!;
      if (!product.is_available) throw new Error(`${product.name} is currently unavailable.`);
      return {
        sku: product.sku,
        product: product.name,
        quantity: item.quantity,
        unit_price: Number(product.price),
        selected_size: item.selected_size || null,
        selected_color: item.selected_color || null,
        selected_storage: item.selected_storage || null
      };
    });

    const subtotal = orderDetails.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
    const normalizedPromo = cleanText(payload.promoCode, 40).toUpperCase();
    const discountPercent = ['BROERHOOD10', 'MZANSI10'].includes(normalizedPromo)
      ? 10
      : ['BH36VIP', 'HOOD15'].includes(normalizedPromo)
        ? 15
        : 0;
    const discount = Math.round((subtotal * discountPercent) / 100);
    const deliveryFee = subtotal > 1500 ? 0 : 120;
    const total = Number((subtotal - discount + deliveryFee).toFixed(2));
    if (!Number.isFinite(total) || total < 5) {
      return jsonResponse({ error: 'PayFast sandbox requires an order total of at least R5.' }, 400);
    }

    const appUrl = new URL(requiredEnv('APP_URL'));
    if (appUrl.protocol !== 'https:' && appUrl.hostname !== 'localhost') {
      throw new Error('APP_URL must use HTTPS (localhost is allowed for sandbox testing).');
    }
    const merchantId = requiredEnv('PAYFAST_MERCHANT_ID');
    const merchantKey = requiredEnv('PAYFAST_MERCHANT_KEY');
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE')?.trim();

    const orderId = crypto.randomUUID();
    const deliveryAddress = [
      street,
      city,
      province,
      postalCode,
      deliveryNotes ? `Delivery notes: ${deliveryNotes}` : ''
    ].filter(Boolean).join(', ');
    const { error: orderError } = await serviceClient.from('orders').insert({
      id: orderId,
      user_id: user.id,
      customer_name: fullName,
      customer_whatsapp: phone,
      customer_email: email,
      customer_address: deliveryAddress,
      total,
      status: 'pending',
      order_details: orderDetails,
      is_rental: false
    });
    if (orderError) {
      console.error('Unable to create pending PayFast order:', orderError.message);
      return jsonResponse({ error: 'We could not save your order. No payment was started; please retry.' }, 503);
    }

    const returnUrl = new URL('/', appUrl);
    returnUrl.searchParams.set('payfast', 'returned');
    returnUrl.searchParams.set('order_id', orderId);
    returnUrl.hash = 'tracking';
    const cancelUrl = new URL('/', appUrl);
    cancelUrl.searchParams.set('payfast', 'cancelled');
    cancelUrl.searchParams.set('order_id', orderId);
    cancelUrl.hash = 'checkout';

    const functionUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/payfast-itn`;
    const parameters: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl.toString(),
      cancel_url: cancelUrl.toString(),
      notify_url: functionUrl,
      name_first: fullName.split(/\s+/)[0],
      name_last: fullName.split(/\s+/).slice(1).join(' ') || fullName,
      email_address: email,
      cell_number: phone,
      m_payment_id: orderId,
      amount: total.toFixed(2),
      item_name: `Broerhood36 order ${orderId}`,
      item_description: `Order with ${orderDetails.length} product line(s)`
    };
    parameters.signature = createPayFastSignature(parameters, passphrase);

    return jsonResponse({
      action: 'https://sandbox.payfast.co.za/eng/process',
      parameters,
      orderId,
      total
    });
  } catch (error) {
    console.error('PayFast sandbox checkout initialization failed:', error);
    return jsonResponse({
      error: error instanceof Error ? error.message : 'Secure checkout could not be started.'
    }, 500);
  }
});
