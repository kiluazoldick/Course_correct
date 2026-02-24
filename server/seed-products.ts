import { getUncachableStripeClient } from './stripeClient';

async function seedProducts() {
  const stripe = await getUncachableStripeClient();

  const products = await stripe.products.search({ query: "name:'Corrige Tes Cours Premium'" });
  let productId: string;

  if (products.data.length > 0) {
    productId = products.data[0].id;
    console.log('Premium product already exists:', productId);
  } else {
    const product = await stripe.products.create({
      name: 'Corrige Tes Cours Premium',
      description: 'Premium monthly subscription - Unlimited access to all advanced features',
      metadata: {
        type: 'premium_subscription',
        duration: '1_month',
      },
    });
    productId = product.id;
    console.log('Created product:', productId);
  }

  const prices = await stripe.prices.list({ product: productId, active: true });
  const existing10UsdPrice = prices.data.find(p => p.unit_amount === 1000 && p.currency === 'usd');

  if (existing10UsdPrice) {
    console.log('$10 USD price already exists:', existing10UsdPrice.id);
    console.log(`STRIPE_PRICE_ID=${existing10UsdPrice.id}`);
    return;
  }

  const usdPrice = await stripe.prices.create({
    product: productId,
    unit_amount: 1000,
    currency: 'usd',
    metadata: { display: '$10 USD/month' },
  });
  console.log('Created $10 USD price:', usdPrice.id);

  console.log('\nDone! Set this environment variable:');
  console.log(`STRIPE_PRICE_ID=${usdPrice.id}`);
}

seedProducts().catch(console.error);
