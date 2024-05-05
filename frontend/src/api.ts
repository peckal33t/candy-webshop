/**
 * ENDAST FUNKTIONER SOM ANVÄNDER FETCH PÅ APIs
 */

import { POSTRes, RequestObject, ResData } from "./types";
import { alertSectionEl } from "./main";
import { renderReceipt } from "./rendering";

// getting the url link for the API
const url = "https://www.bortakvall.se/api/v2/products";


// Get the data from the API
export const getData = async () => {
    const res = await fetch(url);
    
    if (!res.ok) {
        throw new Error(`Cannot get the data. Status code was: ${res.status}`);
    }
    
    const data: ResData = await res.json();
    
    return data;
};


// Post order to API
export const postOrder = async (newOrder: RequestObject) => {
	try {
		const res = await fetch("https://www.bortakvall.se/api/v2/users/26/orders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newOrder),
		});

		const respons: POSTRes = await res.json();

		renderReceipt(respons);

		if (!res.ok) {
			throw new Error(`Could not create order. Status code was: ${res.status}`);
		}

	} catch (error) {
		alertSectionEl.classList.remove("hide");
	}

	
}