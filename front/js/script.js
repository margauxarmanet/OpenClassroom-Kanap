const url = "http://localhost:3000/api/products";

async function fetchProducts() {
  const response = await fetch(url);
  const data = await response.json();

  // Affiche les produits sur la page.
  const productsContainer = document.querySelector("#items");
  const productCard = data
    .map(
      (product) =>
        `<a href="./product.html?id=${product.id}">
    <article>
      <img src="${product.imageUrl}" alt="${product.altTxt}">
      <h3 class="productName">${product.name}</h3>
      <p class="productDescription">${product.description}</p>
    </article>
  </a>`
    )
    .join("");

  productsContainer.innerHTML = productCard;
}

fetchProducts();
