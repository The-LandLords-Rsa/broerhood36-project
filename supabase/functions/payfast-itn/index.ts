import { createClient } from 'npm:@supabase/supabase-js@2';
import { constantTimeEqual, createPayFastSignature } from '../_shared/payfast.ts';

const requiredEnv = (name: string): string => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`PayFast server configuration is missing ${name}.`);
  return value;
};

const textResponse = (body: string, status = 200) =>
  new Response(body, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return textResponse('Method not allowed', 405);

  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/x-www-form-urlencoded')) {
      return textResponse('Unsupported content type', 415);
    }
    const rawBody = await request.text();
    if (rawBody.length > 32768) return textResponse('Notification too large', 413);

    const form = new URLSearchParams(rawBody);
    const parameters: Record<string, string> = {};
    for (const [key, value] of form.entries()) {
      if (Object.hasOwn(parameters, key)) return textResponse('Duplicate notification field', 400);
      parameters[key] = value;
    }
    const receivedSignature = parameters.signature || '';
    const expectedSignature = createPayFastSignature(
      parameters,
      Deno.env.get('PAYFAST_PASSPHRASE')?.trim()
    );
    if (!receivedSignature || !constantTimeEqual(receivedSignature.toLowerCase(), expectedSignature)) {
      return textResponse('Invalid signature', 400);
    }

    const supabaseUrl = requiredEnv('SUPABASE_URL');
    const serviceRoleKey = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const merchantId = requiredEnv('PAYFAST_MERCHANT_ID');
    if (parameters.merchant_id !== merchantId) return textResponse('Merchant mismatch', 400);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parameters.m_payment_id || '')) {
      return textResponse('Invalid order reference', 400);
    }

    const validationUrl = 'https://sandbox.payfast.co.za/eng/query/validate';
    const validationResponse = await fetch(validationUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });
    if (!validationResponse.ok || (await validationResponse.text()).trim() !== 'VALID') {
      return textResponse('PayFast did not validate this notification', 400);
    }
    if (parameters.payment_status !== 'COMPLETE') return textResponse('Payment is not complete', 200);

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: order, error: orderError } = await serviceClient
      .from('orders')
      .select('id, total, status, payfast_payment_id')
      .eq('id', parameters.m_payment_id)
      .maybeSingle();
    if (orderError) {
      console.error('Unable to verify PayFast order:', orderError.message);
      return textResponse('Order verification failed', 500);
    }
    if (!order) return textResponse('Order not found', 404);
    if (!parameters.pf_payment_id || parameters.pf_payment_id.length > 100) {
      return textResponse('Missing or invalid PayFast transaction reference', 400);
    }

    const expectedAmount = Number(order.total);
    const grossAmount = parameters.amount_gross || '';
    const paidAmount = Number(grossAmount);
    if (
      !/^\d+(?:\.\d{1,2})?$/.test(grossAmount) ||
      !Number.isFinite(expectedAmount) ||
      !Number.isFinite(paidAmount) ||
      Math.round(paidAmount * 100) !== Math.round(expectedAmount * 100)
    ) {
      return textResponse('Payment amount mismatch', 400);
    }
    if (order.status === 'payment_confirmed') {
      return order.payfast_payment_id === parameters.pf_payment_id
        ? textResponse('Payment already recorded', 200)
        : textResponse('Order was paid by a different PayFast transaction', 409);
    }
    if (order.status !== 'pending') return textResponse('Order is not awaiting payment', 409);

    const { data: updatedOrder, error: updateError } = await serviceClient
      .from('orders')
      .update({
        status: 'payment_confirmed',
        payfast_payment_id: parameters.pf_payment_id || null
      })
      .eq('id', order.id)
      .eq('status', 'pending')
      .select('id')
      .maybeSingle();
    if (updateError) {
      console.error('Unable to confirm PayFast payment:', updateError.message);
      return textResponse('Payment status update failed', 500);
    }
    if (!updatedOrder) return textResponse('Order was already processed or changed', 200);

    return textResponse('Payment confirmed');
  } catch (error) {
    console.error('PayFast ITN processing failed:', error);
    return textResponse('PayFast notification processing failed', 500);
  }
});
