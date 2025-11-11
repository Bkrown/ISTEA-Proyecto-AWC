import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from './env.js';
import { updateCartCount } from './funComunes.js';
//import { ICON_CHECH } from './icons.js';

document.addEventListener("DOMContentLoaded", function() {
  
  // data ----------------------------------------------------------------
  let listProducts = []
  // DOM elements ------------------------------------------------
  const productsDomElements = document.querySelector('.product-grid'); // Elemento padre
  const inputSearch = document.getElementById('input-search-product');
  const categorySelect = document.getElementById('category');
  

  
  
  // Airtable API ------------------------------------------------
  const airtableToken = AIRTABLE_TOKEN;//Borrado para pushear a GitHub
  const baseId = BASE_ID;
  const tableName = TABLE_NAME;
  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  // funciones ------------------------------------------------
  function createProduct(product) {
    console.log('Creando producto:', product);
    const newProduct = document.createElement('div');
    newProduct.setAttribute('class', 'product-card');

    const newAnchor = document.createElement('a');
    newAnchor.setAttribute('href', './detalle-producto.html?id=' + encodeURIComponent(product.id));
    
    const newImg = document.createElement('img');
    newImg.setAttribute('src', product.img);
    newImg.setAttribute('alt', product.name);
    
    const newPName = document.createElement('h3');
    newPName.setAttribute('class', 'product-name');
    newPName.innerText = product.name;        
        
    const newFooterProduct = document.createElement('div');
    newFooterProduct.setAttribute('class', 'product-footer');

    const newPPrice = document.createElement('p');
    newPPrice.innerText = `$${product.price}`;   

    const newAddToCartLink = document.createElement('a');
    newAddToCartLink.setAttribute('href', '#');

    const newButton = document.createElement('button');
    newButton.innerText = 'Agregar al carrito';
    newButton.addEventListener('click', (event) => {
      event.preventDefault();

      // Obtener carrito actual o crear uno vacío
      const cart = JSON.parse(localStorage.getItem('cart')) || [];

      // Ver si el producto ya está en el carrito
      const existingProduct = cart.find(item => item.id === product.id);

      if (existingProduct) {
        // Si ya existe, aumentar la cantidad
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      } else {
        // Si no existe, agregarlo con cantidad = 1
        product.quantity = 1;
        cart.push(product);
      }

      // Guardar carrito actualizado
      localStorage.setItem('cart', JSON.stringify(cart));

      // Actualizar contador visual del carrito (si lo tenés)
      updateCartCount();

      // Mostrar el toast
      const toast = document.getElementById('toast-carrito');
      toast.style.display = 'block';
      setTimeout(() => {
        toast.style.display = 'none';
      }, 3000);
    });

    
    // Estructura del footer
    newAddToCartLink.appendChild(newButton);
    newFooterProduct.appendChild(newPPrice);
    newFooterProduct.appendChild(newAddToCartLink);

    // Estructura del producto
    newAnchor.appendChild(newImg);
    newAnchor.appendChild(newPName);
    newAnchor.appendChild(newFooterProduct);

    newProduct.appendChild(newAnchor);
    return newProduct;

  }

  function filterProducts(text) {
    // Filtro de productos
    const productFiltered = listProducts.filter(product => 
      product.name.toLowerCase().includes(text.toLowerCase())
    );
    return productFiltered;
  }

  function renderProducts(products) {
    productsDomElements.innerHTML = '';
    products.forEach(product => {
      const newProduct = createProduct(product);
      productsDomElements.appendChild(newProduct);
    })};
    
  // abrir/cerrar menú Categorías
  document.querySelector('.dropdown-btn').addEventListener('click', function() {
  this.parentElement.classList.toggle('show');
  });

  // cerrar si se hace clic afuera
  window.addEventListener('click', function(e) {
  if (!e.target.matches('.dropdown-btn')) {
    document.querySelectorAll('.dropdown.show').forEach(d => d.classList.remove('show'));
    }
  });

  // detectar selección de filtros
  document.querySelectorAll('.category-checkbox').forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const seleccionadas = Array.from(document.querySelectorAll('.category-checkbox:checked'))
                               .map(cb => cb.value);
    console.log("Categorías seleccionadas:", seleccionadas);
    
    });
  });
  
  // Events ------------------------------------------------
  
  
  
  inputSearch.addEventListener('keyup', (event) => {
    // Filtro por nombre
    const text = event.target.value;
    const productsFiltered = filterProducts(text);
    renderProducts(productsFiltered);
  });

  
const categoryCheckboxes = document.querySelectorAll('.category-checkbox');

categoryCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    if (selectedCategories.length === 0) {
      renderProducts(listProducts);
      console.log('No hay categorías seleccionadas, mostrando todos los productos.');
    } else {
      const productsFiltered = listProducts.filter(p => selectedCategories.includes(p.category));
      renderProducts(productsFiltered);
      console.log('Categorías en Airtable:', listProducts.map(p => p.category));
      console.log('Categorías seleccionadas:', selectedCategories);
      console.log('Productos filtrados por categoría:', productsFiltered);
    }
  });
});

  // Carrito ----------------------------------------------------------------------

  

  // Airtable API calls ------------------------------------------------

  async function getProductsFromAirtable() {
    try {
      const response = await fetch(airtableUrl, {
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          'Content-Type': 'application/json'
        }
      }); 
      const data = await response.json();
      console.log('Productos desde Airtable:', data);
      const mappedProducts = data.records.map(items => ({
        id: items.id,
        name: items.fields.Name,
        price: items.fields.Price,
        img: items.fields.Img,
        description: items.fields.Description,
        category: items.fields.Category
      }))
      listProducts = mappedProducts;
      console.log('Productos mapeados:', mappedProducts);
      renderProducts(mappedProducts);
      }catch (error) {
      console.error('Error al obtener los productos desde Airtable:', error);
    }
  };
  getProductsFromAirtable();
  updateCartCount();

  async function editAirtableProduct(product){
    try {
      const response = await fetch(`${airtableUrl}/recBHVaoBTakEPqg1`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {Name: product.name, 
            Price: product.price, 
            Category: product.category, 
            Img: product.img, 
            Description: product.description
          }
        })
      });
      const data = await response.json();
      console.log('Producto editado en Airtable:', data);
    } catch (error) {
      console.error('Error al editar el producto en Airtable:', error);
    }
            
  }

 

});