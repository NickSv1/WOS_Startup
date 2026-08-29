import twilio from "twilio";

/**
 * Sends the nudge SMS. Trial Twilio numbers only send to VERIFIED numbers, so
 * the demo recipient (DEMO_PHONE) must be verified first. Returns a result the
 * UI can show either way — the on-screen text is the fallback if signal fails.
 */
export interface SmsResult {
  sent: boolean;
  to?: string;
  sid?: string;
  reason?: string;
}

export async function sendNudgeSms(body: string): Promise<SmsResult> {
  const sid = process.env.TWILIO_SID;
  const token = process.env.TWILIO_TOKEN;
  const from = process.env.TWILIO_FROM;
  const to = process.env.DEMO_PHONE;

  if (!sid || !token || !from || !to || sid.startsWith("ACxxxx")) {
    return { sent: false, reason: "Twilio not configured — showing on-screen only." };
  }

  try {
    const client = twilio(sid, token);
    const msg = await client.messages.create({ to, from, body });
    return { sent: true, to, sid: msg.sid };
  } catch (err) {
    const reason = err instanceof Error ? err.message : "Twilio send failed.";
    return { sent: false, to, reason };
  }
}
