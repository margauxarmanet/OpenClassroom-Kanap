const productId = new URLSearchParams(window.location.search).get("id");
const productUrl = `http://localhost:3000/api/products/${productId}`;

async function fetchProduct() {
  const response = await fetch(productUrl);
  const { imageUrl, altTxt, name, price, description, colors } =
    await response.json();

  // Affiche le produit sur la page.
  document.title = name;

  const productImage = document.querySelector(".item__img");
  productImage.innerHTML = `<img src="${imageUrl}" alt="${altTxt}">`;

  document.querySelector("#title").textContent = name;
  document.querySelector("#price").textContent = price;
  document.querySelector("#description").textContent = description;

  const productColor = document.querySelector("#colors");
  productColor.innerHTML = colors
    .map((color) => `<option value="${color}">${color}</option>`)
    .join("");

  let productQuantity = document.querySelector("#quantity");
  productQuantity.value = 1;
}

fetchProduct();
