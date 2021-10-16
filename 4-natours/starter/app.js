const express = require('express');

const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

module.exports = app;