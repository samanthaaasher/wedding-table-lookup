const searchBox = document.getElementById('searchBox');
const results = document.getElementById('results');

// ✅ Your working Google Apps Script endpoint:
const API_URL = 'https://script.google.com/macros/s/AKfycbw0ss6DjMLynci3EJSaoE7ju7gBzD1VrS2TS7QjXJFwqlcJS-10gj3MyW2N3D-Xo5k_/exec?q=';

searchBox.addEventListener('input', async () => {
  const query = searchBox.value.trim();
  if (query.length < 2) {
    results.innerHTML = '';
    return;
  }

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
