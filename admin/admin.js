(() => {
  "use strict";

  const TOKEN_KEY = "suricano_admin_token";

  const titles = {
    burrito: "Burritos",
    papas: "Papas",
    drink: "Bebidas",
    extra: "Extras",
    custom: "Otros en la carta",
    filters: "Filtros de la web",
  };

  const leads = {
    burrito: "Edita burritos. El filtro Solo / Combo está en “Filtros web”.",
    papas: "Edita papas por tamaño.",
    drink: "Bebidas de la carta.",
    extra: "Extras del carrito (salsas, potes…).",
    custom: "Bloques extra como Postres o Promos. Primero crea el bloque, luego productos.",
    filters: "Botones de filtro en Burritos y Papas (no son productos).",
  };

  const el = {
    loginView: document.getElementById("loginView"),
    appView: document.getElementById("appView"),
    loginForm: document.getElementById("loginForm"),
    password: document.getElementById("password"),
    loginError: document.getElementById("loginError"),
    statusLine: document.getElementById("statusLine"),
    list: document.getElementById("list"),
    listTitle: document.getElementById("listTitle"),
    listLead: document.getElementById("listLead"),
    newBtn: document.getElementById("newBtn"),
    secondaryBtn: document.getElementById("secondaryBtn"),
    seedBtn: document.getElementById("seedBtn"),
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

  function catsByScope(scope) {
    return categories
      .filter((c) => c.scope === scope)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }

  function sectionCats() {
    return catsByScope("section");
  }

  function filterCats() {
    return categories.filter((c) => c.scope === "burrito" || c.scope === "papas");
  }

  function fillCategorySelects() {
    const burritoSel = document.getElementById("f_category");
    const customSel = document.getElementById("f_customCategory");
    const burritoOpts = catsByScope("burrito").filter((c) => c.active !== false);
    const sectionOpts = sectionCats().filter((c) => c.active !== false);

    burritoSel.innerHTML = burritoOpts.length
      ? burritoOpts.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")
      : `<option value="solo">Solo</option><option value="papas">Combo + papas</option>`;

    customSel.innerHTML = sectionOpts.length
      ? sectionOpts.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")
      : `<option value="">— Crea un bloque primero —</option>`;
  }

  function setTypeFields(type) {
    document.getElementById("burritoFields").hidden = type !== "burrito";
    document.getElementById("papasFields").hidden = type !== "papas";
    document.getElementById("extraFields").hidden = type !== "extra";
    document.getElementById("customFields").hidden = type !== "custom";
  }

  function updateToolbar() {
    el.listTitle.textContent = titles[currentView];
    el.listLead.textContent = leads[currentView];
    el.secondaryBtn.hidden = true;

    if (currentView === "custom") {
      el.newBtn.textContent = "+ Producto";
      el.secondaryBtn.hidden = false;
      el.secondaryBtn.textContent = "+ Nuevo bloque";
    } else if (currentView === "filters") {
      el.newBtn.textContent = "+ Filtro";
    } else {
      el.newBtn.textContent = "+ Agregar";
    }
  }

  function renderList() {
    fillCategorySelects();
    updateToolbar();

    if (currentView === "filters") {
      const items = filterCats();
      el.listTitle.textContent = `Filtros (${items.length})`;
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
              <p>Botón de filtro en la web</p>
            </div>
          </article>`;
        })
        .join("");
      return;
    }

    if (currentView === "custom") {
      const blocks = sectionCats();
      const customs = products.filter((p) => p.type === "custom");
      el.listTitle.textContent = `Otros (${customs.length})`;

      if (!blocks.length && !customs.length) {
        el.list.innerHTML = `
          <div class="empty-state">
            <p><strong>¿Quieres Postres, Promos u otra sección?</strong></p>
            <p>1) Crea un <em>bloque</em> · 2) Agrega productos dentro</p>
            <button type="button" class="btn btn-primary" id="emptyNewBlock">+ Crear primer bloque</button>
          </div>`;
        document.getElementById("emptyNewBlock")?.addEventListener("click", () => openBlockEditor(null));
        return;
      }

      const parts = [];
      blocks.forEach((b) => {
        const inBlock = customs.filter((p) => p.category === b.id);
        parts.push(`
          <div class="group-head">
            <div>
              <h3>${b.label}${b.active === false ? " · oculto" : ""}</h3>
              <p>${b.description || `${inBlock.length} producto(s)`}</p>
            </div>
            <button type="button" class="btn btn-ghost btn-sm" data-edit-block="${b.id}">Editar bloque</button>
          </div>`);
        if (!inBlock.length) {
          parts.push(`<p class="empty-inline">Sin productos aún. Pulsa “+ Producto”.</p>`);
        } else {
          inBlock.forEach((p) => {
            const img = p.image
              ? `<img src="/${p.image.replace(/^\//, "")}" alt="" onerror="this.style.opacity=.2" />`
              : `<div class="card-placeholder"></div>`;
            parts.push(`
              <article class="card" data-id="${p.id}">
                ${img}
                <div>
                  <h3>${p.name}</h3>
                  <p>${p.desc || p.description || "Sin descripción"}</p>
                </div>
                <div class="price">${money(p.price)}</div>
              </article>`);
          });
        }
      });

      const orphans = customs.filter((p) => !blocks.some((b) => b.id === p.category));
      orphans.forEach((p) => {
        parts.push(`
          <article class="card" data-id="${p.id}">
            <div class="card-placeholder"></div>
            <div>
              <h3>${p.name}</h3>
              <p>Sin bloque asignado</p>
            </div>
            <div class="price">${money(p.price)}</div>
          </article>`);
      });

      el.list.innerHTML = parts.join("");
      return;
    }

    const items = products.filter((p) => p.type === currentView);
    el.listTitle.textContent = `${titles[currentView]} (${items.length})`;
    if (!items.length) {
      el.list.innerHTML = `<div class="empty-state"><p>No hay productos. Pulsa “+ Agregar” o “Restaurar carta”.</p></div>`;
      return;
    }
    el.list.innerHTML = items
      .map((p) => {
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
      })
      .join("");
  }

  function openEditor(product) {
    const productType =
      product?.type || (currentView === "custom" ? "custom" : currentView);
    editingId = product?.id || null;
    el.editorTitle.textContent = editingId ? "Editar producto" : "Nuevo producto";
    el.deleteBtn.hidden = !editingId;
    el.editorError.hidden = true;
    fillCategorySelects();

    document.getElementById("f_type").value = productType;
    document.getElementById("f_id").value = product?.id || "";
    document.getElementById("f_name").value = product?.name || "";
    document.getElementById("f_price").value = product?.price ?? "";
    document.getElementById("f_desc").value = product?.desc || product?.description || "";
    document.getElementById("f_image").value = product?.image || "";
    document.getElementById("f_featured").checked = !!product?.featured;
    document.getElementById("f_active").checked = product?.active !== false;

    document.getElementById("f_category").value =
      product?.category || catsByScope("burrito")[0]?.id || "solo";
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
    document.getElementById("f_customCategory").value =
      product?.category || sectionCats().filter((c) => c.active !== false)[0]?.id || "";
    document.getElementById("f_customTag").value = product?.tag || "";

    setTypeFields(productType);
    el.editor.showModal();
  }

  function openBlockEditor(cat) {
    editingBlockId = cat?.id || null;
    el.blockTitle.textContent = editingBlockId ? "Editar bloque" : "Nuevo bloque";
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
      payload.category = document.getElementById("f_customCategory").value;
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
    el.statusLine.textContent = `${products.length} productos · actualizado ${new Date().toLocaleTimeString("es-CL")}`;
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

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      currentView = btn.dataset.view;
      renderList();
    });
  });

  el.newBtn.addEventListener("click", () => {
    if (currentView === "filters") openFilterEditor(null);
    else if (currentView === "custom") {
      if (!sectionCats().length) {
        openBlockEditor(null);
        return;
      }
      openEditor(null);
    } else openEditor(null);
  });

  el.secondaryBtn.addEventListener("click", () => openBlockEditor(null));

  el.list.addEventListener("click", (e) => {
    const editBlock = e.target.closest("[data-edit-block]");
    if (editBlock) {
      const cat = categories.find((c) => c.id === editBlock.dataset.editBlock);
      if (cat) openBlockEditor(cat);
      return;
    }
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
      el.editorError.textContent = "Primero crea un bloque (Postres, Promos…) y elígelo aquí.";
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
      el.blockError.textContent = "Escribe el nombre del bloque.";
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
      } else {
        await api("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      el.blockEditor.close();
      currentView = "custom";
      document.querySelectorAll(".tab").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.view === "custom");
      });
      await refresh();
    } catch (err) {
      el.blockError.textContent = err.message;
      el.blockError.hidden = false;
    }
  });

  el.deleteBlockBtn.addEventListener("click", async () => {
    if (!editingBlockId) return;
    if (!confirm("¿Eliminar este bloque? Debe estar vacío de productos.")) return;
    try {
      await api(`/api/admin/categories/${encodeURIComponent(editingBlockId)}`, {
        method: "DELETE",
      });
      el.blockEditor.close();
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

  el.seedBtn.addEventListener("click", async () => {
    if (!confirm("¿Restaurar la carta inicial? Puede sobrescribir productos existentes.")) return;
    try {
      const data = await api("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({ action: "seed" }),
      });
      alert(`Listo: ${data.seeded} filas cargadas.`);
      await refresh();
    } catch (err) {
      alert(err.message);
    }
  });

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
