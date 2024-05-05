import "bootstrap/dist/css/bootstrap.css";
import './style.css';
import { getAndRenderProducts, renderCheckoutCart, renderingCart, renderPopUp, } from "./rendering";
import { addToCartArr, removeFromCartArr, loadLocalStorage, cartArr, cartPriceTotal, resetCart} from "./cart";
import { postOrder } from "./api";
import { RequestObject } from "./types";

// References to DOM
export const alertSectionEl = document.querySelector<HTMLElement>("#alert-section")!;
export const asideEl = document.querySelector<HTMLElement>("aside")!;
export const cartBtn = document.querySelector("#cart-btn") as HTMLButtonElement;
export const cartCheckOutEl = document.querySelector("#cartCheckout") as HTMLElement;
export const cartListUl = document.querySelector<HTMLElement>("#cart-list")!;
export const checkForm = document.querySelector("#checkForm") as HTMLFormElement;
export const checkoutCart = document.querySelector("#checkout-cart") as HTMLUListElement;
export const checkOutBtn = document.querySelector("#check-out-button") as HTMLButtonElement;
export const closeBtn = document.querySelector("#cart-close-btn") as HTMLButtonElement;
export const divCart = document.querySelector("#cart") as HTMLElement;
export const mainEl = document.querySelector<HTMLElement>("main")!;
export const numberOfItems = document.querySelector<HTMLElement>("#number-of-items")!;
export const orderButton = document.querySelector("#orderBtn") as HTMLButtonElement;
export const popUpSectionEl = document.querySelector<HTMLElement>("#pop-up-section")!;
export const priceTotalEl = document.querySelector<HTMLElement>("#price-total")!;
export const receiptSectionEl = document.querySelector<HTMLElement>("#receipt-section")!;
export const stockStatusBtn = document.querySelector<HTMLButtonElement>(".stock.status")!;
export const lastSection = document.querySelector<HTMLElement>("#last-section")!;
  

// on click on "bortakväll", return to original state of landing page
document.querySelector<HTMLElement>("h1")!.addEventListener("click", () => location.reload());

// Eventlistener for click on main
mainEl.addEventListener("click", (e) => {

    const target = e.target as HTMLElement;

    // To open pop-up
    if(target.className === "read-more"){
        const parentEl = target.parentElement as HTMLElement;
        const targetObject = Number(parentEl.dataset.id);

        renderPopUp(targetObject);
    }

    // To add to cart
    if(target.tagName === "BUTTON"){
        const parentEl = target.parentElement as HTMLElement;
        const targetObject = Number(parentEl.dataset.id);

        addToCartArr(targetObject);
        renderingCart();
    };
});



// Eventlistener on info pop-up
popUpSectionEl.addEventListener("click", (e) =>{
    const target = e.target as HTMLElement;
    
    // To close pop-up
    if(target.id === "popUpBtn"){
        document.querySelector<HTMLElement>("#pop-up-section")?.classList.add("hide");
    }
    
    // To add to cart
    if(target.id === "add-to-cart") {
        const parentEl = target.parentElement as HTMLElement;
        const targetObject = Number(parentEl.dataset.id);
        
        addToCartArr(targetObject);
        renderingCart();
    };
});

lastSection.addEventListener("click", (e) =>{
    const target = e.target as HTMLElement
    if(target.id === "lastSectionBtn") {
        lastSection.classList.add("hide");
        mainEl.classList.remove("hide");
    }

    

});



// Eventlistener to open cart
cartBtn.addEventListener("click", () => {
    divCart.classList.add("show");
});


// Eventlistener to close cart
closeBtn.addEventListener("click", () => {
    divCart.classList.remove("show");
});


// remove item from cart
asideEl.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    
    if(target.className === "fa-solid fa-trash"){

        const parentEl = target.parentElement as HTMLElement;
        const targetObject = Number(parentEl.dataset.id);
    
        removeFromCartArr(targetObject);
        renderingCart();
    }
});

// when clicked on the button "Lägg beställning" it re-directs to the checkout page
orderButton.addEventListener("click", () => {

    if(cartArr.length > 0) {
        divCart.classList.remove("show");
        mainEl.classList.add("hide");
        cartCheckOutEl.classList.remove("hide");
        renderCheckoutCart();
    } else {
        alert("Din varukorg är tom, välj lite godis!")
    }
});



checkForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // checks if the user has filled in the requiremenets, if not error pop's up 
    if (!checkForm.checkValidity()) {
        e.stopPropagation();
        checkForm.classList.add("was-validated")
        return;
    }

    // if form is filled out correctly, send an order to the api
    const newOrderRequest: RequestObject = {
        customer_first_name: checkForm.querySelector<HTMLInputElement>("#firstName")?.value || "",
        customer_last_name: checkForm.querySelector<HTMLInputElement>("#lastName")?.value || "",
        customer_address: checkForm.querySelector<HTMLInputElement>("#address")?.value || "",
        customer_postcode: checkForm.querySelector<HTMLInputElement>("#zip")?.value || "",
        customer_city: checkForm.querySelector<HTMLInputElement>("#state")?.value || "",
        customer_email: checkForm.querySelector<HTMLInputElement>("#email")?.value || "",
        customer_phone: checkForm.querySelector<HTMLInputElement>("#phone")?.value || "",
        order_total: cartPriceTotal,
        order_items: cartArr
    };

    try {
        await postOrder(newOrderRequest);
        checkForm.reset();
        checkForm.classList.remove("was-validated");
        cartCheckOutEl.classList.add("hide");
        receiptSectionEl.classList.remove("hide");
        resetCart();

    } catch (err) {
        alert("Could not create order. Please give the server a hug.");
    }
});


// Eventlistener to close alert
alertSectionEl.addEventListener("click", () =>{
    alertSectionEl.classList.add("hide");
});


// return to start page when closing the receipt
receiptSectionEl.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.id === "receiptBtn") {
        location.reload();
    }
});



loadLocalStorage(); 

getAndRenderProducts();

renderingCart();

