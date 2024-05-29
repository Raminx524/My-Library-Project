const baseUrl = "http://localhost:8001/books";
const historyUrl = "http://localhost:8001/history";
const favoritesUrl = "http://localhost:8001/favorites";
const urlObj = new URL(window.location.href);
const params = new URLSearchParams(urlObj.searchParams);
const bookID = params.get("id");
let popUpElem;
let bookISBN;
init();
let bookObj;

async function init() {
  try {
    const bookResponse = await axios.get(`${baseUrl}/${bookID}`);
    const bookDetails = bookResponse.data;
    bookObj = bookDetails;

    bookISBN = bookDetails.ISBN;
    document.querySelector("h1").innerText = bookDetails.title;
    renderBookDetails(bookDetails);
    const favResponse = await axios.get(`${favoritesUrl}/${bookID}`);
    favBtn.classList.add("activeFav");
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
        document.querySelector("img").src =
          book[key] != "undefined"
            ? book[key]
            : "https://i.imgflip.com/8s4nsr.jpg";
        break;
      case "categories":
        document.querySelector(`#${key}`).innerText = book[key].join(", ");
        break;
      case "ISBN":
        document.querySelector(`#${key}`).innerText = book[key];
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
    addToHistory({
      operation: "DELETE",
      time: new Date(),
      ISBN: bookISBN,
    });
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
  window.location.assign("../HomePage/index.html");
}

function increment() {
  let copiesNum = document.querySelector(`#copies`).innerText;
  copiesNum++;
  updateCopies(copiesNum).then(() => init());
}
function decrement() {
  let copiesNum = document.querySelector(`#copies`).innerText;
  copiesNum--;
  updateCopies(copiesNum).then(() => init());
}

async function updateCopies(numCopies) {
  try {
    await axios.patch(`${baseUrl}/${bookID}`, { copies: numCopies });
    addToHistory({
      operation: "UPDATE",
      time: new Date(),
      ISBN: bookISBN,
    });
  } catch (err) {
    console.log(err);
  }
}

async function addToHistory(obj) {
  try {
    await axios.post(historyUrl, obj);
  } catch (error) {
    console.log(error);
  }
}
async function addToFav() {
  favBtn.classList.toggle("activeFav");
  if (favBtn.classList.contains("activeFav")) {
    try {
      const res = await axios.post(favoritesUrl, bookObj);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const res = await axios.delete(`${favoritesUrl}/${bookObj.id}`);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
}
const favBtn = document.querySelector("#favBtn");
favBtn.onclick = addToFav;
