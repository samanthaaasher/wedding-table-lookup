const searchBox = document.getElementById('searchBox');
const results = document.getElementById('results');

const API_URL = 'https://script.google.com/macros/s/AKfycbwiQ00SH6MFJH1kJVQ3r3t7IaDhg3hpLoeSmkWM8bpI9zSyh2RJwgd3xUyTRoH80HcE/exec?q=';

searchBox.addEventListener('input', async () => {
  const query = searchBox.value.trim();

  // Always clear previous results before showing new ones
  results.innerHTML = '';

  if (query.length < 2) return;

  try {
    const res = await fetch(API_URL + encodeURIComponent(query));
    const data = await res.json();

    results.innerHTML = data.length
      ? data.map(item =>
          `<li><strong>${item.name}</strong> (${item.relationship}) → Table ${item.table}</li>`
        ).join('')
      : '<li>No match found. Try another name or keyword!</li>';
  } catch (error) {
    results.innerHTML = '<li>Error fetching data. Please try again later.</li>';
    console.error('Fetch error:', error);
  }
});
