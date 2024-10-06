// should be moved to a separate package, that package should also provide the objects to pass to the queue
export enum RmqCatalogueCommands {
    GET_ITEMS = "get_items",
    GET_ITEM = "get_item",
    INSERT_ITEMS = "insert_items",
}

export enum RmqBasketCommands {
    GET_BASKET = "get_basket",
    ADD_TO_BASKET = "add_to_basket",
}

export enum RmqOrderCommands {
    GET_ORDER = "get_order",
    CONFIRM_ORDER = "confirm_order",
    UPDATE_STATUS = "update_status",
}
