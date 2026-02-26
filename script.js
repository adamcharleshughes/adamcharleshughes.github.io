// ==================== GLOBAL VARIABLES ====================
let products = [];
let cart = [];
let productsReady = null; // Promise that resolves when products are loaded
const STRIPE_PUBLIC_KEY = 'pk_test_YOUR_STRIPE_PUBLIC_KEY_HERE'; // Replace with your actual Stripe key

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    productsReady = loadProducts();
    updateCartCount();
});

// ==================== LOAD PRODUCTS ====================
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
    } catch (error) {
        console.error('Error loading products:', error);
        products = getSampleProducts();
    }
}

function getSampleProducts() {
    // Fallback if JSON doesn't load - includes all 10 products
    return [
        { id: 1, name: "Sunset Over Mountains", category: "painting", price: 899, image: "🎨", featured: true, description: "A breathtaking oil painting capturing the golden hour over majestic mountains. This piece brings warmth and serenity to any space.", details: "Oil on canvas, 36x24 inches, Signed by artist", shortDescription: "Golden hour mountain landscape" },
        { id: 2, name: "Abstract Dreams", category: "painting", price: 650, image: "🖼️", featured: true, description: "An imaginative abstract painting with bold colors and dynamic shapes. Perfect for modern and contemporary interiors.", details: "Acrylic on canvas, 30x30 inches, Certificate of authenticity", shortDescription: "Modern abstract mixed media" },
        { id: 3, name: "Philosophical Musings", category: "book", price: 45, image: "📚", featured: true, description: "A collection of thought-provoking essays and reflections on art, life, and human connection. Beautifully illustrated throughout.", details: "Hardcover, 256 pages, Limited edition", shortDescription: "Essays on art and philosophy" },
        { id: 4, name: "Ocean's Whisper", category: "painting", price: 750, image: "🌊", featured: false, description: "A serene seascape with gentle waves and soft colors. Evokes the peaceful energy of the ocean.", details: "Watercolor on paper, 24x18 inches", shortDescription: "Coastal seascape" },
        { id: 5, name: "The Artist's Journey", category: "book", price: 38, image: "📖", featured: false, description: "An autobiography documenting the creative journey and personal transformations of an artist. Filled with inspiring stories and beautiful illustrations.", details: "Paperback, 320 pages, Full-color illustrations", shortDescription: "Personal art journey memoir" },
        { id: 6, name: "Forest Sanctuary", category: "painting", price: 580, image: "🌲", featured: false, description: "A lush forest scene with vibrant greens and hidden creatures. Brings nature's tranquility into your home.", details: "Mixed media, 28x22 inches", shortDescription: "Nature-inspired forest artwork" },
        { id: 7, name: "Color Theory Exploration", category: "book", price: 52, image: "📕", featured: false, description: "A comprehensive guide to understanding colors in art. Includes techniques, theory, and stunning visual examples.", details: "Hardcover, 288 pages, Interactive samples included", shortDescription: "Color theory and techniques guide" },
        { id: 8, name: "Urban Reflections", category: "painting", price: 620, image: "🏙️", featured: false, description: "A contemporary piece exploring the reflection of buildings in water. Modern and striking composition.", details: "Acrylic on canvas, 32x24 inches", shortDescription: "Contemporary urban landscape" },
        { id: 9, name: "Techniques Masterclass", category: "book", price: 60, image: "📗", featured: false, description: "Learn advanced painting techniques from a professional artist. Step-by-step instructions with photography.", details: "Hardcover, 400 pages, Dust jacket included", shortDescription: "Painting techniques tutorial" },
        { id: 10, name: "Starlight Symphony", category: "painting", price: 925, image: "⭐", featured: false, description: "A magical night sky painting with stars and constellations. Evokes wonder and cosmic beauty.", details: "Oil on canvas, 40x30 inches, Signed and dated", shortDescription: "Celestial starry night" }
    ];
}

