const express = require('express');
const dotenv = require('dotenv');
const {databaseConnection} = require('./config/db')
const authRoute = require('./v1/routes/authRoute')

const app = express();

const PORT = 4001 || process.env.PORT;
databaseConnection();

//calling of routes
app.use('/rima/auth', authRoute);




app.listen(PORT,()=>{
    console.log(`Server is up and running on port: ${PORT}`)
})
