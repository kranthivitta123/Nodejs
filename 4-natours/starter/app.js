const express = require('express');

const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErroHandler = require('./controllers/errorController')

const app = express();
app.use(express.json());
if (process.env.NODE_ENV == 'development') {
    app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`))

//need to use before middleware
app.use((req, res, next) => {
    console.log("From middleware");
    next();
})

app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    next();
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//not present route

app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status:'fail',
    //     message:`Cannot match ${req.originalUrl} with any route on the server` 
    // })
    //for global error handing
    // const err = new Error(`Cannot match ${req.originalUrl} with any route on the server`);
    // err.status = 'fail';
    // err.statusCode = 404;

    // next(err); //passing arg means calling error hadling middleware directly

    next(new AppError(`Cannot match ${req.originalUrl} with any route on the server`, 404))
})

//GLOBAL ERROR HANDING MIDDLEWARE if 4 args it is a global error
app.use(globalErroHandler);

module.exports = app;