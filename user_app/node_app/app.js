const express = require('express');
const areas = require('./routes/area');

const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET", "PUT", "POST", "DELETE", "OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api/',areas);



app.get('/', (req, res) => {
    res.send('Zdravo!! :)');
});

app.listen(80);
