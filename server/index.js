require('dotenv').config()
const express = require('express');
const sequelize = require('./db');
const fileupload = require('express-fileupload');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes');
const errorHandlerMiddleware = require('./middleware/ErrorHandlerMiddleware');

const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileupload({}));
app.use('/api', router);

//Error handlers
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        
        app.listen(PORT, () => console.log(`Server started on ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
};

start();

