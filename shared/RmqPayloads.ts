// file containing the definitions of the payloads used in the rabbitmq messages
export interface GetItemsPayload {
    page: number;
}

export interface GetItemPayload {
    id: string;
}

export interface InsertItemsPayload {
    items: unknown[];
}
