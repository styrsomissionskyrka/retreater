import { Stripe } from '@stripe/stripe-js';
import { useEffect } from 'react';

import { assert, ensure } from 'lib/utils/assert';

const PUBLISHABLE_KEY = ensure(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  'A Stripe key must be injected into the application.',
);

let STRIPE_PROMISE: Promise<Stripe | null>;

export async function getStripe() {
  if (STRIPE_PROMISE == null) {
    const { loadStripe } = await import('@stripe/stripe-js');
    STRIPE_PROMISE = loadStripe(PUBLISHABLE_KEY);
  }

  let stripe = await STRIPE_PROMISE;
  assert(stripe != null, 'Failed to load stripe.');

  return stripe;
}

export function preloadStripe() {
  if (STRIPE_PROMISE != null) return;
  import('@stripe/stripe-js').then(({ loadStripe }) => {
    if (STRIPE_PROMISE == null) {
      STRIPE_PROMISE = loadStripe(PUBLISHABLE_KEY).then((stripe) => {
        console.log('Stripe loaded');
        return stripe;
      });
    }
  });
}

export function usePreloadStripe() {
  useEffect(() => preloadStripe(), []);
}
