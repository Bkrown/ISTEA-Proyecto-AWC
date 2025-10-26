document.addEventListener("DOMContentLoaded", function() {
  
  // data --------------------------------
  const listProducts = [
    {
      name: "Product 1",
      price: 10.99,
      img:"./img/productos/juguete 1.webp",
      description: "Description for Product 1"
    },
    {
      name: "Product 2",
      price: 15.49,
      img:"./img/productos/juguete 2.webp",
      description: "Description for Product 2"
    },
    {
      name: "Product 3",
      price: 7.99,
      img:"./img/productos/juguete 3.webp",
      description: "Description for Product 3"
    },
    {
      name: "Product 4",
      price: 12.00,
      img:"./img/productos/juguete 4.webp",
      description: "Description for Product 4"
    }, 
    {
      name: "Product 5",
      price: 20.00,
      img:"./img/productos/juguete 5.webp",
      description: "Description for Product 5"
    },
    {
      name: "Product 6",
      price: 20.00,
      img:"./img/productos/juguete 5.webp",
      description: "Description for Product 5"
    },
    {
      name: "Product 7",
      price: 20.00,
      img:"./img/productos/juguete 5.webp",
      description: "Description for Product 5"
    }
  ]

  // DOM elements ----------------
  const productsDomElements = document.querySelector('.product-grid'); // Elemento padre
  const inputSearch = document.getElementById('input-search-product');


  // funciones ----------------
  function createProduct(product) {
    
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
    //newPPrice.setAttribute('class', 'product-price');
    newPPrice.innerText = `$${product.price}`;   

    const newAddToCartLink = document.createElement('a');
    newAddToCartLink.setAttribute('href', '#');

    const newButton = document.createElement('button');
    newButton.innerText = 'Agregar al carrito';

    /* 
    newDiv.appendChild(newImg);
    newDiv.appendChild(newPName);
    newDiv.appendChild(newFooterProduct);
    newDiv.appendChild(newPPrice);
    newAnchor.appendChild(newDiv);
    newProduct.appendChild(newAnchor);
    */

    // Armar estructura del footer
    newAddToCartLink.appendChild(newButton);
    newFooterProduct.appendChild(newPPrice);
    newFooterProduct.appendChild(newAddToCartLink);

    // Armar estructura del producto
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

  // Events ----------------
  inputSearch.addEventListener('keyup', (event) => {
    
    const text = event.target.value;
    const productsFiltered = filterProducts(text);
    renderProducts(productsFiltered);
  });

  //Inicializar render
  renderProducts(listProducts);




})