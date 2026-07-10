(() => {
  "use strict";

  /* ——— Configura tu negocio ——— */
  const WHATSAPP_NUMBER = "56940319117"; // +56 9 4031 9117
  const WHATSAPP_GREETING =
    "¡Hola El Suricano! Quiero hacer un pedido 🌯";
  const BUSINESS = {
    name: "El Suricano",
    // Cuando tengas dominio real, ponlo aquí (ej: https://elsuricano.cl)
    siteUrl: "",
    // Dirección pública (aparece en contacto y SEO)
    address: "Av. Principal 123, tu ciudad",
  };

  const IMG = "img_carta";

  const MENU = [
    {
      id: "suricano-x2",
      name: "Suricano x2",
      desc: "Carne, salsas queso cheddar y sour, lechuga y tomate. (Solo por par)",
      price: 8000,
      category: "solo",
      tag: "Firma",
      tagStyle: "",
      heat: 2,
      image: `${IMG}/burritos_suricano_x2.webp`,
      featured: true,
      spotlight: true,
      spotlightLabel: "El de la casa",
    },
    {
      id: "chicken-x2",
      name: "Chicken x2",
      desc: "Pollo, cebolla, salsas queso cheddar y sour, lechuga y tomate. (Solo por par)",
      price: 8000,
      category: "solo",
      tag: "Pollo",
      tagStyle: "is-fresh",
      heat: 1,
      image: `${IMG}/burritos_chicken_x2.webp`,
      featured: false,
    },
    {
      id: "frijolero-x2",
      name: "Frijolero x2",
      desc: "Frijol negro, cebolla morada, queso mantecoso, (ají infierno opcional), sour, cheddar, tomate y lechuga. (Solo por par)",
      price: 8000,
      category: "solo",
      tag: "Veggie",
      tagStyle: "is-fresh",
      heat: 2,
      image: `${IMG}/burritos_frijolero_x2.webp`,
      featured: false,
    },
    {
      id: "champipollo-x2",
      name: "Champipollo x2",
      desc: "Champiñón, pollo, cebolla, salsas cheddar y sour, lechuga y tomate. (Solo por par)",
      price: 8500,
      category: "solo",
      tag: "Mix",
      tagStyle: "",
      heat: 1,
      image: `${IMG}/burritos_champipollo_x2.webp`,
      featured: true,
    },
    {
      id: "wey-x2",
      name: "Burrito Wey x2",
      desc: "Carne, frijol negro, cebolla morada, pimentón verde, choclo, tomate, lechuga, sour, cheddar, ajonesa y (ají infierno opcional). (Solo por par)",
      price: 9000,
      category: "solo",
      tag: "Loaded",
      tagStyle: "is-hot",
      heat: 3,
      image: `${IMG}/burritos_wey_x2.webp`,
      featured: true,
      spotlight: true,
      spotlightLabel: "El más completo",
    },
    {
      id: "guacamole-x2",
      name: "Burrito Guacamole x2",
      desc: "1 proteína (carne/frijol/pollo/champiñón), cebolla morada, pimentón verde, choclo, guacamole, (jalapeño opcional), sour, cheddar y lechuga. (Solo por par)",
      price: 9500,
      category: "solo",
      tag: "Guac",
      tagStyle: "is-fresh",
      heat: 2,
      image: `${IMG}/burritos_guacamole_x2.webp`,
      featured: false,
    },
    {
      id: "guacamole-mixto-x2",
      name: "Burrito Guacamole Mixto x2",
      desc: "2 proteínas, cebolla morada, pimentón verde, choclo, guacamole, (jalapeño opcional), sour, cheddar y lechuga. (Solo por par)",
      price: 10000,
      category: "solo",
      tag: "Top",
      tagStyle: "is-hot",
      heat: 2,
      image: `${IMG}/burritos_guacamole_mixto_x2.webp`,
      featured: true,
      spotlight: true,
      spotlightLabel: "El más pedido",
    },
    {
      id: "suricano-papas",
      name: "Suricano x2 + Papas",
      desc: "Carne, salsas cheddar y sour, lechuga y tomate + papas fritas. (Solo por par)",
      price: 9000,
      category: "papas",
      tag: "Combo",
      tagStyle: "",
      heat: 2,
      image: `${IMG}/burritos_papas_suricano_x2.webp`,
      featured: true,
    },
    {
      id: "chicken-papas",
      name: "Chicken x2 + Papas",
      desc: "Pollo, cebolla, salsas cheddar y sour, lechuga y tomate + papas fritas. (Solo por par)",
      price: 9000,
      category: "papas",
      tag: "Combo",
      tagStyle: "is-fresh",
      heat: 1,
      image: `${IMG}/burritos_papas_chicken_x2.webp`,
      featured: false,
    },
    {
      id: "frijolero-papas",
      name: "Frijolero x2 + Papas",
      desc: "Frijol negro, cebolla morada, queso mantecoso, (ají infierno opcional), sour, cheddar, tomate y lechuga + papas fritas. (Solo por par)",
      price: 9000,
      category: "papas",
      tag: "Combo",
      tagStyle: "is-fresh",
      heat: 2,
      image: `${IMG}/burritos_papas_frijolero_x2.webp`,
      featured: false,
    },
    {
      id: "champipollo-papas",
      name: "Champipollo x2 + Papas",
      desc: "Champiñón, pollo, cebolla, salsas cheddar y sour, lechuga y tomate + papas fritas. (Solo por par)",
      price: 10000,
      category: "papas",
      tag: "Combo",
      tagStyle: "",
      heat: 1,
      image: `${IMG}/burritos_papas_champipollo_x2.webp`,
      featured: false,
    },
    {
      id: "wey-papas",
      name: "Burrito Wey x2 + Papas",
      desc: "Carne, frijol negro, cebolla morada, pimentón verde, choclo, tomate, lechuga, sour, cheddar, ajonesa y (ají infierno opcional) + papas fritas. (Solo por par)",
      price: 11000,
      category: "papas",
      tag: "Combo",
      tagStyle: "is-hot",
      heat: 3,
      image: `${IMG}/burritos_papas_wey_x2.webp`,
      featured: true,
    },
    {
      id: "guacamole-papas",
      name: "Burrito Guacamole x2 + Papas",
      desc: "1 proteína, cebolla morada, pimentón verde, choclo, guacamole, (jalapeño opcional), sour, cheddar y lechuga + papas fritas. (Solo por par)",
      price: 12000,
      category: "papas",
      tag: "Combo",
      tagStyle: "is-fresh",
      heat: 2,
      image: `${IMG}/burritos_papas_guacamole_x2.webp`,
      featured: false,
    },
    {
      id: "guacamole-mixto-papas",
      name: "Burrito Guacamole Mixto x2 + Papas",
      desc: "2 proteínas, cebolla morada, pimentón verde, choclo, guacamole, (jalapeño opcional), sour, cheddar y lechuga + papas fritas. (Solo por par)",
      price: 13000,
      category: "papas",
      tag: "Combo",
      tagStyle: "is-hot",
      heat: 2,
      image: `${IMG}/burritos_guacamole_mixto_x2.webp`,
      featured: true,
    },
  ];

  const FILTER_META = {
    todos: { title: "Burritos", sub: "14 productos" },
    solo: { title: "Solo burrito", sub: "7 productos" },
    papas: { title: "Con papas", sub: "7 productos" },
  };

  const state = {
    cart: new Map(),
    filter: "todos",
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const formatPrice = (n) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(n);

  const waUrl = (text) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  const menuGrid = $("#menuGrid");
  const spotlight = $("#spotlight");
  const menuHeading = $("#menuHeading");
  const menuSubheading = $("#menuSubheading");
  const orderList = $("#orderList");
  const orderEmpty = $("#orderEmpty");
  const orderFooter = $("#orderFooter");
  const orderTotal = $("#orderTotal");
  const cartFloat = $("#cartFloat");
  const cartFloatCount = $("#cartFloatCount");
  const cartFloatTotal = $("#cartFloatTotal");
  const cartDrawer = $("#cartDrawer");
  const cartBackdrop = $("#cartBackdrop");
  const cartClose = $("#cartClose");
  const toast = $("#toast");
  const toastMsg = $("#toastMsg");
  const toastAction = $("#toastAction");
  const waFloat = $("#waFloat");
  const contactWaLink = $("#contactWaLink");
  const header = $("#header");
  const nav = $("#nav");
  const navToggle = $("#navToggle");
  const heroOrderCta = $("#heroOrderCta");
  let lastFocus = null;
  let cartPopTimer = null;

  function initWhatsAppLinks() {
    const base = waUrl(WHATSAPP_GREETING);
    waFloat.href = base;
    contactWaLink.href = base;
    contactWaLink.textContent = formatPhone(WHATSAPP_NUMBER);

    const addressEl = $("#contactAddress");
    if (addressEl && BUSINESS.address) {
      addressEl.textContent = BUSINESS.address;
    }

    // Enriquecer JSON-LD con teléfono cuando el número real esté configurado
    const ld = document.querySelector('script[type="application/ld+json"]');
    if (ld && WHATSAPP_NUMBER && !WHATSAPP_NUMBER.includes("12345678")) {
      try {
        const data = JSON.parse(ld.textContent);
        data.telephone = `+${WHATSAPP_NUMBER}`;
        if (BUSINESS.siteUrl) {
          data.url = BUSINESS.siteUrl;
          data.image = new URL("assets/logo-circle.png", BUSINESS.siteUrl).href;
        }
        if (BUSINESS.address) {
          data.address = {
            "@type": "PostalAddress",
            streetAddress: BUSINESS.address,
            addressCountry: "CL",
          };
        }
        ld.textContent = JSON.stringify(data);
      } catch (_) {
        /* ignore */
      }
    }
  }

  function formatPhone(num) {
    if (num.startsWith("56") && num.length >= 11) {
      return `+${num.slice(0, 2)} ${num.slice(2, 3)} ${num.slice(3, 7)} ${num.slice(7)}`;
    }
    return `+${num}`;
  }

  function heatBars(level) {
    return [1, 2, 3]
      .map((i) => `<span class="${i <= level ? "is-on" : ""}"></span>`)
      .join("");
  }

  function renderSpotlight() {
    const hits = MENU.filter((m) => m.spotlight);
    spotlight.innerHTML = hits
      .map(
        (item) => `
      <article class="spot-card">
        <div class="spot-visual">
          <img src="${item.image}" alt="${item.name}" loading="lazy" width="640" height="480" />
          <div class="spot-steam" aria-hidden="true"><i></i><i></i><i></i></div>
        </div>
        <div class="spot-body">
          <span class="spot-badge">${item.spotlightLabel}</span>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <div class="spot-foot">
            <span class="spot-price">${formatPrice(item.price)}</span>
            <button type="button" class="spot-add" data-add="${item.id}">Lo quiero</button>
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  function renderMenu() {
    menuGrid.innerHTML = MENU.map(
      (item, i) => `
      <article
        class="menu-card${item.featured ? " is-featured" : ""}"
        data-category="${item.category}"
        data-id="${item.id}"
        style="transition-delay: ${i * 30}ms"
      >
        <div class="menu-plate">
          <img class="menu-photo" src="${item.image}" alt="${item.name}" loading="lazy" width="480" height="360" />
          <span class="menu-price-stamp">${formatPrice(item.price)}</span>
          ${
            item.heat > 0
              ? `<div class="menu-heat" title="Nivel de picante" aria-label="Picante ${item.heat} de 3">${heatBars(item.heat)}</div>`
              : ""
          }
        </div>
        <div class="menu-body">
          <span class="menu-tag ${item.tagStyle}">${item.tag}</span>
          <h3>${item.name}</h3>
          <p>${item.desc}</p>
          <div class="menu-actions">
            <div class="menu-qty" data-qty-for="${item.id}">
              <button type="button" class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Quitar uno">−</button>
              <span class="qty-val" data-qty="${item.id}">0</span>
              <button type="button" class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Agregar uno">+</button>
            </div>
            <button type="button" class="btn-add" data-add="${item.id}">Agregar</button>
          </div>
        </div>
      </article>`
    ).join("");

    requestAnimationFrame(() => {
      $$(".menu-card").forEach((card) => card.classList.add("is-visible"));
    });

    applyFilter(state.filter);
    syncQtyUI();
  }

  function applyFilter(filter) {
    state.filter = filter;
    $$(".filter-btn").forEach((btn) => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    const meta = FILTER_META[filter] || FILTER_META.todos;
    menuHeading.textContent = meta.title;
    menuSubheading.textContent = meta.sub;

    spotlight.hidden = filter !== "todos";

    $$(".menu-card").forEach((card) => {
      const show = filter === "todos" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !show);
    });
  }

  function getQty(id) {
    return state.cart.get(id) || 0;
  }

  function setQty(id, qty) {
    if (qty <= 0) state.cart.delete(id);
    else state.cart.set(id, qty);
    syncQtyUI();
    renderOrder();
    updateTray();
  }

  function addOne(id) {
    setQty(id, getQty(id) + 1);
    const item = MENU.find((m) => m.id === id);
    showToast(`${item.name} al pedido`, { action: true });
    popCartFloat();
    $$(`[data-add="${id}"]`).forEach((btn) => {
      btn.classList.add("is-added");
      btn.textContent = "Listo ✓";
      setTimeout(() => {
        btn.classList.remove("is-added");
        const qty = getQty(id);
        if (btn.classList.contains("spot-add") || btn.textContent.includes("quiero")) {
          btn.textContent = qty > 0 ? "Otro más" : "Lo quiero";
        } else {
          btn.textContent = qty > 0 ? "Agregar otro" : "Agregar";
        }
      }, 1100);
    });
  }

  function syncQtyUI() {
    MENU.forEach((item) => {
      const qty = getQty(item.id);
      $$(`[data-qty="${item.id}"]`).forEach((el) => {
        el.textContent = String(qty);
      });
      $$(`[data-id="${item.id}"].menu-card, .menu-card[data-id="${item.id}"]`).forEach((card) => {
        card.classList.toggle("is-in-cart", qty > 0);
      });
      $$(`[data-add="${item.id}"]`).forEach((btn) => {
        if (btn.classList.contains("is-added")) return;
        if (btn.classList.contains("spot-add") || /quiero|Otro/i.test(btn.textContent)) {
          btn.textContent = qty > 0 ? "Otro más" : "Lo quiero";
        } else {
          btn.textContent = qty > 0 ? "Agregar otro" : "Agregar";
        }
      });
    });
  }

  function cartEntries() {
    return [...state.cart.entries()]
      .map(([id, qty]) => {
        const item = MENU.find((m) => m.id === id);
        return item ? { ...item, qty, subtotal: item.price * qty } : null;
      })
      .filter(Boolean);
  }

  function cartTotal() {
    return cartEntries().reduce((s, e) => s + e.subtotal, 0);
  }

  function cartCount() {
    return cartEntries().reduce((s, e) => s + e.qty, 0);
  }

  function renderOrder() {
    const entries = cartEntries();
    const empty = entries.length === 0;

    orderEmpty.hidden = !empty;
    orderFooter.hidden = empty;
    orderList.innerHTML = entries
      .map(
        (e) => `
      <li class="order-item">
        <span class="order-item-name">${e.name}</span>
        <span class="order-item-price">${formatPrice(e.subtotal)}</span>
        <span class="order-item-meta">${formatPrice(e.price)} c/u</span>
        <div class="order-item-actions">
          <button type="button" class="qty-btn" data-action="dec" data-id="${e.id}" aria-label="Quitar uno">−</button>
          <span class="qty-val">${e.qty}</span>
          <button type="button" class="qty-btn" data-action="inc" data-id="${e.id}" aria-label="Agregar uno">+</button>
          <button type="button" class="qty-btn qty-remove" data-action="remove" data-id="${e.id}" aria-label="Eliminar">Quitar</button>
        </div>
      </li>`
      )
      .join("");

    orderTotal.textContent = formatPrice(cartTotal());
  }

  function openCart() {
    lastFocus = document.activeElement;
    cartBackdrop.hidden = false;
    requestAnimationFrame(() => {
      cartBackdrop.classList.add("is-open");
      cartDrawer.classList.add("is-open");
    });
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    cartClose.focus();
  }

  function closeCart() {
    cartBackdrop.classList.remove("is-open");
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setTimeout(() => {
      if (!cartDrawer.classList.contains("is-open")) {
        cartBackdrop.hidden = true;
      }
    }, 400);
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function popCartFloat() {
    cartFloat.classList.remove("is-pop");
    void cartFloat.offsetWidth;
    cartFloat.classList.add("is-pop");
    clearTimeout(cartPopTimer);
    cartPopTimer = setTimeout(() => cartFloat.classList.remove("is-pop"), 560);
  }

  function updateTray() {
    const count = cartCount();
    const total = cartTotal();
    cartFloatCount.textContent = String(count);
    cartFloatTotal.textContent = formatPrice(total);

    if (count > 0) {
      cartFloat.hidden = false;
      cartFloat.classList.add("is-active");
      cartFloat.setAttribute(
        "aria-label",
        `Ver pedido · ${count} producto${count === 1 ? "" : "s"} · ${formatPrice(total)}`
      );
      document.body.classList.add("has-cart");
    } else {
      cartFloat.classList.remove("is-active");
      document.body.classList.remove("has-cart");
      setTimeout(() => {
        if (cartCount() === 0) cartFloat.hidden = true;
      }, 300);
    }
  }

  function buildWhatsAppMessage() {
    const entries = cartEntries();
    if (!entries.length) return WHATSAPP_GREETING;

    return [
      "¡Hola El Suricano! Quiero este pedido:",
      "",
      ...entries.map(
        (e) => `• ${e.qty}x ${e.name} — ${formatPrice(e.subtotal)}`
      ),
      "",
      `*Total estimado: ${formatPrice(cartTotal())}*`,
      "",
      "¿Me confirman tiempo de preparación? 🙏",
    ].join("\n");
  }

  function sendOrder() {
    if (!cartCount()) {
      showToast("Agrega algo de la carta primero");
      return;
    }
    window.open(waUrl(buildWhatsAppMessage()), "_blank", "noopener,noreferrer");
  }

  let toastTimer;
  function showToast(msg, { action = false } = {}) {
    toastMsg.textContent = msg;
    toastAction.hidden = !action;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), action ? 3200 : 2200);
  }

  function handleQtyClick(e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const { action, id } = btn.dataset;
    const current = getQty(id);
    if (action === "inc") {
      setQty(id, current + 1);
      popCartFloat();
    } else if (action === "dec") setQty(id, current - 1);
    else if (action === "remove") setQty(id, 0);
  }

  function bindEvents() {
    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyFilter(btn.dataset.filter));
    });

    const onAddClick = (e) => {
      const add = e.target.closest("[data-add]");
      if (add) {
        addOne(add.dataset.add);
        return;
      }
      handleQtyClick(e);
    };

    menuGrid.addEventListener("click", onAddClick);
    spotlight.addEventListener("click", onAddClick);
    orderList.addEventListener("click", handleQtyClick);

    $("#sendWhatsApp").addEventListener("click", sendOrder);
    $("#clearOrder").addEventListener("click", () => {
      state.cart.clear();
      syncQtyUI();
      renderOrder();
      updateTray();
      showToast("Pedido vaciado");
    });

    cartFloat.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);
    cartBackdrop.addEventListener("click", closeCart);
    toastAction.addEventListener("click", () => {
      toast.classList.remove("is-show");
      openCart();
    });

    if (heroOrderCta) {
      heroOrderCta.addEventListener("click", (e) => {
        if (cartCount() > 0) {
          e.preventDefault();
          openCart();
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (cartDrawer.classList.contains("is-open")) {
        closeCart();
        return;
      }
      if (nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-open-cart]");
      if (openBtn) {
        e.preventDefault();
        openCart();
        return;
      }
      const closeBtn = e.target.closest("[data-close-cart]");
      if (closeBtn) {
        closeCart();
      }
    });

    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = open || cartDrawer.classList.contains("is-open") ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menú");
        if (!cartDrawer.classList.contains("is-open")) {
          document.body.style.overflow = "";
        }
      });
    });

    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("is-scrolled", window.scrollY > 40);
      },
      { passive: true }
    );
  }

  function initReveal() {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  }

  $("#year").textContent = String(new Date().getFullYear());
  initWhatsAppLinks();
  renderSpotlight();
  renderMenu();
  renderOrder();
  bindEvents();
  initReveal();
})();
