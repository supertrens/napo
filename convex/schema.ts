import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pledges: defineTable({
    name: v.string(),
    email: v.string(),
    amount: v.number(),
    city: v.string(),
    country: v.string(),
    pledgeCount: v.number(),
    lastPledgeAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_lastPledge", ["lastPledgeAt"])
    .index("by_amount", ["amount"]),

  stats: defineTable({
    totalAmount: v.number(),
    totalPledgers: v.number(),
  }),

  rateLimits: defineTable({
    key: v.string(), // "email:<email>"
    windowStart: v.number(),
    count: v.number(),
  }).index("by_key", ["key"]),

  // Append-only log of every pledge event. Powers the activity timeline
  // — we don't lose increment history to the cumulative `pledges` row.
  pledgeEvents: defineTable({
    pledgeId: v.id("pledges"),
    name: v.string(),
    city: v.string(),
    country: v.string(),
    delta: v.number(), // amount of THIS event
    cumulativeAmount: v.number(), // pledger's total AFTER this event
    pledgeCount: v.number(), // their nth pledge (1, 2, 3, ...)
    cumulativeTotal: v.number(), // overall total AFTER this event
    isReturning: v.boolean(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
