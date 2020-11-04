
// Global variable for tracking the Currentpage-number
let currentPage = 1

// Global variable for tracking the number of pages for pagination.
let maximumPages = 0

/************************************************************ */
//
//        api request start
//
/************************************************************ */

// Function to fetch character data
async function charactersData(page) {
  const response = await fetch("https://swapi.dev/api/people/?page=" + page)
  const data = await response.json()
  return data
}

// Function to fetch data about planets
async function planet(homeworld) {
  const response = await fetch(homeworld)
  const data = await response.json()

  // Calls rendering function for displaying the data
  displayPlanetDetails(data)
}

/** api request end */

/*************************************************************** */
//
//        Functions for rendering and removing elements on page
//
/*************************************************************** */

// Function for rendering characters name
function createListElements(character) {
  const createLi = document.createElement("li");
  const nameOfCharacter = document.createTextNode(character);
  createLi.appendChild(nameOfCharacter);
  document.querySelector(".card__ul--characters").appendChild(createLi);
}


// Function for rendering character details

function displayCharDetails(character) {
  const details = document.querySelector(".character__stats__content")

  details.innerHTML = `
  <h1>${character.name}</h1>
  <p> 
  Height: ${character.height}</br> 
  Mass: ${character.mass}</br> 
  Hair color: ${character.hair_color}</br> 
  Skin color: ${character.skin_color}</br>
  Eye color: ${character.eye_color}</br>
  Birth year: ${character.birth_year}</br>
  Gender: ${character.gender}</br>
  </p>
  `
}

// Function for rendering planet details

function displayPlanetDetails(planet) {
  const planetDetails = document.querySelector(".planet__stats__content")

  planetDetails.innerHTML = `
  <h1>${planet.name}</h1>
  <p>
  Rotation period: ${planet.rotation_period}h</br> 
  Orbital period: ${planet.orbital_period} days</br> 
  Diameter: ${planet.diameter}km</br> 
  Climate: ${planet.climater}</br>
  gravity: ${planet.gravity}</br>
  Terrain: ${planet.terrain}</br>
  </p>
  `
}

//        Functions for rendering and removing elements on page END

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


// Listen for what character was clicked.
document.querySelector(".card__ul--characters").addEventListener("click", character)

// Function for finding the index of character, removing and/or setting the class "active".
async function character(e) {
  const data = await charactersData(currentPage)

  const nodes = document.querySelectorAll('li');
  const characterClicked = [].indexOf.call(nodes, e.target)

  const homeworld = data.results[characterClicked].homeworld
  const httpsUrl = homeworld.replace("http", "https")

  // Call function that displays characters homeworld.
  planet(httpsUrl)

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
