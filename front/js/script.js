// Objectif (1): Récupérer les données transmises par l'api.
// Objectif (2): Afficher les données sur la page.
// Objectif (3): Gestions des erreurs.

// (1) Je récupère les données des produits.
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const products = await response.json();

    // (2) J'affiche les produits sur la page.
    const productCard = products
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

    document.querySelector("#items").innerHTML = productCard;
  } catch (error) {
    // (3) Gestion des erreurs.
    document.querySelector("#items").innerHTML =
      "<p>Une erreur s'est produite lors du chargement des produits.</p>";
    console.error(error);
  }
}

fetchProducts();

// -------------------------------------------------------------------
// async function :
/* J'ai choisi d'utiliser une fonction asynchrone :
- pour faciliter la lecture et la maintenance du code.
- pour faciliter la gestion de potentielles erreurs avec try/catch. */

// products.map(fonction).join(""):
/* J'ai choisi d'utiliser les méthodes .map() et .join() :
- pour faciliter la lecture et la maintenance du code.
- pour réduire la quantité de code à écrire. */

/* 
.map(fonction qui se répète sur chaque objet de products) est le nouvel
array qui contient le code généré par la fontion.
.join("") indique que je ne veux pas de séparateur "," entre chaque string
de code html contenue dans l'array .map().
*/
