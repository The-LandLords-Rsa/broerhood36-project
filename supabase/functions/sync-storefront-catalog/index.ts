import { createClient } from 'npm:@supabase/supabase-js@2';

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

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return jsonResponse({ error: 'Method not allowed.' }, 405);

  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) return jsonResponse({ error: 'Sign in as the store owner first.' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error('Supabase function credentials are not configured.');
    }

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authorization } },
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || user?.email?.toLowerCase() !== 'broer.hood.36@gmail.com') {
      return jsonResponse({ error: 'Only the approved store owner can sync the payment catalog.' }, 403);
    }

    const payload = await request.json();
    if (!Array.isArray(payload.products) || payload.products.length === 0 || payload.products.length > 500) {
      return jsonResponse({ error: 'A catalog containing 1 to 500 products is required.' }, 400);
    }

    const catalog = payload.products.map((product: Record<string, unknown>) => {
      const price = Number(product.price);
      if (
        typeof product.sku !== 'string' ||
        !/^[a-zA-Z0-9_-]{1,80}$/.test(product.sku) ||
        typeof product.name !== 'string' ||
        !product.name.trim() ||
        typeof product.category !== 'string' ||
        !Number.isFinite(price) ||
        price <= 0 ||
        typeof product.is_available !== 'boolean'
      ) {
        throw new Error('The submitted catalog contains an invalid product.');
      }
      return {
        sku: product.sku,
        name: product.name.trim().slice(0, 200),
        category: product.category.slice(0, 80),
        price: price.toFixed(2),
        is_available: product.is_available,
        updated_at: new Date().toISOString()
      };
    });
    if (new Set(catalog.map((product: { sku: string }) => product.sku)).size !== catalog.length) {
      return jsonResponse({ error: 'The catalog contains duplicate product IDs.' }, 400);
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { error } = await serviceClient
      .from('store_catalog')
      .upsert(catalog, { onConflict: 'sku' });
    if (error) {
      console.error('Unable to sync the storefront payment catalog:', error.message);
      return jsonResponse({ error: 'Catalog sync failed. Apply the payment catalog SQL migration and retry.' }, 503);
    }

    return jsonResponse({ synced: catalog.length });
  } catch (error) {
    console.error('Storefront catalog sync failed:', error);
    return jsonResponse({
      error: error instanceof Error ? error.message : 'Catalog sync failed.'
    }, 500);
  }
});
