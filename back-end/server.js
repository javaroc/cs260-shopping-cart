const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


let products = [];
let cart = [];

// Routes for /api/products
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
        id: crypto.randomUUID(),
        name: req.body.name,
        price: req.body.price
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


/* Routes for /api/cart */

// Request all items in cart
app.get('/api/cart', (req, res) => {
    res.send(cart);
});

// Add product to cart by id
app.post('/api/cart/:id', (req, res) => {
    // Check for item in cart
    let id = req.params.id;
    let item = cart.find(x => x.id == id);
    
    // Add item or increment count
    if (item != undefined) {
        item.quantity++;
    } else {
        // Check that requested product exists
        let productIndex = products.find(x => x.id == id);
        if (productIndex == -1) {
            res.status(404)
                .send(`No product found with id ${id}.`);
        }
        item = {
            id: id,
            quantity: 1
        };
        cart.push(item)
    }
    res.send(item);
});

// Change cart item with id to have given quantity
app.put('/api/cart/:id/:quantity', (req, res) => {
    let id = req.params.id;
    let index = cart.map(product => product.id).indexOf(id);
    
    if (index == -1) {
        res.status(404)
            .send(`No product in cart with id ${id}.`);
        return;
    }
    
    let item = cart[index];
    let quantity = parseInt(req.params.quantity, 10);
    
    item.quantity = quantity;
    if (quantity == 0) {
        cart.splice(index, 1);
    }
    
    res.send(item);
});

// Delete cart item with id
app.delete('/api/cart/:id', (req, res) => {
    let id = req.params.id;
    let index = cart.map(product => product.id).indexOf(id);
    
    if (index == -1) {
        res.status(404)
            .send(`No product in cart with id ${id}.`);
        return;
    }
    
    cart.splice(index, 1);
    res.send(`Successfully deleted item from cart.`);
});


app.listen(3000, () => console.log("Listening on port 3000..."));


