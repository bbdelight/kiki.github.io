// Wait for the page to load before executing scripts
document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    updateCartUI();
    
    document.getElementById("order-form").addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const payment = document.getElementById("payment").value;
        const cart = loadCart();
        const total = document.getElementById("total-price").innerText.replace("Total: $", "").trim();

        if (cart.length === 0) {
            alert("Your cart is empty! Please add items before placing an order.");
            return;
        }

        const items = cart.map(item => `${item.quantity}x ${item.name} ($${item.price})`).join(", ");

        // Google Sheets API Details
        const sheetID = "1UB52BV-zK7rZPK-aqsdsVJcRh7pMgwlSW1GKGbi_m38"; 
        const apiKey = "AIzaSyBYH2f3HByFjElo4pOu-AW1ZwBTHgLCUFM";
        const sheetName = "B&B Delights"; 

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${"1UB52BV-zK7rZPK-aqsdsVJcRh7pMgwlSW1GKGbi_m38"}/values/${"B&B Delights"}!A1:append?valueInputOption=USER_ENTERED&key=${"AIzaSyBYH2f3HByFjElo4pOu-AW1ZwBTHgLCUFM"}`;

        const orderData = {
            values: [[new Date().toISOString(), name, email, address, payment, total, items]]
        };

        fetch(url, {
            method: "POST",
            body: JSON.stringify(orderData),
            headers: { "Content-Type": "application/json" }
        })
        .then(response => response.json())
        .then(data => {
            alert("Order placed successfully!");
            document.getElementById("order-form").reset();
            localStorage.removeItem("cart"); // Clear the cart
            updateCartUI();
            updateCartCount();
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Failed to process the order. Please try again later.");
        });
    });
});

// 🛒 CART FUNCTIONS

// Load cart from localStorage
function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
}

// Add items to cart
function addToCart(itemName, price) {
    let cart = loadCart();
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

// Update cart count display
function updateCartCount() {
    let cart = loadCart();
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll("#cart-count").forEach(el => el.textContent = totalCount);
}

// Update cart UI display
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

// Remove an item from cart
function removeFromCart(itemName) {
    let cart = loadCart();
    cart = cart.filter(item => item.name !== itemName);
    saveCart(cart);
    updateCartCount();
}
