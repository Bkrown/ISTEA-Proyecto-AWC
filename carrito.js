
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-items");
  const summaryTotal = document.querySelector(".cart-summary span:last-child");
  const summaryCount = document.querySelector(".cart-summary span:first-child");
  const checkoutBtn = document.querySelector(".checkout-btn");

  // Obtener carrito desde localStorage
  const carrito = JSON.parse(localStorage.getItem("cart")) || [];

  // Si el carrito está vacío
  if (carrito.length === 0) {
    cartContainer.innerHTML = "<p>Tu carrito está vacío</p>";
    summaryCount.textContent = "0";
    summaryTotal.textContent = "$0";
    checkoutBtn.disabled = true;
    return;
  }

  // Renderizar productos
  let total = 0;
  cartContainer.innerHTML = ""; // limpiar

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

  // Actualizar resumen
  summaryCount.textContent = carrito.length;
  summaryTotal.textContent = `$${total.toLocaleString('es-AR')}`;

  // === EVENTOS ===

 // Botones de sumar/restar
cartContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-sumar") || e.target.classList.contains("btn-restar")) {
    const index = e.target.dataset.index;
    const input = cartContainer.querySelector(`input[data-index="${index}"]`);
    let cantidad = parseInt(input.value);

    if (e.target.classList.contains("btn-sumar")) {
      cantidad++;
      carrito[index].quantity = cantidad;
    }

    if (e.target.classList.contains("btn-restar")) {
      if (cantidad > 1) {
        cantidad--;
        carrito[index].quantity = cantidad;
      } else {
        // Si la cantidad es 1 y se hace clic en "-", eliminar producto
        carrito.splice(index, 1);
      }
    }

    // Guardar el carrito actualizado
    localStorage.setItem("cart", JSON.stringify(carrito));

    // Si el carrito quedó vacío, recargar para mostrar mensaje
    if (carrito.length === 0) {
      location.reload();
    } else {
      // Actualizar solo la vista actual sin recargar toda la página
      location.reload(); // si querés mantenerlo simple
      // (si querés hacerlo sin recargar, te lo puedo dejar optimizado)
    }
  }
});

  // Cambios manuales en el input de cantidad
  cartContainer.addEventListener("change", (e) => {
    if (e.target.classList.contains("input-cantidad")) {
      const index = e.target.dataset.index;
      const nuevaCantidad = parseInt(e.target.value);
      carrito[index].quantity = nuevaCantidad;
      localStorage.setItem("cart", JSON.stringify(carrito));
      location.reload();
    }
  });

  // Botón de finalizar compra
  checkoutBtn.addEventListener("click", () => {
    localStorage.removeItem("cart");
    location.href = "checkout.html";
  });
});