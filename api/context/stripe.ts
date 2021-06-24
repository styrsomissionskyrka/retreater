import Stripe from 'stripe';

import { ensure } from 'lib/utils/assert';

export const stripe = new Stripe(ensure(process.env.STRIPE_SECRET_KEY), { apiVersion: '2020-08-27' });
