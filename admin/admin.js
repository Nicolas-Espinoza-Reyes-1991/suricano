(() => {
  "use strict";

  const TOKEN_KEY = "suricano_admin_token";
  const titles = {
    burrito: "Burritos",
    papas: "Papas",
    drink: "Bebidas",
    extra: "Extras",
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
  };

  let token = sessionStorage.getItem(TOKEN_KEY) || "";
  let currentType = "burrito";
  let products = [];
  let editingId = null;

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
    el.loginView.hidden = false;
    el.appView.hidden = true;
  }

  function showApp() {
    el.loginView.hidden = true;
    el.appView.hidden = false;
  }

  function setTypeFields() {
    document.getElementById("burritoFields").hidden = currentType !== "burrito";
    document.getElementById("papasFields").hidden = currentType !== "papas";
    document.getElementById("extraFields").hidden = currentType !== "extra";
  }

  function filtered() {
    return products.filter((p) => p.type === currentType);
  }

  function renderList() {
    const items = filtered();
    el.listTitle.textContent = `${titles[currentType]} (${items.length})`;
    if (!items.length) {
      el.list.innerHTML = `<p style="color:rgba(247,239,230,.55)">No hay productos. Crea uno o pulsa “Sembrar carta”.</p>`;
      return;
    }
    el.list.innerHTML = items
      .map((p) => {
        const img = p.image
          ? `<img src="/${p.image.replace(/^\//, "")}" alt="" onerror="this.style.opacity=.2" />`
          : `<div style="width:64px;height:64px;border-radius:10px;background:#2a1a22"></div>`;
        return `
        <article class="card" data-id="${p.id}">
          ${img}
          <div>
            <h3>${p.name}</h3>
            <p>${p.desc || p.description || "Sin descripción"}</p>
          </div>
          <div class="price">${money(p.price)}</div>
        </article>`;
      })
      .join("");
  }

  function openEditor(product) {
    editingId = product?.id || null;
    el.editorTitle.textContent = editingId ? "Editar producto" : "Nuevo producto";
    el.deleteBtn.hidden = !editingId;
    el.editorError.hidden = true;

    document.getElementById("f_type").value = currentType;
    document.getElementById("f_id").value = product?.id || "";
    document.getElementById("f_id").disabled = !!editingId;
    document.getElementById("f_name").value = product?.name || "";
    document.getElementById("f_price").value = product?.price ?? "";
    document.getElementById("f_desc").value = product?.desc || product?.description || "";
    document.getElementById("f_image").value = product?.image || "";
    document.getElementById("f_featured").checked = !!product?.featured;
    document.getElementById("f_active").checked = product?.active !== false;

    document.getElementById("f_category").value = product?.category || "solo";
    document.getElementById("f_tag").value = product?.tag || "";
    document.getElementById("f_tagStyle").value = product?.tagStyle || "";
    document.getElementById("f_heat").value = product?.heat ?? 0;
    document.getElementById("f_size").value = String(product?.size || 1);
    document.getElementById("f_group").value = product?.group || "proteinas";
    document.getElementById("f_kind").value = product?.kind || "";
    document.getElementById("f_flavors").value = (product?.flavors || []).join(", ");
    document.getElementById("f_pick").value = product?.pick || 0;

    setTypeFields();
    el.editor.showModal();
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
    return payload;
  }

  async function refresh() {
    el.statusLine.textContent = "Sincronizando…";
    const data = await api("/api/admin/products");
    products = data.products || [];
    el.statusLine.textContent = `${products.length} productos · ${new Date().toLocaleTimeString("es-CL")}`;
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
      currentType = btn.dataset.type;
      renderList();
    });
  });

  el.newBtn.addEventListener("click", () => openEditor(null));

  el.list.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const product = products.find((p) => p.id === card.dataset.id);
    if (product) openEditor(product);
  });

  el.closeEditor.addEventListener("click", () => el.editor.close());
  el.cancelBtn.addEventListener("click", () => el.editor.close());

  el.editorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.editorError.hidden = true;
    const payload = readForm();
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

  el.seedBtn.addEventListener("click", async () => {
    if (!confirm("¿Cargar/reemplazar la carta inicial desde data/menu.json?")) return;
    try {
      const data = await api("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({ action: "seed" }),
      });
      alert(`Listo: ${data.seeded} productos sembrados.`);
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
