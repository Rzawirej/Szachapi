const mongoose = require("mongoose");
const Fawn = require("fawn");
Fawn.init(mongoose);

const dburl = process.env.DB_URL;
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
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);