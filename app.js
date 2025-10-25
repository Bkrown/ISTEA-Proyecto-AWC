document.addEventListener("DOMContentLoaded", function() {

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
    }
  ]

  const products = document.querySelector('.product-container');

  functioncreateProduct(product) {
    
    const NewProduct = document.createElement('div');
    NewProduct.setAttribute('class', 'product-item');

    const NewAnchor = document.createElement('a');
    NewAnchor.setAttribute('href', './product-detail.html');

    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'fondo-rojo');

    const newImg = document.createElement('img');
    newImg.setAttribute('src', "./img/productos/juguete 1.webp");
    newImg.setAttribute('alt', product.name);
    newProduct.appendChild(NewAnchor);
})