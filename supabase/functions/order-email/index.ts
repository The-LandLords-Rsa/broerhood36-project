const requiredEnv = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return entities[character];
  });

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const secret = requiredEnv('ORDER_WEBHOOK_SECRET');
    if (request.headers.get('x-order-webhook-secret') !== secret) {
      return new Response('Unauthorized', { status: 401 });
    }

    const payload = await request.json();
    const order = payload?.record;
    const previousOrder = payload?.old_record;
    if (order?.status !== 'payment_confirmed' || previousOrder?.status === 'payment_confirmed') {
      return new Response('No newly confirmed payment to notify.', { status: 200 });
    }
    if (!order || typeof order.id !== 'string' || !Array.isArray(order.order_details)) {
      return new Response('Invalid order webhook payload', { status: 400 });
    }

    const recipients = requiredEnv('OWNER_NOTIFICATION_EMAILS')
      .split(',')
      .map((address) => address.trim())
      .filter(Boolean);
    if (recipients.length === 0) {
      throw new Error('OWNER_NOTIFICATION_EMAILS must contain at least one email address.');
    }

    const items = order.order_details
      .map((item: Record<string, unknown>) => {
        const product = item.product as Record<string, unknown> | undefined;
        const name = String(product?.name ?? item.name ?? item.product ?? 'Order item');
        return `<li>${escapeHtml(String(item.quantity ?? 1))} × ${escapeHtml(name)}</li>`;
      })
      .join('');

    const orderId = escapeHtml(order.id);
    const customerName = escapeHtml(String(order.customer_name ?? 'Customer'));
    const customerEmail = escapeHtml(String(order.customer_email ?? 'Not provided'));
    const customerPhone = escapeHtml(String(order.customer_whatsapp ?? 'Not provided'));
    const address = escapeHtml(String(order.customer_address ?? 'Not provided'));
    const total = Number(order.total);
    if (!Number.isFinite(total) || total < 0) {
      return new Response('Invalid order total', { status: 400 });
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${requiredEnv('RESEND_API_KEY')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: requiredEnv('RESEND_FROM_EMAIL'),
        to: recipients,
        subject: `Paid Broerhood36 ${order.is_rental ? 'rental' : 'order'}: ${orderId}`,
        html: `
          <h2>Payment verified for ${order.is_rental ? 'rental' : 'store order'}</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>WhatsApp:</strong> ${customerPhone}</p>
          <p><strong>Address / location:</strong> ${address}</p>
          <p><strong>Total:</strong> R ${total.toFixed(2)}</p>
          <ul>${items}</ul>
        `
      })
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('Resend rejected the order notification:', response.status, details);
      return new Response('Email provider rejected the notification.', { status: 502 });
    }

    return new Response('Order notification sent.', { status: 200 });
  } catch (error) {
    console.error('Order email notification failed:', error);
    return new Response('Order notification failed.', { status: 500 });
  }
});
