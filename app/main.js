const booksUrl = "http://localhost:8001/books";
const historyUrl = "http://localhost:8001/history";
let numPage = 1;
const prevBtn = document.querySelector("#previousHanler");
const nextBtn = document.querySelector("#nextHanler");
const prevNextDIvElem = document.querySelector("#pagination");
const createFormElem = document.querySelector("#createBookForm");
const bookDetailsContainer = document.querySelector("#bookDetailsDisplay");
const loaderElem = document.querySelector(".loader");
let isGetAll = true;
renderAll();

async function renderAll() {
  document.querySelector("table").innerHTML = "";
  try {
    loaderElem.style.display = "grid";
    const res = await axios.get(`${booksUrl}?_page=${numPage}&_per_page=20`);
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
  const tableElem = document.querySelector("table");
  tableElem.innerHTML = `<thead>
    <th>ID</th>
    <th>TITLE</th>
    </thead><tbody></tbody>`;
  const tbodyElem = tableElem.querySelector("tbody");
  booksArr.forEach((book) => {
    tbodyElem.innerHTML += `
      <tr onclick="goToBook(this)">
        <td>${book.id}</td>
        <td>${book.title}</td>
        </tr>`;
  });
  prevNextDIvElem.style.display = "flex";
}

prevBtn.onclick = () => {
  numPage--;
  if (isGetAll) {
    renderAll();
  } else {
    renderSearch();
  }
};

nextBtn.onclick = () => {
  numPage++;
  if (isGetAll) {
    renderAll();
  } else {
    renderSearch();
  }
};

function paginationHandler(pagesInfo) {
  if (pagesInfo.pages == numPage) {
    nextBtn.disabled = true;
  } else {
    nextBtn.disabled = false;
  }
  if (numPage === 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.disabled = false;
  }
}

createFormElem.addEventListener("submit", async (e) => {
  const msgBox = createFormElem.querySelector("#addFormMsgBox");
  e.preventDefault();
  msgBox.innerText = "";
  const bookObj = createBookObj(createFormElem);
  validateBook(bookObj);
});

function goToBook(elem) {
  const bookID = elem.childNodes[1].innerText;
  window.location.assign(`./bookdetails.html?id=${bookID}`);
}

async function addToHistory(obj) {
  await axios.post(historyUrl, obj);
}
async function searchBook() {
  let searchPage = 1;
  const bookToSearch = document.querySelector("#bookSearchValue").value;
  let booksToDisplay = [];
  while (booksToDisplay.length < 10) {
    try {
      const response = await axios.get(
        `${booksUrl}?_page=${searchPage}&_per_page=50`
      );
      const pagesInfo = response.data;
      const currentBooks = pagesInfo.data;
      const filteredBooks = currentBooks.filter((book) =>
        book.title.includes(bookToSearch)
      );
      booksToDisplay = booksToDisplay.concat(filteredBooks);
      if (searchPage == pagesInfo.pages) {
        break;
      }
      searchPage++;
      renderBooks(booksToDisplay);
    } catch (err) {
      console.log(err);
    }
  }
}

function createBookObj(formElem) {
  return {
    title: formElem.title.value,
    authors: formElem.authors.value.includes(",")
      ? formElem.authors.value.split(",")
      : [formElem.authors.value],
    numPages: formElem.numPages.value,
    description: formElem.description.value,
    image: formElem.image.value != "" ? formElem.image.value : "undefined",
    copies: formElem.copies.value,
    categories: formElem.categories.value.includes(",")
      ? formElem.categories.value.split(",")
      : [formElem.categories.value],
    ISBN: formElem.ISBN.value != "" ? formElem.ISBN.value : "undefined",
  };
}

async function validateBook(book) {
  const msgBox = createFormElem.querySelector("#addFormMsgBox");
  //check if ISBN is given
  if (book.ISBN != "") {
    //ISBN is given - no need to check Title, only ISBN
    try {
      // Check if book ISBN Exists in json-server
      const response = await axios.get(`${booksUrl}?ISBN=${book.ISBN}`);
      if (response.data.length > 0) {
        //ISBN found in json-server
        console.log(response.data);
        msgBox.innerText = "Failure! Book ISBN already exist!";
        msgBox.style.color = "red";
        return;
      } else {
        //response is empty/not found - post book to json-server
        try {
          await axios.post(booksUrl, book);
          msgBox.innerText = "Book added successfully!";
          msgBox.style.color = "green";
          await addToHistory({
            operation: "CREATE",
            time: new Date(),
            ISBN: createFormElem.ISBN.value,
          });
          renderAll();
          return;
        } catch (error) {
          console.log(error);
          msgBox.innerText = "Failure!";
          msgBox.style.color = "red";
        }
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    //ISBN not given, look for unique title instead
    try {
      // Check if book title Exists
      const response = await axios.get(`${booksUrl}?title=${book.title}`);
      if (response.data.length > 0) {
        //book title exists - abort
        msgBox.innerText = "Failure! Book Title already exist!";
        msgBox.style.color = "red";
        return;
      } else {
        //book title is unique - post book to json-server
        try {
          await axios.post(booksUrl, book);
          msgBox.innerText = "Book added successfully!";
          msgBox.style.color = "green";
          await addToHistory({
            operation: "CREATE",
            time: new Date(),
            ISBN: createFormElem.ISBN.value,
          });
          renderAll();
          return;
        } catch (error) {
          console.log(error);
          msgBox.innerText = "Failure!";
          msgBox.style.color = "red";
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

const sortBtnElem = document.querySelector("#sortBtn");
sortBtnElem.addEventListener("click", () => {
  numPage = 1;
  renderSearch();
});

async function renderSearch() {
  isGetAll = false;
  try {
    const res = await axios.get(
      `${booksUrl}?_sort=title&_page=${numPage}&_per_page=20`
    );
    console.log(res.data);
    renderBooks(res.data.data);
    paginationHandler(res.data);
  } catch (error) {}
}
