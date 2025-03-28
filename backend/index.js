const express = require('express');
const { v4: uuidv4 } = require('uuid');
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
  fs.readFile(`${__dirname}/data/beers.json`, 'utf8', (err, dataString) => {
    if (err) {
      console.log('error at reading file');
      return res.status(500).json('error at reading file');
    }

    const data = JSON.parse(dataString);
    const newBeer = { ...req.body, id: uuidv4() }
    data.push(newBeer);

    fs.writeFile(`${__dirname}/data/beers.json`, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.log('error at writing file');
        return res.status(500).json('error at writing file');
      }

      return res.json(newBeer);
    })
  })
})

app.delete('/api/data/delete/:id', (req, res) => {
  const beerId = req.params.id;

  fs.readFile(`${__dirname}/data/beers.json`, 'utf8', (err, dataString) => {
    if (err) {
      console.log('error at reading file');
      return res.status(500).json('error at reading file');
    }

    const data = JSON.parse(dataString);
    const beerToDelete = data.find(beerData => beerData.id === beerId);

    if (!beerToDelete) {
      return res.status(410).json(`could not find beer with id: ${beerId}`);
    }

    const beers = data.filter(beerData => beerData.id !== beerId);
    
    fs.writeFile(`${__dirname}/data/beers.json`, JSON.stringify(beers, null, 2), (err) => {
      if (err) {
        console.log('error at writing file');
        return res.status(500).json('error at writing file');
      }

      return res.json(`deleted beer with id: ${beerId}`);
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});