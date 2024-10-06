db.createUser({
    user: "mkorder",
    pwd: "password", // changeme :)
    roles: [
        { role: "readWrite", db: "order" }
    ]
});
db = new Mongo().getDB("order");

db.createCollection('orders', { capped: false });
db.orders.insertMany([
    {
        userId: "user12345", items: [
            { id: "someId1", quantity: 2, price: 10.19, total: 20.38 },
            { id: "someId2", quantity: 1, price: 15.49, total: 15.49 }
        ],
        totalPrice: 35.87,
        totalItems: 3,
        status: 'pending',
        createdAt: "2024-10-01T14:00:00Z",
        updatedAt: "2024-10-01T14:30:00Z"
    },
]);

// follows the same logic as baskets, we mostly fetch by userId, but we also want to search by status
db.orders.createIndex({ userId: 1, status: 1 });