const { MongoClient, ObjectId } = require('mongodb');

const connectionUrl = 'mongodb://localhost:27017';
const client = new MongoClient(connectionUrl);

const dbName = 'GamesCrud';   

async function main() {
    await client.connect();
    console.log('Connected!');
    const db = client.db(dbName);
    const collection = db.collection("games");

    /* await addNewGame(collection);  */
    await updateGame(collection);
    await findAllGames(collection);

    return 'done!';
}

async function addNewGame(collection) {
    const newGame = {
        name: 'Dark Souls 3',
        genre: 'Action RPG',
    };

    const result = await collection.insertOne(newGame);
    console.log(result);
};

async function findAllGames(collection) {
    const findResult = await collection.find({}).toArray();
    console.log({findResult});
};

async function updateGame(collection) {
    const objectId = new ObjectId("660ea36c47e2c99bae250773");
    const updateResult = await collection.updateOne({ _id: objectId }, { $set: { price : 59.99 } });
    console.log(updateResult);
};


main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());