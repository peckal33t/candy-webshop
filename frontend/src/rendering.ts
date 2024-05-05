import { getData } from "./api";
import { POSTRes, ResData, ResObject } from "./types";
import { mainEl, popUpSectionEl, numberOfItems, cartListUl, priceTotalEl, checkoutCart, receiptSectionEl, lastSection, cartBtn } from "./main";
import { cartArr, numOfItemsInCart, cartPriceTotal } from "./cart";

let data: ResData;
export let productsArr: ResObject[] = [];

// Sort items alphabetically
const sortProducts = () => {
    productsArr.sort((a, b) => {
        return a.name.localeCompare(b.name, "sv");
    });
}

// find products in stock
const productsInStock = (productsArr: ResObject[]) => {
    return productsArr.filter(product => product.stock_status === "instock");
}

// Funktion get data from API, copy fetched data into new array and call for funktion to render data to page
export const getAndRenderProducts = async () => {
	try {
		data = await getData();
        
        productsArr = data.data;
        
        sortProducts();

		renderPage(productsArr);

	} catch (err) {
        mainEl.innerHTML = `
        <div class="alert alert-danger" role="alert">
            Could not get product(s), did you write the correct url?
        </div>`
	}
}



// Funktion rendering "home"-page with candy-data from API
const renderPage = (array: ResObject[]) => {
    const inStock = productsInStock(array)
    mainEl.innerHTML += `<h2>Visar ${array.length} produkter. ${inStock.length} produkter i lager</h2>`

    mainEl.innerHTML += array
    .map(product => {
        let html = 
        `
        <div class="card">
            <img src="https://www.bortakvall.se${product.images.thumbnail}" class="card-img-top" alt="Thumbnail picture of candy.">
            <div class="card-body" data-id="${product.id}">
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.price} :-</p>
                <p class="read-more">Läs mer...</p>
           
        `
        if (product.stock_status === "instock") {
            html += `<button type="button" class="stock-status add-to-cart btn btn-outline-info">Lägg till i kundvagn</button> </div>
            </div>`
        } else if (product.stock_status === "outofstock") {
            html += `<button type="button" class="stock-status add-to-cart btn btn-outline-info" disabled>Slut i lager.</button> </div>
            </div>`
        }
        return html;
    })
        
    .join("");
}




// Funktion rendering pop-up
export const renderPopUp = (object: number) => {

    const findClickedProduct = productsArr.find((p) => p.id === object);

    if (!findClickedProduct) {
        return;
    }
    const clickedProduct = findClickedProduct;

    popUpSectionEl.classList.remove("hide");

    let innerhtml = `
    <div id="popUp">
        <div class="btnWrapper"><button class="btn btn-outline-danger" id="popUpBtn">❌</button></div>
        <div id="popupContent">
            <div id="imgWrapper"><img src="https://www.bortakvall.se${clickedProduct.images.large}" alt="" id="popUpImg"></div>
            <div class="card-body" id="card-body" data-id=${clickedProduct.id}> 
                <h3 class="card-title" id="popUpH">${clickedProduct.name}</h3>
                <p class="card-text" id="popUpInfo">${clickedProduct.description}</p>
                <h5 class="card-text">${clickedProduct.price} :-</h5>`

    if (clickedProduct.stock_status === "instock") {
        innerhtml += `<p class="card-text" id="popUpInfo">Antal i lager: ${clickedProduct.stock_quantity} st</p>
            <button type="button" id="add-to-cart" class="btn btn-outline-info">Lägg till i kundvagn</button>`
    } else if (clickedProduct.stock_status === "outofstock") {
        innerhtml += `<p class="card-text" id="popUpInfo">Antal i lager: 0 st</p>
            <button type="button" id="add-to-cart" class="btn btn-outline-info" disabled>Slut i lager</button>`
    }

    innerhtml += `</div></div></div>`

    popUpSectionEl.innerHTML = innerhtml;
} 



// Function rendering cart
export const renderingCart = () => {
    // Empty the cart to awoid duplicates 
    cartListUl.innerHTML = ``;

    if(cartPriceTotal > 0){
        cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i><p>${cartPriceTotal}:-</p>`;
    } else if (cartPriceTotal === 0){
        cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>`;
    };

    // Render a new list-item for every item in cart-array
    cartArr.forEach(item => {
        return cartListUl.innerHTML += `
            <li class="cart-li">
                <div class="cart-item-img-box">
                    <img src="https://www.bortakvall.se${item.images.thumbnail}" class="cart-item-img" alt="Thumbnail picture of candy.">
                </div>
                <div class="card-body cart-text-box">
                    <h5 class="card-title cart-item-text">${item.name}</h5>
                    <p class="card-text cart-item-text">Antal: ${item.qty}st</p>
                    <p class="card-text cart-item-text">Styckpris: ${item.item_price} :-</p>
                    <p class="card-text cart-item-text">Total pris vara: ${item.item_total}:-</p>
                </div>
                <button type="button" data-id="${item.product_id}" class="btn btn-outline-danger rm-fr-cart-btn"><i class="fa-solid fa-trash"></i></button>
            </li>
        `
    });

    numberOfItems.innerText = `${numOfItemsInCart} godissorter i varukorgen`;

    priceTotalEl.innerHTML = `Total pris beställning: ${cartPriceTotal}:-`;

}


