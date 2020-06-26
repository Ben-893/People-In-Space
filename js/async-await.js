const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/'; //Assigns the api links to variables for easier use
const peopleList = document.getElementById('people'); //Assigns the div element with the id of 'people' to a variable
const btn = document.querySelector('button'); // Assigns our button to a variable

// Handle all fetch requests
async function getJSON(url) {
  try {
    const response = await fetch(url); //Assigns data returned by fetch to a variable
    return await response.json(); //Returns a parsed version of that data
  } catch (error) { //Catches and handles errors?
    throw error;
  }
}

async function getPeopleInSpace(url) {
  const peopleJSON = await getJSON(url); //Assigns the parsed json data from the 'getJSON' function to a new variable

  const profiles = peopleJSON.people.map( async (person) => { //Creates a new array with the people data from the 'peopleJSON' variable
    const craft = person.craft; //Assigns the spacecraft the person is on to a new variable
    if (person.name == "Anatoly Ivanishin") { //If statement to make sure the api doesn't get confused with the spelling of this astronaut's name
      person.name = "Anatoli_Ivanishin"
  }
  
  const profileJSON = await getJSON(wikiUrl + person.name); //Combines and assigns the parsed data from fetched the wikiUrl + the person.name to a new variable

    return { ...profileJSON, craft }; //Returns the data from 'peopleJson' side by side with the data stored in 'craft'
  });

  return Promise.all(profiles); //Returns all data stored in 'profiles' for every astronaut
}

// Generate the markup for each profile
function generateHTML(data) {
  data.map( person => { //Creates a new array with all the data
    const section = document.createElement('section'); //Creates new 'section' elements in the html and assigns them to a new variable
    peopleList.appendChild(section); //Assigns the newly created 'section' tags to the 'peopleList' div
    section.innerHTML = `
      <img src=${person.thumbnail.source}>
      <span>${person.craft}</span> 
      <h2>${person.title}</h2>
      <p>${person.description}</p>
      <p>${person.extract}</p>
    `;
  }); //Lines 38 - 44 provide the layout for how we want to format our data on the webpage
}

btn.addEventListener('click', (event) => { //Creates a button that responds to click events
  event.target.textContent = "Loading..."; //Changes the button's text to 'loading...' when clicked

  getPeopleInSpace(astrosUrl) //This is where we call 'getPeopleInSpace' and pass in the 'astrosUrl' Url
  .then(generateHTML) //Here we call the 'generateHTML' function (Not sure how generateHTML is actually getting access the data?)
  .catch( e => { //Here we create a catch method to catch errors
    peopleList.innerHTML = '<h3>Something went wrong!</h3>'; //On error, replace all text in the div with this
    console.error(e); //Log the error to the console
  })
  .finally( () => event.target.remove() ) //After click, and when the page loads, remove the button from the page.
});