# Artistic Creations - E-Commerce Website

A modern, responsive website for displaying and selling paintings and books. Built with vanilla HTML, CSS, and JavaScript.
RENTO 2
## 📁 Project Structure

```
Captured Eagle 2/
├── index.html              # Home page with hero section and featured products
├── products.html           # Product gallery with filtering and sorting
├── product-detail.html     # Individual product details and reviews
├── cart.html              # Shopping cart and checkout
├── about.html             # About the gallery and artist
├── contact.html           # Contact form and inquiries
├── styles.css             # Global styling and responsive design
├── script.js              # Main JavaScript functionality
└── products.json          # Product database
```

## 🚀 Quick Start

### 1. Open the Website
Simply open `index.html` in your web browser. No installation or build process required!

```bash
# Windows
explorer index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

### 2. Features

✅ **Product Gallery**
- Browse paintings and books
- Filter by category (paintings/books)
- Sort by price, newest, or featured
- Responsive grid layout

✅ **Product Details**
- Detailed product information
- High-quality image placeholders (using emoji)
- Related products suggestions
- Add to wishlist functionality

✅ **Shopping Cart**
- Add/remove items
- Adjust quantities
- Real-time price calculation
- Order summary with shipping and tax

✅ **Pricing Structure**
- Automatic shipping calculation (£10 or FREE over £100)
- 8% sales tax
- Real-time total updates

✅ **Contact Form**
- Professional inquiry form
- Email validation
- Success/error messages
- Contact information page

✅ **Wishlist**
- Save favorite items to browser storage
- Persistent across sessions

## 📦 Sample Products

The website comes with 10 sample products:

**Paintings:**
1. Sunset Over Mountains - £899
2. Abstract Dreams - £650
3. Ocean's Whisper - £750
4. Forest Sanctuary - £580
5. Urban Reflections - £620
6. Starlight Symphony - £925

**Books:**
1. Philosophical Musings - £45
2. The Artist's Journey - £38
3. Color Theory Exploration - £52
4. Techniques Masterclass - £60

## 💳 Payment Integration

### Stripe Setup (Recommended)

1. **Create a Stripe Account**
   - Go to [stripe.com](https://stripe.com)
   - Sign up for a free account
   - Get your API keys

2. **Add Your Stripe Key**
   - Open `script.js`
   - Find the line: `const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_STRIPE_PUBLIC_KEY_HERE';`
   - Replace with your actual public key: `const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_ACTUAL_KEY';`

3. **Set Up Backend** (Optional for production)
   - For full Stripe integration, you'll need a backend server
   - Create a checkout session endpoint
   - Handle payment confirmations
   - See Stripe documentation: https://stripe.com/docs

### Contact Form Integration

Users can choose to either:
- Pay with Stripe (real-time payment)
- Contact for inquiry (contact form approach)

The contact form currently logs to console. For production:
1. Set up an email service (SendGrid, Mailgun, service like Formspree)
2. Replace the `submitContactForm()` function with actual backend call

Example with Formspree:
```javascript
fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
})
```

## 🎨 Customization

### Add Your Own Products
Edit `products.json`:
```json
{
  "id": 11,
  "name": "Your Artwork",
  "category": "painting",
  "price": 799,
  "image": "🎭",
  "featured": true,
  "description": "Your description here",
  "details": "Medium, dimensions, notes",
  "shortDescription": "Short title"
}
```

### Customize Colors
Edit `styles.css` - CSS variables section:
```css
:root {
    --primary-color: #8B5A3C;        /* Main brand color */
    --secondary-color: #D4A574;      /* Secondary color */
    --accent-color: #E8C4A0;         /* Accent highlights */
    --dark-color: #3D2817;           /* Text color */
    --light-color: #F5F1ED;          /* Background color */
}
```

### Update Business Information
- **Contact Page**: Edit contact.html with your real contact info
- **About Page**: Edit about.html with your story
- **Footer**: Update copyright year and links in all HTML files

## 💾 Data Storage

The website uses browser `localStorage` for:
- **Shopping Cart**: Persists across browser sessions
- **Wishlist**: Saves favorite items
- **User Preferences**: (can be extended)

No database or backend required for basic functionality!

## 📱 Responsive Design

The website is fully responsive:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1200px)
- ✅ Mobile (< 768px)

## 🔒 Security Notes

For production deployment:
1. **Enable HTTPS** - Always use HTTPS for payment processing
2. **Validate Forms Server-Side** - Never trust client-side validation alone
3. **Protect API Keys** - Never expose secret keys in frontend code
4. **Implement CORS** - If calling external APIs
5. **Add Rate Limiting** - Protect contact form from spam

## 🌐 Deployment Options

### GitHub Pages (Free, Static)
```bash
# 1. Create repository named username.github.io
# 2. Push all files
# 3. Enable GitHub Pages in settings
# Access at: https://username.github.io
```

### Netlify (Free tier available)
- Drag and drop folder to netlify.com
- Automatic HTTPS
- Good for static sites

### Vercel (Free tier available)
- Connect GitHub repository
- Automatic deployments
- Great performance

### Traditional Hosting
- Upload files to web server via FTP
- No build process needed

## 📊 Analytics (Optional)

Add Google Analytics:
1. Create account at google.com/analytics
2. Add script to bottom of each HTML file:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

## 🐛 Troubleshooting

**Cart not saving?**
- Check if localStorage is enabled in your browser
- Try clearing browser cache and trying again

**Products not loading?**
- Verify `products.json` is in the same folder
- Check browser console (F12) for errors
- Ensure JSON file is valid (use jsonlint.com)

**Stripe not working?**
- Verify your API key is correct
- Check Stripe dashboard for errors
- Test with Stripe test cards

**Images not showing?**
- Currently uses emoji placeholders
- To use real images, replace `"image": "🎨"` with `"image": "/path/to/image.jpg"`

## 📚 Resources

- [MDN Web Docs](https://developer.mozilla.org) - JavaScript reference
- [Stripe Documentation](https://stripe.com/docs) - Payment integration
- [CSS Tricks](https://css-tricks.com) - CSS tips
- [Web.dev](https://web.dev) - Web best practices

## 📝 License

Feel free to use this template for your own projects!

## 🤝 Support

For questions or issues:
1. Check the troubleshooting section
2. Review browser console for errors (F12 → Console tab)
3. Verify all files are in the same directory

---

**Happy selling! 🎨📚**

