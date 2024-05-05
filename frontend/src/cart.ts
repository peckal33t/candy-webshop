import { CartObject } from "./types";
import { productsArr, renderLastSection, renderingCart, styleFortyTwo, styleOneThreeThreeSeven, styleOneTooMany } from "./rendering";
import { saveCartInLocalStorage, saveNumOfItems, saveTotalPrice, loadStoredCart, loadSavedNumOfItems, loadTotalPrice } from "./localstorage";

// Array containing alls items
export let cartArr: CartObject[] = [];
export let numOfItemsInCart = 0;
export let cartPriceTotal: number;


// Function to add item to cart
export const addToCartArr = (clickedObjectId: number) => {

    const filterdProduct = productsArr.filter(addedItem => {
        if(addedItem.id === clickedObjectId){
            return addedItem;
        }
    });

    if (filterdProduct[0].stock_quantity > 0) {
        // Checking if the item already exists in cartArr, if så just increase value of qty and priceTotal instead of creating duplicates
        for(let i = 0; i < cartArr.length; i++) {
            if(cartArr[i].product_id === filterdProduct[0].id){
                if (filterdProduct[0].stock_quantity > cartArr[i].qty) {
                    cartArr[i].qty++;
                    cartArr[i].item_total = cartArr[i].qty * cartArr[i].item_price;
        
                    // Calculate total price in cart
                    calculateTotalPrice();
        
                    // Save uppdated cart, total price and number of items to localstorage
                    saveCartInLocalStorage("Cart-items", cartArr);
                    saveTotalPrice("Total-price", cartPriceTotal);

                    
                    // If the item already exists in cartArr leave the function instead of creating duplicate
                    return;
                } else {
                    alert(`Finns inte fler än ${filterdProduct[0].stock_quantity} st av denna godissort i lager, se om du hittar nån annan!`);
                    return;
                };
            };
            
        };
    
        // Creating a new object to puch into cartArr
        let object: CartObject = {
            product_id: filterdProduct[0].id,
            name: filterdProduct[0].name,
            qty: 1,
            item_price: filterdProduct[0].price,
            item_total: 0,
            images: filterdProduct[0].images
        };
    
        cartArr.push(object);
        
        object.item_total = object.qty * object.item_price;
    }

    // Calculate total price in cart
    calculateTotalPrice();

    // increase number of items in cart
    numOfItemsInCart++;

    // Save uppdated cart, total price and number of items to localstorage
    saveCartInLocalStorage("Cart-items", cartArr);
    saveNumOfItems("Number-of-Items", numOfItemsInCart);
    saveTotalPrice("Total-price", cartPriceTotal);

    if(cartPriceTotal === 42) {
        renderLastSection(styleFortyTwo); 
    } else if(cartPriceTotal === 1337) {
        renderLastSection(styleOneThreeThreeSeven);
    } else if(cartPriceTotal > 1337) {
        renderLastSection(styleOneTooMany);
    }
}


// Function to remove item from cart
export const removeFromCartArr = (clickedObjectId: number) => {
    cartArr = cartArr.filter((cartItem) => cartItem.product_id !== clickedObjectId);
    numOfItemsInCart--;
    calculateTotalPrice();
    renderingCart();

    // Save uppdated cart, total price and number of items to localstorage
    saveCartInLocalStorage("Cart-items", cartArr);
    saveNumOfItems("Number-of-Items", numOfItemsInCart);
    saveTotalPrice("Total-price", cartPriceTotal);
}


// Function to calculate total price of cart
const calculateTotalPrice = () => {

    let counter = 0;

    cartArr.forEach((item) => {
        counter += item.item_total;
    });

    cartPriceTotal = counter;
}

export const resetCart = () => {
    cartArr = [];
    cartPriceTotal = 0;
    numOfItemsInCart = 0;
    saveCartInLocalStorage("Cart-items", cartArr);
    saveTotalPrice("Total-price", cartPriceTotal);
    saveNumOfItems("Number-of-Items", numOfItemsInCart);

    renderingCart();
}


// Uppdate cart-info from localstorage
export const loadLocalStorage = () => {

    // Load stored cart-info
    cartArr = loadStoredCart("Cart-items") ?? [];
    numOfItemsInCart = loadSavedNumOfItems("Number-of-Items") ?? 0;
    cartPriceTotal = loadTotalPrice("Total-price") ?? `Such empty varukorg, many sadz... 0`;

}