// ==================== FEATURED PRODUCTS ====================
async function loadFeaturedProducts() {
    await productsReady;
    const featuredGrid = document.getElementById('featured-products');
    if (!featuredGrid) return;

    const featured = products.filter(p => p.featured).slice(0, 3);
    featuredGrid.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// ==================== ALL PRODUCTS ====================
async function loadAllProducts() {
    await productsReady;
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    grid.innerHTML = products.map(product => createProductCard(product)).join('');
}

// ==================== PRODUCT CARD ====================
function createProductCard(product) {
    return `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.shortDescription}</p>
                <div class="product-price">£${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <a href="product-detail.html?id=${product.id}" class="view-link">View</a>
                    <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
}

// ==================== PRODUCT DETAIL PAGE ====================
async function loadProductDetail() {
    await productsReady;
    const detailContainer = document.getElementById('product-detail');
    const relatedGrid = document.getElementById('related-grid');
    if (!detailContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);

    if (!product) {
        detailContainer.innerHTML = '<p>Product not found</p>';
        return;
    }

    detailContainer.innerHTML = `
        <div class="detail-image">${product.image}</div>
        <div class="detail-content">
            <div class="detail-category">${product.category}</div>
            <h1>${product.name}</h1>
            <div class="detail-price">£${product.price.toFixed(2)}</div>
            <p class="detail-description">${product.description}</p>
            
            <div class="detail-specs">
                <h3>Details</h3>
                <div class="spec-item">
                    <span class="spec-label">Type:</span> ${product.category === 'painting' ? 'Original Painting' : 'Book'}
                </div>
                <div class="spec-item">
                    <span class="spec-label">Specs:</span> ${product.details}
                </div>
                <div class="spec-item">
                    <span class="spec-label">Availability:</span> In Stock
                </div>
            </div>

            <div class="quantity-selector">
                <label for="quantity">Quantity:</label>
                <input type="number" id="quantity" value="1" min="1" max="10">
            </div>

            <div class="detail-actions">
                <button class="btn btn-primary" onclick="addToCartFromDetail(${product.id})">Add to Cart</button>
                <button class="btn btn-secondary" onclick="addToWishlist(${product.id})">Add to Wishlist ❤️</button>
            </div>

            <p style="color: #999; margin-top: 2rem; font-size: 0.9rem;">
                🚚 Free shipping on orders over $100<br>
                ✓ Secure checkout with Stripe<br>
                ✓ 30-day return policy
            </p>
        </div>
    `;

    // Load related products
    const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    if (relatedGrid) {
        relatedGrid.innerHTML = related.map(p => createProductCard(p)).join('');
    }
}

// ==================== FILTERS ====================
function setupFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');

    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const categoryFilter = document.getElementById('category-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    let filtered = [...products];

    // Apply category filter
    if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Apply sorting
    switch(sortFilter) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filtered.sort((a, b) => b.id - a.id);
            break;
        default:
            filtered.sort((a, b) => b.featured - a.featured);
    }

    const grid = document.getElementById('products-grid');
    grid.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

// ==================== SHOPPING CART ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Added to cart!', 'success');
}

function addToCartFromDetail(productId) {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    saveCart();
    updateCartCount();
    showNotification(`Added ${quantity} item(s) to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
    updateCartCount();
}

function updateCartItemQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity = quantity;
        saveCart();
        displayCart();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('cart');
    cart = saved ? JSON.parse(saved) : [];
}

function updateCartCount() {
    loadCart();
    const cartCount = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.forEach(el => el.textContent = totalItems);
}

// ==================== DISPLAY CART ====================
function displayCart() {
    loadCart();
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Start shopping to add items to your cart</p>
                <a href="products.html" class="btn btn-primary" style="margin-top: 1rem;">Browse Products</a>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>£${item.price.toFixed(2)} each</p>
                <div class="quantity-selector" style="margin: 0.5rem 0;">
                    <input type="number" min="1" value="${item.quantity}" 
                           onchange="updateCartItemQuantity(${item.id}, this.value)" style="width: 60px;">
                </div>
            </div>
            <div class="cart-item-price">
                <p>£${(item.price * item.quantity).toFixed(2)}</p>
                <button class="btn btn-danger btn-small" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    updateOrderSummary();
}

// ==================== ORDER SUMMARY ====================
function updateOrderSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `£${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `£${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `£${total.toFixed(2)}`;
}

// ==================== CHECKOUT ====================
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processCheckout);
    }
});

function processCheckout() {
    loadCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Show payment options
    const choice = confirm('Choose payment method:\nOK = Stripe Payment\nCancel = Contact us for inquiry');
    
    if (choice) {
        // Stripe payment
        showStripeCheckout();
    } else {
        // Contact inquiry
        redirectToContact();
    }
}

function showStripeCheckout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = total > 100 ? 0 : 10;
    const tax = total * 0.08;
    const amount = (total + shipping + tax) * 100; // In cents

    // Show a confirmation and simulate Stripe integration
    const orderSummary = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    alert(`Processing payment for: ${orderSummary}\n\nTotal: £${((amount / 100).toFixed(2))}\n\nTo complete Stripe integration:\n1. Replace STRIPE_PUBLIC_KEY with your actual key\n2. Set up your Stripe backend\n3. Create a checkout session\n\nFor now, this demonstrates the checkout flow.`);
    
    // Clear cart after "payment"
    // Uncomment after real Stripe setup:
    // cart = [];
    // saveCart();
    // updateCartCount();
    // alert('Payment successful! Order confirmed.');
    // window.location.href = 'index.html';
}

function redirectToContact() {
    alert('We\'ll help you find the perfect pieces! Redirecting to contact form...');
    window.location.href = 'contact.html';
}

// ==================== CONTACT FORM ====================
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm();
    });
}

function submitContactForm() {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Basic validation
    if (!name || !email || !subject || !message) {
        showFormMessage('Please fill in all required fields', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission
    console.log('Form submitted:', { name, email, subject, message });
    
    showFormMessage('Thank you! We\'ve received your message. We\'ll get back to you shortly.', 'success');
    form.reset();
    
    // In a real application, you would send this data to a backend:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, subject, message })
    // })
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('form-message');
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    if (type === 'success') {
        setTimeout(() => {
            formMessage.className = 'form-message';
        }, 5000);
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ==================== WISHLIST ====================
function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Added to wishlist!', 'success');
    } else {
        showNotification('Already in your wishlist', 'info');
    }
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `${type}-message`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#27AE60' : '#3498DB'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== ANIMATIONS ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== UTILITY ====================
function formatPrice(price) {
    return `£${price.toFixed(2)}`;
}

// Initialize on page load
window.addEventListener('load', function() {
    loadCart();
    updateCartCount();
});
