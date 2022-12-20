const express = require('express');
const indexRouter = require('./src/routes/index');

const app = express();
indexRouter(app);

const server = app.listen(9090, function () {
    console.log("Kodo API running on port: " + server.address().port);
});

module.exports = app;