/* Datos públicos de Discord. No utiliza un bot ni guarda credenciales. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ArenaDiscord = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const isCount = value => Number.isSafeInteger(value) && value >= 0;
  function fromInvite(data, guildId) {
    if (data?.guild?.id !== guildId) throw new Error("Unexpected Discord server");
    const total = data.approximate_member_count;
    const online = data.approximate_presence_count;
    if (!isCount(total) || !isCount(online) || online > total) throw new Error("Invalid Discord counts");
    return { total, online, offline: total - online, approximate: true, source: "invite", name: String(data.guild.name || "Discord") };
  }
  function fromWidget(data, guildId) {
    if (data?.id !== guildId || !isCount(data.presence_count)) throw new Error("Invalid Discord widget");
    // La lista de miembros del widget está limitada; NO representa el total.
    return { total: null, online: data.presence_count, offline: null, approximate: false, source: "widget", name: String(data.name || "Discord") };
  }
  async function request(url, fetchImpl) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 7000);
    try {
      const response = await fetchImpl(url, { signal: controller.signal, credentials: "omit", cache: "no-store", mode: "cors", referrerPolicy: "no-referrer" });
      if (!response.ok) {
        const error = new Error(`Discord HTTP ${response.status}`);
        if (response.status === 429) {
          const retry = response.headers?.get("Retry-After");
          const seconds = Number(retry);
          error.retryAfterMs = retry && Number.isFinite(seconds) && seconds >= 0
            ? Math.max(120000, seconds * 1000) : Math.max(120000, Date.parse(retry) - Date.now() || 0);
        }
        throw error;
      }
      return await response.json();
    } finally { clearTimeout(timer); }
  }
  async function fetchStats({ guildId, inviteCode }, fetchImpl = globalThis.fetch) {
    if (typeof guildId !== "string" || !/^\d{17,20}$/.test(guildId)) throw new Error("Invalid Discord server ID");
    if (typeof inviteCode === "string" && /^[A-Za-z0-9_-]{2,100}$/.test(inviteCode)) {
      try {
        return fromInvite(await request(`https://discord.com/api/v10/invites/${encodeURIComponent(inviteCode)}?with_counts=true`, fetchImpl), guildId);
      } catch (error) {
        if (error.retryAfterMs) throw error;
      }
    }
    return fromWidget(await request(`https://discord.com/api/guilds/${guildId}/widget.json`, fetchImpl), guildId);
  }
  return { fromInvite, fromWidget, fetchStats };
});
