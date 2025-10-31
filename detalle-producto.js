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
    console.log('Productos desde Airtable:', data);
     if (data.fields) {
      renderProduct(data.fields);
      console.log('Producto cargado:', data.fields);
    } else {
      console.error('No se encontraron campos en el producto.');
    }
    
  }
 
  function renderProduct(fields) {
    // Obtener elementos del DOM
    const img = document.querySelector('.product-image');
    const name = document.querySelector('.product-name');
    const price = document.querySelector('.product-price');
    const description = document.querySelector('.product-description');
    const details = document.querySelector('.product-details');

    // Asignar valores
    img.src = fields.Img || 'img/no-image.png';
    img.alt = fields.Name || 'Producto sin nombre';
    name.textContent = fields.Name || 'Sin nombre';
    price.textContent = fields.Price ? `$${fields.Price}` : 'Precio no disponible';
    description.textContent = fields.Description || 'Sin descripción disponible';

    // Ejemplo extra si querés mostrar más detalles
    details.innerHTML = `
      <strong>Categoría:</strong> ${fields.Category || '-'} <br>
      <strong>Stock:</strong> ${fields.Stock || 'No especificado'}
    `;
  }

  // Ejecutar al cargar
  const productId = getProductIdFromUrl();
  if (productId) {
    fetchProductById(productId);
  } else {
    console.error('No se encontró el parámetro "id" en la URL');
  }

});