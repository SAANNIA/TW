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
let shownBooks: Book[] = [];

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
  shownBooks = books;
  resultsEl.innerHTML = "";

  if (books.length === 0) {
    setStatus("No results found.");
    return;
  }

  books.forEach((book) => resultsEl.appendChild(createCard(book)));
  setStatus(`Loaded ${books.length} result(s).`);
}


const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const queryInput = document.getElementById("queryInput") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;

function buildURL(query: string): string {
  const BASE_URL = "https://openlibrary.org/search.json";
  return `${BASE_URL}?q=${encodeURIComponent(query)}&limit=12`;
}

async function search(): Promise<void> {
  const query = queryInput.value.trim();
  if (!query) {
    setStatus("Please enter a search term.");
    return;
  }

  searchBtn.disabled = true;
  setStatus("Loading...");
  resultsEl.innerHTML = "";

  try {
    const data = await getJSON<BookSearchResponse>(buildURL(query));
    const books: Book[] = data.docs;
    render(books);
    localStorage.setItem("lastQuery", query);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    setStatus(`Load failed: ${msg}`);
  } finally {
    searchBtn.disabled = false;
  }
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  search();
}); 


window.addEventListener("DOMContentLoaded", () => {
    const lastQuery = localStorage.getItem("lastQuery");
    if (lastQuery) {
      queryInput.value = lastQuery;
      search();
    }
  });

  
function csvCell(value: string): string {
    const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
    return `"${safe.replace(/"/g, '""')}"`;
  }
  
  function exportCSV(books: Book[]): void {
    if (books.length === 0) {
      setStatus("Nu există rezultate de exportat.");
      return;
    }
  
    const header = ["Titlu", "Autori", "An"];
    const rows = books.map((book) => [
      book.title,
      book.author_name ? book.author_name.join("; ") : "",
      book.first_publish_year !== undefined ? String(book.first_publish_year) : "",
    ]);
  
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement("a");
    link.href = url;
    link.download = "carti.csv";
    link.click();
    URL.revokeObjectURL(url);
  }
  
  const exportBtn = document.getElementById("exportBtn") as HTMLButtonElement;
  exportBtn.addEventListener("click", () => exportCSV(shownBooks));