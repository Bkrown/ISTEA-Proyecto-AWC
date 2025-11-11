import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from './env.js';

document.addEventListener("DOMContentLoaded", function() {

  function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  async function fetchProductById(productId) {
    const airtableToken = AIRTABLE_TOKEN;
    const baseId = BASE_ID;
    const tableName = TABLE_NAME;
    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}/${productId}`;
    
    const response = await fetch(airtableUrl, {
      headers: {
        'Authorization': `Bearer ${airtableToken}`,
      },
    });
    const data = await response.json();
    
    if (data.fields) {
      renderProduct(data.fields, productId);
    } else {
      console.error('No se encontraron campos en el producto.');
    }
  }

  function renderProduct(fields, productId) {
    // Obtener elementos del DOM
    const img = document.querySelector('.product-image');
    const name = document.querySelector('.product-name');
    const price = document.querySelector('.product-price');
    const description = document.querySelector('.product-description');
    const details = document.querySelector('.product-details');
    const btnCarrito = document.querySelector('.btn-carrito');

    // Asignar valores
    img.src = fields.Img || 'img/no-image.png';
    img.alt = fields.Name || 'Producto sin nombre';
    name.textContent = fields.Name || 'Sin nombre';
    price.textContent = fields.Price ? `$${fields.Price}` : 'Precio no disponible';
    description.textContent = fields.Description || 'Sin descripción disponible';
    details.innerHTML = `
      <strong>Categoría:</strong> ${fields.Category || '-'} <br>
      <strong>Stock:</strong> ${fields.Stock || 'No especificado'}
    `;

    // Crear objeto de producto para el carrito
    const product = {
      id: productId,
      name: fields.Name,
      price: fields.Price,
      img: fields.Img,
      category: fields.Category,
      description: fields.Description
    };

    // Evento: Agregar al carrito
    btnCarrito.addEventListener("click", (event) => {
      event.preventDefault();

      // Obtener carrito actual o crear uno vacío
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Buscar si ya está en el carrito
      const existingProduct = cart.find(item => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      } else {
        product.quantity = 1;
        cart.push(product);
      }

      // Guardar carrito actualizado
      localStorage.setItem('cart', JSON.stringify(cart));

      // Actualizar contador si existe
      updateCartCount();

      // Mostrar toast (mensaje emergente)
      showToast("Producto agregado al carrito ");
    });
  }

  // === Función para mostrar el toast ===
  function showToast(message) {
    let toast = document.getElementById('toast-carrito');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-carrito';
      toast.textContent = message;
      document.body.appendChild(toast);
    }
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  // === Función para actualizar contador ===
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const cartIcon = document.getElementById('cart-icon');

    if (cartIcon) {
      let count = document.getElementById('cart-count');
      if (!count) {
        count = document.createElement('span');
        count.id = 'cart-count';
        cartIcon.appendChild(count);
      }
      count.textContent = totalItems;
    }
  }

  // === Ejecución inicial ===
  const productId = getProductIdFromUrl();
  if (productId) {
    fetchProductById(productId);
  } else {
    console.error('No se encontró el parámetro "id" en la URL');
  }

  updateCartCount();
});