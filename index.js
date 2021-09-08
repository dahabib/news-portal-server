const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb').ObjectID;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ihro.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("Server is working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const postCollection = client.db("news-portal").collection("posts");
    const userCollection = client.db("news-portal").collection("users");

    // add news
    app.post('/post', (req, res) => {
        const post = req.body;
        postCollection.insertOne(post)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    // posts by user
    app.get('/postsByUser', (req, res) => {
        postCollection.find({ email: req.query.email })
        .toArray( (err, posts) => {
            console.log(posts);
            res.send(posts);
        })
    });

    // posts by author
    app.get('/postByAuthor', (req, res) => {
        postCollection.find({ author: req.query.author })
        .toArray( (err, posts) => {
            console.log(posts);
            res.send(posts);
        })
    });
    
    // post by category
    app.get('/postByCategory', (req, res) => {
        const id = req.query.category;
        postCollection.find({ category: category })
        .toArray( (err, items) => {
            res.send(items);
            console.log(items);
        })
    });

    app.get('/service/:id', (req, res) => {
        postCollection.find({ _id: ObjectID(req.params.id) })
        .toArray( (err, service) => {
            res.send(service[0]);
        })
    });

    app.get('/post/:id', (req, res) => {
        postCollection.find({ _id: ObjectID(req.params.id) })
        .toArray( (err, post) => {
            res.send(post[0]);
        })
    });

    // All Post
    app.get('/allPost', (req, res) => {
        postCollection.find({})
            .toArray((err, bookings) => {
                res.send(bookings);
            })
    })

    app.post('/bookingsByUser', (req, res) => {
        const email = req.body.email;
        userCollection.find({ email: email })
            .toArray((err, users) => {
            })
    })

    app.post('/addUser', (req, res) => {
        const user = req.body;
        userCollection.insertOne({ user })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    // user by email
    app.get('/user', (req, res) => {
        userCollection.find({ "user.email": req.query.email })
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    // all users
    app.get('/users', (req, res) => {
        userCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
});

app.listen(port);
console.log('listening on port', port);