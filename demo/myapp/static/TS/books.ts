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