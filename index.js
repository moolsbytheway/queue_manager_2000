const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Datastore = require('nedb'), db = new Datastore({autoload: true});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function (req,
                       res) {

    db.find({}).sort({ date: -1, team: 1 }).exec((err, docs) => {
        console.log(docs);
        res.render("queue", {list: docs});
      });

});

app.get('/new', function (req,
                          res) {
    res.render("new");
});
app.get('/remove', function (req,
                             res) {
    res.render("remove");
});


app.post('/add_item', function (req, res) {

    var doc = req.body;
    doc.date = new Date();
    db.insert(doc, function (err, doc) {
        res.redirect("/");
    });

})

app.post('/remove_item', function (req, res) {

    var doc = req.body.jira

    db.remove({jira: doc}, function (err) {
        res.redirect("/");
    });

})


const server = app.listen(8080, function () {
    const host = server.address().address
    const port = server.address().port
    console.log("App listening http://%s:%s", host, port);
})
