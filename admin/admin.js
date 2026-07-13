(() => {
  "use strict";

  const TOKEN_KEY = "suricano_admin_token";

  const CORE_TABS = [
    { view: "burrito", label: "Burritos", lead: "Menú de burritos." },
    { view: "papas", label: "Papas", lead: "Menú de papas." },
    { view: "drink", label: "Bebidas", lead: "Bebidas de la carta." },
    { view: "extra", label: "Extras", lead: "Extras del carrito (salsas, potes…)." },
  ];

  const el = {
    loginView: document.getElementById("loginView"),
    appView: document.getElementById("appView"),
    loginForm: document.getElementById("loginForm"),
    password: document.getElementById("password"),
    loginError: document.getElementById("loginError"),
    statusLine: document.getElementById("statusLine"),
    tabs: document.getElementById("tabs"),
    list: document.getElementById("list"),
    listTitle: document.getElementById("listTitle"),
    listLead: document.getElementById("listLead"),
    newBtn: document.getElementById("newBtn"),
    secondaryBtn: document.getElementById("secondaryBtn"),
    logoutBtn: document.getElementById("logoutBtn"),
    editor: document.getElementById("editor"),
    editorForm: document.getElementById("editorForm"),
    editorTitle: document.getElementById("editorTitle"),
    editorError: document.getElementById("editorError"),
    closeEditor: document.getElementById("closeEditor"),
    cancelBtn: document.getElementById("cancelBtn"),
    deleteBtn: document.getElementById("deleteBtn"),
    blockEditor: document.getElementById("blockEditor"),
    blockForm: document.getElementById("blockForm"),
    blockTitle: document.getElementById("blockTitle"),
    blockError: document.getElementById("blockError"),
    closeBlock: document.getElementById("closeBlock"),
    cancelBlock: document.getElementById("cancelBlock"),
    deleteBlockBtn: document.getElementById("deleteBlockBtn"),
    filterEditor: document.getElementById("filterEditor"),
    filterForm: document.getElementById("filterForm"),
    filterTitle: document.getElementById("filterTitle"),
    filterError: document.getElementById("filterError"),
    closeFilter: document.getElementById("closeFilter"),
    cancelFilter: document.getElementById("cancelFilter"),
    deleteFilterBtn: document.getElementById("deleteFilterBtn"),
  };

  let token = sessionStorage.getItem(TOKEN_KEY) || "";
  let currentView = "burrito";
  let products = [];
  let categories = [];
  let editingId = null;
  let editingBlockId = null;
  let editingFilterId = null;

  const money = (n) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);

  function slugify(text) {
    return String(text || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);
  }

  function uniqueSlug(base, taken) {
    let id = slugify(base) || `item-${Date.now()}`;
    if (!taken.has(id)) return id;
    let i = 2;
    while (taken.has(`${id}-${i}`)) i += 1;
    return `${id}-${i}`;
  }

  async function api(path, options = {}) {
    const headers = {
      "content-type": "application/json",
      ...(options.headers || {}),
    };
    if (token) headers.authorization = `Bearer ${token}`;
    const res = await fetch(path, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || `Error ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return data;
  }

  function showLogin() {
    el.password.value = "";
    el.loginError.hidden = true;
    el.appView.hidden = true;
    el.loginView.hidden = false;
    el.loginView.style.display = "";
    el.appView.style.display = "none";
  }

  function showApp() {
    el.loginView.hidden = true;
    el.appView.hidden = false;
    el.loginView.style.display = "none";
    el.appView.style.display = "";
  }

  function sectionCats() {
    return categories
      .filter((c) => c.scope === "section")
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.label.localeCompare(b.label));
  }

  function filterCats() {
    return categories
      .filter((c) => c.scope === "burrito" || c.scope === "papas")
      .sort((a, b) => a.scope.localeCompare(b.scope) || (a.sort_order || 0) - (b.sort_order || 0));
  }

  function burritoFilters() {
    return categories
      .filter((c) => c.scope === "burrito" && c.active !== false)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  function isSectionView(view = currentView) {
    return String(view).startsWith("sec:");
  }

  function sectionIdFromView(view = currentView) {
    return isSectionView(view) ? view.slice(4) : "";
  }

  function currentSection() {
    const id = sectionIdFromView();
    return categories.find((c) => c.id === id) || null;
  }

  function renderTabs() {
    const sections = sectionCats();
    const parts = CORE_TABS.map(
      (t) =>
        `<button type="button" class="tab${currentView === t.view ? " is-active" : ""}" data-view="${t.view}">${t.label}</button>`
    );

    sections.forEach((s) => {
      const view = `sec:${s.id}`;
      const hiddenMark = s.active === false ? " ·" : "";
      parts.push(
        `<button type="button" class="tab tab-section${currentView === view ? " is-active" : ""}" data-view="${view}">${s.label}${hiddenMark}</button>`
      );
    });

    parts.push(
      `<button type="button" class="tab tab-add" data-action="add-section" title="Nueva sección en la carta">+ Sección</button>`
    );
    parts.push(
      `<button type="button" class="tab${currentView === "filters" ? " is-active" : ""}" data-view="filters">Filtros</button>`
    );

    el.tabs.innerHTML = parts.join("");
  }

  function setTypeFields(type) {
    document.getElementById("burritoFields").hidden = type !== "burrito";
    document.getElementById("papasFields").hidden = type !== "papas";
    document.getElementById("extraFields").hidden = type !== "extra";
    document.getElementById("customFields").hidden = type !== "custom";
  }

  function fillBurritoFilters() {
    const sel = document.getElementById("f_category");
    const opts = burritoFilters();
    sel.innerHTML = opts.length
      ? opts.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")
      : `<option value="solo">Solo</option><option value="papas">Combo + papas</option>`;
  }

  function updateToolbar() {
    el.secondaryBtn.hidden = true;

    if (currentView === "filters") {
      el.listTitle.textContent = "Filtros de la web";
      el.listLead.textContent = "Botones Solo / Combo / tamaños en Burritos y Papas.";
      el.newBtn.textContent = "+ Filtro";
      return;
    }

    if (isSectionView()) {
      const sec = currentSection();
      const count = products.filter((p) => p.type === "custom" && p.category === sec?.id).length;
      el.listTitle.textContent = `${sec?.label || "Sección"} (${count})`;
      el.listLead.textContent =
        sec?.description || "Productos de esta sección. Se muestran en la carta pública.";
      el.newBtn.textContent = "+ Producto";
      el.secondaryBtn.hidden = false;
      el.secondaryBtn.textContent = "Editar sección";
      return;
    }

    const core = CORE_TABS.find((t) => t.view === currentView);
    const count = products.filter((p) => p.type === currentView).length;
    el.listTitle.textContent = `${core?.label || currentView} (${count})`;
    el.listLead.textContent = core?.lead || "";
    el.newBtn.textContent = "+ Agregar";
  }

  function productCard(p) {
    const img = p.image
      ? `<img src="/${p.image.replace(/^\//, "")}" alt="" onerror="this.style.opacity=.2" />`
      : `<div class="card-placeholder"></div>`;
    return `
      <article class="card" data-id="${p.id}">
        ${img}
        <div>
          <h3>${p.name}${p.active === false ? " · oculto" : ""}</h3>
          <p>${p.desc || p.description || "Sin descripción"}</p>
        </div>
        <div class="price">${money(p.price)}</div>
      </article>`;
  }

  function renderList() {
    renderTabs();
    fillBurritoFilters();
    updateToolbar();

    if (currentView === "filters") {
      const items = filterCats();
      if (!items.length) {
        el.list.innerHTML = `<div class="empty-state"><p>No hay filtros. Agrega “Solo”, “Combo”, etc.</p></div>`;
        return;
      }
      el.list.innerHTML = items
        .map((c) => {
          const where = c.scope === "papas" ? "Papas" : "Burritos";
          return `
          <article class="card" data-filter-id="${c.id}">
            <div class="card-badge">${where}</div>
            <div>
              <h3>${c.label}${c.active === false ? " · oculto" : ""}</h3>
              <p>Filtro en la web</p>
            </div>
          </article>`;
        })
        .join("");
      return;
    }

    if (isSectionView()) {
      const sec = currentSection();
      if (!sec) {
        currentView = "burrito";
        renderList();
        return;
      }
      const items = products
        .filter((p) => p.type === "custom" && p.category === sec.id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.name.localeCompare(b.name));

      if (!items.length) {
        el.list.innerHTML = `
          <div class="empty-state">
            <p><strong>${sec.label}</strong> aún no tiene productos.</p>
            <p>Agrega el primero para que se vea en la web.</p>
          </div>`;
        return;
      }
      el.list.innerHTML = items.map(productCard).join("");
      return;
    }

    const items = products
      .filter((p) => p.type === currentView)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0) || a.name.localeCompare(b.name));

    if (!items.length) {
      el.list.innerHTML = `<div class="empty-state"><p>No hay productos. Pulsa “+ Agregar”.</p></div>`;
      return;
    }
    el.list.innerHTML = items.map(productCard).join("");
  }

  function openEditor(product) {
    let productType = product?.type;
    if (!productType) {
      if (isSectionView()) productType = "custom";
      else productType = currentView;
    }

    editingId = product?.id || null;
    el.editorTitle.textContent = editingId ? "Editar producto" : "Nuevo producto";
    el.deleteBtn.hidden = !editingId;
    el.editorError.hidden = true;
    fillBurritoFilters();

    document.getElementById("f_type").value = productType;
    document.getElementById("f_id").value = product?.id || "";
    document.getElementById("f_name").value = product?.name || "";
    document.getElementById("f_price").value = product?.price ?? "";
    document.getElementById("f_desc").value = product?.desc || product?.description || "";
    document.getElementById("f_image").value = product?.image || "";
    document.getElementById("f_featured").checked = !!product?.featured;
    document.getElementById("f_active").checked = product?.active !== false;

    document.getElementById("f_category").value =
      product?.category || burritoFilters()[0]?.id || "solo";
    document.getElementById("f_tag").value = product?.tag || "";
    document.getElementById("f_tagStyle").value = product?.tagStyle || "";
    document.getElementById("f_heat").value = String(product?.heat ?? 0);
    document.getElementById("f_size").value = String(product?.size || 1);
    document.getElementById("f_group").value = product?.group || "proteinas";
    const isPote = product?.kind === "pote";
    document.getElementById("f_isPote").checked = isPote;
    document.getElementById("poteExtraFields").hidden = !isPote;
    document.getElementById("f_flavors").value = (product?.flavors || []).join(", ");
    document.getElementById("f_pick").value = product?.pick || 3;

    const secId = product?.category || sectionIdFromView();
    const sec = categories.find((c) => c.id === secId);
    document.getElementById("f_customCategory").value = secId || "";
    document.getElementById("f_customHint").textContent = sec
      ? `Se publicará en la sección “${sec.label}”.`
      : "Se publicará en esta sección.";
    document.getElementById("f_customTag").value = product?.tag || "";

    setTypeFields(productType);
    el.editor.showModal();
  }

  function openBlockEditor(cat) {
    editingBlockId = cat?.id || null;
    el.blockTitle.textContent = editingBlockId ? "Editar sección" : "Nueva sección";
    el.deleteBlockBtn.hidden = !editingBlockId;
    el.blockError.hidden = true;
    document.getElementById("b_id").value = cat?.id || "";
    document.getElementById("b_label").value = cat?.label || "";
    document.getElementById("b_desc").value = cat?.description || "";
    document.getElementById("b_active").checked = cat?.active !== false;
    el.blockEditor.showModal();
  }

  function openFilterEditor(cat) {
    editingFilterId = cat?.id || null;
    el.filterTitle.textContent = editingFilterId ? "Editar filtro" : "Nuevo filtro";
    el.deleteFilterBtn.hidden = !editingFilterId;
    el.filterError.hidden = true;
    document.getElementById("fi_id").value = cat?.id || "";
    document.getElementById("fi_label").value = cat?.label || "";
    document.getElementById("fi_scope").value = cat?.scope === "papas" ? "papas" : "burrito";
    document.getElementById("fi_active").checked = cat?.active !== false;
    el.filterEditor.showModal();
  }

  function readProductForm() {
    const type = document.getElementById("f_type").value;
    const name = document.getElementById("f_name").value.trim();
    const taken = new Set(products.map((p) => p.id));
    if (editingId) taken.delete(editingId);
    const id = editingId || uniqueSlug(name, taken);

    const payload = {
      type,
      id,
      name,
      price: Number(document.getElementById("f_price").value) || 0,
      desc: document.getElementById("f_desc").value.trim(),
      image: document.getElementById("f_image").value.trim(),
      featured: document.getElementById("f_featured").checked,
      active: document.getElementById("f_active").checked,
    };

    if (type === "burrito") {
      payload.category = document.getElementById("f_category").value;
      payload.tag = document.getElementById("f_tag").value.trim();
      payload.tagStyle = document.getElementById("f_tagStyle").value;
      payload.heat = Number(document.getElementById("f_heat").value) || 0;
    }
    if (type === "papas") {
      payload.kind = "papas";
      payload.size = Number(document.getElementById("f_size").value) || 1;
    }
    if (type === "drink") payload.kind = "drink";
    if (type === "extra") {
      payload.group = document.getElementById("f_group").value;
      if (document.getElementById("f_isPote").checked) {
        payload.kind = "pote";
        payload.flavors = document
          .getElementById("f_flavors")
          .value.split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        payload.pick = Number(document.getElementById("f_pick").value) || 3;
      }
    }
    if (type === "custom") {
      payload.kind = "custom";
      payload.category =
        document.getElementById("f_customCategory").value || sectionIdFromView();
      payload.tag = document.getElementById("f_customTag").value.trim();
    }
    return payload;
  }

  async function refresh() {
    el.statusLine.textContent = "Sincronizando…";
    const [prodData, catData] = await Promise.all([
      api("/api/admin/products"),
      api("/api/admin/categories"),
    ]);
    products = prodData.products || [];
    categories = catData.categories || [];
    el.statusLine.textContent = `${products.length} productos · ${new Date().toLocaleTimeString("es-CL")}`;

    if (isSectionView() && !currentSection()) {
      currentView = "burrito";
    }
    renderList();
  }

  el.loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.loginError.hidden = true;
    try {
      const data = await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password: el.password.value }),
      });
      token = data.token;
      sessionStorage.setItem(TOKEN_KEY, token);
      showApp();
      await refresh();
    } catch (err) {
      el.loginError.textContent = err.message;
      el.loginError.hidden = false;
    }
  });

  el.logoutBtn.addEventListener("click", () => {
    token = "";
    sessionStorage.removeItem(TOKEN_KEY);
    showLogin();
  });

  el.tabs.addEventListener("click", (e) => {
    const add = e.target.closest("[data-action='add-section']");
    if (add) {
      openBlockEditor(null);
      return;
    }
    const btn = e.target.closest("[data-view]");
    if (!btn) return;
    currentView = btn.dataset.view;
    renderList();
  });

  el.newBtn.addEventListener("click", () => {
    if (currentView === "filters") openFilterEditor(null);
    else openEditor(null);
  });

  el.secondaryBtn.addEventListener("click", () => {
    if (isSectionView()) openBlockEditor(currentSection());
  });

  el.list.addEventListener("click", (e) => {
    const filterCard = e.target.closest("[data-filter-id]");
    if (filterCard) {
      const cat = categories.find((c) => c.id === filterCard.dataset.filterId);
      if (cat) openFilterEditor(cat);
      return;
    }
    const card = e.target.closest(".card[data-id]");
    if (!card) return;
    const product = products.find((p) => p.id === card.dataset.id);
    if (product) openEditor(product);
  });

  document.getElementById("f_isPote").addEventListener("change", (e) => {
    document.getElementById("poteExtraFields").hidden = !e.target.checked;
  });

  el.closeEditor.addEventListener("click", () => el.editor.close());
  el.cancelBtn.addEventListener("click", () => el.editor.close());
  el.closeBlock.addEventListener("click", () => el.blockEditor.close());
  el.cancelBlock.addEventListener("click", () => el.blockEditor.close());
  el.closeFilter.addEventListener("click", () => el.filterEditor.close());
  el.cancelFilter.addEventListener("click", () => el.filterEditor.close());

  el.editorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.editorError.hidden = true;
    const payload = readProductForm();
    if (!payload.name) {
      el.editorError.textContent = "Escribe el nombre del producto.";
      el.editorError.hidden = false;
      return;
    }
    if (payload.type === "custom" && !payload.category) {
      el.editorError.textContent = "Esta sección no es válida. Recarga e inténtalo.";
      el.editorError.hidden = false;
      return;
    }
    try {
      if (editingId) {
        await api(`/api/admin/products/${encodeURIComponent(editingId)}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/admin/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      el.editor.close();
      await refresh();
    } catch (err) {
      el.editorError.textContent = err.message;
      el.editorError.hidden = false;
    }
  });

  el.deleteBtn.addEventListener("click", async () => {
    if (!editingId) return;
    const name = document.getElementById("f_name").value || editingId;
    if (!confirm(`¿Eliminar “${name}”?`)) return;
    try {
      await api(`/api/admin/products/${encodeURIComponent(editingId)}`, { method: "DELETE" });
      el.editor.close();
      await refresh();
    } catch (err) {
      el.editorError.textContent = err.message;
      el.editorError.hidden = false;
    }
  });

  el.blockForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.blockError.hidden = true;
    const label = document.getElementById("b_label").value.trim();
    if (!label) {
      el.blockError.textContent = "Escribe el nombre (ej. Completos).";
      el.blockError.hidden = false;
      return;
    }
    const taken = new Set(categories.map((c) => c.id));
    if (editingBlockId) taken.delete(editingBlockId);
    const id = editingBlockId || uniqueSlug(label, taken);
    const payload = {
      id,
      label,
      scope: "section",
      description: document.getElementById("b_desc").value.trim(),
      active: document.getElementById("b_active").checked,
    };
    try {
      if (editingBlockId) {
        await api(`/api/admin/categories/${encodeURIComponent(editingBlockId)}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        currentView = `sec:${editingBlockId}`;
      } else {
        await api("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        currentView = `sec:${id}`;
      }
      el.blockEditor.close();
      await refresh();
    } catch (err) {
      el.blockError.textContent = err.message;
      el.blockError.hidden = false;
    }
  });

  el.deleteBlockBtn.addEventListener("click", async () => {
    if (!editingBlockId) return;
    if (!confirm("¿Eliminar esta sección? Debe estar sin productos.")) return;
    try {
      await api(`/api/admin/categories/${encodeURIComponent(editingBlockId)}`, {
        method: "DELETE",
      });
      el.blockEditor.close();
      currentView = "burrito";
      await refresh();
    } catch (err) {
      el.blockError.textContent = err.message;
      el.blockError.hidden = false;
    }
  });

  el.filterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.filterError.hidden = true;
    const label = document.getElementById("fi_label").value.trim();
    const scope = document.getElementById("fi_scope").value;
    if (!label) {
      el.filterError.textContent = "Escribe el nombre del filtro.";
      el.filterError.hidden = false;
      return;
    }
    const taken = new Set(categories.map((c) => c.id));
    if (editingFilterId) taken.delete(editingFilterId);
    const id = editingFilterId || uniqueSlug(label, taken);
    const payload = {
      id,
      label,
      scope,
      active: document.getElementById("fi_active").checked,
    };
    try {
      if (editingFilterId) {
        await api(`/api/admin/categories/${encodeURIComponent(editingFilterId)}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      el.filterEditor.close();
      await refresh();
    } catch (err) {
      el.filterError.textContent = err.message;
      el.filterError.hidden = false;
    }
  });

  el.deleteFilterBtn.addEventListener("click", async () => {
    if (!editingFilterId) return;
    if (!confirm("¿Eliminar este filtro?")) return;
    try {
      await api(`/api/admin/categories/${encodeURIComponent(editingFilterId)}`, {
        method: "DELETE",
      });
      el.filterEditor.close();
      await refresh();
    } catch (err) {
      el.filterError.textContent = err.message;
      el.filterError.hidden = false;
    }
  });

  // Actualizar textos del diálogo de bloque
  const blockHint = el.blockForm.querySelector(".field-hint");
  if (blockHint) {
    blockHint.textContent =
      "Ejemplos: Completos, Postres, Promos. Aparecerá como pestaña al lado de Burritos y en la carta pública.";
  }

  (async () => {
    if (!token) {
      showLogin();
      return;
    }
    showApp();
    try {
      await refresh();
    } catch (err) {
      if (err.status === 401) {
        token = "";
        sessionStorage.removeItem(TOKEN_KEY);
        showLogin();
      } else {
        el.statusLine.textContent = err.message;
      }
    }
  })();
})();
