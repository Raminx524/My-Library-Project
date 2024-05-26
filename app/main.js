const booksUrl = "http://localhost:8001/books";
let numPage = 1;
const prevBtn = document.querySelector("#previousHanler");
const nextBtn = document.querySelector("#nextHanler");
const prevNextDIvElem = document.querySelector("#pagination");

const getAllBtn = document.querySelector("#getAllBooks");
getAllBtn.onclick = async () => {
  try {
    const res = await axios.get(`${booksUrl}?_page=${numPage}&_per_page=20`);
    console.log(res.data);
    const books = res.data.data;
    const tableElem = document.querySelector("table");
    tableElem.innerHTML = `<thead>
    <th>ID</th>
    <th>TITLE</th>
    </thead><tbody></tbody>`;
    const tbodyElem = tableElem.querySelector("tbody");
    for (let i = 0; i < books.length; i++) {
      tbodyElem.innerHTML += `<tr>
        <td>${books[i].id}</td>
        <td>${books[i].title}</td>
        </tr>`;
    }
    prevNextDIvElem.style.display = "flex";
    paginationHandler(res.data);
  } catch (error) {
    console.log(error);
  }
};

prevBtn.onclick = () => {
  numPage--;
  getAllBtn.click();
};

nextBtn.onclick = () => {
  numPage++;
  getAllBtn.click();
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

const createFormElem = document.querySelector("#createBookForm");
createFormElem.addEventListener("submit", async (e) => {
  const msgBox = createFormElem.querySelector("#addFormMsgBox");
  e.preventDefault();
  msgBox.innerText = "";
  const bodyFromData = new FormData(createFormElem);
  try {
    const res = await axios.post(booksUrl, bodyFromData, {
      headers: { "Content-Type": "application/json" },
    });
    console.log(res);

    msgBox.innerText = "Book added successfully!";
    msgBox.style.color = "green";
  } catch (error) {
    console.log(error);
    msgBox.innerText = "Failure!";
    msgBox.style.color = "red";
  }
});
