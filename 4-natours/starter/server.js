const mongoose = require('mongoose')
const env = require('dotenv')
env.config({ path: './config.env' })

const app = require('./app')
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

// console.log(process.env)

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con => {
    console.log("Connection Successfull")
})


const port = process.env.port || 3000;
const server = app.listen(port, () => {
    console.log("Node server started");
})

process.on('unhandledRejection', err => {
    console.log(err.name);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', err => {
    console.log(err.name);
    server.close(() => {
        process.exit(1);
    });
});

// console.log(x);