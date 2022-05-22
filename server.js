const express = require('express')
const app = express()
var session = require('express-session')
const https = require('https');
app.set('view engine', 'ejs');

// Use session middleware
app.use(session({
    secret: 'ssshh',
    saveUninitialized: true,
    resave: true
}));


users = [{
        username: "user1",
        password: "pass1",
        shoppingCart: [{
                pokeID: 25,
                quantity: 2,
                price: 32
            },
            {
                pokeID: 21,
                quantity: 4,
                price: 16
            }
        ]
    },
    {
        username: "user2",
        password: "pass2"
    },
]

function logger1(x, y, next) {
    console.log('logger1 function got executed')
    next()
}
// how you declare a middleware
app.use(logger1)

function auth(req, res, next) {
    if (req.session.authenticated)
        next()
    else {
        res.sendFile(__dirname + '/public/pages/login.html')    }
}
app.get('/userProfile/:name', function (req, res) {
    res.write(`Welcome ${req.params.name}`)
    res.write(`<br>`)
    // console.log(users.filter( user => user.username == req.params.name))
    res.write(JSON.stringify(
        users.filter(user => user.username == req.params.name)[0].shoppingCart[0]
    ))
    res.send()
})
app.get('/', auth, function (req, res) {
    console.log("/ route got accessed!")
    res.send(`Welcome <a href="/userProfile/${req.session.user}"> ${req.session.user} </a>`)


})
app.get('/login/', function (req, res, next) {
    res.status(400)
    res.send("please provide the credentials through the url")
})

app.get('/login/:user/:pass', function (req, res, next) {
    if (users.filter(user => user.username == req.params.user)[0].password == req.params.pass) {

        req.session.authenticated = true
        req.session.user = req.params.user
        res.send("succesful login!")
    } else {
        req.session.authenticated = false
        res.send('failed login')
    }
})
app.listen(process.env.PORT || 5000, function (err) {
    if (err)
        console.log(err);
})

app.use(express.static('./public'));

const bodyparser = require("body-parser");
app.use(bodyparser.urlencoded({
    parameterLimit: 10000,
    limit: '50mb',
    extended: true
}));
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://jmc37:Assiuassiu1@cluster0.505xk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


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

app.get('/', function (req, res) {
    timelineModel.find({}, function (err, data) {
        if (err) {
            console.log("Error" + err);
        } else {
            console.log("Data" + data);
        }
        res.send(data)
    })
})

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

const usersSchema = new mongoose.Schema({
    user_id: String,
    username: String,
    password: String,
    cart: [Object],
    past_orders: [
        [Object]
    ],
    timeline: [Object]
}, {
    collection: 'users'
})

const usersModel = mongoose.model("users", usersSchema);

app.get('/login', (req, res) => {
    // If they're authenticated, send them to their profile, otherwise send them to the login page
    if (req.session.authenticated) {
        res.redirect('/profile')
    } else {
        res.sendFile(__dirname + '/public/pages/login.html')
    }
})

function authenticate(req, res, next) {
    if (req.session.authenticated) {
        next()
    } else {
        res.redirect('/login')
    }
}

app.post('/login', async (req, res) => {
    await authenticateLogin(req.body.username, req.body.password).then(user => {
        req.session.user = user
    })
    req.session.authenticated = req.session.user != null
    res.json({
        success: req.session.authenticated,
        user: req.session.user,
        message: req.session.authenticated ? "Authentication success." : "Authentication failed."
    })
})

async function authenticateLogin(username, password) {
    const users = await usersModel.find({
        username: username,
        password: password
    })
    return users[0]
}
app.use(express.static('./public'));