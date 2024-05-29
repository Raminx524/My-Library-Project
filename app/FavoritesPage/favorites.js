const favoritesUrl = "http://localhost:8001/favorites";
const prevNextDivElem = document.querySelector("#pagination");
const nextHandler = document.querySelector("#nextHanler");
const prevHandler = document.querySelector("#previousHanler");
let numPage = 1;
const loaderElem = document.querySelector(".loader");

async function renderAll() {
  try {
    loaderElem.style.display = "grid";
    const res = await axios.get(
      `${favoritesUrl}?_page=${numPage}&_per_page=20`
    );
    const books = res.data.data;
    // setTimeout(() => {
    //   renderBooks(books);
    // }, 3000);
    renderBooks(books);
    paginationHandler(res.data);
  } catch (error) {
    console.log(error);
  }
}

function renderBooks(booksArr) {
  loaderElem.style.display = "none";
  const getAllContainer = document.querySelector("#booksSection");
  const booksElems = booksArr.map(
    (book) => `<div class="bookContainer" onclick="goToBook(this)">
  <p>${book.id}</p>
  <div class="bookInfo">
    <h3>${book.title}</h3>
    <img src="${book.image}" alt="Photo not found" />
    <span>${book.ISBN}</span>
  </div>
</div>`
  );
  getAllContainer.innerHTML = booksElems.join("");
  prevNextDIvElem.style.display = "flex";
}

loaderElem.style.display = "grid";
setTimeout(() => {
  renderAll();
}, 2000);

nextHandler.onclick = () => {
  tableElem.innerHTML = "";
  numPage++;
  renderAll();
};

prevHandler.onclick = () => {
  tableElem.innerHTML = "";
  numPage--;
  renderAll();
};

function paginationHandler(pageInfo) {
  if (pageInfo.last == numPage) {
    nextHandler.disabled = true;
  } else {
    nextHandler.disabled = false;
  }
  if (numPage == 1) {
    prevHandler.disabled = true;
  } else {
    prevHandler.disabled = false;
  }
  if (prevHandler.disabled && nextHandler.disabled) {
    prevNextDivElem.style.display = "none";
  }
}

function goToBook(elem) {
  const bookID = elem.childNodes[1].innerText;
  window.location.assign(`../BookDetailsPage/bookdetails.html?id=${bookID}`);
}
