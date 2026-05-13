// Stripe customer lookup tool exposed to the agent.
import Stripe from 'stripe';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
});

export const stripeLookupTool = tool(
  async ({ customer_email }: { customer_email: string }) => {
    const customers = await stripe.customers.list({ email: customer_email, limit: 1 });
    if (!customers.data.length) return JSON.stringify({ found: false });
    const c = customers.data[0];
    return JSON.stringify({
      found: true,
      id: c.id,
      created: c.created,
      delinquent: c.delinquent,
    });
  },
  {
    name: 'stripe_lookup',
    description: 'Look up a Stripe customer by email and return their account status.',
    schema: z.object({
      customer_email: z.string().email(),
    }),
  },
);
