const express = require('express');
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8000;
const lanip = `http://192.168.1.16:8000/`;
const databbase = require('./db/db');
const userRoutes = require('./Routes/user');
const profileroutes = require('./Routes/profile');
const postroutes = require('./Routes/post');
const header_middleware = require("./middleware/header");
const poststory = require('./Routes/story');
const bodyParser = require('body-parser');
const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(header_middleware);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// const directory = path.join(__dirname, './images');
// app.use('/public', express.static('public'));
// app.use("/images", express.static(directory));
app.get('/apitest', function (request, response) {
    response.send('Hello this SOCAIL APP api');
})
app.use('/api', userRoutes);
app.use('/api', profileroutes);
// app.use('/api', postroutes);
app.use('/api', poststory);
app.listen(PORT, (req, res) => {
    console.log(`app is listening on check now ${lanip}`);
})