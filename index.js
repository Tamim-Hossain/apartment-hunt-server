require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q43xx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());

app.use(bodyParser.json());
const port = 4000;
app.use(fileUpload());

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get('/', (req, res) => {
    res.send("Server is Ready mama!")
})


client.connect((err) => {
    const bookingsCollection = client.db('apartmentHunt').collection('bookings');
    const rentsCollection = client.db('apartmentHunt').collection('rent');
    const addRentsCollection = client.db('apartmentHunt').collection('add-rent');

    // To post all data
    app.post('/bookings', (req, res) => {
        const bookings = req.body;
        bookingsCollection.insertMany(bookings)
            .then((result) => {
                res.send(result.insertedCount);
            });
    });

    // To get all data
    app.get('/bookings', (req, res) => {
        bookingsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    // for use Params try to solve it
    app.get('/bookings/:id', (req, res) => {
        const intId = parseInt(req.params.id)
        eventCollection.find({ id: intId })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // To get RentsData
    app.get('/rents', (req, res) => {
        rentsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.post('/rents', (req, res) => {
        const rents = req.body;
        rentsCollection.insertOne(rents).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });


    app.get('/add-rent', (req, res) => {
        addRentsCollection.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    app.post('/add-rent', (req, res) => {
        const AddedRents = req.body;
        addRentsCollection.insertOne(AddedRents).then((result) => {
            res.send(result.insertedCount > 0);
        });
    });

    // add Rent House done
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
            img: Buffer.from(encImg, 'base64')
        };

        addRentsCollection.insertOne({ name, email, title, location, bath, price, bed, image })
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

});

app.listen(process.env.PORT || port);
