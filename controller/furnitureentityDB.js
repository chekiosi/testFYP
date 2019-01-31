var express = require('express');
var app = express();
let middleware = require('./middleware');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
var furniture = require('../model/furnitureModel.js');
app.get('/api/getFurnitureByCat', function (req, res) {
    var cat = req.query.cat;
    var countryId = req.query.countryId;
    furniture.getFurnitureByCat(countryId, cat)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get furniture by category");
        });
});

app.get('/api/getFurnitureBySku', function (req, res) {
    var sku = req.query.sku;
    var countryId = req.query.countryId;
    furniture.getFurnitureBySku(countryId, sku)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get furniture by sku");
        });
});

app.get('/api/getAllFurniture', middleware.checkToken, function (req, res) {
    furniture.getAllFurniture()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to get all furniture");
        });
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json({ extended: false });
app.post('/api/addFurniture', jsonParser, function (req, res) {
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
            furniture.addFurniture(data)
                .then((result) => {
                    if(result.success) {
                        res.redirect('/A6/furnitureManagement_Add.html?goodMsg=Furniture with SKU "' + result.sku + '" has been created successfully.')
                    }
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500).send("Failed to add furniture");
                });
        }
    });
});

app.post('/api/removeFurniture', [middleware.checkToken, jsonParser], function (req, res) {
    furniture.removeFurniture(req.body)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to remove Furniture");
        });
});

app.post('/api/updateFurniture', jsonParser, function (req, res) {
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
        updateFurniture(data, res);
    }
    else {
        imgPath = '/img/products/' + sku + '.jpg';
        imgFile.mv('./view' + imgPath, function(err) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                updateFurniture(data, res);
            }
        });
    }
});

module.exports = app;

function updateFurniture(data, res) {
    furniture.updateFurniture(data)
        .then((result) => {
            if(result) {
                res.redirect('/A6/furnitureManagement.html?goodMsg=Furniture updated successfully.')
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Failed to update furniture");
        });
}