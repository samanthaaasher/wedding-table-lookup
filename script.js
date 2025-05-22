const searchBox = document.getElementById('searchBox');
const results = document.getElementById('results');

// ✅ Your actual Google Apps Script URL with ?q=init
const API_URL = 'https://script.google.com/macros/s/AKfycbymzdVegL4S1SlGdJcrdOfIf_z5PLfh_m2rcGjEIW1Nngn3u5mY_xAH4fGj9ysu0m7M/exec?q=init';

let allGuests = [];

// Fetch full guest list once
async function loadGuests() {
  try {
    const res = await fetch(API_URL);
    allGuests = await res.json();
  } catch (error) {
    console.error('Failed to load guest list:', error);
    results.innerHTML = '<li>Unable to load guest list. Please try again later.</li>';
  }
}

// Search guest list locally
function filterGuests(keyword) {
  const q = keyword.toLowerCase();
  return allGuests.filter(g =>
    g.name.toLowerCase().includes(q) || g.relationship.toLowerCase().includes(q)
  );
}

// Handle search input
searchBox.addEventListener('input', () => {
  const query = searchBox.value.trim().toLowerCase();
  results.innerHTML = '';

  if (query.length < 2) return;

  const matches = filterGuests(query);

  results.innerHTML = matches.length
    ? matches.map(item =>
        `<li><strong>${item.name}</strong> (${item.relationship}) → Table ${item.table}</li>`
      ).join('')
    : '<li>No match found.</li>';
});

// Load guest list on page load
loadGuests();
