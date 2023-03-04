const productsUrl = "http://localhost:3000/api/products";

// Récupère les produits.
async function fetchProducts() {
  const response = await fetch(productsUrl);
  const data = await response.json();

  // Affiche les produits sur la page.
  const productsContainer = document.querySelector("#items");
  const productCard = data
    .map(
      (product) =>
        `<a href="./product.html?id=${product._id}">
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

/* 
Explications pour la présentation :
data.map(fonction).join("");

data[] est l'array qui contient les produits qu'on a récupéré.
.map(fonction qui se répéte pour chaque objet contenu dans l'array data).
.map() est le nouvel array qui reçoit le code généré par la fonction.

l'array .map() contient le code généré par la fonction comme ceci : 
["string html du produit 0", "string html du produit 1", etc].

.join("") indique qu'on ne veut pas de séparateur "," entre chaque string de code html.

*/
