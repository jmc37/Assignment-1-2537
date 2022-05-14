const express = require('express')
const app = express()
const https = require('https');
app.set('view engine', 'ejs');

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
    types: [Object]
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
pokeModel.find({id: req.params.id}, function(err,data){
   data = JSON.parse(JSON.stringify(data[0]))
        console.log(data)
        hp_ =  data.stats.filter((obj_)=>{
            return obj_.stat.name == "hp"
        }).map( (obj_2)=> {
            return obj_2.base_stat
        })
        console.log(hp_)
        res.render("profile.ejs", {
            "id": req.params.id,
            "name": data.name,
            "img_path": data.sprites.other["official-artwork"]["front_default"],
            "hp": hp_[0],
            "type": data.types[0].type.name,
            "weight": data.weight


        });
    });
})




app.use(express.static('./public'));