document.addEventListener("DOMContentLoaded", function() {
  
  // data ----------------------------------------------------------------
  /* 
  const listProducts = [
    {
      name: "Product 1",
      price: 10.99,
      img:"./img/productos/juguete 1.webp",
      description: "Description for Product 1",
      category: "juguetes"
    },
    {
      name: "Product 2",
      price: 15.49,
      img:"./img/productos/juguete 2.webp",
      description: "Description for Product 2",
      category: "juguetes"
    },
    {
      name: "Product 3",
      price: 7.99,
      img:"./img/productos/juguete 3.webp",
      description: "Description for Product 3",
      category: "accesorios"
    },
    {
      name: "Product 4",
      price: 12.00,
      img:"./img/productos/juguete 4.webp",
      description: "Description for Product 4",
      category: "accesorios"
    }, 
    {
      name: "Product 5",
      price: 20.00,
      img:"./img/productos/juguete 5.webp",
      description: "Description for Product 5",
      category: "alimentos"
    },
    {
      name: "Product 6",
      price: 20.00,
      img:"./img/productos/juguete 5.webp",
      description: "Description for Product 5",
      category: "alimentos"
    },
    {
      name: "Product 7",
      price: 20.00,
      img:"./img/productos/juguete 5.webp",
      description: "Description for Product 5",
      category: "alimentos"
    }
  ]
 */
  // DOM elements ------------------------------------------------
  const productsDomElements = document.querySelector('.product-grid'); // Elemento padre
  const inputSearch = document.getElementById('input-search-product');
  const categorySelect = document.getElementById('category');
  
  // Airtable API ------------------------------------------------
  const airtableToken = "";//Borrado para pushear a GitHub
  const baseId = "appH0zQj2QXP3U1fC";
  const tableName = "Productos";
  const airtableUrl = `https://api.airtable.com/v0/${baseId}/${tableName}`;

  // funciones ------------------------------------------------
  function createProduct(product) {
    console.log('Creando producto:', product);
    const newProduct = document.createElement('div');
    newProduct.setAttribute('class', 'product-card');

    const newAnchor = document.createElement('a');
    newAnchor.setAttribute('href', './detalle-producto.html');
    
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
      console.log(`Producto "${product.name}" agregado al carrito.`);
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


  //Inicializar render
  //renderProducts(listProducts);
/* 
  async function getProductsFromApi() {
    try {
      const response = await fetch('https://dummyjson.com/products/category/sunglasses');
      const data = await response.json();
      console.log('Productos desde API:', data);
      const mappedProducts = data.products.map(product => ({
        name: product.title,
        price: product.price,
        img: product.images[0],
        description: product.description,
        category: product.category
      }))
      console.log('Productos mapeados:', mappedProducts);
      //imprimir productos
      renderProducts(mappedProducts);
    }catch (error) {
      console.error('Error al obtener los productos desde la API:', error);
    } 
  };

  getProductsFromApi();
 */


  

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