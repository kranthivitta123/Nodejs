const env = require('dotenv')
env.config({path:'./config.env'})

const app = require('./app')

// console.log(process.env)

const port = process.env.port || 3000;
app.listen(port, () => {
    console.log("Node server started");
})