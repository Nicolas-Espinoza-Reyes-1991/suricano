(() => {
  "use strict";

  const TOKEN_KEY = "suricano_admin_token";
  const titles = {
    burrito: "Burritos",
    papas: "Papas",
    drink: "Bebidas",
    extra: "Extras",
    custom: "Secciones (productos)",
    categories: "Categorías",
  };
  const scopeLabel = {
    burrito: "Filtro burrito",
    papas: "Filtro papas",
    section: "Sección carta",
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
    newBtn: document.getElementById("newBtn"),
    seedBtn: document.getElementById("seedBtn"),
    logoutBtn: document.getElementById("logoutBtn"),
    editor: document.getElementById("editor"),
    editorForm: document.getElementById("editorForm"),
    editorTitle: document.getElementById("editorTitle"),
    editorError: document.getElementById("editorError"),
    closeEditor: document.getElementById("closeEditor"),
    cancelBtn: document.getElementById("cancelBtn"),
    deleteBtn: document.getElementById("deleteBtn"),
    catEditor: document.getElementById("catEditor"),
    catForm: document.getElementById("catForm"),
    catEditorTitle: document.getElementById("catEditorTitle"),
    catError: document.getElementById("catError"),
    closeCatEditor: document.getElementById("closeCatEditor"),
    cancelCatBtn: document.getElementById("cancelCatBtn"),
    deleteCatBtn: document.getElementById("deleteCatBtn"),
  };

  let token = sessionStorage.getItem(TOKEN_KEY) || "";
  let currentView = "burrito";
  let products = [];
  let categories = [];
  let editingId = null;
  let editingCatId = null;

  const money = (n) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(Number(n) || 0);

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
    return categories.filter((c) => c.scope === scope && c.active !== false);
  }

  function fillCategorySelects() {
    const burritoSel = document.getElementById("f_category");
    const customSel = document.getElementById("f_customCategory");
    const burritoOpts = catsByScope("burrito");
    const sectionOpts = catsByScope("section");

    burritoSel.innerHTML = burritoOpts.length
      ? burritoOpts.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")
      : `<option value="solo">Solo</option><option value="papas">Combo + papas</option>`;

    customSel.innerHTML = sectionOpts.length
      ? sectionOpts.map((c) => `<option value="${c.id}">${c.label}</option>`).join("")
      : `<option value="">Crea una categoría con ámbito “Sección”</option>`;
  }

  function setTypeFields(type) {
    document.getElementById("burritoFields").hidden = type !== "burrito";
    document.getElementById("papasFields").hidden = type !== "papas";
    document.getElementById("extraFields").hidden = type !== "extra";
    document.getElementById("customFields").hidden = type !== "custom";
  }

  function filteredProducts() {
    return products.filter((p) => p.type === currentView);
  }

  function renderList() {
    fillCategorySelects();
    el.newBtn.hidden = false;

    if (currentView === "categories") {
      el.listTitle.textContent = `Categorías (${categories.length})`;
      if (!categories.length) {
        el.list.innerHTML = `<p style="color:rgba(247,239,230,.55)">No hay categorías. Crea una para filtros o secciones nuevas.</p>`;
        return;
      }
      el.list.innerHTML = categories
        .map(
          (c) => `
        <article class="card card-cat" data-cat-id="${c.id}">
          <div style="width:64px;height:64px;border-radius:10px;background:#2a1a22;display:grid;place-items:center;font-size:.7rem;color:rgba(247,239,230,.5);text-align:center;padding:.25rem">${scopeLabel[c.scope] || c.scope}</div>
          <div>
            <h3>${c.label}${c.active === false ? " · oculta" : ""}</h3>
            <p>${c.id} · ${c.description || "Sin descripción"}</p>
          </div>
          <div class="price">#${c.sort_order ?? 0}</div>
        </article>`
        )
        .join("");
      return;
    }

    const items = filteredProducts();
    el.listTitle.textContent = `${titles[currentView]} (${items.length})`;
    if (!items.length) {
      const hint =
        currentView === "custom"
          ? "No hay productos de sección. Crea una categoría con ámbito “Sección” y luego un producto aquí."
          : "No hay productos. Crea uno o pulsa “Sembrar carta”.";
      el.list.innerHTML = `<p style="color:rgba(247,239,230,.55)">${hint}</p>`;
      return;
    }
    el.list.innerHTML = items
      .map((p) => {
        const img = p.image
          ? `<img src="/${p.image.replace(/^\//, "")}" alt="" onerror="this.style.opacity=.2" />`
          : `<div style="width:64px;height:64px;border-radius:10px;background:#2a1a22"></div>`;
        const sub =
          p.type === "custom"
            ? `Sección: ${p.category || "—"}`
            : p.desc || p.description || "Sin descripción";
        return `
        <article class="card" data-id="${p.id}">
          ${img}
          <div>
            <h3>${p.name}</h3>
            <p>${sub}</p>
          </div>
          <div class="price">${money(p.price)}</div>
        </article>`;
      })
      .join("");
  }

  function openEditor(product) {
    const type = currentView === "categories" ? "burrito" : currentView;
    editingId = product?.id || null;
    el.editorTitle.textContent = editingId ? "Editar producto" : "Nuevo producto";
    el.deleteBtn.hidden = !editingId;
    el.editorError.hidden = true;
    fillCategorySelects();

    document.getElementById("f_type").value = type;
    document.getElementById("f_id").value = product?.id || "";
    document.getElementById("f_id").disabled = !!editingId;
    document.getElementById("f_name").value = product?.name || "";
    document.getElementById("f_price").value = product?.price ?? "";
    document.getElementById("f_desc").value = product?.desc || product?.description || "";
    document.getElementById("f_image").value = product?.image || "";
    document.getElementById("f_featured").checked = !!product?.featured;
    document.getElementById("f_active").checked = product?.active !== false;

    document.getElementById("f_category").value = product?.category || catsByScope("burrito")[0]?.id || "solo";
    document.getElementById("f_tag").value = product?.tag || "";
    document.getElementById("f_tagStyle").value = product?.tagStyle || "";
    document.getElementById("f_heat").value = product?.heat ?? 0;
    document.getElementById("f_size").value = String(product?.size || 1);
    document.getElementById("f_group").value = product?.group || "proteinas";
    document.getElementById("f_kind").value = product?.kind || "";
    document.getElementById("f_flavors").value = (product?.flavors || []).join(", ");
    document.getElementById("f_pick").value = product?.pick || 0;
    document.getElementById("f_customCategory").value =
      product?.category || catsByScope("section")[0]?.id || "";
    document.getElementById("f_customTag").value = product?.tag || "";
    document.getElementById("f_customTagStyle").value = product?.tagStyle || "";

    setTypeFields(type);
    el.editor.showModal();
  }

  function openCatEditor(cat) {
    editingCatId = cat?.id || null;
    el.catEditorTitle.textContent = editingCatId ? "Editar categoría" : "Nueva categoría";
    el.deleteCatBtn.hidden = !editingCatId;
    el.catError.hidden = true;
    document.getElementById("c_id").value = cat?.id || "";
    document.getElementById("c_id").disabled = !!editingCatId;
    document.getElementById("c_label").value = cat?.label || "";
    document.getElementById("c_scope").value = cat?.scope || "section";
    document.getElementById("c_desc").value = cat?.description || "";
    document.getElementById("c_sort").value = cat?.sort_order ?? 1;
    document.getElementById("c_active").checked = cat?.active !== false;
    el.catEditor.showModal();
  }

  function readForm() {
    const type = document.getElementById("f_type").value;
    const payload = {
      type,
      id: document.getElementById("f_id").value.trim(),
      name: document.getElementById("f_name").value.trim(),
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
    if (type === "drink") {
      payload.kind = "drink";
    }
    if (type === "extra") {
      payload.group = document.getElementById("f_group").value;
      payload.kind = document.getElementById("f_kind").value.trim() || undefined;
      const flavors = document
        .getElementById("f_flavors")
        .value.split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (flavors.length) payload.flavors = flavors;
      const pick = Number(document.getElementById("f_pick").value) || 0;
      if (pick) payload.pick = pick;
    }
    if (type === "custom") {
      payload.kind = "custom";
      payload.category = document.getElementById("f_customCategory").value;
      payload.tag = document.getElementById("f_customTag").value.trim();
      payload.tagStyle = document.getElementById("f_customTagStyle").value;
    }
    return payload;
  }

  function readCatForm() {
    return {
      id: document.getElementById("c_id").value.trim(),
      label: document.getElementById("c_label").value.trim(),
      scope: document.getElementById("c_scope").value,
      description: document.getElementById("c_desc").value.trim(),
      sort_order: Number(document.getElementById("c_sort").value) || 0,
      active: document.getElementById("c_active").checked,
    };
  }

  async function refresh() {
    el.statusLine.textContent = "Sincronizando…";
    const [prodData, catData] = await Promise.all([
      api("/api/admin/products"),
      api("/api/admin/categories"),
    ]);
    products = prodData.products || [];
    categories = catData.categories || [];
    el.statusLine.textContent = `${products.length} productos · ${categories.length} categorías · ${new Date().toLocaleTimeString("es-CL")}`;
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
    if (currentView === "categories") openCatEditor(null);
    else openEditor(null);
  });

  el.list.addEventListener("click", (e) => {
    const catCard = e.target.closest("[data-cat-id]");
    if (catCard) {
      const cat = categories.find((c) => c.id === catCard.dataset.catId);
      if (cat) openCatEditor(cat);
      return;
    }
    const card = e.target.closest(".card[data-id]");
    if (!card) return;
    const product = products.find((p) => p.id === card.dataset.id);
    if (product) openEditor(product);
  });

  el.closeEditor.addEventListener("click", () => el.editor.close());
  el.cancelBtn.addEventListener("click", () => el.editor.close());
  el.closeCatEditor.addEventListener("click", () => el.catEditor.close());
  el.cancelCatBtn.addEventListener("click", () => el.catEditor.close());

  el.editorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.editorError.hidden = true;
    const payload = readForm();
    if (payload.type === "custom" && !payload.category) {
      el.editorError.textContent = "Elige una sección (categoría scope=section) o créala primero.";
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
    if (!confirm(`¿Eliminar “${editingId}”?`)) return;
    try {
      await api(`/api/admin/products/${encodeURIComponent(editingId)}`, {
        method: "DELETE",
      });
      el.editor.close();
      await refresh();
    } catch (err) {
      el.editorError.textContent = err.message;
      el.editorError.hidden = false;
    }
  });

  el.catForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.catError.hidden = true;
    const payload = readCatForm();
    try {
      if (editingCatId) {
        await api(`/api/admin/categories/${encodeURIComponent(editingCatId)}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await api("/api/admin/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      el.catEditor.close();
      await refresh();
    } catch (err) {
      el.catError.textContent = err.message;
      el.catError.hidden = false;
    }
  });

  el.deleteCatBtn.addEventListener("click", async () => {
    if (!editingCatId) return;
    if (!confirm(`¿Eliminar categoría “${editingCatId}”?`)) return;
    try {
      await api(`/api/admin/categories/${encodeURIComponent(editingCatId)}`, {
        method: "DELETE",
      });
      el.catEditor.close();
      await refresh();
    } catch (err) {
      el.catError.textContent = err.message;
      el.catError.hidden = false;
    }
  });

  el.seedBtn.addEventListener("click", async () => {
    if (!confirm("¿Cargar/reemplazar la carta inicial desde data/menu.json?")) return;
    try {
      const data = await api("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({ action: "seed" }),
      });
      alert(`Listo: ${data.seeded} filas sembradas.`);
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
