const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    secret = require("./config/secret"),
    URL = process.env.BASE_URL || "localhost";


mongoose.connect(secret.mongoConnection, {dbName: 'AndroidProject'})
    .then(() => {
        console.log('db success connected');
    }).catch(() => {
        console.error("error connection");
    });

app.use(express.json());

const Users = require('./routes/Users')
app.use('/users', Users);

app.listen(
    PORT,
    () => console.log(`it is live now on ${URL}:${PORT}`)
);