export function updateCartCount(){
  const cartIcon = document.getElementById('cart-icon');

  cartIcon.innerHTML = '<img src="img/carrito.png" alt="Carrito" width="40px"><span id="cart-count">0</span>';
  const cartItemsCount = JSON.parse(localStorage.getItem('cart')) ?.length || 0;

  if (cartItemsCount > 0){
    const cartCountSpan = document.getElementById('cart-count');
    cartCountSpan.innerHTML = cartItemsCount;
  }

  }
  
updateCartCount();
