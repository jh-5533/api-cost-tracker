import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

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
