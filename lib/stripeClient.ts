/**
 * Stripe configuration placeholder.
 * Installer la dépendance : npm install stripe
 * puis décommenter la création du client.
 */
import { env } from './env';

export const stripePublishableKey = env.STRIPE_PUBLISHABLE_KEY;
export const stripeSecretKey = env.STRIPE_SECRET_KEY;

// import Stripe from 'stripe';
// export const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-08-01' });

export const stripeConfig = {
  publishableKey: stripePublishableKey,
  secretKey: stripeSecretKey,
};
