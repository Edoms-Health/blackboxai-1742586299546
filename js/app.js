// Main application state
const appState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    products: [
        { id: 1, name: "Smart TV 55\"", category: "TVs", price: 899.99, stock: 15, sku: "TV-55-SAM" },
        { id: 2, name: "Laptop Pro", category: "Laptops", price: 1299.99, stock: 8, sku: "LAP-PRO-2023" },
        { id: 3, name: "Smart Speaker", category: "Audio", price: 129.99, stock: 25, sku: "SPK-SMART-01" },
        { id: 4, name: "Wireless Earbuds", category: "Audio", price: 159.99, stock: 30, sku: "EAR-WL-PRO" },
        { id: 5, name: "Gaming Console", category: "Gaming", price: 499.99, stock: 12, sku: "GAME-CON-X" }
    ],
    customers: [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "555-0101" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "555-0102" },
        { id: 3, name: "Mike Johnson", email: "mike@example.com", phone: "555-0103" }
    ],
    sales: [
        { 
            id: "ORD-001",
            customerId: 1,
            products: [{ id: 1, quantity: 1 }],
            total: 899.99,
            date: "2024-03-21",
            status: "completed"
        },
        {
            id: "ORD-002",
            customerId: 2,
            products: [{ id: 2, quantity: 1 }],
            total: 1299.99,
            date: "2024-03-21",
            status: "pending"
        }
    ]
};

// Authentication
function login(email, password) {
    if (email === "admin@edoms.com" && password === "admin123") {
        const user = {
            id: 1,
            name: "Admin",
            email: email,
            role: "admin"
        };
        appState.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return true;
    }
    return false;
}

function logout() {
    appState.currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function isLoggedIn() {
    return appState.currentUser !== null;
}

// Products Management
function getProducts() {
    return appState.products;
}

function addProduct(product) {
    product.id = appState.products.length + 1;
    appState.products.push(product);
}

function updateProduct(productId, updates) {
    const index = appState.products.findIndex(p => p.id === productId);
    if (index !== -1) {
        appState.products[index] = { ...appState.products[index], ...updates };
    }
}

// Sales Management
function createSale(customerId, products) {
    const sale = {
        id: `ORD-${String(appState.sales.length + 1).padStart(3, '0')}`,
        customerId,
        products,
        total: calculateTotal(products),
        date: new Date().toISOString().split('T')[0],
        status: "pending"
    };
    appState.sales.push(sale);
    updateInventory(products);
    return sale;
}

function calculateTotal(products) {
    return products.reduce((total, item) => {
        const product = appState.products.find(p => p.id === item.id);
        return total + (product.price * item.quantity);
    }, 0);
}

function updateInventory(products) {
    products.forEach(item => {
        const product = appState.products.find(p => p.id === item.id);
        if (product) {
            product.stock -= item.quantity;
        }
    });
}

// Customer Management
function getCustomers() {
    return appState.customers;
}

function addCustomer(customer) {
    customer.id = appState.customers.length + 1;
    appState.customers.push(customer);
}

// Dashboard Analytics
function getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    return {
        todaySales: appState.sales
            .filter(sale => sale.date === today)
            .reduce((total, sale) => total + sale.total, 0),
        totalOrders: appState.sales.length,
        lowStockItems: appState.products.filter(p => p.stock < 10).length,
        activeCustomers: appState.customers.length
    };
}

// Export all functions and data
window.app = {
    login,
    logout,
    isLoggedIn,
    getProducts,
    addProduct,
    updateProduct,
    createSale,
    getCustomers,
    addCustomer,
    getDashboardStats,
    currentUser: appState.currentUser,
    products: appState.products,
    customers: appState.customers,
    sales: appState.sales,
    updateInventory,
    calculateTotal
};