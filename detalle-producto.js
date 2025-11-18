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

  async function getStockFromAirtable(productId) {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${productId}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) return null;

      const data = await response.json();
      return data.fields.Stock ?? null;

    } catch (error) {
      console.error("Error obteniendo stock:", error);
      return null;
    }
  }

  function renderProduct(fields, productId) {
    
    const img = document.querySelector('.product-image');
    const name = document.querySelector('.product-name');
    const price = document.querySelector('.product-price');
    const description = document.querySelector('.product-description');
    const details = document.querySelector('.product-details');
    const btnCarrito = document.querySelector('.btn-carrito');

    
    img.src = fields.Img || 'img/no-image.png';
    img.alt = fields.Name || 'Producto sin nombre';
    name.textContent = fields.Name || 'Sin nombre';
    price.textContent = fields.Price ? `$${fields.Price}` : 'Precio no disponible';
    description.textContent = fields.Description || 'Sin descripción disponible';
    details.innerHTML = `
      <strong>Categoría:</strong> ${fields.Category || '-'} <br>
      <strong>Stock:</strong> ${fields.Stock || 'No especificado'}
    `;

    
    const product = {
      id: productId,
      name: fields.Name,
      price: fields.Price,
      img: fields.Img,
      category: fields.Category,
      description: fields.Description
    };

    
    btnCarrito.addEventListener("click", async (event) => {
      event.preventDefault();

      
      const stockReal = await getStockFromAirtable(product.id);

      if (stockReal === null) {
        alert("No se pudo verificar el stock. Intente más tarde.");
        return;
      }

      
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      
      const existingProduct = cart.find(item => item.id === product.id);

      const cantidadActual = existingProduct ? existingProduct.quantity : 0;
      const cantidadNueva = cantidadActual + 1;

      
      if (cantidadNueva > stockReal) {
        showToastSinStock("No hay suficiente Stock")
        return; 
      }

      
      if (existingProduct) {
        existingProduct.quantity = cantidadNueva;
      } else {
        product.quantity = 1;
        cart.push(product);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      showToast("Producto agregado al carrito");
    });
  }

  
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
  function showToastSinStock(message) {
    let toast = document.getElementById('toast-carrito-sin-stock');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-carrito-sin-stock';
      toast.textContent = message;
      document.body.appendChild(toast);
    }
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  
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

  
  const productId = getProductIdFromUrl();
  if (productId) {
    fetchProductById(productId);
  } else {
    console.error('No se encontró el parámetro "id" en la URL');
  }

  updateCartCount();
});