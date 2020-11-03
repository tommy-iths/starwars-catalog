
// Global variable for tracking the Currentpage-number
let currentPage = 1
let maximumPages = 0

// Function to fetch data from API
async function charactersData(page) {

  const response = await fetch("https://swapi.dev/api/people/?page=" + page)

  // destructuring, outputing Json-data.
  const data = await response.json()

  // Returning the API-resulats to charactrerList-function
  return data
}

// Function to fetch data from API
async function planet(homeworld) {

  const response = await fetch(homeworld)

  // destructuring, outputing Json-data.
  const data = await response.json()

  const planetDetails = document.querySelector(".planet__stats__content")

  planetDetails.innerHTML = `
  <h1>${data.name}</h1></br>
  Rotation period: ${data.rotation_period}</br> 
  Orbital period: ${data.orbital_period}</br> 
  Diameter: ${data.diameter}</br> 
  Climate: ${data.climater}</br>
  gravity: ${data.gravity}</br>
  Terrain: ${data.terrain}</br>
  </p>
  `

}

// Function för creating and rendering list items to the DOM
function createListElements(character) {
  const createLi = document.createElement("li");
  const nameOfCharacter = document.createTextNode(character);
  createLi.appendChild(nameOfCharacter);
  document.querySelector(".card__ul--characters").appendChild(createLi);
}


// Function thats clears UL and updates variable currentPage count.
function clicked(e) {
  let buttonClicked = e.target.className;

  if (buttonClicked === "next" && currentPage < maximumPages) {
    document.querySelector(".card__ul--characters").innerHTML = "";
    document.querySelector(".card__content__loader").style.display = "block";
    currentPage = currentPage + 1
    charactrerList()
  } else if (buttonClicked === "prev" && currentPage > 1) {
    if (currentPage > 1) {
      document.querySelector(".card__ul--characters").innerHTML = "";
      document.querySelector(".card__content__loader").style.display = "block";
      currentPage = currentPage - 1
      charactrerList()
    }
  }
}


// Function for rendering character details

function displayCharDetails(character) {
  const details = document.querySelector(".details")

  details.innerHTML = `
  <h1>${character.name}</h1></br>
  <p> 
  Height: ${character.Height}</br> 
  Mass: ${character.mass}</br> 
  Hair color: ${character.hair_color}</br> 
  Skin color: ${character.skin_color}</br>
  Eye color: ${character.eye_color}</br>
  Birth year: ${character.birth_year}</br>
  Gender: ${character.gender}</br>
  </p>
  `
}


// Listen for what character was clicked.
document.querySelector(".card__ul--characters").addEventListener("click", character)

// Function for finding the index of character, removing and/or setting the class "active".
async function character(e) {
  const data = await charactersData(currentPage)

  const nodes = document.querySelectorAll('li');
  const characterClicked = [].indexOf.call(nodes, e.target)

  const homeworld = data.results[characterClicked].homeworld

  // Call function that displays characters homeworld.
  planet(homeworld)

  displayCharDetails(data.results[characterClicked])

  nodes.forEach(element => {
    element.classList.remove("card__li--active")
  })

  let setActive = document.querySelectorAll('li')[characterClicked]
  setActive.classList.add("card__li--active");
}


async function charactrerList() {
  const data = await charactersData(currentPage)
  document.querySelector(".card__content__loader").style.display = "none";
  // variable for setting the amount of pages needed. 10 is the maximum number of characters a "page" can display.
  maximumPages = maximumPages = Math.ceil(data.count / 10)

  // Rendering the current and max of the pagination 
  document.querySelector(".card__navbar__index").innerHTML = currentPage + " / " + maximumPages

  // Iterating over every charactar for that "page", and using a funtion to render it to the DOM.
  for (let character of data.results) {
    createListElements(character.name)
  }

  // Listen for menu click to update characters-list.
  document.querySelector(".card__navbar").addEventListener("click", clicked)

}
charactrerList()
