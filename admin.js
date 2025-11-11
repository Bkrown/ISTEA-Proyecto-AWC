import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from './env.js';

// ===== CONFIGURACIÓN DE AIRTABLE =====
  const airtableToken = AIRTABLE_TOKEN;//Borrado para pushear a GitHub
  const baseId = BASE_ID;
  const tableName = TABLE_NAME;
  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;
  


// ===== FUNCIÓN PARA OBTENER PRODUCTOS =====
async function getProductsFromAirtable() {
  try {
    const response = await fetch(airtableUrl, {
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    renderProducts(data.records);
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
}

// ===== FUNCIÓN PARA RENDERIZAR =====
function renderProducts(products) {
  const tbody = document.getElementById("product-list");
  tbody.innerHTML = "";

  products.forEach((item) => {
    const producto = item.fields;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${producto.Name || ""}</td>
      <td>$${producto.Price || 0}</td>
      <td>${producto.Category || ""}</td>
      <td><img src="${producto.Img || 'img/sinimagen.jpg'}" alt=""></td>
      <td>
        <button class="action-btn edit" data-id="${item.id}">Editar</button>
        <button class="action-btn delete" data-id="${item.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ===== CREAR / ACTUALIZAR PRODUCTO =====
async function saveProduct(e) {
  e.preventDefault();

  const id = document.getElementById("product-id").value;
  const producto = {
    fields: {
      Name: document.getElementById("name").value,
      Price: parseFloat(document.getElementById("price").value),
      Img: document.getElementById("img").value,
      Description: document.getElementById("description").value,
      Category: document.getElementById("category").value,
    },
  };

  const method = id ? "PATCH" : "POST";
  const url = id ? `${airtableUrl}/${id}` : airtableUrl;

  try {
    await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    });

    alert("Producto guardado correctamente ✅");
    document.getElementById("product-form").reset();
    document.getElementById("product-id").value = "";
    getProductsFromAirtable();
  } catch (error) {
    console.error("Error al guardar producto:", error);
  }
}

// ===== ELIMINAR PRODUCTO =====
async function deleteProduct(id) {
  if (!confirm("¿Seguro que querés eliminar este producto?")) return;
  try {
    await fetch(`${airtableUrl}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${airtableToken}`,
      },
    });
    getProductsFromAirtable();
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// ===== CARGAR DATOS EN FORMULARIO PARA EDITAR =====
document.getElementById("product-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const id = e.target.dataset.id;
    editProduct(id);
  } else if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;
    deleteProduct(id);
  }
});


  // ===== MODAL =====
const modal = document.getElementById("modal");
const btnOpen = document.getElementById("btn-open-modal");
const spanClose = document.querySelector(".close");
const modalTitle = document.getElementById("modal-title");

btnOpen.addEventListener("click", () => {
  modal.style.display = "block";
  modalTitle.textContent = "Nuevo producto";
  document.getElementById("product-form").reset();
  document.getElementById("product-id").value = "";
});

spanClose.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

// Modificá la función editProduct para abrir el modal
async function editProduct(id) {
  try {
    const response = await fetch(`${airtableUrl}/${id}`, {
      headers: { Authorization: `Bearer ${airtableToken}` },
    });
    const data = await response.json();
    const fields = data.fields;

    document.getElementById("product-id").value = id;
    document.getElementById("name").value = fields.Name || "";
    document.getElementById("price").value = fields.Price || "";
    document.getElementById("img").value = fields.Img || "";
    document.getElementById("description").value = fields.Description || "";
    document.getElementById("category").value = fields.Category || "";

    modalTitle.textContent = "Editar producto";
    modal.style.display = "block";
  } catch (error) {
    console.error("Error al cargar producto:", error);
  }
}



// ===== EVENTOS =====
document.getElementById("product-form").addEventListener("submit", saveProduct);

// ===== CARGA INICIAL =====
getProductsFromAirtable();