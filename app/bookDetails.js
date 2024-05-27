const baseUrl = "http://localhost:8001/books";
const urlObj = new URL(window.location.href);
const params = new URLSearchParams(urlObj.searchParams);
const bookID = params.get("id");
let popUpElem;
init();

async function init() {
  try {
    const response = await axios.get(`${baseUrl}/${bookID}`);
    const bookDetails = response.data;
    document.querySelector("h1").innerText = bookDetails.title;
    renderBookDetails(bookDetails);
  } catch (error) {
    console.log(error);
  }
}

function renderBookDetails(book) {
  for (const key in book) {
    switch (key) {
      case "authors":
        document.querySelector(`#${key}`).innerText = book[key].join(", ");
        break;
      case "image":
        document.querySelector("img").src = book[key];
        break;
      case "categories":
        document.querySelector(`#${key}`).innerText = book[key].join(", ");
        break;
      case "ISBN":
        document.querySelector(`#${key}`).innerText = book[key]["identifier"];
        break;
      default:
        document.querySelector(`#${key}`).innerText = book[key];
        break;
    }
  }
}

async function deleteBook() {
  try {
    await axios.delete(`${baseUrl}/${bookID}`);
    popUpElem.innerHTML += "<span>Success! Redirecting..</span>";
    setTimeout(goBack, 3000);
  } catch (err) {
    popUpElem.innerHTML = "Something went wrong, try again later!";
    setTimeout(cancelPopUp, 2000);
  }
}

function showPopUp(dialogIndex) {
  popUpElem = document.querySelectorAll("dialog")[dialogIndex];
  popUpElem.open = true;
  document.querySelector("#bookDetailsDisplay").style.filter =
    "brightness(0.5)";
}

function cancelPopUp() {
  popUpElem.open = false;
  document.querySelector("#bookDetailsDisplay").style.filter = "none";
}

function goBack() {
  window.location.assign("./index.html");
}

function increment() {
  let numnberOfCopies = document.querySelector(`#copies`).innerText;
  numnberOfCopies++;
  updateCopies(numnberOfCopies);
  init();
}
function decrement() {
  let numnberOfCopies = document.querySelector(`#copies`).innerText;
  numnberOfCopies--;
  updateCopies(numnberOfCopies);
  init();
}

async function updateCopies(numCopies) {
  const res = axios.patch(`${baseUrl}/${bookID}`, { copies: numCopies });
}
