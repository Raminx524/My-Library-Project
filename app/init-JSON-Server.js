//* RUN JSON-SERVER: "npx json-server --watch ../data/data.json --port 8001"

async function orderBook(searchParam) {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${searchParam}&key=AIzaSyAP7XtWvApoZN9XefzBfMtuHo9Qb9dOPWo&maxResults=40`
    );
    const booksArr = res.data.items;
    booksArr.forEach((bookInfo) => {
      const book = bookInfo.volumeInfo;
      console.log(book);
      const newBook = {
        title: book.title,
        authors: book.authors,
        numPages: book.pageCount,
        description: book.description,
        image: book.imageLinks.smallThumbnail
          ? book.imageLinks.smallThumbnail
          : undefined,
        copies: 1,
        categories: book.categories,
        ISBN: book.industryIdentifiers
          ? book.industryIdentifiers[0]
          : undefined,
      };
      postNewBook(newBook);
    });
  } catch (err) {
    console.log(err);
  }
}
// orderBook("bikes");

async function postNewBook(e) {
  const booksUrl = "http://localhost:8001/books";
  try {
    console.log(e);
    const res = await axios.post(booksUrl, e);
  } catch (error) {
    console.log(error);
  }
}
