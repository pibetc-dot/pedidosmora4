/* Cloud layer for Mora. Loaded by app.js; gracefully falls back to local mode. */
window.MoraCloud = (() => {
  const cfg = window.MORA_SUPABASE || {};
  const enabled = Boolean(cfg.url && cfg.anonKey && window.supabase);
  const client = enabled ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;

  async function getSettings() {
    if (!client) return null;
    const { data, error } = await client.from('mora_settings').select('data').eq('id', 1).maybeSingle();
    if (error) throw error;
    return data?.data && Object.keys(data.data).length ? data.data : null;
  }
  async function saveSettings(settings) {
    if (!client) return false;
    const { error } = await client.from('mora_settings').upsert({ id: 1, data: settings, updated_at: new Date().toISOString() });
    if (error) throw error;
    return true;
  }
  async function createOrder(order) {
    if (!client) return false;
    const { error } = await client.from('mora_orders').insert({
      order_number: order.id,
      total: order.total,
      customer: order.customer || {},
      items: order.products || [],
      message: order.message || '',
      metadata: order.metadata || {}
    });
    if (error) throw error;
    return true;
  }
  async function listOrders() {
    if (!client) return null;
    const { data, error } = await client.from('mora_orders').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }
  async function updateOrderStatus(id, status) {
    if (!client) return false;
    const { error } = await client.from('mora_orders').update({ status }).eq('id', id);
    if (error) throw error;
    return true;
  }
  async function signIn(email, password) {
    if (!client) throw new Error('Cloud no configurado.');
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session;
  }
  async function signOut() { if (client) await client.auth.signOut(); }
  async function session() { if (!client) return null; const { data } = await client.auth.getSession(); return data.session; }
  function isEnabled() { return enabled; }
  return { isEnabled, getSettings, saveSettings, createOrder, listOrders, updateOrderStatus, signIn, signOut, session };
})();
