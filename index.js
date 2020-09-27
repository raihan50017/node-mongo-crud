const express = require('express');
const app = express();
const morgan = require('morgan');
const PORT = process.env.port || 3000;
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
const uri = "mongodb+srv://organicUser:@raihan@@cluster0.7txzq.mongodb.net/organicdb?retryWrites=true&w=majority";

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

    app.get('/product/:id', (req, res) =>{
        productCollection.find({_id: ObjectID(req.params.id)})
        .toArray((err, document) =>{
            res.send(document[0])
        })
    })

    app.get('/products', (req, res) =>{
        productCollection.find({})
        .toArray((err , documents) =>{
            console.log(err)
            res.send(documents)
        })
    })

    app.post('/addProduct' ,(req, res) =>{
        productCollection.insertOne(req.body)
        .then(result => {
            console.log('Data added successfully');
            res.redirect('/');
        })
    })
    app.delete('/delete/:id', (req,res) =>{
        productCollection.deleteOne({_id: ObjectID(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0)
        })
    })

    app.patch('/update/:id', (req, res) =>{
        productCollection.updateOne({_id: ObjectID(req.params.id)}, {
            $set: {price: req.body.price, quantity: req.body.quantity}
        })
        .then(result => {
            res.send(result.modifiedCount > 0)
        })
    })
});


app.listen(PORT, () =>{
    console.log(`SERVER IS RUNNING ON PORT: ${PORT}`)
})