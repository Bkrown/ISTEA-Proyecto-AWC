import { AIRTABLE_TOKEN, BASE_ID, TABLE_NAME } from './env.js';

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
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
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
  function filterProductsByCategory(category) {
    return listProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  function renderProducts(products) {
    productsDomElements.innerHTML = '';
    products.forEach(product => {
      const newProduct = createProduct(product);
      productsDomElements.appendChild(newProduct);
    })};
    
    
  
  // Events ------------------------------------------------
  
  
  inputSearch.addEventListener('keyup', (event) => {
    // Filtro por nombre
    const text = event.target.value;
    const productsFiltered = filterProducts(text);
    renderProducts(productsFiltered);
  });

  
  categorySelect.addEventListener('change', (event) => {
    const category = event.target.value.toLowerCase(); 
    // Filtro por categoria
    if (category === 'todos') {
      renderProducts(listProducts);
    } else {
      const productsFiltered = filterProductsByCategory(category);
      renderProducts(productsFiltered);
    }
  });


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

 /*  editAirtableProduct({
    name: "Producto Editado",
    price: 99.99,
    img: "https://example.com/edited-product.jpg",
    description: "Descripción del producto editado",
    category: "juguetes"
  }); */

});