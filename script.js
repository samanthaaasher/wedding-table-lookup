const searchBox = document.getElementById('searchBox');
const results = document.getElementById('results');
const API_URL = 'https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbzaadQbj7wx92LxhC0fgmyvxrOKmTdvGPALUti5QSA5QbONH-ScutxRlPS6NngIFi8E/exec/exec?q='; // Replace with your actual Google Script URL

searchBox.addEventListener('input', async () => {
  const query = searchBox.value;
  if (query.length < 2) {
    results.innerHTML = '';
    return;
  }

  const res = await fetch(API_URL + encodeURIComponent(query));
  const data = await res.json();

  results.innerHTML = data.length
    ? data.map(item => `<li>${item.name} → Table ${item.table}</li>`).join('')
    : '<li>No match found.</li>';
});
