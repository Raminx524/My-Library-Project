const booksUrl = "http://localhost:8001/books";
const historyUrl = "http://localhost:8001/history";
let numPage = 1;
const prevBtn = document.querySelector("#previousHanler");
const nextBtn = document.querySelector("#nextHanler");
const prevNextDIvElem = document.querySelector("#pagination");
const createFormElem = document.querySelector("#createBookForm");
const bookDetailsContainer = document.querySelector("#bookDetailsDisplay");
renderAll();
async function renderAll() {
  try {
    const res = await axios.get(`${booksUrl}?_page=${numPage}&_per_page=20`);
    const books = res.data.data;
    renderBooks(books);
    paginationHandler(res.data);
  } catch (error) {
    console.log(error);
  }
}

function renderBooks(booksArr) {
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
  renderAll();
};

nextBtn.onclick = () => {
  numPage++;
  renderAll();
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
  try {
    await axios.post(booksUrl, bookObj);
    msgBox.innerText = "Book added successfully!";
    msgBox.style.color = "green";
    addToHistory({
      operation: "CREATE",
      time: new Date(),
      ISBN: createFormElem.ISBN.value,
    });
    renderAll();
  } catch (error) {
    console.log(error);
    msgBox.innerText = "Failure!";
    msgBox.style.color = "red";
  }
});

function goToBook(elem) {
  const bookID = elem.childNodes[1].innerText;
  window.location.assign(`./bookdetails.html?id=${bookID}`);
}

async function addToHistory(obj) {
  await axios.post(historyUrl, obj);
}
async function searchBook() {
  const bookToSearch = document.querySelector("#bookSearchValue").value;
  try {
    const response = await axios.get(`${booksUrl}?_page=1&_per_page=50`);
    console.log(response.data);
    const currentBooks = response.data.data;
    const filteredBooks = currentBooks.filter((book) =>
      book.title.includes(bookToSearch)
    );
    renderBooks(filteredBooks);
  } catch (err) {
    console.log(err);
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
    image: formElem.image.value,
    copies: formElem.copies.value,
    categories: formElem.categories.value.includes(",")
      ? formElem.categories.value.split(",")
      : [formElem.categories.value],
    ISBN: formElem.ISBN.value,
  };
}
