db.createUser({
    user: "mkbasket",
    pwd: "password", // changeme :)
    roles: [
        { role: "readWrite", db: "basket" }
    ]
});
db = new Mongo().getDB("basket");

db.createCollection('baskets', { capped: false });
db.baskets.insertMany([
    {
        user_id: "user12345", items: [
            { name: "Item 1", quantity: 2, total: 21.98 },
            { name: "Item 2", quantity: 1, total: 15.49 }
        ],
        total_price: 37.47,
        total_items: 3,
        created_at: "2024-10-01T14:00:00Z",
        updated_at: "2024-10-01T14:30:00Z"
    },
]);

db.baskets.createIndex({ user_id: 1 });