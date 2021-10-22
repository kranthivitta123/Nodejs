const fs = require('fs');
const mongoose = require('mongoose')
const env = require('dotenv')
env.config({path:'./config.env'})

const Tour = require('../../models/tourModel')

const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD)

// console.log(process.env)

mongoose.connect(DB ,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(con => {
    console.log("Connection Successfull")
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'))

const importData = async () => {
    try {
      await Tour.create(tours);
      console.log("Data successfully loaded")
    }
    catch (err) {

    }
    process.exit();
}

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log("Data successfully deleted")
    }
    catch (err) {

    }
    process.exit();
}

if (process.argv[2] === "--import") {
    importData();
}
else if (process.argv[2] === "--delete") {
    deleteData();
}