const rootElement = document.querySelector("#root");
let beersData = [];

const beerComponent = (beer) => `
  <div class="beer">
    <button id="delete-${beer.id}" class="delete">x</button>
    <button id="edit-${beer.id}" class="edit">E</button>
    <h2>${beer.name}</h2>
    <h3>${beer.price}</h3>
    <h4>${beer.rating}</h4>
    <button id="add-${beer.id}" class="add">add to cart</button>
  </div>
`;

const beersComponent = (beers) => `
  <div class="beers">
    ${beers.map(beer => beerComponent(beer)).join("")}
  </div>
`;

const newBeerComponent = () => `
  <form>
    <input type="text" name="name" placeholder="beer name" />
    <input type="number" name="price" placeholder="beer price" />
    <input type="number" name="rating" placeholder="beer rating" />
    <button class="submit">add beer</button>
  </form>
`;

const findBeer = (id) => {
  const beer = beersData.find(beerData => beerData.id === id);
  return beer;
}

const createAddBeerToCartEvents = () => {
  document.querySelectorAll("button.add").forEach(button => button.addEventListener("click", (event) => {
    const beerId = event.target.id.substring(4);
    const beer = findBeer(beerId);
  }))
}

const createEditBeerEvents = () => {
  document.querySelectorAll("button.edit").forEach(button => button.addEventListener("click", () => {
    const beerId = button.id.substring(5);
    const beer = beersData.find(beerData => beerData.id === beerId);

    if (beer) {
      const oldFormElement = document.querySelector('form');
      oldFormElement.remove();
      rootElement.insertAdjacentHTML("beforeend", newBeerComponent());

      const beerNameInput = document.querySelector('input[name="name"]');
      beerNameInput.value = beer.name;

      const beerPriceInput = document.querySelector('input[name="price"]');
      beerPriceInput.value = beer.price;

      const beerRatingInput = document.querySelector('input[name="rating"]');
      beerRatingInput.value = beer.rating;

      const submitButtonElement = document.querySelector('button.submit');
      submitButtonElement.innerHTML = "update beer";

      const formElement = document.querySelector('form');
      formElement.addEventListener('submit', (event) => {
        event.preventDefault();

        const updatedBeerData = { id: beerId }

        if (beer.name !== beerNameInput.value) updatedBeerData.name = beerNameInput.value;
        if (beer.price !== Number(beerPriceInput.value)) updatedBeerData.price = Number(beerPriceInput.value);
        if (beer.rating !== Number(beerRatingInput.value)) updatedBeerData.rating = Number(beerRatingInput.value);

        if (Object.keys(updatedBeerData).length < 2) {
          return init();
        }

        /* const updatedBeerData = {
          id: beerId,
          ...beer.name !== beerNameInput.value && { name: beerNameInput.value },
          ...beer.price !== Number(beerPriceInput.value) && { price: Number(beerPriceInput.value) },
          ...beer.rating !== Number(beerRatingInput.value) && { rating: Number(beerRatingInput.value) }
        } */

        fetch('/api/data/patch', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedBeerData)
        })
          .then(async res => {
            if (Math.floor(res.status / 100) !== 2) {
              const message = await res.json();
              throw new Error(message);
            }
            return res.json();
          })
          .then(() => init())
          .catch(err => console.log(err))
      })
    }
  }))
}

const createDeleteBeerEvents = () => {
  document.querySelectorAll("button.delete").forEach(button => button.addEventListener("click", () => {
    const beerId = button.id.substring(7);

    fetch(`/api/data/delete/${beerId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(data => {
        /* TO DO: OTHER MEGKÖZELÍTÉS */
        console.log(data);
        beersData = beersData.filter(beerData => beerData.id !== beerId);
        createDom();
      });
  }))
}

const createAddNewBeerEvent = () => {
  document.querySelector('form').addEventListener('submit', (event) => {
    event.preventDefault();

    const beerNameInput = document.querySelector('input[name="name"]');
    const beerPriceInput = document.querySelector('input[name="price"]');
    const beerRatingInput = document.querySelector('input[name="rating"]');

    const newBeer = {
      name: beerNameInput.value,
      price: Number(beerPriceInput.value),
      rating: Number(beerRatingInput.value)
    }

    fetch('/api/data/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBeer)
    })
      .then(res => res.json())
      .then(newData => {
        beersData.push(newData);
        createDom();
      })
  })
}

const createElements = () => {
  rootElement.insertAdjacentHTML("beforeend", beersComponent(beersData));
  rootElement.insertAdjacentHTML("beforeend", newBeerComponent());
}

const createEvents = () => {
  createAddBeerToCartEvents();
  createDeleteBeerEvents();
  createAddNewBeerEvent();
  createEditBeerEvents();
}

const createDom = () => {
  rootElement.innerHTML = "";
  createElements();
  createEvents();
}

const init = () => {
  fetch('/api/data')
    .then(res => res.json())
    .then(data => {
      beersData = data;
      createDom();
    });
}

init();