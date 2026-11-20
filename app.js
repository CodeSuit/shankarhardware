/**
 * SHANKAR HARDWARE & AGRO TECH - CORE APPLICATION SCRIPT
 * Direct WhatsApp Ordering System (+91 7058729696)
 * Sonwadi, Pune District, Maharashtra
 */

// Target Business Phone / WhatsApp Number
const WHATSAPP_NUMBER = '917058729696';

// -------------------------------------------------------------
// PRODUCT CATALOG DATABASE
// Includes verified high-res images, categories, brands & specs
// -------------------------------------------------------------
const PRODUCTS_DATA = [
  {
    id: 'prod-1',
    name: 'Drop Forged Claw Hammer',
    marathiName: 'ड्रॉप फोर्जब स्टील हातोडी (क्लॉ हॅमर)',
    category: 'tools',
    categoryLabel: 'Hand Tools',
    price: 350,
    unit: 'piece',
    rating: 4.8,
    reviews: 42,
    brand: 'Taparia / Inder',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-hammer',
    specs: {
      'Head Material': 'High Carbon Forged Steel',
      'Handle': 'Shock-Absorbing Fiberglass Grip',
      'Weight': '450g / 16 oz',
      'Usage': 'Carpentry, Civil, Farm Repair'
    },
    description: 'Heavy-duty claw hammer forged from hardened carbon steel. Built with ergonomic anti-slip rubber grip for vibration absorption.'
  },
  {
    id: 'prod-2',
    name: '750W Heavy Duty Impact Drill',
    marathiName: '७५० वॅट हेवी ड्युटी इम्पॅक्ट ड्रिल मशीन',
    category: 'tools',
    categoryLabel: 'Power Tools',
    price: 2850,
    unit: 'piece',
    rating: 4.9,
    reviews: 68,
    brand: 'Bosch / Dongcheng',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-screwdriver-wrench',
    specs: {
      'Power Input': '750 Watts Copper Motor',
      'Chuck Capacity': '13 mm Keyed Chuck',
      'No-Load Speed': '0 - 2,800 RPM',
      'Modes': 'Drilling & Hammer Drilling'
    },
    description: 'High performance variable speed impact drill suitable for masonry, wood, steel drilling and farm workshop installations.'
  },
  {
    id: 'prod-3',
    name: 'Masonry Trowel (Heavy Construction)',
    marathiName: 'गवंडी काम थापी (मेसनरी ट्रोवेल)',
    category: 'tools',
    categoryLabel: 'Civil Tools',
    price: 220,
    unit: 'piece',
    rating: 4.5,
    reviews: 29,
    brand: 'Shankar Pro',
    badge: 'Durable',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-trowel',
    specs: {
      'Blade Material': 'Tempered Spring Steel',
      'Blade Size': '7 Inch London Pattern',
      'Handle': 'Ergonomic Seasoned Wood Handle',
      'Application': 'Bricklaying, Plastering, Pointing'
    },
    description: 'Precision balanced bricklaying trowel with welded shank and rust-resistant polished steel blade.'
  },
  {
    id: 'prod-4',
    name: 'Adjustable Pipe Wrench 14"',
    marathiName: '१४ इंच ॲडजस्टेबल पाईप पाना (रेंच)',
    category: 'tools',
    categoryLabel: 'Plumbing Tools',
    price: 650,
    unit: 'piece',
    rating: 4.7,
    reviews: 51,
    brand: 'Taparia / Eastman',
    badge: 'Plumber Favorite',
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-wrench',
    specs: {
      'Size': '14 Inch (350mm)',
      'Pipe Capacity': 'Up to 50mm (2")',
      'Jaw Material': 'Drop Forged Alloy Steel',
      'Body': 'Heavy Duty Ductile Iron'
    },
    description: 'Hardened self-cleaning serrated jaws for tight grip on borewell pipes, GI fittings, and irrigation joints without slippage.'
  },
  {
    id: 'prod-5',
    name: '2HP Submersible Farming Pump (10-Stage)',
    marathiName: '२ एचपी सबमर्सिबल शेती बोरवेल पंप',
    category: 'pumps',
    categoryLabel: 'Pumps & Motors',
    price: 14500,
    unit: 'unit',
    rating: 4.8,
    reviews: 84,
    brand: 'Kirloskar / Crompton',
    badge: 'Farmer First',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-water',
    specs: {
      'Horsepower': '2.0 HP (1.5 kW)',
      'Borewell Size': '100mm (4 Inch)',
      'Discharge Head': 'Up to 240 Feet',
      'Winding': '100% Electrolytic Grade Copper'
    },
    description: 'High-head agricultural water-filled submersible pump engineered for Indian borewell conditions with low voltage running capability.'
  },
  {
    id: 'prod-6',
    name: 'Brass Pump Impeller Spare (Original)',
    marathiName: 'ओरिजनल पितळी पंप इम्पेलर स्पेअर',
    category: 'pumps',
    categoryLabel: 'Pump Spares',
    price: 850,
    unit: 'piece',
    rating: 4.4,
    reviews: 33,
    brand: 'Apex / Genuine OEM',
    badge: 'Genuine Spare',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-gear',
    specs: {
      'Material': 'High-Grade Gunmetal / Brass',
      'Vane Design': 'Enclosed Radial Flow',
      'Compatibility': '1.5HP to 3HP Openwell & Submersible',
      'Corrosion Resistance': 'High Salinity & Sand Resistant'
    },
    description: 'CNC machined dynamically balanced brass impeller for maximum water discharge and minimal motor power consumption.'
  },
  {
    id: 'prod-7',
    name: 'Irrigation PVC Ball Valve 2" (Heavy)',
    marathiName: '२ इंच हेवी इरिगेशन पीव्हीसी बॉल व्हॉल्व्ह',
    category: 'pumps',
    categoryLabel: 'Plumbing & Valves',
    price: 320,
    unit: 'piece',
    rating: 4.6,
    reviews: 47,
    brand: 'Supreme / Finolex',
    badge: 'Drip Ready',
    image: 'https://images.unsplash.com/photo-1607400201515-c2c41c07d307?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-faucet-drip',
    specs: {
      'Diameter': '2 Inch (50mm)',
      'Pressure Rating': '10 kg/cm² (PN 10)',
      'End Connection': 'Solvent Cement Socket',
      'Seal': 'PTFE / EPDM Leakproof Ring'
    },
    description: 'UV stabilized agricultural drip irrigation shut-off ball valve with smooth turning torque and zero pressure loss.'
  },
  {
    id: 'prod-8',
    name: 'Galvanized Wood Screws (Box of 500)',
    marathiName: 'गॅल्व्हनाईज्ड लाकूड स्क्रू बॉक्स (५०० नग)',
    category: 'hardware',
    categoryLabel: 'Fasteners',
    price: 450,
    unit: 'box',
    rating: 4.7,
    reviews: 38,
    brand: 'Hilti / Star',
    badge: 'Anti-Rust',
    image: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-screw',
    specs: {
      'Size Range': '1.5" to 3" Assorted / Specific',
      'Coating': 'Electro-Galvanized Zinc Plated',
      'Drive Type': 'Deep Cross Phillips Drive',
      'Quantity': '500 Pcs per pack'
    },
    description: 'Sharp self-tapping thread design for rapid bite into hardwood, ply boards, farm sheds, and PVC sheets without splitting.'
  },
  {
    id: 'prod-9',
    name: 'High-Tensile Grade 8.8 Nut & Bolt',
    marathiName: 'हाय-टेन्साईल ग्रेड ८.८ नट-बोल्ट (किलोवर)',
    category: 'hardware',
    categoryLabel: 'Fasteners',
    price: 180,
    unit: 'kg',
    rating: 4.9,
    reviews: 95,
    brand: 'Unbrako / TVS Fasteners',
    badge: 'Contractor Special',
    image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-gears',
    specs: {
      'Grade': 'Grade 8.8 High Strength',
      'Finish': 'Black Oxide / Yellow Passivated',
      'Thread': 'Metric Coarse ISO Standards',
      'Sale Unit': 'Sold per kg with digital scale'
    },
    description: 'Heavy machinery and tractor implement bolts with certified 800 MPa tensile strength. High vibration shear resistance.'
  },
  {
    id: 'prod-10',
    name: 'Stainless Steel SS-304 Washers (100 Pcs)',
    marathiName: 'एसएस-३०४ स्टेनलेस स्टील वॉशर पॅक',
    category: 'hardware',
    categoryLabel: 'Fasteners',
    price: 120,
    unit: 'pack',
    rating: 4.5,
    reviews: 26,
    brand: 'Precision SS',
    badge: 'Marine Grade',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-circle-dot',
    specs: {
      'Material': 'Grade 304 Stainless Steel',
      'Standard': 'DIN 125 Flat & Spring',
      'Sizes': 'M6, M8, M10, M12 Available',
      'Resistance': '100% Rust-proof in water/chemical'
    },
    description: 'Anti-corrosive stainless steel plain and spring washers for borewell flanges, chemical sprayers, and farm trailers.'
  },
  {
    id: 'prod-11',
    name: 'Heavy Duty Nylon Braided Rope (50m Coil)',
    marathiName: 'नायलॉन ब्रेडेड मजबूत दोरी (५० मीटर)',
    category: 'ropes',
    categoryLabel: 'Ropes & Farm',
    price: 650,
    unit: 'coil',
    rating: 4.6,
    reviews: 41,
    brand: 'Garware / Supreme',
    badge: 'Tough Grade',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-link',
    specs: {
      'Diameter': '12 mm High Density',
      'Length': '50 Meters Bundle',
      'Breaking Load': '1,450 kgf',
      'Weathering': 'UV & Abrasion Protected'
    },
    description: 'Multi-strand twisted virgin nylon rope designed for borewell motor suspension, cattle tie, and sugarcane transport.'
  },
  {
    id: 'prod-12',
    name: 'Galvanized Iron Animal & Tow Chain (10ft)',
    marathiName: 'गॅल्व्हनाईज्ड लोखंडी जनावरांची साखळी (१० फूट)',
    category: 'ropes',
    categoryLabel: 'Ropes & Chains',
    price: 950,
    unit: 'piece',
    rating: 4.8,
    reviews: 57,
    brand: 'Shankar Forge',
    badge: 'Heavy Gauge',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-link',
    specs: {
      'Gauge': '8 mm Link Thickness',
      'Length': '10 Feet with Forged Hooks',
      'Plating': 'Hot-Dip Galvanized Anti-Corrosion',
      'Strength': 'Tested for Bull & Tractor Hauling'
    },
    description: 'Solid welded high-durability iron chain with swivel rings to prevent twisting and knotting during dairy and field use.'
  },
  {
    id: 'prod-13',
    name: '4-Inch Angle Grinder 850W (Metal/Tile Cutter)',
    marathiName: '४ इंच ॲंगल ग्राइंडर ८५० वॅट',
    category: 'tools',
    categoryLabel: 'Power Tools',
    price: 2450,
    unit: 'piece',
    rating: 4.8,
    reviews: 36,
    brand: 'Dongcheng / Stanley',
    badge: 'Workshop Essential',
    image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-screwdriver-wrench',
    specs: {
      'Power': '850 Watts High Torque',
      'Wheel Diameter': '100 mm (4 Inch)',
      'Speed': '11,000 RPM',
      'Spindle Thread': 'M10'
    },
    description: 'Compact metal fabrication grinder for cutting rebar, stone, farm implements, and smoothing welding seams.'
  },
  {
    id: 'prod-14',
    name: '1HP Openwell Agricultural Monoblock Pump',
    marathiName: '१ एचपी ओपनवेल शेती मोनोब्लॉक पंप',
    category: 'pumps',
    categoryLabel: 'Pumps & Motors',
    price: 7800,
    unit: 'unit',
    rating: 4.7,
    reviews: 49,
    brand: 'Crompton / Kirloskar',
    badge: 'High Discharge',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    fallbackIcon: 'fa-water',
    specs: {
      'Power': '1.0 HP Single Phase',
      'Head Range': '6 to 28 Meters',
      'Discharge': 'Up to 350 Litres / Min',
      'Impeller': 'Corrosion Resistant Gunmetal'
    },
    description: 'Reliable water pump for open farm wells, rivers, and canal lifting. Designed with heavy duty cast iron casing.'
  }
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
      image: product.image,
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
    { id: 'pumps', name: 'Water Pumps & Spares', count: '4 Items', icon: 'fa-water' },
    { id: 'tools', name: 'Hand & Power Tools', count: '5 Items', icon: 'fa-screwdriver-wrench' },
    { id: 'hardware', name: 'Nuts, Bolts & Fasteners', count: '3 Items', icon: 'fa-gears' },
    { id: 'ropes', name: 'Ropes & Heavy Chains', count: '2 Items', icon: 'fa-link' }
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
    const specSnippet = firstSpec ? `${firstSpec[0]}: <strong>${firstSpec[1]}</strong>` : prod.description.slice(0, 60) + '...';

    return `
      <div class="product-card" data-id="${prod.id}">
        <div class="card-image-wrap">
          <img src="${prod.image}" alt="${prod.name}" class="product-thumbnail" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';" />
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
            <span class="product-rating"><i class="fa-solid fa-star"></i> ${prod.rating} (${prod.reviews})</span>
          </div>

          <h3 class="product-name" title="${displayName}">${displayName}</h3>
          <p class="product-spec-snippet">${specSnippet}</p>

          <div class="card-price-row">
            <span class="price-inr">₹${prod.price.toLocaleString('en-IN')}</span>
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
  if (totalSummary) totalSummary.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;
  if (drawerTotal) drawerTotal.textContent = `₹${totalPrice.toLocaleString('en-IN')}`;

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
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=120&q=80';" />
      <div class="cart-item-details">
        <h4 class="cart-item-title">${item.name}</h4>
        <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')} / ${item.unit}</span>
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
    const lineTotal = item.price * item.qty;
    message += `${idx + 1}. *${item.name}*\n`;
    message += `   Qty: ${item.qty} ${item.unit} × ₹${item.price.toLocaleString('en-IN')} = ₹${lineTotal.toLocaleString('en-IN')}\n`;
  });

  message += `\n💰 *ESTIMATED TOTAL:* ₹${totalPrice.toLocaleString('en-IN')}\n`;
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
  message += `💵 *Price:* ₹${product.price.toLocaleString('en-IN')} / ${product.unit}\n`;
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
      <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';" />
    </div>
    <div class="modal-info-col">
      <span class="badge-tag tag-${product.category}" style="display:inline-block; margin-bottom:0.5rem;">${product.categoryLabel}</span>
      <h2 style="font-family:var(--font-heading); font-size:1.5rem; margin-bottom:0.4rem; color:var(--dark);">${product.name}</h2>
      <div style="color:var(--amber-dark); font-size:0.85rem; font-weight:700; margin-bottom:0.75rem;">
        <i class="fa-solid fa-star"></i> ${product.rating} / 5.0 (${product.reviews} customer ratings)
      </div>
      <div style="font-size:1.6rem; font-weight:800; color:var(--primary-dark); font-family:var(--font-heading); margin-bottom:0.75rem;">
        ₹${product.price.toLocaleString('en-IN')} <span style="font-size:0.9rem; color:var(--slate-500); font-weight:500;">/ ${product.unit}</span>
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
