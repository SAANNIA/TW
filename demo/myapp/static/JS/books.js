"use strict";
// API Card
// API Name: Open Library
// Base URL: https://openlibrary.org
// Endpoint used: /search.json?q={termen}&limit=12
// HTTP method: GET
// Status code seen: 200
// Fields used: docs[].title, docs[].author_name, docs[].first_publish_year, docs[].cover_i, numFound
// Relevance: biblioteca de resurse a comunității: studenții caută cărți despre tehnologiile web pe care le învață (JavaScript, Django, CSS)
async function getJSON(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return (await response.json());
    }
    finally {
        clearTimeout(timer);
    }
}
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
function setStatus(text) {
    statusEl.textContent = text;
}
function createCard(book) {
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
function render(books) {
    resultsEl.innerHTML = "";
    if (books.length === 0) {
        setStatus("No results found.");
        return;
    }
    books.forEach((book) => resultsEl.appendChild(createCard(book)));
    setStatus(`Loaded ${books.length} result(s).`);
}
const searchForm = document.getElementById("searchForm");
const queryInput = document.getElementById("queryInput");
const searchBtn = document.getElementById("searchBtn");
function buildURL(query) {
    const BASE_URL = "https://openlibrary.org/search.json";
    return `${BASE_URL}?q=${encodeURIComponent(query)}&limit=12`;
}
async function search() {
    const query = queryInput.value.trim();
    if (!query) {
        setStatus("Please enter a search term.");
        return;
    }
    searchBtn.disabled = true;
    setStatus("Loading...");
    resultsEl.innerHTML = "";
    try {
        const data = await getJSON(buildURL(query));
        const books = data.docs;
        render(books);
        localStorage.setItem("lastQuery", query);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setStatus(`Load failed: ${msg}`);
    }
    finally {
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
