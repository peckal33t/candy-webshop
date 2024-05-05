export interface ResObject {
    id: number,
    name: string,
    description: string,
    price: number,
    on_sale: boolean,
    images: {
        thumbnail: string, 
        large: string
        },
    stock_status: string,
    stock_quantity: number,
    tags:  [ 
        {
            id: number, name: string, slug: string
        }
    ]
}


export interface ResData {
    status: string,
    data: ResObject[]
}


export interface CartObject {
    product_id: number,
    name: string,
    qty: number,
    item_price: number,
    item_total: number,
    images: {
        thumbnail: string, 
        large: string
        }
}


export interface RequestObject {
    customer_first_name: string,
    customer_last_name: string,
    customer_address: string,
    customer_postcode: string,
    customer_city: string,
    customer_email: string,
    customer_phone: string,
    order_total: number,
    order_items: CartObject[]
} 


export interface POSTRes {
    status: string,
    message: string,
    data: {
        id: number,
        user_id: number,
        order_date: string,
        first_name: string,
        last_name: string,
        address: string,
        postcode: string,
        city: string,
        email: string,
        phone: string,
        order_total: number,
        created_at: string,
        updated_at: string,
        items: {
            id: number,
            order_id: number,
            product_id: number,
            name: string,
            qty: number,
            price: number,
            priceTotal: number,
            images: {
                thumbnail: string, 
                large: string
                }
        }[]
    }
}