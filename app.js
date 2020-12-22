const dotenv = require('dotenv');
dotenv.config();
require('./src/data/db')
const Joi = require('joi');
Joi.ObjectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const accounts = require('./src/routes/accounts');
const debuts = require('./src/routes/debuts');
const groups = require('./src/routes/groups');
const news = require('./src/routes/news');

app.set('port', 5000);
app.use(cors({
    origin: true,
    credentials: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan('tiny'));
app.use(helmet());

app.use('/api/accounts', accounts);
app.use('/api/debuts', debuts);
app.use('/api/groups', groups);
app.use('/api/news', news);

let server = app.listen(app.get('port'), () => {
    const port = server.address().port;
    console.log('All run on port: ' + port)
})