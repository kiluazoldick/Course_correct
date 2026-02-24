import { getUncachableStripeClient } from './stripeClient';

async function seedProducts() {
  const stripe = await getUncachableStripeClient();

  const products = await stripe.products.search({ query: "name:'Corrige Tes Cours Premium'" });
  if (products.data.length > 0) {
    console.log('Premium product already exists:', products.data[0].id);
    const prices = await stripe.prices.list({ product: products.data[0].id, active: true });
    console.log('Existing prices:');
    for (const price of prices.data) {
      console.log(`  - ${price.id}: ${price.unit_amount} ${price.currency.toUpperCase()}`);
    }
    return;
  }

  const product = await stripe.products.create({
    name: 'Corrige Tes Cours Premium',
    description: 'Abonnement Premium mensuel - Acces illimite aux fonctionnalites avancees',
    metadata: {
      type: 'premium_subscription',
      duration: '1_month',
    },
  });
  console.log('Created product:', product.id);

  const xafPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 500,
    currency: 'xaf',
    metadata: { region: 'cameroon', display: '500 XAF' },
  });
  console.log('Created XAF price:', xafPrice.id, '- 500 XAF');

  const usdPrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 100,
    currency: 'usd',
    metadata: { region: 'international', display: '$1 USD' },
  });
  console.log('Created USD price:', usdPrice.id, '- $1 USD');

  console.log('\nDone! Add these price IDs to your environment or routes:');
  console.log(`STRIPE_XAF_PRICE_ID=${xafPrice.id}`);
  console.log(`STRIPE_USD_PRICE_ID=${usdPrice.id}`);
}

seedProducts().catch(console.error);
