const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

/* for static files */
app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});
app.use('/public', express.static(path.join(`${__dirname}/../frontend/static`)));

/* for api */
app.get('/api/data', (req, res) => {
  res.sendFile(path.join(`${__dirname}/data/beers.json`));
});

app.post('/api/data/new', (req, res) => {
  console.log(req.body);
  const { id, name, price, rating } = req.body;

  /* const objKeys = Object.keys(req.body);

  if (objKeys.length < 4) return res.status(406).send('incomplete data');

  for (let i = 0; i < objKeys.length; i++) {
    if (!req.body[objKeys[i]]) return res.status(406).send('incomplete data');
  }

  if (!req.body.id || !req.body.name || !req.body.price || !req.body.rating || typeof req.body.rating !== 'number' || typeof req.body.price !== 'number') {
    return res.status(406).send('incomplete data');
  } */


  fs.readFile(`${__dirname}/data/beers.json`, 'utf8', (err, dataString) => {
    if (err) {
      console.log('error at reading file');
      return res.status(500).send('error at reading file');
    }

    const data = JSON.parse(dataString);

    const newBeer = { ...req.body, id: data[data.length - 1].id + 1 }

    /* const found = data.find(beer => beer.id === id);
    if (found) return res.status(409).send('id is already in use'); */

    data.push(newBeer);

    fs.writeFile(`${__dirname}/data/beers.json`, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.log('error at writing file');
        return res.status(500).send('error at writing file');
      }

      return res.send(newBeer);
    })
  })

  //res.send('ok');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});