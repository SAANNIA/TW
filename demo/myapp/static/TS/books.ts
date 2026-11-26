// API Card
// API Name: Open Library
// Base URL: https://openlibrary.org
// Endpoint used: /search.json?q={termen}&limit=12
// HTTP method: GET
// Status code seen: 200
// Fields used: docs[].title, docs[].author_name, docs[].first_publish_year, docs[].cover_i, numFound
// Relevance: biblioteca de resurse a comunității: studenții caută cărți despre tehnologiile web pe care le învață (JavaScript, Django, CSS)

interface Book {
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
}

interface BookSearchResponse {
    numFound: number;
    docs: Book[];
}


async function getJSON<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
  
    try {
      const response = await fetch(url, { signal: controller.signal });
  
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
  
      return (await response.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }

  
const statusEl = document.getElementById("status") as HTMLParagraphElement;
const resultsEl = document.getElementById("results") as HTMLDivElement;

function setStatus(text: string): void {
  statusEl.textContent = text;
}

function createCard(book: Book): HTMLElement {
  const card = document.createElement("article");
  card.className = "card";

  if (book.cover_i !== undefined) {
    const cover = document.createElement("img");
    cover.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    cover.alt = `Coperta cărții ${book.title}`;
    cover.loading = "lazy";
    card.appendChild(cover);
  }

  const title = document.createElement("h3");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.textContent = book.author_name ? book.author_name.join(", ") : "Autor necunoscut";

  const year = document.createElement("p");
  year.textContent = book.first_publish_year
    ? `Prima ediție: ${book.first_publish_year}`
    : "An necunoscut";

  card.appendChild(title);
  card.appendChild(author);
  card.appendChild(year);
  return card;
}

function render(books: Book[]): void {
  resultsEl.innerHTML = "";

  if (books.length === 0) {
    setStatus("No results found.");
    return;
  }

  books.forEach((book) => resultsEl.appendChild(createCard(book)));
  setStatus(`Loaded ${books.length} result(s).`);
}