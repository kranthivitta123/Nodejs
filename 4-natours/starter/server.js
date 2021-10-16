const mongoose = require('mongoose')
const env = require('dotenv')
env.config({path:'./config.env'})

const app = require('./app')
const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD)

// console.log(process.env)

mongoose.connect(DB ,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con => {
    console.log("Connection Successfull")
})


const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("Node server started");
})