const searchBox = document.getElementById('searchBox');
const results = document.getElementById('results');

const API_URL_INIT = 'https://script.google.com/macros/s/AKfycbymzdVegL4S1SlGdJcrdOfIf_z5PLfh_m2rcGjEIW1Nngn3u5mY_xAH4fGj9ysu0m7M/exec?q=init';
const API_URL_LOOKUP = 'https://script.google.com/macros/s/AKfycbxNpU5jV2mDWYa0vBtkgej6youvvknTeocN2nP1-fb6GrUh-YY_vUDL6oY6AkC8EPMt/exec?q=';

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

function filterGuests(keyword) {
  const q = keyword.toLowerCase();
  return allGuests.filter(g =>
    g.name.toLowerCase().includes(q) || g.relationship.toLowerCase().includes(q)
  );
}

searchBox.addEventListener('input', async () => {
  const query = searchBox.value.trim().toLowerCase();
  results.innerHTML = '';

  if (query.length < 2) return;

  const matches = filterGuests(query);

  // If there's only one clear match, use the detailed tablemate view
  if (matches.length === 1) {
    try {
      const res = await fetch(API_URL_LOOKUP + encodeURIComponent(query));
      const data = await res.json();

      if (!data.you) {
        results.innerHTML = '<li>No match found.</li>';
        return;
      }

      const you = data.you;
      const tablemates = data.tablemates;

      const output = [
        `<li><strong>${you.name}</strong> (${you.relationship}) → Table ${you.table}</li>`,
        `<li style="margin-top: 1rem;"><em>You’ll be sitting with:</em></li>`,
        ...tablemates.map(g => `<li>${g.name}</li>`)
      ];

      results.innerHTML = output.join('');
    } catch (error) {
      console.error('Lookup fetch error:', error);
      results.innerHTML = '<li>Error fetching full table info.</li>';
    }
    return;
  }

  // Otherwise, just show matching results like before
  results.innerHTML = matches.length
    ? matches.map(item =>
        `<li><strong>${item.name}</strong> (${item.relationship}) → Table ${item.table}</li>`
      ).join('')
    : '<li>No match found.</li>';
});

loadGuests();
