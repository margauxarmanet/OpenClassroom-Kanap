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

  // Ajoute le produit au panier.
  const AddToCart = document.querySelector("#addToCart");
  AddToCart.addEventListener("click", (event) => {
    event.preventDefault();
    const selectedProduct = {
      id: productId,
      imageUrl,
      altTxt,
      name,
      color: productColor.value,
      quantity: Number(productQuantity.value),
      price,
    };

    // On vérifie que la clé "products" existe, sinon on l'a crée.
    let keyProducts = JSON.parse(localStorage.getItem("products"));

    if (keyProducts === null) {
      keyProducts = [];
      keyProducts.push(selectedProduct);
      localStorage.setItem("products", JSON.stringify(keyProducts));
    } // Si la clé "products" existe, on vérifie que selectedProduct existe.
    else {
      let productInStorage = keyProducts.find((product) => {
        return (
          product.id == selectedProduct.id &&
          product.color == selectedProduct.color
        );
      });
      // Si selectedProduct existe dans la clé "products", on additionne les quantités.
      if (productInStorage) {
        const totalQuantity =
          Number(productInStorage.quantity) + Number(selectedProduct.quantity);
        if (totalQuantity <= 100) {
          productInStorage.quantity = totalQuantity;
        } else {
          alert(
            `Vous pouvez commander au maximum 100 ${name} de couleur ${productColor.value}.`
          );
        }
      } // Si selectedProduct n'existe pas dans la clé "products", on le crée.
      else {
        keyProducts.push(selectedProduct);
      }
      localStorage.setItem("products", JSON.stringify(keyProducts));
    }
    window.location.href = "cart.html";
  });
}

fetchProduct();
