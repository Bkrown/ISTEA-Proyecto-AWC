import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from './env.js';

document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const summaryTotal = document.querySelector(".cart-summary span:last-child");
  const summaryCount = document.querySelector(".cart-summary span:first-child");
  const checkoutBtn = document.querySelector(".checkout-btn");

  async function updateStockInAirtable(productId, nuevoStock) {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${productId}`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fields: {
            Stock: nuevoStock
          }
        })
      });

      return response.ok;

    } catch (error) {
      console.error("Error actualizando stock en Airtable:", error);
      return false;
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
  function showToastSinStock(message) {
    let toast = document.getElementById('toast-carrito-sin-stock');

    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-carrito-sin-stock';
      toast.className = 'toast-error';
      toast.textContent = message;
      document.body.appendChild(toast);
    }

    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  
  const carrito = JSON.parse(localStorage.getItem("cart")) || [];

  
  if (carrito.length === 0) {
    cartContainer.innerHTML = "<p>Tu carrito está vacío</p>";
    summaryCount.textContent = "0";
    summaryTotal.textContent = "$0";
    checkoutBtn.disabled = true;
    return;
  }

  
  let total = 0;
  cartContainer.innerHTML = ""; 

  carrito.forEach((producto, index) => {
    const cantidad = producto.quantity || 1;
    const subtotal = producto.price * cantidad;
    total += subtotal;

    const item = document.createElement("div");
    item.classList.add("cart-item");
    item.innerHTML = `
      <img src="${producto.img || 'img/sinimagen.jpg'}" alt="${producto.name}" class="cart-img">
      <div class="cart-details">
        <h3>${producto.name}</h3>
        <p>$${producto.price.toLocaleString('es-AR')}</p>
        <div class="cart-quantity">
          <button class="btn-restar" data-index="${index}">-</button>
          <input type="number" value="${cantidad}" min="1" data-index="${index}" class="input-cantidad">
          <button class="btn-sumar" data-index="${index}">+</button>
        </div>
      </div>
      <div class="cart-price">
        <p>Subtotal: $${subtotal.toLocaleString('es-AR')}</p>
      </div>
    `;
    cartContainer.appendChild(item);
  });

  
  summaryCount.textContent = carrito.length;
  summaryTotal.textContent = `$${total.toLocaleString('es-AR')}`;

 
cartContainer.addEventListener("click", async  (e) => {
  if (e.target.classList.contains("btn-sumar") || e.target.classList.contains("btn-restar")) {
    const index = e.target.dataset.index;
    const input = cartContainer.querySelector(`input[data-index="${index}"]`);
    let cantidad = parseInt(input.value);

    if (e.target.classList.contains("btn-sumar")) {

      const productId = carrito[index].id;
      const stockReal = await getStockFromAirtable(productId);

      if (stockReal === null) {
        alert("No se pudo verificar stock.");
        return;
      }

      if (cantidad + 1 > stockReal) {
        showToastSinStock("No hay suficiente stock disponible");
        return;
      }

      cantidad++;
      carrito[index].quantity = cantidad;
    }

    if (e.target.classList.contains("btn-restar")) {
      if (cantidad > 1) {
        cantidad--;
        carrito[index].quantity = cantidad;
      } else {
        carrito.splice(index, 1);
      }
    }

    
    localStorage.setItem("cart", JSON.stringify(carrito));

    
    if (carrito.length === 0) {
      location.reload();
    } else {
      
      location.reload(); 
      
    }
  }
});

  
  cartContainer.addEventListener("change", async (e) => {
    if (e.target.classList.contains("input-cantidad")) {
      const index = e.target.dataset.index;
      const nuevaCantidad = parseInt(e.target.value);
      const productId = carrito[index].id;
      const stockReal = await getStockFromAirtable(productId);

      if (stockReal === null) {
        alert("No se pudo verificar stock.");
        return;
      }

      if (nuevaCantidad > stockReal) {
        showToastSinStock(`Stock disponible: ${stockReal}`);
        e.target.value = stockReal; 
        carrito[index].quantity = stockReal;
        localStorage.setItem("cart", JSON.stringify(carrito));
        location.reload();
        return;
      }

      carrito[index].quantity = nuevaCantidad;
      localStorage.setItem("cart", JSON.stringify(carrito));
      location.reload();
    }
  });

  
  checkoutBtn.addEventListener("click", async () => {
    
    const carrito = JSON.parse(localStorage.getItem("cart")) || [];

    
    for (const producto of carrito) {
      const productId = producto.id;
      const cantidadComprada = producto.quantity || 1;

      
      const stockActual = await getStockFromAirtable(productId);

      if (stockActual === null) {
        alert(`Error verificando stock de ${producto.name}. Intente nuevamente.`);
        return;
      }

      
      const nuevoStock = stockActual - cantidadComprada;

      
      if (nuevoStock < 0) {
        alert(`Stock insuficiente para ${producto.name}.`);
        return;
      }

      
      const actualizado = await updateStockInAirtable(productId, nuevoStock);

      if (!actualizado) {
        alert(`Error descontando stock de ${producto.name}.`);
        return;
      }
    }

    localStorage.removeItem("cart");
    location.href = "gracias.html";
  });
});