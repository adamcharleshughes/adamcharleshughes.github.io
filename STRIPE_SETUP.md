# Stripe Integration Guide

This guide will help you set up payment processing with Stripe for your Artistic Creations website.

## 📋 Overview

The website currently has two payment options:
1. **Stripe Payment** - Real-time credit card processing (recommended)
2. **Contact Form** - For custom inquiries and custom payments

## 🎯 Step 1: Create a Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Click "Start now" 
3. Sign up with your email
4. Fill in your business information
5. Verify your email
6. Complete account setup

## 🔑 Step 2: Get Your API Keys

1. Log into your Stripe Dashboard
2. Navigate to **Developers** → **API Keys**
3. You should see two types of keys:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)
4. For testing, use the **Test Mode** keys (toggle in top left)
5. Copy your **Publishable Key** (test mode)

## 🛠️ Step 3: Add Your Key to the Website

### Option A: Simple Method (Frontend Only - Development)
1. Open `script.js` in your text editor
2. Find line 4: `const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_STRIPE_PUBLIC_KEY_HERE';`
3. Replace with your actual key:
   ```javascript
   const STRIPE_PUBLIC_KEY = 'pk_test_1234abcd...'; // Your test key
   ```
4. Save the file
5. Test by going to cart and clicking checkout

### Option B: Recommended Method (Backend - Production)

For production websites, NEVER put secret keys in frontend code. Instead:

1. **Set up a backend server** (Node.js, Python, PHP, etc.)
2. **Create a checkout endpoint**

Example with Node.js/Express:
```javascript
const stripe = require('stripe')('sk_test_YOUR_SECRET_KEY');

app.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;
  
  const lineItems = cartItems.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: 'https://yourdomain.com/success',
    cancel_url: 'https://yourdomain.com/cancel',
  });

  res.json({ sessionId: session.id });
});
```

3. Update `script.js` to call your backend:
```javascript
function showStripeCheckout() {
  const total = calculateTotal();
  
  fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems: cart })
  })
  .then(res => res.json())
  .then(data => {
    // Redirect to Stripe checkout
    window.location.href = data.sessionId;
  });
}
```

## 🧪 Step 4: Test with Stripe Test Cards

Use these test card numbers to process payments WITHOUT charging:

### Successful Payment
- Card Number: `4242 4242 4242 4242`
- Expiry: `12/25`
- CVC: `123`
- ZIP: `12345`

### Declined Payment
- Card Number: `4000 0000 0000 0002`
- Expiry: `12/25`
- CVC: `123`
- ZIP: `12345`

### 3D Secure Authentication
- Card Number: `4000 0027 6000 3184`
- Expiry: `12/25`
- CVC: `123`
- ZIP: `12345`

## ✅ Step 5: Test Checkout Flow

1. Add items to cart
2. Go to cart.html
3. Click "Proceed to Checkout"
4. Choose "OK" for Stripe payment
5. When prompted, use a test card number above
6. Complete the payment simulation

## 🔄 Step 6: Going to Production

When ready to accept real payments:

1. **Get Live Keys**
   - Go to Stripe Dashboard
   - Toggle OFF "Test Mode" in top left
   - Copy your **Live Publishable Key** (starts with `pk_live_`)

2. **Switch Keys**
   - Update your backend with live secret key (`sk_live_...`)
   - Update frontend with live public key (`pk_live_...`)
   - Update success/cancel URLs to your live domain

3. **Enable HTTPS**
   - REQUIRED for production
   - Use Let's Encrypt (free) or paid SSL certificate

4. **Move to Production Domain**
   - Update Stripe redirect URLs
   - Configure domain in Stripe settings

## 💰 Understanding Charges

Stripe charges:
- **2.2% + $0.30** per successful card charge in the US
- **Higher rates** for international cards
- **No monthly fees** for free account tier
- **Instant payouts** to your bank account

## 📊 Monitor Transactions

1. Log into Stripe Dashboard
2. Go to **Payments** to see all transactions
3. View order details, refund status, customer info
4. Download reports for accounting

## 🔐 Security Best Practices

✅ **DO:**
- Use HTTPS always
- Keep secret keys secret (never in code/GitHub)
- Validate amounts on the backend
- Use Stripe's webhook to confirm payments
- Enable 3D Secure authentication
- Keep dependencies updated

❌ **DON'T:**
- Store customer card data yourself
- Put secret keys in frontend code
- Hardcode prices (let customer set it)
- Skip HTTPS even for testing
- Share your API keys

## 🪝 Webhooks (Advanced)

Stripe webhooks notify your server about payment events:

1. Go to **Developers** → **Webhooks**
2. Click "Add Endpoint"
3. Enter your server URL: `https://yourdomain.com/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`

```javascript
// Example webhook handler
app.post('/webhook', (req, res) => {
  const event = req.body;
  
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    // Update database, send confirmation email, etc.
    console.log('Payment succeeded:', paymentIntent.id);
  }
  
  res.json({ received: true });
});
```

## 📧 Send Receipts

After payment succeeds:
```javascript
// Send confirmation email to customer
fetch('/send-receipt', {
  method: 'POST',
  body: JSON.stringify({
    email: customer_email,
    orderId: payment_id,
    items: cart
  })
});
```

## 🆘 Troubleshooting

**Stripe key not working?**
- Verify you copied it correctly
- Make sure it's in the right format (starts with pk_test_ or pk_live_)
- Sign out and sign back into Stripe dashboard

**Payment button not responding?**
- Check browser console (F12) for errors
- Verify Stripe.js is loaded: `<script src="https://js.stripe.com/v3/"></script>`
- Check that cart is not empty

**Getting CORS errors?**
- Set up proper CORS headers on backend
- Ensure request URLs match your domain

## 📚 Resources

- [Stripe Dashboard](https://dashboard.stripe.com) - Main control panel
- [Stripe Documentation](https://stripe.com/docs) - Full API reference
- [Payment Button Guide](https://stripe.com/docs/payments/accept-a-payment) - Quick start
- [Stripe Testing](https://stripe.com/docs/testing) - Test cards and scenarios

## ✨ Next Steps

1. ✅ Create Stripe account
2. ✅ Add test key to website
3. ✅ Test with test card numbers
4. ✅ Set up backend (if needed)
5. ✅ Get live keys
6. ✅ Go live!

---

**Need help?** Reference Stripe's official guides or contact their support team through your dashboard.

Happy selling! 💳
