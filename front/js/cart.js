const keyProducts = JSON.parse(localStorage.getItem("products"));
const cart = document.querySelector("#cart__items");

// affiche les produits dans le panier.
if (keyProducts) {
  const productsInCart = keyProducts
    .map(
      (product) =>
        `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
            <div class="cart__item__img">
              <a href="./product.html?id=${product.id}">
                  <img src="${product.imageUrl}" alt="${product.alTxt}">
              </a>
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.color}</p>
                <p>${product.price} €</p>
              </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
          </article>`
    )
    .join("");

  cart.innerHTML = productsInCart;
} else {
  cart.innerHTML = `<p style="text-align: center">Votre panier Kanap est vide.</p>`;
}

// gestion des produits dans le panier.
if (keyProducts) {
  const quantity = document.querySelectorAll(".itemQuantity");
  const deleteItem = document.querySelectorAll(".deleteItem");

  // met à jour des quantités :
  quantity.forEach((input) => {
    input.addEventListener("change", (event) => {
      event.preventDefault();

      const article = input.closest(".cart__item");
      const { id, color } = article.dataset;
      let productInStorage = keyProducts.find((inStorage) => {
        return inStorage.id == id && inStorage.color == color;
      });

      if (input.value <= 100) {
        productInStorage.quantity = input.value;
      } else {
        alert(
          `Vous pouvez commander au maximum 100 ${productInStorage.name} de couleur ${productInStorage.color}.`
        );
      }

      localStorage.setItem("products", JSON.stringify(keyProducts));
    });
  });

  // supprime le produit :
  deleteItem.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();

      const article = deleteButton.closest(".cart__item");
      const { id, color } = article.dataset;
      let productInStorage = keyProducts.find((inStorage) => {
        return inStorage.id == id && inStorage.color == color;
      });

      keyProducts.splice(productInStorage, 1);
      localStorage.setItem("products", JSON.stringify(keyProducts));
      article.remove();
    });
  });
}

// calcul et affichage des totaux.
// gestion du formulaire.

/* Explications pour la présentation: 
<a href="">image du produit</a>

J'ai pris la liberté de rendre les produits dans le panier cliquables pour faciliter la navigation sur le site.
*/
