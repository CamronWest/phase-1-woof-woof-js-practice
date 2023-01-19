// On the page, there is a div with the id of "dog-bar". When the page loads, use fetch to get all of the pup data from your server. When you have this information, 
// you'll need to add a span with the pup's name to the dog bar (ex: <span>Mr. Bonkers</span>).

// When a user clicks on a pup's span in the div#dog-bar, that pup's info 
// (image, name, and isGoodDog status) should show up in the div with the id of "dog-info". Display the pup's info in the div with the following elements:

// an img tag with the pup's image url
// an h2 with the pup's name
// a button that says "Good Dog!" or "Bad Dog!" based on whether isGoodDog is true or false. 
// When a user clicks the Good Dog/Bad Dog button, two things should happen:

// The button's text should change from Good to Bad or Bad to Good
// The corresponding pup object in the database should be updated to reflect the new isGoodDog value
// You can update a dog by making a PATCH request to /pups/:id and including the updated isGoodDog status in the body of the request.

document.addEventListener("DOMContentLoaded", init)

function init(e){
  const filterDogsButton = document.querySelector("#good-dog-filter")
  filterDogsButton.addEventListener("click", toggleFilterDogs)
  getDogs().then(addAllDogsToDogBar)
}

function toggleFilterDogs(e){
  const filterDogsButton = document.querySelector("#good-dog-filter")
  if (filterDogsButton.innerText.includes("OFF")){
    filterDogsButton.innerText = "Filter good dogs: ON"
    updateDogBar()
  } else {
    filterDogsButton.innerText = "Filter good dogs: OFF"
    updateDogBar()
  }
}

function addAllDogsToDogBar(dogArray, filter = false){
  const dogBar = document.querySelector("#dog-bar")
  dogBar.innerHTML = ""
  if (filter) {
    dogArray.filter(dog => dog.isGoodDog).forEach(addDogSpantoDogBar)
  } else {
    dogArray.forEach(addDogSpantoDogBar)
  }
}

function addDogSpantoDogBar(dog){
  const dogBar = document.querySelector("#dog-bar")
  const dogSpan = document.createElement("span")
  dogSpan.innerText = dog.name
  dogSpan.dataset.id = dog.id

  dogSpan.addEventListener("click", onDogSpanClick)

  dogBar.append(dogSpan)
}

function onDogSpanClick(e){
  getSingleDog(e.target.dataset.id)
    .then(addDogInfoToPage)
}

function addDogInfoToPage(dog){
  const dogInfo = document.querySelector("#dog-info")
  dogInfo.innerHTML = ""
  const dogImg = document.createElement("img")
  dogImg.src = dog.image

  const dogTitle = document.createElement("h2")
  dogTitle.innerText = dog.name

  const dogButton = document.createElement("button")
  dogButton.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
  dogButton.dataset.id = dog.id
  dogButton.addEventListener("click", onGoodDogButtonClick)

  dogInfo.append(dogImg, dogTitle, dogButton)
}

function onGoodDogButtonClick(e){
  let newValue;
  if (e.target.innerText.includes("Good")){
    e.target.innerText = "Bad Dog"
    newValue = false
  } else {
    e.target.innerText = "Good Dog"
    newValue = true
  }
  toggleGoodDog(e.target.dataset.id, newValue).then(updateDogBar)
}

function updateDogBar(){
  const filterDogsButton = document.querySelector("#good-dog-filter")
  if (filterDogsButton.innerText.includes("OFF")){
    getDogs().then(dogArray => addAllDogsToDogBar(dogArray))
  } else {
    getDogs().then(dogArray => addAllDogsToDogBar(dogArray, true))
  }
}

// fetches:

const baseURL = "http://localhost:3000/pups"

function getDogs(){
  return fetch(baseURL)
    .then(r => r.json())
}

function getSingleDog(id){
  return fetch(baseURL + `/${id}`)
    .then(r => r.json() )
}

function toggleGoodDog(id, newValue){
  const options = {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      isGoodDog: newValue
    })
  }
  return fetch(baseURL + `/${id}`, options)
    .then(r => r.json());
}

