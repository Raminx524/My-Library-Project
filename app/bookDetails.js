const baseUrl = "http://localhost:8001/books";
const urlObj = new URL(window.location.href);
const params = new URLSearchParams(urlObj.searchParams);
const id = params.get("id");
console.log(id);
