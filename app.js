const express = require('express');
const exphbs = require('express-handlebars');
const { MongoClient, ObjectId } = require('mongodb');
var bodyParser = require('body-parser');

const connectionUrl = 'mongodb://localhost:27017';
const client = new MongoClient(connectionUrl);
const dbName = 'GamesCrud';

async function getGamesCollection(){
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("games");
    return collection;
}

const app = express();

app.engine('hbs', exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs"
}));

app.set("view engine", "hbs");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const collection = await getGamesCollection();
    const findResult = await collection.find({}).toArray(); 
    res.render('home', { games: findResult });
});

app.get('/new-game', (req, res) => {
    res.render('new-game');
});

app.post('/new-game', async (req, res) => {
    const newGame = {
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description,
    };

    const collection = await getGamesCollection();  

    await collection.insertOne(newGame);

    res.redirect('/');
});

app.get("/games/:id", async (req, res) => {
    const objectId = new ObjectId(req.params.id);
    const collection = await getGamesCollection();
    const game = await collection.findOne({ _id: objectId });

    res.render('edit-game', { game });  
});

app.post("/edit-game/:id", async (req, res) => {
    const updatedGame = {
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description,
    };

    const objectId = new ObjectId(req.params.id);
    const collection = await getGamesCollection();
    await collection.updateOne({ _id: objectId }, { $set: updatedGame });

    res.redirect('/');  
});

app.post("/delete-game/:id", async (req, res) => {
    const objectId = new ObjectId(req.params.id);
    const collection = await getGamesCollection();
    await collection.deleteOne({ _id: objectId });

    res.redirect('/');  
});

app.listen(8000, () => {
    console.log('http://localhost:8000');
});
