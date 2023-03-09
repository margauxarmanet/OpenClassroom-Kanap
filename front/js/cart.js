let keyProducts = JSON.parse(localStorage.getItem("products"));
const cart = document.querySelector("#cart__items");
const orderButton = document.querySelector("#order");

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
  orderButton.addEventListener("click", orderButtonClicked);
} else {
  cart.innerHTML = `<p style="text-align: center">Votre panier Kanap est vide.</p>`;
  orderButton.disabled = true;
  orderButton.style.cursor = "not-allowed";
}

// gestion des produits dans le panier.
if (keyProducts) {
  const quantity = document.querySelectorAll(".itemQuantity");
  const deleteItem = document.querySelectorAll(".deleteItem");

  // modifie la quantité :
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
      updateTotalQuantity();
    });
  });

  // supprime le produit :
  deleteItem.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault();

      const article = deleteButton.closest(".cart__item");
      const { id, color } = article.dataset;
      keyProducts = keyProducts.filter((inStorage) => {
        return !(inStorage.id == id && inStorage.color == color);
      });

      localStorage.setItem("products", JSON.stringify(keyProducts));
      updateTotalQuantity();
      article.remove();
    });
  });

  // Calculs des quantités et des prix.
  const updateTotalQuantity = () => {
    const keyProducts = JSON.parse(localStorage.getItem("products"));
    let totalQuantity = 0;
    let totalPrice = [];
    keyProducts.forEach((product) => {
      totalQuantity += parseInt(product.quantity);
      const productPrice = parseInt(product.quantity) * parseInt(product.price);
      totalPrice.push(productPrice);
    });
    document.querySelector("#totalQuantity").textContent = totalQuantity;
    document.querySelector("#totalPrice").textContent = totalPrice.reduce(
      (a, b) => a + b,
      0
    );
  };

  // Affiche la quantité au chargement de la page.
  updateTotalQuantity();
}

// création du formulaire.
const form = document.querySelector(".cart__order__form");

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

// Envoi la commande.
function orderButtonClicked(event) {
  event.preventDefault();

  let formIsValid = formValidation();
  const productId = [];

  if (formIsValid) {
    keyProducts.map((product) => {
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

/* Explications pour la présentation: 
<a href="">image du produit</a>

J'ai pris la liberté de rendre les produits dans le panier cliquables pour faciliter la navigation sur le site.
*/
