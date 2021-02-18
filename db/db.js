const mongoose = require('mongoose');
// const url = "mongodb://localhost:27017/socailapp";
const url = 'mongodb+srv://nath:Messycodes@2k21@cluster0.efvv2.mongodb.net/test';
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log('Hello SOCIAL APP database connected');
    } else {
        console.log('Database connection get failed')
    }
});
