var express = require('express');
var app = express();
let middleware = require('./middleware');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
var product = require('../model/retailproductModel.js');

app.get('/api/getRetailProductByCat', function (req, res) {
    var cat = req.query.cat;
    var countryId = req.query.countryId;
    product.getRetailProductByCat(cat, countryId)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get retail product list");
        });
});

app.get('/api/getRetailProductBySku', function (req, res) {
    var sku = req.query.sku;
    var countryId = req.query.countryId;
    product.getRetailProductBySku(countryId, sku)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get retail product by sku");
        });
});

app.get('/api/getAllRetailProducts', middleware.checkToken, function (req, res) {
    product.getAllRetailProducts()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get all retail product");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/addRetailProduct', jsonParser, function (req, res) {
    var name = req.body.name;
    var category = req.body.category;
    var description = req.body.description;
    var sku = req.body.SKU;
    var length = req.body.length;
    var width = req.body.width;
    var height = req.body.height;
    var imgFile = req.files.imgfile;
    var imgPath = '/img/products/' + sku + '.jpg';
    imgFile.mv('./view' + imgPath, function(err) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            var data = {
                name: name,
                category: category,
                description: description,
                sku: sku,
                length: length,
                width: width,
                height: height,
                imgPath: imgPath
            };
            
            product.addRetailProduct(data)
                .then((result) => {
                    if(result.success) {
                        res.redirect('/A6/retailProductManagement_Add.html?goodMsg=Retail Product with SKU "' + result.sku + '" has been created successfully.')
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send("Failed to add retail product");
                });
        }
    });
});

app.post('/api/removeRetailProduct', [middleware.checkToken, jsonParser], function (req, res) {
    product.removeRetailProduct(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to remove retail product");
        });
});

app.post('/api/updateRetailProduct', jsonParser, function (req, res) {
    var id = req.body.id;
    var sku = req.body.sku;
    var name = req.body.name;
    var category = req.body.category;
    var description = req.body.description;
    var imgFile = req.files.imgfile;
    var imgPath = '';

    var data = {
        id: id,
        name: name,
        category: category,
        description: description,
        imgPath: imgPath
    };
    
    if(Object.keys(req.files).length == 0) {
        updateRetailProduct(data, res);
    }
    else {
        imgPath = '/img/products/' + sku + '.jpg';
        imgFile.mv('./view' + imgPath, function(err) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                updateRetailProduct(data, res);
            }
        });
    }
});

module.exports = app;

function updateRetailProduct(data, res) {
    product.updateRetailProduct(data)
        .then((result) => {
            if(result) {
                res.redirect('/A6/retailProductManagement.html?goodMsg=Retail Product updated successfully.')
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update retail product");
        });
}