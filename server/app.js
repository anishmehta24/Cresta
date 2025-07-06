const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const app = express();
const connectDB = require('./db/db');

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {  
    res.send('Hello, World!');
});

app.use('/api/users', userRoutes);


module.exports = app;

