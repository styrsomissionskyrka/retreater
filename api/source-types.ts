import Stripe from 'stripe';

export type StripeProduct = Stripe.Product;
export type StripePrice = Stripe.Price;
export type StripeCheckoutSession = Stripe.Checkout.Session;
export type StripePaymentIntent = Stripe.PaymentIntent;
export type StripeLineItem = Stripe.LineItem;
export type StripeRefund = Stripe.Refund;
