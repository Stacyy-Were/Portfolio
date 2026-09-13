export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { email, deviceType, latitude, longitude } = request.body || {};
  if (!email || !deviceType) {
    return response.status(400).json({ error: "Email and device type are required" });
  }

  const ipAddress = (request.headers["x-forwarded-for"] || request.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
  const supabaseUrl = globalThis.process.env.SUPABASE_URL;
  const serviceRoleKey = globalThis.process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return response.status(503).json({ error: "Device consent storage is not configured" });
  }

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/device_consents`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email: email.trim(),
      device_type: deviceType,
      ip_address: ipAddress,
      location_lat: typeof latitude === "number" ? latitude : null,
      location_lng: typeof longitude === "number" ? longitude : null,
    }),
  });

  if (!insertResponse.ok) {
    return response.status(502).json({ error: "Could not store device consent" });
  }

  return response.status(204).end();
}
