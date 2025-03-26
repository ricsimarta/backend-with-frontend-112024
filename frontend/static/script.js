console.log('hello world');

const beerComponent = (beer) => `
  <div class="beer">
    <h2>${beer.name}</h2>
    <h3>${beer.price}</h3>
    <h4>${beer.rating}</h4>
  </div>
`;

const beersComponent = (beers) => `
  <div class="beers">
    ${beers.map(beer => beerComponent(beer)).join("")}
  </div>
`;

fetch('/api/data')
  .then(res => res.json())
  .then(data => {
    const rootElement = document.querySelector("#root");
    rootElement.insertAdjacentHTML("beforeend", beersComponent(data));
  });