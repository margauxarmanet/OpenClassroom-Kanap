// Objectif (1): Récupérer les données transmises par l'api grâce à son id.
// Objectif (2): Afficher les données sur la page.
// Objectif (3): Ajouter le produit et ses options dans le localStorage.
// Objectif (4): Gestions des erreurs.

// (1) Je récupére les données transmises par l'api grâce à son id.
const productId = new URLSearchParams(window.location.search).get("id");

async function fetchProduct() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${productId}`
    );
    const product = await response.json();

    // (2) J'affiche le produit sur la page.
    displayProduct(product);

    // (3) Au clic, j'ajoute le produit dans le localStorage.
    document
      .querySelector("#addToCart")
      .addEventListener("click", () => addToCart(product));
  } catch (error) {
    // (4) Gestion des erreurs.
    document.querySelector(".item").innerHTML =
      "<p>Une erreur s'est produite lors du chargement de la page.</p>";
    console.error(error);
  }
}

fetchProduct();

// -------------------------------------------------------------------
// Fonctions :

// (2) J'affiche le produit sur la page.
function displayProduct(product) {
  document.title = product.name;

  document.querySelector(
    ".item__img"
  ).innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

  document.querySelector("#title").textContent = product.name;
  document.querySelector("#price").textContent = product.price;
  document.querySelector("#description").textContent = product.description;

  document.querySelector("#colors").innerHTML = product.colors
    .map((color) => `<option value="${color}">${color}</option>`)
    .join("");

  document.querySelector("#quantity").value = 1;
}

// (3) Au clic, j'ajoute le produit dans le localStorage.
function addToCart(product) {
  const selectedProduct = createSelectedProduct(product);

  let keyProducts = initializeKeyProducts();

  // Je vérifie si selectedProduct est dans keyProducts.
  let productInStorage = findProductInStorage(selectedProduct, keyProducts);
  if (productInStorage) {
    // selectedProduct n'est pas dans keyProducts: j'ajoute selectedProduct.
    updateQuantity(selectedProduct, productInStorage);
  } else {
    // selectedProduct est dans keyProducts: je modifie selectedProduct.
    addSelectedProduct(selectedProduct, keyProducts);
  }
  localStorage.setItem("products", JSON.stringify(keyProducts));
}

// -------------------------------------------------------------------
// "Sous-Fonctions" de (3) :

// Je crée l'objet qui doit être envoyé dans le localStorage.
function createSelectedProduct(product) {
  const productColor = document.querySelector("#colors").value;
  const productQuantity = document.querySelector("#quantity").value;

  const selectedProduct = {
    id: productId,
    imageUrl: product.imageUrl,
    altTxt: product.altTxt,
    name: product.name,
    color: productColor,
    quantity: Number(productQuantity),
    price: product.price,
  };

  return selectedProduct;
}

// J'initialise keyProducts :
function initializeKeyProducts() {
  let keyProducts = JSON.parse(localStorage.getItem("products"));

  if (keyProducts === null) {
    keyProducts = [];
    localStorage.setItem("products", JSON.stringify(keyProducts));
  }

  return keyProducts;
}

// Je vérifie si selectedProduct est dans keyProducts.
function findProductInStorage(selectedProduct, keyProducts) {
  let productInStorage = keyProducts.find((product) => {
    return (
      product.id == selectedProduct.id && product.color == selectedProduct.color
    );
  });
  return productInStorage;
}

// selectedProduct n'est pas dans keyProducts: j'ajoute selectedProduct.
function addSelectedProduct(selectedProduct, keyProducts) {
  if (selectedProduct.quantity > 100) {
    alert(
      `Vous pouvez commander au maximum 100 ${selectedProduct.name} de cette couleur.`
    );
  } else {
    keyProducts.push(selectedProduct);
    window.location.href = "cart.html";
  }
}

// selectedProduct est dans keyProducts: je modifie selectedProduct.
function updateQuantity(selectedProduct, productInStorage) {
  const newQuantity =
    Number(selectedProduct.quantity) + Number(productInStorage.quantity);
  if (newQuantity > 100) {
    alert(
      `Vous pouvez commander au maximum 100 ${selectedProduct.name} de cette couleur.`
    );
  } else {
    productInStorage.quantity = newQuantity;
    window.location.href = "cart.html";
  }
}

// -------------------------------------------------------------------
// Explication URLSearchParams :
/* new URLSearchParams(window.location.search).get("id"):

- window.location récupère l'url de la page actuelle : 
  "http://127.0.0.1:5500/front/html/product.html?id=107fb5b75607497b96722bda5b504926"

- window.loccation.search : récupère uniquement la query string de l'url :
  "?id=107fb5b75607497b96722bda5b504926"

URLSearchParams est une classe js qui permet de manipuler les paramètres de la query string d'une URL.
- new URLSearchParams(window.location.search) : crée un nouvel objet avec le contenu de la query string en paramètre.

- .get("id") : récupère le paramètre "id" de notre query string:
  "107fb5b75607497b96722bda5b504926" */
