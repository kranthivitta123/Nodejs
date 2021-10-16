const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(morgan('dev'))

//need to use before middleware
app.use((req,res,next) => {
    console.log("From middleware");
    next();
})

app.use((req,res,next) => {
    req.requestedTime = new Date().toISOString();
    next();
})

const port = 3000;

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', addTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)


app.use('/api/v1/tours' , tourRouter);
app.use('/api/v1/users' , userRouter);

app.listen(port, () => {
        console.log("Node server started");
})