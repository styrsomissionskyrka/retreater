import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiHandler } from 'next';
import Stripe from 'stripe';

import { assert } from 'lib/utils/assert';
import { stripe } from 'api/context/stripe';
import { handleStripeEvents } from 'api/webhooks/stripe';

/**
 * API HANDLER IMPLEMENTATION BELOW
 */
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
assert(WEBHOOK_SECRET != null, 'process.env.STRIPE_WEBHOOK_SECRET must be defined.');

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).send('Method Not Allowed');
    return;
  }

  let buf = await buffer(req);
  let sig = req.headers['stripe-signature'];

  if (sig == null || Array.isArray(sig)) {
    console.error(`Bad signature ${sig ?? 'undefined'}`);
    res.status(400).send('Bad Request');
    return;
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, WEBHOOK_SECRET);
  } catch (error) {
    console.error(error);
    res.status(400).send('Bad Request');
    return;
  }

  await handleStripeEvents(event);
  res.json({ received: true });
};

const cors = Cors({ allowMethods: ['POST', 'HEAD'] });
export default cors(handler as any);
