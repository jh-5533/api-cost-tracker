import Stripe from "stripe";

// Stripe is optional - only initialize if key is provided
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
      typescript: true,
    })
  : null;

export const PLANS = {
  free: {
    name: "Free",
    maxProviders: 2,
    historyDays: 30,
    emailAlerts: false,
    priceId: null,
  },
  pro: {
    name: "Pro",
    maxProviders: Infinity,
    historyDays: 365,
    emailAlerts: true,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
  },
};
