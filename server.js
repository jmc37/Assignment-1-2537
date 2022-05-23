const express = require('express')
const app = express()
var session = require('express-session')
const https = require('https');
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})


const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://jmc37:Assiuassiu1@cluster0.505xk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Use session middleware
app.use(session({
    secret: 'ssshh',
    saveUninitialized: true,
    resave: true
}));


const accountSchema = new mongoose.Schema({
    user: String,
    pass: String,
    cart: Array,
    orders: Array,
    timeline: Array

});
const accountModel = mongoose.model("user", accountSchema);


// Cart items

// get to cart
app.get('/cart', function (req, res) {
    res.sendFile(__dirname + "/public/cart.html");

})

// add to cart 
app.get('/cart/add/:name', function (req, res) {
    accountModel.updateOne({
        user: req.session.user,
        pass: req.session.pass,
    }, {
        $push: {
            cart: {
                name: req.params.name,
                cost: 1000,
                count: 1
            }
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Cart updated");
    });
})

//Find Items in the cart document

app.get('/cart/getItems', function (req, res) {
    accountModel.findOne({
        user: req.session.user,
        pass: req.session.pass
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})

// Increase items in cart by 1

app.get('/cart/increaseItems/:id', function (req, res) {
    // console.log(req.body)
    console.log(req.params.id)
    accountModel.updateOne({
        user: req.session.user,
        pass: req.session.pass,
        "cart.name": req.params.id
        // name : req.params.id
        // "_id": req.params.id
    }, {
        $inc: {
            'cart.$.count': 1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})


app.get('/cart/decreaseItems/:id', function (req, res) {
    // console.log(req.body)
    accountModel.updateOne({
        user: req.session.user,
        pass: req.session.pass,
        "cart.name": req.params.id
    }, {
        $inc: {
            'cart.$.count': -1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Update request is successful!");
    });
})

// Delete item from the Cart

app.get('/cart/RemoveItems/:id', function (req, res) {
    accountModel.updateOne({
        user: req.session.user,
        pass: req.session.pass,

    }, {
        $pull: {
            cart: {
                name: req.params.id
            }
        }

    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Delete request is successful!");
    });
})

// Order Routes
app.get('/orders', function (req, res) {
    res.sendFile(__dirname + "/public/orders.html");


})


// add to order 
app.get('/order/add/:name', function (req, res) {
    accountModel.updateOne({
        user: req.session.user,
        pass: req.session.pass,
    }, {
        $push: {
            orders: {
                name: req.params.name,
                cost: 10,
                count: 1
            }
        }
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send("Cart updated");
    });
})

//get order items
app.get('/orders/getItems', function (req, res) {
    accountModel.findOne({
        user: req.session.user,
        pass: req.session.pass
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})


app.put('/orders/send', function (req, res) {
    console.log(req.body)
    accountModel.findOne({
        user: req.session.user,
        pass: req.session.pass
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
            accountModel.updateOne({
                user: req.session.user,
                pass: req.session.pass
            }, {
                $push: {
                    orders: data.cart
                },
                $set: {
                    cart: []
                }
            }, function (err, data) {
                if (err) {
                    console.log("Error " + err);
                } else {
                    console.log("Data " + data);
                }
            })
        }
        res.send(data);
    });
})



// Login
app.get('/', function (req, res) {
    if (req.session.authenticated) {
        console.log("Welcome user")
        res.sendFile(__dirname + "/public/pages/profile.html")
    } else {
        console.log("User needs to login properly")
        res.sendFile(__dirname + "/public/pages/login.html")
    }
})

app.get('/login', function (req, res) {
    if (req.session.authenticated) {
        res.render("login.ejs", {
            "name": req.session.user
        });
    } else {
        res.sendFile(__dirname + "/public/login.html");
    }
})

app.get('/login/:user/:pass', function (req, res) {
    console.log("this went through")
    let username = req.params.user;
    let password = req.params.pass;
    accountModel.findOne({
        user: username,
        pass: password,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        if (data) {
            req.session.authenticated = true;
            req.session.user = username;
            req.session.pass = password;
        }
        res.send(data);
    });
})

app.put('/create/:user/:pass', function (req, res) {
    let username = req.params.user;
    let password = req.params.pass;

    console.log(username, password)
    accountModel.findOne({
        user: username,
        pass: password,

    }, function (err, data) {
        if (data) {
            res.send(null);
        } else {
            accountModel.create({
                user: username,
                pass: password,
                cart: [],
                orders: [],
                timeline: []
            }, function (err, data) {
                if (err) {
                    console.log("Error " + err);
                } else {
                    console.log("Data " + data);
                }
                res.send(data);
            });
        }
    });
})


app.get('/userinfo', function (req, res) {
    console.log('called')
    accountModel.find({
        user: req.session.user,
    }, function (err, data) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + data);
        }
        res.send(data);
    });
})

app.get('/logout', function (req, res) {
    req.session.authenticated = false;
    res.send("Logout succeeded");
})



const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
    parameterLimit: 10000,
    limit: '50mb',
    extended: true
}));


const pokeschema = new mongoose.Schema({
    id: Number,
    abilities: Array,
    name: String,
    types: Array,
    type: String,
    moves: Array,
    move: Object,
});

const pokeModel = mongoose.model("pokemon", pokeschema);

app.get('/index/:id', function (req, res) {
    console.log(req.params.id)
    pokeModel.find({
            id: req.params.id
        },
        function (err, data) {
            if (err) {
                console.log("Error" + err);
            } else {
                console.log("Data" + data);
            }
            console.log(data)
            res.send(data)
        })
})
app.get('/types/:id', function (req, res) {
    pokeModel.find({
            "types.type.name": req.params.id
        },
        function (err, data) {
            if (err) {
                console.log("Error" + err);
            } else {
                console.log("Data" + data);
            }
            console.log(data)
            res.send(data)
        })
})
app.get('/move/:id', function (req, res) {
    pokeModel.find({
            "moves.move.name": req.params.id
        },
        function (err, data) {
            if (err) {
                console.log("Error" + err);
            } else {
                console.log("Data" + data);
            }
            console.log(req.params.id)
            res.send(data)
        })
})

app.get('/names/:id', function (req, res) {
    pokeModel.find({
            name: req.params.id
        },
        function (err, data) {
            if (err) {
                console.log("Error" + err);
            } else {
                console.log("Data" + data);
            }
            console.log(data)
            res.send(data)
        })
})


const timelineSchema = new mongoose.Schema({
    user: String,
    text: String,
    time: String,
    hits: Number

})
const timelineModel = mongoose.model("timeline", timelineSchema);



app.get('/timeline/getAllEvents', function (req, res) {
    timelineModel.find({}, function (err, data) {
        if (err) {
            console.log("Error" + err);
        } else {
            console.log("Data" + data);
        }
        res.send(data)
    })
})
app.put('/timeline/insert', function (req, res) {
    timelineModel.create({
        'text': req.body.text,
        'time': req.body.time,
        'hits': req.body.hits
    }, function (err, data) {
        if (err) {
            console.log("Error" + err);
        } else {
            console.log("Data" + data);
        }
        res.send(data)
    })
})
app.get('/timeline/delete/:id', function (req, res) {
    timelineModel.deleteOne({
        _id: req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error" + err);
        } else {
            console.log("Data" + data);
        }
        res.send("Deleted")
    })
})


app.use(bodyparser.urlencoded({
    extended: true
}));

app.get('/timeline/:id', function (req, res) {
    console.log(req.body)
    timelineModel.deleteOne({
        '_id': req.params.id
    }, function (err, data) {
        if (err) {
            console.log("Error" + err);
        } else {
            console.log("Data" + data);
        }
        res.send("increase hits")
    })
})
app.get('/timeline/increasehits/:id', function (req, res) {
    console.log(req.body)
    timelineModel.updateOne({
        '_id': req.params.id
    }, {
        $inc: {
            'hits': 1
        }
    }, function (err, data) {
        if (err) {
            console.log("Error" + err);
        } else {
            console.log("Data" + data);
        }
        res.send("increase hits")
    })
})

app.get('/profile/:id', function (req, res) {
    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`

    https.get(url, function (https_res) {
        data = '';
        https_res.on("data", function (chunk) {
            data += chunk
        })

        https_res.on('end', function () {
            data = JSON.parse(data)

            hp_ = data.stats.filter((obj_) => {
                return obj_.stat.name == "hp"
            }).map((obj_2) => {
                return obj_2.base_stat
            })
            console.log(hp_)
            res.render("profile.ejs", {
                "id": req.params.id,
                "name": data.name,
                "img_path": data.sprites.other["official-artwork"]["front_default"],
                "hp": hp_[0]


            });
        })
    })
})




app.use(express.static('./public'));