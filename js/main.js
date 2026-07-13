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

  const CART_KEY = "suricano_cart_v1";
  const LAST_ORDER_KEY = "suricano_last_order_v1";
  const ETA_LABEL = "Retiro estimado · 15–20 min";

  const IMG = "img_carta/burros";
  const IMG_DRINKS = "img_carta/bebidas";
  const IMG_PAPAS = "img_carta/papas";
  const papaImg = (file) => encodeURI(`${IMG_PAPAS}/${file}`);

  let MENU = [
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
      spotlightRank: 2,
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
      spotlightRank: 3,
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
      spotlightRank: 1,
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

  let DRINKS = [
    {
      id: "coca-500",
      name: "Coca-Cola 500 cc",
      price: 2500,
      kind: "drink",
      featured: true,
      image: `${IMG_DRINKS}/bebida_cocacola_500.webp`,
    },
    {
      id: "coca-15l",
      name: "Coca-Cola 1.5L (Cero o Normal)",
      price: 3500,
      kind: "drink",
      featured: true,
      image: `${IMG_DRINKS}/bebida_cocacola_15l.webp`,
    },
  ];

  let PAPAS = [
    {
      id: "papa-frita",
      name: "Papa frita",
      price: 5000,
      kind: "papas",
      size: 1,
      image: papaImg("papas_papa_frita (1).webp"),
    },
    {
      id: "salchi-normal",
      name: "Salchi normal",
      price: 5500,
      kind: "papas",
      size: 1,
      image: papaImg("papas_salchi_normal.webp"),
    },
    {
      id: "salchi-suprema",
      name: "Salchi Suprema",
      price: 6000,
      kind: "papas",
      size: 1,
      featured: true,
      desc: "Papa natural, salchicha, salsa queso cheddar, salsa sour, tomate y cebollín.",
      image: papaImg("papas_salchi_suprema (1).webp"),
    },
    {
      id: "papa-suprema-frijol",
      name: "Papa Suprema Frijol",
      price: 6000,
      kind: "papas",
      size: 1,
      desc: "Papa natural, frijol negro salteado y sazonado, salsa queso cheddar, salsa sour, tomate y cebollín.",
      image: papaImg("papas_suprema_frijol.webp"),
    },
    {
      id: "papa-suprema",
      name: "Papa Suprema",
      price: 7000,
      kind: "papas",
      size: 1,
      featured: true,
      desc: "Papa natural, carne, salsa queso cheddar, salsa sour, tomate y cebollín.",
      image: papaImg("papas_papa_suprema_carne.webp"),
    },
    {
      id: "papa-chicken",
      name: "Papa Chicken",
      price: 7000,
      kind: "papas",
      size: 1,
      featured: true,
      desc: "Papas naturales, pollo sazonado con cebolla, choclo y ciboulette.",
      image: papaImg("papas_papa_chicken (1).webp"),
    },
    {
      id: "papa-frita-2",
      name: "Papa frita (para 2)",
      price: 7000,
      kind: "papas",
      size: 2,
      image: papaImg("papas_papa_frita (1).webp"),
    },
    {
      id: "salchi-normal-2",
      name: "Salchi normal (para 2)",
      price: 9000,
      kind: "papas",
      size: 2,
      image: papaImg("papas_salchi_normal.webp"),
    },
    {
      id: "salchi-suprema-2",
      name: "Salchi Suprema (para 2)",
      price: 9500,
      kind: "papas",
      size: 2,
      featured: true,
      desc: "Papa natural, salchicha, salsa queso cheddar, salsa sour, tomate y cebollín.",
      image: papaImg("papas_salchi_suprema (1).webp"),
    },
    {
      id: "papa-suprema-frijol-2",
      name: "Papa Suprema Frijol (para 2)",
      price: 9500,
      kind: "papas",
      size: 2,
      desc: "Papa natural, frijol negro salteado y sazonado, salsa queso cheddar, salsa sour, tomate y cebollín.",
      image: papaImg("papas_suprema_frijol.webp"),
    },
    {
      id: "papa-suprema-2",
      name: "Papa Suprema (para 2)",
      price: 10000,
      kind: "papas",
      size: 2,
      featured: true,
      desc: "Papa natural, carne, salsa queso cheddar, salsa sour, tomate y cebollín.",
      image: papaImg("papas_papa_suprema_carne.webp"),
    },
    {
      id: "papa-chicken-2",
      name: "Papa Chicken (para 2)",
      price: 10000,
      kind: "papas",
      size: 2,
      featured: true,
      desc: "Papas naturales, pollo sazonado con cebolla, choclo y ciboulette.",
      image: papaImg("papas_papa_chicken (1).webp"),
    },
    {
      id: "papa-frita-xl",
      name: "Papa frita XL (para 4)",
      price: 12000,
      kind: "papas",
      size: 4,
      image: papaImg("papas_xl_papa_frita (1).webp"),
    },
    {
      id: "salchi-normal-xl",
      name: "Salchi normal XL (para 4)",
      price: 14000,
      kind: "papas",
      size: 4,
      image: papaImg("papas_xl_salchi_normal (1).webp"),
    },
    {
      id: "salchi-suprema-xl",
      name: "Salchi Suprema XL (para 4)",
      price: 16000,
      kind: "papas",
      size: 4,
      featured: true,
      image: papaImg("papas_xl_salchi_suprema (1).webp"),
    },
    {
      id: "papa-suprema-frijol-xl",
      name: "Papa Suprema Frijol XL (para 4)",
      price: 16000,
      kind: "papas",
      size: 4,
      image: papaImg("papas_xl_suprema_frijol (1).webp"),
    },
    {
      id: "papa-suprema-xl",
      name: "Suprema XL (para 4)",
      price: 17500,
      kind: "papas",
      size: 4,
      featured: true,
      image: papaImg("papas_xl_suprema (1).webp"),
    },
    {
      id: "papa-pollo-xl",
      name: "Pollo XL (para 4)",
      price: 17500,
      kind: "papas",
      size: 4,
      featured: true,
      image: papaImg("papas_xl_chicken (1).webp"),
    },
  ];

  let EXTRAS = [
    { id: "ex-carne", name: "Carne", price: 2000, group: "proteinas" },
    { id: "ex-pollo", name: "Pollo", price: 2000, group: "proteinas" },
    { id: "ex-pollo-crema", name: "Pollo con crema", price: 2500, group: "proteinas" },
    { id: "ex-champi", name: "Champiñón", price: 2500, group: "proteinas" },
    { id: "ex-champi-crema", name: "Champiñón con crema", price: 3000, group: "proteinas" },
    { id: "ex-frijol", name: "Frijol", price: 1000, group: "proteinas" },
    { id: "ex-cebolla-caram", name: "Cebolla caramelizada", price: 1500, group: "vegetales" },
    { id: "ex-choclo", name: "Choclo", price: 500, group: "vegetales" },
    { id: "ex-pepinillos", name: "Pepinillos", price: 1000, group: "vegetales" },
    { id: "ex-cebolla", name: "Cebolla", price: 500, group: "vegetales" },
    { id: "ex-cebolla-morada", name: "Cebolla morada", price: 800, group: "vegetales" },
    { id: "ex-pimenton", name: "Pimentón", price: 800, group: "vegetales" },
    { id: "ex-cheddar", name: "Salsa cheddar", price: 1000, group: "salsas" },
    { id: "ex-parmesano", name: "Queso parmesano", price: 500, group: "salsas" },
    { id: "ex-aji-infierno", name: "Ají infierno", price: 800, group: "salsas" },
    { id: "ex-ajonesa", name: "Ajonesa", price: 1000, group: "salsas" },
    { id: "ex-mayo-ahumada", name: "Mayonesa ahumada picante", price: 800, group: "salsas" },
    { id: "ex-rancho", name: "Rancho de salsa", price: 800, group: "salsas" },
    {
      id: "ex-potes",
      name: "3 potes de aderezo",
      price: 1000,
      group: "potes",
      kind: "pote",
      flavors: ["Mayo", "Ají", "Ketchup", "Mostaza"],
      pick: 3,
    },
    {
      id: "ex-potes-premium",
      name: "3 potes de aderezo premium",
      price: 2000,
      group: "potes",
      kind: "pote",
      flavors: ["Ajonesa", "Barbacoa", "Ají infierno", "Queso cheddar"],
      pick: 3,
    },
  ];

  let EXTRA_GROUPS = [
    { id: "proteinas", label: "Proteínas" },
    { id: "vegetales", label: "Vegetales" },
    { id: "salsas", label: "Salsas" },
    { id: "potes", label: "Potes de aderezo" },
  ];

  let CUSTOM = [];
  let CATEGORIES = [
    { id: "solo", label: "Solo", scope: "burrito", sort_order: 1, active: true },
    { id: "papas", label: "Combo + papas", scope: "burrito", sort_order: 2, active: true },
    { id: "size-1", label: "Individual", scope: "papas", sort_order: 1, active: true },
    { id: "size-2", label: "Para 2", scope: "papas", sort_order: 2, active: true },
    { id: "size-4", label: "XL · 4", scope: "papas", sort_order: 3, active: true },
  ];

  let FILTER_META = {
    todos: { title: "Burritos", sub: "14 productos · de a dos" },
    solo: { title: "Solo burrito", sub: "7 productos · de a dos" },
    papas: { title: "Combo + papas", sub: "7 productos · de a dos" },
  };

  let PAPAS_FILTER_META = {
    todos: { sub: "18 productos" },
    1: { sub: "6 opciones · 1 persona" },
    2: { sub: "6 opciones · para 2" },
    4: { sub: "6 opciones · XL para 4" },
  };

  const state = {
    cart: new Map(),
    extras: new Map(),
    poteOrders: [],
    filter: "todos",
    papasFilter: "todos",
    poteDraft: null,
    orderNote: "",
    upsellShown: false,
    skipPersist: false,
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
  const papasGrid = $("#papasGrid");
  const drinksGrid = $("#drinksGrid");
  const menuHeading = $("#menuHeading");
  const menuSubheading = $("#menuSubheading");
  const papasSubheading = $("#papasSubheading");
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

  function findProduct(id) {
    return (
      MENU.find((m) => m.id === id) ||
      PAPAS.find((p) => p.id === id) ||
      DRINKS.find((d) => d.id === id) ||
      CUSTOM.find((c) => c.id === id)
    );
  }

  function activeCats(scope) {
    return CATEGORIES.filter((c) => c.scope === scope && c.active !== false).sort(
      (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
    );
  }

  function papasSizeKey(cat) {
    const m = String(cat.id).match(/(\d+)/);
    return m ? m[1] : null;
  }

  function rebuildFilterMeta() {
    FILTER_META = {
      todos: {
        title: "Burritos",
        sub: `${MENU.length} productos · de a dos`,
      },
    };
    activeCats("burrito").forEach((c) => {
      const n = MENU.filter((m) => m.category === c.id).length;
      FILTER_META[c.id] = {
        title: c.label,
        sub: `${n} productos · de a dos`,
      };
    });

    PAPAS_FILTER_META = {
      todos: { sub: `${PAPAS.length} productos` },
    };
    activeCats("papas").forEach((c) => {
      const size = papasSizeKey(c);
      if (!size) return;
      const n = PAPAS.filter((p) => String(p.size) === size).length;
      PAPAS_FILTER_META[size] = { sub: `${n} opciones · ${c.label}` };
    });
  }

  function rebuildBurritoFilters() {
    const root = $("#burritoFilters");
    if (!root) return;
    const cats = activeCats("burrito");
    const parts = [
      `<button class="filter-btn is-active" role="tab" aria-selected="true" data-filter="todos">
        Todos <span class="filter-count">${MENU.length}</span>
      </button>`,
    ];
    cats.forEach((c) => {
      const n = MENU.filter((m) => m.category === c.id).length;
      parts.push(
        `<button class="filter-btn" role="tab" aria-selected="false" data-filter="${c.id}">
          ${c.label} <span class="filter-count">${n}</span>
        </button>`
      );
    });
    root.innerHTML = parts.join("");
  }

  function rebuildPapasFilters() {
    const root = $("#papasFilters");
    if (!root) return;
    const cats = activeCats("papas");
    const parts = [
      `<button class="filter-btn is-active" role="tab" aria-selected="true" data-papas-size="todos">
        Todos <span class="filter-count">${PAPAS.length}</span>
      </button>`,
    ];
    cats.forEach((c) => {
      const size = papasSizeKey(c);
      if (!size) return;
      const n = PAPAS.filter((p) => String(p.size) === size).length;
      parts.push(
        `<button class="filter-btn" role="tab" aria-selected="false" data-papas-size="${size}">
          ${c.label} <span class="filter-count">${n}</span>
        </button>`
      );
    });
    root.innerHTML = parts.join("");
  }

  function updateNavSections() {
    const navEl = $("#nav");
    if (!navEl) return;
    navEl.querySelectorAll("[data-dynamic-section]").forEach((a) => a.remove());
    const bebidas = navEl.querySelector('a[href="#bebidas"]');
    let insertAfter = bebidas;
    activeCats("section").forEach((c) => {
      const items = CUSTOM.filter((p) => p.category === c.id);
      if (!items.length) return;
      const a = document.createElement("a");
      a.href = `#sec-${c.id}`;
      a.textContent = c.label;
      a.dataset.dynamicSection = c.id;
      if (insertAfter) {
        insertAfter.after(a);
        insertAfter = a;
      } else {
        navEl.appendChild(a);
      }
    });
  }

  function renderCustomSections() {
    const host = $("#customSections");
    if (!host) return;
    const sections = activeCats("section");
    host.innerHTML = sections
      .map((c) => {
        const items = CUSTOM.filter((p) => p.category === c.id);
        if (!items.length) return "";
        return `
        <div class="catalog-block" id="sec-${c.id}">
          <div class="menu-heading">
            <h3>${c.label}</h3>
            <p>${c.description || `${items.length} productos`}</p>
          </div>
          <div class="menu-grid" data-custom-grid="${c.id}" aria-live="polite">
            ${items.map((item, i) => menuCardHTML(item, i)).join("")}
          </div>
        </div>`;
      })
      .join("");
    revealCards(host);
    updateNavSections();
    updateShopRail();
    if (window.__suricanoShopIO) {
      sections.forEach((c) => {
        const el = document.getElementById(`sec-${c.id}`);
        if (el) window.__suricanoShopIO.observe(el);
      });
    }
  }

  function heatBars(level) {
    return [1, 2, 3]
      .map((i) => `<span class="${i <= level ? "is-on" : ""}"></span>`)
      .join("");
  }

  function catalogMeta(item) {
    if (item.kind === "drink") {
      return {
        ...item,
        tag: item.tag || "Bebida",
        tagStyle: item.tagStyle || "is-fresh",
        desc: item.desc || "Bien fría para acompañar el combo.",
      };
    }
    if (item.kind === "papas") {
      const size = item.size || 1;
      const sizeTag = size === 4 ? "XL" : size === 2 ? "Para 2" : "Individual";
      const sizeStyle = size === 4 ? "is-hot" : size === 2 ? "" : "is-fresh";
      return {
        ...item,
        size,
        tag: item.tag || sizeTag,
        tagStyle: item.tagStyle || sizeStyle,
        desc:
          item.desc ||
          (size === 4
            ? "Porción XL para compartir (4)."
            : size === 2
              ? "Porción para compartir (2)."
              : "Porción individual."),
      };
    }
    if (item.spotlightLabel) {
      return { ...item, tag: item.spotlightLabel };
    }
    return item;
  }

  function menuCardHTML(item, i, { contain = false } = {}) {
    const meta = catalogMeta(item);
    const sizeAttr = meta.size ? ` data-size="${meta.size}"` : "";
    const categoryAttr = meta.category ? ` data-category="${meta.category}"` : "";
    return `
      <article
        class="menu-card${meta.featured ? " is-featured" : ""}${contain ? " menu-card--contain" : ""}"
        data-id="${meta.id}"${categoryAttr}${sizeAttr}
        style="transition-delay: ${Math.min(i, 12) * 30}ms"
      >
        <div class="menu-plate">
          <img class="menu-photo" src="${meta.image}" alt="${meta.name}" loading="lazy" width="480" height="360" />
          <span class="menu-price-stamp">${formatPrice(meta.price)}</span>
          ${
            meta.heat > 0
              ? `<div class="menu-heat" title="Nivel de picante" aria-label="Picante ${meta.heat} de 3">${heatBars(meta.heat)}</div>`
              : ""
          }
        </div>
        <div class="menu-body">
          <span class="menu-tag ${meta.tagStyle || ""}">${meta.tag}</span>
          <h3>${meta.name}</h3>
          <p>${meta.desc}</p>
          <div class="menu-actions">
            <div class="menu-qty" data-qty-for="${meta.id}">
              <button type="button" class="qty-btn" data-action="dec" data-id="${meta.id}" aria-label="Quitar uno">−</button>
              <span class="qty-val" data-qty="${meta.id}">0</span>
              <button type="button" class="qty-btn" data-action="inc" data-id="${meta.id}" aria-label="Agregar uno">+</button>
            </div>
            <button type="button" class="btn-add" data-add="${meta.id}">Agregar</button>
          </div>
        </div>
      </article>`;
  }

  function revealCards(root) {
    requestAnimationFrame(() => {
      $$(`.menu-card`, root).forEach((card) => card.classList.add("is-visible"));
    });
  }

  function renderDrinks() {
    if (!drinksGrid) return;
    const sub = $("#drinksSubheading");
    if (sub) sub.textContent = `${DRINKS.length} productos`;
    drinksGrid.innerHTML = DRINKS.map((item, i) =>
      menuCardHTML(item, i, { contain: true })
    ).join("");
    revealCards(drinksGrid);
  }

  function renderPapas() {
    applyPapasFilter(state.papasFilter, { animate: false });
  }

  function renderMenu() {
    applyFilter(state.filter, { animate: false });
  }

  function applyFilter(filter, { animate = true } = {}) {
    const next = FILTER_META[filter] ? filter : "todos";
    state.filter = next;

    $$("#burritoFilters .filter-btn").forEach((btn) => {
      const active = btn.dataset.filter === next;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    const meta = FILTER_META[next];
    menuHeading.textContent = meta.title;
    menuSubheading.textContent = meta.sub;

    const items =
      next === "todos" ? MENU : MENU.filter((m) => m.category === next);

    const paint = () => {
      menuGrid.innerHTML = items.map((item, i) => menuCardHTML(item, i)).join("");
      revealCards(menuGrid);
      menuGrid.classList.remove("is-updating");
      syncQtyUI();
    };

    if (!animate) {
      paint();
      return;
    }

    menuGrid.classList.add("is-updating");
    window.setTimeout(paint, 120);
  }

  function applyPapasFilter(size, { animate = true } = {}) {
    const key = PAPAS_FILTER_META[String(size)] ? String(size) : "todos";
    state.papasFilter = key;

    $$("#papasFilters .filter-btn").forEach((btn) => {
      const active = btn.dataset.papasSize === key;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
    });

    const meta = PAPAS_FILTER_META[key];
    if (papasSubheading) papasSubheading.textContent = meta.sub;

    const items =
      key === "todos" ? PAPAS : PAPAS.filter((p) => String(p.size) === key);

    const paint = () => {
      papasGrid.innerHTML = items.map((item, i) => menuCardHTML(item, i)).join("");
      revealCards(papasGrid);
      papasGrid.classList.remove("is-updating");
      syncQtyUI();
    };

    if (!animate) {
      paint();
      return;
    }

    papasGrid.classList.add("is-updating");
    window.setTimeout(paint, 120);
  }

  function getQty(id) {
    return state.cart.get(id) || 0;
  }

  function setQty(id, qty) {
    if (qty <= 0) state.cart.delete(id);
    else state.cart.set(id, qty);
    const hasBurrito = MENU.some((m) => state.cart.has(m.id));
    if (!hasBurrito) {
      state.extras.clear();
      state.poteOrders = [];
    }
    syncQtyUI();
    renderOrder();
    updateTray();
    persistCart();
  }

  function addOne(id, { silentUpsell = false } = {}) {
    setQty(id, getQty(id) + 1);
    const item = findProduct(id);
    haptic(14);
    showToast(`${item.name} al pedido`, { action: true });
    popCartFloat();
    $$(`[data-add="${id}"]`).forEach((btn) => {
      btn.classList.add("is-added");
      btn.textContent = "Listo ✓";
      setTimeout(() => {
        btn.classList.remove("is-added");
        const qty = getQty(id);
        if (btn.classList.contains("spot-add") || /quiero|Otro/i.test(btn.textContent)) {
          btn.textContent = qty > 0 ? "Otro más" : "Lo quiero";
        } else {
          btn.textContent = qty > 0 ? "Agregar otro" : "Agregar";
        }
      }, 1100);
    });
    if (!silentUpsell) maybeOfferUpsell(item);
  }

  function syncQtyUI() {
    [...MENU, ...PAPAS, ...DRINKS, ...CUSTOM].forEach((item) => {
      const qty = getQty(item.id);
      $$(`[data-qty="${item.id}"]`).forEach((el) => {
        el.textContent = String(qty);
      });
      $$(`.menu-card[data-id="${item.id}"]`).forEach((card) => {
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
        const item = findProduct(id);
        return item ? { ...item, qty, subtotal: item.price * qty } : null;
      })
      .filter(Boolean);
  }

  function burritoEntries() {
    return cartEntries().filter((e) => MENU.some((m) => m.id === e.id));
  }

  function drinkEntries() {
    return cartEntries().filter((e) => e.kind === "drink");
  }

  function papasEntries() {
    return cartEntries().filter((e) => e.kind === "papas");
  }

  function customEntries() {
    return cartEntries().filter((e) => CUSTOM.some((c) => c.id === e.id));
  }

  function extraEntries() {
    return [...state.extras.entries()]
      .map(([id, qty]) => {
        const item = EXTRAS.find((e) => e.id === id);
        return item ? { ...item, qty, subtotal: item.price * qty } : null;
      })
      .filter(Boolean);
  }

  function extrasTotal() {
    const simple = extraEntries().reduce((s, e) => s + e.subtotal, 0);
    const potes = state.poteOrders.reduce((s, p) => s + p.price, 0);
    return simple + potes;
  }

  function cartTotal() {
    return cartEntries().reduce((s, e) => s + e.subtotal, 0) + extrasTotal();
  }

  function cartCount() {
    const burritos = cartEntries().reduce((s, e) => s + e.qty, 0);
    const extras = extraEntries().reduce((s, e) => s + e.qty, 0);
    return burritos + extras + state.poteOrders.length;
  }

  function getExtraQty(id) {
    return state.extras.get(id) || 0;
  }

  function setExtraQty(id, qty) {
    if (qty <= 0) state.extras.delete(id);
    else state.extras.set(id, qty);
    renderOrder();
    updateTray();
    persistCart();
  }

  function renderExtrasPanel() {
    const extrasGroups = $("#extrasGroups");
    const extrasPanel = $("#extrasPanel");
    if (!extrasGroups || !extrasPanel) return;

    const hasBurritos = burritoEntries().length > 0;
    extrasPanel.hidden = !hasBurritos;
    if (!hasBurritos) return;

    extrasGroups.innerHTML = EXTRA_GROUPS.map((group) => {
      const items = EXTRAS.filter((e) => e.group === group.id);
      return `
        <div class="extras-group">
          <p class="extras-group-label">${group.label}</p>
          <ul class="extras-list">
            ${items
              .map((item) => {
                if (item.kind === "pote") {
                  return `
                  <li class="extras-row">
                    <div class="extras-info">
                      <span class="extras-name">${item.name}</span>
                      <span class="extras-price">${formatPrice(item.price)}</span>
                    </div>
                    <button type="button" class="extras-add" data-pote="${item.id}" aria-label="Elegir sabores de ${item.name}">+</button>
                  </li>`;
                }
                const qty = getExtraQty(item.id);
                return `
                <li class="extras-row">
                  <div class="extras-info">
                    <span class="extras-name">${item.name}</span>
                    <span class="extras-price">${formatPrice(item.price)}</span>
                  </div>
                  ${
                    qty > 0
                      ? `<div class="extras-qty">
                          <button type="button" class="extras-qty-btn" data-extra-action="dec" data-extra-id="${item.id}" aria-label="Quitar">−</button>
                          <span>${qty}</span>
                          <button type="button" class="extras-qty-btn" data-extra-action="inc" data-extra-id="${item.id}" aria-label="Agregar">+</button>
                        </div>`
                      : `<button type="button" class="extras-add" data-extra-action="inc" data-extra-id="${item.id}" aria-label="Agregar ${item.name}">+</button>`
                  }
                </li>`;
              })
              .join("")}
          </ul>
        </div>`;
    }).join("");

    if (state.poteOrders.length) {
      extrasGroups.insertAdjacentHTML(
        "afterbegin",
        `<div class="extras-group">
          <p class="extras-group-label">Tus potes</p>
          <ul class="extras-list">
            ${state.poteOrders
              .map(
                (p, i) => `
              <li class="extras-row extras-row--pote">
                <div class="extras-info">
                  <span class="extras-name">${p.name}</span>
                  <span class="extras-meta">${p.flavors.join(", ")}</span>
                  <span class="extras-price">${formatPrice(p.price)}</span>
                </div>
                <button type="button" class="extras-remove" data-pote-remove="${i}" aria-label="Quitar pote">Quitar</button>
              </li>`
              )
              .join("")}
          </ul>
        </div>`
      );
    }
  }

  function renderOrder() {
    const entries = cartEntries();
    const empty = entries.length === 0;

    orderEmpty.hidden = !empty;
    orderFooter.hidden = empty;
    updateRepeatBtn();
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

    renderExtrasPanel();
    orderTotal.textContent = formatPrice(cartTotal());
  }

  function openPoteModal(extraId) {
    const item = EXTRAS.find((e) => e.id === extraId);
    if (!item || item.kind !== "pote") return;
    state.poteDraft = { id: item.id, selected: [] };
    $("#poteTitle").textContent = `Elige ${item.pick} aderezos`;
    $("#poteSub").textContent = item.name;
    $("#poteOptions").innerHTML = item.flavors
      .map(
        (f) => `
      <label class="pote-option">
        <input type="checkbox" value="${f}" />
        <span>${f}</span>
      </label>`
      )
      .join("");
    $("#potePicked").textContent = "0";
    $("#poteConfirm").disabled = true;
    const modal = $("#poteModal");
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
  }

  function closePoteModal() {
    const modal = $("#poteModal");
    modal.classList.remove("is-open");
    state.poteDraft = null;
    setTimeout(() => {
      modal.hidden = true;
    }, 250);
  }

  function syncPoteDraft() {
    if (!state.poteDraft) return;
    const item = EXTRAS.find((e) => e.id === state.poteDraft.id);
    const checked = $$("#poteOptions input:checked").map((i) => i.value);
    const pick = item.pick;

    $$("#poteOptions input").forEach((input) => {
      if (!input.checked && checked.length >= pick) input.disabled = true;
      else input.disabled = false;
    });

    state.poteDraft.selected = checked;
    $("#potePicked").textContent = String(checked.length);
    $("#poteConfirm").disabled = checked.length !== pick;
  }

  function confirmPote() {
    if (!state.poteDraft) return;
    const item = EXTRAS.find((e) => e.id === state.poteDraft.id);
    if (state.poteDraft.selected.length !== item.pick) return;
    state.poteOrders.push({
      id: item.id,
      name: item.name,
      price: item.price,
      flavors: [...state.poteDraft.selected],
    });
    closePoteModal();
    renderOrder();
    updateTray();
    persistCart();
    popCartFloat();
    showToast(`${item.name} agregado`, { action: true });
  }

  function haptic(ms = 12) {
    try {
      if (navigator.vibrate) navigator.vibrate(ms);
    } catch (_) {
      /* ignore */
    }
  }

  function openCart() {
    lastFocus = document.activeElement;
    cartBackdrop.hidden = false;
    cartDrawer.style.transform = "";
    requestAnimationFrame(() => {
      cartBackdrop.classList.add("is-open");
      cartDrawer.classList.add("is-open");
    });
    cartDrawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    cartClose.focus();
  }

  function closeCart() {
    if (!$("#poteModal").hidden) closePoteModal();
    cartBackdrop.classList.remove("is-open");
    cartBackdrop.style.opacity = "";
    cartDrawer.classList.remove("is-open");
    cartDrawer.classList.remove("is-dragging");
    cartDrawer.style.transform = "";
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

  function initCartSwipe() {
    if (!cartDrawer || !window.matchMedia("(max-width: 768px)").matches) {
      // still bind; media can change — use runtime check
    }
    let startY = 0;
    let currentY = 0;
    let dragging = false;

    const onStart = (y) => {
      if (!cartDrawer.classList.contains("is-open")) return;
      if (window.matchMedia("(min-width: 769px)").matches) return;
      const panel = $("#orderPanel");
      if (panel && panel.scrollTop > 0) return;
      startY = y;
      currentY = y;
      dragging = true;
      cartDrawer.classList.add("is-dragging");
    };

    const onMove = (y) => {
      if (!dragging) return;
      currentY = y;
      const dy = Math.max(0, currentY - startY);
      cartDrawer.style.transform = `translateY(${dy}px)`;
      cartBackdrop.style.opacity = String(Math.max(0.15, 1 - dy / 380));
    };

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      cartDrawer.classList.remove("is-dragging");
      const dy = Math.max(0, currentY - startY);
      cartBackdrop.style.opacity = "";
      if (dy > 110) {
        cartDrawer.style.transform = "";
        closeCart();
      } else {
        cartDrawer.style.transform = "";
      }
    };

    cartDrawer.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length !== 1) return;
        onStart(e.touches[0].clientY);
      },
      { passive: true }
    );
    cartDrawer.addEventListener(
      "touchmove",
      (e) => {
        if (!dragging || e.touches.length !== 1) return;
        onMove(e.touches[0].clientY);
      },
      { passive: true }
    );
    cartDrawer.addEventListener("touchend", onEnd, { passive: true });
    cartDrawer.addEventListener("touchcancel", onEnd, { passive: true });
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
    const burritos = burritoEntries();
    const papas = papasEntries();
    const drinks = drinkEntries();
    const custom = customEntries();
    const extras = extraEntries();
    if (!burritos.length && !papas.length && !drinks.length && !custom.length) {
      return WHATSAPP_GREETING;
    }

    const lines = ["¡Hola El Suricano! Quiero este pedido:", ""];
    let needGap = false;

    const pushSection = (title, entries) => {
      if (!entries.length) return;
      if (needGap) lines.push("");
      lines.push(
        `*${title}*`,
        ...entries.map((e) => `• ${e.qty}x ${e.name} — ${formatPrice(e.subtotal)}`)
      );
      needGap = true;
    };

    pushSection("Burritos", burritos);
    pushSection("Papas", papas);
    pushSection("Bebidas", drinks);

    activeCats("section").forEach((c) => {
      const items = custom.filter((e) => e.category === c.id);
      pushSection(c.label, items);
    });
    const orphan = custom.filter(
      (e) => !activeCats("section").some((c) => c.id === e.category)
    );
    pushSection("Otros", orphan);

    if (extras.length || state.poteOrders.length) {
      if (needGap) lines.push("");
      lines.push("*Extras*");
      extras.forEach((e) => {
        lines.push(`• ${e.qty}x ${e.name} — ${formatPrice(e.subtotal)}`);
      });
      state.poteOrders.forEach((p) => {
        lines.push(
          `• 1x ${p.name} (${p.flavors.join(", ")}) — ${formatPrice(p.price)}`
        );
      });
    }

    const note = (state.orderNote || "").trim();
    if (note) {
      if (needGap) lines.push("");
      lines.push("*Nota:*", note);
    }

    lines.push(
      "",
      `*Total estimado: ${formatPrice(cartTotal())}*`,
      ETA_LABEL,
      "",
      "¿Me confirman tiempo de preparación? 🙏"
    );
    return lines.join("\n");
  }

  function persistCart() {
    if (state.skipPersist) return;
    try {
      const payload = {
        cart: [...state.cart.entries()],
        extras: [...state.extras.entries()],
        poteOrders: state.poteOrders,
        orderNote: state.orderNote || "",
        savedAt: Date.now(),
      };
      localStorage.setItem(CART_KEY, JSON.stringify(payload));
    } catch (_) {
      /* storage full / privado */
    }
  }

  function restoreCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      state.skipPersist = true;
      state.cart = new Map(
        (data.cart || []).filter(([id, qty]) => findProduct(id) && qty > 0)
      );
      state.extras = new Map(
        (data.extras || []).filter(([id, qty]) => EXTRAS.some((e) => e.id === id) && qty > 0)
      );
      state.poteOrders = Array.isArray(data.poteOrders) ? data.poteOrders : [];
      state.orderNote = data.orderNote || "";
      const noteEl = $("#orderNote");
      if (noteEl) noteEl.value = state.orderNote;
      state.skipPersist = false;
      return state.cart.size > 0 || state.extras.size > 0 || state.poteOrders.length > 0;
    } catch (_) {
      state.skipPersist = false;
      return false;
    }
  }

  function saveLastOrder() {
    try {
      localStorage.setItem(
        LAST_ORDER_KEY,
        JSON.stringify({
          cart: [...state.cart.entries()],
          extras: [...state.extras.entries()],
          poteOrders: state.poteOrders,
          orderNote: state.orderNote || "",
          savedAt: Date.now(),
        })
      );
    } catch (_) {
      /* ignore */
    }
  }

  function hasLastOrder() {
    try {
      const raw = localStorage.getItem(LAST_ORDER_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      return Array.isArray(data.cart) && data.cart.length > 0;
    } catch (_) {
      return false;
    }
  }

  function repeatLastOrder() {
    try {
      const data = JSON.parse(localStorage.getItem(LAST_ORDER_KEY) || "null");
      if (!data) return;
      state.skipPersist = true;
      state.cart = new Map(
        (data.cart || []).filter(([id, qty]) => findProduct(id) && qty > 0)
      );
      state.extras = new Map(
        (data.extras || []).filter(([id, qty]) => EXTRAS.some((e) => e.id === id) && qty > 0)
      );
      state.poteOrders = Array.isArray(data.poteOrders) ? data.poteOrders : [];
      state.orderNote = data.orderNote || "";
      const noteEl = $("#orderNote");
      if (noteEl) noteEl.value = state.orderNote;
      state.skipPersist = false;
      syncQtyUI();
      renderOrder();
      updateTray();
      persistCart();
      showToast("Último pedido restaurado", { action: true });
      openCart();
    } catch (_) {
      showToast("No pude restaurar el pedido");
    }
  }

  function updateRepeatBtn() {
    const btn = $("#repeatLastBtn");
    if (!btn) return;
    btn.hidden = cartCount() > 0 || !hasLastOrder();
  }

  function openSheet(id) {
    const modal = $(id);
    if (!modal) return;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }

  function closeSheet(id) {
    const modal = $(id);
    if (!modal) return;
    modal.classList.remove("is-open");
    setTimeout(() => {
      if (!modal.classList.contains("is-open")) modal.hidden = true;
      const anySheet =
        $("#confirmModal")?.classList.contains("is-open") ||
        $("#upsellModal")?.classList.contains("is-open");
      if (!anySheet && !cartDrawer.classList.contains("is-open")) {
        document.body.style.overflow = "";
      }
    }, 320);
  }

  function openConfirm() {
    if (!cartEntries().length) {
      showToast("Agrega algo de la carta primero");
      return;
    }
    const list = $("#confirmList");
    const total = $("#confirmTotal");
    const eta = $("#confirmEta");
    if (eta) eta.textContent = ETA_LABEL;
    if (total) total.textContent = formatPrice(cartTotal());
    if (list) {
      const rows = [];
      cartEntries().forEach((e) => {
        rows.push(
          `<li><span>${e.qty}× ${e.name}</span><strong>${formatPrice(e.subtotal)}</strong></li>`
        );
      });
      extraEntries().forEach((e) => {
        rows.push(
          `<li><span>${e.qty}× ${e.name}</span><strong>${formatPrice(e.subtotal)}</strong><span class="confirm-meta">Extra</span></li>`
        );
      });
      state.poteOrders.forEach((p) => {
        rows.push(
          `<li><span>1× ${p.name}</span><strong>${formatPrice(p.price)}</strong><span class="confirm-meta">${p.flavors.join(", ")}</span></li>`
        );
      });
      list.innerHTML = rows.join("");
    }
    const noteEl = $("#orderNote");
    if (noteEl) noteEl.value = state.orderNote || "";
    openSheet("#confirmModal");
  }

  function closeConfirm() {
    closeSheet("#confirmModal");
  }

  function finalizeWhatsApp() {
    const noteEl = $("#orderNote");
    state.orderNote = noteEl ? noteEl.value.trim() : state.orderNote;
    persistCart();
    saveLastOrder();
    window.open(waUrl(buildWhatsAppMessage()), "_blank", "noopener,noreferrer");
    closeConfirm();
    showToast("Abriendo WhatsApp…");
  }

  function maybeOfferUpsell(item) {
    if (!item || state.upsellShown) return;
    const isBurrito = MENU.some((m) => m.id === item.id);
    if (!isBurrito) return;
    if (papasEntries().length || drinkEntries().length) return;
    const pickPapas =
      PAPAS.find((p) => p.featured) ||
      PAPAS.find((p) => Number(p.size) === 1) ||
      PAPAS[0];
    const pickDrink = DRINKS[0];
    if (!pickPapas && !pickDrink) return;
    state.upsellShown = true;
    const cards = $("#upsellCards");
    if (!cards) return;
    const options = [pickPapas, pickDrink].filter(Boolean);
    cards.innerHTML = options
      .map(
        (o) => `
      <button type="button" class="upsell-card" data-upsell-add="${o.id}">
        <img src="${o.image}" alt="" width="72" height="72" loading="lazy" />
        <div>
          <strong>${o.name}</strong>
          <span>${o.kind === "drink" ? "Bebida" : "Papas"}</span>
        </div>
        <span class="upsell-price">${formatPrice(o.price)}</span>
      </button>`
      )
      .join("");
    window.setTimeout(() => openSheet("#upsellModal"), 420);
  }

  function closeUpsell() {
    closeSheet("#upsellModal");
  }

  function updateShopRail() {
    const railBurritos = $("#railBurritos");
    const railPapas = $("#railPapas");
    const railBebidas = $("#railBebidas");
    if (railBurritos) railBurritos.textContent = String(MENU.length);
    if (railPapas) railPapas.textContent = String(PAPAS.length);
    if (railBebidas) railBebidas.textContent = String(DRINKS.length);

    const rail = $("#shopRail");
    if (!rail) return;
    rail.querySelectorAll("[data-dynamic-rail]").forEach((b) => b.remove());
    activeCats("section").forEach((c) => {
      const items = CUSTOM.filter((p) => p.category === c.id);
      if (!items.length) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "shop-rail-btn";
      btn.dataset.shop = `sec-${c.id}`;
      btn.dataset.dynamicRail = c.id;
      btn.innerHTML = `${c.label} <span class="shop-rail-count">${items.length}</span>`;
      rail.appendChild(btn);
    });

    const chrome = $("#shopChrome");
    if (chrome) {
      const h = Math.ceil(chrome.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--shop-chrome-h", `${h}px`);
    }
  }

  function setActiveShop(id) {
    $$("#shopRail .shop-rail-btn").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.shop === id);
    });
  }

  function scrollToShop(id) {
    const el = document.getElementById(id);
    if (!el) return;
    setActiveShop(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function initShopChrome() {
    const rail = $("#shopRail");
    const chrome = $("#shopChrome");
    if (!rail || !chrome) return;

    updateShopRail();

    rail.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-shop]");
      if (!btn) return;
      scrollToShop(btn.dataset.shop);
    });

    const sectionIds = ["burritos", "papas", "bebidas"];
    const observed = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if ("IntersectionObserver" in window && observed.length) {
      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((en) => en.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible[0]?.target?.id) setActiveShop(visible[0].target.id);
        },
        {
          rootMargin: `-${Math.round(78 + 56)}px 0px -45% 0px`,
          threshold: [0.15, 0.35, 0.55],
        }
      );
      observed.forEach((el) => io.observe(el));
      // custom sections observed after render
      window.__suricanoShopIO = io;
    }

    window.addEventListener(
      "resize",
      () => {
        const h = Math.ceil(chrome.getBoundingClientRect().height);
        document.documentElement.style.setProperty("--shop-chrome-h", `${h}px`);
      },
      { passive: true }
    );
  }

  function sendOrder() {
    openConfirm();
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
    const burritoFilters = $("#burritoFilters");
    if (burritoFilters) {
      burritoFilters.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-filter]");
        if (btn) applyFilter(btn.dataset.filter);
      });
    }

    const papasFilters = $("#papasFilters");
    if (papasFilters) {
      papasFilters.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-papas-size]");
        if (btn) applyPapasFilter(btn.dataset.papasSize);
      });
    }

    const onAddClick = (e) => {
      const add = e.target.closest("[data-add]");
      if (add) {
        addOne(add.dataset.add);
        return;
      }
      handleQtyClick(e);
    };

    menuGrid.addEventListener("click", onAddClick);
    papasGrid.addEventListener("click", onAddClick);
    drinksGrid.addEventListener("click", onAddClick);
    const customHost = $("#customSections");
    if (customHost) customHost.addEventListener("click", onAddClick);
    orderList.addEventListener("click", handleQtyClick);

    $("#extrasGroups").addEventListener("click", (e) => {
      const poteBtn = e.target.closest("[data-pote]");
      if (poteBtn) {
        openPoteModal(poteBtn.dataset.pote);
        return;
      }
      const removePote = e.target.closest("[data-pote-remove]");
      if (removePote) {
        state.poteOrders.splice(Number(removePote.dataset.poteRemove), 1);
        renderOrder();
        updateTray();
        persistCart();
        return;
      }
      const extraBtn = e.target.closest("[data-extra-action]");
      if (!extraBtn) return;
      const id = extraBtn.dataset.extraId;
      const action = extraBtn.dataset.extraAction;
      const current = getExtraQty(id);
      if (action === "inc") {
        setExtraQty(id, current + 1);
        popCartFloat();
      } else if (action === "dec") {
        setExtraQty(id, current - 1);
      }
    });

    $("#poteOptions").addEventListener("change", syncPoteDraft);
    $("#poteConfirm").addEventListener("click", confirmPote);
    $("#poteCancel").addEventListener("click", closePoteModal);
    $("#poteClose").addEventListener("click", closePoteModal);
    $("#poteModal").addEventListener("click", (e) => {
      if (e.target.id === "poteModal") closePoteModal();
    });

    $("#sendWhatsApp").addEventListener("click", sendOrder);
    $("#clearOrder").addEventListener("click", () => {
      state.cart.clear();
      state.extras.clear();
      state.poteOrders = [];
      state.orderNote = "";
      const noteEl = $("#orderNote");
      if (noteEl) noteEl.value = "";
      syncQtyUI();
      renderOrder();
      updateTray();
      persistCart();
      showToast("Pedido vaciado");
    });

    const repeatBtn = $("#repeatLastBtn");
    if (repeatBtn) repeatBtn.addEventListener("click", repeatLastOrder);

    const confirmModal = $("#confirmModal");
    if (confirmModal) {
      confirmModal.addEventListener("click", (e) => {
        if (e.target.closest("[data-confirm-close]")) closeConfirm();
      });
    }
    const confirmSend = $("#confirmSendWa");
    if (confirmSend) confirmSend.addEventListener("click", finalizeWhatsApp);
    const orderNote = $("#orderNote");
    if (orderNote) {
      orderNote.addEventListener("input", () => {
        state.orderNote = orderNote.value;
        persistCart();
      });
    }

    const upsellModal = $("#upsellModal");
    if (upsellModal) {
      upsellModal.addEventListener("click", (e) => {
        if (e.target.closest("[data-upsell-close]")) {
          closeUpsell();
          return;
        }
        const add = e.target.closest("[data-upsell-add]");
        if (add) {
          closeUpsell();
          addOne(add.dataset.upsellAdd, { silentUpsell: true });
        }
      });
    }

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
      if (!$("#upsellModal")?.hidden) {
        closeUpsell();
        return;
      }
      if (!$("#confirmModal")?.hidden) {
        closeConfirm();
        return;
      }
      if (!$("#poteModal").hidden) {
        closePoteModal();
        return;
      }
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

  function applyCatalog(data) {
    if (Array.isArray(data.burritos) && data.burritos.length) MENU = data.burritos;
    if (Array.isArray(data.papas) && data.papas.length) PAPAS = data.papas;
    if (Array.isArray(data.drinks) && data.drinks.length) DRINKS = data.drinks;
    if (Array.isArray(data.extras) && data.extras.length) EXTRAS = data.extras;
    if (Array.isArray(data.custom)) {
      CUSTOM = data.custom.map((p) => ({ ...p, kind: p.kind || "custom" }));
    }
    if (Array.isArray(data.categories) && data.categories.length) {
      CATEGORIES = data.categories;
    }
    if (Array.isArray(data.extraGroups) && data.extraGroups.length) {
      EXTRA_GROUPS = data.extraGroups;
    }
    rebuildFilterMeta();
    rebuildBurritoFilters();
    rebuildPapasFilters();
  }

  async function loadCatalog() {
    const tryUrls = ["/api/menu", "/data/menu.json"];
    for (const url of tryUrls) {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        applyCatalog(data);
        return data.source || url;
      } catch (_) {
        /* next */
      }
    }
    return "fallback";
  }

  function initHeroCarousel() {
    const root = document.querySelector(".hero-carousel");
    if (!root) return;

    const slides = [...root.querySelectorAll(".hero-photo")];
    if (slides.length < 2) return;

    slides.forEach((img) => {
      img.loading = "eager";
      img.decoding = "async";
    });

    let index = Math.max(
      0,
      slides.findIndex((s) => s.classList.contains("is-active"))
    );
    let busy = false;
    const FADE_MS = 1200;
    const INTERVAL_MS = 4000;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    slides.forEach((s, i) => {
      s.classList.toggle("is-active", i === index);
      s.classList.remove("is-leaving", "is-entering");
    });

    const goNext = () => {
      if (busy) return;
      const from = slides[index];
      const next = (index + 1) % slides.length;
      const to = slides[next];

      if (reduceMotion) {
        from.classList.remove("is-active");
        to.classList.add("is-active");
        index = next;
        return;
      }

      busy = true;
      from.classList.remove("is-entering");
      from.classList.add("is-leaving");
      from.classList.remove("is-active");

      to.classList.add("is-active", "is-entering");

      window.setTimeout(() => {
        from.classList.remove("is-leaving");
        to.classList.remove("is-entering");
        index = next;
        busy = false;
      }, FADE_MS);
    };

    window.setInterval(goNext, INTERVAL_MS);
  }

  function jumpToDeepLink() {
    const hash = (location.hash || "").replace(/^#/, "");
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target) return;
    window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (["burritos", "papas", "bebidas"].includes(hash) || hash.startsWith("sec-")) {
        setActiveShop(hash);
      }
      document.body.classList.add("from-qr");
    }, 180);
  }

  async function boot() {
    await loadCatalog();
    $("#year").textContent = String(new Date().getFullYear());
    initWhatsAppLinks();
    rebuildFilterMeta();
    rebuildBurritoFilters();
    rebuildPapasFilters();
    renderMenu();
    renderPapas();
    renderDrinks();
    renderCustomSections();
    initShopChrome();
    initCartSwipe();
    const restored = restoreCart();
    syncQtyUI();
    renderOrder();
    updateTray();
    bindEvents();
    initReveal();
    initHeroCarousel();
    jumpToDeepLink();
    if (restored) {
      showToast("Recuperamos tu pedido", { action: true });
    }
  }

  boot();
})();
