const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q43xx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    const bookingsCollection = client
        .db('apartmentHunt')
        .collection('bookings');
    const rentsCollection = client.db('apartmentHunt').collection('rent');
    const addRentsCollection = client
        .db('apartmentHunt')
        .collection('add-rent');

    // POST
    app.post('/bookings', (req, res) => {
        const bookings = req.body;
        bookingsCollection.insertMany(bookings).then((result) => {
            res.send(result.insertedCount);
        });
    });

    // GET
    app.get('/bookings', (req, res) => {
        bookingsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    //Params
    app.get('/bookings/:id', (req, res) => {
        const intId = parseInt(req.params.id);
        eventCollection.find({ id: intId }).toArray((err, documents) => {
            res.send(documents);
        });
    });

    // POST
    app.post('/rents', (req, res) => {
        const rents = req.body;
        rentsCollection.insertOne(rents).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    //GET
    app.get('/rents', (req, res) => {
        rentsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    // POST
    app.post('/add-rent', (req, res) => {
        const AddedRents = req.body;
        addRentsCollection.insertOne(AddedRents).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // GET
    app.get('/add-rent', (req, res) => {
        addRentsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    // POST
    app.post('/addRent', (req, res) => {
        const name = req.body.name;
        const email = req.body.email;
        const title = req.body.title;
        const location = req.body.location;
        const bath = req.body.bath;
        const price = req.body.price;
        const bed = req.body.bed;
        const file = req.files.image;
        const Img = file.data;
        const encImg = Img.toString('base64');
        const image = {
            contentType: req.files.image.mimetype,
            size: req.files.image.size,
            img: Buffer.from(encImg, 'base64'),
        };

        addRentsCollection
            .insertOne({
                name,
                email,
                title,
                location,
                bath,
                price,
                bed,
                image,
            })
            .then((result) => {
                res.send(result.insertedCount > 0);
            });
    });
});

app.listen(process.env.PORT || port);
