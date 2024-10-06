// file containing the definitions of the payloads used in the rabbitmq messages
export interface PagePayload {
    page: number;
}

export interface IdPayload {
    id: string;
}

export interface ArrayPayload {
    items: unknown[];
}

export interface AddToBasketPayload {
    userId: string;
    itemId: string;
    quantity: number;
}

export interface UpdateOrderStatusPayload {
    orderId: string;
    status: string;
}
