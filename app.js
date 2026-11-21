/**
 * SHANKAR HARDWARE & AGRO TECH - CORE APPLICATION SCRIPT
 * Direct WhatsApp Ordering System (+91 7058729696)
 * Sonwadi, Pune District, Maharashtra
 */

// Target Business Phone / WhatsApp Number
const WHATSAPP_NUMBER = '917058729696';

/* ==========================================
   SHANKAR HARDWARE - UPI QR PAYMENT
========================================== */

(function () {
    const UPI_ID = "Q966324428@ybl";
    const MERCHANT_NAME = "Shankar Hardware";
    let currentOrderId = "";
    let currentUpiLink = "";

    function initializeUpiPayment() {
        const generateBtn = document.getElementById("generatePaymentQrBtn");
        const modal = document.getElementById("upiPaymentModal");
        const backdrop = document.getElementById("upiPaymentBackdrop");
        const closeBtn = document.getElementById("closeUpiPayment");
        const qrContainer = document.getElementById("upiQrCode");
        const submitBtn = document.getElementById("submitPaymentReference");
        if (!generateBtn || !modal || !backdrop || !qrContainer || generateBtn.dataset.bound === "1") return;
        generateBtn.dataset.bound = "1";

        function closeModal() {
            modal.style.display = "none";
            backdrop.style.display = "none";
            document.body.style.overflow = "";
        }

        function showQrImageFallback(upiLink) {
            qrContainer.innerHTML = "";
            const img = document.createElement("img");
            img.alt = "Scan this UPI QR code to pay";
            img.width = 220;
            img.height = 220;
            img.style.cssText = "display:block;width:220px;height:220px;max-width:100%;object-fit:contain";
            let fallbackUsed = false;
            img.onerror = function () {
                if (!fallbackUsed) {
                    fallbackUsed = true;
                    img.src = "https://quickchart.io/qr?size=220&text=" + encodeURIComponent(upiLink);
                } else {
                    qrContainer.innerHTML = '<p style="color:#b91c1c;padding:12px">QR image could not load. Please use the Pay Using UPI App button.</p>';
                }
            };
            img.src = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(upiLink);
            qrContainer.appendChild(img);
        }

        generateBtn.addEventListener("click", function () {
            const customerName = document.getElementById("cartCustomerName")?.value.trim() || "";
            const customerLocation = document.getElementById("cartCustomerLocation")?.value.trim() || "";

            // Always calculate the estimate from current cart lines and quantities.
            const estimatedAmount = Array.isArray(cart)
                ? cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0)
                : 0;

            if (!customerName || !customerLocation) {
                alert("Please enter your name and delivery location.");
                return;
            }
            if (!Array.isArray(cart) || cart.length === 0 || !Number.isFinite(estimatedAmount) || estimatedAmount <= 0) {
                alert("Please add products to your order list before generating the payment QR.");
                return;
            }

            currentOrderId = "SH" + Date.now();
            const amountFormatted = estimatedAmount.toFixed(2);
            currentUpiLink = "upi://pay?" +
                "pa=" + encodeURIComponent(UPI_ID) +
                "&pn=" + encodeURIComponent(MERCHANT_NAME) +
                "&am=" + encodeURIComponent(amountFormatted) +
                "&cu=INR&tn=" + encodeURIComponent(currentOrderId);

            document.getElementById("upiOrderId").textContent = currentOrderId;
            document.getElementById("upiPaymentAmount").textContent = "₹" + estimatedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const merchantEl = document.getElementById("upiMerchantId");
            if (merchantEl) merchantEl.textContent = UPI_ID;
            qrContainer.innerHTML = "";

            // Generate locally when QRCode.js is available; otherwise use two hosted fallbacks.
            try {
                if (typeof QRCode !== "undefined") {
                    new QRCode(qrContainer, {
                        text: currentUpiLink,
                        width: 220,
                        height: 220,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.M : 0
                    });
                } else {
                    showQrImageFallback(currentUpiLink);
                }
            } catch (error) {
                console.error("Local UPI QR generation failed; using image fallback.", error);
                showQrImageFallback(currentUpiLink);
            }

            const openUpiApp = document.getElementById("openUpiApp");
            if (openUpiApp) openUpiApp.href = currentUpiLink;
            modal.style.display = "block";
            backdrop.style.display = "block";
            document.body.style.overflow = "hidden";
        });

        if (closeBtn) closeBtn.addEventListener("click", closeModal);
        backdrop.addEventListener("click", closeModal);
        if (submitBtn) submitBtn.addEventListener("click", function () {
            const utr = document.getElementById("paymentUtr")?.value.trim() || "";
            if (!currentOrderId) { alert("Please generate your order payment QR first."); return; }
            if (!/^[a-zA-Z0-9]{8,30}$/.test(utr)) { alert("Please enter a valid payment reference number (8–30 characters)."); return; }
            if (!Array.isArray(cart) || cart.length === 0) { alert("Your cart is empty. Please add products and generate the QR again."); return; }

            const customer = document.getElementById("cartCustomerName")?.value.trim() || "";
            const location = document.getElementById("cartCustomerLocation")?.value.trim() || "";
            const notes = document.getElementById("cartCustomerNotes")?.value.trim() || "";
            const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
            const totalItems = cart.reduce((sum, item) => sum + Number(item.qty), 0);
            const productDetails = cart.map((item, index) => {
                const qty = Number(item.qty);
                const price = Number(item.price);
                const lineTotal = qty * price;
                return (index + 1) + ". " + item.name + "\n" +
                    "   Quantity: " + qty + (item.unit ? " " + item.unit : "") + "\n" +
                    "   Rate: ₹" + price.toFixed(2) + "\n" +
                    "   Subtotal: ₹" + lineTotal.toFixed(2);
            }).join("\n\n");

            const message = "PAYMENT REFERENCE SUBMISSION - SHANKAR HARDWARE\n\n" +
                "Order ID: " + currentOrderId + "\n" +
                "Customer: " + customer + "\n" +
                "Delivery Location: " + location + "\n\n" +
                "ORDERED PRODUCTS:\n\n" + productDetails + "\n\n" +
                "Total Items: " + totalItems + "\n" +
                "Order Amount: ₹" + totalAmount.toFixed(2) + "\n\n" +
                
                "UTR / Payment Reference: " + utr + "\n\n" +
                (notes ? "Customer Notes: " + notes + "\n\n" : "") +
                "Please verify the payment against your bank statement and confirm this order.";

            window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message), "_blank", "noopener");
        });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initializeUpiPayment);
    else initializeUpiPayment();
})();

