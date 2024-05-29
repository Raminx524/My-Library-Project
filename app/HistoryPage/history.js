const historyUrl = "http://localhost:8001/history";
const prevNextDivElem = document.querySelector("#pagination");
const nextHandler = document.querySelector("#nextHandler");
const prevHandler = document.querySelector("#previousHandler");
let numPage = 1;
const tableElem = document.querySelector("table");
const loaderElem = document.querySelector(".loader");

async function showAllHistory() {
  loaderElem.style.display = "none";
  tableElem.innerHTML += `<thead>
    <th>ID</th>
    <th>OPERATION</th>
    <th>TIME OF OPERATION</th>
    <th>ISBN</th>
    </thead><tbody></tbody>`;
  try {
    const res = await axios.get(`${historyUrl}?_page=${numPage}`);
    console.log(res.data);
    const historyItemArrs = res.data.data;
    historyItemArrs.forEach((histItem) => {
      tableElem.querySelector("tbody").innerHTML += `
        <td>${histItem.id}</td>
        <td>${histItem.operation}</td>
        <td>${histItem.time}</td>
        <td>${histItem.ISBN}</td>
        `;
    });
    paginationHandlers(res.data);
  } catch (error) {
    console.log(error);
  }
}

loaderElem.style.display = "grid";
setTimeout(() => {
  showAllHistory();
}, 2000);

nextHandler.onclick = () => {
  tableElem.innerHTML = "";
  numPage++;
  showAllHistory();
};

prevHandler.onclick = () => {
  tableElem.innerHTML = "";
  numPage--;
  showAllHistory();
};

function paginationHandlers(pageInfo) {
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
    console.log("true");
    prevNextDivElem.style.display = "none !important";
  } else {
    prevNextDivElem.style.display = "flex";
  }
}
