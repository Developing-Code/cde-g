const express = require('express');
const app= express();
const http = require('http');
const server = http.createServer(app);

const {Server} = require('socket.io')
const io = new Server(server)
 
const path= require('path');
const morgan= require('morgan');
const mysql= require("mysql");
const myconnection= require('express-myconnection');
const session = require('express-session');

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const MySQLStore = require('express-mysql-session')



io.on('connection', (socket) => {
    console.log('connection established')

    socket.on('cromfinalizado', (msg)=>{
       io.emit('cromfinalizado', msg);
    })
})

const options ={
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'cdegpanel'

}

const sessionStore = new MySQLStore(options);


app.use(session({
    key: 'cookie_usuario',
    secret: '54654564651',
    store: sessionStore,
    expiration: 86400000,
    resave: false,
    saveUninitialized: false
}))


app.set("port", process.env.PORT || 4000)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'))

//middlewares
app.use(morgan('dev'));
app.use(myconnection(mysql,{
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'cdegpanel'
    //c9panel
    //@jbhfNAHF6 
}));



app.use(express.urlencoded({extended:false}));

//import routes
const customerRoutes = require('./routes/customer');

//static files

app.use(express.static(path.join(__dirname, '/public')));
// subir imagen 

//routes
app.use('/', customerRoutes);
;

app.get('*', function(req, res){
        res.render('404')
  }); 
//START ///////////////////////sin ssl//////////////////////////
server.listen(app.get('port'), ()=>{
    console.log("server on port"+app.get('port'))
});
///////////////////////////////////////////////////////////////