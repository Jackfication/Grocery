// Grocery list data
const groceryList = [
    { id: 1, name: 'Apple', price: 12, category: 'Fruits', imageUrl: 'images/apple.png' },
    { id: 2, name: 'Broccoli', price: 12, category: 'Vegetables', imageUrl: 'images/broccoli.png' },
    { id: 3, name: 'Chicken Breast', price: 15, category: 'Meat', imageUrl: 'images/breast.png' },
    { id: 4, name: 'Beef Steak', price: 20, category: 'Meat', imageUrl: 'images/beef.png' },
    { id: 5, name: 'Potato Chips', price: 5, category: 'Snacks', imageUrl: 'images/chips.png' },
    { id: 6, name: 'Chocolate Bar', price: 3, category: 'Snacks', imageUrl: 'images/chocolate.png' },
];

// Cart data
let cart = [];

// Function to get unique categories
function getCategories() {
    const categories = new Set(groceryList.map(item => item.category));
    categories.add('All'); // Add 'All' to the set of categories
    return Array.from(categories);
}

// Function to display category buttons
function displayCategories() {
    const categorySection = document.querySelector('.categories');
    const categories = getCategories();

    categorySection.innerHTML = ''; // Clear existing buttons
    categories.forEach(category => {
        const categoryButton = `
            <button class="category-btn" data-category="${category}">${category}</button>
        `;
        categorySection.innerHTML += categoryButton;
    });

    // Add event listeners to the new buttons
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', filterByCategory);
    });
}

// Function to display items on the page
function displayItems(items) {
    const productList = document.querySelector('.product-list');
    productList.innerHTML = ''; // Clear current items
    items.forEach(item => {
        const productCard = `
            <div class="product-card">
                <img src="${item.imageUrl}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
            </div>
        `;
        productList.innerHTML += productCard;
    });

    // Add event listeners to the new buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Function to add items to the cart
function addToCart(e) {
    const itemId = parseInt(e.target.getAttribute('data-id'));
    const item = groceryList.find(product => product.id === itemId);
    const cartItem = cart.find(cartItem => cartItem.id === itemId);

    if (cartItem) {
        cartItem.quantity += 1; // Increase quantity if item is already in cart
    } else {
        cart.push({ ...item, quantity: 1 }); // Add new item to the cart
    }
    alert(`${item.name} added to the cart!`);
}

// Function to display cart items
function viewCart() {
    const cartList = document.querySelector('.cart-list');
    cartList.innerHTML = ''; // Clear current cart items

    if (cart.length === 0) {
        cartList.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = `
            <div class="cart-item">
                <h3>${item.name}</h3>
                <p>Price: $${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
        `;
        cartList.innerHTML += cartItem;
    });
}

// Function to filter items by category
function filterByCategory(e) {
    const category = e.target.getAttribute('data-category');
    if (category === 'All') {
        displayItems(groceryList); // Show all items if 'All' is selected
    } else {
        const filteredItems = groceryList.filter(item => item.category === category);
        displayItems(filteredItems);
    }
}

// Function to open the modal
function openModal() {
    populateCategoryDropdown(); // Populate categories when opening modal
    document.getElementById('item-modal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('item-modal').style.display = 'none';
}

// Function to populate category dropdown in the modal
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('item-category');
    const categories = getCategories();

    categorySelect.innerHTML = ''; // Clear existing options
    categories.forEach(category => {
        const option = `<option value="${category}">${category}</option>`;
        categorySelect.innerHTML += option;
    });
}

// Function to handle the form submission for adding a new item
function handleFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const category = document.getElementById('item-category').value;
    const imageInput = document.getElementById('item-image');
    
    // Ensure values are provided and valid
    if (!name || isNaN(price) || !category || !imageInput.files.length) {
        alert('Please enter valid item details and upload an image.');
        return;
    }

    // Create a FileReader to read the uploaded image
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;

        const newItem = {
            id: groceryList.length + 1,
            name: name,
            price: price,
            category: category,
            imageUrl: imageUrl, // Use the uploaded image
        };

        groceryList.push(newItem); // Add new item to list
        displayItems(groceryList); // Refresh the display
        displayCategories(); // Refresh category buttons
        alert(`${newItem.name} added to the grocery list!`);

        closeModal(); // Close the modal after adding the item
    };

    reader.readAsDataURL(imageInput.files[0]); // Read the image file
}

// Function to search for items
function searchItems() {
    const searchTerm = document.getElementById('search-items').value.toLowerCase();
    const filteredItems = groceryList.filter(item => item.name.toLowerCase().includes(searchTerm));
    displayItems(filteredItems); // Display the filtered items
}

// Function to sort items
function sortItems() {
    const sortOption = document.getElementById('sort-options').value;

    let sortedItems = [...groceryList];
    if (sortOption === 'category') {
        sortedItems.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortOption === 'price') {
        sortedItems.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'name') {
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    }

    displayItems(sortedItems);
}

// Logout button functionality
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('currentUser'); // Clear current user data
    window.location.href = 'login.html'; // Redirect to login page
});

// Event listeners
document.getElementById('search-btn').addEventListener('click', searchItems);
document.getElementById('sort-options').addEventListener('change', sortItems);
document.querySelector('.add-item-btn').addEventListener('click', openModal);
document.querySelector('.view-cart-btn').addEventListener('click', viewCart);
document.getElementById('cart-btn').addEventListener('click', viewCart);

// Modal event listeners
document.querySelector('.close-btn').addEventListener('click', closeModal);
document.getElementById('add-item-form').addEventListener('submit', handleFormSubmit);

// Initial display of items and categories
displayItems(groceryList);
displayCategories();
