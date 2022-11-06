const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


let products = [];

app.get('/api/products', (req, res) => {
    res.send(products);
});
app.get('/api/products/:id', (req, res) => {
    let id = req.params.id;
    if (id == undefined) {
        res.send(products);
        return;
    }
    let product = products.find(x => x.id == id)
    if (product != undefined) {
        res.send(product);
    } else {
        res.status(404)
            .send(`No product found with id ${id}.`);
    }
});

app.post('/api/products', (req, res) => {
    let newProduct = {
        "id": crypto.randomUUID(),
        "name": req.body.name,
        "price": req.body.price
    };
    products.push(newProduct);
    res.send(newProduct);
});

app.delete('/api/products/:id', (req, res) => {
    let id = req.params.id;
    let index = products.map(x => x.id).indexOf(id);
    if (index == -1) {
        res.status(404)
            .send(`No product found with id ${id}.`);
        return;
    }
    products.splice(index, 1);
    res.send(`Successfully deleted product with id ${id}.`);
});




app.listen(3000, () => console.log("Listening on port 3000..."));


