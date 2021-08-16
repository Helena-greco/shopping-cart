const cartList = document.querySelector('.cart__items');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Requisito 4.
const updateLocalStorage = () => {
  localStorage.setItem('Product', cartList.innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  updateLocalStorage(); // para remover item clicado
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

cartList.addEventListener('click', cartItemClickListener); // Remover os itens após armazenar no localStorage

// Requisito 2
function fetchProductById(event) {
  const id = event.target.parentElement.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((result) => {
      const cartItem = { sku: result.id, name: result.title, salePrice: result.price };
      cartList.appendChild(createCartItemElement(cartItem));
    })
    .then(() => updateLocalStorage()); // Add cada item
}

// Requisito 6
const deleteButton = document.querySelector('.empty-cart');
  deleteButton.addEventListener('click', () => {
    cartList.innerHTML = '';
    updateLocalStorage(); // Deletar todos os itens
  });

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', fetchProductById)); // Add o item selecionado no carrinho.

  return section;
}

// Requisito 1
function fetchProductsAPI() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((products) => products.results.forEach((product) => {
      const productObj = {
        sku: product.id,
        name: product.title,
        image: product.thumbnail,
      };
      const productsList = document.querySelector('.items');
      productsList.appendChild(createProductItemElement(productObj));
    }))
    .then(() => document.querySelector('.loading').remove()); // Requisito 7
}

window.onload = () => {
  fetchProductsAPI();
  cartList.innerHTML = localStorage.getItem('Product');
 };
