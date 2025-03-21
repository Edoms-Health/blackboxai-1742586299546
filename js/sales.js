document.addEventListener('DOMContentLoaded', function() {
    if (!window.app?.currentUser) return;
    initializeSalesModule();
});

function initializeSalesModule() {
    const modal = document.getElementById('newSaleModal');
    const newSaleBtn = document.getElementById('newSaleBtn');
    const closeSaleModal = document.getElementById('closeSaleModal');
    const cancelSaleBtn = document.getElementById('cancelSaleBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    const newSaleForm = document.getElementById('newSaleForm');

    if (!modal || !newSaleBtn) return;
    
    // Initialize select options
    populateCustomerSelect();
    populateProductSelects();

    // Event Listeners
    newSaleBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });

    [closeSaleModal, cancelSaleBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeModal);
        }
    });

    if (addProductBtn) {
        addProductBtn.addEventListener('click', addProductEntry);
    }

    if (newSaleForm) {
        newSaleForm.addEventListener('submit', handleSaleSubmit);
    }

    // Close modal if clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Setup initial product entry
    const initialEntry = document.querySelector('.product-entry');
    if (initialEntry) {
        setupProductEntry(initialEntry);
    }

    // Initialize order summary
    updateOrderSummary();
}

function populateCustomerSelect() {
    const customerSelect = document.getElementById('customerSelect');
    if (!customerSelect) return;

    const customers = window.app.customers;
    customerSelect.innerHTML = '<option value="">Select Customer</option>' +
        customers.map(customer => 
            `<option value="${customer.id}">${customer.name} (${customer.email})</option>`
        ).join('');
}

function populateProductSelects() {
    const products = window.app.products;
    document.querySelectorAll('.product-select').forEach(select => {
        if (select.options.length <= 1) { // Only populate if not already populated
            select.innerHTML = '<option value="">Select Product</option>' +
                products.map(product => 
                    `<option value="${product.id}" data-price="${product.price}">${product.name} - $${product.price.toFixed(2)}</option>`
                ).join('');
        }
    });
}

function setupProductEntry(entry) {
    if (!entry) return;

    const select = entry.querySelector('.product-select');
    const quantityInput = entry.querySelector('.quantity-input');
    const removeBtn = entry.querySelector('.remove-product');

    if (!select || !quantityInput || !removeBtn) return;

    // Populate product options if empty
    if (select.options.length <= 1) {
        populateProductSelects();
    }

    // Event listeners
    select.addEventListener('change', updateOrderSummary);
    quantityInput.addEventListener('change', () => {
        if (parseInt(quantityInput.value) < 1) {
            quantityInput.value = 1;
        }
        updateOrderSummary();
    });
    
    removeBtn.addEventListener('click', () => {
        if (document.querySelectorAll('.product-entry').length > 1) {
            entry.remove();
            updateOrderSummary();
        }
    });
}

function addProductEntry() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;

    const template = `
        <div class="product-entry flex items-center space-x-4">
            <select class="product-select flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-edoms-light">
                <option value="">Select Product</option>
            </select>
            <input type="number" min="1" value="1" class="quantity-input w-20 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-edoms-light">
            <button type="button" class="remove-product text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = template.trim();
    const newEntry = tempContainer.firstChild;
    
    productsList.appendChild(newEntry);
    setupProductEntry(newEntry);
}

function updateOrderSummary() {
    let subtotal = 0;
    
    document.querySelectorAll('.product-entry').forEach(entry => {
        const select = entry.querySelector('.product-select');
        const quantity = parseInt(entry.querySelector('.quantity-input').value) || 0;
        const selectedOption = select.options[select.selectedIndex];
        
        if (selectedOption && selectedOption.dataset.price) {
            subtotal += parseFloat(selectedOption.dataset.price) * quantity;
        }
    });

    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const subtotalElem = document.getElementById('subtotal');
    const taxElem = document.getElementById('tax');
    const totalElem = document.getElementById('total');

    if (subtotalElem) subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
    if (taxElem) taxElem.textContent = `$${tax.toFixed(2)}`;
    if (totalElem) totalElem.textContent = `$${total.toFixed(2)}`;
}

function closeModal() {
    const modal = document.getElementById('newSaleModal');
    if (!modal) return;

    modal.classList.add('hidden');
    modal.classList.remove('flex');
    resetForm();
}

function resetForm() {
    const form = document.getElementById('newSaleForm');
    if (!form) return;

    form.reset();

    // Keep only one product entry
    const productsList = document.getElementById('productsList');
    if (productsList) {
        const entries = productsList.querySelectorAll('.product-entry');
        for (let i = 1; i < entries.length; i++) {
            entries[i].remove();
        }
    }

    updateOrderSummary();
}

function handleSaleSubmit(e) {
    e.preventDefault();

    const customerSelect = document.getElementById('customerSelect');
    if (!customerSelect) return;

    const customerId = parseInt(customerSelect.value);
    if (!customerId) {
        alert('Please select a customer');
        return;
    }

    const products = [];
    let isValid = true;

    document.querySelectorAll('.product-entry').forEach(entry => {
        const productId = parseInt(entry.querySelector('.product-select').value);
        const quantity = parseInt(entry.querySelector('.quantity-input').value);

        if (!productId || !quantity) {
            isValid = false;
            return;
        }

        products.push({
            id: productId,
            quantity: quantity
        });
    });

    if (!isValid || products.length === 0) {
        alert('Please select products and quantities');
        return;
    }

    try {
        // Create the sale
        const sale = window.app.createSale(customerId, products);
        
        // Update dashboard
        if (typeof window.loadRecentSales === 'function') {
            window.loadRecentSales();
        }
        
        // Close modal and show success message
        closeModal();
        alert(`Sale ${sale.id} created successfully!`);
    } catch (error) {
        console.error('Error creating sale:', error);
        alert('There was an error creating the sale. Please try again.');
    }
}