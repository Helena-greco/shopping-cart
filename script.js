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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui


}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Função para add o item selecionado no cart__items - Requisito 2
function fetchProductById(event) {
  const id = event.target.parentElement.firstChild.innerText;
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((result) => {
      const cartList = document.querySelector('.cart__items');
      const cartItem = { sku: result.id, name: result.title, salePrice: result.price };
      cartList.appendChild(createCartItemElement(cartItem));
    });
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => button.addEventListener('click', fetchProductById));

  return section;
}

// Função para criar o formato do obj e add no parent items - Requisito 1
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
    }));
}

window.onload = () => {
  fetchProductsAPI();
 };
