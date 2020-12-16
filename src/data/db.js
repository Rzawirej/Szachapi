const mongoose = require("mongoose");
const Fawn = require("fawn");
Fawn.init(mongoose);

const dburl = "mongodb+srv://admin:admin123@szachapi.j892v.mongodb.net/SzachApi?retryWrites=true&w=majority";
mongoose.connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on("connected", function () {
    console.log("Mongoose connected to " + dburl);
});
mongoose.connection.on("disconnected", function () {
    console.log("Mongoose disconnected");
});
mongoose.connection.on("error", function (err) {
    console.log("Mongoose connection error " + err);
});