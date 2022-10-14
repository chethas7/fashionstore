var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var session = require('express-session')





var adminRouter = require('./routes/admin');
var userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/',
helpers:{
  subTotal:function (price, quantity){
    return price * quantity;
  },
  or:(v1,v2)=>{
    return v1||v2;
  },
  multiply:(v1,v2)=>{
    return v1*v2;
  },
  
    eq:(v1,v2)=>{
      return v1===v2;
    },
    format:(date)=>{
      newdate=date.toUTCString()
      return newdate.slice(0,16)
    },
  

}}));

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"key",resave: true,saveUninitialized: true,cookie:{maxAge:60000000}}))
app.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});


app.use('/', (req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next();
})

app.use('/admin', adminRouter);
app.use('/', userRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;















