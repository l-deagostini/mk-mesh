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
        userId: "user12345", items: [
            { id: "someId1", quantity: 2, price: 10.19, total: 20.38 },
            { id: "someId2", quantity: 1, price: 15.49, total: 15.49 }
        ],
        totalPrice: 35.87,
        totalItems: 3,
        createdAt: "2024-10-01T14:00:00Z",
        updatedAt: "2024-10-01T14:30:00Z"
    },
]);

db.baskets.createIndex({ userId: 1 });