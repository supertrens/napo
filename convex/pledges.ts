import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const MIN_PLEDGE = 50;
const MAX_PLEDGE = 25_000_000;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_MAX = 6; // max 6 attempts per email per minute

async function checkRateLimit(ctx: { db: any }, key: string) {
  const now = Date.now();
  const row = await ctx.db
    .query("rateLimits")
    .withIndex("by_key", (q: any) => q.eq("key", key))
    .unique();
  if (!row) {
    await ctx.db.insert("rateLimits", {
      key,
      windowStart: now,
      count: 1,
    });
    return;
  }
  if (now - row.windowStart > RATE_WINDOW_MS) {
    await ctx.db.patch(row._id, { windowStart: now, count: 1 });
    return;
  }
  if (row.count >= RATE_MAX) {
    throw new Error("Too many attempts. Try again in a minute.");
  }
  await ctx.db.patch(row._id, { count: row.count + 1 });
}

async function ensureStats(ctx: { db: any }) {
  const row = await ctx.db.query("stats").first();
  if (row) return row;
  const id = await ctx.db.insert("stats", { totalAmount: 0, totalPledgers: 0 });
  return await ctx.db.get(id);
}

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    amount: v.number(),
    city: v.string(),
    country: v.string(),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    const city = args.city.trim();
    const country = args.country.trim();

    if (!name || name.length > 80) throw new Error("Non envalid");
    if (!EMAIL_RE.test(email)) throw new Error("Imèl envalid");
    if (!city || city.length > 80) throw new Error("Vil envalid");
    if (!country || country.length > 80) throw new Error("Peyi envalid");
    if (!Number.isFinite(args.amount)) throw new Error("Montan envalid");
    if (args.amount < MIN_PLEDGE) throw new Error(`Minimòm pledj la se $${MIN_PLEDGE}`);
    if (args.amount > MAX_PLEDGE) throw new Error("Montan twò gwo");

    const amount = Math.round(args.amount);
    const now = Date.now();

    await checkRateLimit(ctx, `email:${email}`);

    const existing = await ctx.db
      .query("pledges")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    const stats = await ensureStats(ctx);

    if (existing) {
      const newAmount = existing.amount + amount;
      await ctx.db.patch(existing._id, {
        amount: newAmount,
        pledgeCount: existing.pledgeCount + 1,
        lastPledgeAt: now,
        name,
        city,
        country,
      });
      await ctx.db.patch(stats._id, {
        totalAmount: stats.totalAmount + amount,
        totalPledgers: stats.totalPledgers,
      });
      return {
        id: existing._id,
        totalAmount: newAmount,
        delta: amount,
        isReturning: true,
        pledgeCount: existing.pledgeCount + 1,
      };
    }

    const id = await ctx.db.insert("pledges", {
      name,
      email,
      amount,
      city,
      country,
      pledgeCount: 1,
      lastPledgeAt: now,
    });
    await ctx.db.patch(stats._id, {
      totalAmount: stats.totalAmount + amount,
      totalPledgers: stats.totalPledgers + 1,
    });
    return {
      id,
      totalAmount: amount,
      delta: amount,
      isReturning: false,
      pledgeCount: 1,
    };
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 12, 1), 50);
    const docs = await ctx.db
      .query("pledges")
      .withIndex("by_lastPledge")
      .order("desc")
      .take(limit);
    return docs.map((d) => ({
      id: d._id,
      name: d.name,
      city: d.city,
      country: d.country,
      amount: d.amount,
      pledgeCount: d.pledgeCount,
      lastPledgeAt: d.lastPledgeAt,
    }));
  },
});

export const totals = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db.query("stats").first();
    return {
      totalAmount: row?.totalAmount ?? 0,
      totalPledgers: row?.totalPledgers ?? 0,
      goal: 25_000_000,
    };
  },
});

export const top = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 5, 1), 20);
    const docs = await ctx.db
      .query("pledges")
      .withIndex("by_amount")
      .order("desc")
      .take(limit);
    return docs.map((d) => ({
      id: d._id,
      name: d.name,
      city: d.city,
      country: d.country,
      amount: d.amount,
    }));
  },
});

export const publicById = query({
  args: { id: v.id("pledges") },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.id);
    if (!row) return null;
    return {
      name: row.name,
      city: row.city,
      country: row.country,
      amount: row.amount,
      pledgeCount: row.pledgeCount,
      lastPledgeAt: row.lastPledgeAt,
    };
  },
});

export const geography = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("pledges").collect();
    const cities = new Set<string>();
    const countries = new Set<string>();
    for (const p of all) {
      if (p.city) cities.add(`${p.city.toLowerCase()}|${p.country.toLowerCase()}`);
      if (p.country) countries.add(p.country.toLowerCase());
    }
    return { cities: cities.size, countries: countries.size };
  },
});

export const lookupByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) return null;
    const row = await ctx.db
      .query("pledges")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();
    if (!row) return null;
    return {
      name: row.name,
      city: row.city,
      country: row.country,
      amount: row.amount,
      pledgeCount: row.pledgeCount,
    };
  },
});
