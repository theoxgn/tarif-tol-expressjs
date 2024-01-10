const express = require("express");
const PORT = 3000;
const app = express();
const knex = require('./db/knex');
const bodyParser = require('body-parser')
const morgan = require('morgan')
const routerV1 = require('./routes/v1/index')
app.use(morgan('tiny'));

app.get("/ping", (req, res) => {
    res.send({
        error: false,
        message: "Server is healthy",
    });
});

app.listen(PORT, () => {
    knex.raw('select 1=1 as test')
    .then(result=> { console.log('DB CONNECTION: ',result.rows[0].test)})
    .catch(err=>{console.log('ERROR DB:',err)});
    console.log("Server started listening on PORT : " + PORT);
});

// parsing the request bodys
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// inisialisasi router
app.use('/v1/', routerV1);