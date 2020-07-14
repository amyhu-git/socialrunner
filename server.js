var express = require('express'); //need to use express package
var basicAuth = require('basic-auth');
//var expressBasicAuth = require('express-basic-auth')
//var compare = require('tsscmp')
var bodyParser = require('body-parser');
var app = express(); //create server
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


let config = require('./database/config-db.js');
let model = require('./database/user-model')
let dao = require('./database/run-dao')

app.put('/addUser/:id', function(req, res, next) { //register new users with name and password
    let id = req.params.id;
    console.log(`Adding ${id}`)
    let body = req.body;
    console.log(body)
    let user = model.User.fromJSON(body);
    console.log(user)
    db.insertUser(id, user.toJSON())
        .then(user_id => {
            console.log(user_id)
            res.status(200).end(`Added user '${body.fullname}'`)
        })
        .catch(err => {
            console.log(err);
            res.status(500).end(`Could not add user ${body._username.toUpperCase}`);
        })

})

app.get('/getUser/:id', function(req, res, next) {
    let id = req.params.id;
    db.getUsers(id)
        .then(jsn => {
            let user = model.User.fromJSON(jsn); // this will do all the validation for us!
            res.status(200).json(user.toJSON());
        })
        .catch(err => {
            console.log(err);
            res.status(500).end(`Could not get user with id ${id}`);
        });
});

//simple custom middleware function to check the credentials in the request header
var authenticate = function(req, res, next) {
    var credentials = basicAuth(req);

    console.log(credentials);

    if (!credentials) {
        console.log('Invalid username or password')
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401)
            //res.setHeader('WWW-Authenticate', 'Basic realm="example"')

    }
    req.username = credentials.name
    req.password = credentials.pass
    console.log(req.password)
    return next();
}

app.put('/addRoute/:id', function(req, res, next) { //register new users with name and password
    let id = req.params.id.toLowerCase();
    console.log(id)
    console.log(`Adding ${id}`)
    let body = req.body;
    console.log(body)
    let route = model.Route.fromJSON(body);
    console.log(route)
    db.insertRoute(id, route.toJSON())
        .then(route_id => {
            console.log(route_id)
            res.status(200).send(`Added Route '${body.routeName}'`)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(`Could not add Route ${body.routeName.toUpperCase}`);
        })

})

app.put(`/updateRoute/:id`, function(req, res, next) {
    let id = req.params.id.toLowerCase()
    console.log(id)
    console.log(`Updating ${id}`)
    let body = req.body;
    console.log(body)
    db.getRoute(id)
        .then(body => {
            return body
        })
        .then(doc => {
            let route = doc
            route.participant = body
            console.log(doc)
            db.insertUser(id, route)
            console.log('updated')
            res.status(200).json({ msg: 'Glad to have you joining us on the run!' })
        })
})

app.put(`/addComment/:id`, function(req, res, next) {
    let id = req.params.id.toLowerCase()
    console.log('Adding comment')
    let body = req.body;
    console.log(body)
        // let comment = { "comment": `${body.comment}`, "user": `${body.user}` }
    db.getRoute(id)
        .then(body => {
            return body
        })
        .then(doc => {
            let route = doc
            route.comment = body
            console.log(doc)
            db.insertUser(id, route)
            console.log('updated')
        })
})

app.get('/getRoutes/', function(req, res, next) {
    let route = 'all'
    db.getRoutes(route)
        .then(routes => {
            console.log(routes);
            res.status(200).json(routes)
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(`Could not get all routes`);
        })
})

app.get('/login/:id', authenticate, function(req, res, next) {
    let id = req.params.id
    db.getUser(id)
        .then(json => {
            console.log('login-route')
            console.log(json);
            let user = model.User.fromJSON(json);
            console.log(user)
            if (user._password !== req.password) {
                console.log(user._password, req.password)
                return res.status(401).send("Invalid Credentials")
            } else {
                res.status(200).json({ msg: 'Hello, ' + req.username.toUpperCase() })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).end(`Cannot access ${id}`)
        })
});

//only one middleware  function for the 'public_info' route - we do not need to authenticate to see this!
app.use('/public_info', function(req, res, next) {
    let msg = "Ready to  become a Social Runner?";
    res.status(200).json({ msg: msg });
});

app.use(express.static('content'));

// set up and intitialise the database 
var db = new dao.DAO(config.db_info.url, config.db_info.username, config.db_info.password);
db.init(config.db_info.database)
    //only start listening once the database initialisation has finished
    .then(body => app.listen(21977, () => { console.log("listening on port 21977") }))
    .catch(err => console.log('Not listening: database could not be initialised', err))