const requiredEnv = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const templateValue = (value: unknown): string =>
  String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, 500);

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    if (request.headers.get('x-order-webhook-secret') !== requiredEnv('ORDER_WEBHOOK_SECRET')) {
      return new Response('Unauthorized', { status: 401 });
    }

    const payload = await request.json();
    const order = payload?.record;
    const previousOrder = payload?.old_record;
    if (!order || typeof order.id !== 'string') {
      return new Response('Invalid order webhook payload', { status: 400 });
    }
    if (order.status !== 'payment_confirmed' || previousOrder?.status === 'payment_confirmed') {
      return new Response('No newly confirmed payment to notify.', { status: 200 });
    }

    const total = Number(order.total);
    if (!Number.isFinite(total) || total <= 0) {
      return new Response('Invalid order total', { status: 400 });
    }

    const recipients = requiredEnv('OWNER_WHATSAPP_NUMBERS')
      .split(',')
      .map((number) => number.replace(/\D/g, ''))
      .filter(Boolean);
    if (recipients.length !== 2) {
      throw new Error('OWNER_WHATSAPP_NUMBERS must contain exactly two international numbers.');
    }

    const version = requiredEnv('META_GRAPH_API_VERSION');
    if (!/^v\d+\.\d+$/.test(version)) {
      throw new Error('META_GRAPH_API_VERSION must look like vXX.X.');
    }
    const endpoint = `https://graph.facebook.com/${version}/${requiredEnv('META_PHONE_NUMBER_ID')}/messages`;
    const orderId = templateValue(order.id);
    const customer = templateValue(order.customer_name || 'Customer');
    const amount = `R ${total.toFixed(2)}`;
    const token = requiredEnv('META_WHATSAPP_TOKEN');
    const templateName = requiredEnv('WHATSAPP_PAID_ORDER_TEMPLATE');
    const language = Deno.env.get('WHATSAPP_TEMPLATE_LANGUAGE') || 'en';

    const responses = await Promise.all(recipients.map(async (recipient) => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipient,
          type: 'template',
          template: {
            name: templateName,
            language: { code: language },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: orderId },
                  { type: 'text', text: customer },
                  { type: 'text', text: amount }
                ]
              }
            ]
          }
        })
      });

      if (!response.ok) {
        const details = await response.text();
        console.error(`WhatsApp provider rejected the notification for ${recipient}:`, response.status, details);
        return false;
      }
      return true;
    }));

    if (responses.some((sent) => !sent)) {
      return new Response('WhatsApp did not accept every owner notification.', { status: 502 });
    }
    return new Response('Paid-order WhatsApp notifications sent.', { status: 200 });
  } catch (error) {
    console.error('Paid-order WhatsApp notification failed:', error);
    return new Response('Paid-order WhatsApp notification failed.', { status: 500 });
  }
});