// -------------------------------------------------------------
// PRODUCT CATALOG DATABASE
// Catalog based on visible store inventory; product photos are intentionally not embedded.
// Prices are indicative display values requested in the ₹100–₹400 range; verify actual shop rates before accepting orders.
// -------------------------------------------------------------
const PRODUCTS_DATA = [
  { id: 'Test', name: 'Test', marathiName: 'टेस्ट', category: 'ropes', categoryLabel: 'Ropes & Cords', price: 1, unit: 'coil', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Ropes', fallbackIcon: 'fa-link', specs: { 'Price': 'Indicative starting price ₹1; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Different thicknesses and coil lengths; confirm exact size and material.' },
  { id: 'rope-nylon', name: 'Nylon / PP Rope Coil', marathiName: 'नायलॉन / पीपी दोरी', category: 'ropes', categoryLabel: 'Ropes & Cords', price: 250, unit: 'coil', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Ropes', fallbackIcon: 'fa-link', specs: { 'Price': 'Indicative starting price ₹250; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Different thicknesses and coil lengths; confirm exact size and material.' },
  { id: 'wire-binding', name: 'GI Binding Wire Coil', marathiName: 'जीआय बांधकाम वायर', category: 'hardware', categoryLabel: 'Wire & Fasteners', price: 180, unit: 'kg', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Wire Stock', fallbackIcon: 'fa-grip-lines', specs: { 'Price': 'Indicative starting price ₹180; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Galvanized wire for tying, fencing and general hardware work.' },
  { id: 'wire-ms', name: 'MS / GI Steel Wire Coil', marathiName: 'एमएस / जीआय स्टील वायर', category: 'hardware', categoryLabel: 'Wire & Fasteners', price: 220, unit: 'kg', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Wire Stock', fallbackIcon: 'fa-circle-nodes', specs: { 'Price': 'Indicative starting price ₹220; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Wire coils are visible in the store; confirm gauge and finish before ordering.' },
  { id: 'chain-lifting', name: 'Lifting Chain & Hooks', marathiName: 'लिफ्टिंग चेन आणि हुक', category: 'ropes', categoryLabel: 'Chains & Lifting', price: 400, unit: 'piece', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Lifting Hardware', fallbackIcon: 'fa-link', specs: { 'Price': 'Indicative starting price ₹400; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Metal chains, hooks and lifting hardware; confirm safe working load and size.' },
  { id: 'pulley-hoist', name: 'Pulley / Chain Block Hardware', marathiName: 'पुली आणि चेन ब्लॉक साहित्य', category: 'hardware', categoryLabel: 'Lifting Hardware', price: 350, unit: 'piece', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Hardware', fallbackIcon: 'fa-gears', specs: { 'Price': 'Indicative starting price ₹350; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Assorted pulley and lifting components; confirm capacity and model.' },
  { id: 'pvc-pipe', name: 'PVC Pipe Sections', marathiName: 'पीव्हीसी पाईप', category: 'pumps', categoryLabel: 'Pipes & Fittings', price: 300, unit: 'length', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Plumbing', fallbackIcon: 'fa-grip-lines', specs: { 'Price': 'Indicative starting price ₹300; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'PVC pipe stock; confirm diameter, pressure class and length.' },
  { id: 'pvc-elbow', name: 'PVC Elbow & Tee Fittings', marathiName: 'पीव्हीसी एल्बो आणि टी फिटिंग', category: 'pumps', categoryLabel: 'Pipes & Fittings', price: 120, unit: 'piece', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Fittings', fallbackIcon: 'fa-share-nodes', specs: { 'Price': 'Indicative starting price ₹120; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'PVC elbows, tees and connectors in assorted sizes.' },
  { id: 'pvc-coupler', name: 'PVC Couplers & Sockets', marathiName: 'पीव्हीसी कपलर आणि सॉकेट', category: 'pumps', categoryLabel: 'Pipes & Fittings', price: 100, unit: 'piece', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Fittings', fallbackIcon: 'fa-circle-notch', specs: { 'Price': 'Indicative starting price ₹100; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Pipe joining sockets and couplers; confirm diameter.' },
  { id: 'water-hose', name: 'Flexible Water Hose / Pipe', marathiName: 'लवचिक पाण्याची नळी', category: 'pumps', categoryLabel: 'Water & Irrigation', price: 350, unit: 'coil', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Irrigation', fallbackIcon: 'fa-water', specs: { 'Price': 'Indicative starting price ₹350; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Flexible hose and irrigation pipe in assorted sizes.' },
  { id: 'plastic-bucket', name: 'Plastic Buckets & Tubs', marathiName: 'प्लास्टिक बादल्या आणि टब', category: 'hardware', categoryLabel: 'Plastic Utility', price: 150, unit: 'piece', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Utility', fallbackIcon: 'fa-bucket', specs: { 'Price': 'Indicative starting price ₹150; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Plastic buckets and tubs in assorted capacities and colours.' },
  { id: 'tarpaulin', name: 'HDPE Tarpaulin Sheets', marathiName: 'एचडीपीई ताडपत्री', category: 'ropes', categoryLabel: 'Farm & Utility', price: 400, unit: 'piece', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Farm Utility', fallbackIcon: 'fa-sheet-plastic', specs: { 'Price': 'Indicative starting price ₹400; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Folded tarpaulin sheets; confirm dimensions, GSM and colour.' },
  { id: 'woven-sacks', name: 'Woven PP / HDPE Sacks', marathiName: 'पीपी / एचडीपीई पोती', category: 'ropes', categoryLabel: 'Farm & Utility', price: 100, unit: 'piece', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Farm Utility', fallbackIcon: 'fa-bag-shopping', specs: { 'Price': 'Indicative starting price ₹100; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Sacks and woven bags for storage and transport; confirm size and capacity.' },
  { id: 'agri-hose', name: 'Agricultural Spray / Delivery Hose', marathiName: 'शेती फवारणी / डिलिव्हरी होज', category: 'pumps', categoryLabel: 'Water & Irrigation', price: 380, unit: 'coil', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Irrigation', fallbackIcon: 'fa-water', specs: { 'Price': 'Indicative starting price ₹380; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Assorted hose stock; confirm pressure rating, diameter and use.' },
  { id: 'metal-pipe', name: 'Metal Pipes / Tubes', marathiName: 'लोखंडी पाईप आणि ट्यूब', category: 'hardware', categoryLabel: 'Metal Sections', price: 400, unit: 'length', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Hardware', fallbackIcon: 'fa-grip-lines', specs: { 'Price': 'Indicative starting price ₹400; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Metal pipe/tube stock; confirm material, thickness and length.' },
  { id: 'wooden-handles', name: 'Wooden Handles / Poles', marathiName: 'लाकडी दांडे', category: 'tools', categoryLabel: 'Tools & Accessories', price: 120, unit: 'piece', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Tools', fallbackIcon: 'fa-hammer', specs: { 'Price': 'Indicative starting price ₹120; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Wooden handles and poles visible in bundled stock; confirm dimensions.' },
  { id: 'hardware-assorted', name: 'General Hardware Accessories', marathiName: 'विविध हार्डवेअर साहित्य', category: 'tools', categoryLabel: 'Tools & Accessories', price: 150, unit: 'piece', rating: 0, reviews: 0, brand: 'Ask in store', badge: 'Hardware', fallbackIcon: 'fa-screwdriver-wrench', specs: { 'Price': 'Indicative starting price ₹150; confirm exact size and rate', 'Availability': 'Subject to current stock' }, description: 'Assorted shop hardware and accessories; send a photo or description for exact identification.' }
];

// -------------------------------------------------------------
// CART STATE MANAGEMENT
// -------------------------------------------------------------
let cart = [];

function loadCart() {
  try {
    const saved = localStorage.getItem('shankar_cart');
    if (saved) {
      cart = JSON.parse(saved);
      // Keep existing cart lines aligned with the latest catalog prices.
      cart = cart.map(item => {
        const currentProduct = PRODUCTS_DATA.find(product => product.id === item.id);
        return currentProduct ? { ...item, price: currentProduct.price, unit: currentProduct.unit, name: currentProduct.name } : item;
      });
    }
  } catch (e) {
    console.error('Failed to parse cart storage', e);
    cart = [];
  }
  updateCartUI();
}

function saveCart() {
  try {
    localStorage.setItem('shankar_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Failed to save cart', e);
  }
  updateCartUI();
}

function addToCart(productId, qty = 1) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: null,
      qty: qty
    });
  }

  saveCart();
  showToast(`Added "${product.name}" to Order List!`);
}

function updateCartQty(productId, delta) {
  const index = cart.findIndex(item => item.id === productId);
  if (index === -1) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
    showToast('Item removed from Order List');
  }
  saveCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  showToast('Item removed');
}

function clearCart() {
  if (cart.length === 0) return;
  if (confirm('Are you sure you want to clear your current order list?')) {
    cart = [];
    saveCart();
    showToast('Order List cleared');
  }
}

// -------------------------------------------------------------
// UI RENDERING FUNCTIONS
// -------------------------------------------------------------
let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'featured';
let isMarathi = false;

function renderCategoryPills() {
  const container = document.getElementById('categoryPillContainer');
  if (!container) return;

  const categories = [
    { id: 'pumps', name: 'Pipes & Irrigation', count: `${PRODUCTS_DATA.filter(p => p.category === 'pumps').length} Items`, icon: 'fa-water' },
    { id: 'tools', name: 'Tools & Accessories', count: `${PRODUCTS_DATA.filter(p => p.category === 'tools').length} Items`, icon: 'fa-screwdriver-wrench' },
    { id: 'hardware', name: 'Wire & General Hardware', count: `${PRODUCTS_DATA.filter(p => p.category === 'hardware').length} Items`, icon: 'fa-gears' },
    { id: 'ropes', name: 'Ropes, Chains & Farm Utility', count: `${PRODUCTS_DATA.filter(p => p.category === 'ropes').length} Items`, icon: 'fa-link' }
  ];

  container.innerHTML = categories.map(cat => `
    <div class="category-pill-card" onclick="filterByCategory('${cat.id}')">
      <div class="category-pill-icon"><i class="fa-solid ${cat.icon}"></i></div>
      <div class="category-pill-info">
        <h4>${cat.name}</h4>
        <span>${cat.count} Available • In Stock</span>
      </div>
    </div>
  `).join('');
}

function updateCategoryCounts() {
  const counts = {
    all: PRODUCTS_DATA.length,
    tools: PRODUCTS_DATA.filter(p => p.category === 'tools').length,
    pumps: PRODUCTS_DATA.filter(p => p.category === 'pumps').length,
    hardware: PRODUCTS_DATA.filter(p => p.category === 'hardware').length,
    ropes: PRODUCTS_DATA.filter(p => p.category === 'ropes').length
  };

  const countAll = document.getElementById('countAll');
  if (countAll) countAll.textContent = counts.all;
  const countTools = document.getElementById('countTools');
  if (countTools) countTools.textContent = counts.tools;
  const countPumps = document.getElementById('countPumps');
  if (countPumps) countPumps.textContent = counts.pumps;
  const countHardware = document.getElementById('countHardware');
  if (countHardware) countHardware.textContent = counts.hardware;
  const countRopes = document.getElementById('countRopes');
  if (countRopes) countRopes.textContent = counts.ropes;
}

function renderProductsGrid() {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResultsBox');
  const resultsCountText = document.getElementById('resultsCountText');
  const resetBtn = document.getElementById('resetFiltersBtn');

  if (!grid) return;

  // Filter
  let filtered = PRODUCTS_DATA.filter(prod => {
    const matchCat = activeCategory === 'all' || prod.category === activeCategory;
    const matchSearch = searchQuery === '' || 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.marathiName && prod.marathiName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  // Sort
  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Update Status
  if (resultsCountText) {
    resultsCountText.textContent = `Showing ${filtered.length} of ${PRODUCTS_DATA.length} products`;
  }
  if (resetBtn) {
    resetBtn.style.display = (activeCategory !== 'all' || searchQuery !== '') ? 'inline-flex' : 'none';
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }

  if (noResults) noResults.style.display = 'none';

  grid.innerHTML = filtered.map(prod => {
    const displayName = (isMarathi && prod.marathiName) ? prod.marathiName : prod.name;
    const badgeTagClass = `tag-${prod.category}`;
    const firstSpec = Object.entries(prod.specs)[0];
    const specSnippet = prod.description;

    return `
      <div class="product-card" data-id="${prod.id}">
        <div class="card-image-wrap">
          <div class="product-icon-art" aria-label="${prod.name}"><i class="fa-solid ${prod.fallbackIcon}"></i></div>
          <div class="badge-overlay-wrap">
            <span class="badge-tag ${badgeTagClass}">${prod.categoryLabel}</span>
            ${prod.badge ? `<span class="badge-tag" style="background:#0f172a; color:#fff;">${prod.badge}</span>` : ''}
          </div>
          <button class="quick-view-overlay-btn" onclick="openProductModal('${prod.id}')" title="Quick Specs">
            <i class="fa-solid fa-eye"></i> Specs
          </button>
        </div>

        <div class="card-body">
          <div class="card-meta-row">
            <span class="product-brand"><i class="fa-solid fa-award"></i> ${prod.brand}</span>
            <span class="product-rating">Stock enquiry</span>
          </div>

          <h3 class="product-name" title="${displayName}">${displayName}</h3>
          <p class="product-spec-snippet">${specSnippet}</p>

          <div class="card-price-row">
            <span class="price-inr">${prod.price > 0 ? `₹${prod.price.toLocaleString('en-IN')}` : 'Ask for Price'}</span>
            <span class="price-unit">/ ${prod.unit}</span>
          </div>

          <div class="card-actions-grid">
            <button class="btn-card-cart" onclick="addToCart('${prod.id}')">
              <i class="fa-solid fa-cart-plus"></i> Add to Order
            </button>
            <button class="btn-card-whatsapp" onclick="directProductWhatsApp('${prod.id}')" title="Enquire via WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> Enquire
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updateCartUI() {
  const badge = document.getElementById('cartCountBadge');
  const totalSummary = document.getElementById('cartTotalSummary');
  const drawerCount = document.getElementById('drawerItemCount');
  const drawerTotal = document.getElementById('cartDrawerTotal');
  const itemsContainer = document.getElementById('cartItemsContainer');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (badge) badge.textContent = totalItems;
  if (drawerCount) drawerCount.textContent = totalItems;
  const hasUnpricedItems = cart.some(item => !Number.isFinite(Number(item.price)) || Number(item.price) <= 0);
  const totalLabel = hasUnpricedItems ? 'Quote required' : `₹${totalPrice.toLocaleString('en-IN')}`;
  if (totalSummary) totalSummary.textContent = totalLabel;
  if (drawerTotal) drawerTotal.textContent = totalLabel;

  if (!itemsContainer) return;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-basket-shopping cart-empty-icon"></i>
        <h4>Your order list is empty</h4>
        <p>Browse our catalog and click "Add to Order" to build your hardware inquiry list.</p>
      </div>
    `;
    const checkoutBtn = document.getElementById('sendCartToWhatsAppBtn');
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  const checkoutBtn = document.getElementById('sendCartToWhatsAppBtn');
  if (checkoutBtn) checkoutBtn.disabled = false;

  itemsContainer.innerHTML = cart.map(item => `
    <div class="cart-item-row" data-id="${item.id}">
      <div class="cart-item-icon"><i class="fa-solid fa-box"></i></div>
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <span class="cart-item-price">${item.price > 0 ? `₹${item.price.toLocaleString('en-IN')}` : 'Price on request'} / ${item.unit}</span>
        <div class="cart-qty-stepper">
          <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)" aria-label="Decrease quantity">-</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart('${item.id}')" title="Remove Item">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `).join('');
}

// -------------------------------------------------------------
// DIRECT WHATSAPP INTEGRATION (Target: 7058729696)
// -------------------------------------------------------------

/**
 * Sends entire cart as formatted WhatsApp order
 */
function sendCartToWhatsApp() {
  if (cart.length === 0) {
    alert('Please add at least one hardware item to your order list before sending.');
    return;
  }

  const nameInput = document.getElementById('cartCustomerName');
  const locationInput = document.getElementById('cartCustomerLocation');
  const notesInput = document.getElementById('cartCustomerNotes');

  const customerName = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Customer';
  const customerLocation = locationInput && locationInput.value.trim() ? locationInput.value.trim() : 'Sonwadi / Maharashtra';
  const customerNotes = notesInput && notesInput.value.trim() ? notesInput.value.trim() : 'Standard dispatch';

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  let message = `🛒 *NEW ORDER - SHANKAR HARDWARE & AGRO TECH (SONWADI)*\n`;
  message += `--------------------------------------\n`;
  message += `👤 *Customer Name:* ${customerName}\n`;
  message += `📍 *Delivery Location:* ${customerLocation}\n`;
  message += `📝 *Notes:* ${customerNotes}\n\n`;
  message += `📦 *ITEMS ORDERED (${totalItems} items):*\n`;

  cart.forEach((item, idx) => {
    const lineTotal = Number(item.price) * item.qty;
    message += `${idx + 1}. *${item.name}*\n`;
    message += `   Qty: ${item.qty} ${item.unit} — ${item.price > 0 ? `₹${item.price.toLocaleString('en-IN')} (line total ₹${lineTotal.toLocaleString('en-IN')})` : 'Please quote current rate'}\n`;
  });

  message += `\n💰 *ESTIMATED TOTAL:* ${cart.some(item => !item.price) ? 'To be confirmed by store' : `₹${totalPrice.toLocaleString('en-IN')}`}\n`;
  message += `--------------------------------------\n`;
  message += `Please confirm availability, transport dispatch, and bank/UPI payment details. Thank you!`;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

/**
 * Single product direct WhatsApp inquiry
 */
function directProductWhatsApp(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  let message = `Hello Shankar Hardware (+91 7058729696),\n`;
  message += `I am interested in ordering this product:\n\n`;
  message += `🏷️ *Product:* ${product.name}\n`;
  message += `💵 *Price:* ${product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'Please quote current rate'} / ${product.unit}\n`;
  message += `🏭 *Brand:* ${product.brand}\n`;
  message += `📌 *Category:* ${product.categoryLabel}\n\n`;
  message += `Please share stock availability and delivery options to my location.`;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

// -------------------------------------------------------------
// PRODUCT QUICK VIEW MODAL
// -------------------------------------------------------------
function openProductModal(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('productModal');
  const backdrop = document.getElementById('productModalBackdrop');
  const content = document.getElementById('modalContentContainer');

  if (!modal || !content) return;

  const specsRows = Object.entries(product.specs).map(([key, val]) => `
    <tr>
      <td>${key}</td>
      <td><strong>${val}</strong></td>
    </tr>
  `).join('');

  content.innerHTML = `
    <div class="modal-image-col">
      <div class="product-icon-art product-modal-icon"><i class="fa-solid ${product.fallbackIcon}"></i></div>
    </div>
    <div class="modal-info-col">
      <span class="badge-tag tag-${product.category}" style="display:inline-block; margin-bottom:0.5rem;">${product.categoryLabel}</span>
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; margin-bottom:0.4rem; color:var(--dark);">${product.name}</h2>
      <div style="color:var(--amber-dark); font-size:0.85rem; font-weight:700; margin-bottom:0.75rem;">
        <i class="fa-solid fa-star"></i> Availability and price confirmed by store
      </div>
      <div style="font-size:1.6rem; font-weight:800; color:var(--primary-dark); font-family:var(--font-heading); margin-bottom:0.75rem;">
        ${product.price > 0 ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on request'} <span style="font-size:0.9rem; color:var(--slate-500); font-weight:500;">/ ${product.unit}</span>
      </div>
      <p style="font-size:0.9rem; color:var(--slate-600); line-height:1.5; margin-bottom:1rem;">${product.description}</p>
      
      <h4 style="font-size:0.875rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--slate-500); margin-bottom:0.25rem;">Technical Specifications:</h4>
      <table class="modal-specs-table">
        <tbody>
          ${specsRows}
        </tbody>
      </table>

      <div style="display:flex; gap:0.75rem; margin-top:1.5rem;">
        <button class="btn btn-primary" onclick="addToCart('${product.id}'); closeModal();" style="flex:1;">
          <i class="fa-solid fa-cart-plus"></i> Add to Order List
        </button>
        <button class="btn btn-whatsapp" onclick="directProductWhatsApp('${product.id}')" style="flex:1;">
          <i class="fa-brands fa-whatsapp"></i> Chat on WhatsApp
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('productModal');
  const backdrop = document.getElementById('productModalBackdrop');
  if (modal) modal.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
}

// -------------------------------------------------------------
// TOAST NOTIFICATIONS
// -------------------------------------------------------------
function showToast(text) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--amber-light);"></i> <span>${text}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// -------------------------------------------------------------
// EVENT LISTENERS & INITIALIZATION
// -------------------------------------------------------------
function filterByCategory(cat) {
  activeCategory = cat;
  
  // Update Tab States
  const tabs = document.querySelectorAll('.filter-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-category') === cat) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  renderProductsGrid();

  // Scroll to catalog if called from footer or pills
  const catalogSection = document.getElementById('catalog');
  if (catalogSection && window.scrollY < catalogSection.offsetTop - 150) {
    catalogSection.scrollIntoView({ behavior: 'smooth' });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Set Current Year in Footer
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Load Cart from Storage
  loadCart();

  // Render Components
  renderCategoryPills();
  updateCategoryCounts();
  renderProductsGrid();

  // Header Search Input
  const headerSearch = document.getElementById('headerSearchInput');
  const catalogSearch = document.getElementById('catalogSearchInput');
  const mobileSearch = document.getElementById('mobileSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');

  function syncSearch(val) {
    searchQuery = val;
    if (headerSearch) headerSearch.value = val;
    if (catalogSearch) catalogSearch.value = val;
    if (mobileSearch) mobileSearch.value = val;
    if (clearSearchBtn) clearSearchBtn.style.display = val ? 'block' : 'none';
    renderProductsGrid();
  }

  if (headerSearch) {
    headerSearch.addEventListener('input', (e) => syncSearch(e.target.value));
  }
  if (catalogSearch) {
    catalogSearch.addEventListener('input', (e) => syncSearch(e.target.value));
  }
  if (mobileSearch) {
    mobileSearch.addEventListener('input', (e) => syncSearch(e.target.value));
  }
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => syncSearch(''));
  }

  // Sort Select
  const sortSelect = document.getElementById('catalogSortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProductsGrid();
    });
  }

  // Category Filter Tabs
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      filterByCategory(cat);
    });
  });

  // Reset Filters Button
  const resetBtn = document.getElementById('resetFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      syncSearch('');
      filterByCategory('all');
    });
  }

  // Cart Drawer Open / Close
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');

  function toggleCart(open) {
    if (open) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (openCartBtn) openCartBtn.addEventListener('click', () => toggleCart(true));
  if (closeCartBtn) closeCartBtn.addEventListener('click', () => toggleCart(false));
  if (cartOverlay) cartOverlay.addEventListener('click', () => toggleCart(false));

  // Send Cart to WhatsApp
  const sendCartBtn = document.getElementById('sendCartToWhatsAppBtn');
  if (sendCartBtn) sendCartBtn.addEventListener('click', sendCartToWhatsApp);

  // Clear Cart Button
  const clearCartBtn = document.getElementById('clearCartBtn');
  if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

  // Modal Close
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalBackdrop = document.getElementById('productModalBackdrop');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Mobile Drawer Menu
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const closeMobileDrawer = document.getElementById('closeMobileDrawer');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => mobileDrawer.classList.add('open'));
  }
  if (closeMobileDrawer && mobileDrawer) {
    closeMobileDrawer.addEventListener('click', () => mobileDrawer.classList.remove('open'));
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });

  // Marathi / English Language Toggle
  const langToggleBtn = document.getElementById('langToggleBtn');
  const currentLangLabel = document.getElementById('currentLangLabel');
  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      isMarathi = !isMarathi;
      if (currentLangLabel) currentLangLabel.textContent = isMarathi ? 'English' : 'मराठी';
      renderProductsGrid();
      showToast(isMarathi ? 'मराठी भाषा सक्रिय केली' : 'Switched to English');
    });
  }

  // Hero Quick Quote Form -> Opens WhatsApp directly
  const heroForm = document.getElementById('heroQuickQuoteForm');
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('heroClientName').value.trim();
      const items = document.getElementById('heroItemsNeeded').value.trim();

      let msg = `Hello Shankar Hardware (+91 7058729696),\n`;
      msg += `My Name: *${name}*\n`;
      msg += `I need a quote/order for:\n*${items}*\n\n`;
      msg += `Please reply with availability and best rates.`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
      heroForm.reset();
    });
  }

  // Bulk Wholesale Inquiry Form -> Opens WhatsApp directly
  const bulkForm = document.getElementById('bulkInquiryForm');
  if (bulkForm) {
    bulkForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('bulkCustomerName').value.trim();
      const phone = document.getElementById('bulkCustomerPhone').value.trim();
      const cat = document.getElementById('bulkCategorySelect').value;
      const qty = document.getElementById('bulkEstimatedQty').value.trim();
      const loc = document.getElementById('bulkLocation').value.trim();

      let msg = `🏭 *WHOLESALE BULK INQUIRY - SHANKAR HARDWARE*\n`;
      msg += `--------------------------------------\n`;
      msg += `👤 *Client / Firm:* ${name}\n`;
      msg += `📞 *Phone:* ${phone}\n`;
      msg += `📍 *Site / Delivery Location:* ${loc}\n`;
      msg += `📦 *Category:* ${cat}\n`;
      msg += `📊 *Estimated Quantity:* ${qty}\n`;
      msg += `--------------------------------------\n`;
      msg += `Please provide your wholesale discount tier and GST quote.`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
      bulkForm.reset();
      showToast('Redirecting to WhatsApp with bulk inquiry...');
    });
  }

  // Main Contact Form -> Opens WhatsApp directly
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactFullName').value.trim();
      const phone = document.getElementById('contactPhoneNumber').value.trim();
      const loc = document.getElementById('contactLocation').value.trim();
      const subject = document.getElementById('contactSubject').value;
      const message = document.getElementById('contactMessage').value.trim();

      let msg = `📨 *NEW INQUIRY - SHANKAR HARDWARE*\n`;
      msg += `--------------------------------------\n`;
      msg += `👤 *Name:* ${name}\n`;
      msg += `📞 *Phone:* ${phone}\n`;
      msg += `📍 *Location:* ${loc || 'Not specified'}\n`;
      msg += `🏷️ *Category:* ${subject}\n`;
      msg += `💬 *Details:* ${message}\n`;
      msg += `--------------------------------------\n`;
      msg += `Sent via Shankar Hardware Web Portal`;

      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
      contactForm.reset();
      showToast('Opening WhatsApp with your inquiry...');
    });
  }
});


/* ==========================================
   DEVELOPMENT ANNOUNCEMENT POPUP
========================================== */

(function () {

    function initializeDevelopmentPopup() {

        const popup = document.getElementById("developmentPopup");
        const closeBtn = document.getElementById("closeDevelopmentPopup");

        // Check whether popup elements exist
        if (!popup || !closeBtn) {
            console.error("Development popup elements not found.");
            return;
        }

        // Check whether announcement was already closed
        const noticeShown =
            sessionStorage.getItem("developmentNoticeShown") === "true";

        if (noticeShown) {

            popup.style.display = "none";
            document.body.style.overflow = "";

        } else {

            // Display popup and lock background scrolling
            popup.style.display = "flex";
            document.body.style.overflow = "hidden";

        }

        // Close announcement popup
        closeBtn.addEventListener("click", function (event) {

            event.preventDefault();

            popup.style.display = "none";

            // Restore homepage scrolling
            document.body.style.overflow = "";

            // Remember dismissal for current session
            sessionStorage.setItem(
                "developmentNoticeShown",
                "true"
            );

        });

    }

    // Initialize after DOM is ready
    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeDevelopmentPopup
        );

    } else {

        initializeDevelopmentPopup();

    }

})();
