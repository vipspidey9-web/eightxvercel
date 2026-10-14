
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { eventId } = req.body || {};

  if (
    typeof eventId !== "string" ||
    !/^[a-zA-Z0-9_-]{1,100}$/.test(eventId)
  ) {
    return res.status(400).json({ error: "Invalid event ID" });
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
          text: "A new configuration event was received."
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
