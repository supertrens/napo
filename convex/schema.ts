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
});
