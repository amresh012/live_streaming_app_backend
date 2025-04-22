// backend/controllers/subscription.controller.js
import Stripe from 'stripe';
import User from '../models/user.model.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createSubscriptionSession = async (req, res) => {
  const { streamerId } = req.params;

  try {
    const streamer = await User.findById(streamerId);
    if (!streamer || streamer.role !== 'streamer') {
      return res.status(404).json({ message: 'Streamer not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Subscription to ${streamer.username}`,
            },
            unit_amount: 500, // $5.00 monthly
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        viewerId: req.user._id.toString(),
        streamerId: streamerId,
      },
      success_url: `${process.env.CLIENT_URL}/subscription-success`,
      cancel_url: `${process.env.CLIENT_URL}/subscription-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create session' });
  }
};

export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { viewerId, streamerId } = session.metadata;

    try {
      await User.findByIdAndUpdate(viewerId, {
        $addToSet: { isSubscribedTo: streamerId },
      });
    } catch (err) {
      console.error('Error saving subscription:', err.message);
    }
  }

  res.status(200).json({ received: true });
};
