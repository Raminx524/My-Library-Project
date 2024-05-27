const booksUrl = "http://localhost:8001/books";
const historyUrl = "http://localhost:8001/history";
let numPage = 1;
const prevBtn = document.querySelector("#previousHanler");
const nextBtn = document.querySelector("#nextHanler");
const prevNextDIvElem = document.querySelector("#pagination");
const createFormElem = document.querySelector("#createBookForm");
const bookDetailsContainer = document.querySelector("#bookDetailsDisplay");
// let activeBookId;
async function renderBooks() {
  try {
    const res = await axios.get(`${booksUrl}?_page=${numPage}&_per_page=20`);
    const books = res.data.data;
    const tableElem = document.querySelector("table");
    tableElem.innerHTML = `<thead>
    <th>ID</th>
    <th>TITLE</th>
    </thead><tbody></tbody>`;
    const tbodyElem = tableElem.querySelector("tbody");
    for (let i = 0; i < books.length; i++) {
      tbodyElem.innerHTML += `
      <tr onclick="goToBook(this)">
        <td>${books[i].id}</td>
        <td>${books[i].title}</td>
        </tr>`;
    }
    prevNextDIvElem.style.display = "flex";
    paginationHandler(res.data);
  } catch (error) {
    console.log(error);
  }
}

prevBtn.onclick = () => {
  numPage--;
  renderBooks();
};

nextBtn.onclick = () => {
  numPage++;
  renderBooks();
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
  const bodyFromData = new FormData(createFormElem);
  try {
    await axios.post(booksUrl, bodyFromData, {
      headers: { "Content-Type": "application/json" },
    });
    msgBox.innerText = "Book added successfully!";
    msgBox.style.color = "green";
    addToHistory({
      operation: "CREATE",
      time: new Date(),
      ISBN: createFormElem.ISBN.value,
    });
    renderBooks();
  } catch (error) {
    console.log(error);
    msgBox.innerText = "Failure!";
    msgBox.style.color = "red";
  }
});

// function showDetails(elem) {
//   bookDetailsContainer.style.display = "flex";
//   activeBookId = elem.childNodes[1].innerText;
//   axios.get(`${booksUrl}/${activeBookId}`).then((res) => {
//     const bookData = res.data;
//     const valuesElems = document.querySelectorAll(".infoValue");
//     let elemIndex = 0;
//     for (let key in bookData) {
//       if (key == "image") {
//         continue;
//       }
//       if (key == "ISBN") {
//         valuesElems[elemIndex].innerText = bookData[key]["identifier"];
//       } else {
//         valuesElems[elemIndex].innerText = bookData[key];
//       }
//       elemIndex++;
//     }
//   });
// }

function goToBook(elem) {
  const bookID = elem.childNodes[1].innerText;
  window.location.assign(`./bookdetails.html?id=${bookID}`);
}

renderBooks();

async function addToHistory(obj) {
  await axios.post(historyUrl, obj);
}