export const renderCheckoutCart = () => {
    checkoutCart.innerHTML = "";

    document.querySelector<HTMLElement>("#checkout-cart-num-items")!.textContent = `${numOfItemsInCart} st`;

    cartArr.forEach(item => {
        return checkoutCart.innerHTML += `<li class="list-group-item lh-sm">
        <div>
          <h4>${item.name}</h4>
        </div>
        <p class="text-muted">Styckpris: ${item.item_price}:-</p>
        <p class="text-muted">Antal: ${item.qty} st</p>
        <p class="text-muted">Totalpris vara: ${item.item_total}:-</p>
      </li>`
    });

    checkoutCart.innerHTML += `
    <li class="list-group-item d-flex justify-content-between">
        <p>Att betala:</p>
        <strong>${cartPriceTotal}:-</strong>
    </li>`
};


export const renderReceipt = (respons: POSTRes) => {
    receiptSectionEl.classList.remove("hide");
    
    //Render the skelleton of the receipt
    receiptSectionEl.innerHTML = 
        `<div class="container">
            <div class="mx-auto text-center" id="popUpReceipt">
                <div class="btnWrapper"><button class="btn btn-outline-danger float-end" id="receiptBtn">❌</button></div>
                <div id="popupContentReceipt">
                    <div class="card-body text-center mx-auto" id="receipt-card-body"> 
                        <h3 class="card-title" id="popUpR">Tack för din beställning!</h3>
                        <br>
                        <h5 class="card-text">Ditt ordernummer är #${respons.data.id}</h5>
                        <div id="receipt-div"></div>
                        <p>Antal varor: ${numOfItemsInCart}st</p>
                        <h5>Total kostnad: ${cartPriceTotal}</h5>
                    </div>
                </div>
            </div>
        </div>`;
    
    // Render a new list-item for every item in cart-array to receipt
    cartArr.forEach(item => {
        return document.querySelector<HTMLElement>("#receipt-div")!.innerHTML += `
            <li class="cart-li">
                <div class="card-body cart-text-box">
                    <h6 class="card-title cart-item-text">${item.name}</h6>
                    <p class="card-text cart-item-text">Antal: ${item.qty}st</p>
                    <p class="card-text cart-item-text">Styckpris: ${item.item_price} :-</p>
                    <p class="card-text cart-item-text">Total pris vara: ${item.item_total}:-</p>
                </div>
            </li>
        `
    });
}

export const renderLastSection = (style: string) => {
    mainEl.classList.add("hide");
    lastSection.classList.remove("hide");
    if(!popUpSectionEl.classList.contains("hide")) {
        popUpSectionEl.classList.add("hide");
    }
    lastSection.innerHTML = style;
        
}


export const styleFortyTwo: string = 
    `<div>
        <div class="btnWrapper"><button class="btn btn-outline-danger" id="lastSectionBtn">❌</button></div>
        <div id="lastSectionContent">
            <div id="imgWrapper">
                <img src="/42.gif" alt="funny gif">
                <div class="tenor-gif-embed" data-postid="18031367" data-share-method="host" data-aspect-ratio="1.77778" data-width="100%">
                    <a href="https://tenor.com/view/gotcha-monsters-university-gif-18031367">Gotcha Monsters GIF</a> 
                    from <a href="https://tenor.com/search/gotcha-gifs">Gotcha GIFs</a>
                </div> <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
            </div>
        </div>
    </div>`;

export const styleOneThreeThreeSeven: string = 
    `<div>
        <div class="btnWrapper"><button class="btn btn-outline-danger" id="lastSectionBtn">❌</button></div>
        <div id="lastSectionContent">
            <div id="imgWrapper">
                <img src="/1337.gif" alt="funny gif">
                <div class="tenor-gif-embed" data-postid="8927168793643828737" data-share-method="host" data-aspect-ratio="1" data-width="100%">
                    <a href="https://tenor.com/view/nouns-dao-nounish-noggles-glasses-gif-8927168793643828737">Nouns Dao GIF</a>
                     from <a href="https://tenor.com/search/nouns-gifs">Nouns GIFs</a>
                </div> 
                <script type="text/javascript" async src="https://tenor.com/embed.js"></script>
            </div>
        </div>
    </div>`;


export const styleOneTooMany: string = 
    `<div>
        <div class="btnWrapper"><button class="btn btn-outline-danger" id="lastSectionBtn">❌</button></div>
        <div id="lastSectionContent">
            <div id="imgWrapper">
                <img src="/NO.gif" alt="funny gif">
            </div>
        </div>
        <a href ="https://giphy.com/gifs/theitcrowd-funny-lol-it-crowd-fH6fPTMY9m9RmbEVud">giphy.com</a>
    </div>`;