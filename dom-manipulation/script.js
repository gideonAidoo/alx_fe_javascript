// Initial quotes array
// (Removed duplicate declaration; quotes will be loaded from localStorage or seeded below)

// DOM references
// (Removed duplicate declarations; see below for actual DOM references)

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




// --- Keys for Web Storage ---
const LS_KEY_QUOTES = 'dqg.quotes.v1';
const SS_KEY_LAST  = 'dqg.lastQuote.v1';

// --- State ---
let quotes = []; // will be loaded from localStorage or seeded

// --- DOM refs ---
const quoteDisplay   = document.getElementById('quoteDisplay');
const newQuoteBtn    = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');
const exportBtn      = document.getElementById('exportBtn');
const formMount      = document.getElementById('formMount');

// --- Utilities ---
const isValidQuote = (q) =>
  q && typeof q.text === 'string' && q.text.trim() &&
  typeof q.category === 'string' && q.category.trim();

function dedupeQuotes(list) {
  const seen = new Set();
  return list.filter(q => {
    const key = `${q.text.trim()}@@${q.category.trim().toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// --- Storage helpers ---
function loadQuotes() {
  try {
    const raw = localStorage.getItem(LS_KEY_QUOTES);
    if (!raw) return seedQuotes();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedQuotes();
    quotes = dedupeQuotes(parsed.filter(isValidQuote));
  } catch {
    seedQuotes();
  }
}

function saveQuotes() {
  localStorage.setItem(LS_KEY_QUOTES, JSON.stringify(quotes));
}

function seedQuotes() {
  quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "Simplicity is the soul of efficiency.", category: "Productivity" }
  ];
  saveQuotes();
}

// --- UI: categories, quote display, add form ---
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = categories
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");
}

function showRandomQuote() {
  const selected = categoryFilter.value;
  const pool = selected === 'all'
    ? quotes
    : quotes.filter(q => q.category === selected);

  if (pool.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const q = pool[Math.floor(Math.random() * pool.length)];
  quoteDisplay.textContent = `"${q.text}" — [${q.category}]`;

  // Remember last viewed quote for this session
  sessionStorage.setItem(SS_KEY_LAST, JSON.stringify(q));
}

function restoreLastViewedQuote() {
  try {
    const raw = sessionStorage.getItem(SS_KEY_LAST);
    if (!raw) return;
    const q = JSON.parse(raw);
    if (isValidQuote(q)) {
      quoteDisplay.textContent = `"${q.text}" — [${q.category}]`;
    }
  } catch {
    // ignore
  }
}

function createAddQuoteForm() {
  // Build form dynamically to meet the "advanced DOM" spec
  const wrapper = document.createElement('div');

  const h3 = document.createElement('h3');
  h3.textContent = 'Add a New Quote';

  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.id = 'newQuoteText';
  quoteInput.placeholder = 'Enter a new quote';
  quoteInput.autocomplete = 'off';

  const catInput = document.createElement('input');
  catInput.type = 'text';
  catInput.id = 'newQuoteCategory';
  catInput.placeholder = 'Enter quote category';
  catInput.autocomplete = 'off';

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', () => {
    const text = quoteInput.value.trim();
    const category = catInput.value.trim();
    if (!text || !category) {
      alert('Please fill out both fields.');
      return;
    }
    quotes.push({ text, category });
    quotes = dedupeQuotes(quotes);
    saveQuotes();
    populateCategories();
    quoteInput.value = '';
    catInput.value = '';
    alert('Quote added and saved!');
  });

  // Assemble
  wrapper.append(h3, quoteInput, catInput, addBtn);
  formMount.appendChild(wrapper);
}

// --- Export / Import ---
function exportToJson() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  const ts = new Date();
  const yyyy = ts.getFullYear();
  const mm = String(ts.getMonth() + 1).padStart(2, '0');
  const dd = String(ts.getDate()).padStart(2, '0');
  const hh = String(ts.getHours()).padStart(2, '0');
  const mi = String(ts.getMinutes()).padStart(2, '0');
  const ss = String(ts.getSeconds()).padStart(2, '0');

  a.href = url;
  a.download = `quotes-${yyyy}${mm}${dd}-${hh}${mi}${ss}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Matches the signature you provided: <input ... onchange="importFromJsonFile(event)" />
function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);

      // Accept either an array of quotes OR { quotes: [...] }
      const incoming = Array.isArray(parsed)
        ? parsed
        : (parsed && Array.isArray(parsed.quotes) ? parsed.quotes : null);

      if (!incoming) {
        alert('Invalid file format. Provide an array of {text, category} or { "quotes": [...] }.');
        return;
      }

      const cleaned = incoming.filter(isValidQuote).map(q => ({
        text: String(q.text).trim(),
        category: String(q.category).trim()
      }));

      if (cleaned.length === 0) {
        alert('No valid quotes found in file.');
        return;
      }

      quotes = dedupeQuotes([...quotes, ...cleaned]);
      saveQuotes();
      populateCategories();
      alert(`Imported ${cleaned.length} quote(s) successfully!`);
    } catch (err) {
      alert('Failed to read JSON: ' + err.message);
    } finally {
      // reset the file input so the same file can be selected again if needed
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

// --- Wire up events ---
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);
exportBtn.addEventListener('click', exportToJson);

// --- Init ---
loadQuotes();
populateCategories();
createAddQuoteForm();
restoreLastViewedQuote();
