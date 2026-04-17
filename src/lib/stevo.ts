const STEVO_API_URL = process.env.STEVO_API_URL!;
const STEVO_API_KEY = process.env.STEVO_API_KEY!;

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

export async function getInstanceStatus() {
  return stevoFetch("/instance/status");
}

export async function getInstanceProfile() {
  return stevoFetch("/instance/profile");
}

export async function connectInstance(webhookUrl?: string) {
  return stevoFetch("/instance/connect", {
    method: "POST",
    body: JSON.stringify({
      webhookUrl: webhookUrl || "",
      subscribe: webhookUrl ? ["MESSAGE"] : [],
    }),
  });
}

export async function getQrCode() {
  return stevoFetch("/instance/qr");
}

export async function sendText(number: string, text: string) {
  return stevoFetch("/send/text", {
    method: "POST",
    body: JSON.stringify({ number, text }),
  });
}
