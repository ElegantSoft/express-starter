const express   = require('express');
const path      = require('path');
const mongoose  = require('mongoose');
const publicRoutes  = require('./router/public');
const dbConstants   = require('./constants/db');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// DB monfo
mongoose.connect(dbConstants.dbUrl,{useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=> {
    console.log(`connected to mongo`)
});
//set view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');
//set public folder
app.use(express.static(path.join(__dirname,'public')));
//port
const port = process.env.PORT || 5000;
app.listen(port,(err)=>{
    if(err) throw err;
    console.log(`listening on ${port}`)
});
app.use('/',publicRoutes);
