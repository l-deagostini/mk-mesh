db.createUser({
    user: "mkcat",
    pwd: "password", // changeme :)
    roles: [
        { role: "readWrite", db: "catalogue" }
    ]
});
db = new Mongo().getDB("catalogue");

db.createCollection('items', { capped: false });
db.items.insertMany([
    { name: "Item 1", description: "Description for item 1", price: 10.99 },
    { name: "Item 2", description: "Description for item 2", price: 15.49 },
    { name: "Item 3", description: "Description for item 3", price: 8.99 },
    { name: "Item 4", description: "Description for item 4", price: 22.00 },
    { name: "Item 5", description: "Description for item 5", price: 5.25 }
]);

db.items.createIndex({ name: 1 });