// Objectif (1): Affiche le(s) produit(s) sur la page.
// Objectif (2): Calculer et affiche les totaux.
// Objectif (3): Au clic, changer la quantité d'un produit dans le panier.
// Objectif (4): Au clic, supprimer un produit dans le panier.
// Objectif (5): Au clic, envoyer la commande au serveur.

const cart = document.querySelector("#cart__items");
const orderButton = document.querySelector("#order");

let keyProducts = JSON.parse(localStorage.getItem("products"));

if (keyProducts) {
  // (1) Affiche les produits dans le panier.
  displayProductsInCart(keyProducts);

  // (2) Calcule et affiche les totaux.
  setTotals();

  // (3) Change la quantité d'un produit dans le panier.
  document.querySelectorAll(".itemQuantity").forEach((input) => {
    input.addEventListener("change", (event) => {
      event.preventDefault();
      updateQuantity(input);
    });
  });

  // (4) Supprime un produit dans le panier.
  document.querySelectorAll(".deleteItem").forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();
      deleteProductFormCart(deleteButton);
    });
  });

  // (5) Envoi la commande au serveur.
  orderButton.addEventListener("click", orderButtonClicked);
} else {
  orderButton.disabled = true;
  orderButton.style.cursor = "not-allowed";
  cart.innerHTML = `<p style="text-align: center">Votre panier Kanap est vide.</p>`;
}

// -------------------------------------------------------------------
// Fonctions :

// (1) Affiche les produits dans le panier.
function displayProductsInCart(keyProducts) {
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
}

// (2) Calcule et affiche les totaux.
function setTotals() {
  const { totalQuantity, totalPrice } = keyProducts.reduce(
    (sum, product) => {
      const { quantity, price } = product;
      // (sum et totalQuantity = la somme de toutes les quantités)
      sum.totalQuantity += parseFloat(quantity);
      // (sum et totalPrice = la somme des quantités x les prix)
      sum.totalPrice += parseFloat(quantity) * parseFloat(price);
      return sum;
    },
    { totalQuantity: 0, totalPrice: 0 }
  );

  // insertion des données dans la page.
  document.querySelector("#totalQuantity").textContent = totalQuantity;
  document.querySelector("#totalPrice").textContent = totalPrice;
}

// (3) Change la quantité d'un produit dans le panier.
function updateQuantity(input) {
  const { id, color } = input.closest(".cart__item").dataset;
  const productInStorage = keyProducts.find(
    (inStorage) => inStorage.id == id && inStorage.color == color
  );

  input.value <= 100
    ? (productInStorage.quantity = input.value)
    : alert(
        `Vous pouvez commander au maximum 100 ${productInStorage.name} de cette couleur.`
      );

  localStorage.setItem("products", JSON.stringify(keyProducts));
  setTotals();
}

// (4) Supprime un produit dans le panier.
function deleteProductFormCart(deleteButton) {
  const { id, color } = deleteButton.closest(".cart__item").dataset;
  keyProducts = keyProducts.filter((inStorage) => {
    return !(inStorage.id == id && inStorage.color == color);
  });

  localStorage.setItem("products", JSON.stringify(keyProducts));
  setTotals();
  deleteButton.closest(".cart__item").remove();
}

// (5) Envoi la commande au serveur.
function orderButtonClicked(event) {
  event.preventDefault();

  let formIsValid = formValidation();

  if (formIsValid) {
    const productId = [];

    keyProducts.forEach((product) => {
      productId.push(product.id);
    });

    const order = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
      },
      products: productId,
    };

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    };
    fetch("http://localhost:3000/api/products/order", options)
      .then((response) => response.json())
      .then((data) => {
        console.log("POST request successful:", data);
        window.location.href = `confirmation.html?orderId=${data.orderId}`;
        localStorage.clear();
      })
      .catch((err) => {
        console.log("Erreur Fetch product.js", err);
        alert(
          "Une erreur s'est produite, nous n'avons pas pu enregistrer votre commande."
        );
      });
  }
}

// -------------------------------------------------------------------
// "Sous-Fonctions" de (5) :
const form = document.querySelector(".cart__order__form");

// Validation du formulaire
function formValidation() {
  let formIsValid = true;

  inputs.forEach((input) => {
    const { inputName, pattern, errorMsgElement } = input;
    const inputValue = form.elements[inputName].value.trim();

    if (!pattern.test(inputValue) || !inputValue === "") {
      formIsValid = false;
      errorMsgElement.textContent = input.errorMsg;
    } else {
      errorMsgElement.textContent = "";
    }
  });
  return formIsValid;
}

// Données spécifiques à chaque inputs.
const inputs = [
  {
    inputName: "firstName",
    pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ-]+$/,
    errorMsg: "Veuillez entrer un prénom valide, ex: Sandrine.",
    errorMsgElement: document.querySelector("#firstNameErrorMsg"),
  },
  {
    inputName: "lastName",
    pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ-]+$/,
    errorMsg: "Veuillez entrer un nom valide, ex: Dubois.",
    errorMsgElement: document.querySelector("#lastNameErrorMsg"),
  },
  {
    inputName: "address",
    pattern: /^[a-zA-Z0-9À-ÖØ-öø-ÿ\s-]+$/,
    errorMsg: "Veuillez entrer une adresse valide, ex: 5 Rue de la République.",
    errorMsgElement: document.querySelector("#addressErrorMsg"),
  },
  {
    inputName: "city",
    pattern: /^[a-zA-Z0-9À-ÖØ-öø-ÿ\s-]+$/,
    errorMsg: "Veuillez entrer une ville valide ex: Lyon.",
    errorMsgElement: document.querySelector("#cityErrorMsg"),
  },
  {
    inputName: "email",
    pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    errorMsg:
      "Veuillez entrer une adresse email valide ex: sandrine-dubois@email.com",
    errorMsgElement: document.querySelector("#emailErrorMsg"),
  },
];

// -------------------------------------------------------------------
/* Note :
J'ai pris la liberté de rendre les produits dans le panier cliquables
afin de faciliter la navigation sur le site (comme sur amazon.fr) */
