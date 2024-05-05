import { CartObject } from "./types";


// Function to save cartArr in localstorage as JSON
export const saveCartInLocalStorage = (key: string, cartItems: CartObject[]) => {
    const cartAsJson = JSON.stringify(cartItems);
    localStorage.setItem(key, cartAsJson);
}



// Function to load cartArr från localstorage and turn cartArr from JSON to string
export const loadStoredCart = (key: string) => {
    const jsonCart = localStorage.getItem(key);

    if(!jsonCart) {
        return null;
    }

    const SavedCartArr = JSON.parse(jsonCart);
    
    return SavedCartArr;
}



// Function to save number of items to localstorage
export const saveNumOfItems = (key: string, numOfItems: number) => {
    const savedNumOfItems = JSON.stringify(numOfItems);
    localStorage.setItem(key, savedNumOfItems);
}


// Function to load number of items from localstorage
export const loadSavedNumOfItems = (key: string) => {
    const jsonNumOfItems = localStorage.getItem(key);
    
    if(!jsonNumOfItems) {
        return null;
    }

    const numOfItemsInCart = JSON.parse(jsonNumOfItems);

    return numOfItemsInCart;
}



// Function to save total price to localstorage
export const saveTotalPrice = (key: string, totalPrice: number) => {
    const savedtotalPrice = JSON.stringify(totalPrice);
    localStorage.setItem(key, savedtotalPrice);
}




// Function to load total price from localstorage
export const loadTotalPrice = (key: string) => {
    const jsonTotalPrice = localStorage.getItem(key);
    
    if(!jsonTotalPrice) {
        return null;
    }

    const cartPriceTotal = JSON.parse(jsonTotalPrice);

    return cartPriceTotal;
}
