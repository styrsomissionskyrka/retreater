import Stripe from 'stripe';
import * as Auth0 from 'auth0';

export type StripeProduct = Stripe.Product;
export type StripePrice = Stripe.Price;
export type StripeCheckoutSession = Stripe.Checkout.Session;
export type StripePaymentIntent = Stripe.PaymentIntent;
export type StripeLineItem = Stripe.LineItem;
export type StripeRefund = Stripe.Refund;
export type StripeCoupon = Stripe.Coupon;

export type User = Auth0.User & { user_id: string };
export type Role = Auth0.Role & { id: string };
