// Ajoute le numéro de commande dans le message de confirmation.
let orderId = new URLSearchParams(window.location.search).get("orderId");
document.querySelector("#orderId").innerHTML += orderId;
