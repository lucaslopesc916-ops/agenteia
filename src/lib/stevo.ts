const STEVO_API_URL = process.env.STEVO_API_URL!;
const STEVO_API_KEY = process.env.STEVO_API_KEY!;
const STEVO_INSTANCE = process.env.STEVO_INSTANCE_NAME!;

async function stevoFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${STEVO_API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: STEVO_API_KEY,
      ...options?.headers,
    },
  });
  return res.json();
}

export async function getInstanceInfo() {
  return stevoFetch(`/instance/info/${STEVO_INSTANCE}`);
}

export async function connectInstance() {
  return stevoFetch("/instance/connect", {
    method: "POST",
    body: JSON.stringify({ instanceName: STEVO_INSTANCE }),
  });
}

export async function getQrCode() {
  return stevoFetch(`/instance/qr/${STEVO_INSTANCE}`);
}

export async function sendText(number: string, text: string) {
  return stevoFetch("/send/text", {
    method: "POST",
    body: JSON.stringify({ instanceName: STEVO_INSTANCE, number, text }),
  });
}

export async function updateWebhook(webhookUrl: string) {
  return stevoFetch(`/instance/${STEVO_INSTANCE}/advanced-settings`, {
    method: "PUT",
    body: JSON.stringify({
      webhookUrl,
      subscribe: ["MESSAGE"],
    }),
  });
}

export async function checkServer() {
  return stevoFetch("/server/ok");
}
