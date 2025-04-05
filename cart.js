
    // Function to load cart from localStorage
function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Function to save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI(); // Update cart UI
}

// Function to add items to the cart
function addToCart(itemName, price) {
    let cart = loadCart();
    
    // Check if item already exists in cart
    let existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: itemName, price: price, quantity: 1 });
    }

    saveCart(cart);
    alert(`${itemName} added to cart!`);
    updateCartCount();
}

// Function to update the cart count display
function updateCartCount() {
    let cart = loadCart();
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("#cart-count").forEach(el => el.textContent = totalCount);
}

// Function to update the cart display on the online ordering page
function updateCartUI() {
    let cart = loadCart();
    let cartContainer = document.getElementById("cart-items");
    let totalPrice = document.getElementById("total-price");

    if (!cartContainer || !totalPrice) return;

    cartContainer.innerHTML = ""; // Clear previous items
    let total = 0;

    cart.forEach(item => {
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        
        cartItem.innerHTML = `
            <p><strong>${item.name}</strong> - $${item.price} x ${item.quantity}</p>
            <button onclick="removeFromCart('${item.name}')">Remove</button>
        `;

        cartContainer.appendChild(cartItem);
        total += item.price * item.quantity;
    });

    totalPrice.innerText = `Total: $${total.toFixed(2)}`;
}

// Function to remove an item from the cart
function removeFromCart(itemName) {
    let cart = loadCart();
    cart = cart.filter(item => item.name !== itemName);
    saveCart(cart);
}

// Load cart count when the page loads
document.addEventListener("DOMContentLoaded", updateCartCount);