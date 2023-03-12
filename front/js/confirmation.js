// Objectif: Ajouter le numéro de commande (orderId) au code html.
function addOrderIdToConfirmation() {
  const orderId = new URLSearchParams(window.location.search).get("orderId");

  if (orderId) {
    const orderIdElement = document.querySelector("#orderId");
    orderIdElement.innerHTML += orderId;
  } else {
    document.querySelector(".confirmation").innerHTML =
      "Une erreur s'est produite, nous n'avons pas pu enregistrer votre commande.";
  }
}

addOrderIdToConfirmation();
