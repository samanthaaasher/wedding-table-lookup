const searchBox = document.getElementById('searchBox');
const results = document.getElementById('results');

// ✅ NEW working Apps Script URL
const API_URL = 'https://script.google.com/macros/s/AKfycbxP1IDGXm88hdCj8YtXdEOOlAhjGQh-aM2FtKoDTNKDUKINX33ysh2rstHXpMPoIBOU/exec?q=';

searchBox.addEventListener('input', async () => {
  const query = searchBox.value.trim().toLowerCase();
  results.innerHTML = '';

  if (query.length < 2) return;

  try {
    const res = await fetch(API_URL + encodeURIComponent(query));
    const data = await res.json();

    // If result includes "you", show tablemates
    if (data.you) {
      const you = data.you;
      const tablemates = data.tablemates;

      const output = [
        `<li><strong>${you.name}</strong> (${you.relationship}) → Table ${you.table}</li>`,
        `<li style="margin-top:1rem;"><em>You’ll be sitting with:</em></li>`,
        ...tablemates.map(g => `<li>${g.name}</li>`)
      ];

      results.innerHTML = output.join('');
    } else {
      // Show multiple matches or fallback
      results.innerHTML = data.length
        ? data.map(item =>
            `<li><strong>${item.name}</strong> (${item.relationship}) → Table ${item.table}</li>`
          ).join('')
        : '<li>No match found.</li>';
    }

  } catch (error) {
    console.error('Fetch error:', error);
    results.innerHTML = '<li>Error fetching data. Please try again later.</li>';
  }
});
