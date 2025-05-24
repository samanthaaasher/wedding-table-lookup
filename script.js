const searchBox = document.getElementById('searchBox');
const results = document.getElementById('results');

const API_URL_INIT = 'https://script.google.com/macros/s/AKfycbxP1IDGXm88hdCj8YtXdEOOlAhjGQh-aM2FtKoDTNKDUKINX33ysh2rstHXpMPoIBOU/exec?q=init';
const API_URL_LOOKUP = 'https://script.google.com/macros/s/AKfycbxP1IDGXm88hdCj8YtXdEOOlAhjGQh-aM2FtKoDTNKDUKINX33ysh2rstHXpMPoIBOU/exec?q=';

let allGuests = [];

async function loadGuests() {
  try {
    const res = await fetch(API_URL_INIT);
    allGuests = await res.json();
  } catch (error) {
    console.error('Failed to load guest list:', error);
    results.innerHTML = '<li>Unable to load guest list. Please try again later.</li>';
  }
}

function filterGuests(query) {
  const keyword = query.toLowerCase();
  return allGuests.filter(g =>
    g.name.toLowerCase().includes(keyword) || g.relationship.toLowerCase().includes(keyword)
  );
}

searchBox.addEventListener('input', async () => {
  const query = searchBox.value.trim().toLowerCase();
  results.innerHTML = '';

  if (query.length < 2) return;

  const matches = filterGuests(query);

  if (matches.length === 1) {
    try {
      const res = await fetch(API_URL_LOOKUP + encodeURIComponent(query));
      const data = await res.json();

      if (data.you) {
        const output = [
          `<li><strong>${data.you.name}</strong> (${data.you.relationship}) → Table ${data.you.table}</li>`,
          `<li style="margin-top:1rem;"><em>You’ll be sitting with:</em></li>`,
          ...data.tablemates.map(g => `<li>${g.name}</li>`)
        ];
        results.innerHTML = output.join('');
        return;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      results.innerHTML = '<li>Error fetching tablemates.</li>';
      return;
    }
  }

  results.innerHTML = matches.length
    ? matches.map(item =>
        `<li><strong>${item.name}</strong> (${item.relationship}) → Table ${item.table}</li>`
      ).join('')
    : '<li>No match found.</li>';
});

loadGuests();
