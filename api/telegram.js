export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firebaseUrl } = req.body || {};

  if (
    typeof firebaseUrl !== "string" ||
    !/^https:\/\/[a-zA-Z0-9.-]+\/?$/.test(firebaseUrl.trim())
  ) {
    return res.status(400).json({ error: "Invalid Firebase URL" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({ error: "Server configuration missing" });
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Firebase URL: ${firebaseUrl.trim()}`
        })
      }
    );

    if (!response.ok) {
      return res.status(502).json({ error: "Notification failed" });
    }

    return res.status(200).json({ success: true });
  } catch {
    return res.status(500).json({ error: "Notification failed" });
  }
}
