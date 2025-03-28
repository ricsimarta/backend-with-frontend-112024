const rootElement = document.querySelector("#root");
let beersData = [];

const beerComponent = (beer) => `
  <div class="beer">
    <button id="delete-${beer.id}" class="delete">x</button>
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
    <button>send</button>
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