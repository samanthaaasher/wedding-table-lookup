const searchBox = document.getElementById('searchBox');
const results = document.getElementById('results');

const API_URL = 'https://script.google.com/macros/s/AKfycbwiQ00SH6MFJH1kJVQ3r3t7IaDhg3hpLoeSmkWM8bpI9zSyh2RJwgd3xUyTRoH80HcE/exec?q=';

let controller;

searchBox.addEventListener('input', async () => {
  const query = searchBox.value.trim().toLowerCase();

  // Always clear results first
  results.innerHTML = '';

  if (query.length < 2) return;

  // Cancel previous request if still pending
  if (controller) controller.abort();
  controller = new AbortController();

  try {
    const res = await fetch(API_URL + encodeURIComponent(query), {
      signal: controller.signal
    });

    if (!res.ok) throw new Error('Fetch failed');

    const data = await res.json();

    if (data.length === 0) {
      results.innerHTML = '<li>No match found. Try another name or keyword.</li>';
    } else {
      results.innerHTML = '';
      data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.name}</strong> (${item.relationship}) → Table ${item.table}`;
        results.appendChild(li);
      });
    }
  } catch (error) {
    if (error.name === 'AbortError') return; // silently ignore aborted fetches
    console.error('Error:', error);
    results.innerHTML = '<li>Error fetching data. Please try again later.</li>';
  }
});
