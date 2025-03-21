document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!window.app?.currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize dashboard
    initializeDashboard();
});

function initializeDashboard() {
    updateDashboardStats();
    loadRecentSales();
    setupEventListeners();
    updateUserInfo();
}

function updateUserInfo() {
    const userWelcome = document.querySelector('.user-welcome');
    if (userWelcome && window.app.currentUser) {
        userWelcome.textContent = `Welcome back, ${window.app.currentUser.name}`;
    }
}

function updateDashboardStats() {
    const stats = window.app.getDashboardStats();
    
    // Update stats cards
    document.getElementById('todaySales').textContent = `$${stats.todaySales.toFixed(2)}`;
    document.getElementById('totalOrders').textContent = stats.totalOrders;
    document.getElementById('lowStockItems').textContent = stats.lowStockItems;
    document.getElementById('activeCustomers').textContent = stats.activeCustomers;
}

function loadRecentSales() {
    const salesTableBody = document.getElementById('recentSalesBody');
    if (!salesTableBody) return;

    const sales = window.app.sales.slice(-3); // Get last 3 sales
    
    salesTableBody.innerHTML = sales.map(sale => {
        const customer = window.app.customers.find(c => c.id === sale.customerId);
        const product = window.app.products.find(p => p.id === sale.products[0].id);
        
        return `
            <tr class="border-b">
                <td class="py-3">${sale.id}</td>
                <td class="py-3">${customer.name}</td>
                <td class="py-3">${product.name}</td>
                <td class="py-3">$${sale.total.toFixed(2)}</td>
                <td class="py-3">
                    <span class="px-2 py-1 ${getStatusClass(sale.status)} rounded-full text-sm">
                        ${sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                    </span>
                </td>
            </tr>
        `;
    }).join('');
}

function getStatusClass(status) {
    const statusClasses = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
}

function setupEventListeners() {
    // Sidebar navigation is now handled by direct links in HTML

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.app.logout();
        });
    }

    // Notifications
    const notificationsBtn = document.getElementById('notificationsBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', () => {
            alert('Notifications panel coming soon!');
        });
    }
}

// Make loadRecentSales available globally for sales.js
window.loadRecentSales = loadRecentSales;

// Refresh dashboard data periodically
setInterval(updateDashboardStats, 60000); // Update every minute