const cartList = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
let total = 0;

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

// Requisito 4
const updateLocalStorage = () => {
  localStorage.setItem('Product', cartList.innerHTML);
  localStorage.setItem('Price', totalPrice.innerHTML);
  console.log(cartList.innerHTML);
};

function cartItemClickListener(event) {
  const splitString = event.target.innerHTML.split('$');
  const number = Number.parseFloat(splitString[1]);
  total -= number;
  const priceRound = total.toFixed(2);
  totalPrice.innerHTML = `${priceRound}`;
  event.target.remove(); // Requisito 3
  updateLocalStorage(); // para remover item clicado
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Remover os itens após armazenar no localStorage

// Requisito 2
async function fetchProductById(event) {
  const id = event.target.parentElement.firstChild.innerText;
  await fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((result) => {
      const cartItem = { sku: result.id, name: result.title, salePrice: result.price };
      cartList.appendChild(createCartItemElement(cartItem));
      total += cartItem.salePrice;
      const priceRound = Math.round(total * 100) / 100;
      totalPrice.innerHTML = `${priceRound}`;
    })
    .then(() => updateLocalStorage()); // Add cada item
}

// Requisito 6
const deleteButton = document.querySelector('.empty-cart');
deleteButton.addEventListener('click', () => {
  cartList.innerHTML = '';
  totalPrice.innerHTML = '';
  total = 0;
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
async function fetchProductsAPI() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
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

function deleteLis() {
  total = Number.parseFloat(localStorage.getItem('Price'));
  const lisCart = document.querySelectorAll('li');
  lisCart.forEach((event) => {
    event.addEventListener('click', cartItemClickListener);
  });
}

window.onload = () => {
  fetchProductsAPI();
  cartList.innerHTML = localStorage.getItem('Product');
  totalPrice.innerHTML = localStorage.getItem('Price');
  deleteLis();
 };
