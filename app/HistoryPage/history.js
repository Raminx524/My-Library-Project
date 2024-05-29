const historyUrl = "http://localhost:8001/history";
const prevNextDivElem = document.querySelector("#pagination");
const nextHandler = document.querySelector("#nextHanler");
const prevHandler = document.querySelector("#previousHanler");
let numPage = 1;
const tableElem = document.querySelector("table");
const loaderElem = document.querySelector(".loader");

async function showAllHistory() {
  loaderElem.style.display = "none";
  tableElem.innerHTML += `<thead>
    <th>ID</th>
    <th>OPERTAION</th>
    <th>TIME OF OPERATION</th>
    <th>ISNB</th>
    </thead><tbody></tbody>`;
  try {
    const res = await axios.get(`${historyUrl}?_page=${numPage}&_per_page=30`);
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
    paginationHanlders(res.data);
  } catch (error) {
    console.log(error);
  }
  prevNextDivElem.style.display = "flex";
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

function paginationHanlders(pageInfo) {
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
}
