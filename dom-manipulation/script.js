// Initial quotes array is now loaded from localStorage or uses default below.

// DOM references
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");

// Populate category dropdown from quotes array
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories
    .map(cat => `<option value="${cat}">${cat}</option>`)
    .join("");
}

// Show a random quote
function showRandomQuote() {
  let filteredQuotes = quotes;
  const selectedCategory = categoryFilter.value;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — [${quote.category}]`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });

    // Update categories dynamically
    populateCategories();

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("Quote added successfully!");
  } else {
    alert("Please fill out both fields.");
  }
}

// Dynamically create the Add Quote Form
function createAddQuoteForm() {
  const formSection = document.createElement("div");
  formSection.className = "form-section";

  const heading = document.createElement("h3");
  heading.textContent = "Add a New Quote";

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  // Append everything to form section
  formSection.appendChild(heading);
  formSection.appendChild(quoteInput);
  formSection.appendChild(categoryInput);
  formSection.appendChild(addBtn);

  // Append form to body (or another container)
  document.body.appendChild(formSection);
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", showRandomQuote);

// Initial setup
populateCategories();
createAddQuoteForm();

// ====== QUOTES STORAGE ======
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "JavaScript is the language of the web.", category: "Programming" }
];

// ====== DOM ELEMENTS ======
const importFile = document.getElementById('importFile');

// ====== INITIALIZATION ======
showRandomQuote();
populateCategoryFilter();

// ====== SHOW RANDOM QUOTE ======
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const { text, category } = quotes[randomIndex];
  quoteDisplay.textContent = `"${text}" — ${category}`;
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quotes[randomIndex]));
}

// ====== ADD NEW QUOTE ======
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert('Please enter both quote text and category.');
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  textInput.value = '';
  categoryInput.value = '';
  populateCategoryFilter();
  alert('Quote added successfully!');
}

// ====== SAVE TO LOCAL STORAGE ======
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// ====== FILTER QUOTES BY CATEGORY ======
function filterQuote(category) {
  if (category === 'All') {
    displayFilteredQuotes(quotes);
  } else {
    const filtered = quotes.filter(q => q.category.toLowerCase() === category.toLowerCase());
    displayFilteredQuotes(filtered);
  }
}

function displayFilteredQuotes(list) {
  if (list.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }
  const { text, category } = list[Math.floor(Math.random() * list.length)];
  quoteDisplay.textContent = `"${text}" — ${category}`;
}

// ====== POPULATE CATEGORY FILTER ======
function populateCategoryFilter() {
  let categories = [...new Set(quotes.map(q => q.category))];
  const filterSelect = document.getElementById('categoryFilter');
  if (!filterSelect) return;

  filterSelect.innerHTML = `<option value="All">All</option>`;
  categories.forEach(cat => {
    filterSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

// ====== EXPORT QUOTES TO JSON ======
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ====== IMPORT QUOTES FROM JSON FILE ======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategoryFilter();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch {
      alert('Error parsing JSON file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ====== EVENT LISTENERS ======
if (newQuoteBtn) newQuoteBtn.addEventListener('click', showRandomQuote);
if (importFile) importFile.addEventListener('change', importFromJsonFile);

/* Removed duplicate declaration of quotes */

// Load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    document.getElementById('quoteDisplay').textContent = 'No quotes available.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById('quoteDisplay').textContent = `"${quote.text}" - ${quote.category}`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added!');
  } else {
    alert('Please fill in both fields.');
  }
}

// Simulate fetching from server
async function fetchQuotesFromServer() {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const data = await res.json();
    // Simulate quotes from server
    const serverQuotes = data.map(item => ({
      text: item.title,
      category: 'Server'
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error('Error fetching from server:', error);
  }
}

// Conflict resolution: server takes precedence
function resolveConflicts(serverQuotes) {
  let changesMade = false;

  serverQuotes.forEach(serverQuote => {
    const exists = quotes.some(q => q.text === serverQuote.text && q.category === serverQuote.category);
    if (!exists) {
      quotes.push(serverQuote);
      changesMade = true;
    }
  });

  if (changesMade) {
    saveQuotes();
    alert('Quotes updated from server.');
  }
}

// Periodically sync every 30 seconds
setInterval(fetchQuotesFromServer, 30000);

// Initialize app
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
loadQuotes();
showRandomQuote();
