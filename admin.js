import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from './env.js';


  const airtableToken = AIRTABLE_TOKEN;
  const baseId = BASE_ID;
  const tableName = TABLE_NAME;
  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;
  

function showToast(message) {
  let toast = document.getElementById('toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.classList.add('toast-sin-stock');
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

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
      <td>${producto.Stock ?? 0}</td>
      <td>
        <button class="action-btn edit" data-id="${item.id}">Editar</button>
        <button class="action-btn delete" data-id="${item.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


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
      Stock: parseInt(document.getElementById("stock").value),
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

    showToast("Producto guardado correctamente");

    
    modal.style.display = "none";

    document.getElementById("product-form").reset();
    document.getElementById("product-id").value = "";
    getProductsFromAirtable();

  } catch (error) {
    console.error("Error al guardar producto:", error);
  }
}


async function deleteProduct(id) {
  showToast("Producto eliminado correctamente");
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


document.getElementById("product-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    const id = e.target.dataset.id;
    editProduct(id);
  } else if (e.target.classList.contains("delete")) {
    const id = e.target.dataset.id;
    deleteProduct(id);
  }
});


const modal = document.getElementById("modal");
const btnOpen = document.getElementById("btn-open-modal");
const spanClose = document.querySelector(".close");
const modalTitle = document.getElementById("modal-title");

btnOpen.addEventListener("click", () => {
  modal.style.display = "block";
  modalTitle.textContent = "Nuevo producto";
  document.getElementById("product-form").reset();
  document.getElementById("stock").value = 0;
  document.getElementById("product-id").value = "";
});

spanClose.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

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
    document.getElementById("stock").value = fields.Stock || 0;

    modalTitle.textContent = "Editar producto";
    modal.style.display = "block";

  } catch (error) {
    console.error("Error al cargar producto:", error);
  }
}



document.getElementById("product-form").addEventListener("submit", saveProduct);

getProductsFromAirtable();