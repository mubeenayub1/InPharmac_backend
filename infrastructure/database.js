const mongoose = require('mongoose');

// const url = 'mongodb://127.0.0.1:27017/inpharmaC'
const url = 'mongodb+srv://mubeenayub388:Csf19m*9@cluster0.mtm2n.mongodb.net/?retryWrites=true&w=majority'
// const url = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inpharmaC'

const database = {
    connect: function(startServer) {
        mongoose.connect(url);
        mongoose.connection.on('connected', () => {
            console.log(`Connected to database ${url}`);
            startServer();
        });
        mongoose.connection.on('error', (err) => {
            if (err) {
                console.log('Error in database connection: ' + err);
            }
        });
    }
}

module.exports = database;