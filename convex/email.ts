"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * Confirmation email after a successful pledge.
 *
 * To enable:
 *   1. Sign up at https://resend.com and get an API key.
 *   2. In Convex dashboard → Settings → Environment Variables, add:
 *        RESEND_API_KEY = re_xxxxxxxxxxxx
 *        RESEND_FROM    = "Spirit of Haiti Air <hello@spiritofhaitiair.com>"
 *   3. Verify the sender domain in Resend.
 *
 * If RESEND_API_KEY is unset the action no-ops silently — safe for local dev.
 *
 * Wire-up (in pledges.ts after a successful insert/update):
 *   await ctx.scheduler.runAfter(0, api.email.sendConfirmation, {
 *     to: email, name, city, country, amount: newAmount, shareUrl
 *   });
 */
export const sendConfirmation = action({
  args: {
    to: v.string(),
    name: v.string(),
    city: v.string(),
    country: v.string(),
    amount: v.number(),
    shareUrl: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    if (!apiKey || !from) {
      console.log(
        "[email] RESEND_API_KEY/RESEND_FROM not set — skipping confirmation",
      );
      return { sent: false, reason: "not-configured" };
    }
    const subject = `Spirit of Haiti Air · Boarding pass confirmed (${args.name})`;
    const html = `
      <div style="font-family:system-ui,sans-serif;background:#05071a;color:#f4ecd8;padding:32px;border-radius:16px">
        <div style="font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:#a39d8e">Spirit of Haiti Air · Boarding pass</div>
        <h1 style="font-family:Georgia,serif;font-size:32px;margin:8px 0 0;letter-spacing:-1px">Mèsi anpil, ${escapeHtml(args.name)}.</h1>
        <p style="color:#a39d8e;margin-top:8px">You're on the list. We'll reach out with secure payment instructions when the raise opens.</p>
        <div style="margin-top:24px;padding:16px;border:1px dashed rgba(244,236,216,.16);border-radius:12px">
          <div style="display:flex;justify-content:space-between;font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:#67625a">
            <span>${escapeHtml(args.city)}, ${escapeHtml(args.country)}</span>
            <span>→ Ayiti · Freedom</span>
          </div>
          <div style="margin-top:8px;font-family:Georgia,serif;font-size:28px;color:#d9b367">$${args.amount.toLocaleString("en-US")}</div>
        </div>
        <p style="margin-top:24px">Share your boarding pass and recruit fellow passengers:</p>
        <p style="margin-top:8px"><a href="${args.shareUrl}" style="color:#d9b367">${escapeHtml(args.shareUrl)}</a></p>
      </div>
    `;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: args.to,
        subject,
        html,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("[email] Resend send failed", res.status, text);
      return { sent: false, reason: "api-error" };
    }
    return { sent: true };
  },
});

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
